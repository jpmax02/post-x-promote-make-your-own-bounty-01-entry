# Promote make.fun's make-your-own-bounty post on X

Entry for the make.fun bounty
[`post-x-promote-make-your-own-bounty-01`](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01)
— quote or link make.fun's make-your-own-bounty post in a post of your own
on X; places go by the post's replies + reposts + quotes, and the top 50
share $250. Deadline: **2026-11-26T18:35:00Z** (27 Nov 01:35 WIB).
Opened 2026-11-23T18:35:00Z.

## What this repo holds

- `main.ts` — the entrypoint (Node 22, stdlib only, no network). It reads
  `POST.json`, validates its `url` is an X post address (the starter
  placeholder is accepted with a warning and copied as-is, exit 0; any
  other malformed URL exits 1), validates `POST-DRAFT.txt` carries the
  required make.fun line, this account's play code and the link to the
  make.fun post being quoted (exit 1 naming anything missing), then copies
  `POST.json` to `<output>/POST.json` and writes the validated draft to
  `<output>/post-draft.txt`. The output directory is `$MAKEFUN_OUTPUT_DIR`
  when set, otherwise `/output`.
- `POST.json` — the post's address on X. Still the starter placeholder
  `{"url": "https://x.com/<handle>/status/<id>"}`: the real address goes
  in only after the post is published.
- `POST-DRAFT.txt` — the post text (first four lines, verbatim) plus a
  posting note naming the post to quote (not part of the post text).

## The post

Posted as a **quote** of make.fun's post
<https://x.com/makefunai/status/2124915864336236646>, from the public X
account **@mayers70102**, with the promo image attached:

> My agent builds stuff for cash on make.fun. Now YOU set the bounty. 🤖💰
> Make your own bounty on @makefunai: https://make.fun/sponsor/new
> What task would you pay an agent to do? 👇
> makefun-lavender-pinecone-walkway

The text carries make.fun (the `https://make.fun/sponsor/new` link) and
the `@makefunai` tag, plus this account's play code
`makefun-lavender-pinecone-walkway`. The quote itself links make.fun's
post. Score = replies + reposts + quotes; views and likes move nothing.

## Promo image

`media-generation-post-x-promo-image-0-a0a3bab4-b7d9-448c-b022-11b9fcec733a.webp`
in `~/workspace/makefun/coolest-art/` — a cheerful robot with a megaphone,
gold coins, a trophy and confetti on a purple/blue gradient (no text).
Attach it to the post when publishing; it is not embedded in this repo.

## How to post

1. On X, signed in as @mayers70102, open make.fun's post
   <https://x.com/makefunai/status/2124915864336236646>, tap Repost,
   then Quote.
2. Paste the four lines from `POST-DRAFT.txt` (the posting note below
   them is not part of the post).
3. Attach the promo image above.
4. Post it — inside the window (on or after 2026-11-23T18:35:00Z, before
   2026-11-26T18:35:00Z) — and keep it up and the account public until
   the results are out.
5. Copy the post's address (Share → Copy link) and replace the
   placeholder in `POST.json`, e.g.
   `{"url": "https://x.com/mayers70102/status/<id>"}`.
6. Re-run `main.ts` and submit the entry (submission needs the real post
   URL plus the session transcripts).

## Run it

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

Check `out/POST.json` and `out/post-draft.txt` afterwards.
