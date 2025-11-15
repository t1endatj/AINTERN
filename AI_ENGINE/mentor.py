import os 
from huggingface_hub import InferenceClient

# Đọc giá trị của biến môi trường có tên HUGGINGFACE_API_KEY
HF_TOKEN = os.environ.get("HUGGINGFACE_API_KEY") 

# Sử dụng biến này để khởi tạo client
client = InferenceClient(api_key=HF_TOKEN)
# Lịch sử hội thoại
chat_history = [
    # CẬP NHẬT: Thêm hướng dẫn hệ thống để sử dụng ngữ cảnh task
    {"role": "system", "content": "Bạn là một chatbot mentor lập trình. Hãy trả lời ngắn gọn, chính xác, và KHÔNG có comment. Khi trả lời, hãy ưu tiên các câu hỏi liên quan đến NGỮ CẢNH TASK HIỆN TẠI mà bạn được cung cấp. Luôn trả lời bằng tiếng Việt."}
]

#======================================================================
# CẬP NHẬT: Thêm tham số task_requirement
def chat_with_bot(user_input: str, task_requirement: str): 
    # 1. Ghép thông tin Task vào đầu tin nhắn của người dùng để tạo ngữ cảnh
    contextual_input = f"[NGỮ CẢNH TASK HIỆN TẠI] Yêu cầu là: {task_requirement}. [TIN NHẮN NGƯỜI DÙNG] {user_input}"
    
    # 2. Thêm tin nhắn có ngữ cảnh vào lịch sử
    chat_history.append( {"role": "user", "content": contextual_input})

    completion = client.chat.completions.create(
        model="Qwen/Qwen3-Coder-30B-A3B-Instruct",
        messages=chat_history
    )

    bot_response = completion.choices[0].message.content
    # 3. Lưu phản hồi và trả về
    chat_history.append({"role": "assistant", "content": bot_response})
    return bot_response
#========================================================================