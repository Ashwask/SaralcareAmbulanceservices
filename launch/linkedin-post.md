# LinkedIn launch post — draft

**Voice:** Saralcare brand page (or a brand-associated profile). No personal byline. Saralcare-the-publisher speaks.

**Posting account preference:** Saralcare's LinkedIn company page. If reshared from a personal profile, frame as endorsement: "Sharing this — Saralcare just published…"

**Timing:** Tuesday or Wednesday morning IST (best engagement window for civic/healthcare content in India). Avoid Mondays (noise) and weekends (low reach).

**Image:** A clean screenshot of the homepage with the freshness badges visible. Avoid stock photos of ambulances.

---

## Version A — short (recommended for the brand page)

> **Bengaluru has more than 100 ambulance providers. In an emergency, you'll likely only ever hear about one** — whichever your hospital, your Google search, or your luck routes you to.
>
> That's the gap.
>
> Today we're publishing **ambulance.saralcare.com** — an open, verified directory of every ambulance provider in Bangalore we've been able to find and call.
>
> Government 108 stations, private aggregators (RED.Health, Medulance, Dial4242, …), hospital-owned fleets, charitable services, and standalone operators — all on one map. Each record shows the 24-hour phone, vehicle type (BLS / ALS / MICU), service area, hospital affiliations, and the date we last called to confirm it works.
>
> Free under **CC BY-NC-SA 4.0** for individuals, families, doctors, hospitals (for patient care), journalists, researchers, NGOs, and civic groups. Businesses interested in commercial integration: email ashwinsk@saralcare.com.
>
> This is **information only**. We don't operate or dispatch any ambulance. **Always call 108 first in an emergency.** Read the full disclaimer at https://ambulance.saralcare.com/disclaimer.
>
> 10 records seeded; verification calls in progress. If you can call one provider this week and tell us whether the number works, the dataset is the better for it. GitHub PRs welcome.
>
> Why? This layer of the system has no neutral advocate. Hospitals route to whoever pays them. Aggregators only list their own fleets. 108 is opaque on station locations and response times. Patients see one option when fifty exist. We're building the open commons because the gap is real and the math works.
>
> 🔗 https://ambulance.saralcare.com
> 🔗 https://github.com/Ashwask/SaralcareAmbulanceservices *(once repo is public)*
>
> #PublicHealth #OpenData #Bengaluru #CivicTech #Healthcare #EmergencyMedicine #Karnataka

---

## Version B — longer thread (for X / Twitter / multi-post)

**Tweet 1 / hook**
> Bengaluru has 100+ ambulance providers. In an emergency you'll hear about one. That's the gap.
>
> Just shipped: ambulance.saralcare.com — open, verified directory of every Bangalore ambulance provider. Free under CC BY-NC-SA.

**Tweet 2 / why**
> Hospitals route to whoever pays them. Aggregators only list their own fleets. 108 is opaque. Patients see one option when 50 exist. No neutral advocate exists — because every incumbent is forbidden from neutrality by their own incentives.

**Tweet 3 / what's in it**
> Each record: 24h phone, vehicle type (BLS/ALS/MICU), service area, hospital affiliations, fares (where known), and the date we last called to verify. Govt 108 + private aggregators + hospital-owned + charitable + standalone. All on one map.

**Tweet 4 / the licence**
> Free for individuals, doctors, hospitals (for patient care), journalists, researchers, NGOs, civic groups. Businesses building commercial products: email ashwinsk@saralcare.com.
>
> No ads. No paid placement. No payments from listed providers.

**Tweet 5 / the moat**
> The moat is the freshness contract. Anyone can scrape JustDial. Nobody else picks up the phone every week. 60-day cycle: verified → stale → dead. Public dashboard at /freshness shows the math.

**Tweet 6 / how to help**
> If you can call one provider this week and tell us whether the number works, you've moved the needle. GitHub PRs welcome. The dataset is built one phone call at a time.
>
> 🔗 ambulance.saralcare.com

**Tweet 7 / the disclaimer**
> Information only. We don't operate or dispatch any ambulance. Always call 108 first in any emergency. We accept no liability for outcomes of relying on this data — see the disclaimer for the full legal framing.

---

## Pre-launch checklist (the morning of)

- [ ] Site live at https://ambulance.saralcare.com (HTTPS, mobile-render works)
- [ ] All 10 seed records render with sources visible
- [ ] Disclaimer + takedown process linked from every page
- [ ] No personal byline anywhere — footer reads "Saralcare ambulance directory project"
- [ ] GitHub repo public at https://github.com/Ashwask/SaralcareAmbulanceservices (or chosen owner) with all licenses, FAQ, contributing guide, full data files
- [ ] `ashwinsk@saralcare.com` mailbox monitored; auto-reply optional but a manual response in <4h preferred for first 72h
- [ ] One independent reviewer (journalist or civic-tech peer) has seen the methodology and is OK to be named/linked if asked
- [ ] Disclaimer + takedown process reviewed by a lawyer (~₹3-5k for 1h review)
- [ ] LinkedIn post written, slept on, edited cold the morning of
- [ ] Image asset ready (homepage screenshot, 1200×630, OG-tagged)

## Post-launch first 72 hours

- Respond to every comment, GitHub issue, and email within ~4 hours.
- Monitor for takedown requests; treat them as priority (acknowledge ≤24h even if response will be later).
- Watch for journalists picking up the story; offer the affiliation graph to any healthcare reporter.
- Don't engage with bad-faith critics; let the dataset and the sourcing speak.
- Capture: any RED.Health / Medulance / aggregator response, any hospital response, any commercial inquiry. Log these privately.

## Post-launch first week

- File RTI-1 to NHM Karnataka (the staged plan kicks in).
- Verification calls: aim for 30+ records flipped to verified.
- Write a short follow-up post about the first verification calls — what surprised us, what we got wrong, what providers told us.

## Post-launch first month

- File RTI-2.
- 80+ Bangalore records verified.
- First external contribution merged.
- One journalist or civic-tech peer publicly cites or links the dataset.
- Begin v2 planning: which next city, which volunteer model.
