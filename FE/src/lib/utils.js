
export function cn(...inputs) {
    // Hàm gộp class: loại bỏ giá trị falsey và nối các chuỗi class còn lại
    return inputs.filter(Boolean).join(' ');
}