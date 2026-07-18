# myvolleyball-tracker
Live in-game volleyball statistics tracking for team and opponents with scoreboard and CSV export functionality.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.1-green.svg)

---

## About
MyVolleyball Tracker was built for youth and recreational volleyball programs that currently record stats on paper during games. Coaches — often parent volunteers with limited experience — can use this tool to capture live, in-game statistics without any setup or technical knowledge.

What it tracks:

Player details: name, jersey number, and court position<br>
Per-player stats: serves, receptions, ball handling, digs, attacks/kills, and blocks<br>
Opponent stats for post-game review and future game strategy<br>
Home vs. away scoreboard across up to three sets

When a team has more than one statistician, one can focus on your team while the other tracks the opponent — giving coaches a fuller picture for planning future matchups.

---
<img width="1172" height="823" alt="myvolleyball-tracker-player-stats" src="https://github.com/user-attachments/assets/e52f10ba-1664-4cc4-b87d-09453908181f" />
---

## Features

- **Court view** — visual 6-player court with drag-and-drop position swapping
- **Rotation tracking** — one-click clockwise rotation with counter; supports 6, 7, or 8-player rosters (with bench)
- **Live stat entry** — tap any player to record serves, attacks, blocks, digs, receptions, and more; auto-increments related totals (e.g. a Serve Ace auto-adds a Serve Attempt)
- **Opponent tracking** — mirror court and stats panel for the opposing team, with four color themes
- **Scoreboard** — set-by-set scoring for up to 3 sets, home/away swap, and set-win totals
- **CSV export** — export your team stats, opponent stats, or scoreboard to CSV with one click
- **Zero dependencies** — React and Tailwind load from CDN; nothing to install

---

## Getting Started

### Option 1 — Open locally

```bash
git clone https://github.com/mdixonii/myvolleyball-tracker.git
cd myvolleyball-tracker
open index.html          # macOS
# or double-click index.html in Windows Explorer / Linux file manager
```

### Option 2 — GitHub Pages (recommended)

1. Fork or push this repo to your GitHub account.
2. Go to **Settings → Pages**.
3. Under *Source*, select **Deploy from a branch** → `main` → `/ (root)`.
4. After ~60 seconds your tracker will be live at `https://mdixonii.github.io/myvolleyball-tracker/`.

---

## Project Structure

```
myvolleyball-tracker/
├── index.html       # App shell; loads React, Tailwind, and app.js
├── app.js           # All React component logic
├── app.css          # Minimal base styles and scrollbar overrides
├── manifest.json    # Dataset/workflow mapping for MyVolleyball platform
└── README.md
```

---

## Stat Definitions

| Stat | Description |
|---|---|
| Serve Ace | Serve lands untouched; auto-adds a Serve Attempt and Offensive Point |
| Serve Error | Failed serve; auto-adds a Serve Attempt |
| Attack Kill | Successful attack; auto-adds an Attack Attempt and Offensive Point |
| Attack Error | Failed attack; auto-adds an Attack Attempt |
| Block | Successful block; auto-adds a Defensive Point |
| Ball Handling Assist | Set or pass that directly results in a kill |

All stats can be decremented with **−1** to correct entry mistakes.

---

## Rotation Logic

| Roster size | Rotation behavior |
|---|---|
| 6 players | Standard clockwise rotation across 6 court positions |
| 7 players | Bench 1 enters at Pos 1; Pos 2 moves to bench |
| 8 players | Bench 1 enters at Pos 1, Bench 2 enters at Pos 4; Pos 2 and Pos 5 move to bench |

---

## CSV Export

Three exports are available from the toolbar:

- **Team stats CSV** — one row per player with all stat totals and game/score metadata
- **Opponent stats CSV** — same format for the opposing team
- **Score CSV** — one row summarising set scores, set winners, and set-win totals

Files are named `volleyball_stats_YYYY-MM-DD.csv`, `opp_stats_YYYY-MM-DD.csv`, and `volleyball_score_YYYY-MM-DD.csv`.

---

## Browser Support

Works in any modern browser (Chrome, Firefox, Safari, Edge). No server or build step needed.

---

## License

MIT — see [LICENSE](LICENSE) for details.
