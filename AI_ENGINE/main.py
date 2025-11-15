from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import time

# IMPORT CÁC MODULE XỬ LÝ (mentor.py và review.py)
try:
    # Đảm bảo các file này nằm cùng cấp với main.py
    from mentor import chat_with_bot
    from review import review_with_bot, layTemplateTrongFileTask
except ImportError as e:
    # Lỗi sẽ được in ra terminal nếu không tìm thấy file
    print(f"LỖI: Không tìm thấy mentor.py hoặc review.py. {e}")


# ===================================================================
# CONFIGURATION & DATA MODELS
# ===================================================================
app = FastAPI()

# MODEL CHAT: Nhận JSON { "message": "..." }
class ChatPayload(BaseModel):
    message: str

# MODEL CODE: Nhận JSON { "code": "...", "template": "..." }
class CodePayload(BaseModel):
    code: str
    template: str 

# ===================================================================
# ENDPOINTS (LUỒNG POST TRẢ VỀ NGAY)
# ===================================================================

# -------------------------------------------------------------------
# 1. Endpoint: Chatbot Mentor (POST /send_chat)
# -------------------------------------------------------------------
@app.post("/send_chat")
async def send_chat_to_py(data: ChatPayload): 
    """ Nhận tin nhắn, gọi hàm xử lý AI, và trả kết quả ngay lập tức. """
    user_message = data.message
    print(f"[{time.strftime('%H:%M:%S')}] Nhận Chat: {user_message}")
    
    try:
        # Gọi hàm xử lý từ mentor.py
        bot_response = chat_with_bot(user_message)
        
        # Trả về JSON { "answer": "..." }
        return {"answer": bot_response}
        
    except Exception as e:
        print(f"Lỗi khi gọi Mentor Bot: {e}")
        # Trả về lỗi 500 nếu có vấn đề
        raise HTTPException(status_code=500, detail="Lỗi: AI Mentor không phản hồi.")


# -------------------------------------------------------------------
# 2. Endpoint: Chấm Code (POST /send_code)
# -------------------------------------------------------------------
@app.post("/send_code")
async def send_code_to_py(data: CodePayload):
    """ Nhận code và template, chạy review và trả kết quả ngay lập tức. """
    code_content = data.code
    template_content = data.template
    print(f"[{time.strftime('%H:%M:%S')}] Nhận Code với template length: {len(template_content)}")

    try:
        # Gọi hàm review từ review.py (gọi Hugging Face API)
        review_text = review_with_bot(code_content, template_content)
        
        print(f"[{time.strftime('%H:%M:%S')}] AI Review response: {review_text[:200]}...")
        
        # Parse kết quả từ review_text (tìm "Pass" hoặc "Không Pass")
        review_lower = review_text.lower()
        passed = ("pass" in review_lower and "không pass" not in review_lower)
        
        # Tìm điểm số (pattern: "Điểm số: XX/100" hoặc "XX/100")
        import re
        score_match = re.search(r'(\d+)\s*/\s*100', review_text)
        score = int(score_match.group(1)) if score_match else (100 if passed else 0)
        
        # Trả về JSON { "review": {...} }
        return {
            "review": {
                "passed": passed,
                "score": score,
                "feedback": review_text 
            }
        }
        
    except Exception as e:
        print(f"Lỗi khi gọi Review Bot: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi: AI Review không phản hồi. Chi tiết: {str(e)}")