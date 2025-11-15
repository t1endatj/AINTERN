from huggingface_hub import InferenceClient

client = InferenceClient(api_key="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")
# Lịch sử hội thoại
chat_history = [
    # {"role": "system", "content": "Bạn là một chatbot về lập trình, trả lời ngắn gọn, chỉ cần những thứ cần thiết và chính xác, không cần icon/emoji, trả lời bằng tiếng việt"}
    {"role": "system", "content": "trả lời bằng tiếng anh"}
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
