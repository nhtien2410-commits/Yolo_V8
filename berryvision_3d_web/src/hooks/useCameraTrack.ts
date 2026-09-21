import { useMemo } from 'react';
import { ExhibitionZone } from '../types';

export const EXHIBITION_ZONES: ExhibitionZone[] = [
  {
    id: 'greenhouse',
    title: 'Khu Vực 1: Vòm Kính Sinh Thái 4.0',
    subtitle: 'Hệ Thống Nhà Kính Thông Minh Khép Kín & Thủy Canh Cao Tầng',
    badge: 'SMART GREENHOUSE CORE',
    cameraPos: [0, 8, 18],
    targetPos: [0, 2, 0],
    description: 'Không gian kiến trúc vòm Geodesic phát quang sinh học mô phỏng hệ sinh thái nhà kính Đà Lạt chuẩn High-Tech. Tích hợp cảm biến vi khí hậu IOT đa điểm và giàn dâu tây thủy canh A-Frame.',
    features: [
      'Mái vòm kính cách nhiệt thông minh tự động điều tiết quang phổ',
      'Giàn treo thủy canh tuần hoàn NFT tiết kiệm 85% nước',
      'Hệ thống khuấy tán phấn hoa và kiểm soát bào tử nấm thời gian thực',
      'Tích hợp cụm LED hồng ngoại bước sóng 660nm kích thích quang hợp'
    ],
    stats: [
      { label: 'Diện Tích Vòm', value: '1,200', unit: 'm²' },
      { label: 'Nhiệt Độ TB', value: '21.5', unit: '°C' },
      { label: 'Độ Ẩm Tương Đối', value: '78.4', unit: '%' },
      { label: 'Sản Lượng Dự Kiến', value: '4.8', unit: 'Tấn/năm' }
    ]
  },
  {
    id: 'agribot',
    title: 'Khu Vực 2: Agribot Rover Lab',
    subtitle: 'Robot Nông Nghiệp Tự Hành Tuần Tra & Phun Thuốc Điểm Chính Xác',
    badge: 'AUTONOMOUS WEBOTS ROVER',
    cameraPos: [14, 4.5, 6],
    targetPos: [10, 1.2, 0],
    description: 'Robot tự hành 4 bánh chủ động dẫn động độc lập được thiết kế trong môi trường mô phỏng Webots. Trang bị cụm cảm biến LiDAR 3D, camera kép RGB-D và giàn phun áp lực cao 4 béc.',
    features: [
      'Định vị vi sai RTK-GNSS kết hợp Visual Odometry sai số < 1.5 cm',
      'Bộ béc phun áp suất kép siêu âm tạo hạt sương mù 50µm',
      'Camera Stereo xoay 360° quét mặt dưới phiến lá dâu',
      'Tự động quay về trạm sạc không dây khi pin < 20%'
    ],
    stats: [
      { label: 'Tốc Độ Tuần Tra', value: '1.2', unit: 'm/s' },
      { label: 'Dung Lượng Pin', value: '94', unit: '%' },
      { label: 'Áp Suất Béc Phun', value: '6.5', unit: 'Bar' },
      { label: 'Số Cây Quét/Phút', value: '120', unit: 'cây' }
    ]
  },
  {
    id: 'disease_lab',
    title: 'Khu Vực 3: Phòng Thí Nghiệm AI Chẩn Đoán',
    subtitle: 'Mô Hình Hologram Tương Tác 5 Lớp Bệnh Học Dâu Tây',
    badge: 'AI 5-CLASS DIAGNOSTIC LAB',
    cameraPos: [-12, 5, 8],
    targetPos: [-8, 2, 0],
    description: 'Khu vực tương tác 3D chẩn đoán bệnh học thời gian thực bằng mô hình YOLOv8-Nano đã qua huấn luyện. Cho phép chuyển đổi giữa 5 trạng thái bệnh và kiểm tra độ tin cậy.',
    features: [
      'Nhận diện chuẩn xác Bệnh Cháy Rìa Lá (Leaf Scorch) đạt 99.3%',
      'Chẩn đoán sớm Bệnh Đốm Trắng (Mycosphaerella) từ vết chấm 1mm',
      'Phát hiện thiếu hụt đạm và vi lượng qua sắc tố Vàng Úa',
      'Cảnh báo tức thời Héo Rũ do nấm gốc rễ Phytophthora'
    ],
    stats: [
      { label: 'Độ Chính Xác mAP@50', value: '83.5', unit: '%' },
      { label: 'Thời Gian Suy Luận', value: '18.4', unit: 'ms' },
      { label: 'Số Lớp Bệnh Học', value: '5', unit: 'Lớp' },
      { label: 'Kích Thước Model', value: '11.7', unit: 'MB' }
    ]
  },
  {
    id: 'spray_matrix',
    title: 'Khu Vực 4: Ma Trận Phun Thuốc 3D Tọa Độ',
    subtitle: 'Bản Đồ Không Gian 24 Luống Trồng (X01-X06, Y01-Y04)',
    badge: 'SPATIAL 3D SPRAY MATRIX',
    cameraPos: [0, 14, 4],
    targetPos: [0, 0, -2],
    description: 'Holographic Grid hiển thị tình trạng sức khỏe của từng ô luống dâu tây. Cho phép kích hoạt phun thuốc điểm đích thực (Targeted Spot Spraying) nhằm cắt giảm 80% lượng thuốc BVTV.',
    features: [
      'Giao thức định địa chỉ tọa độ ma trận ô 2D/3D đồng bộ với Robot',
      'Theo dõi liên tục chỉ số dinh dưỡng EC, pH và độ ẩm giá thể',
      'Tự động tạo hàng đợi phun thuốc ưu tiên theo cấp độ nguy hiểm',
      'Xuất báo cáo nhật ký can thiệp chuẩn VietGAP / GlobalGAP'
    ],
    stats: [
      { label: 'Tổng Số Ô Luống', value: '24', unit: 'Ô' },
      { label: 'Ô Cần Phun Khẩn', value: '2', unit: 'Ô' },
      { label: 'Tiết Kiệm Hóa Chất', value: '78.5', unit: '%' },
      { label: 'Độ Che Phủ Sương', value: '98.2', unit: '%' }
    ]
  },
  {
    id: 'neural_brain',
    title: 'Khu Vực 5: Bộ Não Nơ-Ron & Telemetry Nexus',
    subtitle: 'Kiến Trúc Mạng YOLOv8-Nano & Cầu Nối REST API Thời Gian Thực',
    badge: 'NEURAL BRAIN & API BRIDGE',
    cameraPos: [0, 6, -16],
    targetPos: [0, 2, -10],
    description: 'Trực quan hóa cấu trúc nơ-ron đa tầng của mô hình AI YOLOv8-Nano và luồng dữ liệu truyền phát trực tiếp giữa trình duyệt với máy chủ Python Server (http://localhost:5000).',
    features: [
      'Xử lý tensor 3x640x640 bằng nhân tăng tốc ONNX Runtime',
      'Cơ chế Non-Maximum Suppression (NMS) lọc bounding box thông minh',
      'API RESTful Endpoint `/api/infer_image` và `/api/spray_matrix`',
      'Độ trễ truyền nhận vi mô < 5ms trong mạng nội bộ nhà kính'
    ],
    stats: [
      { label: 'Tham Số Mạng', value: '3.01', unit: 'Triệu' },
      { label: 'Tốc Độ Xử Lý', value: '54.2', unit: 'FPS' },
      { label: 'Cổng Kết Nối', value: '5000', unit: 'HTTP' },
      { label: 'Tỉ Lệ Nén ONNX', value: 'Slim-12', unit: 'Ops' }
    ]
  }
];

export const useCameraTrack = () => {
  const zones = useMemo(() => EXHIBITION_ZONES, []);
  
  const getZoneById = (id: string) => {
    return zones.find(z => z.id === id) || zones[0];
  };

  return { zones, getZoneById };
};
