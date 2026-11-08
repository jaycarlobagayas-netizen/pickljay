# Pickljay — setup, start to finish

Everything below is done once. Budget about 20 minutes. Nothing here costs
money: Firebase's free Spark plan covers a class this size many times over,
and it never sleeps.

When you finish you will have **one link** to give the class, **one password**
for all 43 students, and **one password** for yourself.

---

## Part 1 — Firebase (about 8 minutes)

### 1.1 Create the project

1. Go to **https://console.firebase.google.com** and sign in with a Google account.
2. Click **Create a project** (or **Add project**).
3. Name it `pickljay`. Click **Continue**.
4. On the Google Analytics step, switch it **off** — you do not need it. Click **Create project**.
5. Wait for it to finish, then click **Continue**.

### 1.2 Create the database

1. In the left sidebar: **Build → Firestore Database**.
2. Click **Create database**.
3. Choose **Start in production mode**. (Test mode would leave your data open
   to anyone. The rules you paste in step 1.4 replace this anyway.)
4. For location choose **asia-southeast1 (Singapore)** — the closest region to
   General Santos. **This cannot be changed later.**
5. Click **Enable** and wait for the empty database to appear.

### 1.3 Turn on sign-in

1. Left sidebar: **Build → Authentication → Get started**.
2. Under *Sign-in method*, click **Email/Password**.
3. Turn on the **first** toggle (Email/Password). Leave *Email link* off.
4. Click **Save**.

### 1.4 Create the two accounts

Still in **Authentication**, open the **Users** tab and click **Add user**
twice.

| # | Email | Password | Who uses it |
|---|---|---|---|
| 1 | `admin@pickljay.local` | one only you know | you |
| 2 | `student@pickljay.local` | the one you tell the class | all 43 students at once |

These addresses do not need to be real mailboxes — nothing is ever emailed to
them. They are just usernames. Use at least 6 characters for each password;
Firebase rejects anything shorter.

> **Write both passwords down somewhere safe now.** There is no inbox to send
> a reset link to, so a forgotten password means creating the user again.

### 1.5 Paste in the security rules

1. **Build → Firestore Database → Rules** tab.
2. Delete everything in the editor.
3. Open `firestore.rules` from this repository, copy all of it, paste it in.
4. Check the line near the top that reads:
   ```
   request.auth.token.email == 'admin@pickljay.local'
   ```
   If you used a different admin address in step 1.4, change it here to match
   **exactly**, including capitalisation.
5. Click **Publish**.

These rules are what actually protect the tournament. They let any signed-in
person read the scoreboard, let only the admin address change scores, and keep
your working copy out of students' reach.

### 1.6 Copy your settings

1. Click the **gear icon** (top left, beside *Project Overview*) → **Project settings**.
2. Scroll to **Your apps** and click the **`</>`** (web) icon.
3. App nickname: `pickljay`. Leave *Firebase Hosting* unticked. Click **Register app**.
4. You will see a block like this. **Copy it** — you need it in Part 2.

```js
const firebaseConfig = {
  apiKey: "AIza………",
  authDomain: "pickljay-xxxxx.firebaseapp.com",
  projectId: "pickljay-xxxxx",
  storageBucket: "pickljay-xxxxx.firebasestorage.app",
  messagingSenderId: "0000000000",
  appId: "1:0000000000:web:aaaaaaaaaaaa"
};
```

These values are **not secrets**. They identify your project, nothing more, and
they are meant to sit in public web pages. Your security rules do the guarding.

---

## Part 2 — Edit one file (about 3 minutes)

Open **`firebase-config.js`** and fill in the three marked sections:

```js
window.PJ_CONFIG = {
  firebase: {
    apiKey:            "AIza………",                         // from 1.6
    authDomain:        "pickljay-xxxxx.firebaseapp.com",
    projectId:         "pickljay-xxxxx",
    storageBucket:     "pickljay-xxxxx.firebasestorage.app",
    messagingSenderId: "0000000000",
    appId:             "1:0000000000:web:aaaaaaaaaaaa"
  },

  adminEmail:   "admin@pickljay.local",      // must match 1.4 and the rules
  studentEmail: "student@pickljay.local",    // must match 1.4

  defaultSlug: "ped013"                      // your class code; anything short
};
```

Copy the values **one by one** out of the Firebase block. Keep every quote mark
and comma exactly where it is. This is the only file you ever edit.

---

## Part 3 — Put it online (about 4 minutes)

1. Go to your repository: **https://github.com/jaycarlobagayas-netizen/pickljay**
2. Click **Add file → Upload files**.
3. Drag in **all eight files** from the zip:

   ```
   index.html          firebase-config.js      README.md
   app.html            db.js                   SETUP.md
   board.html          firestore.rules         LICENSE
   scorer.html         .nojekyll
   ```

   Unzip first and drag the **files**, not the folder, or GitHub will nest them
   in a subfolder and nothing will load. `.nojekyll` is hidden by default — on a
   Mac press <kbd>⌘</kbd><kbd>⇧</kbd><kbd>.</kbd> to reveal it, on Windows tick
   *Hidden items* in the View tab.
4. Scroll down, click **Commit changes**. Replacing the old files is correct.
5. **Settings → Pages** should already say *Deploy from a branch · main · / (root)*.
   Give it a minute.

Your site: **https://jaycarlobagayas-netizen.github.io/pickljay/**

---

## Part 4 — First run (about 4 minutes)

1. Open the site. You should see the **Pickljay sign-in** page.
   - *"Not set up yet"* means `firebase-config.js` still has `PASTE…` in it.
2. Choose **I'm the teacher**, enter your admin password, click **Sign in**.
   You land in the teacher app.
3. **Teams** tab → set **6** teams → *Create teams* → *Random balance*.
4. **Schedule** tab → *Generate schedule*. You should get 45 matches.
5. **Setup** tab → **Live sync** → check the class code says `ped013` →
   **Turn on live sync**. The pill at the top turns **● live**.
6. Click **Copy class link**. That is the one link for the class.

### Check it actually works before class

On your phone, open the class link, choose **I'm a student**, enter the student
password. You should see the board. Now record a score on your laptop — the
phone should change within a second or two, by itself.

If it does, you are finished.

---

## What to tell your students

> Open **https://jaycarlobagayas-netizen.github.io/pickljay/#ped013**
> Tap **I'm a student**, password: **(the one you chose)**
> Bookmark it. It stays correct for the whole tournament.

Everyone uses that same password at the same time — Firebase puts no limit on
how many people are signed into one account.

---

## Running a session

| You want to | Do this |
|---|---|
| Mark who is absent | **Attendance** tab, tap ✕ beside a name |
| Enter a score | **Schedule** tab, type both numbers, *Save score* |
| Score rally by rally | Tap the match card itself |
| Give a match away | *Win by default* on the card |
| Accept a scoring team's result | **Duties** tab → *Results waiting* → *Accept* |
| Change anything already recorded | *change* on the card, or the ✎ |

Everything you do is published within about a second. You never send a new link.

### How a scoring team sends you results

They are already signed in on the student account. From the board they tap
**✎ Score a match**, pick their team, and enter scores for the matches they are
refereeing. Each one lands in your **Duties → Results waiting** within a second,
where you *Accept* or *Discard*. Nothing a student sends changes a score on its
own.

---

## If something goes wrong

| What you see | What it means |
|---|---|
| "Not set up yet" | `firebase-config.js` still has `PASTE…` values |
| "That password is not right" | Wrong password, or the wrong tab (student vs teacher) |
| "That account does not exist yet" | The user in Authentication → Users does not match the address in `firebase-config.js` |
| "Email sign-in is not switched on" | Step 1.3 was missed |
| "You are not allowed to do that" | The admin address in `firestore.rules` does not match the one you signed in with |
| **⚠ sync error** in the teacher app | No connection. Scores are safe on your device and will be sent when it returns |
| Board says "Nothing published for class code…" | Turn on live sync in **Setup**, or the class code differs |
| Signed in as a student but seeing the teacher app | Sign out and back in; the admin address decides the role |

Your scores are always written to your own device first. Losing signal never
loses a score.

---

## Backups

Live sync is not a backup — it is a copy of the current state. Before and after
each session, use **Setup → Export backup (JSON)**. That file restores
everything, including attendance and substitutions, on any device.

Signing in as the teacher on a *new* device pulls the tournament back from the
server by itself, which covers a lost or flat phone.

---

## What each file does

| File | Purpose |
|---|---|
| `index.html` | Sign-in page — the link everyone opens |
| `app.html` | Teacher app; only the admin account can open it |
| `board.html` | Student board, live |
| `scorer.html` | Scoring sheet for the team on duty |
| `db.js` | Talks to Firebase. Do not edit |
| `firebase-config.js` | **The only file you edit** |
| `firestore.rules` | Paste into the Firebase console; not used by the site |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

---

## Costs

Free Spark plan limits are 50,000 document reads and 20,000 writes per day.
A full session with 43 students watching uses roughly 2,000 reads and a few
hundred writes, because Firestore sends one update per change rather than
polling. You would need about twenty classes a day to approach the limit, and
the plan has no card attached, so it cannot bill you by surprise.
