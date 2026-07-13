import type { AssistanceStatus, EquipmentItem, ServiceLocation, VolunteerProfile } from './types'

export const serviceLocations: ServiceLocation[] = [
  { id: 'hub-quyuan', name: '曲院风荷游客服务中心', address: '北山街与杨公堤交会区域（示例）', availableEquipment: ['ramp', 'sensory-guide'] },
  { id: 'hub-hubin', name: '湖滨无障碍服务点', address: '湖滨步行街北段（示例）', availableEquipment: ['sensory-guide'] },
  { id: 'hub-leifeng', name: '雷峰塔入口服务台', address: '南山路雷峰塔景区入口（示例）', availableEquipment: ['ramp', 'sensory-guide'] }
]

export const equipmentItems: EquipmentItem[] = [
  { id: 'ramp', name: '简易便携坡道', description: '由工作人员送达并评估现场后铺设，协助跨越短距离台阶。', stock: 2, features: ['现场评估', '工作人员铺设', '适配短台阶'], safetyNote: '坡度、承重和台阶条件必须由工作人员确认，请勿自行铺设或使用。' },
  { id: 'sensory-guide', name: '多媒体感官导览装置', description: '把西湖故事转换成声音增强、触觉节奏和高对比字幕。', stock: 6, features: ['听觉增强', '触觉节奏', '视觉字幕'], safetyNote: '设备为导览辅助，不替代助听器、导航杖或其他专业辅具。' }
]

export const demoVolunteer: VolunteerProfile = {
  id: 'V-028', displayName: '林老师', organization: '西湖暖行志愿服务队（演示）',
  specialties: ['视障引导', '轮椅路线陪同', '文字沟通'], verificationCode: '荷风 372'
}

export const statusLabels: Record<AssistanceStatus, string> = {
  submitted: '已提交', matching: '匹配中', confirmed: '已确认', met: '已会面', accompanying: '陪同中', completed: '已完成',
  reserved: '已预约', preparing: '准备中', delivering: '配送中', ready: '待领取', 'in-use': '使用中', returned: '已归还', cancelled: '已取消'
}

export const volunteerStatuses: AssistanceStatus[] = ['submitted', 'matching', 'confirmed', 'met', 'accompanying', 'completed']
export const equipmentDeliveryStatuses: AssistanceStatus[] = ['reserved', 'preparing', 'delivering', 'in-use', 'returned']
