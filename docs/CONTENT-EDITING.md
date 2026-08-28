# Editing the Lanshore website

For whoever writes the blog posts, case studies and white papers. No git, no code, no Vercel.

---

## Signing in

Go to **https://lanshore.com/studio/signed-out** and press **Sign in with Google**.

Bookmark that address. It is the only way in — the admin is deliberately not linked from anywhere on the public site.

**If you get a "page not found":** that is normal when you are signed out. It is not a broken link. Only `/studio/signed-out` is reachable without signing in; everything else behind it looks like a missing page on purpose, so that people poking around cannot tell the admin exists.

**If Google says your account is not permitted:** your address has not been added to the allow list. That is an environment variable a developer sets in Vercel, not something you can change from the admin.

**It will not work on preview links** (anything ending `.vercel.app`). Only the real site. That is intentional — a preview must not be able to publish.

---

## The four buttons

| Button | What it does |
|---|---|
| **Save draft** | Stores your work. Nothing appears on the public site. |
| **Publish** | Makes it live. |
| **Unpublish** | Takes it down. The address stops working, but nothing is lost — you can publish it again any time. |
| **Delete** | Permanently removes it. Refused for anything that has ever been published. |

### Why Delete is refused for published pages

Once a page has been live, its address may be linked from elsewhere — an email, a LinkedIn post, Google's index. Deleting it would leave those links broken with no forwarding address.

**Use Unpublish instead.** It hides the page while keeping the address under our control, and it is reversible in one click.

If something genuinely must be removed for good, a developer has to add a forwarding rule first. Ask, and say which page.

You may also see a refusal like *"a permanent redirect from the old site points at this page"*. Some pages are the destination of a forwarding rule from the pre-2026 website. Taking those down would break a link that still gets traffic, so the admin stops you before anything is saved rather than letting it fail later.

---

## After you press Publish

1. Your change is saved to the website's source.
2. The site rebuilds automatically. **This usually takes one to three minutes.**
3. The page appears.

**You will not see the change instantly, and that is normal.** Give it a couple of minutes and refresh.

### If it does not appear

Something in the rebuild failed. **The live site is unaffected** — it keeps serving the previous version until a good build replaces it, so a mistake can never take the site down.

Contact a developer with the page you were editing. They will see the failure notification.

---

## The fields

### Blog posts

- **Title / Description** — the description is what shows in Google results and link previews.
- **Card summary** — the shorter blurb on the Resources page.
- **Last updated** — **bump this when you change the words, not when the page is restyled.** Search engines only trust this date if it is honest, and a site that restamps everything on every deploy gets the signal ignored entirely.
- **Body** — Markdown. `## ` starts a heading, `### ` a sub-heading, `- ` a bullet.

The **preview on the right is exactly what will publish.** It uses the same renderer as the live page, so if it looks right there, it is right.

### Case studies

- **Pillar** is a dropdown, not free text. The value feeds the page's structured data, so it has to be one of the four.
- **Results** are the only numbers on the site. Keep them defensible.
- **Original address** is read-only — provenance from the old site.

### White papers

- **PDF** — up to 4 MB. It is renamed automatically to match the web address.
- **HubSpot value** — must match an option of the `whitepaper_requested` contact property.

> **Adding a brand-new white paper currently needs one 2-minute step in HubSpot** before the download will record properly: the `whitepaper_requested` property is a dropdown, so a new value has to be added there first. Editing existing papers is unaffected. Ask a developer to switch that property to free text and this step disappears.

---

## The web address cannot be changed

You set it once, when you create the item. After that it is locked.

Changing an address breaks every existing link to it, so it needs a developer to add a forwarding rule at the same time. If an address is wrong, ask — do not create a duplicate.

---

## Two people editing at once

If someone else changes an item while you have it open, you will see:

> *This item changed since you opened it — reload to see the current version.*

Reload and re-apply your edit. Nothing of theirs was overwritten, and nothing of yours was saved. This is deliberate: the alternative is one of you silently losing work.

---

## Who publishes what

Every change records the Google account that made it. `git log` answers "who published this and when" without anyone maintaining a list.

---

## For developers

### Access

Add or remove an email in `ADMIN_ALLOWED_EMAILS` in Vercel, then redeploy. Removal takes effect on that person's **next request** — their existing session stops working immediately rather than lasting out its eight hours.

An empty or unset `ADMIN_ALLOWED_EMAILS` authorises **nobody**. It is never read as "allow everyone".

### The GitHub token — READ THIS

Publishing uses a fine-grained personal access token, `GITHUB_TOKEN` in Vercel, scoped to this repository with **Contents: read and write**.

**Fine-grained tokens expire.** When it does, **publishing silently stops working** — the admin will report that publishing is unavailable, and nothing else will look wrong.

| | |
|---|---|
| **Expiry date** | ⚠️ **NOT RECORDED — fill this in** |
| **Who rotates it** | ⚠️ **NOT RECORDED — name someone** |

Put a calendar reminder a month before. This will otherwise surface a year from now, to someone who was not involved in setting it up.

### Commit authorship

Commits are authored with the editor's Google address. Git accepts any author, so this works, but the address will not link to a GitHub profile and `git shortlog` treats it as its own identity. That is the intended trade — the audit trail matters, the avatar does not.

### What the admin cannot edit

Services, pillars, industries, the glossary, navigation, and all copy outside the three collections stay developer-owned in `src/lib/`.
