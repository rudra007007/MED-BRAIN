# 🚀 MED-BRAIN Quick Start Guide

## Current Status: ✅ All Systems Working

Backend is running successfully with all 5 API tests passing!

---

## Start the Backend (One-Time Setup)

### Windows PowerShell:
```powershell
cd d:\Projects\MED-BRAIN\backend
Start-Process -NoNewWindow -FilePath node -ArgumentList server.js
Start-Sleep 2
node test-data-integration.js
```

Expected output:
```
🧪 Testing MED-BRAIN Data Integration
✅ Health Data: SUCCESS
✅ Pattern Insights: SUCCESS
✅ Community Trends: SUCCESS
✅ Symptom History: SUCCESS
✅ Data Storage: SUCCESS
```

---

## Verify Backend is Running

Check if server is listening:
```powershell
netstat -ano | findstr :3000
```

Should show node.exe listening on port 3000

---

## Stop Backend When Done

```powershell
taskkill /F /IM node.exe
```

---

## API Endpoints

Once backend is running at `http://127.0.0.1:3000`:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/status` | GET | Health check |
| `/api/health/data/:userId` | GET | Get health data |
| `/api/health/data` | POST | Store health data |
| `/api/symptoms/extract` | POST | Extract symptoms |
| `/api/insights/:userId` | GET | Get insights |
| `/api/community/trends` | GET | Get trends |

---

## Frontend Setup

### Install dependencies:
```powershell
cd d:\Projects\MED-BRAIN\mobile
npm install
```

### Start development:
```powershell
npm start
# Choose 'i' for iOS or 'a' for Android
```

---

## Recent Fixes

✅ **Pattern Insights Component** - Completely rewritten (64 errors fixed)  
✅ **Index Screen Styles** - Added missing style properties  
✅ **Backend Server** - Now properly listening and accepting connections  
✅ **Python Service** - Using fast mock data (can enable real models)  
✅ **All API Tests** - 100% passing  

---

## File Locations

- **Backend:** `d:\Projects\MED-BRAIN\backend\`
- **Frontend:** `d:\Projects\MED-BRAIN\mobile\`
- **Python Engine:** `d:\Projects\MED-BRAIN\Engine\`
- **Shared Types:** `d:\Projects\MED-BRAIN\types\`

---

## Troubleshooting

### Backend not connecting?
1. Kill all node processes: `taskkill /F /IM node.exe`
2. Restart: `Start-Process -NoNewWindow -FilePath node -ArgumentList server.js`
3. Wait 2 seconds for startup
4. Test: `node test-data-integration.js`

### Port 3000 already in use?
```powershell
taskkill /F /IM node.exe
# Or find specific process:
Get-Process node | Stop-Process -Force
```

### Tests failing?
Make sure backend is running first, then:
```powershell
cd backend
node test-data-integration.js
```

---

## Next Steps

1. ✅ Backend working - *DONE*
2. ⏳ Mobile app development - Use Zustand stores to fetch data
3. ⏳ Integrate real Python AI models (optional)
4. ⏳ Add database (MongoDB/PostgreSQL)
5. ⏳ Deploy to cloud

---

**Questions?** Check `DIAGNOSTIC_REPORT.md` for complete project details.
