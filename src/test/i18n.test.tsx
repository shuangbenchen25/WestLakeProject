import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'
import { I18nProvider } from '../i18n'

describe('bilingual experience', () => {
  beforeEach(() => { localStorage.clear(); location.hash = '#/help' })

  it('switches the full interface language and persists the choice', async () => {
    const user = userEvent.setup()
    render(<I18nProvider><App/></I18nProvider>)
    await user.click(screen.getByRole('button', { name: '切换到英语' }))
    expect(screen.getByRole('heading', { name: 'Need a hand? Let’s find a way together.' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem('westlake-locale')).toBe('en')
  })
})
