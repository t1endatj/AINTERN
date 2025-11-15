import { useEffect, useRef } from "react";

// Hook sử dụng MutationObserver để tự động cuộn khi nội dung chat thay đổi
export function useScrollToBottom() {
  const containerRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      // MutationObserver theo dõi các thay đổi trong DOM (như khi tin nhắn mới được thêm vào)
      const observer = new MutationObserver(() => {
        // Cuộn ngay lập tức (instant) để giữ vị trí cuối cùng
        end.scrollIntoView({ behavior: "smooth", block: "end" }); 
      });

      // Bắt đầu theo dõi container chat
      observer.observe(container, {
        childList: true, // Quan sát việc thêm/xóa phần tử
        subtree: true,   // Quan sát các phần tử con
      });

      return () => observer.disconnect(); // Dọn dẹp observer khi component unmount
    }
  }, []); // Chỉ chạy một lần khi component mount

  return [containerRef, endRef];
}
