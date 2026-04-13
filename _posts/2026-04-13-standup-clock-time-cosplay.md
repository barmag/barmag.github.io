---
layout: post
title: "Your Standup Is Industrial Clock-Time Cosplay: Rethinking Engineering Ceremonies for the Agent Era"
date: 2026-04-13 00:00:00 +0200
categories: [engineering-management, ceremonies, ai-agents]
tags: [clock-time, standups, engineering-management, ai-agents, scrum, ceremonies]
excerpt: "The daily standup — and most engineering ceremonies — are products of industrial clock-time, a coordination technology invented in the 18th century to synchronise factory labour. AI agents are the first technology in 250 years that can hold coordination continuity on behalf of humans rather than requiring it from them."
---

Every weekday morning, millions of software engineers stand in a circle — or join a video call, or answer a Slack bot — and recite a script: *What did I do yesterday? What will I do today? Is anything blocking me?*

![The RPG dialogue options meme: an engineer stands before a Scrum Master NPC with three dialogue options, all greyed out except the mandatory path. A fourth option at the bottom, locked, reads Question the ritual itself. Caption: Main quest Daily Standup unskippable.]({{ site.url }}/assets/media/standup-npc-dialogue.png)

Nobody remembers choosing this. It just... is. Like the 40-hour week, the two-week sprint, and the quarterly performance review, the daily standup feels like a natural fact of engineering work. Something that emerged from the nature of the work itself.

It didn't. It was designed. And the design has a history that predates software by about 250 years.

This post makes a specific, testable claim: **the daily standup — and most engineering ceremonies — are products of industrial clock-time, a coordination technology invented in the 18th century to synchronise factory labour.** That technology was installed over generations through factory bells, school timetables, and wage discipline. It was resisted. It was contested. And it was so thoroughly internalised that we stopped seeing it as a choice.

AI agents are the first technology in two and a half centuries that can hold coordination continuity on behalf of humans rather than requiring it from them. This doesn't mean ceremonies are useless. It means we can finally ask: *what is this ceremony actually protecting, and what's the lowest-cost way to protect that thing now?*

That's an engineering question, not an ideological one.

---

## Part 1: The Clock Is Infrastructure, Not Nature

In 1944, the anarchist writer George Woodcock published a short essay called "The Tyranny of the Clock." His verdict was blunt: the clock "turns time from a process of nature into a commodity that can be measured and bought and sold." Before mechanical timekeeping, he argued, "the nomads and farmers measured and still measure their day from sunrise to sunset, and their year in terms of the seedtime and harvest." Time was a process. The clock made it a product.

Woodcock was making an argument, not proving one. The evidence came twenty-three years later.

In 1967, the historian E.P. Thompson published "Time, Work-Discipline, and Industrial Capitalism" — a 42-page paper that remains the definitive account of how clock-time was installed in the West. Thompson showed that pre-industrial work was *task-oriented*: you milked the cow when the cow needed milking, you fished when the tide was right, you wove until the cloth was done. He proposed three points about this mode of working. First, "it is more humanly comprehensible than timed labour." Second — and this is the one that matters for what comes later — "a community in which task-orientation is common appears to show least demarcation between 'work' and 'life'. Social intercourse and labour are intermingled." Third, to people habituated to clock-time, task-orientation "appears to be wasteful and lacking in urgency."

That third point is the one you felt in your gut when you read the word "task-oriented." The clock is so deep in us that a different relationship with time registers as laziness.

Thompson documented how the transition was *made*, not how it happened naturally. Factory bells didn't tell time — they commanded bodies. At the Crowley Iron Works, already by 1700, a Monitor kept time-sheets for each worker with "Come" and "Run" entries. The watch was locked up so "it may not be in the power of any person to alter the same." Workers caught reckoning by faster clocks had their timepieces confiscated. In later factories, "the clocks at the factories were often put forward in the morning and back at night, and instead of being instruments for the measurement of time, they were used as cloaks for cheatery and oppression."

The clock wasn't measuring work. It was producing a *kind* of worker.

![Split image. Left panel: a Victorian factory with a large bell tower, workers streaming through gates at dawn. Right panel: a laptop screen with a Google Calendar notification reading Daily Standup 9:15 AM Every weekday. Both panels share the same underlying structure: a fixed signal demanding synchronous presence at someone else's cadence.]({{ site.url }}/assets/media/factory-bell-calendar-invite.png)

Schools completed the project. Charity schools praised children for learning "Industry, Frugality, Order and Regularity." Sunday Schools fined teachers for unpunctuality. "Once within the school gates, the child entered the new universe of disciplined time." The factory bell trained adults; the school bell trained children to expect the factory bell.

And it worked. Thompson traces three generations: "The first generation of factory workers were taught by their masters the importance of time; the second generation formed their short-time committees in the ten-hour movement; the third generation struck for overtime or time-and-a-half. They had accepted the categories of their employers and learned to fight back within them. They had learned their lesson, that time is money, only too well."

Three things are worth sitting with here.

**First, clock-time is infrastructure, not nature.** It was designed to solve a specific coordination problem — synchronising labour in a factory — and it was installed through deliberate institutional effort over generations. Like any infrastructure, it can be evaluated on its costs and benefits, and replaced when the problem changes.

**Second, the installation was contested.** Workers resisted for generations. "Saint Monday" — taking Monday off as a customary right — persisted in English trades well into the nineteenth century. Pre-industrial weavers alternated bouts of intense work and idleness, a pattern Thompson notes "persists among some self-employed — artists, writers, small farmers, and perhaps also with students — today, and provokes the question whether it is not a 'natural' human work-rhythm." Software engineers who hyperfocus for twelve hours and then stare at a wall for two days are not broken. They are pre-industrial. Saint Monday didn't die. It got a VPN and a Slack status that says "deep work — notifications paused."

**Third, there is nothing uniquely Western about organising time differently.** Every Ramadan, 1.9 billion people enter a month where bodily rhythms — hunger, thirst, night-shifted sociality — are elevated above the clock's rhythms. Productivity drops, and the drop is accepted. The value produced is explicitly non-economic: empathy, discipline, spiritual reset, community cohesion. This is not the Protestant sabbath — rest-as-recovery-for-labour. The fast doesn't use the body as fuel for Monday morning. The time has its own purpose. Fourteen centuries of continuous, institutional-scale practice. It is the existence proof that non-clock ways of organising time are civilisationally viable, not romantic nostalgia.

None of this means clocks are bad or that we should return to milking cows by instinct. Woodcock himself, the man who named the tyranny, concluded that in a free society, "mechanical time would be relegated to its true function of a means of reference and co-ordination." The clock as servant, not master. A tool you consult, not a discipline you submit to.

The question is whether any of our current engineering ceremonies are still using the clock as a tool — or whether we've inherited the discipline without noticing.

---

## Part 2: Engineering Ceremonies and the Inherited Clock

If you are an engineering leader, you probably run some version of this weekly schedule: daily standup, backlog refinement, sprint planning, one-on-ones, retrospective, maybe a demo or review. You inherited this structure from Scrum or a Scrum-adjacent framework. You may have modified it. You probably haven't questioned its premises.

Here is the premise most of these ceremonies share: **coordination requires synchronous human presence at fixed intervals on the clock.** Standup at 9:15, refinement on Tuesdays, retro every other Friday. The calendar is the coordination mechanism. If you're not there, you're not coordinating.

This was true when the only way a manager knew what was happening was to physically assemble everyone. It was true when context lived exclusively in human heads. It was true when there was no foundation for asynchronous continuity — no persistent chat, no PR history, no commit trail, no ticket board, no searchable documentation.

All four of those assumptions are weakening simultaneously, for the first time in 250 years.

This doesn't mean every ceremony is waste. Some ceremonies protect things that have nothing to do with coordination — trust, belonging, shared understanding of each other as people. The question isn't "should we keep ceremonies?" It is: **what is this ceremony actually protecting, and what's the lowest-cost way to protect that thing now?**

That's the question we'll apply to the standup.

---

### The Daily Standup: A Genealogy

The daily standup has an origin story, and it matters for what the ceremony has become.

In 1986, Hirotaka Takeuchi and Ikujiro Nonaka published "The New New Product Development Game" in the Harvard Business Review. They had studied innovation teams at Honda, Canon, Fuji-Xerox, Epson, 3M, and Hewlett-Packard. Their conclusion: the sequential relay-race approach to product development — where specialists hand off to other specialists through discrete phases — was too slow. Instead, they proposed the "rugby approach": the team moves as a unit, "passing the ball back and forth." Self-organising teams. Overlapping phases. Built-in instability as a creative force.

Note what this is *not*. Takeuchi and Nonaka were not describing a factory floor. They were describing knowledge-work innovation teams. They were explicitly *against* the sequential, controlled, predictable process that factory production demands. The rugby metaphor is a rejection of the assembly line, not an adaptation of it.

In 1994, Jim Coplien published a case study of Borland's Quattro Pro for Windows project — eight developers, one million lines of code, thirty-one months, the fastest productivity on record at the time. The secret: daily meetings where the entire team discussed architecture, design, and interface decisions. These were *hour-long working sessions*, not fifteen-minute status checks. They were the engine of a knowledge-creation machine, not a reporting ritual.

Jeff Sutherland, building the Scrum framework at Easel Corporation, read Coplien's paper and adapted it. In February 1994, during the second sprint at Easel, he introduced the "Daily Scrum Meeting." His key move: cutting the meeting from an hour to fifteen minutes, adding the three-question format, and making the team stand to keep things crisp. He also showed his team videos of the New Zealand All Blacks performing the haka — framing the standup not as a report but as a team-charging ritual.

In parallel, Toyota had been running its own version for decades. The *asa-ichi* — a morning meeting to discuss quality deviations and eliminate causes — was part of the Toyota Production System's kaizen practice. This *is* a factory-floor practice, but it was about root-cause analysis of defects, not status reporting. The Scrum standup and the Toyota asa-ichi share a family resemblance — daily, short, whole-team, impediment-focused — but they are parallel inventions, not parent and child.

So the standup was not designed as a factory roll-call. It descended from an anti-sequential, pro-autonomy movement in product development. Its immediate ancestor is a knowledge-creation practice at a software company, adapted by a man who framed it through a warrior dance. Born from a rugby metaphor, raised on a haka, and now living as a Slack bot that pings you at 9:15. Evolution is not always kind.

![Infographic: The Standup Family Tree — a timeline flowing left to right. 1986 Takeuchi and Nonaka The Rugby Approach. 1994 Coplien at Borland Hour-Long Daily Architecture Sessions. 1994 Sutherland at Easel The Daily Scrum. 2010s Industry adoption The Calendar Invite. 2020s Async bots The Slack Bot. A dotted line at the bottom reads Born from autonomy. Raised on discipline. Now lives in your notifications.]({{ site.url }}/assets/media/standup-family-tree.png)

**And yet.**

The ceremony inherited clock-time assumptions that its designers never examined, because the assumptions were invisible — as invisible to Sutherland as they were to the third generation of factory workers Thompson described. Specifically:

**The standup assumes everyone is available at the same time, in the same mental state, every day.** The Scrum Guide specifies "same time and place every working day." Thompson would recognise this sentence. It is the factory bell, softened to a calendar invite.

**The standup privileges synchronous presence over asynchronous records.** It exists because we inherited the assumption that *seeing each other talk* is the most trustworthy form of coordination. Commits, PRs, ticket boards, and Slack threads already carry the same information. The standup persists not because the information isn't available elsewhere, but because the *ritual of showing up* carries social weight that async records don't.

**The standup imposes a fixed rhythm on variable-rhythm work.** Software development is burst-and-idle — exactly like the pre-industrial weaving Thompson documented. Engineers hyperfocus for hours or days, then need recovery. The standup applies a metronome to work that doesn't have one naturally. For neurotypical engineers, this is friction. For neurodivergent engineers — whose "time blindness," interest-based attention, and non-linear energy arcs make fixed daily performance particularly costly — it is disabling. Not because they can't do the work, but because the clock-time assumption punishes their natural rhythm.

**And the ceremony has drifted from its stated purpose.** The Scrum Guide says the Daily Scrum is for the Developers — to "inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary." Not a status report to management. But across the industry, the consistent finding is the same: the longer standups run and the more management is present, the more they become performative — "developers learning that the meeting isn't about actual coordination but about demonstrating productivity." When a ceremony's coordination function can be served by tools, its social-control function becomes its primary surviving purpose. This is not a bug in any particular team's implementation. It is the structural fate of any clock-time ritual whose original justification has eroded.

Thompson's three generations, one more time: the first generation was taught the standup by Scrum trainers. The second generation formed their async-standup committees — Geekbot, DailyBot, Slack threads. The third generation optimises for shorter standups, better questions, tighter timeboxes. All three generations fight within the system's own categories. None of them ask whether the daily fixed-cadence synchronous assembly is the right foundation for the problem.

### What the standup is actually protecting

Strip away the clock-time inheritance and ask: what does the standup do that *matters*?

Three things.

1. **Surface blockers early.** If someone is stuck, the team needs to know before a day is wasted. This is real and valuable. It is also achievable without a synchronous meeting — a Slack thread, a ticket status, an agent-generated blocker digest all do this, often faster.

2. **Maintain shared context.** The team needs a sense of what everyone is working on, how the sprint is tracking, and where the work is heading. Again, real and valuable. Also achievable through visible boards, async written updates, or AI-generated summaries from work records.

3. **Human connection.** The "how was your weekend" before the timer starts. The running jokes. The moment someone notices a colleague is off. The ambient awareness that you are part of a team of people, not a node in a ticket graph.

This third function is the one nobody talks about, and it's the most important. It is also the one the standup serves *worst*, because the standup's clock-time structure — fifteen minutes, three questions, stay on topic — actively suppresses it. Connection is a side-effect of the standup, competing for time with the stated agenda. The engineer who wants to check in on a teammate's rough week is fighting the timer.

### What agents change

Shopify deleted 322,000 hours of meetings in January 2023. Time in meetings dropped 33% per employee. The company estimated a 25% increase in completed projects. An engineer said: "For the first time in a very long time, I got to do what I was primarily hired to do: write code all day."

Zapier replaced synchronous standups with Geekbot — an async bot that collects the three answers via DM and posts them to a channel. It takes about a minute per person. Side discussions happen in threads. Everything is searchable.

These are pre-AI experiments. The current generation of tools goes further. Agent Scrum, Spinach.ai, Kairn, and Microsoft's Copilot Scrum Agent can now summarise team state directly from work outputs — PRs, commits, ticket movements, Slack threads — without anyone reporting anything. They detect blockers proactively by flagging stale tickets, review bottlenecks, and dependency conflicts. They generate structured meeting summaries with decisions, action items, and linked tickets. They enable participation across time zones without anyone waking up at 6am.

The coordination function of the standup — blockers, shared context, sprint tracking — can now be held by an agent. Not perfectly. Not for every team. But the technical necessity that made synchronous daily assembly the only viable coordination foundation is dissolving.

**What agents cannot do** is read the room. They can't tell that someone's quiet because they're struggling. They can't build trust. They can't coach a team through the patterns that keep tripping them up. They can't provide the informal social glue — the jokes, the check-ins, the ambient human awareness.

And this is where the argument turns.

### The connection gap

If agents can hold coordination, and we remove the ceremony that was (badly) providing coordination, we also remove the ceremony that was (accidentally) providing connection. The time freed up is not a vacuum. It is an *opportunity* — but only if we recognise that connection was being delivered as a side-effect and design for it intentionally.

Pre-industrial task-oriented work didn't need separate team-building, because — as Thompson documented — "social intercourse and labour are intermingled." Clock-time separated them. Two and a half centuries later, the standup is our awkward attempt to bolt connection back onto a time system that structurally excludes it. The standup fails at connection not because teams are doing it wrong, but because fifteen minutes of clock-disciplined reporting is the wrong container for trust.

The practitioner move is this: **when you remove or compress a ceremony because agents handle its coordination function, explicitly budget the freed time for intentional connection.** Not as a perk. As infrastructure. The clock-time regime bundled coordination and connection into the same rituals because it had no choice — synchronous presence was the only vehicle for both. We can now unbundle them, and design each one for what it actually needs to be.

Dario Amodei, the CEO of Anthropic, wrote in his 2024 essay "Machines of Loving Grace" that "meaning comes mostly from human relationships and connection, not from economic labor." He was writing about the long-term future of work under AI. But the claim applies now, at the ceremony level: if the standup's coordination value can be held by a machine, its human value was always in the connection — and that connection deserves better infrastructure than fifteen minutes of clock-time cosplay.

---

*This is the first section of a longer piece. Subsequent sections will apply the same analysis to backlog refinement, retrospectives, one-on-ones, on-call, sprint planning, and performance reviews. The question is always the same: what is this ceremony protecting, and what's the lowest-cost way to protect that thing now?*

---

**Sources and further reading:**

- Woodcock, G. (1944). "The Tyranny of the Clock." *War Commentary — For Anarchism.*
- Thompson, E.P. (1967). "Time, Work-Discipline, and Industrial Capitalism." *Past and Present*, No. 38, pp. 56-97.
- Takeuchi, H. & Nonaka, I. (1986). "The New New Product Development Game." *Harvard Business Review*, Jan-Feb 1986.
- Coplien, J. (1994). "Borland Software Craftsmanship: A New Look at Process, Quality and Productivity." *Dr. Dobb's Journal.*
- Amodei, D. (2024). "Machines of Loving Grace." https://www.darioamodei.com/essay/machines-of-loving-grace
- Schwaber, K. & Sutherland, J. (2020). *The Scrum Guide.* https://scrumguides.org/scrum-guide.html
- Shopify calendar purge results: Fortune, WorkLife, Inc. (Jan-Jun 2023).
- Zapier async standup transition: https://zapier.com/blog/asynchronous-standups-geekbot/
- Scrum.org on async self-management: https://www.scrum.org/resources/blog/how-async-scrum-teams-self-manage-without-daily-scrums
