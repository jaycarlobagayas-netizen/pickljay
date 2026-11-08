/* ============================================================
   PICKLJAY — the only file you need to edit.
   Paste the firebaseConfig block from the Firebase console below,
   then set the two account addresses to match the users you made.
   ============================================================ */

window.PJ_CONFIG = {

  /* ---- 1. From Firebase console -> Project settings -> Your apps -> </> ---- */
  firebase: {
    apiKey:           "AIzaSyCa2bA1Tag8k5JRT4hqI5Hzttgqil1A6tI",
    authDomain:      "pickljay.firebaseapp.com",
    projectId:         "pickljay",
    storageBucket:    "pickljay.firebasestorage.app",
    messagingSenderId: "1057912831490",
    appId:             "1:1057912831490:web:9f8d1e66508c2885ceb11b",
  },

  /* ---- 2. The two accounts you created under Authentication -> Users ---- */
  adminEmail:   "admin@pickljay.local",     // you
  studentEmail: "student@pickljay.local",   // shared by the whole class

  /* ---- 3. Optional: a fixed class code so nobody has to type one ---- */
  defaultSlug: "ped013"
};
