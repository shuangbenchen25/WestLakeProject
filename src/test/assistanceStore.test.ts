import { beforeEach, describe, expect, it } from 'vitest'
import { addAssistanceRecord, clearAssistanceRecords, loadAssistanceRecords, updateAssistanceStatus } from '../assistanceStore'
import type { VolunteerRequest } from '../types'

const request: VolunteerRequest = {
  id: 'VOL-TEST', kind: 'volunteer', timing: 'now', meetingPoint: '曲院风荷游客服务中心',
  scheduledAt: '', duration: '2 小时', needs: ['视障引导'], communication: '文字交流',
  notes: '', status: 'submitted', createdAt: '2026-07-13T00:00:00.000Z'
}

describe('assistance record storage', () => {
  beforeEach(() => localStorage.clear())

  it('adds and restores a non-sensitive service record', () => {
    addAssistanceRecord(request)
    expect(loadAssistanceRecords()).toEqual([request])
  })

  it('updates status without deleting the record', () => {
    addAssistanceRecord(request)
    expect(updateAssistanceStatus(request.id, 'matching')[0].status).toBe('matching')
  })

  it('falls back safely for damaged data and can clear records', () => {
    localStorage.setItem('westlake-assistance-records', '{bad')
    expect(loadAssistanceRecords()).toEqual([])
    addAssistanceRecord(request)
    clearAssistanceRecords()
    expect(loadAssistanceRecords()).toEqual([])
  })
})
