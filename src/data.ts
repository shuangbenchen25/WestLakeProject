import type { AccessibleFacility, AccessibleRoute, Attraction, FacilityType, Need } from './types'

export const needLabels: Record<Need, string> = {
  vision: '视障友好', hearing: '听障友好', mobility: '行动友好'
}

export const facilityLabels: Record<FacilityType, string> = {
  toilet: '无障碍厕所', ramp: '坡道', elevator: '电梯', rest: '休息点',
  medical: '医疗点', parking: '无障碍停车', service: '服务中心'
}

export const attractions: Attraction[] = [
  {
    id: 'broken-bridge', name: '断桥残雪', subtitle: '从北山街轻松抵达的湖岸视角',
    description: '断桥位于白堤东端，是西湖极具辨识度的景观入口。首版导览从平缓、开阔的北山街一侧开始。',
    coordinate: [120.1505, 30.259], openHours: '全天开放', tags: ['湖景', '平缓路段', '语音导览'],
    accessibility: ['北山街入口相对平缓', '桥面人流密集时建议结伴', '沿线设有休息座椅'],
    guide: { title: '桥与湖的相遇', duration: '2 分 40 秒', transcript: [
      '你现在面向西湖，脚下是连接北山街与白堤的断桥。',
      '桥并没有真正断开。“断桥”之名与冬日残雪、远望桥面若隐若现的景象有关。',
      '前方路面总体平缓。节假日人流较大，请沿右侧缓慢前行，并留意同行者提示。'
    ] }
  },
  {
    id: 'quyuan', name: '曲院风荷', subtitle: '荷香、树荫与连续休息点',
    description: '园区以荷花景观闻名，部分主游线较平整，树荫和休息空间丰富，适合放慢速度游览。',
    coordinate: [120.1338, 30.2534], openHours: '全天开放', tags: ['园林', '休息点', '轮椅友好'],
    accessibility: ['主入口设缓坡', '部分支路为石板路', '服务点附近有无障碍厕所'],
    guide: { title: '听见一池风荷', duration: '3 分 10 秒', transcript: [
      '这里是曲院风荷。夏季，风穿过大片荷叶，会形成连续而轻柔的摩擦声。',
      '主游线两侧分布着水池与树木。靠近水边时，请留意低矮护栏。',
      '前方约八十米有带靠背的休息座椅，右侧服务点附近设有无障碍厕所。'
    ] }
  },
  {
    id: 'leifeng', name: '雷峰塔景区', subtitle: '电梯辅助登高，俯瞰西湖南线',
    description: '雷峰塔提供电梯辅助游览，但入口、换乘与高峰期排队情况需要提前确认。',
    coordinate: [120.1482, 30.2339], openHours: '08:00–17:30（示例）', tags: ['文化', '电梯', '字幕导览'],
    accessibility: ['入口区域有坡道', '塔内设电梯', '高峰期建议联系工作人员'],
    guide: { title: '雷峰夕照', duration: '2 分 20 秒', transcript: [
      '雷峰塔位于西湖南岸的夕照山上，是西湖文化景观的重要地标。',
      '现塔为重建建筑，内部设有电梯。到达观景层后，可以从南向北俯瞰湖面。',
      '如需无障碍协助，请在入口服务台联系工作人员。'
    ] }
  }
]

export const facilities: AccessibleFacility[] = [
  { id: 'f1', name: '少年宫无障碍厕所', type: 'toilet', coordinate: [120.154, 30.258], distance: '320 米', status: 'open', features: ['扶手', '低位洗手台', '独立空间'], note: '开放情况请以现场为准' },
  { id: 'f2', name: '断桥湖滨休息点', type: 'rest', coordinate: [120.149, 30.258], distance: '180 米', status: 'open', features: ['带靠背座椅', '树荫', '平整地面'], note: '节假日可能较拥挤' },
  { id: 'f3', name: '曲院风荷游客服务中心', type: 'service', coordinate: [120.1347, 30.254], distance: '90 米', status: 'open', features: ['人工协助', '轮椅借用咨询', '文字说明'], note: '轮椅数量需现场确认' },
  { id: 'f4', name: '雷峰塔内部电梯', type: 'elevator', coordinate: [120.1483, 30.234], distance: '入口内', status: 'unknown', features: ['工作人员协助', '可容纳轮椅'], note: '运行情况请提前向景区确认' },
  { id: 'f5', name: '南山路医疗服务点', type: 'medical', coordinate: [120.155, 30.236], distance: '650 米', status: 'unknown', features: ['基础急救', '人工服务'], note: '示例位置，紧急情况请拨打 120' },
  { id: 'f6', name: '北山街缓坡入口', type: 'ramp', coordinate: [120.151, 30.26], distance: '210 米', status: 'open', features: ['连续缓坡', '路面平整'], note: '雨天注意防滑' },
  { id: 'f7', name: '湖滨无障碍停车位', type: 'parking', coordinate: [120.16, 30.25], distance: '1.2 公里', status: 'unknown', features: ['邻近主路', '宽车位'], note: '车位状态不实时更新' }
]

export const routes: AccessibleRoute[] = [
  {
    id: 'r1', name: '北山街—断桥轻松线', from: '少年宫', to: '断桥残雪', distance: '1.1 公里', duration: '约 24 分钟', suitableFor: ['vision', 'mobility'],
    tags: ['无台阶', '2 处休息点', '无障碍厕所'], surface: '平整铺装为主', slope: '缓坡，示例最大约 4%',
    path: [[120.157,30.262],[120.153,30.26],[120.1505,30.259]],
    steps: [
      { instruction: '从少年宫南门沿北山街向西', distance: '420 米', alert: '右侧临近非机动车道' },
      { instruction: '经过湖滨休息点，继续直行', distance: '360 米' },
      { instruction: '从缓坡入口到达断桥东端', distance: '320 米', alert: '高峰期人流密集' }
    ]
  },
  {
    id: 'r2', name: '曲院风荷慢游环线', from: '曲院风荷北门', to: '荷花池', distance: '1.6 公里', duration: '约 38 分钟', suitableFor: ['hearing', 'mobility'],
    tags: ['无台阶', '树荫较多', '服务中心'], surface: '铺装路与少量石板路', slope: '整体平缓',
    path: [[120.132,30.255],[120.1347,30.254],[120.136,30.252]],
    steps: [
      { instruction: '由北门缓坡进入园区', distance: '280 米' },
      { instruction: '在服务中心前向左转', distance: '510 米', alert: '路口请留意观光车' },
      { instruction: '沿荷花池外侧游线前行', distance: '810 米', alert: '水边有低矮护栏' }
    ]
  }
]
