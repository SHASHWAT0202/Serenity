# 🚀 Vercel Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Environment Variables
Create a `.env.local` file in your project root with:

```bash
# Required for Mood Detection
VITE_FASTAPI_ENDPOINT=https://face-detection-backend-7x1.onrender.com/analyze-mood

# Optional - Add these if you're using these services
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_AI_API_KEY=your_google_ai_key
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_YOUTUBE_API_KEY=your_youtube_api_key
```

### ✅ Vercel Configuration
- `vercel.json` is already configured ✅
- Build command: `npm run build` ✅
- Output directory: `dist` ✅

### ✅ Dependencies
- All required packages are in `package.json` ✅
- Build script is configured ✅

## 🚀 Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

### 4. Set Environment Variables in Vercel Dashboard
Go to your project dashboard → Settings → Environment Variables and add:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_FASTAPI_ENDPOINT` | `https://face-detection-backend-7x1.onrender.com/analyze-mood` | Production, Preview, Development |

### 5. Redeploy with Environment Variables
```bash
vercel --prod
```

## 🔧 Environment-Specific Configurations

### Production
- Uses production FastAPI backend
- All features enabled
- Optimized for performance

### Development
- Can use local FastAPI backend
- Debug features enabled
- Development-specific configurations

## 🚨 Important Notes

### Camera Access
- **HTTPS Required**: Vercel provides HTTPS by default ✅
- **User Permission**: Users must allow camera access
- **Browser Support**: Modern browsers only (Chrome, Firefox, Safari, Edge)

### API Endpoints
- **CORS**: FastAPI backend must allow your Vercel domain
- **Rate Limiting**: Be aware of API usage limits
- **Error Handling**: Implement proper error handling for API failures

### Performance
- **Image Size**: Optimize captured images before sending to API
- **Loading States**: Show loading indicators during API calls
- **Error Boundaries**: Implement React error boundaries

## 🧪 Testing Deployment

### 1. Test Camera Access
- Navigate to mood detection tool
- Click "Start Camera"
- Allow camera permissions
- Verify live preview works

### 2. Test API Integration
- Capture an image
- Click "Analyze Mood"
- Verify API response
- Check error handling

### 3. Test Responsive Design
- Test on mobile devices
- Verify camera works on mobile
- Check UI responsiveness

## 🐛 Common Issues & Solutions

### Black Screen in Camera
- Check HTTPS requirement
- Verify camera permissions
- Check browser console for errors

### API Connection Failed
- Verify environment variables
- Check CORS settings on backend
- Verify API endpoint is accessible

### Build Failures
- Check Node.js version (18+ recommended)
- Verify all dependencies are installed
- Check for TypeScript errors

## 📱 Mobile Considerations

### iOS Safari
- Camera access requires user interaction
- Video element must be visible before starting
- Autoplay restrictions apply

### Android Chrome
- Generally better camera support
- Less restrictive autoplay policies
- Better performance on mobile

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env.local` to git
- Use Vercel's environment variable system
- Rotate API keys regularly

### API Security
- Implement rate limiting
- Validate input data
- Use HTTPS for all API calls

## 📊 Monitoring & Analytics

### Vercel Analytics
- Enable Vercel Analytics for performance monitoring
- Track page load times
- Monitor API response times

### Error Tracking
- Implement error logging
- Track camera access failures
- Monitor API error rates

## 🎯 Post-Deployment Checklist

- [ ] Environment variables are set in Vercel
- [ ] Camera access works on production
- [ ] API integration is functional
- [ ] Mobile responsiveness is verified
- [ ] Error handling is working
- [ ] Performance is acceptable
- [ ] HTTPS is enforced
- [ ] CORS is properly configured

## 🆘 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally with production environment
4. Check browser console for errors
5. Verify API endpoint accessibility
