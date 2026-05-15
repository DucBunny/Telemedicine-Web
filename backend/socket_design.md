# Tài Liệu Quy Chuẩn WebSockets (Socket.IO)

Tài liệu này quy định các nguyên tắc đặt tên (Naming Conventions) cho Room và Event trong toàn bộ hệ thống Telehealth. Bắt buộc tuân thủ để đảm bảo tính nhất quán giữa Frontend và Backend.

## 1. Cấu Trúc Namespaces

Hệ thống sử dụng Multiplexing chia làm 4 Namespaces độc lập:

- `/system`: Quản lý trạng thái Online/Offline, Cảnh báo AI (Alerts), Lịch hẹn (Appointments) và Thông báo chung (Notifications). Nóng vai trò là "Global Hub".
- `/chat`: Quản lý luồng tin nhắn giữa các User (Dữ liệu lưu MongoDB).
- `/monitor`: Truyền phát (Stream) dữ liệu sinh tồn từ thiết bị IoT.

---

## 2. Quy Tắc Đặt Tên Room (Room Naming - Theo chuẩn Redis)

Mỗi Namespace có thể quản lý nhiều _Loại Phòng (Room Types)_ khác nhau.
Cú pháp: `[phân_loại]:[ID_tuỳ_chọn]`

| Namespace  | Loại Phòng (Object Key) | Cú pháp Room           | Ví dụ thực tế         | Mục đích                                                 |
| :--------- | :---------------------- | :--------------------- | :-------------------- | :------------------------------------------------------- |
| `/system`  | `PERSONAL`              | `user:{id}`            | `user:123`            | Thông báo đích danh (Alert cá nhân, Lịch hẹn).           |
| `/system`  | `ROLE`                  | `role:{role}`          | `role:doctor`         | Thông báo tập thể (Báo họp giao ban cho toàn bộ bác sĩ). |
| `/system`  | `GLOBAL`                | `system:global`        | `system:global`       | Báo bảo trì server cho tất cả mọi người.                 |
| `/chat`    | `CONVERSATION`          | `conversation:{id}`    | `conversation:abc`    | Gửi tin nhắn trong 1 cuộc hội thoại.                     |
| `/monitor` | `PATIENT`               | `monitor:patient:{id}` | `monitor:patient:789` | Stream ECG/SpO2 của bệnh nhân 789.                       |

---

## 3. Quy Tắc Đặt Tên Event (Event Naming)

Sử dụng định dạng: `[đối_tượng]:[hành_động]` (Snake case, toàn bộ viết thường).

- **Client Emit:** Dùng động từ nguyên mẫu (VD: `message:send`, `room:join`).
- **Server Emit:** Dùng động từ phân từ 2 / quá khứ / tính từ mô tả sự kiện đã xảy ra (VD: `message:new`, `alert:critical`).

### 3.1. Namespace: `/system`

| Event Name                         | Người Gửi | Mô tả / Payload                                  |
| :--------------------------------- | :-------- | :----------------------------------------------- |
| `room:join`                        | Client    | Yêu cầu join vào personal room khi vừa connect.  |
| `presence:online`                  | Server    | User đã kết nối (Bắn cho các user khác biết).    |
| `presence:offline`                 | Server    | User đã ngắt kết nối hoàn toàn.                  |
| `alert:critical`                   | Server    | Cảnh báo y tế khẩn cấp đỏ.                       |
| `alert:warning`                    | Server    | Cảnh báo y tế mức vàng.                          |
| `alert:acknowledge`                | Client    | Bác sĩ xác nhận đang xử lý cảnh báo.             |
| `appointment:created`              | Server    | Có lịch hẹn mới chờ duyệt.                       |
| `appointment:updated`              | Server    | Lịch hẹn cập nhật.                               |
| `notification:new`                 | Server    | Thông báo hệ thống chung.                        |
| `notification:read`                | Client    | Đánh dấu đã đọc thông báo.                       |
| `notification:unread_count_update` | Server    | Bắn số lượng thông báo chưa đọc để update badge. |
| `call:invite`                      | Server    | Gửi cuộc gọi đến người nhận.                     |
| `call:incoming`                    | Server    | Có cuộc gọi đến người nhận.                      |
| `call:accept`                      | Client    | Chấp nhận cuộc gọi.                              |
| `call:reject`                      | Client    | Từ chối cuộc gọi.                                |
| `call:end`                         | Server    | Cuộc gọi đã kết thúc.                            |

### 3.2. Namespace: `/chat`

| Event Name     | Người Gửi | Mô tả / Payload                            |
| :------------- | :-------- | :----------------------------------------- |
| `room:join`    | Client    | Yêu cầu join vào phòng chat cụ thể.        |
| `room:leave`   | Client    | Yêu cầu rời khỏi phòng chat.               |
| `message:send` | Client    | Gửi 1 tin nhắn mới lên Server.             |
| `message:new`  | Server    | Bắn tin nhắn mới cho các user trong phòng. |
| `typing:start` | Client    | Bắt đầu gõ phím.                           |
| `typing:stop`  | Client    | Ngừng gõ phím.                             |
| `message:read` | Client    | Đánh dấu đã đọc tin nhắn.                  |

### 3.3. Namespace: `/monitor`

| Event Name         | Người Gửi  | Mô tả / Payload                          |
| :----------------- | :--------- | :--------------------------------------- |
| `room:join`        | Client     | Bác sĩ yêu cầu xem stream của bệnh nhân. |
| `room:leave`       | Client     | Bác sĩ ngừng xem stream.                 |
| `sensor:push_data` | Client/IoT | Thiết bị đẩy dữ liệu ECG/BPM lên Server. |
| `sensor:data_sync` | Server     | Server phân phối data cho Bác sĩ xem.    |

---

## 4. Best Practices (Quy tắc bắt buộc khi Code)

1. **Tuyệt đối không dùng hard-code (gõ text chay) cho Event/Room.**
2. Mọi chuỗi ký tự phải được tham chiếu từ file `socketConstants.ts` ở Frontend và file tương đương ở Backend.
3. Khi Backend bắt được sự kiện `disconnect` ở `/system`, phải check Redis (lệnh `SCARD`) trước khi emit `presence:offline` để đảm bảo người dùng đã đóng tất cả các tab.
