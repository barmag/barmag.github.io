---
layout: post
title: "I Didn't Understand QKV, So I Hand-Crafted an Induction Head"
date: 2026-07-15 00:00:00 +0200
categories: [mechanistic-interpretability, machine-learning, learning-in-public]
tags: [attention, transformers, induction-heads, qkv, numpy, in-context-learning, k-composition, attention-sink, interpretability]
excerpt: "I understood select name from Person where k=42, and I still could not map it to Q, K, V. So I built a 15-dimensional toy transformer by hand, two attention heads, eight matrices, no training, and watched it predict the next token correctly 87% of the time."
---

There is a particular kind of exhaustion that comes from staring at an abstraction until it loses all meaning.

I had been reading paper after paper on attention mechanisms. The literature is a chorus of polished explanations. Queries, keys, values. A softmax. A neat metaphor about a librarian matching book requests. I read it, and nodded. The DB analogy says Q is what I am looking for, K is the index, and V is the result. Yet, I understand `select name from Person where k=42`, and I failed to map it to QKV.

But standing in the shower, I realized I needed to write a QKV and see it in action. Doing that with 512 embedding dimensions and 12 layers of multi-head attention with normalization and MLPs is almost impossible to do by hand. I took inspiration from 3blue1brown videos to simplify the dimensions. I limited the vocabulary to 5 and the embedding to 15; wide enough to store the token, position, and attention info in their own buckets.

The next step was to select the logic to replicate, and the perfect candidate was the induction pattern. It is so simple, yet so powerful. In its simplest form, it just repeats a pattern `AB..A->B`, but an Anthropic paper confirmed it is the basis of how models learn in context.

***

So here is the build. I want the model to notice when a token repeats, look back at what followed the first occurrence, and predict that.

![The induction pattern: the second banana looks back, finds the first banana, and predicts what followed it]({{ site.url }}/assets/media/hook_induction_pattern.png)

It takes two attention heads stacked in sequence, working in the 15-dimensional space from above. Three blocks of five: `what I am`, `before me`, and `where I am`.

![Anatomy of one residual-stream vector: what I am, what came before me, where I am]({{ site.url }}/assets/media/residual_vector_anatomy.png)

Every position starts knowing what it is and where it is. The `before me` block starts empty. Filling it is layer 1's whole job.

## Layer 1: The Shift

Layer 1 copies each position's left neighbor into its `before me` block. That is all it does.

```
                     what I am   before me   where I am
W_Q1 (query)           zeros       zeros     shift × 3
W_K1 (key)             zeros       zeros       I × 3
W_V1 (value)             I         zeros       zeros
W_O1 (write-back)      zeros         I         zeros
```

Notice that the query and key have nothing in the token block. Layer 1 works on position alone. The query holds `shift`, a 5×5 permutation matrix that takes the one-hot for position `i` and returns the one-hot for position `i-1`. So when position `i` asks its question, the question is literally "who sits at position `i-1`?". The key answers with plain positions, the match is exact, the value hands over the matched token, and `W_O1` writes it into the middle block.

![Layer 1 attention pattern: a clean stripe one step below the diagonal, with position 1 parked on the BOS token]({{ site.url }}/assets/media/layer1_attention_pattern.png)

The ×3 scaling exists because softmax is soft. Winning the raw score is not enough; without scaling, attention leaks to every other position. Multiply by 3 and the winner takes 99.96% of the probability mass.

![Residual stream before and after layer 1: the purple "what came before me" block fills with a shifted-down copy of the "what I am" block]({{ site.url }}/assets/media/residual_stream_before_after_layer1.png)

Position 0 is the awkward one. There is no position `-1` for `shift` to point at, so its query comes out as all zeros, and the causal mask leaves it nothing to attend to except itself. Whatever sits at position 0 will record itself as its own predecessor. If that were a real token, layer 2 would inherit the lie. So position 0 holds `<s>`, the beginning-of-sequence token: an empty placeholder that absorbs the forced self-attention where it can do no harm. I had read that BOS tokens act as attention sinks in real models. Needing one in a 15-dimensional toy made the reason obvious.

![Without a BOS token the first real token would falsely record itself as its own predecessor; with one, the same forced self-attention lands on an empty placeholder instead]({{ site.url }}/assets/media/bos_attention_sink.png)

## Layer 2: The Projection

Layer 2 ignores position completely and compares tokens.

```
                     what I am   before me   where I am
W_Q2 (query)           I × 2       zeros       zeros
W_K2 (key)              zeros       I × 2       zeros
W_V2 (value)            I × 4       zeros       zeros
W_O2 (write-back)       I           zeros       zeros
```

The query reads the `what I am` block. The key reads `before me`. Position 4 holds banana, so its question is "who has banana in their before-me block?". Position 2 does, because layer 1 put it there one layer ago. The match fires, the value hands over position 2's own token, apple, and that becomes the prediction.

This is also where the database analogy finally meant something to me. Attention is not just a select; it is a select and an update. Layer 1 already ran `update positions set before_me = left_neighbor.what_i_am`. Layer 2 now runs the query I failed to map at the start: `select what_i_am from positions where before_me = 'banana'`. And `W_O2` writes the result back into the table, the next update. The analogy was never wrong. It just doesn't click until you watch the column get written first.

![Layer 2 attention: a sharp match at the second banana, diffuse guessing everywhere earlier]({{ site.url }}/assets/media/layer2_attention_pattern.png)

The scaling story repeats here. Unscaled Q and K leak attention across positions, and an unscaled V ties with what is already sitting in the residual stream instead of beating it. The ×2 and ×4 clear both problems.

![Final prediction at position 4: 87% apple]({{ site.url }}/assets/media/layer2_prediction.png)

## The Code

The whole thing is one NumPy file with no training loop:

```python
import numpy as np

VOCAB = ["apple", "banana", "cherry", "kiwi", "lemon"]
TOK = {t: i for i, t in enumerate(VOCAB)}
D_MODEL = 15  # 5 "what I am" + 5 "before me" + 5 "where I am"

def embed(seq):
    x = np.zeros((len(seq), D_MODEL))
    for i, tok in enumerate(seq):
        if tok is not None:
            x[i, TOK[tok]] = 1.0   # what I am
        x[i, 10 + i] = 1.0         # where I am
    return x

def attention(x, w_q, w_k, w_v, w_o):
    q, k, v = x @ w_q.T, x @ w_k.T, x @ w_v.T
    scores = q @ k.T
    scores[np.triu_indices(len(x), k=1)] = -np.inf   # causal mask
    scores -= scores.max(axis=1, keepdims=True)
    attn = np.exp(scores)
    attn /= attn.sum(axis=1, keepdims=True)
    return x + (attn @ v) @ w_o.T, attn

# --- Layer 1: previous-token head ---
shift = np.zeros((5, 5))
for i in range(1, 5):
    shift[i - 1, i] = 1.0   # onehot(i) -> onehot(i-1)

W_Q1 = np.hstack([np.zeros((5, 10)), shift * 3])
W_K1 = np.hstack([np.zeros((5, 10)), np.eye(5) * 3])
W_V1 = np.hstack([np.eye(5), np.zeros((5, 10))])
W_O1 = np.vstack([np.zeros((5, 5)), np.eye(5), np.zeros((5, 5))])

# --- Layer 2: induction head ---
W_Q2 = np.hstack([np.eye(5) * 2, np.zeros((5, 10))])
W_K2 = np.hstack([np.zeros((5, 5)), np.eye(5) * 2, np.zeros((5, 5))])
W_V2 = np.hstack([np.eye(5) * 4, np.zeros((5, 10))])
W_O2 = np.vstack([np.eye(5), np.zeros((10, 5))])

def predict_next(seq):
    x = embed(seq)
    x, _ = attention(x, W_Q1, W_K1, W_V1, W_O1)
    x, attn2 = attention(x, W_Q2, W_K2, W_V2, W_O2)
    logits = x[-1, :5]
    probs = np.exp(logits) / np.exp(logits).sum()
    return dict(zip(VOCAB, probs.round(4))), attn2[-1].round(4)

if __name__ == "__main__":
    for seq in [[None, "banana", "apple", "cherry", "banana"],
                [None, "apple", "banana", "cherry", "apple"]]:
        probs, attn = predict_next(seq)
        top = max(probs, key=probs.get)
        shown = " ".join(t if t else "<s>" for t in seq)
        print(f"{shown} -> {top} ({probs[top]:.1%})")
```

```
<s> banana apple cherry banana -> apple (87.0%)
<s> apple banana cherry apple -> banana (87.0%)
```

***

Those two printed lines are in-context learning. The model saw `banana` once, saw what followed it, and used that the next time `banana` appeared. Nothing was trained. The Anthropic paper calls this mechanism K-composition, one head's output becoming another head's key, and they watched induction heads form during training as a visible phase change.

![How the two layers connect: layer 1 writes the "before me" block, layer 2's key reads it back, K-composition end to end]({{ site.url }}/assets/media/kcomposition_diagram.png)

My version is unnaturally clean, of course. Every block orthogonal, and matrices are exact, because I chose the dimensions to make it so. A trained network has no such luxury. So the question I am left with: if I take a small open-weights model like Pythia and go looking for its previous-token head and its induction head, will the weights look anything like the shift and projection I just wrote by hand? Or does training find some smeared version, spread across heads, that only approximates this behavior?

I built the toy to map QKV to something I could see. Now I want to see the real thing.

That's the next project.
