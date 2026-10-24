> Follows the master rules in D:\claudecode\CLAUDE.md.

# Fall In, Kazaks — SSKZM OBA Adventures promo

## Goal
Get more alumni (Kazaks) across all batches to sign up for the OBA trek and bike
ride. One vertical, phone-first page plus a 9:16 promo video, circulated mainly on
WhatsApp.

## Theme (decided 2026-10-24)
- Name: **FALL IN, KAZAKS — Adventures 2026–27**
- Story: bonding across generations of batches; relive school-day dawns and
  adventures, or join the veterans; stop waiting, step out.
- Devices: bugle/reveille, roll numbers + batch years, "26 seats only" (trek).
- Colours from OBA logo: navy, red, black, white. Copy says "Kazaks", not "boys".

## Events
| | Trek — Dawn @ Kolukkumalai | Ride — Malabar Days |
|---|---|---|
| Dates | 5–6 Dec 2026 | 23–25 Jan 2027 |
| Book by | 31 Oct 2026 (balance by 7 Nov) | 31 Oct 2026 |
| Advance | ₹2,000 | ₹2,500 |
| Cost | ₹5,000 (₹3,600 direct) | ₹13,000–15,000 |
| Form | https://forms.gle/KUhAgv8AGcXqcKAm6 | https://forms.gle/ZjN7RkG1J6H9Q6247 |
| Contact | Manu Mohan (3873/06) 9809944833 | Appumon Joseph K (2633/96) 9535733200; EC: Col Pramod M (3006/99) 8588843998 |

Ride is shown **first** everywhere (site, video, preview image): it has fewer
enrolments (decided 2026-10-24). General contact in footer: Gp Capt Padmaraj
(2298/93), Communications Cell, 9846552298.

Batch years shown (site marquee + video): '65 '82 '93 '96 '98 '99 '06 '11 '16.
Gold = batches with registered participants ('82 '96 '98 '11 '16). Use only batches
known to exist (there is no '71 or '78 batch).

Nostalgia facts: 5:30 AM mess siren (not a bugle); bugle was for drill; "Morning PT".

## Decisions
- Hosting: GitHub Pages, public repo `sskzmoba/fall-in`, URL
  https://sskzmoba.github.io/fall-in/ — ₹0. Optional custom domain later
  (~₹800–1,200/yr).
- Plain HTML/CSS/JS, no build step, so any alumnus can edit.
- Privacy: no data collected on the site (forms do that). Phone numbers only
  behind WhatsApp buttons; UPI IDs **not** on the site — to be put in each Google
  Form description (EC action). Site has `noindex` (spreads via WhatsApp).
- Stock photos for v1 from Wikimedia Commons (CC0 / CC BY / CC BY-SA; credits in
  the page footer, keep them while those photos are used). Replace with real OBA
  photos later. Logo master: `img/oba-logo.png` (cut out of checkerboard).
- Suggested to EC: extend ride booking to ~15 Nov; longer-term use an OBA
  account instead of personal UPI IDs.

## Work
- [x] Theme + plan agreed (2026-10-24)
- [x] Website v1 live with stock photos — https://sskzmoba.github.io/fall-in/ (2026-10-24)
- [ ] Move UPI IDs into Google Form descriptions (EC/organisers)
- [x] Promo video v1 rendered (2026-10-24): 1080×1920, 45 s, 13 MB,
      `video/out/fall-in-kazaks.mp4` (not committed; re-render with `npm run render` in `video/`)
- [ ] Video v2: swap in old school photos + real event photos (edit image names in
      `video/src/FallIn.tsx`, files in `video/public/`)
- [ ] Swap stock photos for real OBA photos
- [ ] After 31 Oct: switch cards to "Bookings closed / waitlist"

## Video (decided 2026-10-24)
- Built with Remotion 4.0.538 (React → MP4) in `video/`. Free for non-profits /
  orgs ≤3 staff; OBA qualifies. Requires Node; `npm install` then `npm run render`.
- Audio: mess siren "Folha de S. Paulo 6pm Siren" (CC0), bugle "Assembly" (public
  domain); music "Intended Force", Kevin
  MacLeod (CC BY 3.0 — credit must stay on the end card).
- School photo `SSKZM.jpg` (CC BY-SA 4.0, TheInnocentBystander) and NCC cadets
  (CC0), both from Wikimedia Commons, as nostalgia placeholders.

## Maintenance / handover
- Edit `index.html` (event details are in plain text in the cards); push to
  `main`; Pages redeploys in ~1 min. Rollback = `git revert`.
- Photos live in `img/`; keep each under ~300 KB.
