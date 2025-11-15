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

# MODEL CODE: Nhận JSON { "code": "...", "task_id": "..." }
class CodePayload(BaseModel):
    code: str
    task_id: str 

# ===================================================================
# ENDPOINTS (LUỒNG POST TRẢ VỀ NGAY)
# ===================================================================

# -------------------------------------------------------------------
# 1. Endpoint: Chatbot Mentor (POST /send_chat)
# -------------------------------------------------------------------
# AI_ENGINE/main.py (Phần Endpoint: Chatbot Mentor)

@app.post("/send_chat")
async def send_chat_to_py(data: ChatPayload): 
    """ Nhận tin nhắn, gọi hàm xử lý AI, và trả kết quả ngay lập tức. """
    user_message = data.message
    current_task = data.taskContext # Lấy thông tin task mới
    print(f"[{time.strftime('%H:%M:%S')}] Nhận Chat: {user_message} (Task: {current_task.title})")

    try:
        # GỌI HÀM XỬ LÝ: Cần cập nhật mentor.py để nhận thêm 1 tham số
        # Truyền requirement để AI có thể dựa vào đó tư vấn
        bot_response = chat_with_bot(user_message, current_task.requirement) 

        # Trả về JSON { "answer": "..." }
        return {"answer": bot_response}

    except Exception as e:
        # ...

# -------------------------------------------------------------------
# 2. Endpoint: Chấm Code (POST /send_code)
# -------------------------------------------------------------------
@app.post("/send_code")
async def send_code_to_py(data: CodePayload):
    """ Nhận code và task_id, chạy review và trả kết quả ngay lập tức. """
    code_content = data.code
    task_id = data.task_id
    print(f"[{time.strftime('%H:%M:%S')}] Nhận Code cho Task {task_id}")

    try:
        # Lấy template từ file task tương ứng
        template_content = layTemplateTrongFileTask(task_id)
        
        # Gọi hàm review từ review.py (gọi Hugging Face API)
        review_text = review_with_bot(code_content, template_content)
        
        # Giả lập phân tích kết quả từ review_text 
        # (Bạn có thể cần làm logic này phức tạp hơn)
        passed = "Kết luận: Pass" in review_text or "Kết luận: Đạt" in review_text
        score = 100 if passed else 0
        
        # Trả về JSON { "review": {...} }
        return {
            "review": {
                "passed": passed,
                "score": score,
                "feedback": review_text 
            }
        }
        
    except FileNotFoundError:
        print(f"Lỗi: Không tìm thấy file template task '{task_id}'.")
        raise HTTPException(status_code=404, detail=f"Lỗi: Không tìm thấy file template task '{task_id}'.")
    except Exception as e:
        print(f"Lỗi khi gọi Review Bot: {e}")
        raise HTTPException(status_code=500, detail="Lỗi: AI Review không phản hồi.")
    # AI_ENGINE/main.py (Phần CONFIGURATION & DATA MODELS)

# MODEL CHO NGỮ CẢNH TASK
class TaskContext(BaseModel):
    title: str
    requirement: str
    taskId: str

# MODEL CHAT CẬP NHẬT: Nhận JSON { "message": "...", "taskContext": { ... } }
class ChatPayload(BaseModel):
    message: str
    taskContext: TaskContext # Thêm trường này

# MODEL CODE (Giữ nguyên)
class CodePayload(BaseModel):
    code: str
    task_id: str