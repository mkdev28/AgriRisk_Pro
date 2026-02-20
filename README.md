# 🌾 AgriRisk Pro

> **AI-Powered Farm Insurance Risk Assessment Platform**
> 
> A production-ready Next.js application that uses machine learning to assess agricultural insurance risks, detect fraud, and provide data-driven improvement suggestions for farmers.

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Project-blue?style=for-the-badge)](https://cropp-l9n4.vercel.app/)
[![Built with Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![Python ML](https://img.shields.io/badge/Python-3.10+-blue)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*(Note: The ML backend is hosted on a free tier. Please allow 50-60 seconds for the server to spin up upon initial load.)*

## 📸 See it in Action

![AgriRisk Pro Demo](![ScreenRecording2026-02-06094921-ezgif com-optimize](https://github.com/user-attachments/assets/4733175b-69ef-4360-bf75-9585657efd24)
![ScreenRecording2026-02-06094921-ezgif com-optimize](https://github.com/user-attachments/assets/4733175b-69ef-4360-bf75-9585657efd24)
)


---

## ✨ Key Features & Engineering Highlights

### 🛡️ Robust Architecture & Reliability
* **Dual-Mode Fallback Strategy:** Engineered to guarantee **100% uptime**. If the primary Python/CatBoost ML server is unavailable, the system gracefully degrades to a local rule-based mathematical model.
* **Resilient External APIs:** Automatic fallback to mock satellite/weather data if external API limits are reached or requests timeout.

### 🎯 ML-Powered Risk Assessment
* **High-Accuracy Modeling:** Utilizes a CatBoost classifier trained on 10,000+ farm records, achieving **87.2% accuracy** in risk prediction.
* **Explainable AI (XAI):** Implements SHAP values to identify top risk drivers and dynamically generate farm-specific improvement suggestions with ROI and payback period calculations.
* **Multi-Factor Fraud Detection:** Analyzes data discrepancies between user input and real-time NASA POWER / OpenWeather API data.

---

## 📁 Project Structure

```text
agri-risk-pro/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── assess/           # Main risk assessment endpoint
│   │   ├── ml-health/        # ML server health check
│   │   └── download-report/  # PDF generation
│   ├── assess/               # Assessment wizard UI
│   └── dashboard/            # Admin dashboards
├── components/               # React components
├── lib/                      # Utilities
│   ├── ml/                   # ML client & calculators (Fallback model, Fraud logic)
│   └── data/                 # Data fetchers (NASA POWER, OpenWeather)
├── ml/                       # Python ML server
│   ├── api_server.py         # FastAPI server
│   ├── train_model.py        # ML training pipeline
│   └── data_generator.py     # Synthetic data generation
├── types/                    # TypeScript definitions
├── vercel.json               # Vercel config
└── Procfile                  # Railway/Render config

---

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```bash
# Required
OPENWEATHER_API_KEY=your_key_here

# Optional
ML_API_URL=http://127.0.0.1:8000
NASA_POWER_API_KEY=DEMO_KEY
```

### API Keys

| Service | Free Tier | Get Key |
|---------|-----------|---------|
| OpenWeather | 1000/day | [openweathermap.org](https://openweathermap.org/api) |
| NASA POWER | Unlimited | No key needed |

---

## 🌐 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy! ✅

### ML Server (Railway/Render)

**Option 1: Railway** (Recommended)
```bash
# Railway auto-detects Python + Procfile
# Just connect repo and deploy
```

**Option 2: Render**
- Build: `pip install -r requirements.txt`
- Start: `uvicorn ml.api_server:app --host 0.0.0.0 --port $PORT`

**Option 3: Skip**
- App uses fallback rule-based model automatically

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 🧪 Testing

### Test Assessment Flow

1. Navigate to `/assess`
2. Use test KCC ID: `MH-1234567890`
3. Fill in farm details
4. Verify results:
   - Risk score: ~45-55
   - Diversity score: ~16-18 (2 crops)
   - Suggestions: 4 farm-specific actions

### Test API Fallbacks

**NASA API:** Disconnect internet → Should use mock satellite data  
**ML Server:** Stop Python server → Should use rule-based model  
Both cases: Assessment still completes successfully!

---

## 📊 ML Model Details

### Training Data
- **Size:** 10,000 synthetic farm records
- **Features:** 30+ variables (weather, soil, financial, infrastructure)
- **Algorithm:** CatBoost Classifier

### Performance Metrics
```
Accuracy:  87.2%
Precision: 85.8%
Recall:    88.1%
F1-Score:  86.9%
```

### Top Features (SHAP importance)
1. Rainfall deficit percentage (28%)
2. NDVI score (18%)
3. Irrigation type (15%)
4. Soil moisture (12%)
5. Crop count (8%)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI:** React 19 + Tailwind CSS
- **Components:** shadcn/ui
- **Charts:** Recharts
- **Maps:** React Leaflet

### Backend
- **API:** Next.js API Routes
- **ML Server:** FastAPI + uvicorn
- **ML Model:** CatBoost
- **Data:** NASA POWER + OpenWeather

### DevOps
- **Hosting:** Vercel (frontend) + Railway (ML)
- **CI/CD:** GitHub + Vercel auto-deploy
- **Monitoring:** Vercel Analytics

---

## 📈 Key Insights

### Diversity Score Fix
**Before:** Hardcoded `crop_count = 1` → Score always ~8  
**After:** Uses `KCC.registered_crops.length` → Score 8-24 (accurate)

### Improvement Suggestions
**Before:** Static hardcoded suggestions  
**After:** Dynamic calculations based on:
- Farm size (land acres)
- Current infrastructure
- Crop diversity
- Irrigation type
- Actual ROI (score increase × premium rate)

### Example Output
```javascript
{
  action: "Install Drip Irrigation",
  description: "Upgrade from rainfed to drip. Reduces water usage 40-60%.",
  score_increase: 15,
  premium_savings: 4200,  // ₹/year
  estimated_cost: 297500, // 8.5 acres × ₹35k
  govt_subsidy: 45%,      // ₹133,875 subsidy
  net_cost: 163625,       // After subsidy
  payback_period: "39 months"
}
```

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- [ ] Add more crop types to ML model
- [ ] Integrate real KCC API
- [ ] Add multilingual support (Hindi, Marathi)
- [ ] Implement claim processing workflow
- [ ] Add farmer mobile app (React Native)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 👤 Author

**Mohit**  
Project: AgriRisk Pro - AI Insurance Platform

---

## 🙏 Acknowledgments

- NASA POWER API for satellite data
- OpenWeather for weather forecasts
- CatBoost for ML framework
- Vercel for hosting platform

---

## 📞 Support

For deployment issues, see [DEPLOYMENT.md](DEPLOYMENT.md)  
For bugs, open an issue on GitHub

**Built with ❤️ for Indian farmers 🌾**
