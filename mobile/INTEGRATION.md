# MED-BRAIN Frontend Integration

This document explains how the frontend (React Native/Expo) connects to the backend (Node.js) using Zustand for state management.

## Architecture

```
Frontend (React Native/Expo)
    ↓
Zustand Stores (State Management)
    ↓
Services (API Calls)
    ↓
Backend API (Node.js/Express)
    ↓
Python AI Models (Engine)
```

## Zustand Stores

### 1. **Symptom Store** (`store/symptom.store.ts`)
Manages symptom extraction and analysis:
- `symptoms` - List of extracted symptoms
- `extractSymptoms(text)` - Send text to backend for AI analysis
- `clearSymptoms()` - Reset symptom data

### 2. **Health Store** (`store/health.store.ts`)
Manages health data:
- `healthData` - Array of health metrics
- `syncHealthData()` - Sync local data to backend
- `fetchHealthData()` - Retrieve stored health data

### 3. **Analytics Store** (`store/analytics.store.ts`)
Manages analytics and insights:
- `driftAnalysis` - Drift detection results
- `analyzeDrift(data)` - Request drift analysis
- `checkBackend()` - Verify backend connection

### 4. **App Store** (`store/app.store.ts`)
Global app state:
- `isOnline` - Backend connectivity status
- `user` - Current user information

## Services

### **Symptom Service** (`services/symptom.service.ts`)
- `extractSymptoms(text)` - POST to `/api/symptoms/extract`
- `getSymptomRelationships(symptom)` - POST to `/api/symptoms/relationships`

### **Health Service** (`services/health.service.ts`)
- `storeHealthData(userId, data)` - POST to `/api/health/data`
- `getHealthData(userId)` - GET from `/api/health/data/:userId`

### **Analytics Service** (`services/analytics.service.ts`)
- `analyzeDrift(healthData)` - POST to `/api/analytics/drift`
- `generateInsights(symptoms, metrics)` - POST to `/api/analytics/insights`
- `checkBackendStatus()` - GET from `/api/status`

## Usage Examples

### Extracting Symptoms

```typescript
import { useSymptomStore } from '../store/symptom.store';

function SymptomInput() {
  const { extractSymptoms, symptoms, isLoading } = useSymptomStore();

  const handleSubmit = async () => {
    await extractSymptoms("I have a headache and feeling dizzy");
    console.log(symptoms); // AI-extracted symptoms with confidence scores
  };
}
```

### Analyzing Health Data

```typescript
import { useAnalyticsStore } from '../store/analytics.store';

function Analytics() {
  const { analyzeDrift, driftAnalysis } = useAnalyticsStore();

  const analyze = async () => {
    const healthData = [
      { date: '2026-01-25', steps: 8000, sleep_hours: 7 },
      { date: '2026-01-26', steps: 7500, sleep_hours: 6.5 },
      // ... more data
    ];
    
    await analyzeDrift(healthData);
    console.log(driftAnalysis); // AI drift detection results
  };
}
```

### Checking Backend Status

```typescript
import { useEffect } from 'react';
import { useAnalyticsStore } from '../store/analytics.store';

function App() {
  const { checkBackend, backendStatus } = useAnalyticsStore();

  useEffect(() => {
    checkBackend();
  }, []);

  return (
    <View>
      <Text>Backend: {backendStatus ? 'Online' : 'Offline'}</Text>
    </View>
  );
}
```

## Setup Instructions

### 1. Install Dependencies
The app already has Zustand installed. If needed:
```bash
cd mobile
npm install zustand
```

### 2. Configure Backend URL
Create a `.env` file in the mobile directory:
```bash
cp .env.example .env
```

Edit `.env` and set your backend URL:
```
# For local development
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# For testing on physical device (use your computer's IP)
EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000/api
```

### 3. Start Backend
```bash
cd backend
npm install
npm run dev
```

### 4. Start Frontend
```bash
cd mobile
npm start
```

## Updated Components

### **symptom-input.tsx**
- Connected to `useSymptomStore`
- Real-time backend status indicator
- Shows extracted symptoms with confidence scores
- Loading states during AI analysis
- Error handling with user-friendly messages

### **index.tsx** (Home Screen)
- Connected to `useAnalyticsStore` and `useHealthStore`
- Backend connection status indicator
- Fetches health data on mount

## API Configuration

All API endpoints are defined in `constants/api.ts`:

```typescript
export const API_ENDPOINTS = {
  EXTRACT_SYMPTOMS: `${API_BASE_URL}/symptoms/extract`,
  DRIFT_ANALYSIS: `${API_BASE_URL}/analytics/drift`,
  // ... more endpoints
};
```

## Error Handling

All services include try-catch error handling:
- Network errors are caught and logged
- User-friendly error messages in stores
- Loading states prevent duplicate requests
- Backend status checks before critical operations

## Next Steps

1. **Authentication** - Add JWT tokens to API calls
2. **Offline Support** - Queue API calls when offline
3. **Caching** - Implement React Query for better caching
4. **Push Notifications** - Real-time drift alerts
5. **Data Persistence** - Save health data locally with AsyncStorage

## Testing

### Test Backend Connection
```typescript
import analyticsService from './services/analytics.service';

const testConnection = async () => {
  const isOnline = await analyticsService.checkBackendStatus();
  console.log('Backend status:', isOnline);
};
```

### Test Symptom Extraction
```typescript
import symptomService from './services/symptom.service';

const testExtraction = async () => {
  const result = await symptomService.extractSymptoms("I feel tired");
  console.log('Extracted:', result);
};
```
