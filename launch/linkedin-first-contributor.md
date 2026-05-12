# LinkedIn post — "Looking for first contributor"

A *separate* post from the launch announcement. Posted 2–3 days **after** launch, once the site has been live long enough that someone might have heard of it.

The goal: turn "appearance of open source" into "engine of open source" — by getting one person merged. After contributor #1, every subsequent person sees there's already a contributor, which is much easier to join than an empty room.

## Version A — short

> We launched ambulance.saralcare.com last week — an open directory of every ambulance provider in India.
>
> The website works. The data is published. The licence is set.
>
> What it doesn't have yet: a single external contributor. Open source isn't open source until someone other than the maintainer has shipped a PR.
>
> So I'm asking directly. Pick one of these — it'll take 10–90 minutes — and you become contributor #1:
>
> 🇮🇳 Translate the homepage into your native language (Hindi, Kannada, Tamil, Telugu, Marathi, Bengali, Malayalam): edit `site/src/i18n/strings.ts`. ~30 min.
>
> 📞 Verify one Bangalore ambulance provider by phone: call, run the script, flip the record's badge to green. ~10 min.
>
> 📋 Add an ambulance service you know about that we're missing: there's a form on `/providers/new`. ~15 min.
>
> ✉️ File an RTI with your state's health department about 108: there are draft templates in `sources/rti/`. ~20 min + postage.
>
> Or pick anything from FIRST-CONTRIBUTORS.md — 10 starter tasks listed.
>
> If you do this, you get: your name (or initials, opt-in) in CONTRIBUTORS.md. A direct response from the maintainer within 48 hours. The satisfaction of knowing your one merge is the difference between "open in name" and "open in practice."
>
> 🔗 Repo: github.com/Ashwask/SaralcareAmbulanceservices
> 🔗 First-contributors guide: github.com/Ashwask/SaralcareAmbulanceservices/blob/main/FIRST-CONTRIBUTORS.md
>
> Comment if you're going to do one — I'll boost it.

## Version B — long

> A week into running ambulance.saralcare.com — an open ambulance directory for India — I owe whoever's read this far some honesty about where it stands.
>
> What's live: 60 providers across 7 metros, with real public phone numbers. 12 state-level 108 records. A PWA you can install on your phone that works offline. 7 issue templates for structured reports, dead-number flags, corrections, takedowns. 4 ADRs documenting the major decisions. A public moderation queue at /moderation. A funded-sustainability path published transparently at /donate (we're not yet accepting). All under CC BY-NC-SA + MIT.
>
> What's not live: contributors. As of right now, the only commits are mine. That's the gap that turns a well-organised solo project into actual open source.
>
> So this post is the ask. I've curated 10 specific tasks at the link below. The easiest takes 10 minutes (call one provider, update one record). The hardest is a weekend project (add a "find by hospital" search). Each one teaches you the project's protocol while producing real value.
>
> If you do this, two things happen:
>
> 1. **You become contributor #1.** Your initials go in CONTRIBUTORS.md (opt-in). Every subsequent contributor lands and sees they're not alone — which is the single biggest unlock for an open-source project's flywheel.
>
> 2. **You ship something that matters.** Every verified record is a number that worked when someone needed it. Every translation is a screen that becomes usable for ~150M more people. Every RTI is structural transparency we didn't have before.
>
> I'll respond to every PR within 48 hours and merge anything that's correctly sourced and follows the licence.
>
> 🔗 https://github.com/Ashwask/SaralcareAmbulanceservices/blob/main/FIRST-CONTRIBUTORS.md
>
> If you want to chat first before picking a task, open a Discussion or DM me. The fastest way I know to get someone unstuck is to be at the other end of a message.

## Where to post

- LinkedIn (primary — best reach for civic-tech / health audience in India)
- Twitter/X (secondary — thread of Version B, broken across 8 tweets)
- A relevant subreddit (r/india, r/IndiaSpeaks, r/programming for the tech audience)
- A relevant Slack/Discord (TheLuckiestGuy, IndiaHackers Slack, civic-tech-india)
- Cross-post into r/datasets if the version emphasises the open dataset

## What to do after the first contributor lands

- Send them a personal thank-you (email or DM).
- Add them to CONTRIBUTORS.md within 24 hours if they want.
- Make their PR visible: link to it in `/changes`, mention in next office hour.
- Ask them what was unclear about the contribution process. Fix it.
- Two weeks later, ask if they'd like to take on a slightly harder task — that's how a one-time contributor becomes a recurring one.

## Timing relative to the launch post

- **Day 0:** Launch post (`launch/linkedin-post.md`) — focus on the project's existence + 108 + emergency utility.
- **Day 2–3:** This post (first-contributor recruitment) — focus on the open-source ask.
- **Week 2:** Office-hour announcement (from COMMUNITY.md) — converts the LinkedIn engagement into a sync channel.
- **Week 4:** "What I learned from the first 10 calls" post — verification narrative, what surprised us, what providers said.

Each post serves a different audience. Don't merge them.
