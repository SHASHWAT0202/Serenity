from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import io
from PIL import Image
import numpy as np
import cv2
from typing import Dict, Any
import random

app = FastAPI(title="Mood Detection API", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageRequest(BaseModel):
    image: str  # Base64 encoded image

class MoodResponse(BaseModel):
    mood: str
    confidence: float
    recommendations: Dict[str, str]

# Mock mood detection function - replace with your actual ML model
def detect_mood_from_image(image_array: np.ndarray) -> tuple[str, float]:
    """
    Mock mood detection - replace this with your actual ML model
    This function should analyze the image and return (mood, confidence)
    """
    # For now, return a random mood with high confidence
    # In reality, you would:
    # 1. Preprocess the image (resize, normalize, etc.)
    # 2. Run it through your trained model
    # 3. Get predictions and confidence scores
    
    moods = ["happy", "sad", "neutral", "angry", "surprised", "fear", "disgust"]
    mood = random.choice(moods)
    confidence = random.uniform(0.7, 0.95)
    
    return mood, confidence

def get_recommendations(mood: str) -> Dict[str, str]:
    """Get personalized recommendations based on detected mood"""
    
    recommendations = {
        "happy": {
            "music": "Upbeat and energetic songs to maintain your positive energy! Try pop, dance, or upbeat rock music.",
            "activity": "Share your joy! Call a friend, engage in creative activities, or go for a walk to spread positivity."
        },
        "sad": {
            "music": "Gentle, comforting melodies to help process your emotions. Try soft acoustic, classical, or ambient music.",
            "activity": "Try gentle yoga, journaling to process your feelings, or take a warm bath to comfort yourself."
        },
        "neutral": {
            "music": "Peaceful instrumental music to maintain your balance. Try lo-fi, nature sounds, or soft jazz.",
            "activity": "Perfect time for meditation, mindful reading, or taking a peaceful walk in nature."
        },
        "angry": {
            "music": "Calming sounds to help you find inner peace. Try classical music, meditation sounds, or gentle instrumental.",
            "activity": "Deep breathing exercises, progressive muscle relaxation, or a short walk to release tension."
        },
        "surprised": {
            "music": "Focused, motivating music to channel your energy. Try upbeat instrumental or motivational tracks.",
            "activity": "Great time for learning something new, exercising, or engaging in creative problem-solving."
        },
        "fear": {
            "music": "Soothing, calming music to reduce anxiety. Try nature sounds, soft classical, or meditation music.",
            "activity": "Take deep breaths, practice grounding techniques, or do gentle stretching to calm your nervous system."
        },
        "disgust": {
            "music": "Uplifting and positive music to shift your mood. Try happy pop songs or cheerful instrumental music.",
            "activity": "Change your environment, engage in something you enjoy, or practice gratitude to shift perspective."
        }
    }
    
    return recommendations.get(mood, recommendations["neutral"])

@app.post("/analyze-mood", response_model=MoodResponse)
async def analyze_mood(request: ImageRequest):
    try:
        # Decode base64 image
        image_data = base64.b64decode(request.image)
        image = Image.open(io.BytesIO(image_data))
        
        # Convert PIL image to numpy array for processing
        image_array = np.array(image)
        
        # Convert RGB to BGR if needed (OpenCV uses BGR)
        if len(image_array.shape) == 3:
            image_array = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)
        
        # Detect mood from image
        mood, confidence = detect_mood_from_image(image_array)
        
        # Get recommendations
        recommendations = get_recommendations(mood)
        
        return MoodResponse(
            mood=mood,
            confidence=confidence,
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Mood Detection API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "mood-detection-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

