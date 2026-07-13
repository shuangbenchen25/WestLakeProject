import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { I18nProvider } from '../i18n'

describe('assistance service journeys', () => {
  it('opens the help center from the five-item navigation', () => {
    location.hash = '#/help'
    render(<I18nProvider><App /></I18nProvider>)
    expect(screen.getByRole('heading', { name: '需要帮助， 我们一起想办法。' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /呼叫或预约志愿者/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /预约辅助设备/ })).toBeInTheDocument()
  })

  it('validates that a volunteer request has at least one need', async () => {
    location.hash = '#/help/volunteer'
    const user = userEvent.setup()
    render(<I18nProvider><App /></I18nProvider>)
    await user.click(screen.getByRole('button', { name: '查看预约摘要' }))
    expect(screen.getByRole('alert')).toHaveTextContent('至少选择一种帮助需求')
  })

  it('shows the large-text help card choices', () => {
    location.hash = '#/help/card'
    render(<I18nProvider><App /></I18nProvider>)
    expect(screen.getByRole('status')).toHaveTextContent('我需要引导')
    expect(screen.getByRole('group', { name: '选择求助内容' })).toBeInTheDocument()
  })
})
