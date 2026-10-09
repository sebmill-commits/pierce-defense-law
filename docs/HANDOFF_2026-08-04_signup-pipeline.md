# Handoff Memo — Website Signup Pipeline Fixes (2026-08-04)

**Context:** First real self-signup client came through the website 8/3 and the row appeared in the case sheet, but the client got no receipt, no rep agreement, and his citation photo never arrived. This session diagnosed all three, implemented fixes, and left them **uncommitted** in `~/pierce-defense-law` pending Sebastian's review.

---

## 1. The client (needs action THIS WEEK)

| Field | Value |
|---|---|
| Name | **Amman Malik** |
| Email | fastandeasyservices@gmail.com |
| Phone | (561) 379-9205 |
| Court | Lynnwood Municipal Court |
| Citation | T00647243 — Speeding 16-20 over |
| Citation issued | **7/16/2026** → 30-day response deadline ≈ **8/15/2026** |
| Hearing date | not provided at intake |
| Paid | $214.00 on 8/3/2026, via the **Seattle site** (defense.rivercrestlaw.com) |
| Stripe session | `cs_live_a1DRCBssJdXBXy0jOzb1yGu04GjfPPKJdnUtZaGdkwl6f1wdVUYIlFTI3B` |
| Payment intent | `pi_3U0SP8AqIgQdLnZN0wXEPNtJ` |

**Outstanding for Amman:**
- [ ] Send/forward his Stripe receipt — link ready: [receipt URL](https://pay.stripe.com/receipts/payment/CAcQARoXChVhY2N0XzFTbnVrM0FxSWdRZExuWk4ond_I0wYyBj7YLIHEHzosFm3vUGKq7oYPkl9H4p1cHqXFibK2mavJWUWWykKccsqSOzwUkS7JhcfWTNg) (or Stripe Dashboard → Payments → send receipt). He emailed several times worried; his emails were NOT found in intake@ Gmail or the Outlook account — unknown mailbox.
- [ ] Ask him to email his citation photo (none was captured — see bug #3).
- [ ] File hearing request / NOA before the ~8/15 response deadline.
- [ ] Eyeball his PDL- row in the Case Management sheet (Dashboard tab) — name/court/citation columns. I verified against Stripe metadata but could not read the row itself (sheet too large for the Drive tool).

## 2. Root causes found (all confirmed)

1. **No welcome email:** webhook has a `sendRetainerEmail()` that silently skips when `RESEND_API_KEY` is unset — and it was never set in any Vercel environment (`npx vercel env ls` shows no RESEND key). Local `.env.local` contains only a Vercel token; real secrets are Vercel-only (`npx vercel env pull --environment=production .env.production.local`).
2. **No Stripe receipt:** checkout never set `receipt_email` (payment shows `receipt_email: None`) and the dashboard "Successful payments" customer email toggle is presumably off.
3. **No citation photo:** photo posts as base64 JSON at payment time; phone photos exceed Vercel's 4.5MB body limit → request fails → code intentionally swallows the error and proceeds to payment. Photo is also lost entirely if the page reloads pre-payment (File object stripped from localStorage). Drive "Citations Inbox" folder (`1fhsJOvtZp6SWg8PeQmlFwNFKMd1KPL7q`) has only one file, from April.

## 3. Changes implemented (uncommitted, build passes)

Repo: `~/pierce-defense-law` — one codebase serving **both** piercedefense.com and defense.rivercrestlaw.com, with **duplicated intake trees** (`components/intake/` and `components/seattle/intake/`); every intake change was applied to both.

| File | Change |
|---|---|
| `app/api/stripe/webhook/route.ts` | Rewritten email: to client, **cc sebastian@piercedefense.com**, bcc support@rivercrestlaw.info, branded per source site; includes PDL case number (now returned from the Apps Script webhook), receipt details, all four required terms (infractions-only + criminal carve-out; late tickets refunded/declined or extra fee; insurance/registration docs by email with case # in subject); attaches the agreement PDF; logs Resend failures instead of swallowing |
| `app/api/stripe/create-checkout/route.ts` | `payment_intent_data.receipt_email` → Stripe auto-sends receipts |
| `public/documents/representation-agreement.pdf` | New 3-page general Traffic Infraction Representation Agreement (Rivercrest Law PLLC, both brands). Source: `docs/representation-agreement-source.html`; regenerate with headless Chrome `--print-to-pdf` |
| `lib/intake-image.ts` | New: browser-side compression (max 2000px JPEG q0.85) + base64 helper |
| `components/{intake,seattle/intake}/CitationUpload.tsx` | Compress on select, store data-URL in new `citation.imageData` |
| `components/{intake,seattle/intake}/PaymentStep.tsx` | Upload prefers compressed copy; falls back to original file |
| `app/{(pierce),defense}/fight-my-ticket/page.tsx` | `imageData` added to state + persisted in localStorage (quota-safe try/catch) so photo survives reload/Stripe redirect |

`npm run build` passes. `.env.production.local` is git-ignored (verified).

## 4. Blockers only Sebastian can clear (in order)

1. **Review the rep agreement language** — `public/documents/representation-agreement.pdf`. It is my drafting of his terms, not yet attorney-approved. Also review the email body in `webhook/route.ts`.
2. **Resend setup:** create account/API key at resend.com, **verify domain piercedefense.com** (DNS records), then `cd ~/pierce-defense-law && npx vercel env add RESEND_API_KEY` (all environments). From-address defaults to `noreply@piercedefense.com`; optional `RESEND_FROM` env var overrides.
3. **Stripe dashboard:** Settings → Business → Customer emails → enable **"Successful payments."**
4. **Confirm sebastian@piercedefense.com is a live mailbox** (it's the cc target).
5. **Deploy:** commit + push (Vercel auto-deploys). Nothing is committed yet.

## 5. Verification after deploy

- Run a live test signup (small real payment, then refund in Stripe) or use Stripe CLI `stripe trigger checkout.session.completed` against the webhook with test keys.
- Confirm: client email arrives with PDF attached + cc; Stripe receipt arrives; photo lands in Drive Citations Inbox; PDL row created with case number matching the email.
- Watch Vercel function logs for `Resend send failed` / `Citation upload failed` — failures are now logged loudly.

## 6. Session memory

Durable facts saved to auto-memory: `pierce-defense-signup-pipeline.md` (repo serves both sites, duplicate intake trees, Vercel-only secrets, Resend never configured, Amman Malik details).
