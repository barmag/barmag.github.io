---
layout: post
title: "Panopticon vs Agency: What I Catch Myself Doing in Management"
date: 2026-05-02 00:00:00 +0200
categories: [engineering-management, leadership]
tags: [panopticon, adlerian, separation-of-tasks, engineering-management, leadership, agency, neurodivergent]
excerpt: "Most engineering ceremonies are panoptic: architectures of visibility that get teams to police themselves on behalf of the org. The Adlerian alternative isn't no visibility; it's separation of tasks. What I catch myself doing as a manager when I forget the difference."
---

There's a thing I do as a manager that I'm not proud of, and I'd like to write about it before I rationalise my way out of it.

I sometimes catch myself watching my team. Not in the obvious way. I don't audit Slack statuses or tally commits at 11pm. The watching is quieter than that. It's a tone of voice in a 1:1 that asks "how's it going?" and means *show me you're working*. It's a meeting agenda whose unstated function is to make activity visible. It's the part of me that, when an engineer is quiet for two days, gets uncomfortable and starts to look for them.

I've written about this from the inside before. In ["The Courage to Be Disliked"](https://barmag.github.io/leadership/engineering-management/books/2026/03/28/courage-to-be-disliked-engineering-leadership.html) I called it the manager-as-saviour pattern: the anxiety that says *if I can see it, I can stop it from going wrong*. That post named the pattern as an ego problem, an approval problem, a courage problem. This post names it as a structural one.

The structural name is the panopticon.

![A 3/4 illustrated diagram of Jeremy Bentham's 1791 Panopticon prison: a circular building with cells around the perimeter, each cell visible from a single dark central guard tower. Faint teal sight-lines radiate from the tower outward to every cell, depicting one-way visibility. Labels read "Cells (visible)", "Guard tower (unseen)", and "One-way sightlines". Muted warm-sand and cream palette.]({{ site.url }}/assets/media/panopticon-cutaway.png)

## What the panopticon is, briefly

Jeremy Bentham designed the panopticon in 1791 as a prison. The architecture was simple: a circular building with cells around the edge and a guard tower in the centre, lit so that the guard could see into any cell at any time, but the inmates couldn't see the guard. The trick was the asymmetry. The guard might be looking, or might not. The inmates couldn't tell. So they had to behave as if they were always being watched.

Foucault picked the panopticon up in *Discipline and Punish* (1975) and used it to describe how modern institutions work in general: schools, hospitals, factories, offices. His claim was that disciplinary power doesn't need a guard in every tower. It just needs the architecture: the visibility, the records, the sense that someone *could* be looking. The discipline gets internalised. People police themselves on behalf of the institution, and the institution pays for fewer guards.

That's the version of the panopticon I want to use here. Not a metaphor about literal surveillance, but a description of an architecture that produces self-watching. Most of the rituals of engineering management are panoptic in this sense: the standup, the dashboard, the burndown, the 1:1 status, the Friday demo, the visible PR queue. None of them require anyone to be actively watching at any given moment. They just need to exist, and to be plausibly checkable.

(I covered the time-discipline side of this in ["Your Standup Is Industrial Clock-Time Cosplay"](https://barmag.github.io/engineering-management/ceremonies/ai-agents/2026/04/13/standup-clock-time-cosplay.html). The clock is the *scheduling* axis of disciplinary power. The panopticon is the *visibility* axis. Same lineage, different mechanism.)

## What separation of tasks is, briefly

I wrote a whole post about this one too, so I'll keep it short here.

Adlerian psychology, popularised in the West by Kishimi and Koga's *The Courage to Be Disliked*, proposes a community-of-equals view of human relationships. Inside that view, the most operational concept is the *separation of tasks*. The test is one question: who ultimately bears the consequences of this choice? That person owns the task. Reaching across the boundary to take someone else's task, even with good intentions, is a violation of their agency. Failing to do your own task is the mirror failure.

For a manager:

- **Your task** is to set context, share experience, create the conditions in which good decisions can happen, and bear organisational consequences.
- **Their task** is to decide how to approach their work, learn from their own experience, own their technical choices, and bear individual consequences.

Most management failures are boundary violations in one direction or the other. Micromanagement steals their task. Abdication dumps yours on them. Both feel, from the inside, like care.

## The contrast

Here's the punchline of putting these two frames next to each other.

The panopticon is an **architecture of visibility**. Its operating principle is: *I should be able to see what you're doing, on demand, because that's how I make sure things go well.*

Separation of tasks is an **architecture of refusal**. Its operating principle is: *there is information about your work that is not mine to know, because owning it would be taking your task.*

These are incompatible designs. You can't run a separation-of-tasks team on a panoptic infrastructure, because the infrastructure keeps reaching across the line that the principle says shouldn't be crossed. You can't run a panoptic team on Adlerian principles, because the principles keep refusing to feed the infrastructure with the visibility it needs.

| Panoptic management | Separation-of-tasks management |
|---|---|
| Visibility is the safety mechanism | Trust is the safety mechanism |
| Status is reported on a cadence | State is consulted when needed |
| Engineers optimise for being seen working | Engineers optimise for the work |
| Coordination = synchronous presence | Coordination = shared context |
| Manager's anxiety is held by surveillance | Manager's anxiety is held by themselves |
| Legible upwards | Illegible upwards |

That last row matters more than the rest. Most engineering organisations choose the panopticon by default. Not because anyone explicitly chose, but because the panopticon is *legible upwards*. A separation-of-tasks team produces agency, autonomy, and trust, none of which fit on a slide. A panoptic team produces dashboards, burndowns, and status decks, all of which do. The org's reporting cadence pulls the manager toward visibility even when the manager *knows* separation of tasks works. The structure wins over the intention.

This is the same pattern as the clock-time inheritance: the ceremony persists not because the work needs it, but because the ceremony is the form the org's reporting expects. Structures outlive their justifications. We inherit the discipline without noticing.

## The honest part: I do this

I'd like to claim I'm immune to this. I'm not. Most of the time the panopticon does its work in me without me noticing. The most useful thing I can do in this post is point at what that looks like, in two places I've actually caught it.

### In self-management

This is where I notice it most often, and the most embarrassing place to admit it.

**Performative tasks.** I have, on more than one occasion, done a piece of work primarily so that someone else could see it being done. The work was not pointless. It had an output, the output was real. But the *reason I did it* was that I wanted to be visible doing it. The classic version is the polished status update at the end of a week where the actual progress was modest. The status update is real; the time I spent on it tells me what it was actually for.

**Abiding by rules that don't make sense.** I notice in myself a reflex to follow workflow rules even after I've concluded they're wrong. The standup at a time that doesn't fit my brain. The ticket-update ritual that costs more than it informs. The implicit "always reply within X hours" norm. I don't follow these rules because I've examined them and decided they're load-bearing. I follow them because *not* following them feels exposed, and exposure feels dangerous, and the danger is the panopticon doing its work even when no one is watching.

**Friction between self and group interest.** This is the deepest one. I notice that I will sometimes accept a small personal cost (a meeting at a bad time, a piece of work I shouldn't be the one doing, a deadline that ignores my actual state) rather than name the misalignment between what I need and what the group wants. The reason is not selflessness. The reason is that naming the misalignment makes me visible as someone whose needs are out of step with the group, and being out of step is what the panopticon penalises. So the friction stays internal. Surfacing it would surface me.

I'm describing these in the present tense because they are present-tense. I haven't left them behind. What I have is an Adlerian frame that lets me catch myself faster, and a personal history of [autistic and ADHD masking](https://barmag.github.io/leadership/engineering-management/books/2026/03/28/courage-to-be-disliked-engineering-leadership.html) that gives me strong intuitions for what panoptic discipline does to a body over years. Masking is what self-watching feels like from the inside. Most engineers I've worked with have some version of it, neurodivergent or not, because the panopticon doesn't need a diagnosis to install itself.

![A cathedral stained glass mosaic portrait of a single human figure standing frontally, divided vertically by colour temperature: the left half rendered in cool teals, slate blues and soft greys; the right half in warm ambers, terracottas and golds. Lead lines flow across the body, fragmenting it without breaking it. A small panopticon tower shape is visible in the centre of the chest, and faint cell-window patterns appear along the torso and limbs. The figure glows from a light source behind it, like a cathedral window at dusk. Contemplative, sacred, complex.]({{ site.url }}/assets/media/panopticon-stained-glass.png)

### In management

The interesting part of writing this post is that I can see the same architecture on the other side of the relationship, in how I manage others. The same panopticon is doing the same work; only the role has changed.

**Panopticon in managing performative and maintenance tasks.** The clearest place I've caught it is around work that doesn't have a satisfying ship-this-and-be-done shape. Performative work: status, reporting, stakeholder comms. Maintenance work: keeping a system green, on-call, dependency upgrades, the quiet hygiene that doesn't show up in a demo. These are the tasks the panopticon is most useful for, *as a management tool*, because no one wants to do them and visibility is what makes them happen. So I notice in myself the temptation to add a check, a recurring meeting, a status field, a dashboard, anything that makes the work visible and therefore likely to happen.

The temptation is rational in the short term. It mostly works. The cost is that every visibility hook I add to my team's life is one more brick in their panopticon. Over time, the team adjusts to being visibly busy rather than effectively working. They start optimising for the dashboard. The performative work gets done. The good work gets harder.

**Control the panopticon via vision and team buy-in.** The Adlerian alternative is not "no visibility". That's abdication, and it dumps the manager's task back onto the team. The alternative is to replace surveillance with *shared purpose*. If the team genuinely understands why a piece of maintenance work matters (what it protects, what it enables, what breaks if it isn't done), the work gets done without a guard tower, because the team's interests have been honestly aligned with the work's importance. Vision and buy-in are how you get the *function* of the panopticon (the work happens) without the *cost* (people optimising to be seen working).

This isn't a clever rhetorical move. It's an architectural choice. Panoptic management externalises motivation into surveillance. Vision-based management internalises motivation into understanding. The first is cheap to set up and expensive to live in. The second is expensive to set up (sharing context honestly, repeatedly, until the team owns it as their own), and cheap to live in once it lands.

**Minimise bullshit.** This is the cleanest test I've found for whether I'm slipping into panoptic management. Every piece of work the team is doing should pass a *would I still ask for this if I weren't going to look at it?* test. If the answer is no, the work exists for the visibility, not for the outcome. That work is bullshit, in the technical sense: work whose purpose is the appearance of work. The Adlerian move is to name it, drop it, or replace it with a smaller and more honest thing.

The hardest version of this test is the work I produce *upwards*: for my own manager, for stakeholders, for whoever sits one ring outside the team. Some of that is real. A lot of it is the same panoptic logic, one layer up. Cutting it requires the same Adlerian courage I'd ask of an engineer: name the visibility-versus-outcome trade and make the call. I don't always make it. I am trying to make it more often.

## A note on what this isn't

I want to head off two readings I don't intend.

This isn't an argument against management. Engineering teams need leadership, context, prioritisation, and protection. The panopticon is a specific *kind* of management, not management as such.

It also isn't an argument that visibility is always bad. Some visibility is consensual, useful, and lightweight: a public board where the team chooses what's on it, a working-out-loud channel that engineers opt into, a retrospective where everyone genuinely speaks. The test is whether the visibility is *for the work* or *for the watcher*. The first is a tool. The second is the panopticon.

The architectural difference between a tool and a panopticon is whether the watched person has agency over what's visible. When I'm the one choosing what to share, with whom, for what purpose, the visibility is mine. When the architecture chooses for me, the visibility is the institution's, and I'm the one being produced.

## What I take away

I'm writing this mostly for myself. I want a short version of the contrast I can keep nearby:

1. **The panopticon is an architecture of visibility, not an act of watching.** It works by making me police myself, not by anyone seeing me.
2. **Separation of tasks is the structural antidote.** Refusing to know what isn't mine to know is the move that keeps agency intact, on both sides of the management relationship.
3. **Most of my drift into the panopticon is unconscious.** Performative tasks, illegible-but-followed rules, swallowed friction with the group: these are the symptoms in self-management. Surveillance-shaped processes, dashboards-as-default, check-ins-as-status: these are the symptoms in management.
4. **Vision and buy-in are the work that replaces visibility.** They're expensive to set up and cheap to live in. They are also the only way I've found to get the panopticon's function without its cost.
5. **Bullshit is the diagnostic.** Work that exists primarily to be seen is the panopticon writing through me. Cutting it is how I keep the team's panopticon, and my own, small.

[The clock-time post](https://barmag.github.io/engineering-management/ceremonies/ai-agents/2026/04/13/standup-clock-time-cosplay.html) asked what each ceremony is actually protecting. [The Adlerian post](https://barmag.github.io/leadership/engineering-management/books/2026/03/28/courage-to-be-disliked-engineering-leadership.html) asked whose task each piece of work is. This post asks a third question, sitting between them: *what is this visibility for, and would I still ask for it if no one was going to look?*

If the answer is no, the visibility was the point. That's the panopticon, not the work.

---

*Sources and further reading:*

- *Bentham, J. (1791). [The Panopticon Writings](https://en.wikipedia.org/wiki/Panopticon).*
- *Foucault, M. (1975). [Discipline and Punish: The Birth of the Prison](https://en.wikipedia.org/wiki/Discipline_and_Punish).*
- *Kishimi, I. & Koga, F. (2013). [The Courage to Be Disliked](https://www.amazon.co.uk/Courage-Be-Disliked-yourself-happiness/dp/176063073X).*
- *Companion posts: ["Your Standup Is Industrial Clock-Time Cosplay"](https://barmag.github.io/engineering-management/ceremonies/ai-agents/2026/04/13/standup-clock-time-cosplay.html) · ["The Courage to Be Disliked"](https://barmag.github.io/leadership/engineering-management/books/2026/03/28/courage-to-be-disliked-engineering-leadership.html) · ["Code Is Still Documentation"](https://barmag.github.io/engineering-management/documentation/ai-agents/2026/04/24/code-is-documentation-docs-can-keep-up.html)*
