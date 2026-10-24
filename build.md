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
| Contact | Manu (3873/06) 9809944833 | Appumon Joseph K (2633/96) 9535733200; EC: Col Pramod M (3006/99) 8588843998 |

## Decisions
- Hosting: GitHub Pages, public repo `sskzmoba/fall-in`, URL
  https://sskzmoba.github.io/fall-in/ — ₹0. Optional custom domain later
  (~₹800–1,200/yr).
- Plain HTML/CSS/JS, no build step, so any alumnus can edit.
- Privacy: no data collected on the site (forms do that). Phone numbers only
  behind WhatsApp buttons; UPI IDs **not** on the site — to be put in each Google
  Form description (EC action). Site has `noindex` (spreads via WhatsApp).
- Stock photos (Unsplash licence) for v1; replace with real OBA photos later.
- Suggested to EC: extend ride booking to ~15 Nov; longer-term use an OBA
  account instead of personal UPI IDs.

## Work
- [x] Theme + plan agreed (2026-10-24)
- [ ] Website v1 live with stock photos
- [ ] Move UPI IDs into Google Form descriptions (EC/organisers)
- [ ] Promo video v1 (9:16, ~40 s, Remotion) — needs old school photos
- [ ] Swap stock photos for real OBA photos
- [ ] After 31 Oct: switch cards to "Bookings closed / waitlist"

## Maintenance / handover
- Edit `index.html` (event details are in plain text in the cards); push to
  `main`; Pages redeploys in ~1 min. Rollback = `git revert`.
- Photos live in `img/`; keep each under ~300 KB.
