
from huggingface_hub import InferenceClient

client = InferenceClient(api_key="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")

#lay code (template) trong task tuong ung ra
def layTemplateTrongFileTask(ten_task: str):
    with open(f"task/{ten_task}", "r", encoding="utf-8") as f:
        content = f.read()
    return content

def review_with_bot(code: str, template: str):
    completion = client.chat.completions.create(
        model="Qwen/Qwen3-Coder-30B-A3B-Instruct",
        messages=[
        {
            "role": "system",
            "content": "bạn là một người đánh giá code website. So sánh code được cung cấp với đề bài và code mẫu có sẵn. \
                            Kiểm tra rằng các id của section, tên class chính xác như mô tả. \
                            Không cần chính xác nội dung văn bản và kích thước các phần tử 100% \
                            Luôn trả lời theo định dạng sau: \n\nKết quả: Pass/Không Pass\nĐiểm số: (điểm) / 100 \nFeedback: \
                            Không sử dụng icon/emoji"

        },
        {
            "role": "user",
            "content": f"code được cấp: {code} \n tiêu chí: {template}"
        }
        ],
    )
    return completion.choices[0].message.content