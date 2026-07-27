# MedCare — Backend

API server cho hệ thống telemedicine MedCare. Xây dựng bằng **Node.js**, **Express 5**, **Socket.IO**, **Sequelize** (MySQL/TiDB) và **Mongoose** (MongoDB).

## Yêu cầu hệ thống

| Thành phần   | Phiên bản khuyến nghị                      |
| ------------ | ------------------------------------------ |
| Node.js      | 20.x trở lên                               |
| npm          | 10.x trở lên                               |
| MySQL / TiDB | Tương thích MySQL (dự án dùng TiDB Cloud)  |
| MongoDB      | Atlas hoặc MongoDB local                   |
| Redis        | Bắt buộc (queue, Socket.IO adapter, cache) |

**Lưu ý về gói** `canvas`**:** Backend dùng `canvas` để vẽ biểu đồ trong báo cáo y tế PDF (`medicalReport.queue.js`). Đây là native addon — trên **Windows 64-bit + Node 20**, `npm install` thường **tự tải binary có sẵn**, không cần cài thêm gì. Chỉ khi bước cài `canvas` báo lỗi compile, mới cần [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (workload _Desktop development with C++_) rồi chạy lại `npm install`.

## Cài đặt nhanh

### 1. Clone và cài dependency

```bash
npm install
```

### 2. Tạo file môi trường

```bash
cp .env.example .env
```

Chỉnh sửa `.env` theo môi trường của bạn. Các biến quan trọng:

| Biến                                                      | Mô tả                             | Ví dụ (local)                       |
| --------------------------------------------------------- | --------------------------------- | ----------------------------------- |
| `PORT`                                                    | Cổng API & Socket.IO              | `8080`                              |
| `BASE_URL_FRONTEND`                                       | URL frontend (CORS)               | `http://localhost:3000`             |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Kết nối MySQL/TiDB                | Theo TiDB Cloud hoặc MySQL local    |
| `MONGODB_CLUSTER` hoặc `MONGODB_HOST`                     | MongoDB Atlas (`+srv`) hoặc local | `localhost`                         |
| `MONGODB_USER`, `MONGODB_PASSWORD`, `MONGODB_DB_NAME`     | Thông tin MongoDB                 | —                                   |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`              | Redis                             | `localhost` / `6379`                |
| `JWT_SECRET`, `JWT_REFRESH_SECRET`                        | Khóa ký JWT                       | Chuỗi ngẫu nhiên bảo mật            |
| `CLOUDINARY_*`                                            | Lưu trữ ảnh/tệp                   | Tài khoản Cloudinary                |
| `RESEND_API_KEY`                                          | Gửi email                         | API key Resend                      |
| `ZEGO_APP_ID`, `ZEGO_SERVER_SECRET`                       | Video call ZEGOCLOUD              | —                                   |
| `MQTT_BROKER`, `MQTT_TOPIC`                               | Nhận dữ liệu thiết bị ECG         | Mặc định dùng broker công khai EMQX |
| `ECG_INFERENCE_URL`                                       | Service ML suy luận ECG           | `http://127.0.0.1:8000`             |

Xem đầy đủ danh sách biến trong `[.env.example](./.env.example)`.

### 3. Khởi tạo cơ sở dữ liệu

Đảm bảo MySQL/TiDB và MongoDB đã chạy, sau đó:

```bash
# Tạo DB, chạy migration, seed dữ liệu mẫu (SQL + NoSQL)
npm run db:reset
```

Hoặc từng bước:

```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run seed:nosql
```

### 4. Chạy server

**Môi trường phát triển** (hot-reload với nodemon + babel-node):

```bash
npm run dev
```

**Môi trường production:**

```bash
npm run production
```

Server khởi động tại `http://localhost:8080`. API nằm dưới prefix `/api-v1`.

## Kiểm tra hoạt động

Sau khi chạy `npm run dev`, terminal sẽ hiển thị:

```
Server is running on port http://localhost:8080
[MySQL] Connected successfully.
[MongoDB] Connected successfully.
[Redis] Connected successfully.
All services started successfully
```

Nếu thiếu Redis hoặc MongoDB, server sẽ không khởi động được.

## Chạy bằng Docker

```bash
docker build -t medcare-backend .
docker run --env-file .env -p 8080:8080 medcare-backend
```

Image dùng Node 20 Alpine, build Babel rồi chạy `node ./build/src/server.js`.

## Scripts hữu ích

| Lệnh                 | Mô tả                                 |
| -------------------- | ------------------------------------- |
| `npm run dev`        | Chạy development với nodemon          |
| `npm run build`      | Biên dịch Babel sang thư mục `build/` |
| `npm run production` | Build + chạy production               |
| `npm run db:reset`   | Xóa, tạo lại DB, migrate và seed      |
| `npm run seed:nosql` | Seed dữ liệu MongoDB                  |

## Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/          # Cấu hình DB, Redis, env, Cloudinary...
│   ├── controllers/     # Xử lý request
│   ├── jobs/            # BullMQ workers & cron jobs
│   ├── middlewares/     # Auth, validation, error handling
│   ├── migrations/      # Sequelize migrations (MySQL)
│   ├── models/          # Sequelize & Mongoose models
│   ├── mqtt/            # MQTT client (dữ liệu thiết bị)
│   ├── routes/          # API routes
│   ├── seeders/         # Dữ liệu mẫu
│   ├── services/        # Business logic
│   ├── sockets/         # Socket.IO namespaces
│   └── server.js        # Entry point
├── .env.example
├── Dockerfile
└── package.json
```

## Dịch vụ phụ thuộc

Backend cần các dịch vụ sau để hoạt động đầy đủ:

- **Redis** — BullMQ job queue, Socket.IO Redis adapter, cache ECG
- **MQTT broker** — Nhận gói ECG từ thiết bị (có thể dùng broker công khai khi dev)
- **ECG Inference service** — FastAPI service suy luận nhịp tim bất thường (`ECG_INFERENCE_URL`)
- **Cloudinary** — Upload ảnh hồ sơ, tài liệu y tế
- **Resend** — Gửi email xác thực, thông báo
- **ZEGOCLOUD** — Cuộc gọi video khám từ xa

## Xử lý sự cố

### Không kết nối được MySQL/TiDB

- Kiểm tra `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` trong `.env`
- TiDB Cloud yêu cầu kết nối SSL — cấu hình đã được thiết lập trong `src/config/config.js`
- Với MySQL local không có SSL, có thể cần điều chỉnh `dialectOptions.ssl` trong `src/config/mysql.config.js`

### Lỗi cài `canvas`

Thường gặp khi không tải được prebuild (phiên bản Node lạ, mạng chặn GitHub releases, hoặc Node 32-bit):

1. Dùng **Node.js 64-bit** (khuyến nghị 20.x)
2. Thử lại: `npm install`
3. Nếu vẫn lỗi compile: cài [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (workload _Desktop development with C++_), rồi chạy lại `npm install`

> Dev thuần API/socket/ECG **không cần** tính năng xuất PDF vẫn phải cài `canvas` vì nó nằm trong `dependencies` — nhưng hầu hết máy Windows 64-bit cài được mà không cần build tools.

### Redis connection refused

Cài và khởi động Redis local:

```bash
# Docker
docker run -d --name redis -p 6379:6379 redis:alpine
```

### MongoDB authentication failed

- Atlas: điền `MONGODB_CLUSTER`, `MONGODB_USER`, `MONGODB_PASSWORD`
- Local: để trống `MONGODB_CLUSTER`, cấu hình `MONGODB_HOST=localhost` và `MONGODB_PORT=27017`

## Tài liệu liên quan

- [api-structure.md](./api-structure.md) — Cấu trúc response API
- [socket_design.md](./socket_design.md) — Thiết kế Socket.IO
