# Rehearsal: Luma hero flow

Gold: `device-pair` (layout: studio window + phone satellite) + cursor beats from `hero-demo`.

Beats:
1. Add block → second block opens
2. Add block → third block opens
3. Publish in toolbar → Draft → Live
4. Phone: recruiting “You’re a match” (screener passed)
5. Payoff: phone live test + first-click task; studio shows “1 participant in”
Loop ~12s; snap reset while phone returns to idle.

Captured: poster (`--reduced`), open/blocks/publish/recruit/test stills via Playwright `load` (stock `film.mjs` `networkidle` stalls on Next HMR). Widths: design 900×420; compact defined at 358.

Gate: stock `film.mjs --gate` not green on this host (networkidle + Next). Manual review of stills instead.

Film / fixes:
- Publish was cut by the stage crop → moved to toolbar
- Phone idle no longer mirrors the canvas wireframe
- Recruit/test copy shortened so actions stay whole in the phone crop

Review assumptions:
- Participant is a peer design student (credit loop)
- Study title “Checkout redesign” matches existing landing copy
- Recruiting = screener + consent, then live test handoff

Not checked: official `--gate` contact sheet; 390 compact film pass.

Assumptions Kevin can correct: exact recruiting copy, whether the phone should be LockScreen+Notification instead of in-app screens.
