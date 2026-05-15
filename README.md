# Home Lighting Visualizer

A web tool that lets homeowners upload a daytime photo of their house and receive an AI-generated nighttime version with professional landscape lighting. Captures leads and emails them automatically.

## What it does

1. Visitor lands on a page, uploads a daytime photo of their home
2. They fill in name, email, phone
3. Google Gemini 2.5 Flash Image transforms the photo into a nighttime version with landscape lighting
4. Visitor sees a before/after slider, can download/share the image
5. You receive an email with their info + both images
6. They receive an email with their generated image

## Deploying to Vercel

### 1. Push to GitHub

- Create a new repo on github.com (private or public, doesn't matter)
- In this folder, run:
  ```
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
  git branch -M main
  git push -u origin main
  ```

### 2. Deploy on Vercel

- Go to vercel.com → "Add New" → "Project"
- Import the GitHub repo you just created
- Click "Deploy" (it'll fail the first time — that's fine, env vars come next)

### 3. Add environment variables in Vercel

In your Vercel project → Settings → Environment Variables, add each of these:

| Name | Value |
|---|---|
| `GEMINI_API_KEY` | Your key from aistudio.google.com |
| `RESEND_API_KEY` | Your key from resend.com |
| `BUSINESS_EMAIL` | The email where you want leads sent |
| `FROM_EMAIL` | An email at your verified domain (e.g., `preview@yourdomain.com`) |
| `BUSINESS_NAME` | Your business name |
| `BUSINESS_WEBSITE` | URL of your "request a quote" page |

Then go to Deployments → click "..." on the latest deployment → "Redeploy".

### 4. Embed in WordPress

- In WordPress, install the free plugin **"Advanced iframe"**
- Create a new page (e.g., `/see-your-home-at-night`)
- Add an iframe block pointing to your Vercel URL (e.g., `https://your-app.vercel.app`)
- Set the iframe to full width with auto-height enabled

## Running locally (optional — for testing before deploy)

You'd need Node.js installed. Then:
```
npm install
cp .env.local.example .env.local
# Edit .env.local with your real keys
npm run dev
```
Open http://localhost:3000

## Cost per lead

- Gemini API: ~$0.04 per submission
- Resend: Free up to 3,000/month
- Vercel: Free at this scale

**~$0.04 per lead.**

## Notes on the email setup

Until your domain is verified in Resend, the `FROM_EMAIL` must be `onboarding@resend.dev`, and you can only send to your own verified email address (the one you signed up with). Once your developer adds the DNS records and Resend shows your domain as "Verified," update `FROM_EMAIL` to something at your domain (e.g., `preview@yourdomain.com`) and the tool will be able to email anyone.
