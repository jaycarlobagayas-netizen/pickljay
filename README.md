# PED013 Pickleball Class Tournament

A single-file web app for running a class pickleball tournament: manual team
assignment, an automatic round-robin schedule across multiple sessions and
courts, courtside rally scoring, and a running record of every student's games.

Built for a 43-student PED013 section at MSU-GenSan — 8 sessions, 2 courts,
doubles only, games to 11 (rally scoring, switch ends at 6).

Everyone opens the same link and signs in. What they get depends on the
account they use.

| Account | Who | What they see |
|---|---|---|
| **student** | all 43, at the same time | live board, their own record, and the scoring sheet when their team is on duty |
| **admin** | you | everything — teams, schedule, attendance, duties, scoring, exports |

| File | Purpose |
|---|---|
| `index.html` | sign-in page — the one link you hand out |
| `app.html` | teacher app; only the admin account can open it |
| `board.html` | student board, updates itself |
| `scorer.html` | scoring sheet for a team on duty |
| `db.js` | talks to Firebase |
| `firebase-config.js` | **the only file you edit** |
| `firestore.rules` | paste into the Firebase console |

**New here? Read [SETUP.md](SETUP.md)** — it walks through Firebase, the
config file, deployment and the first run, step by step.

---

## Quick start

Finish [SETUP.md](SETUP.md) first — it takes about twenty minutes, once.

Then open the site, sign in as the teacher, and:

1. **Teams** — set 6 teams → *Create teams* → *Random balance*. Rename a team
   by clicking its title.
2. **Schedule** — *Generate schedule*. The full round robin, laid out across
   your sessions, slots and courts.
3. **Setup → Live sync** — *Turn on live sync*, then *Copy class link*.
   Give that link and the student password to the class, once.
4. **Courts / Schedule** — on match day, enter scores. Student phones follow
   within a second.
5. **Rankings / Players** — export CSV for grading.

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
- **Tie winner** = the team that wins the most of the tie's games; an even
  split goes to the team that scored more points across the tie.
- **Partners rotate** — see *Rotation* above.

### Three ways to record a result

**Type a score per team.** Each team's row on a match card has its own score
box. Type `11` and `2`, press *Save score* (or Enter in either box), and the
winner, the win/loss and every table follow from it. The cursor jumps to the
next unplayed match, so a whole session can be entered in one pass. Pasting
`11-2` into one box fills both. A score that could not finish a game — `5-3`,
or `11-10` when win-by-2 is on — is queried before it is stored. Press
*change* on a recorded match to clear it and type again.

**Win by default.** When a team cannot field a pair, press *Win by default*
on the match and pick the team that turned up. The match is recorded at the
target score, flagged `W/O` in the history, and counted as a win for that
team and for the pair who were present. The side that forfeited gets no
personal record — only their team carries the loss.

**Tap rally by rally.** Tap the match card itself to open the live
scoreboard: one tap per rally, switch-ends banner at 6, serve indicator,
undo. Use it when you are watching the game; use the typed score when you are
being handed results between matches.

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

The **Rankings** tab opens on two leader panels — top three teams by league
points, top three students by games won — each showing recent form as a strip
of W/L chips for the last five games. Below them is the full table.

**Team table** — rank, ties won/lost, games played, won, lost, points for,
points against, differential, league points, form, win %. Ties are won or
lost, never drawn: a tie that splits evenly is settled on points scored
across the tie.
League points default to 2 per game won; ranking breaks ties on differential,
then points for.

**Student table** — rank, games played, won, lost, points for, points
against, differential, points per game, form, win %. Students who have not
played yet sort to the bottom and carry no rank.

**Student tracker** — expand any student for their full match log: when they
played, who their partner was, who they faced, the score and the result.

---

## Data and backups

Everything lives in **this browser's localStorage**. With live sync on, a copy
is published to Firebase: a compact version students read, plus your full
working copy, which only the admin account can open.

> **Back up after every session.** Setup → *Export backup (JSON)*. To move to
> another device or recover after clearing browser data, use *Import backup*.

Exports available in Setup and Standings:

- `*_team_standings_YYYY-MM-DD.csv`
- `*_student_stats_YYYY-MM-DD.csv` — ready for the gradebook
- `*_all_matches_YYYY-MM-DD.csv` — every match, pairs and scores
- `*_pickleball_backup_YYYY-MM-DD.json` — full restorable state

The Schedule tab also prints cleanly (*Print*) for a paper copy to post courtside.

---

## Attendance, absences and substitutes

The **Attendance** tab is a session-by-session register. Everyone starts
present; you only mark the exceptions.

Tap **✕** beside anyone who is not there. Immediately:

- they are pulled out of every *unplayed* match in that session;
- an available teammate takes their place — one who is present, free in that
  slot, has played least, and preferably has not partnered the remaining
  player before, so the rotation rules still hold;
- the substitute is tagged **SUB** on the match card.

If nobody can cover, the match is outlined in amber and marked *no cover —
short a player*. Those matches are also collected at the bottom of the
Attendance tab, where you can award them by default or edit them by hand.

**Late arrivals.** Tap ✕ again and they go straight back into the matches
they were pulled from, provided those matches have not been played. The
substitutions are undone with them. *Mark all present* clears a whole
session at once.

Attendance is per session, so marking someone absent for session 3 leaves
sessions 4–8 untouched. Played matches are never rewritten.

Each row also shows that student's running count — games played and games
still scheduled — so you can see at a glance who is falling behind.

### Overriding a pairing by hand

The ✎ on any match card opens the four player dropdowns. Students who are
marked absent for that session, or who are already playing on the other
court in that slot, are labelled as such in the list, so a manual swap
cannot quietly create a clash.

## Scorer and referee duty

Each match is scored and refereed by a team that is **not** playing in that
slot. With 6 teams on 2 courts, four teams are on court at any moment and
the other two take a court each.

The **Duties** tab assigns this automatically when you generate the
schedule, spreading the load evenly. Every match card then shows its
scoring team. To change one, use the dropdown on the Duties tab or the ✎ on
the match card — teams that are playing in that slot are never offered, so
you cannot accidentally make a team score its own game. *Reassign all*
redraws the lot.

### The scorer's own page (`scorer.html`)

Duties → **Copy scorer link** gives each team a link to their own sheet. It
shows only the matches that team is refereeing: the two pairs, a score box
each, and the rules at the top (to 11, win by 2, switch at 6, point on every
rally) so a student referee has them to hand. There is nothing else on the
page — no schedule, no teams, no way to touch another match.

They enter a score and press *Save score*. The sheet checks it the same way
your app does: a game that has not reached the target, or is level, is
refused with an explanation. Saved scores stay on that phone.

### Getting their results back

When the session ends they press **Copy code** and send you a short string
like `R2.jvdsyf.FLGQ2A`. Paste it into Duties → *Results from scorers* →
*Apply results*. Each result is three characters, so a full session is
usually under 30 characters — short enough to read out over the noise of a
gym.

The code carries a fingerprint of the schedule it came from. If you have
regenerated the schedule since handing out the links, the paste is refused
rather than writing scores onto the wrong matches, and you hand out fresh
links.

**You always have the last word.** If a score was already recorded and the
code disagrees, you are asked before anything is overwritten. Anything
imported can be changed afterwards from Schedule or History exactly like a
score you typed yourself.

### With live sync off

The three pages do not talk to each other. A scorer's phone holds its own
results until the code is read out to you, and the student board shows
whatever snapshot you last shared. Your device remains the single source of
truth either way: nothing a student does can change a score without you
accepting it.

## Game history

The **History** tab is the running record: every completed match, newest
first, with the session and court, the winning pair and the beaten pair,
the score, and a note for anything unusual — won by default, or how many
substitutions the match carried. The filter box matches on any student or
team name, so you can pull up one student's full record. *Export CSV* gives
the same thing as a spreadsheet, with the substitution log spelled out.

## The student board (`board.html`)

Read-only. Students get: what is on each court right now, the team table,
each team's roster with individual records, the full schedule by session,
and a name search that shows one student's own fixtures — partner,
opponents, score, result.

There are no scoring, team or reset controls on the page at all.

### Getting data to it

The board holds no data of its own. It looks in four places, in order:

1. **Live sync (recommended).** Setup → *Turn on live sync*, then
   *Copy student link*. Send it once. Every change you make is published
   within a second or two, and the board re-checks every 8 seconds, so
   student phones stay current with no new link ever. See **Live sync**
   below.
2. **A snapshot link.** Setup → *Copy snapshot link*. The whole tournament
   is encoded into the link itself (about 2 KB). It never updates, so you
   send a fresh one after each session. Use it only when live sync is
   unavailable.
3. **`data.json` in the repository.** Setup → *Download data.json*, then
   commit it beside `board.html`. The board loads it and re-checks every
   30 seconds.
4. **The teacher's own browser.** Opened on the scoring device, `board.html`
   reads the tournament straight from local storage — handy for casting to
   a screen courtside.

## Live sync

Live sync publishes the tournament to Firebase so that every signed-in phone
updates by itself, within about a second.

**Turning it on.** Setup → *Turn on live sync*, after checking the class code.
That code appears in the link students open; it is not a secret, because the
password is what gates access.

**What happens afterwards.** Every change — a score, a substitution, a duty
swap — is sent about a second later. The pill in the header reads
`● live` when everything is through, `↻ syncing` while a change is on its way,
and `⚠ sync error` if the server cannot be reached. Scores are always written
to your device first, so a dropped connection costs you nothing: the app keeps
retrying and catches up on its own.

**Scorers send straight to you.** With live sync on, a scoring team's link
becomes a live one. Each score they save arrives in Duties → **Results
waiting**, where you *Accept* or *Discard* it. Nothing a student sends can
change a score by itself. If their phone has no signal the sheet falls back to
the backup code, which you paste under *Results by code*.

**If you ever need to move devices**, restore your JSON backup on the new
device: it carries the address and the edit key, so publishing continues to the
same student link.

**Signing in elsewhere.** Sign in as the teacher on any device and the app
pulls your tournament back from the server by itself. A JSON backup is still
worth keeping, but a flat phone no longer costs you the session.

**Firebase does not sleep**, so there is nothing to wake before class.

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
2. Upload `index.html`, `scorer.html`, `board.html`, `README.md`, `LICENSE`
   and `.nojekyll` to the repository root.
3. **Settings → Pages → Build and deployment** → Source: *Deploy from a branch*,
   Branch: `main`, folder: `/ (root)`. Save.
4. After about a minute the app is live at
   `https://<your-username>.github.io/ped013-pickleball/`.

Or from a terminal:

```bash
git init
git add index.html scorer.html board.html README.md LICENSE .nojekyll
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
scorer.html   scoring sheet for a team on duty
board.html    student board — read-only
data.json     optional; published tournament data for the board
README.md     this file
.nojekyll     tells GitHub Pages to serve the files as-is
LICENSE       MIT
```

All three pages share one link format. If you update one of them, update
the other two in the same push — a `scorer.html` or `board.html` from an
earlier version cannot read a link from a newer `index.html`, and will say
so rather than show wrong data.

No dependencies, no network calls, no tracking.
