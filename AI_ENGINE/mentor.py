# Mở file: AI_ENGINE/mentor.py
from huggingface_hub import InferenceClient

client = None # Khai báo client toàn cục

# -------------------------------------------------------------------
# 1. HÀM KHỞI TẠO (Được gọi bởi main.py)
# -------------------------------------------------------------------
def init_mentor_client(api_key: str):
    global client
    client = InferenceClient(api_key=api_key)
    print("✅ Khởi tạo Mentor Client (AI Chat) thành công.")


# -------------------------------------------------------------------
# 2. LỊCH SỬ HỘI THOẠI (Giữ nguyên)
# -------------------------------------------------------------------
chat_history = [
    {"role": "system", "content": "Bạn là một Mentor Lập trình AI, chuyên nghiệp và thân thiện. Nhiệm vụ của bạn là hướng dẫn thực tập sinh giải quyết vấn đề. Luôn trả lời bằng tiếng Việt. KHÔNG cung cấp code giải pháp đầy đủ, thay vào đó hãy GỢI Ý các bước hoặc chỉ ra lỗi sai."}
]

# -------------------------------------------------------------------
# 3. HÀM CHAT (PHIÊN BẢN ĐẦY ĐỦ)
# -------------------------------------------------------------------
def chat_with_bot(user_input: str, context: str = None):
    
    # 1. Kiểm tra Client
    if client is None:
        raise Exception("Mentor client chưa được khởi tạo. Hãy gọi init_mentor_client() từ main.py")
        
    # 2. Tạo prompt có ngữ cảnh
    if context and context != "Không có ngữ cảnh task cụ thể.":
        full_message = f"Câu hỏi của tôi là: '{user_input}'. \n\n (Ngữ cảnh task tôi đang làm: {context})"
    else:
        full_message = user_input

    # 3. Thêm tin nhắn của user vào lịch sử
    chat_history.append( {"role": "user", "content": full_message})

    # 4. GỌI API HUGGING FACE (Phần này bị thiếu)
    completion = client.chat.completions.create(
        model="Qwen/Qwen3-Coder-30B-A3B-Instruct",
        messages=chat_history
    )

    # 5. Lấy kết quả
    bot_response = completion.choices[0].message.content
    
    # 6. Thêm kết quả vào lịch sử
    chat_history.append({"role": "assistant", "content": bot_response})
    
    # (Tùy chọn: Giới hạn lịch sử chat)
    if len(chat_history) > 10:
        chat_history.pop(1) 
        chat_history.pop(1) 

    return bot_response