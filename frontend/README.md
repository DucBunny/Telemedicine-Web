# MedCare — Frontend

Giao diện web cho hệ thống telemedicine MedCare. Xây dựng bằng **React 19**, **Vite 7**, **TanStack Router**, **TanStack Query** và **Tailwind CSS 4**.

## Yêu cầu hệ thống


| Thành phần      | Phiên bản khuyến nghị     |
| --------------- | ------------------------- |
| Node.js         | 20.x trở lên              |
| npm             | 10.x trở lên              |
| Backend MedCare | Đang chạy tại cổng `8080` |


## Cài đặt nhanh

### 1. Cài dependency

```bash
cd frontend
npm install
```

### 2. Tạo file môi trường

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:

```env
# URL API backend (có prefix /api-v1)
VITE_API_URL=http://localhost:8080/api-v1

# URL Socket.IO (không có path — client tự nối namespace /system, /monitor, /chat)
VITE_SOCKET_URL=http://localhost:8080

# Kích thước gói ECG — phải khớp với ECG_PACKET_SIZE ở backend
VITE_ECG_PACKET_SIZE=65
```


| Biến                   | Mô tả                                       |
| ---------------------- | ------------------------------------------- |
| `VITE_API_URL`         | Base URL cho HTTP API (`axios`)             |
| `VITE_SOCKET_URL`      | Base URL cho Socket.IO                      |
| `VITE_ECG_PACKET_SIZE` | Số điểm mỗi gói ECG hiển thị trên dashboard |


> **Lưu ý:** `VITE_ECG_PACKET_SIZE` phải trùng với `ECG_PACKET_SIZE` trong `.env` của backend.

### 3. Chạy development server

```bash
npm run dev
```

Ứng dụng mở tại **[http://localhost:3000](http://localhost:3000)**.

Đảm bảo backend đã chạy và `BASE_URL_FRONTEND` trong backend trỏ về `http://localhost:3000` để CORS và cookie hoạt động đúng.

## Build production

```bash
npm run build
```

Kết quả build nằm trong thư mục `dist/`. Xem trước bản build:

```bash
npm run preview
```

## Chạy bằng Docker

```bash
docker build -t medcare-frontend .
docker run -p 3000:3000 medcare-frontend
```

Image dùng nginx phục vụ static files từ `dist/`, lắng nghe cổng `3000`.

> Biến môi trường `VITE_*` được nhúng lúc build. Khi deploy Docker, cần truyền build args hoặc build lại image với `.env` phù hợp.

## Scripts hữu ích


| Lệnh              | Mô tả                                           |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Chạy dev server (cổng 3000, bind mọi interface) |
| `npm run build`   | Build production + kiểm tra TypeScript          |
| `npm run preview` | Xem trước bản build local                       |
| `npm run test`    | Chạy test với Vitest                            |
| `npm run lint`    | Kiểm tra ESLint                                 |
| `npm run format`  | Format với Prettier                             |
| `npm run check`   | Format + lint fix                               |


## Cấu trúc thư mục

```
frontend/
├── src/
│   ├── components/      # UI components dùng chung (shadcn/ui)
│   ├── features/        # Tính năng theo domain (dashboard, auth...)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Axios client, utils
│   ├── routes/          # TanStack Router (file-based routing)
│   ├── stores/          # Zustand stores (auth, socket...)
│   └── types/           # TypeScript types
├── public/              # Static assets
├── .env.example
├── capacitor.config.ts  # Cấu hình app mobile (Capacitor)
├── Dockerfile
├── nginx.conf
└── vite.config.ts
```

## Kết nối với Backend

Frontend giao tiếp với backend qua:

- **REST API** — `VITE_API_URL` (ví dụ: `http://localhost:8080/api-v1`)
- **Socket.IO** — 3 namespace:
  - `/system` — Thông báo hệ thống
  - `/monitor` — Stream ECG realtime
  - `/chat` — Tin nhắn

Cookie `refresh token` được gửi tự động (`withCredentials: true`).

## Build ứng dụng mobile (Capacitor)

Dự án hỗ trợ đóng gói thành app Android qua Capacitor:

```bash
npm run build
npx cap sync android
npx cap open android
```

Cấu hình app trong `[capacitor.config.ts](./capacitor.config.ts)`.

## Xử lý sự cố

### Lỗi CORS hoặc cookie không lưu

- Kiểm tra `BASE_URL_FRONTEND` trong backend `.env` khớp với URL frontend (`http://localhost:3000`)
- Truy cập frontend qua đúng URL đã cấu hình, không dùng IP khác nếu chưa cập nhật CORS

### Socket không kết nối

- Kiểm tra `VITE_SOCKET_URL` trỏ đúng cổng backend (`http://localhost:8080`)
- Đảm bảo Redis đang chạy (backend dùng Redis adapter cho Socket.IO)

### API trả về 401 liên tục

- Xóa cookie/local storage và đăng nhập lại
- Kiểm tra backend đã migrate và seed dữ liệu user mẫu (`npm run db:reset` ở backend)

### Biến môi trường không áp dụng

Vite chỉ đọc biến có prefix `VITE_` lúc **khởi động** dev server. Sau khi sửa `.env`, cần restart `npm run dev`.

## Công nghệ sử dụng

- [Vite](https://vitejs.dev/) — Build tool
- [TanStack Router](https://tanstack.com/router) — Routing
- [TanStack Query](https://tanstack.com/query) — Data fetching & cache
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [shadcn/ui](https://ui.shadcn.com/) — Component library
- [Zustand](https://zustand.docs.pmnd.rs/) — State management
- [Socket.IO Client](https://socket.io/) — Realtime communication

