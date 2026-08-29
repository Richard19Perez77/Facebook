# Team Poker (Facebook Instant Games copy)

Isolated from `JS_team_poker`. Edit only this folder.

## Local check

Open `index.html` in a browser (Chrome). You should see:

- Board auto-fits when you resize the window
- No Games / outbound links
- Music button toggles local audio (track loads after the first frame)
- Tutorial appears after the board is ready; click it to play
- High score still saves in `localStorage` locally

Facebook cloud save (`FBInstant.player`) only runs inside Instant Games after `startGameAsync`.

## Zip (Meta hosting)

1. Zip the **contents** of this folder so `index.html` and `fbapp-config.json` are at the zip root (not inside a `Facebook/` subfolder).
2. In Meta App Dashboard: add Instant Games, upload the zip, run the **embedded player**.
3. Then test on a phone in the Facebook iOS/Android app and on facebook.com/gaming.

I cannot run those Facebook hosts from this machine; that last pass is on your Meta app.
