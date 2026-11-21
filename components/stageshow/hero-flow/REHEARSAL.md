# Rehearsal: Luma hero flow

Abstract kit story (no browser Window, no Phone). Surfaces: `Card`, `Avatar`, `Facepile`, `Chart`, `Meter`, `Badge`, `Button`, `Collapse`, `Roll`, `Spinner`, `Check`, `Count`.

Beats:
1. Compose — Add block → second block opens
2. Compose — Add block → third block opens
3. Share → Draft → Live on the compose Card
4. Network — hub + clockwise avatar orbit (people ring)
5. Feedback — chips return from the ring toward the hub
6. Digest — Spinner clockwise → Check (“Analyzing” → “Digested”)
7. Reports — three pretty report Cards (Chart + Meter + Badge + Facepile)
Loop ~16s; snap reset after reports fold.

Marks: `compose`, `share`, `network`, `feedback`, `digest`, `reports`.

Poster = reports payoff (digested hub + three report cards).

Widths: design 900×420; compact at 358.

**Stills / posters stale:** `shots/` and `poster.png` still show the old Window+Phone device-pair. Re-film when convenient (`film.mjs`); do not treat those stills as current.

Gate: stock `film.mjs --gate` was not green on this host previously (networkidle + Next). Manual review of the live stage instead.

Review assumptions:
- Share language (not “Publish”) fits the abstract send-to-network beat
- Network is peer avatars, not a phone handoff
- Report titles map to the three compose blocks

Assumptions Kevin can correct: exact feedback chip copy, report metrics, whether Share should stay “Publish”.
