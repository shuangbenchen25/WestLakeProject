import { beforeEach, describe, expect, it } from 'vitest'
import { defaultPreferences, loadPreferences, savePreferences } from '../preferences'

describe('accessibility preferences', () => {
  beforeEach(() => localStorage.clear())

  it('uses safe defaults when no saved value exists', () => {
    expect(loadPreferences()).toEqual(defaultPreferences)
  })

  it('persists and restores user choices', () => {
    const next = { ...defaultPreferences, largeText: true, speechRate: 1.3 }
    savePreferences(next)
    expect(loadPreferences()).toEqual(next)
  })

  it('falls back when storage contains invalid data', () => {
    localStorage.setItem('westlake-accessibility-preferences', '{bad json')
    expect(loadPreferences()).toEqual(defaultPreferences)
  })
})
