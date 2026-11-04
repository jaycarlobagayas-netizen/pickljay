# PED013 Pickleball Class Tournament

A single-file web app for running a class pickleball tournament: manual team
assignment, an automatic round-robin schedule across multiple sessions and
courts, courtside rally scoring, and a running record of every student's games.

Built for a 43-student PED013 section at MSU-GenSan — 8 sessions, 2 courts,
doubles only, games to 11 (rally scoring, switch ends at 6).

Two pages:

| File | Who opens it | What it does |
|---|---|---|
| `index.html` | the teacher | everything — teams, schedule, scoring, exports |
| `board.html` | the students | read-only monitoring board; no way to change a score |

---

## Quick start

Open `index.html` in any browser, or visit the published GitHub Pages URL.
Nothing to install, no build step, no server, no sign-in. It works offline.

**First run, in order:**

1. **Teams** — set the number of teams → *Create teams* → *Random balance*
   (or assign each student by hand from the roster table). Rename a team by
   clicking its title.
2. **Schedule** — *Generate schedule*. This builds the full round robin and
   lays it out across the sessions, slots and courts set in Setup.
3. **Courts** — on match day, pick the session and tap a match to score it.
4. **Standings / Players** — results update live; export CSV for grading.

---

## How the tournament is built

With the defaults (6 teams, 8 sessions, 2 courts, 4 slots per session):

| | |
|---|---|
| Teams | 6 (five of 7 students, one of 8) |
| Ties | 15 — every team plays every other team once |
| Games per tie | 3 doubles games, a different pair each time |
| Total matches | 45 |
| Capacity | 8 sessions × 4 slots × 2 courts = 64 |
| Games per student | 4–5, and never more than 1 apart inside a team |
| Repeated partnerships | none |

### Rotation: why 6 teams and not 7

Partners are drawn from within a team, and the app holds two rules:

1. **Everybody plays.** Each tie's pairs are chosen from the teammates with
   the fewest games so far, so game counts inside a team never differ by
   more than one, and no student is ever left out.
2. **No partnership repeats.** A circle-method round robin inside each team
   lists every possible pairing exactly once, grouped into rounds of pairs
   that share no players. Each tie takes its pairs from one round, so a
   student plays at most once per tie and never partners the same teammate
   twice.

Rule 2 has a hard arithmetic limit. A team of *n* players has only
*n(n−1)/2* possible partnerships, and a team plays *(teams − 1) × games per
tie* matches:

| Teams | Team size | Partnerships needed | Partnerships available | Unique? |
|---|---|---|---|---|
| 6 | 7–8 | 15 | 21 | yes |
| **7** | **6–7** | **18** | **15** | **no — short by 3** |
| 8 | 5–6 | 21 | 10 | no — short by 11 |

So 7 teams of 6 **cannot** give every match a new pairing at 3 games per
tie; three repeats are forced. 6 teams of 7–8 fits exactly, which is why it
is the default.

The Setup tab tells you which case you are in before you generate, and the
Schedule tab shows a *Rotation & participation* panel afterwards: distinct
partnerships, the largest number of times any pair plays together, the
range of games per student, and anyone with no match at all.

### The bypass

*Never repeat a partnership* (Setup tab) is on by default. If you choose a
setup where it is impossible, the app refuses to generate and explains the
arithmetic — which team, how many pairings it has, how many it needs — and
offers working alternatives.

Below that is **Bypass: allow the fewest possible repeats**. It generates
anyway, reusing only as many partnerships as the arithmetic forces and
spreading them across the least-used pairs. With 7 teams at 3 games per tie
that means 18 of 63 matches reuse a pairing, and no pairing is ever used
more than twice. Turning the Setup checkbox off has the same effect
permanently.

**Slotting.** Both courts run at the same time. A match is only placed in a
slot where none of its four players is already playing, so the two courts
always hold different students. Two games of the same tie can therefore run
side by side.

If the schedule does not fit the capacity, a warning appears on the Schedule
tab with the overflow count — add a slot per session in Setup, or lower
*games per team tie*.

---

## Scoring rules encoded

- **Doubles only** — every match is a pair against a pair.
- **Rally scoring** — a point is awarded on every rally regardless of who served.
- **Game to 11, win by 2**, hard cap at 15 (configurable in Setup).
- **Switch ends** when either side first reaches 6 — a banner appears on the
  scoreboard and must be acknowledged.
- **Serve** passes to the other side whenever the receiving side wins the
  rally. Tap the serve button to correct it manually.
- **Tie winner** = the team that wins the most of the tie's games.
- **Partners rotate** — see *Rotation* above.

### Scoreboard controls

| Action | How |
|---|---|
| Add a point | Tap the team's colour block (or press `A` / `L`) |
| Undo last point | *Undo point* button (or `Z`) |
| Correct a score | *−1* buttons |
| Fix the serve | *Serve* button |
| Record the result | *Finish match* |
| Reopen a finished match | *Reopen* on the final banner |

---

## Standings

**Team table** — ties won/lost/drawn, games played, won, lost, points for,
points against, differential, league points, win %.
League points default to 2 per game won; ranking breaks ties on differential,
then points for.

**Student table** — games played, won, lost, points for, points against,
differential, points per game, win %.

**Student tracker** — expand any student for their full match log: when they
played, who their partner was, who they faced, the score and the result.

---

## Data and backups

Everything lives in **this browser's localStorage only**. It is not synced
and does not leave the device.

> **Back up after every session.** Setup → *Export backup (JSON)*. To move to
> another device or recover after clearing browser data, use *Import backup*.

Exports available in Setup and Standings:

- `*_team_standings_YYYY-MM-DD.csv`
- `*_student_stats_YYYY-MM-DD.csv` — ready for the gradebook
- `*_all_matches_YYYY-MM-DD.csv` — every match, pairs and scores
- `*_pickleball_backup_YYYY-MM-DD.json` — full restorable state

The Schedule tab also prints cleanly (*Print*) for a paper copy to post courtside.

---

## The student board (`board.html`)

Read-only. Students get: what is on each court right now, the team table,
each team's roster with individual records, the full schedule by session,
and a name search that shows one student's own fixtures — partner,
opponents, score, result.

There are no scoring, team or reset controls on the page at all.

### Getting data to it

The board holds no data of its own. It looks in three places, in order:

1. **A board link.** Setup → *Copy student board link*. The whole
   tournament is encoded into the link itself (about 2 KB), so it works the
   moment you paste it into the class group chat — no commit, no waiting.
   Send a fresh link after each session; the old one keeps showing the old
   scores.
2. **`data.json` in the repository.** Setup → *Download data.json*, then
   commit it to the repository root beside `board.html`. Students open the
   plain `board.html` URL and the page loads it by itself, re-checking every
   30 seconds. Best for a QR code or a link you only hand out once.
3. **The teacher's own browser.** Opened on the scoring device, `board.html`
   reads the live tournament straight from local storage — handy for casting
   to a screen courtside.

A link only carries what had been recorded when you copied it. Nothing on
the board is live across devices; the teacher's device is always the source
of truth.

## Editing a schedule by hand

On the Schedule tab, the ✎ on any match card opens an editor for its four
players, session, slot and court. From there you can also reset that match's
score or delete the match. *Reshuffle all pairs* redraws every unplayed
pairing.

Students can be added or removed from the roster at any time (Teams tab).
Removing a student also removes any match they were scheduled in.

---

## Deploy to GitHub Pages

1. Create a new repository, e.g. `ped013-pickleball`.
2. Upload `index.html`, `board.html`, `README.md`, `LICENSE` and `.nojekyll`
   to the repository root.
3. **Settings → Pages → Build and deployment** → Source: *Deploy from a branch*,
   Branch: `main`, folder: `/ (root)`. Save.
4. After about a minute the app is live at
   `https://<your-username>.github.io/ped013-pickleball/`.

Or from a terminal:

```bash
git init
git add index.html board.html README.md LICENSE .nojekyll
git commit -m "PED013 pickleball tournament manager"
git branch -M main
git remote add origin https://github.com/<your-username>/ped013-pickleball.git
git push -u origin main
```

Then enable Pages as in step 3.

**Note on a public URL:** each device that opens the page keeps its own
separate data. Scores entered on your phone do not appear on a student's
phone. Score every match on one device, or export and import the JSON backup
to move the tournament between devices.

---

## Settings reference (Setup tab)

| Setting | Default | Notes |
|---|---|---|
| Sessions | 8 | Number of class meetings |
| Courts | 2 | Courts running in parallel |
| Match slots / session | 4 | Match rounds per session per court |
| Session length | 60 min | Only used to print slot start times |
| Games per team tie | 3 | Doubles games each tie is decided over |
| Never repeat a partnership | on | Strict rotation; see *The bypass* above |
| Points to win | 11 | |
| Switch ends at | 6 | Set to 0 to disable |
| Hard cap | 15 | Ends the game regardless of margin |
| Must win by 2 | on | |
| League pts per game won | 2 | |

Changing sessions, slots or courts re-places the existing schedule; recorded
scores are kept.

---

## File structure

```
index.html    teacher app — markup, styles, logic, class roster
board.html    student board — read-only
data.json     optional; published tournament data for the board
README.md     this file
.nojekyll     tells GitHub Pages to serve the files as-is
LICENSE       MIT
```

No dependencies, no network calls, no tracking.
