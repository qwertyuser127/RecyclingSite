# Hooking up the real AI chatbot (free, no code required beyond copy-paste)

Your OpenAI key should **never** go inside `chatbot.html` or `chatbot.js` — those
are static files sent straight to every visitor's browser, so anything written
there is public. Instead, the key lives on a server and only your site talks to
that server. Here's the free way to do that.

## What's included
- `api/chat.js` — a small serverless function. It receives a chat message,
  calls OpenAI using your key (kept server-side), and sends back the reply.
- `chatbot.js` — updated to call `/api/chat` first. If that endpoint isn't
  deployed yet (e.g. you're just opening the HTML file locally), it
  automatically falls back to the built-in rule-based EcoMind-01 — so the
  chatbot never breaks, it just gets smarter once you deploy.

## Steps (Vercel, free tier, no credit card needed)

1. **Get your files into a GitHub repo.**
   - Create a free GitHub account if you don't have one.
   - Create a new repository and upload all your site files, keeping the
     `api/chat.js` file inside an `api/` folder at the project root (already
     structured that way here).

2. **Sign up at vercel.com** (free) using your GitHub account.

3. **Import the repo** — Vercel → "Add New Project" → pick your GitHub repo →
   Deploy. Vercel auto-detects the `api/` folder and turns `chat.js` into a
   live endpoint at `yoursite.vercel.app/api/chat`. No config needed.

4. **Add your key as an environment variable** (this is the one place the key
   goes — never in a file):
   - Vercel dashboard → your project → **Settings → Environment Variables**
   - Name: `OPENAI_API_KEY`
   - Value: your new key (the one you're about to generate after revoking the
     old one)
   - Save.

5. **Redeploy** (Settings → Deployments → "Redeploy" on the latest one, or just
   push a small change to GitHub) so the function picks up the new variable.

6. Visit your live site's Chatbot page and try it — EcoMind-01 will now be
   answering via OpenAI's model instead of (or alongside) the built-in rules.

## Cost
- Vercel free tier: plenty for a small student project (well within the free
  request/bandwidth limits).
- OpenAI usage: `gpt-4o-mini` is used in `api/chat.js` because it's OpenAI's
  cheapest capable model — a new OpenAI account also comes with some free
  trial credit, so this can genuinely run at $0 for a while depending on
  traffic. Keep an eye on usage at platform.openai.com/usage.

## If you don't want to do any of this
That's completely fine — leave `api/chat.js` undeployed and the site just
works exactly as before, using the free rule-based EcoMind-01 in `chatbot.js`.
Nothing breaks either way.
