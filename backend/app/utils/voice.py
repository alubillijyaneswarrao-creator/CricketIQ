import base64
import logging
import io

logger = logging.getLogger(__name__)

def text_to_speech_base64(text: str) -> str:
    """
    Converts text to speech using gTTS and returns base64 encoded MP3 audio data.
    If gTTS fails, returns None.
    """
    try:
        from gtts import gTTS
        # Clean markdown elements from the text to make speech sound natural
        clean_text = text.replace("#", "").replace("*", "").replace("- ", "").replace("|", " ")
        # Shorten text if it is extremely long for performance
        if len(clean_text) > 400:
            clean_text = clean_text[:400] + "..."
            
        tts = gTTS(text=clean_text, lang='en', slow=False)
        
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        
        audio_b64 = base64.b64encode(fp.read()).decode('utf-8')
        return audio_b64
    except Exception as e:
        logger.warning(f"Speech synthesis failed: {e}")
        return None
