---
layout: post
title: "Hunting My Hand-Crafted Induction Head in Real Models"
date: 2026-07-17 09:33:00 +0100
categories: [mechanistic-interpretability, machine-learning, learning-in-public]
tags: [attention, transformers, induction-heads, qkv, in-context-learning, k-composition, interpretability, gpt2, pythia]
excerpt: "Last time I hand-crafted an induction head, and I ended on a question I could not answer from inside the toy: if I go looking in a real trained model, will I find the circuit I just built?"
---

[Last time](https://barmag.github.io/2026/07/15/i-didnt-understand-qkv-so-i-hand-crafted-an-induction-head/) I hand-crafted an induction head, and I ended on a question I could not answer from inside the toy: if I go looking in a real trained model, will I find the circuit I just built?

The toy was four jobs in eight matrices. A `shift` matrix that turns "I am position `i`" into the question "who sits at position `i-1`?". A key that matches on token identity. The K-composition wiring between the two layers, where layer 1's output becomes layer 2's key. And a value that copies the matched token. Four targets, so the hunt had four parts, and I ran it on two models: GPT-2 small, which stores position in the residual stream the way my toy does, and Pythia-160m, which does not.

The wiring is in both models, and it is the cleanest find of the four. The token matching is there for most tokens. The copying is strong in GPT-2 and diluted in Pythia. And the shift matrix, the piece I built the whole toy around, does not exist in Pythia. Not hidden in the weights where I failed to find it; it cannot be constructed from Pythia's weights at all. Pythia scores 0.96 at the behavior anyway.

That last result changed how I think about the toy, so I will explain it first and then walk the rest of the hunt.

## Why the matrix can't exist

The toy worked because I gave every position a `where I am` block in the residual stream. GPT-2 small does the grown-up version of the same thing: it has a learned position embedding, `W_pos`, added into the residual stream at the start. Position is data, and it flows through the network like any other information. That means I can multiply it through a head's query and key matrices, `W_pos · W_Q · W_K^T · W_pos^T`, and get a well-formed position-by-position matrix that answers "from position alone, where does this head look?". The shift question is askable, matrix by matrix.

Pythia uses rotary position embeddings (RoPE), and RoPE never writes position anywhere. It reaches inside the attention computation and rotates the query and key vectors by an angle that depends on their positions, so that their dot product ends up depending on their relative distance. Position is not data in the residual stream; it is a transformation applied in passing. There is no `W_pos` to multiply through, and the matrix I inspected in GPT-2 cannot be built for Pythia. The question itself is malformed.

So for Pythia the only honest test is behavioral. I fed it sequences and measured how much attention each head puts on the token directly to its left. Its best head, L3H2, holds 0.960 to 0.962 across three disjoint random-token draws, and 0.811 on natural text. My toy's stripe scored 0.9996, but my toy had a matrix to point at. Pythia has the behavior with no matrix at all.

***

## The hunt

Rewind to the start. To look for a circuit I needed specimens, and the standard trick for catching induction heads is simple, and documented in Anthropic interpretability papers: take 50 random tokens, repeat them, and watch. Random tokens have no grammar and no meaning, so nothing in the model's language machinery helps. The only way to predict the second half is to notice it is a copy of the first. That isolates induction from everything else the model knows.

On a batch of these sequences I scored every head in both models on two things. Previous-token score: what fraction of your attention lands on the token directly to your left? Induction score: standing in the second copy at some token, what fraction lands on the token that followed your first occurrence, which is exactly where my toy's layer 2 looked?

![Head-score heatmaps for GPT-2 small and Pythia-160m: one bright star per job per model]({{ site.url }}/assets/media/wild_head_score_heatmaps.png)

Each model has a clear winner for each job. GPT-2: L4H11 is the previous-token head at 0.989, L5H5 the induction head at 0.930. Pythia: L3H2 at 0.962 and L4H6 at 0.987. In both models the previous-token head sits one layer below the induction head, the same stacking my toy needed, because layer 1 has to write before layer 2 can read.

Two caveats before I get attached to these numbers. My toy scored close to 1.0 on both jobs by construction; the trained heads land between 0.93 and 0.99. And the winners are not alone. GPT-2's L6H9 scores 0.917 on induction, within 0.013 of the winner, so "the" induction head is really the top of a small cluster. Everything below is one specimen per job, chosen by argmax, and that narrowing is my choice, not a fact about the model.

## The stripe that undersold

GPT-2 is the model where the shift question can be asked, so I asked it. Take the first 64 positions of `W_pos`, push them through L4H11's query and key, apply the causal mask and softmax, and look at attention computed from position alone.

![GPT-2 L4H11 attention from position alone: a visible but faint subdiagonal stripe]({{ site.url }}/assets/media/wild_gpt2_positional_stripe.png)

The stripe is there, one step below the diagonal, just like my toy's layer 1 pattern. I found my shift matrix in a trained model.

Except the stripe carries 0.061 of the attention mass on offset -1. My toy's carried 0.9996, and this same head, run behaviorally on actual tokens, scores 0.989. So the positional QK matrix, the object that does exist in GPT-2 and is the closest cousin of my hand-written shift, explains almost none of the behavior it participates in. The rest comes from everything this matrix view folds away: token content, LayerNorm, the interactions between the two. I went looking for my shift and found a watermark of it.

***

## The wiring is real

The part of the toy I cared most about was the composition. `W_O1` writes the previous token into the residual stream, and `W_K2` reads exactly that block back. In the toy this was my database analogy finally working: layer 1 runs its `update`, and layer 2's `select` has a column to match on. The Anthropic papers call it K-composition, and I wanted to know if trained models actually wire it this way.

There is a weight-space score for this: how strongly does an earlier head's output matrix align with what the induction head's key matrix reads? I computed it for every head in every layer below the induction head, 60 candidates in GPT-2 and 48 in Pythia, and asked where the previous-token head ranks.

![K-composition into each model's induction head: the prev-token head, in red, is rank 1 in both models]({{ site.url }}/assets/media/wild_kcomposition_bars.png)

It ranks first in both models, 1 of 60 and 1 of 48, and nothing else comes close (0.097 in GPT-2 against a field of much smaller scores, 0.147 in Pythia). What makes this satisfying is that the two measurements have nothing to do with each other. I found the previous-token head by watching attention patterns on repeated tokens, and I found the strongest key-feeder by reading weight matrices. They agree on the same head, in both models. That is the toy's wiring diagram showing up in trained weights.

Does the composed circuit actually match token identity, the way my layer 2 asked "who has banana in their before-me block?"? I routed a token's embedding through the previous-token head's output circuit, into the induction head's key, and checked whether token X's query scores highest against a key built from token X. For 1,000 sampled tokens the diagonal is the argmax for 56.3% in GPT-2 and 89.9% in Pythia, with median rank 1 out of 1,000 in both. Routed through the worst previous-token head in the same layer instead, the match collapses to 0.1% and 0.0%. The identity match is not something any head produces; it is created by composing with that specific head.

## Does it copy?

One toy job left. My `W_V2 = I×4` handed over the matched position's own token, unchanged. Do the real induction heads copy?

The test, from Anthropic's [mathematical framework paper](https://transformer-circuits.pub/2021/framework/index.html), runs the head's full vocabulary-to-vocabulary circuit: embed every token, push it through the head's value and output matrices, unembed. Call it `C`. Entry `C[i,i]` has a direct meaning: if the head attends to token `i`, how much does that raise the logit for predicting token `i` next? The diagonal is self-promotion, which is literal copying. Everything off the diagonal is the head doing something else with what it saw.

The verdict comes from `C`'s eigenvalues, and the logic took me two steps to accept. First, the trace: the sum of the eigenvalues equals the sum of the diagonal, exactly. So the eigenvalues collectively inherit the copying signal, and a mostly self-promoting circuit forces a positive-leaning spectrum. Second, each individual eigenvalue is pinned, by Gershgorin's circle theorem, inside a disc centered on some diagonal entry with radius equal to that row's off-diagonal mass. A dedicated copier, big positive diagonal and small interference, traps every disc on the positive side of zero. My toy's `C` was `4I`: every disc collapses to the single point +4, every eigenvalue is +4, copying score exactly 1.0 by construction. A head that spends its dimensions on other work lets the discs stretch across zero, and eigenvalues escape to the negative side.

The score compresses this to one number: the sum of the real parts over the sum of the magnitudes, running from +1 for a pure copier, through 0 for no net copying, to -1 for a head that actively suppresses what it saw. And one trick makes it exact rather than sampled: `C` is 50,000 by 50,000, but its rank is at most 64, the head's bottleneck, and the nonzero eigenvalues of a matrix product survive reversing the order of the product. A 64 by 64 multiplication yields the full spectrum.

![Full-OV eigenvalue spectra: GPT-2's cloud leans clearly positive, Pythia's straddles zero]({{ site.url }}/assets/media/wild_ov_eigenvalue_scatters.png)

GPT-2's L5H5 scores **0.816** with 81% of eigenvalues positive. Over four-fifths of the spectrum's weight points toward "attended token → itself", a strong copy job.

Pythia's L4H6 scores **0.423** with 69% positive, and the gap between those two numbers is worth sitting with. If 69% of the eigenvalues are positive, why is the score down at 0.423? Because the score weighs by magnitude, and the parts of Pythia's spectrum that are not doing copying carry serious weight: the negative third, plus everything sitting far off the real axis, which is rotation rather than self-promotion. A head can have most of its eigenvalues on the right side of zero and still spend much of its capacity on other work. What strikes me is that this same head posted the best induction attention score in either model, 0.987, and the cleanest identity match, 89.9%. It finds the right token more reliably than GPT-2's head does, then does a messier job of purely copying it. Nothing in training pays a head to stay as clean as the matrices I typed.

***

## What I actually found

So, smeared or reproduced? Both, and the split is worth stating carefully.

The wiring reproduced best. K-composition, the thing I built the whole toy to understand, is rank 1 of 60 in GPT-2 and rank 1 of 48 in Pythia. One head's output becoming another head's key is not a toy fantasy; it is how both trained models do it. The matching reproduced partially: composition creates a genuine token-identity match, but for 56.3% and 89.9% of tokens rather than the toy's 100%. The copying reproduced unevenly: GPT-2's 0.816 is a strong echo of my `I×4`, Pythia's 0.423 is real but diluted. And the shift matrix did not reproduce at all. In Pythia it cannot be constructed, and in GPT-2 it exists but carries 0.061 of the behavior it names. The behavior was the thing training preserved. The matrix was just the way I happened to spell that behavior when I wrote it by hand, and one of these two architectures does not bother spelling it that way.

Some honesty about the microscope. Every composed-weight computation above folds or ignores LayerNorm between the layers, drops the attention biases, and reads Pythia's Q and K as static matrices when RoPE actually rotates them in flight. Everything is measured on one specimen head per job per model. And all of it is correlational: a matrix looks right, a score is high, a rank is 1. None of that proves these heads cause the behavior.

The way to prove it is to break it. Knock out L4H11 and L5H5, or L3H2 and L4H6, and watch whether the induction score collapses. If the circuit I found is the circuit, the behavior should die with it. That is the next notebook.

The full notebook, with every number above reproducible from a seed, is [here](https://github.com/barmag/fanous-llm-lens/blob/main/notebooks/in_context_learning/induction_heads_in_the_wild.ipynb).
