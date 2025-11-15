
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import time
from typing import Optional
import os
from dotenv import load_dotenv

# 1. Tải .env và Đọc Key
load_dotenv()
HF_API_KEY = os.getenv("HF_TOKEN")
if not HF_API_KEY:
    print("LỖI: Không tìm thấy HF_TOKEN trong file .env của AI_ENGINE")
    # (Trong sản phẩm thực tế, bạn nên dừng server ở đây)


# 2. IMPORT CÁC MODULE XỬ LÝ
try:
    # Import các hàm xử lý
    from mentor import chat_with_bot, init_mentor_client
    from review import review_with_bot, layTemplateTrongFileTask, init_review_client
    
    # KHỞI TẠO CLIENT (Truyền key vào)
    init_mentor_client(HF_API_KEY)
    init_review_client(HF_API_KEY)
    
except ImportError as e:
    print(f"LỖI: Không tìm thấy mentor.py hoặc review.py. {e}")
except Exception as e:
    print(f"LỖI: Không thể khởi tạo AI Clients. Kiểm tra API Key: {e}")


# ===================================================================
# CONFIGURATION & DATA MODELS
# ===================================================================
app = FastAPI()

# MODEL CHAT
class ChatPayload(BaseModel):
    message: str
    context: Optional[str] = None 

# MODEL CODE
class CodePayload(BaseModel):
    code: str
    task_id: str 


@app.post("/send_chat")
async def send_chat_to_py(data: ChatPayload): 
    user_message = data.message
    context = data.context
    
    print(f"[{time.strftime('%H:%M:%S')}] Nhận Chat: {user_message}")

    try:
        bot_response = chat_with_bot(user_message, context)
        return {"answer": bot_response}
        
    except Exception as e:
        print(f"LỖI CHI TIẾT (Mentor Bot): {str(e)}") 
        raise HTTPException(
            status_code=500, 
            detail=f"Lỗi: AI Mentor không phản hồi. Chi tiết: {str(e)}"
        )
@app.post("/send_code")
async def send_code_to_py(data: CodePayload):
    code_content = data.code
    task_id = data.task_id
    print(f"[{time.strftime('%H:%M:%S')}] Nhận Code cho Task {task_id}")

    try:
        template_content = layTemplateTrongFileTask(task_id)
        
        # Gọi hàm chấm điểm
        review_result_text = review_with_bot(code_content, template_content)
        
      
        
        # (Tạm thời, chúng ta sẽ trả về text thô cho đến khi sửa review.py)
        # TODO: Sửa logic review_with_bot để trả về dict
        
       
        
        # Giả định: review_with_bot trả về 1 dict (sửa ở bước 2)
        return {
            "review": review_result_text # Sẽ sửa hàm review_with_bot ở bước 2
        }
        
    except FileNotFoundError:
        print(f"Lỗi: Không tìm thấy file template task '{task_id}'.")
        raise HTTPException(status_code=404, detail=f"Lỗi: Không tìm thấy file template task '{task_id}'.")
    except Exception as e:
        print(f"LỖI CHI TIẾT (Review Bot): {str(e)}") 
        raise HTTPException(
            status_code=500, 
            detail=f"Lỗi: AI Review không phản hồi. Chi tiết: {str(e)}"
        )