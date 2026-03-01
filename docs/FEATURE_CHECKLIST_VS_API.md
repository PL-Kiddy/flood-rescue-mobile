# Bảng kiểm tra tính năng app vs Business Process & API

## Tổng quan vai trò app hỗ trợ

| Vai trò        | Luồng nghiệp vụ (BP) | App hiện tại | Ghi chú |
|----------------|----------------------|--------------|---------|
| **Citizen**    | Gửi yêu cầu, theo dõi, xác nhận đã được cứu | ✅ Có đủ màn hình | Cần chỉnh Auth + payload cho đúng API |
| **Rescue Team**| Nhận nhiệm vụ, xem bản đồ, cập nhật trạng thái, báo cáo | ✅ Có đủ màn hình | Thiếu map thật; API thiếu endpoint cho Team cập nhật trạng thái |

---

## I. CITIZEN

### 1. Đăng nhập / Đăng ký

| Yêu cầu BP/API | App hiện tại | Khớp API? | Hành động khi gắn API |
|----------------|--------------|-----------|------------------------|
| Đăng nhập (B1: Citizen đăng nhập hoặc thông tin tối thiểu) | LoginScreen: tab Người dân / Cán bộ, **phone** + password, mock so sánh | ❌ API dùng **email** + password | Đổi form Login: **email** thay phone (hoặc thêm email). Gọi `POST /users/login` với `{ email, password }`. Lưu `data.token` và `data.user` (AsyncStorage). |
| Đăng ký | SignupScreen: fullName, **phone**, password, role (citizen/official) | ❌ API: **username**, **email**, password, role | Đăng ký: thêm ô **email**; dùng fullName → username. Gọi `POST /users/register` với `{ username, email, password, role: "user" }`. API không có phone trong register. |
| Phân biệt Citizen vs Rescue (Cán bộ) | Tab "Người dân" / "Cán bộ" → sau login citizen → Home, official → RescueTeamStack | ⚠️ API trả về `user.role` (user, admin, coordinator) | Backend cần định nghĩa role cho Rescue Team (vd: `user` + team_id, hoặc role `rescue_team`). App dựa vào role hoặc team_id để chuyển CitizenStack vs RescueTeamStack. |

### 2. Gửi yêu cầu cứu hộ (B1)

| Yêu cầu BP/API | App hiện tại | Khớp API? | Hành động khi gắn API |
|----------------|--------------|-----------|------------------------|
| Phân loại: cứu hộ / nhu yếu phẩm / cứu hộ xe / khác | SOSForm → `rescue`; ReliefForm → `supplies` | ⚠️ Thiếu **vehicle_rescue**, **other** | API: `category`: rescue, supplies, vehicle_rescue, other. Có thể thêm 2 lựa chọn "Cứu hộ xe" và "Khác" trên Home hoặc gộp vào 1 form chung. |
| Tỉnh/TP, SĐT, mô tả, số người, ưu tiên | Cả hai form có: province_city, phone, description, num_people, priority | ✅ | Map trực tiếp. API không có `contact_name` → bỏ hoặc gộp vào description khi gọi API. |
| Vị trí: GPS hoặc nhập địa chỉ tay | SOSForm & ReliefForm: nút "Lấy vị trí tự động" (GPS), ô địa chỉ (address) | ✅ | `location_type`: "gps" | "manual"; nếu gps gửi `latitude`, `longitude`; nếu manual gửi `address`. |
| Đính kèm hình ảnh/video | Form có ô chụp/tải ảnh nhưng **chưa upload**, chỉ mock | ⚠️ | API có `media_urls`: array of URLs. Cần flow upload ảnh lên server (hoặc storage) lấy URL rồi gửi trong `media_urls`. |
| Trạng thái New / Pending Verification | Mock: status = new sau khi tạo | ✅ | API tạo request trả về `status: "new"`. |

**Payload gửi API (POST /rescue-requests):**

- Bắt buộc: `category`, `province_city`, `phone_number`, `description`, `num_people` (optional, default 1), `priority` (optional), `location_type`, và **hoặc** `latitude`+`longitude` **hoặc** `address`.
- Tùy chọn: `media_urls`, `user_id` (nếu đã đăng nhập, lấy từ token/profile).

### 3. Theo dõi & nhận thông báo (B2, B4)

| Yêu cầu BP/API | App hiện tại | Khớp API? | Hành động khi gắn API |
|----------------|--------------|-----------|------------------------|
| Theo dõi trạng thái yêu cầu | MyRequestsScreen: danh sách theo user | ⚠️ | API: `GET /rescue-requests?user_id=...` (cần gửi user_id từ user đăng nhập). Nếu chưa đăng nhập, backend có thể không trả về theo user → cần quy ước (vd: lưu request_id local sau khi tạo). |
| Chi tiết yêu cầu | RequestDetailScreen: mã, trạng thái, liên hệ, địa điểm, mô tả, đội thực hiện, ghi chú hoàn thành | ✅ | `GET /rescue-requests/:id`. Map response vào UI. |
| Nhận thông báo (real-time) | Chưa có push notification | ❌ | BP yêu cầu thông báo khi có cập nhật. Cần tích hợp push (expo-notifications) + backend webhook/polling. Có thể làm giai đoạn sau. |

### 4. Xác nhận đã được cứu / phản hồi (B6)

| Yêu cầu BP/API | App hiện tại | Khớp API? | Hành động khi gắn API |
|----------------|--------------|-----------|------------------------|
| Xác nhận đã được cứu / nhận cứu trợ | ConfirmRescueScreen: đánh giá 1–5 sao, phản hồi chữ, nút "Gửi xác nhận & phản hồi" | ⚠️ | API doc **không** mô tả endpoint "citizen confirm" hay "feedback". Cần backend: PATCH/PUT rescue-request (vd: `confirmed_by_citizen`, `citizen_feedback: { rating, comment }`) hoặc endpoint riêng. Khi có endpoint thì gọi từ ConfirmRescueScreen. |

---

## II. RESCUE TEAM

### 1. Đăng nhập

| Yêu cầu BP/API | App hiện tại | Khớp API? | Hành động khi gắn API |
|----------------|--------------|-----------|------------------------|
| Rescue Team đăng nhập | LoginScreen tab "Cán bộ": phone + password → vào RescueTeamStack | ⚠️ | API login trả về `user` (id, username, email, role). Không có role "rescue_team" hay team_id trong doc. Cần backend: user thuộc đội cứu hộ (vd: bảng team_members) và trả về `team_id` hoặc endpoint `GET /users/profile` kèm team. App sau login (role/team_id) chuyển sang RescueTeamStack. |

### 2. Nhận nhiệm vụ được phân công (B3)

| Yêu cầu BP/API | App hiện tại | Khớp API? | Hành động khi gắn API |
|----------------|--------------|-----------|------------------------|
| Danh sách nhiệm vụ được giao | TaskAssignmentScreen: `getMockAssignedTasks(MOCK_TEAM_ID)` | ⚠️ | API: `GET /rescue-requests` không có filter `assigned_team_id`. Cần backend: thêm query `assigned_team_id` hoặc endpoint kiểu `GET /rescue-teams/:id/assigned-requests` để đội lấy nhiệm vụ của mình. |
| Nhận / Từ chối nhiệm vụ | Nút "Nhận nhiệm vụ" / "Từ chối" → cập nhật mock mission_status | ❌ | API không có endpoint cho **Team** accept/decline. Chỉ có Coordinator "Assign Team". Cần backend: PATCH rescue-request hoặc mission (vd: `accepted_by_team`, `declined`, `decline_reason`). |

### 3. Xem chi tiết yêu cầu và vị trí cứu hộ trên bản đồ (BP)

| Yêu cầu BP/API | App hiện tại | Khớp API? | Hành động khi gắn API |
|----------------|--------------|-----------|------------------------|
| Chi tiết yêu cầu | TaskAssignmentScreen: mã, địa chỉ, nút gọi điện, dẫn đường | ✅ | Dùng `GET /rescue-requests/:id` (đã có). |
| **Vị trí cứu hộ trên bản đồ** | Hiện là **ảnh tĩnh** (map placeholder), không có MapView + marker | ❌ | Cần thay bằng **MapView** (react-native-maps), center tại `latitude`, `longitude` của request; marker tại điểm cứu hộ; có thể bật `showsUserLocation` để thấy vị trí đội. |

### 4. Cập nhật trạng thái thực hiện (B4, B5)

| Yêu cầu BP/API | App hiện tại | Khớp API? | Hành động khi gắn API |
|----------------|--------------|-----------|------------------------|
| Đang di chuyển (In Transit) | Nút "Đang di chuyển" → mission_status in_transit | ❌ | API không có endpoint cho Team cập nhật trạng thái. Chỉ có Coordinator `POST .../complete`. Cần backend: PATCH/PUT (vd: `mission_status`: in_transit | on_site | completed) cho phép Team (hoặc role tương ứng) gọi. |
| Đã đến nơi (On Site) | Nút "Đã đến nơi" → mission_status on_site | ❌ | Như trên. |
| Hoàn thành + báo cáo | Modal nhập "Báo cáo hoàn thành" (completion_notes) → completed | ⚠️ | API có `POST /rescue-requests/:id/complete` nhưng **Coordinator or Admin only**. Cần quyết định: (1) Team gọi complete (backend mở quyền) hoặc (2) Team chỉ gửi completion_notes, Coordinator mới bấm complete. |

### 5. Dẫn đường, liên hệ người dân

| Yêu cầu BP/API | App hiện tại | Khớp API? | Hành động khi gắn API |
|----------------|--------------|-----------|------------------------|
| Dẫn đường | Nút "Dẫn đường" (chưa gắn link) | ✅ Dữ liệu có | Mở map: `Linking.openURL(\`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}\`)` (hoặc Apple Maps trên iOS) với lat/lng của request. |
| Liên hệ người dân | Nút gọi điện (số từ request) | ✅ | Đã có Linking.openURL(`tel:...`). Chỉ cần đảm bảo response request có `phone_number`. |

---

## III. Trạng thái & danh mục

| Hạng mục | Mock / App | API | Ghi chú |
|----------|------------|-----|---------|
| Trạng thái yêu cầu | new, pending_verification, on_mission, completed, rejected | Giống API flow | Khớp. |
| Phân loại (category) | rescue, supplies, vehicle_rescue, other | Cùng enum | App chưa có form vehicle_rescue, other. |
| Ưu tiên (priority) | urgent, high, medium, low | low, medium, high, urgent | Khớp. |
| Mission status (Team) | assigned, accepted, declined, in_transit, on_site, completed | API không mô tả rõ mission status | Backend cần mô hình mission/assignment với các trạng thái này nếu muốn Team cập nhật từng bước. |

---

## IV. Danh sách việc cần làm trước khi gắn API

### Citizen

1. **Auth:** Đổi Login sang **email** + password; gọi `POST /users/login`; lưu token + user.
2. **Auth:** Đăng ký: thêm **email**, map username từ fullName; gọi `POST /users/register`. Quyết định giữ/bỏ phone trong form (API không có trong register).
3. **Tạo yêu cầu:** SOSForm/ReliefForm: gọi `POST /rescue-requests` với payload đúng (bỏ contact_name hoặc chỉ dùng trong description); gửi `user_id` nếu đã đăng nhập.
4. **Danh sách yêu cầu của tôi:** Gọi `GET /rescue-requests?user_id=<current_user_id>` (hoặc cơ chế backend cung cấp cho "my requests").
5. **Chi tiết:** `GET /rescue-requests/:id` đã đủ cho RequestDetailScreen.
6. **Xác nhận đã cứu + feedback:** Chờ backend bổ sung endpoint (vd: PATCH rescue-request với confirmed_by_citizen, citizen_feedback); sau đó gắn vào ConfirmRescueScreen.
7. (Tùy chọn) Thêm category **vehicle_rescue** và **other** nếu product yêu cầu.
8. (Giai đoạn sau) Upload ảnh → lấy URL → gửi `media_urls`; Push notification.

### Rescue Team

1. **Auth:** Login "Cán bộ" dùng chung `POST /users/login`; backend trả về role hoặc team_id để app chuyển sang RescueTeamStack và biết team hiện tại.
2. **Danh sách nhiệm vụ:** Backend cung cấp endpoint lấy requests theo assigned_team_id (hoặc theo user/team). App gọi thay cho getMockAssignedTasks.
3. **Bản đồ vị trí cứu hộ:** TaskAssignmentScreen dùng MapView, marker tại (latitude, longitude) của request, có nút dẫn đường mở Google/Apple Maps.
4. **Accept/Decline:** Backend bổ sung endpoint cho Team nhận/từ chối nhiệm vụ; app gọi thay mock.
5. **Cập nhật trạng thái (In Transit, On Site, Completed):** Backend bổ sung PATCH/PUT cho mission status (và có thể complete) bởi Team; app gọi thay mock.

### Chung

- Tạo module **api** (axios/fetch): baseURL, interceptors gắn `Authorization: Bearer <token>`, xử lý 401 (đăng xuất về Login).
- Lưu token + user (AsyncStorage hoặc SecureStore); có context/store cho auth state để phân quyền và chuyển stack.

---

## V. Kết luận

- **Citizen:** Luồng và màn hình đã phù hợp BP; cần chỉnh Auth (email, register), payload tạo yêu cầu, và danh sách "yêu cầu của tôi" + endpoint xác nhận/feedback khi backend có.
- **Rescue Team:** Luồng và màn hình cơ bản đủ; cần **bản đồ thật** (MapView + marker vị trí cứu hộ) và **API bổ sung** cho: lấy nhiệm vụ theo đội, accept/decline, cập nhật trạng thái (in_transit, on_site, completed) và có thể cả completion bởi Team.

Sau khi chỉnh Auth, payload và bổ sung map + endpoint phía backend cho Rescue Team, app có thể gắn API từng bước (auth → tạo yêu cầu → danh sách → chi tiết → confirm; Rescue: đăng nhập → danh sách nhiệm vụ → map → cập nhật trạng thái).
