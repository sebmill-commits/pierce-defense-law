# Pierce Defense / Seattle Defense website — signup pipeline status (2026-10-08)

Repo `~/pierce-defense-law` (Next.js on Vercel) serves **piercedefense.com** and **defense.rivercrestlaw.com**.
Flow: site → Stripe Checkout → Stripe webhook (`app/api/stripe/webhook/route.ts`) → Apps Script webhook
(`docs/pierce-website-webhook.gs`, deployed at the `/exec` URL in Vercel env) → PDL- row on the Dashboard.
DUI consult form → `/api/dui-intake` → same Apps Script webhook → Dashboard row.

## Numbers

**Signups (Stripe, Pierce Defense Law account):** 7 paid clients since 8/3, pace accelerating.

| Date | Client | Court | Fee | Row id | Notes |
|---|---|---|---|---|---|
| 8/3 | Amman Malik | Snohomish DC South (Lynnwood) | $214 | PDL-260803-001 | Seattle site; emailed worried, no receipt |
| 8/20 | Andrii Hlinchuk | King County DC | $199 | PDL-260820-001 | emailed "did you get it?" same day |
| 9/13 | Oleg Pisman | KCDC East (Issaquah) | $199 | PDL-260913-001 | NOA + discovery filed 9/15 |
| 9/22 | Andrii Hlinchuk (2nd ticket) | King County DC | $249 | PDL-260922-001 | emailed "confirm payment?" again |
| 10/3 | David Park | Pierce County DC | $199 ×2 | PDL-261003-001 | **double-charged** (no confirmation screen); 2nd refunded; NOA generated, not filed; he followed up 10/7 |
| 10/5 | Dylon Johnson | KCDC South (Burien) | $249 | PDL-261005-001 | no NOA yet; phone (148) 024-4400 looks mistyped |
| 10/5 | Ramon Gonzalez | Pierce County DC | $199 | PDL-261005-001 (**dup id**) | no NOA yet |

**DUI consult form:** 2 submissions, both 10/8, both landed as blank NEW_INTAKE rows (no citation, no court,
arrest details discarded): Arif Carey (you called him 10:23 AM, signed $2,000 Docusign same day) and
**Blanca Zetino (row 284, id PDL-261008-001 — duplicate id, no callback on record)**.

**Traffic:** no Vercel Analytics on this project (package not installed). Google Search Console,
piercedefense.com, last 3 months: 30 clicks / 12.4K impressions / 0.2% CTR / avg position 7.9. Clicks are
almost all brand ("sebastian miller attorney"); the big impression terms get zero clicks
("criminal defense lawyer" 1,465 imp, "dui lawyer" 347, "tacoma criminal defense lawyer" 335). Google Ads
account 703-783-8488 has **no campaigns and $0 spend** — the recent signups are organic + referral.

## What is broken (confirmed)

1. **No receipt / welcome email.** `RESEND_API_KEY` was never set in Vercel; the 8/4 fix is still uncommitted.
   Stripe's own receipt is also off (`receipt_email` fix uncommitted). 4 of 7 clients emailed to ask if the
   payment went through.
2. **No attorney notification.** Nothing tells you a row was created. Park's double charge and Zetino's
   DUI request were only visible by reading the sheet.
3. **DUI consults are invisible.** The webhook writes them as traffic rows with every DUI field dropped;
   the site promises "I'll call you shortly".
4. **Duplicate case ids.** `piercePdlId_` scanned column A (First Name) instead of the OTRI-ID column, so every
   id is `-001` and same-day signups collide (10/5 ×2, 10/8 ×2).
5. **No duplicate-payment guard.** A second checkout for the same ticket creates a second charge.
6. **Confirmation screen sometimes doesn't render after Stripe** (Park: "it took me back to inputting my
   information"). Not reproduced; most likely the Stripe return hit a different origin than the one holding
   `localStorage` (www vs apex, or Safari). The server-side guard in #5 limits the damage.
7. **Seattle signups tagged as Pierce.** `webhook/route.ts` hard-coded `source: "PIERCE_DEFENSE_WEBSITE"`;
   patched locally today (uncommitted).
8. **Credentials expired on this Mac:** `clasp` (Apps Script) and `vercel` CLI both need re-login before
   anything can be deployed from here. The webhook's Apps Script project is not in `~/rivercrest-appscript`
   (no `doPost` there) — it is a separate project; `clasp list` after login will show which.

## What was built today (not deployed)

- `docs/pierce-website-webhook.gs` **v2** — attorney email on every intake (paid / DUI / duplicate) to
  support@ + sebastian@rivercrestlaw.info; DUI rows get `DUI-` ids, status `DUI_CONSULT`, tag
  `WEBSITE_DUI_CONSULT`, arrest details + DOL deadline in Filing Notes; id scan fixed + LockService;
  duplicate guard (same email + citation, or same email within 2 h → annotate + alert, no second row);
  client welcome/receipt email from Gmail with the agreement attached, **gated off**
  (`PIERCE_SEND_CLIENT_WELCOME = false`) until you approve the body — `pierceTestWelcomeEmail()` sends a
  sample to support@.
- `app/api/stripe/webhook/route.ts` — source pass-through (fix #7). The 8/4 changes (receipt_email, photo
  compression, agreement PDF, Resend email) remain uncommitted in the working tree.

## Deployed 2026-10-09 00:05

Webhook v2 is live: deployment `AKfycbz6…HDV7` ("piercedefense") moved from version 140 to **143** (same URL).
Root cause of the drift: the webhook file had been dropped from HEAD by a later `clasp push`; it is now back in
`~/rivercrest-appscript/PierceWebsiteWebhook.js`. Verified with a live DUI test post → row 292
`DUI-261009-001` ("Test Dui-Delete-Me" — **delete this row**) and the alert email landed in support@ at 00:05.
Client welcome email still gated off.

## defense@rivercrestlaw.com does not exist (found 10/9)

The Seattle site (defense.rivercrestlaw.com) published `defense@rivercrestlaw.com` as its contact address and the
welcome email used it as reply-to. rivercrestlaw.com mail is on Microsoft 365, and the M365 edge rejects that
address outright (`550 5.4.1 Recipient address rejected` on an SMTP probe; `sebastian@rivercrestlaw.com` is
accepted). Every client who wrote to it bounced — which is where Amman Malik's "several worried emails" went in
August. Sebastian's own test from Outlook at 00:51 on 10/9 will bounce the same way. Fixed in code by replacing it
with `sebastian@rivercrestlaw.com` in `lib/seattle-constants.ts`, `webhook/route.ts`, and the Apps Script webhook
(pushed). Alternative: create `defense@` as an alias on Sebastian's M365 user (Admin center → Users → Sebastian →
Manage email aliases) and the site copy could stay. Agreement 10/9 rev 2: defense@ removed, attorney sign-off with
WSBA #50261 added.

## Still to ship (in order)

1. `! npx vercel login` in a session (clasp is done).
2. Delete Dashboard row 292 (DUI-261009-001 test).
3. Review the welcome email (`pierceTestWelcomeEmail()` → support@) and the agreement PDF. **10/9: rebuilt as
   one page on letterhead** — `docs/Website_TrafficInfraction_RepresentationAgreement_2026-10-09.pdf` (editable
   `.docx` beside it; HTML source `docs/representation-agreement-source.html`, printed with headless Chrome).
   Installed at `public/documents/representation-agreement.pdf` and on Drive (`OTR Cases/_Website/`, id wired
   into the webhook so the email attaches it before the Vercel push). The 8/4 three-page draft is
   `docs/representation-agreement_v1_3page_2026-08-04.pdf`. Flip
   `PIERCE_SEND_CLIENT_WELCOME = true` in `PierceWebsiteWebhook.js`, then `clasp push` + the same `clasp deploy -i …` line. Resend is no longer needed.
4. Commit + push the website tree (Vercel auto-deploys from GitHub): Stripe receipts turn on, photos stop
   failing on size, the agreement PDF goes live, source tagging fixed.
5. Stripe dashboard → Settings → Customer emails → enable "Successful payments" (belt and braces).
6. Today's casework: Zetino DUI callback; NOA for Park / Johnson / Gonzalez; fix Johnson's phone; renumber
   Gonzalez to PDL-261005-002 and Zetino to DUI-261008-001.

## Recommended, not built

- Add `@vercel/analytics` to the project (one import) so /traffic-report can cover this site.
- Confirmation page: show the Stripe session id and "check your email for the receipt"; if the page
  loads with a recent `intakeState` but no `success` param, show "If you already paid, do not pay again".
- Page titles for the zero-click high-impression terms ("criminal defense lawyer", "dui lawyer",
  "tacoma criminal defense lawyer") — the site ranks on page 1 for them and gets no clicks.
- The DUI form's "I'll call you shortly" promise should be backed by the alert, or softened to
  "within one business day".
- `/api/intake` is dead code (nothing calls it); delete to avoid confusion.
