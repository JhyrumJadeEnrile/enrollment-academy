# Northfield Studio — Enrollment Website

A plain HTML/CSS/JavaScript enrollment website. No build tools, no
frameworks, no backend — it runs by opening `index.html` in a browser,
from a local server, or from GitHub Pages.

## Structure

```
enrollment-academy/
├── index.html        Home page
├── courses.html       Course catalog
├── enroll.html        Enrollment form
├── success.html        Confirmation page (reads the last submission)
├── admin.html          Local view of everything submitted on this device
├── contact.html        Contact details
├── 404.html            Shown by GitHub Pages for unknown URLs
├── css/
│   └── styles.css      All styling (design tokens at the top)
├── js/
│   ├── nav.js           Mobile nav toggle + active link + footer year (all pages)
│   ├── validate.js       Reusable validation helpers
│   ├── enroll.js         Enrollment form: validation, save, redirect
│   ├── success.js        Renders the confirmation summary
│   └── admin.js          Renders/clears the local enrollment list
├── .gitignore
└── README.md
```

## Why multiple HTML files instead of one single-page app

This site uses real, separate `.html` files with normal links
(`<a href="courses.html">`) instead of a JavaScript router. That is
a deliberate choice so the site works in **every** context without
extra configuration:

- Opening `index.html` directly from disk (`file://`) — every link
  and page still works.
- A simple local server (e.g. VS Code's Live Server) — works.
- GitHub Pages — works with zero routing configuration, because each
  page is a real file at a real URL. (A JS-only "history" router
  would 404 on refresh or direct links unless the host is configured
  to redirect every path back to `index.html` — GitHub Pages doesn't
  do that by default.)
- With JavaScript disabled — the pages still render and are readable;
  only the enrollment form's client-side validation/save step needs
  JavaScript, and that page shows a visible `<noscript>` notice.

## How data is stored

Submitted enrollments are saved in the browser's `localStorage`, on
whatever device the form was filled in on. There is no server and no
database — this is intentional for a "basic" site. To view what's
stored, open `admin.html`. To wire this up to a real backend later,
replace the `saveRecord()` function in `js/enroll.js` with a `fetch()`
call to your API.

## Running it locally

You don't need a server, but one avoids a few browser quirks (some
browsers restrict `localStorage` on `file://` pages):

- **VS Code**: install the "Live Server" extension, right-click
  `index.html` → **Open with Live Server**.
- **No extension**: just double-click `index.html`.

---

## Publishing to GitHub using VS Code

### 1. Install prerequisites (one-time)

- [Git](https://git-scm.com/downloads) — required for any of this to work.
- [VS Code](https://code.visualstudio.com/) — you're likely already using it.
- A free [GitHub](https://github.com/) account.

### 2. Open the project folder in VS Code

- **File → Open Folder…** and select the `enrollment-academy` folder
  (the one containing `index.html`).

### 3. Sign in to GitHub inside VS Code

- Click the **Accounts** icon in the bottom-left corner of VS Code.
- Choose **Sign in with GitHub** and complete the browser sign-in.

### 4. Initialize Git and make your first commit

Easiest path — VS Code's built-in UI:

1. Click the **Source Control** icon in the left sidebar (or `Ctrl+Shift+G` / `Cmd+Shift+G`).
2. Click **Initialize Repository**.
3. Type a commit message, e.g. `Initial commit — enrollment website`.
4. Click the **✓ Commit** button.

Or the same thing from VS Code's integrated terminal
(**Terminal → New Terminal**):

```bash
git init
git add .
git commit -m "Initial commit — enrollment website"
```

### 5. Publish to GitHub

Easiest path — still in the **Source Control** panel:

1. Click **Publish Branch** (or **Publish to GitHub** if you see that instead).
2. Choose **Publish to GitHub public repository** (or private, your choice).
3. VS Code creates the repository under your account and pushes your
   commit automatically.

Or from the terminal, after creating an empty repository on
github.com (no README/license, so it stays empty):

```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

### 6. Turn on GitHub Pages (to get a live URL)

1. On github.com, open your repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose `main` and folder `/ (root)`, then **Save**.
5. Wait a minute, then refresh — GitHub shows your live URL, typically:
   `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

That URL serves `index.html` as the homepage automatically, every
other `.html` file at its own address (e.g. `.../courses.html`), and
`404.html` for any unknown address — so all the routing in this
project works there with no extra setup.

### 7. Making future changes

Whenever you edit files in VS Code:

1. **Source Control** panel → review the changed files.
2. Type a commit message → **✓ Commit**.
3. Click **Sync Changes** (or **Push**) to send it to GitHub.
4. GitHub Pages redeploys automatically within a minute or two.
