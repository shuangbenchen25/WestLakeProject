import type { AccessibilityPreferences } from './types'

export const defaultPreferences: AccessibilityPreferences = {
  largeText: false, highContrast: false, reduceMotion: false,
  autoSpeak: false, visualAlerts: true, speechRate: 1
}

const key = 'westlake-accessibility-preferences'

export function loadPreferences(): AccessibilityPreferences {
  try {
    const value = localStorage.getItem(key)
    return value ? { ...defaultPreferences, ...JSON.parse(value) } : defaultPreferences
  } catch { return defaultPreferences }
}

export function savePreferences(value: AccessibilityPreferences) {
  localStorage.setItem(key, JSON.stringify(value))
}
