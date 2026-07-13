import type { AssistanceRecord, AssistanceStatus } from './types'

const storageKey = 'westlake-assistance-records'

export function loadAssistanceRecords(): AssistanceRecord[] {
  try {
    const raw = localStorage.getItem(storageKey)
    const value: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(value) ? value.filter(isRecord) : []
  } catch { return [] }
}

export function saveAssistanceRecords(records: AssistanceRecord[]) {
  localStorage.setItem(storageKey, JSON.stringify(records))
}

export function addAssistanceRecord(record: AssistanceRecord): AssistanceRecord[] {
  const next = [record, ...loadAssistanceRecords()]
  saveAssistanceRecords(next)
  return next
}

export function updateAssistanceStatus(id: string, status: AssistanceStatus): AssistanceRecord[] {
  const next = loadAssistanceRecords().map(record => record.id === id ? { ...record, status } : record)
  saveAssistanceRecords(next)
  return next
}

export function clearAssistanceRecords() {
  localStorage.removeItem(storageKey)
}

export function createRecordId(prefix: string) {
  const suffix = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 6).toUpperCase()
    : Math.random().toString(36).slice(2, 8).toUpperCase()
  return `${prefix}-${suffix}`
}

function isRecord(value: unknown): value is AssistanceRecord {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return typeof record.id === 'string' && (record.kind === 'volunteer' || record.kind === 'equipment') && typeof record.status === 'string'
}
