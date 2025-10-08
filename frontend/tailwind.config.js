// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"], // Kích hoạt chế độ dark mode bằng cách thêm class 'dark' vào phần tử gốc.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Mở rộng các cấu hình mặc định của Tailwind
      colors: {
        border: "hsl(var(--border))", // Màu sắc của đường viền
        input: "hsl(var(--input))", // Màu sắc của input
        ring: "hsl(var(--ring))", // Màu sắc của vòng viền (focus ring)
        background: "hsl(var(--background))", // Màu nền
        foreground: "hsl(var(--foreground))", // Màu chữ
        primary: {
          DEFAULT: "hsl(var(--primary))", // Màu chính
          foreground: "hsl(var(--primary-foreground))", // Màu chữ trên nền chính
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // Màu phụ
          foreground: "hsl(var(--secondary-foreground))", // Màu chữ trên nền phụ
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))", // Màu phá hủy (ví dụ: nút xóa)
          foreground: "hsl(var(--destructive-foreground))", // Màu chữ trên nút phá hủy
        },
        muted: {
          DEFAULT: "hsl(var(--muted))", // Màu nhạt
          foreground: "hsl(var(--muted-foreground))", // Màu chữ trên nền nhạt
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // Màu nhấn mạnh (accent)
          foreground: "hsl(var(--accent-foreground))", // Màu chữ trên nền nhấn mạnh
        },
        popover: {
          DEFAULT: "hsl(var(--popover))", // Màu popover
          foreground: "hsl(var(--popover-foreground))", // Màu chữ trên popover
        },
        card: {
          DEFAULT: "hsl(var(--card))", // Màu của card
          foreground: "hsl(var(--card-foreground))", // Màu chữ trên card
        },
      },
      borderRadius: {
        lg: "var(--radius)", // Border radius lớn
        md: "calc(var(--radius) - 2px)", // Border radius vừa
        sm: "calc(var(--radius) - 4px)", // Border radius nhỏ
      },
    },
  },
  plugins: [],
}
