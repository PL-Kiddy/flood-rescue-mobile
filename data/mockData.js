// ============ MOCK DATA THEO LUỒNG NGHIỆP VỤ (B1–B6) ============
// Hai vai trò: Citizen, Rescue Team. Dùng mock trước khi gọi API.

// --- Trạng thái yêu cầu cứu hộ (Rescue Request) ---
export const REQUEST_STATUS = {
  NEW: 'new',
  PENDING_VERIFICATION: 'pending_verification',
  ON_MISSION: 'on_mission',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};

// --- Trạng thái nhiệm vụ đội cứu hộ (Mission) ---
export const MISSION_STATUS = {
  ASSIGNED: 'assigned',       // Vừa được phân công, chưa phản hồi
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  IN_TRANSIT: 'in_transit',  // Đang di chuyển
  ON_SITE: 'on_site',        // Đã đến nơi
  COMPLETED: 'completed',
};

// --- Phân loại yêu cầu (B1) ---
export const REQUEST_CATEGORY = {
  RESCUE: 'rescue',
  SUPPLIES: 'supplies',
  VEHICLE_RESCUE: 'vehicle_rescue',
  OTHER: 'other',
};

export const REQUEST_CATEGORY_LABEL = {
  rescue: 'Cần cứu hộ',
  supplies: 'Cần nhu yếu phẩm',
  vehicle_rescue: 'Cần cứu hộ xe',
  other: 'Khác',
};

// --- Mức độ ưu tiên ---
export const PRIORITY_LEVELS = [
  { value: 'urgent', label: 'Khẩn cấp' },
  { value: 'high', label: 'Cao' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'low', label: 'Thấp' },
];

// --- Store in-memory (mock): thêm/sửa từ app ---
let _rescueRequests = [];
let _requestIdCounter = 1;

function generateRequestCode() {
  const n = 9900 + (_requestIdCounter % 100);
  _requestIdCounter += 1;
  return `#RE-${n}`;
}

export function getMockRescueRequests() {
  return _rescueRequests.length ? _rescueRequests : [...MOCK_RESCUE_REQUESTS];
}

export function setMockRescueRequests(requests) {
  _rescueRequests = requests;
}

export function addMockRescueRequest(payload) {
  const id = `req_${Date.now()}_${Math.round(Math.random() * 999)}`;
  const code = generateRequestCode();
  const newReq = {
    id,
    code,
    category: payload.category || REQUEST_CATEGORY.RESCUE,
    province_city: payload.province_city || '',
    phone_number: payload.phone_number || payload.phone || '',
    contact_name: payload.contact_name || payload.name || '',
    description: payload.description || '',
    num_people: payload.num_people || 1,
    priority: payload.priority || 'medium',
    status: REQUEST_STATUS.NEW,
    location_type: payload.location_type || 'manual',
    latitude: payload.latitude ?? null,
    longitude: payload.longitude ?? null,
    address: payload.address || '',
    media_urls: payload.media_urls || [],
    user_id: payload.user_id || null,
    created_at: new Date().toISOString(),
    assigned_team_id: null,
    assigned_team: null,
    mission_status: null,
    confirmed_by_citizen: false,
    citizen_feedback: null,
    completion_notes: null,
  };
  _rescueRequests = _rescueRequests.length ? _rescueRequests : [...MOCK_RESCUE_REQUESTS];
  _rescueRequests.unshift(newReq);
  return newReq;
}

export function updateMockRescueRequest(id, updates) {
  _rescueRequests = _rescueRequests.length ? _rescueRequests : [...MOCK_RESCUE_REQUESTS];
  const i = _rescueRequests.findIndex((r) => r.id === id);
  if (i === -1) return null;
  _rescueRequests[i] = { ..._rescueRequests[i], ...updates };
  return _rescueRequests[i];
}

export function getMockRequestsByUser(userId) {
  const list = getMockRescueRequests();
  if (!userId) return list;
  return list.filter((r) => r.user_id === userId);
}

// Nhiệm vụ được phân công cho đội (Rescue Team) – lọc từ requests có assigned_team_id
export function getMockAssignedTasks(teamId) {
  const list = getMockRescueRequests();
  if (!teamId) return list.filter((r) => r.assigned_team_id != null);
  return list.filter((r) => r.assigned_team_id === teamId);
}

// --- Dữ liệu mẫu ban đầu ---
const MOCK_RESCUE_REQUESTS = [
  {
    id: 'req_001',
    code: '#RE-9921',
    category: REQUEST_CATEGORY.RESCUE,
    province_city: 'Cần Thơ',
    phone_number: '0901234567',
    contact_name: 'Nguyễn Văn An',
    description: 'Nhà bị ngập nước, 5 người kẹt trên tầng 2. Cụ ông 82 tuổi đi lại khó khăn.',
    num_people: 5,
    priority: 'high',
    status: REQUEST_STATUS.ON_MISSION,
    location_type: 'gps',
    latitude: 10.034333,
    longitude: 105.788857,
    address: '123 Đường Lê Lợi, Phường Bến Thành, Quận 1',
    media_urls: [],
    user_id: 'user_001',
    created_at: '2026-02-01T10:30:00.000Z',
    assigned_team_id: 'team_alpha_1',
    assigned_team: { id: 'team_alpha_1', name: 'Đội Cứu Hộ Cần Thơ 1', leader_name: 'Lê Văn Nam' },
    mission_status: MISSION_STATUS.ACCEPTED,
    completion_notes: null,
    confirmed_by_citizen: false,
    citizen_feedback: null,
  },
  {
    id: 'req_002',
    code: '#RE-9920',
    category: REQUEST_CATEGORY.RESCUE,
    province_city: 'TP. Hồ Chí Minh',
    phone_number: '0912345678',
    contact_name: 'Trần Thị B',
    description: 'Kẹt trên mái nhà, nước dâng cao.',
    num_people: 3,
    priority: 'urgent',
    status: REQUEST_STATUS.COMPLETED,
    location_type: 'manual',
    latitude: null,
    longitude: null,
    address: '45 Nguyễn Huệ, Quận 1',
    media_urls: [],
    user_id: 'user_002',
    created_at: '2026-02-01T09:15:00.000Z',
    assigned_team_id: 'team_alpha_1',
    assigned_team: { id: 'team_alpha_1', name: 'Đội Cứu Hộ Cần Thơ 1' },
    mission_status: MISSION_STATUS.COMPLETED,
    completion_notes: 'Đã sơ tán 3 người đến điểm an toàn.',
    confirmed_by_citizen: true,
    citizen_feedback: { rating: 5, comment: 'Rất nhanh chóng, cảm ơn đội cứu hộ.' },
  },
  {
    id: 'req_003',
    code: '#RE-9918',
    category: REQUEST_CATEGORY.SUPPLIES,
    province_city: 'Cần Thơ',
    phone_number: '0987654321',
    contact_name: 'Lê Văn C',
    description: 'Cần nhu yếu phẩm: gạo, nước uống, mì tôm. Khu vực bị cô lập.',
    num_people: 4,
    priority: 'medium',
    status: REQUEST_STATUS.PENDING_VERIFICATION,
    location_type: 'manual',
    latitude: null,
    longitude: null,
    address: 'Hẻm 203 XVNT, Bình Thạnh',
    media_urls: [],
    user_id: null,
    created_at: '2026-02-01T08:00:00.000Z',
    assigned_team_id: null,
    assigned_team: null,
    mission_status: null,
    completion_notes: null,
    confirmed_by_citizen: false,
    citizen_feedback: null,
  },
  {
    id: 'req_004',
    code: '#RE-9917',
    category: REQUEST_CATEGORY.RESCUE,
    province_city: 'Cần Thơ',
    phone_number: '0901112233',
    contact_name: 'Phạm Văn D',
    description: 'Nhà 1 trệt bị ngập, 2 người già cần đưa đến điểm sơ tán.',
    num_people: 2,
    priority: 'high',
    status: REQUEST_STATUS.PENDING_VERIFICATION,
    location_type: 'manual',
    latitude: null,
    longitude: null,
    address: '78 Đường 3/2, Ninh Kiều',
    media_urls: [],
    user_id: null,
    created_at: '2026-02-01T11:00:00.000Z',
    assigned_team_id: 'team_alpha_1',
    assigned_team: { id: 'team_alpha_1', name: 'Đội Cứu Hộ Cần Thơ 1' },
    mission_status: MISSION_STATUS.ASSIGNED,
    completion_notes: null,
    confirmed_by_citizen: false,
    citizen_feedback: null,
  },
];

// Khởi tạo store từ dữ liệu mẫu
_rescueRequests = [...MOCK_RESCUE_REQUESTS];

// --- Citizen giả lập (để filter "yêu cầu của tôi") ---
export const MOCK_CITIZEN_ID = 'user_001';

// --- Rescue Team hiện tại (để filter nhiệm vụ) ---
export const MOCK_TEAM_ID = 'team_alpha_1';

// --- Danh mục nhu yếu phẩm (ReliefForm) ---
export const reliefCategories = [
  { id: 1, name: 'Thực phẩm' },
  { id: 2, name: 'Nước sạch' },
  { id: 3, name: 'Thuốc men' },
  { id: 4, name: 'Đồ vệ sinh' },
  { id: 5, name: 'Quần áo / Chăn màn' },
];

export const sosCategories = [
  { id: 1, name: 'Nước dâng cao', emergency: true },
  { id: 2, name: 'Kẹt trên mái nhà', emergency: true },
  { id: 3, name: 'Sạt lở đất', emergency: true },
  { id: 4, name: 'Bệnh tình cấp', emergency: true },
  { id: 5, name: 'Khác', emergency: false },
];

export const emergencyNumbers = [
  { id: 1, name: 'Cảnh sát', number: '113' },
  { id: 2, name: 'Cứu hỏa', number: '114' },
  { id: 3, name: 'Cấp cứu', number: '115' },
];

// Map trạng thái → label hiển thị
export const REQUEST_STATUS_LABEL = {
  [REQUEST_STATUS.NEW]: 'Mới',
  [REQUEST_STATUS.PENDING_VERIFICATION]: 'Chờ xác minh',
  [REQUEST_STATUS.ON_MISSION]: 'Đang thực hiện',
  [REQUEST_STATUS.COMPLETED]: 'Hoàn thành',
  [REQUEST_STATUS.REJECTED]: 'Từ chối',
};

export const MISSION_STATUS_LABEL = {
  [MISSION_STATUS.ASSIGNED]: 'Chờ phản hồi',
  [MISSION_STATUS.ACCEPTED]: 'Đã nhận',
  [MISSION_STATUS.DECLINED]: 'Từ chối',
  [MISSION_STATUS.IN_TRANSIT]: 'Đang di chuyển',
  [MISSION_STATUS.ON_SITE]: 'Đã đến nơi',
  [MISSION_STATUS.COMPLETED]: 'Hoàn thành',
};

// Legacy export (giữ tương thích)
export const mockUser = {
  id: MOCK_CITIZEN_ID,
  name: 'Nguyễn Văn A',
  phone: '0912345678',
};

export const mockRescueRequests = MOCK_RESCUE_REQUESTS;
