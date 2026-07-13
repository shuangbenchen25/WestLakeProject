export type Coordinate = [number, number]
export type Need = 'vision' | 'hearing' | 'mobility'
export type FacilityType = 'toilet' | 'ramp' | 'elevator' | 'rest' | 'medical' | 'parking' | 'service'

export interface GuideContent {
  title: string
  transcript: string[]
  duration: string
}

export interface Attraction {
  id: string
  name: string
  subtitle: string
  description: string
  coordinate: Coordinate
  openHours: string
  tags: string[]
  accessibility: string[]
  guide: GuideContent
}

export interface AccessibleFacility {
  id: string
  name: string
  type: FacilityType
  coordinate: Coordinate
  distance: string
  status: 'open' | 'unknown'
  features: string[]
  note: string
}

export interface RouteStep { instruction: string; distance: string; alert?: string }

export interface AccessibleRoute {
  id: string
  name: string
  from: string
  to: string
  distance: string
  duration: string
  suitableFor: Need[]
  tags: string[]
  surface: string
  slope: string
  steps: RouteStep[]
  path: Coordinate[]
}

export interface AccessibilityPreferences {
  largeText: boolean
  highContrast: boolean
  reduceMotion: boolean
  autoSpeak: boolean
  visualAlerts: boolean
  speechRate: number
}

export type AssistanceStatus =
  | 'submitted' | 'matching' | 'confirmed' | 'met' | 'accompanying' | 'completed'
  | 'reserved' | 'preparing' | 'delivering' | 'ready' | 'in-use' | 'returned' | 'cancelled'

export interface ServiceLocation {
  id: string
  name: string
  address: string
  availableEquipment: string[]
}

export interface VolunteerProfile {
  id: string
  displayName: string
  organization: string
  specialties: string[]
  verificationCode: string
}

export interface VolunteerRequest {
  id: string
  kind: 'volunteer'
  timing: 'now' | 'scheduled'
  meetingPoint: string
  scheduledAt: string
  duration: string
  needs: string[]
  communication: string
  notes: string
  status: AssistanceStatus
  createdAt: string
  volunteer?: VolunteerProfile
}

export interface EquipmentItem {
  id: string
  name: string
  description: string
  stock: number
  features: string[]
  safetyNote: string
}

export interface EquipmentBooking {
  id: string
  kind: 'equipment'
  equipmentId: string
  locationId: string
  returnLocationId: string
  scheduledAt: string
  quantity: number
  modes: string[]
  stepCount?: number
  obstacleLocation?: string
  notes: string
  status: AssistanceStatus
  createdAt: string
}

export type AssistanceRecord = VolunteerRequest | EquipmentBooking
