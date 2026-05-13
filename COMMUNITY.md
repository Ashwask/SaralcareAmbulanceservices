# Community

The Saralcare Ambulance Directory is open-source — but until people show up,
it's a folder of files. This document is for showing up.

## Where conversation happens

| Channel | Use it for | Setup status |
|---|---|---|
| **GitHub Issues** | Concrete bugs, corrections, new providers, dead-number reports | Live once repo is public |
| **GitHub Discussions** | Open questions, methodology debates, contribution ideas | Live once repo is public + Discussions enabled |
| **Email** (`ashwinsk@saralcare.com`) | Confidential / sensitive matters, legal notices, commercial inquiries | Live |
| **Discord** (planned) | Synchronous conversation, working sessions, volunteer coordination | Not yet — see "What's pending" below |
| **Monthly office hour** (planned) | Open call for verifiers, contributors, observers | Not yet — see below |

## What's live today

- **GitHub Issues** with seven structured templates (correction, takedown,
  dead-number, new-provider, dispute, governance, bug). Open one at
  [github.com/Ashwask/SaralcareAmbulanceservices/issues/new/choose](https://github.com/Ashwask/SaralcareAmbulanceservices/issues/new/choose).
- **GitHub Discussions** for the unstructured stuff. Enable it in repo
  Settings → Features → Discussions.
- **Email** for anything you don't want public.

## What's pending (user action)

### Discord or Telegram

We need a low-friction synchronous channel for:
- Volunteer verifier coordination ("I'll take Bangalore providers this week")
- Live working sessions during launch
- Faster turnaround on contributor questions than email

**Recommendation:** Discord. Why: lower entry bar than Telegram for a
younger civic-tech audience, threaded conversations, screen-share for
working sessions, free tier covers our scale.

**Setup** (15 minutes, founder action):

1. Create a new Discord server: "Saralcare Ambulances".
2. Create channels:
   - `#welcome` — read-only orientation, links to NOTICE / CoC / CONTRIBUTING
   - `#verification-calls` — coordinate who's calling whom
   - `#corrections` — discuss tricky records
   - `#tech` — site code, schema, validators
   - `#governance` — policy, methodology, ADRs
   - `#announcements` — read-only, weekly updates
3. Enable Server Rules link to CODE_OF_CONDUCT.md.
4. Generate a permanent invite link.
5. Add the invite link to:
   - `COMMUNITY.md` (this file) at the top.
   - Site footer (already a placeholder).
   - LinkedIn launch post.
   - GitHub repo README.
6. Optionally bridge with GitHub via Discord's GitHub integration so issue
   notifications land in `#announcements`.

**Alternative — Telegram:** simpler, no account friction, popular in
India. Same setup philosophy, fewer features. If most of the target
community is on Telegram, swap in.

### Monthly office hour

A one-hour open call on the **last Friday of each month, 18:00 IST**.

**Format:**
- Open to anyone with the calendar link.
- 10 minutes: what shipped this month + verification stats
- 30 minutes: open Q&A / contributor showcase / governance proposals
- 20 minutes: working time — verifiers can call providers together,
  contributors can pair on PRs

**Setup** (founder action):

1. Create a recurring Google Meet or Jitsi link.
2. Post it to the Discord `#welcome` channel + the site footer.
3. Add to `CHANGELOG.md` entry the first time it runs.
4. After the call, post notes to the GitHub Discussions area under a
   `office-hour-YYYY-MM` thread.

## Code of Conduct

All channels operate under the project's [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). The standards are higher than usual civic-tech projects because the audience is, by definition, in distress when they use the dataset.

## How to introduce yourself

If you're new and reading this:

1. Skim [NOTICE.md / `/notice`](https://ambulance.saralcare.com/notice) so you know what we are and aren't.
2. Skim [CONTRIBUTING.md](CONTRIBUTING.md) for the verification protocol.
3. Pick one of the contribution paths at [`/open-source`](https://ambulance.saralcare.com/open-source).
4. Drop into Discord (when it exists) or open a GitHub Discussion saying hello + which path interests you.

## Who runs this

Pseudonymously, under the Saralcare umbrella. See [decisions/0002-pseudonymous-publication.md](decisions/0002-pseudonymous-publication.md) for why and how.

## Becoming a maintainer

There is no formal merge-rights ladder in v1 — it's single-maintainer
benevolent-dictator. The path to merge rights starts with consistent
verified contributions over time, then a council role when the v2
transition happens. See [GOVERNANCE.md](GOVERNANCE.md).

## What we don't do

- We don't have a Slack workspace (Discord is the picked synchronous channel).
- We don't have a mailing list (GitHub Discussions covers that surface).
- We don't have a paid forum / Patreon community / paid Discord tier.
- We don't have a podcast (yet).
- We don't run hackathons (yet — when entity is registered, possibly).

## Press, journalism, research

If you're a journalist or researcher, the project lead can be contacted
via `ashwinsk@saralcare.com` with subject `[PRESS]` or `[RESEARCH]`. We
respond within 48 hours and prefer email-first for accuracy. The
methodology is in [CONTRIBUTING.md](CONTRIBUTING.md); the decisions are
in [decisions/](decisions/); the affiliation graph is in
[`data/affiliations/edges.csv`](data/affiliations/edges.csv).
