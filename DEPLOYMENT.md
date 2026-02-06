# AgriRisk Pro - Deployment Checklist

## ✅ Pre-Deployment Checklist

### Configuration Files
- [x] `.env.example` - Environment variable template created
- [x] `vercel.json` - Vercel configuration created
- [x] `Procfile` - Python server deployment config created
- [x] `.gitignore` - Updated for production
- [x] Build passes locally (`npm run build`)

### Code Quality
- [x] All TypeScript errors fixed
- [x] ML integration complete
- [x] API error handling with fallbacks
- [x] Diversity score calculation fixed
- [x] Dynamic improvement suggestions implemented

### Testing
- [ ] Test assessment flow locally
- [ ] Verify diversity score shows correct value
- [ ] Check API fallbacks work (disconnect internet)
- [ ] Test with/without ML server

---

## 🚀 Deployment Steps

### 1. Prepare Repository

```bash
# Initialize git (if not already done)
cd agri-risk-pro
git init

# Add all files
git add .

# Commit
git commit -m "Production ready - AgriRisk Pro v1.0"

# Create GitHub repository and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/agri-risk-pro.git
git push -u origin main
```

### 2. Deploy Frontend to Vercel

1. **Go to:** https://vercel.com/new
2. **Import:** Your GitHub repository
3. **Framework:** Next.js (auto-detected)
4. **Root Directory:** `./`
5. **Build Command:** `npm run build` (default)
6. **Environment Variables:**
   ```
   OPENWEATHER_API_KEY=your_actual_key
   ML_API_URL=https://your-ml-server.railway.app (optional)
   ```
7. **Click:** Deploy

**Expected:** Deployment succeeds in ~3-4 minutes

### 3. Deploy ML Server (Optional - Recommended)

#### **Option A: Railway** ⭐ Recommended
1. Go to: https://railway.app/new
2. Select: Deploy from GitHub repo
3. Connect your repo
4. Railway auto-detects Python
5. **Set Environment Variables:**
   ```
   PORT=8000
   ```
6. Railway reads `Procfile` and `requirements.txt` automatically
7. Copy deployment URL (e.g., `https://agri-risk-ml-production.up.railway.app`)
8. **Update in Vercel:**
   - Go to Vercel dashboard → Settings → Environment Variables
   - Update `ML_API_URL` with Railway URL
   - Redeploy

#### **Option B: Render**
1. Go to: https://render.com/new/web-service
2. Connect GitHub repo
3. **Settings:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn ml.api_server:app --host 0.0.0.0 --port $PORT`
   - Environment: Python 3
4. Add env var: `PORT=8000`
5. Copy URL and update Vercel

#### **Option C: Skip ML Server**
App will use fallback rule-based model automatically. Still fully functional!

### 4. Post-Deployment Verification

**Visit your Vercel URL: `https://your-app.vercel.app`**

- [ ] Landing page loads
- [ ] Navigate to `/assess`
- [ ] Complete assessment with KCC: `MH-1234567890`
- [ ] **Check diversity score:** Should be ~16-18 (not 8!)
- [ ] **Check data sources:** Should show NASA POWER / OpenWeather
- [ ] **Check suggestions:** Should be farm-specific with costs
- [ ] Open browser console:
  - With ML: "Using CatBoost ML Engine"
  - Without ML: "Using fallback model"

---

## 🔧 Environment Variables Reference

### Vercel Dashboard
Add these in: **Settings → Environment Variables**

| Variable | Environment | Value | Required |
|----------|-------------|-------|----------|
| `OPENWEATHER_API_KEY` | All | Your API key | ✅ Yes |
| `ML_API_URL` | All | Railway/Render URL | ⚠️ Optional |
| `NASA_POWER_API_KEY` | All | DEMO_KEY | ⚠️ Optional |

**Apply to:** Production, Preview, Development (all 3)

---

## 📊 Expected Costs

| Service | Plan | Cost | Notes |
|---------|------|------|-------|
| **Vercel** | Hobby | $0/month | Includes custom domain |
| **Railway** | Hobby | $5/month | 500 hours free trial |
| **Render** | Free | $0/month | Sleeps after 15min inactivity |
| **OpenWeather** | Free | $0/month | 1000 calls/day |

**Recommended setup:** Vercel (free) + Railway (first month free) = $0

---

## 🐛 Troubleshooting

### Build Fails on Vercel
**Error:** "Command failed with exit code 1"  
**Fix:** Check build logs for specific TypeScript errors
- Our build passes locally, so should work on Vercel
- If timeout, upgrade to Pro (45s limit on free tier)

### ML Server Not Connecting
**Error:** "ML prediction failed"  
**Check:**
1. `ML_API_URL` set correctly in Vercel?
2. Railway/Render deployment successful?
3. Test ML URL directly: `https://your-ml-url.com/health`

### Weather API Fails
**Error:** "Assessment error: fetch failed"  
**Check:**
1. `OPENWEATHER_API_KEY` set in Vercel?
2. API key valid? (Test at openweathermap.org)
3. Fallback to mock data should still work

### Diversity Score Still Shows 8
**Should be:** ~16-18 for farmer with 2 crops  
**Check:** Code updated correctly? Run `git pull` and redeploy

---

## ✅ Success Criteria

Your deployment is successful when:

1. ✅ Build completes on Vercel
2. ✅ App loads at your Vercel URL
3. ✅ Assessment flow works end-to-end
4. ✅ Diversity score calculates correctly
5. ✅ Improvement suggestions are farm-specific
6. ✅ APIs work (or fallback gracefully)
7. ✅ ML server responds (or fallback works)

---

## 🎯 Quick Deploy Command

```bash
# One-command deployment (after GitHub setup)
vercel --prod
```

That's it! Your app is live! 🚀
