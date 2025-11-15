# Mở file: AI_ENGINE/review.py
from huggingface_hub import InferenceClient
import re # ✅ THÊM: Thư viện để xử lý text

client = None # Khai báo client toàn cục

def init_review_client(api_key: str):
    global client
    client = InferenceClient(api_key=api_key)
    print("✅ Khởi tạo Review Client (Chấm bài) thành công.")

# -------------------------------------------------------------------
# HÀM LẤY TEMPLATE (Giữ nguyên)
# -------------------------------------------------------------------
def layTemplateTrongFileTask(ten_task: str):
    # (Hàm này giả định bạn có 1 file JSON ở ../src/templates/...
    #  Đây là logic cũ của bạn)
    try:
     
        
        return "Không có template cụ thể, hãy dựa vào code và yêu cầu."
        
    except Exception as e:
        print(f"Lỗi đọc file template: {e}")
        return "Không thể đọc template"

# -------------------------------------------------------------------
# ✅ HÀM XỬ LÝ TEXT (MỚI)
# -------------------------------------------------------------------
def parse_ai_review_to_dict(review_text: str) -> dict:
    """
    Chuyển đổi text thô từ AI (ví dụ: "Kết quả: Pass\nĐiểm số: 90")
    thành một dictionary (JSON) mà Node.js có thể hiểu.
    """
    passed = False
    score = 0
    feedback = "Không thể phân tích phản hồi của AI."

    try:
        # 1. TÌM KẾT QUẢ (Pass / Không Pass)
        pass_match = re.search(r"K[eế]t qu[ảa]:\s*\"?(Pass)\"?", review_text, re.IGNORECASE)
        if pass_match:
            passed = True

        # 2. TÌM ĐIỂM SỐ
        score_match = re.search(r"[Đđ]i[ểe]m s[ốo]:\s*(\d{1,3})", review_text, re.IGNORECASE)
        if score_match:
            score = int(score_match.group(1))

        # 3. TÌM FEEDBACK
        # Lấy mọi thứ sau chữ "Feedback:"
        feedback_match = re.search(r"Feedback:(.*)", review_text, re.IGNORECASE | re.DOTALL)
        if feedback_match:
            feedback = feedback_match.group(1).strip()
        else:
            # Nếu không có "Feedback:", lấy text thô làm feedback
            feedback = review_text 

        return {
            "passed": passed,
            "score": score,
            "feedback": feedback
        }

    except Exception as e:
        print(f"Lỗi parse_ai_review: {e}")
        # Trả về lỗi
        return {
            "passed": False,
            "score": 0,
            "feedback": f"Lỗi phân tích AI: {review_text}"
        }


def review_with_bot(code: str, template: str):
    if client is None:
        raise Exception("Review client chưa được khởi tạo. Hãy gọi init_review_client() từ main.py")
        
    # PROMPT (Prompt cũ của bạn)
    system_prompt = """
    Bạn là một người đánh giá code website.
    So sánh code được cung cấp với đề bài và code mẫu có sẵn.
    Kiểm tra rằng các id của section, tên class chính xác như mô tả.
    Không cần chính xác nội dung văn bản và kích thước các phần tử 100%, nhớ kỹ không được dùng icon
    
    Luôn trả lời theo định dạng sau: 

    Kết quả: ("Pass" hoặc "Không Pass") 
    Điểm số: (điểm) / 100 
    Feedback: 
    
    ở phần Feedback: không sử dụng icon/emoji  
    ở phần Kết quả: nếu code không có lỗi cú pháp và đúng trên 90% đề bài thì cho pass
    ở phần Điểm số: hãy chấm điểm một cách công bằng, nếu code sai hoặc thiếu cú pháp thì cho 0 điểm
    """
    
    user_message = f"code được cấp: {code}\n\n tiêu chí: {template}"
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ]

    # Gọi API Hugging Face
    completion = client.chat.completions.create(
        model="Qwen/Qwen3-Coder-30B-A3B-Instruct", 
        messages=messages
    )
    
    review_text_raw = completion.choices[0].message.content
    
    print("--- Phản hồi thô từ AI (Review) ---")
    print(review_text_raw)
    print("---------------------------------")
    
    review_dict = parse_ai_review_to_dict(review_text_raw)
    
    return review_dict # Trả về dict (JSON)