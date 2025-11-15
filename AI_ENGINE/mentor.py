import os 
from huggingface_hub import InferenceClient

# Đọc giá trị của biến môi trường có tên HUGGINGFACE_API_KEY
HF_TOKEN = os.environ.get("HUGGINGFACE_API_KEY") 

# Sử dụng biến này để khởi tạo client
client = InferenceClient(api_key=HF_TOKEN)
# Lịch sử hội thoại
chat_history = [
    # {"role": "system", "content": "Bạn là một chatbot về lập trình, trả lời ngắn gọn, chỉ cần những thứ cần thiết và chính xác, không cần icon/emoji, trả lời bằng tiếng việt"}
    {"role": "system", "content": "trả lời bằng tiếng việt"}
]

#======================================================================
def chat_with_bot(user_input: str):
    chat_history.append( {"role": "user", "content": user_input})

    completion = client.chat.completions.create(
        model="Qwen/Qwen3-Coder-30B-A3B-Instruct",
        messages=chat_history
    )

    bot_response = completion.choices[0].message.content
    chat_history.append({"role": "assistant", "content": bot_response})
    return bot_response
#========================================================================
