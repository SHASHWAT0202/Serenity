# AI Mood Detection Integration

This feature integrates a FastAPI backend for real-time mood detection using facial expression analysis.

## Features

- **Live Camera Integration**: Opens camera when "Start Camera" is clicked
- **Real-time Capture**: Takes a photo when "Analyze Mood" is clicked
- **AI Analysis**: Sends image to FastAPI backend for mood detection
- **Personalized Recommendations**: Provides music and activity suggestions based on detected mood
- **Privacy-First**: Images are processed but not permanently stored

## Setup Instructions

### 1. Backend Setup (FastAPI)

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the FastAPI server:**
   ```bash
   python fastapi_mood_detection.py
   ```
   
   The API will be available at `http://localhost:8000`

3. **Test the API:**
   - Visit `http://localhost:8000` to see the welcome message
   - Visit `http://localhost:8000/docs` for interactive API documentation

### 2. Frontend Integration

The React component is already configured to work with the FastAPI backend at `http://localhost:8000/analyze-mood`.

## API Endpoints

### POST `/analyze-mood`
Analyzes an image and returns mood detection results.

**Request Body:**
```json
{
  "image": "base64_encoded_image_string"
}
```

**Response:**
```json
{
  "mood": "happy",
  "confidence": 0.85,
  "recommendations": {
    "music": "Upbeat and energetic songs to maintain your positive energy!",
    "activity": "Share your joy! Call a friend or engage in creative activities."
  }
}
```

## How It Works

1. **Camera Access**: User clicks "Start Camera" to enable live video feed
2. **Image Capture**: When "Analyze Mood" is clicked, the current video frame is captured
3. **API Call**: The captured image is converted to base64 and sent to the FastAPI backend
4. **Mood Analysis**: The backend processes the image and returns mood detection results
5. **Display Results**: The frontend displays the detected mood, confidence, and recommendations
6. **Try Again**: Users can analyze multiple times or restart the camera

## Customization

### Adding Your ML Model

Replace the `detect_mood_from_image()` function in `fastapi_mood_detection.py` with your actual machine learning model:

```python
def detect_mood_from_image(image_array: np.ndarray) -> tuple[str, float]:
    # Your ML model code here
    # 1. Preprocess image (resize, normalize, etc.)
    # 2. Run inference
    # 3. Return (mood, confidence)
    pass
```

### Supported Moods

The system currently supports these moods:
- happy, sad, neutral, angry, surprised, fear, disgust

### Customizing Recommendations

Modify the `get_recommendations()` function to provide your own music and activity suggestions.

## Troubleshooting

### Common Issues

1. **Camera not working**: Ensure camera permissions are granted in the browser
2. **API connection failed**: Check if FastAPI server is running on port 8000
3. **CORS errors**: Verify the frontend URL is in the allowed origins list

### Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: May have limited camera support

## Security & Privacy

- Images are processed in real-time and not permanently stored
- All communication happens over HTTP (consider HTTPS for production)
- No user data is logged or tracked

## Production Considerations

1. **HTTPS**: Use HTTPS in production for secure image transmission
2. **Rate Limiting**: Implement API rate limiting to prevent abuse
3. **Model Optimization**: Optimize your ML model for production performance
4. **Monitoring**: Add logging and monitoring for production deployment
5. **Error Handling**: Implement comprehensive error handling and user feedback

## Next Steps

1. Replace the mock mood detection with your actual ML model
2. Add more sophisticated image preprocessing
3. Implement mood history tracking (if desired)
4. Add more detailed recommendations based on user preferences
5. Integrate with music streaming services for actual song recommendations

