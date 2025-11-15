from huggingface_hub import InferenceClient

HF_TOKEN = ""

client = InferenceClient(api_key=HF_TOKEN)

def review_with_bot(code: str, template: str):
    completion = client.chat.completions.create(
        model="Qwen/Qwen2.5-Coder-32B-Instruct",
        messages=[
            {
                "role": "system",
                "content": (
                    "Bạn là người chấm code website chuyên nghiệp. "
                    "So sánh code với yêu cầu và code mẫu. "
                    "Kiểm tra: cấu trúc HTML, class/id, logic JS. "
                    "KHÔNG yêu cầu 100% giống về text content hay CSS. "
                    "\n\nBẮT BUỘC trả lời theo format:\n"
                    "Kết quả: Pass/Không Pass\n"
                    "Điểm số: .../100\n"
                    "Feedback: (chi tiết)\n\n"
                    "KHÔNG dùng emoji."
                    "Kết quả trên 60% là PASS"
                )
            },
            {
                "role": "user",
                "content": f"Code học viên:\n{code}\n\nYêu cầu & Code mẫu:\n{template}"
            }
        ],
        max_tokens=1024
    )
    return completion.choices[0].message.content