// Mock data for the application
export const mockUser = {
  id: 'user_001',
  name: 'Nguyễn Văn A',
  phone: '0912345678',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5tF_1eIvvrD83eWRAoe-3d96B0aXaXs0jqAWxqyswKI8LBiqyVvXHOnhHzw7Lo0qP_mmp2JQP3ThRBAd0GohkAV439UpMYlBTQbLcWRY3WSY9C2s9jILWHGFq-ZDjSsiagrlYlpzMYlzr6tn60wG23atqijkSQSWYuGpd0_vlJ47riljO8rivoPHnrBImgTd_4MZ8AKU-xUIEDckE7iwA8Y3sEa_Fpguo4ZwL_MDTXnAITVBYEaXXfxKQb098GdXmTcTnamZUeU0',
};

export const mockRescueRequests = [
  {
    id: 'req_001',
    type: 'SOS',
    title: 'Nước dâng cao tại quán cà phê',
    severity: 'Critical',
    location: { lat: 21.0285, lng: 105.8542 },
    address: 'Phố Huế, Hà Nội',
    status: 'In Progress',
    createdAt: '2024-02-01T10:30:00',
  },
  {
    id: 'req_002',
    type: 'Relief',
    title: 'Cần nhu yếu phẩm - khu phố A',
    severity: 'High',
    location: { lat: 21.0290, lng: 105.8550 },
    address: 'Khu phố A, Đống Đa',
    status: 'Pending',
    createdAt: '2024-02-01T09:15:00',
  },
];

export const reliefCategories = [
  { id: 1, name: 'Thực phẩm', icon: '🍱' },
  { id: 2, name: 'Nước sạch', icon: '💧' },
  { id: 3, name: 'Thuốc men', icon: '💊' },
  { id: 4, name: 'Đồ vệ sinh', icon: '🧴' },
  { id: 5, name: 'Quần áo / Chăn màn', icon: '👕' },
];

export const sosCategories = [
  { id: 1, name: 'Nước dâng cao', emergency: true },
  { id: 2, name: 'Kẹt trên mái nhà', emergency: true },
  { id: 3, name: 'Sạt lở đất', emergency: true },
  { id: 4, name: 'Bệnh tính cấp', emergency: true },
  { id: 5, name: 'Khác', emergency: false },
];

export const emergencyNumbers = [
  { id: 1, name: 'Cảnh sát', number: '113', icon: '👮' },
  { id: 2, name: 'Cứu hỏa', number: '114', icon: '🚒' },
  { id: 3, name: 'Cấp cứu', number: '115', icon: '🚑' },
];
