export const getRankTitle = (score) => {
    if (score <= 149) {
        return '🐣 Tân Binh'
    } else if (score > 149 && score <= 299) {
        return '📘 Học Sinh Cần Cù'
    } else if (score > 299 && score <= 499) {
        return '✍️ Học Bá Nhiệt Huyết'
    } else if (score > 499 && score <= 699) {
        return '🧠 Học Thần Học Viện'
    } else if (score > 699) {
        return '👑 Thánh TOEIC'
    }
}
