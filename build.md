> Follows the master rules in D:\claudecode\CLAUDE.md.

# Fall In, Kazaks — SSKZM OBA Adventures promo

## Goal
Get more alumni (Kazaks) across all batches to sign up for the OBA trek and bike
ride. One vertical, phone-first page plus a 9:16 promo video, circulated mainly on
WhatsApp.

## Theme (decided 2026-10-24)
- Name: **FALL IN, KAZAKS — Adventures 2026–27**
- Series label (decided 2026-10-24): **Kazak Wanderlust** (not used elsewhere before; meant to
  last beyond this season). Payoff line: site "The bugle is calling again — for the Kazak Wanderlust that never left us."; video "The Kazak Wanderlust never left us." Hashtag #KazakWanderlust.
- Story: bonding across generations of batches; relive school-day dawns and
  adventures, or join the veterans; stop waiting, step out.
- Devices: bugle/reveille, roll numbers + batch years, "26 slots" (trek).
- Colours from OBA logo: navy, red, black, white. Copy says "Kazaks", not "boys".

## Events
| | Trek — Dawn @ Kolukkumalai | Ride — Malabar Days |
|---|---|---|
| Dates | 5–6 Dec 2026 | 23–25 Jan 2027 |
| Book by | 31 Oct 2026 (balance by 7 Nov) | Shown as "Booking open", no date (decided 2026-10-25; form unchanged) |
| Advance | ₹2,000 | ₹2,500 |
| Cost | ₹5,000 (₹3,600 direct) | ₹13,000–15,000 |
| Form | https://forms.gle/KUhAgv8AGcXqcKAm6 | https://forms.gle/ZjN7RkG1J6H9Q6247 |
| Contact | Manu Mohan (3873/06) 9809944833; EC: MS Prakash (1262/82) 9895236686 | Appumon Joseph K (2633/96) 9535733200; EC: Col Pramod M (3006/99) 8588843998 |

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
- [x] Video v2 built locally (2026-10-24): real SSKZM school photos, Ooty ride + trek clips,
      bugle plays to its end, 47.5 s. Outputs in `video/out/`: master (30 MB), `-share` (12.4 MB,
      for WhatsApp), `-720` (6.2 MB, copied to `film/` for the site)
- [x] Site v2 built locally (2026-10-24): all stock photos replaced with real ones; opt-in
      "Watch the film" full-screen player (`preload="none"`, closes on ✕/Esc/end); new OG image
- [x] v2 revisions (2026-10-24): destination stock shots (Wayanad Churam day/night,
      Kolukkumalai peak/cliff) lead the ride/trek scenes and site cards; siren opens on the
      school aircraft graded to pre-dawn, then the garlanded memorial at sunrise; football
      photo swapped for campus aerial; film now 48.9 s (share 10.9 MB, web 5.5 MB)
- [x] Review pass (2026-10-24): hero = school gate aerial; button "Watch the video"; film opens
      on the aircraft at dawn (graded from a day photo) → memorial plaza at dawn → archive parade
      print → PT bars → running track → lights out; "calling again" over today's parade ground;
      film 47.3 s (share 10.5 MB). Site "Remember?" is one swipeable row of 4 captioned photos.
      Trek card adds EC coordinator MS Prakash (1262/82).
- [x] v2 published (2026-10-24) — https://adventures.sskzmoba.org/
- [x] Registration sheets fixed (2026-10-25): forms ask Roll number + Batch year (4-digit, validated)
      separately; response sheet auto-numbers column A; family count ignores "None/Nil";
      Organiser tracker auto-fills from the form (organisers type only Verified paid ₹, UTR,
      Verified by, date, notes); public list rebuilt (see "Registration sheets" below)
- [x] v3 built locally (2026-10-25): ride has no deadline ("Booking open"; trek keeps 31 Oct);
      Coonoor Quarter Guard photo (site "every batch" photo + 2 s pan in the film); Ooty tags →
      "Nilgiris, Jan 2026"; trek film shots from last year's Neyyar video (boat, trail line); film 51.3 s;
      Trek card: "See who's coming →" (green, opens public list) + "Last year's trek" 2:40 video tile
      (9.6 MB, opt-in); end-card logo gets one amber halo + pop; share copy 12.5 MB
- [x] v3 published (2026-10-25) — https://adventures.sskzmoba.org/
- [x] Forest Trail route teaser (2026-10-25): standalone 15 s map animation (`RouteTeaser`
      composition, `video/src/RouteTeaser.tsx`), share copy `video/out/route-teaser-share.mp4`;
      web copy `film/forest-trail.mp4`. Veerappan is never named in public material.
- [x] Ghats Ride, two trails (decided 2026-10-25): one "Kazak Ghats Ride", 23–25 Jan, riders pick
      **Forest Trail** (new, lead: Coimbatore → Sathyamangalam → Dhimbam → Bandipur → Gudalur →
      Nilambur) or **Malabar Days** (Wayanad, option to Kannur). Same dates, same form, same ₹2,500
      advance. Organiser's figures: Day 2 ≈ 215–225 km, 5–6 h riding (7–8 h with stops).
      Flagged to Appumon: night traffic bans (Bandipur–Mudumalai ~9 pm–6 am, Dhimbam) and the long
      Day 1 (Bengaluru → Coimbatore ≈ 360 km).
- [x] v3 archived at https://adventures.sskzmoba.org/v1/ (film `film/fall-in-kazaks-v1.mp4`);
      v4 preview at https://adventures.sskzmoba.org/v2/ (two-trail ride card, Forest Trail tile,
      film v4 `film/fall-in-kazaks-v2.mp4`, 56.7 s: ride section 17 s). Built with
      `subsite.js`-style copy: same files with `../` asset paths. (2026-10-25)
- [x] Route decided (2026-10-26): riders chose the **Forest Trail** only (Wayanad dropped). Dates
      23–25 Jan + optional 26 Jan (Republic Day); groups from Bangalore, Kochi, Calicut meet at
      Coimbatore; halts Coimbatore, Chamarajanagar, Gudalur; cost and ₹2,500 advance unchanged;
      ride stays "Booking open". Site/film keep the itinerary light (no day-by-day plan on the site).
- [x] v5 preview at /v2/ (2026-10-26): ride card "Kazak Bike Ride · NEW ROUTE · The Forest Trail"
      (elephant-crossing photo `img/ride-forest.jpg`, calendar `forest-trail.ics`); film ride
      section = NEW ROUTE stamp over elephants → 3+1-day map with halts, hairpin counter 1→27 →
      "Spot them all" wildlife checklist → "Chosen by the riders" over the drone clip; teaser
      redone for the same route. Form text drafted for the form owner (title, route note,
      Calicut group, return-plan question).
- [x] "Two separate adventures" clarity pass on /v2/ (2026-10-26): hero "Two adventures: a December
      trek and a January bike ride. Join one, or both."; season strip (Trek 5–6 Dec ··· Ride 23–25 Jan,
      "Booked separately · each has its own form and trip lead"); card labels "Adventure 1 · Bike ride" /
      "Adventure 2 · Trek"; cross-links between cards; dock "Book one or both". Film 59.3 s: new
      "Two adventures · Join one, or both" split card after "calling again", chapter eyebrows,
      red→green wipe into the trek, end card "Book one, or both · Separate forms on the site".
      Avoid calling the trek a "trail" (the ride is the Forest Trail).
- [ ] Ride form updated by its owner (text drafted 2026-10-26)
- [ ] Message riders already registered for the Wayanad plan (change or withdraw)
- [x] Split trek and ride (decided 2026-10-26: the groups found the combined promo confusing).
      One site, two sections, trek first (`#trek`, `#ride`). Short links with their own WhatsApp
      previews: /trek and /trekking → `#trek` (`img/og-trek.jpg`), /ride and /bike → `#ride`
      (`img/og-ride.jpg`); pages in `trek/`, `trekking/`, `ride/`, `bike/`. `app.js` scrolls to the hash
      on load, because some in-app browsers skip the jump. The combined page stays archived at /v1/; the main ride
      card is still the old Malabar/Wayanad one (switch it to the Forest Trail later).
- [x] Trek film (2026-10-26): `TrekFilm` composition (`video/src/TrekFilm.tsx`, reuses FallIn helpers), 45 s:
      school 0530 siren intro → "0400 hrs, by choice" → Kolukkumalai order of the day (stock: jeep, tents,
      torch-lit climb, sunrise) → last year at Neyyar → batches already in → end card with /trek link.
      Music "Americana" (Kevin MacLeod, CC BY 4.0) after the siren. Share copy
      `video/out/Kazak-Trek-Kolukkumalai-film.mp4` (9.3 MB); web copy `film/trek-kolukkumalai.mp4` (4.7 MB),
      the hero button and the trek-card tile play it.
- [x] Trek film v2 (2026-10-26, local; feedback: music too sad, "Nobody left behind" off, Neyyar vs
      Kolukkumalai confusing, counts go stale): order is now school → "Last year · a snapshot" (Neyyar,
      old-film look) → "This year ⏩ Munnar" 0400 hrs → Kolukkumalai order of the day → "Nearly 20 already in ·
      All ages. All batches. One team." → "Tents are limited · Under 10 slots left · BOOK FAST" → end.
      Music "Nonstop" (Kevin MacLeod, CC BY 4.0), from 26 s so its peak lands on BOOK FAST (swap via `MUSIC` in TrekFilm.tsx; Scandinavianz "Seychelles" (Pixabay) passed over: beach feel, Content ID risk on reposts; options
      Heroic Age / Nonstop / Hot Pursuit in `music-previews/`). Only free-licence photos (the user's
      camp photos were internet copies, not used): Kolukkumalai by Yahya and Musheer1999, Triund
      campsite tents by Alok Kumar (tagged "Tent stay"), Chokramudi clouds by NjaanAnoop (all CC BY-SA 4.0).
      Share copy `video/out/Kazak-Trek-Kolukkumalai-film-v2.mp4` (11 MB); web copy re-rendered locally,
      not yet published.
- [x] Trek film v3 (2026-10-26, local): order fixed for continuity: "Remember?" 0530 siren → 0400 HRS "This
      December" (music hits on the strike-out) → Kolukkumalai → order of the day → "Last year · a snapshot" Neyyar
      ("We’ve done this before") → all batch years with booked ones ('76 '82 '98 '06 '07) lit gold + ✓, "Nearly 20
      already booked" count-up → pulsing red "Under 10 slots left" + BOOK FAST → 7 s end card, credits 15 px.
      46.5 s. Share video/out/Kazak-Trek-Kolukkumalai-film-v3.mp4 (11.2 MB); published as film/trek-kolukkumalai.mp4.
- [x] Ride film v1 (2026-10-27, local): `RideFilm` composition (`video/src/RideFilm.tsx`), 46 s, no school
      intro: engine start in the dark → Kazak Riders headlamp sticker → "Gear up" (bandana, scarf, tee, flag,
      stickers from ride-photos/, the group's own) → "Squad ready" → last January (Coonoor banner, drone clip)
      → NEW ROUTE The Forest Trail → route map (reused from FallIn) → "Spot them all" 6 animals → Ooty rider
      clips "Seniors lead. Juniors keep pace." → trek nod (/trek) → "Ride with us · Booking open" (/ride).
      Music "Twisted" (Kevin MacLeod, CC BY 4.0); engine "Kawasaki ER-5" start-up by OllemanW (CC BY-SA 3.0).
      The user's wildlife/sunflower photos were internet copies, not used; tiger at Bandipur by Harish Garg and
      sloth bear by Giles Laurent (CC BY-SA 4.0) instead. Sunflowers left out (bloom season in Jan unconfirmed).
      Easy Rider songs are copyrighted; not usable. Share copy `video/out/Kazak-Ride-Forest-Trail-film.mp4`
      (9.2 MB); web copy `film/ride-forest-trail.mp4` not yet published.
- [x] Ride film v2 (2026-10-27, local; feedback: kit looked shabby, ticks amateurish, tagline weak, music flat):
      gear = gallery-print reveals (blurred backdrop, push-in, light sweep, 01/05 counter) → five-slice "Squad ready";
      wildlife = camera viewfinder, one sighting at a time (focus box locks, shutter flash, REC); tagline "Lead. Or
      keep pace."; music Motherlode (Kevin MacLeod, CC BY 4.0) from 22 s. Rock options in music-previews/ride/
      (Gearhead, Big Rock, Exhilarate, Montauk Point, Twisted); swap via MUSIC in RideFilm.tsx. Wildlife photos now
      ride/spot-*.jpg (larger Commons originals, same authors). Share copy video/out/Kazak-Ride-Forest-Trail-film-v2.mp4 (10.8 MB).
- [x] Ride film v3 (2026-10-27, local), 60.8 s: Kazak Riders sticker as a lit emblem (cut-out ride/sticker.png, glow, sweep,
      ring; visible from frame 0 for the WhatsApp thumbnail) → "Engines on." → slower gear (40 frames each) → last January:
      banner, whole drone clip (uncropped), whole group photo → Forest Trail → map → trail moments: "Ride along the chital"
      (Pexels, Karnataka), "Stop. Elephants first." (Pexels, Karnataka), "Ride past the dancers" (peacock on a road, Pench,
      Rohit Sharma, CC BY-SA 4.0), "27 hairpins. Take them all." (Pexels: Indian hill road + a Sri Lanka hairpin stack,
      illustrative, not tagged as the route) → "If you’re lucky" viewfinder (tiger, sloth bear, gaur) → "Lead. Or keep pace." → end.
      Trek nod removed. Two music cuts via props (`--props={"music":"chf"|"bigrock"}`): Cool Hard Facts / Big Rock (Kevin
      MacLeod, CC BY 4.0, loudnorm), each ending on the track’s own finish (part B cut in on a bar line). Share copies
      video/out/Kazak-Ride-Forest-Trail-film-v3-Cool-Hard-Facts.mp4 and -Big-Rock.mp4 (13 MB each, crf 30).
      **Chosen (2026-10-27): Big Rock** (now the default prop). Final share copy
      video/out/Kazak-Ride-Forest-Trail-film-v3-Big-Rock.mp4.
- [x] Ride film published (2026-10-27): web copy film/ride-forest-trail.mp4 (720p, 6.1 MB, opt-in); /ride hero button
      "Watch the ride video · 61 s"; ride card tile "The ride film" (img/ride-film-thumb.jpg, poster film/ride-film-poster.jpg),
      the 15 s route teaser stays as the second tile.
- [x] Main page updated and published (2026-10-26): Forest Trail ride card (from v2), trek film v3,
      trek badge "Under 10 slots left", "nobody left behind" wording gone, batch strip gold = registered
      batches ('76 '82 '96 '98 '06 '07 '11 '16), new `img/og.jpg` (trek | ride split). Old versions moved to
      /old/v1/ (v3 combined, Wayanad) and /old/v2/ (Forest Trail preview); /v1/ and /v2/ forward there.
- [x] One page, three views (decided 2026-10-26, instead of separate copies, so there is one file to edit):
      / shows both; /trek and /trekking open `?a=trek#trek` (ride section, ride buttons and season strip hidden;
      switcher "Trek · Ride · Both"); /ride and /bike open `?a=ride#ride` (countdown hidden, hero plays the
      Forest Trail route teaser). CSS classes: `both-only`, `trek-only`, `ride-only`, `not-trek`, `not-ride`.
- [ ] Ride section redesign with the Kazak Riders artefacts (ride-photos/)
- [ ] Ride public list (later, same pattern as the trek)
- [ ] After 31 Oct: switch the trek card to "Bookings closed / waitlist" (countdown does this automatically)

## Registration sheets (trek, set up 2026-10-25)
- Form responses: workbook `1JqRSsMf_n9MePiLzTsrc-KPZ4M_pqlTBrKXJB6yMJUA` (tab "Form Responses 1";
  col A auto-number, L = Batch year). Never share it.
- Organiser workbook `10PBwTpfYA0d_7jxTs80RbbwkR69-phMZFKZh_b8vjco` (organisers only):
  *Live form responses* (IMPORTRANGE A:L) → *Registration status* (organisers set **Status** in col F,
  optional party-size correction in G) → *Organiser tracker* (auto rows; organisers fill J Verified paid,
  M UTR, N Verified by, O date, Q confirmation date, R notes) and *Public export*.
  Manual tracker cells are tied to row position, so never delete or re-sort form responses.
- Public list (view only, link-shared): `1VO0rb67mPiYVoLBIng9vbGu57101F0qloMHJQ-IpZWU` —
  https://docs.google.com/spreadsheets/d/1VO0rb67mPiYVoLBIng9vbGu57101F0qloMHJQ-IpZWU/htmlview
  Shows name, roll no., batch, family joining (relationship only, never names), status; totals
  exclude Cancelled/Withdrawn/Duplicate. Expected total ₹ = party size × ₹5,000 (TVM bus) or ₹3,600 (direct).

## Real photo shortlist (scouted 2026-10-24, used in v2)
Ooty ride 2026 folder: https://drive.google.com/drive/folders/197tRfhEDl_GYwYrPWDDa9j_i6gKxDp9O
(owner sreejithpspillai; link-shared, so thumbnails/downloads work without the connector)
| Use | File | Drive id |
|---|---|---|
| Past→present bridge: riders at the SSKZM gate | sheet #04 | 1evf5rOa1VIatWgY9UGdg5mjAyg0zdg2I |
| Ride card / hero: riders on hilltop road | sheet #27 | 1IrVaVXXfnCFbdDkBRsbkMc7-ZGkpRtmz |
| Helmet group selfie on the road | sheet #29 | 11tEPhm8J52NbuxG9t-K-9ItBLaEyRUFJ |
| Full group line-up ("Every batch") | sheet #14 | 1f37O6GCvmOiCC7h4Dc528_1I-whzW9_A |
| B&W group laughing, Ooty street | sheet #23 | 1GivBBHW6-oO20_L6bzeQ0aXuiuaFDx3c |
| Bikes lined up (Dry Fruit House) | sheet #20 | 1MpsPb3ocx4jx4Qn46kYNBz6kiBzVbBUd |
| Dinner table ("stories long after") | sheet #21 | 1U1E0xxqrgAqry7ZBedECfHeQvFF8iKz9 |
| Spouse/pillion welcome (3 in red tees) | sheet #33 | 1RhOA6dLqJEmNvUniRKfNJRtIuRD5mXgm |
| Video clip: open road, rider with luggage | VID-20260116-WA0108 (≈16–22 s) | 1ph8Z1ty7atUQ39sV92_JeiC2d-103li1 |
| Video clip: pillion pair passing | VID-20260116-WA0110 (0–4 s) | 1eB0mhh4r8sSI3MJMHb-oO6vzDc8Pwyjn |
| Video clip: departure from above ("step out") | VID-20260115-WA0087 (0–6 s) | 1AYnXIofjNqVN1AsZQ43B02VPoRiXDEAz |
Consent: Rider group and Trekking Club have both given permission (2026-10-24).
Credit line: "Photos: Kazak Rider Group, Kazaks Trekking Club & SSKZM OBA".

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


## Video (decided 2026-10-24)
- Built with Remotion 4.0.538 (React → MP4) in `video/`. Free for non-profits /
  orgs ≤3 staff; OBA qualifies. Requires Node; `npm install` then `npm run render`.
- Audio: mess siren "Folha de S. Paulo 6pm Siren" (CC0), bugle "Assembly" (public
  domain); music "Intended Force", Kevin
  MacLeod (CC BY 3.0 — credit must stay on the end card).
- v2 mixes OBA photos/clips with 4 Wikimedia destination shots (decided 2026-10-24:
  the venues must be shown prominently). Their credits stay in the footer and end card.
  Real footage is tagged on screen ("Kazak Rider Group · Ooty, Jan 2026",
  "Kazaks Trekking Club · Nov 2025") so it isn't mistaken for the new venues.
- Forest Trail map photos (`video/public/route/`, Wikimedia; credits on the teaser end card
  and the film): Sathyamangalam landscape — Murugavel.T (CC BY-SA 4.0); Sathyamangalam TR
  panoramio — Jaseem Hamza (CC BY 3.0); Bandipur road — L. Shyamal (CC BY-SA 3.0); chital herd
  at Bandipur — Dineshkannambadi (CC BY-SA 3.0); Gudalur tea estate — LakshmiNaresh
  (CC BY-SA 4.0); Conolly Plot, Nilambur — PP Yoonus (CC BY-SA 3.0). Added 2026-10-26:
  elephants crossing at Bandipur — Namisharun (CC BY-SA 4.0); gaur herd at Bandipur —
  Dineshkannambadi (CC BY-SA 3.0); peacock in Bandipur — Partha Majumdar (CC BY-SA 4.0);
  Bhavanisagar dam — Pratheept2000 (CC BY 3.0); Sathyamangalam ghat road — Jaseem Hamza (CC BY 3.0).
  The Wayanad Churam photos are no longer in the film or on /v2/ (still on the live main page).
- Clips are pre-trimmed to 1080×1920 / 30 fps / no audio in `video/public/`
  (source originals stay in Drive). Video file for the site lives in `film/`.

## Maintenance / handover
- Edit `index.html` (event details are in plain text in the cards); push to
  `main`; Pages redeploys in ~1 min. Rollback = `git revert`.
- Photos live in `img/`; keep each under ~300 KB.
