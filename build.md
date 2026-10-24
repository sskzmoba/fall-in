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
- Hosting: GitHub Pages, public repo `sskzmoba/fall-in`. Live at
  https://adventures.sskzmoba.org/ (CNAME at ResellerClub DNS → sskzmoba.github.io,
  added 2026-10-24; old URL redirects):
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
- [ ] Video v2 (end card URL → adventures.sskzmoba.org): swap in old school photos + real event photos (edit image names in
      `video/src/FallIn.tsx`, files in `video/public/`)
- [ ] Swap stock photos for real OBA photos
- [ ] After 31 Oct: switch cards to "Bookings closed / waitlist"

## Real photo shortlist (scouted 2026-10-24, not yet used)
Ooty ride 2026 folder: https://drive.google.com/drive/folders/197tRfhEDl_GYwYrPWDDa9j_i6gKxDp9O
(owner sreejithpspillai; link-shared, so thumbnails/downloads work without the connector)
| Use | File | Drive id |
|---|---|---|
| Past→present bridge: riders at the SSKZM gate | IMG-20260115-WA0004 | 1evf5rOa1VIatWgY9UGdg5mjAyg0zdg2I |
| Ride card / hero: riders on hilltop road | IMG-20260117-WA0009 | 1RhOA6dLqJEmNvUniRKfNJRtIuRD5mXgm |
| Helmet group selfie on the road | IMG-20260117-WA0119 | 1t4Xmg_3teunqxqfefuqa1KERx2Gf7i1O |
| Full group line-up ("Every batch") | IMG-20260116-WA0012 | 13e282V1l9Ic0f5fgr5YtSeztmMzDnHPE |
| B&W group laughing, Ooty street | IMG-20260116-WA0144 | 1AKL40ExiEZ192FoM89wXvk9Ut3ifSjVk |
| Bikes lined up (Dry Fruit House) | IMG-20260115-WA0111 | 16kX-tkU5o6OBQqaMOWI2Xan4zaRQk3qH |
| Dinner table ("stories long after") | IMG-20260116-WA0015 | 1tyj7daaDvclR8DTv7LI8I-Z180si2SRZ |
| Spouse/pillion welcome (3 in red tees) | IMG-20260118-WA0121 | 1HVYEy38iHtcrYpNV69EB83GX3j_utUyV |
| Video clip: open road, rider with luggage | VID-20260116-WA0108 (≈16–22 s) | 1ph8Z1ty7atUQ39sV92_JeiC2d-103li1 |
| Video clip: pillion pair passing | VID-20260116-WA0110 (0–4 s) | 1eB0mhh4r8sSI3MJMHb-oO6vzDc8Pwyjn |
| Video clip: departure from above ("step out") | VID-20260115-WA0087 (0–6 s) | 1AYnXIofjNqVN1AsZQ43B02VPoRiXDEAz |
Consent: Rider group has given permission. Credit line: "Photos: Kazak Rider
Group & SSKZM OBA" (2026-10-24).

Batch 2 (scouted 2026-10-24). Folders: bike2 `1Gmc5QLNjF06Zw5lwTvfMAHqTV-ytzwZc`,
trek `1jiDFoyfMnByYhoPhloeH8k70AqElz04i` (Neyyar/Agasthyamala, 15–16 Nov 2025 — not
Kolukkumalai, caption accordingly), school `1eaeCZnPQqW6vqhpDNcM4697kZgo06eKs`.
| Use | Drive id |
|---|---|
| Siren "0530 hrs": sun on campus horizon (SCp006) | 127kPEy4MxckDNfKqMO_oWz2Cwb5uLZwW |
| Early-light memorial (SCp007) | 1W1cpwpI_nxXjMkTz3LlX2OI3asqWyul9 |
| Misty pavilion, blue hour (SCp004) | 13t9LWryD8oAfRGgGohSTOI3WDy_GjPn9 |
| Bugle "across the parade ground": cadets on parade (SCp017) | 13dxuUQEKD0uptkv39RjUKEpoIw2p3YcV |
| Parade ground aerial (SCp023) | 1wl6dLFMnIXenRprWg_QrIoGOAy90Gq0N |
| Morning PT: PT bars on the ground (SCp026) | 196CBHi9IJoS5BvstIwCSeztYZal0UEVy |
| Morning PT aerial, cadets on ground (SCp009) | 12fQeA2gIVEz0R6IYpskqkSAJcnNH2l5z |
| Cross-country / running on red earth (SCp018) | 1FIykfhBbKS5E-vNRj8kdhmQQzG_aOZFE |
| Clock-tower main building (SCp047, replaces Wikimedia photo) | 1XHcENoVgQhCCcfL9sRm7KqMJPkDayB-U |
| "Lights out": building under dark sky (SCp039) | 1pX6D4v7-UMojyCVjyST1CPhBfgRZYGaV |
| School gate aerial (SCp022), pairs with riders-at-gate | 1cDELaV8O9zmjqKSOmwSka7zgQnQgFDhD |
| Campus aerial (SCp011) | 1Q3G4Wn-lxfkCv1E9QhaTnezChCe-uXpg |
| Ride: drone group photo with bikes (BIp002) | 1zQc_Ov8xRp2P7w3mGwfrCX3-zRpdbAmS |
| Ride: drone quickshot of group, video 29 MB (BIv004) | 1KeTYt9YSiZt2t8UpMNRWsHvgg6QkMYa4 |
| Trek: line of trekkers on forest trail (TRp088) | 1Scci9M_K6HhLAyCDeFR4DjMy9SdVZJfd |
| Trek: helping hand across the river — "nobody left behind" (TRp032) | 1JOtxo4z3arxPublXmE68Ir1HBU0-FeS- |
| Trek: full group, smiling (TRp100) | 1FW_GQVDPhOdYuswrbh4FaftwDeSBH-xq |
| Trek: arms up in the pool (TRp098) | 1x81ZTsBBdguSd6s9Hq1UgApR5YTkV21W |
| Trek: group on rocks at waterfall (TRp085) | 1KJgl_tIwFnSjTc8pz_0QC1CZNQJzxI2t |
| Trek: veterans seated at waterfall (TRp101) | 1WaPuu_2-sAcDfMi-Go5FWJumeh3eC-1x |
| Trek: group at the lake edge (TRp069) | 1gzetLQtilJhsCZVlLaO7e_77r15xaRZ2 |
| Trek: misty reservoir, morning (TRp070) | 111xZG75HU_2vjKdpwy-gkDNo2y95_k6b |
| Trek: climbing uphill through forest (TRp117) | 1zsc4VxvgHGntlnl4MO54n-p5No2SaP7A |
| Trek video: group cheering at falls, 1 MB (TRv109) | 1uSpkOlyRLMXnx3Z8FNIYuVd7inFXifQ8 |
| Trek video (GoPro, vertical): walking forest trail, 80 MB (TCv007) | 17gUn-US2upx3sNZ5yEvzU1j5gSo9xzVp |
| Trek video: group on trail, 104 MB (TCv010) | 1SXp3t8s0SCZs1VUd6s2dS2BMiiFHkIVG |
| Trek video: boat across reservoir, 103 MB (TCv014) | 1NX90Kqpkhi7T0VBJm_hc-PcrAr2rODTE |
Avoided: shirtless swimming close-ups (public promo), duplicates, blurry clips.

Copy change pending (site + video): "The bugle on the drill square" →
"The bugle across the parade ground."

Planned video tweak (not rendered yet): let the bugle "Assembly" call play to its
natural end (~9.5 s) instead of fading early; extend the school scene ~1.5 s
(video ≈ 46.5 s).

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
