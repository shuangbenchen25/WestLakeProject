import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '../App'
import { I18nProvider } from '../i18n'

vi.mock('@amap/amap-jsapi-loader', () => ({ default: { load: vi.fn() } }))

describe('core visitor journeys', () => {
  it('shows the unified map home and filters places', async () => {
    location.hash = '#/'
    const user = userEvent.setup()
    render(<I18nProvider><App /></I18nProvider>)
    expect(screen.getByRole('heading', { name: /每一种抵达/ })).toBeInTheDocument()
    await user.type(screen.getByPlaceholderText('搜索景点或服务…'), '曲院')
    expect(screen.getByText('曲院风荷')).toBeInTheDocument()
    expect(screen.getByText('1 个结果')).toBeInTheDocument()
  })

  it('filters facilities by type', async () => {
    location.hash = '#/facilities'
    const user = userEvent.setup()
    render(<I18nProvider><App /></I18nProvider>)
    await user.selectOptions(screen.getByLabelText('设施类型'), 'toilet')
    expect(screen.getByText('少年宫无障碍厕所')).toBeInTheDocument()
    expect(screen.queryByText('雷峰塔内部电梯')).not.toBeInTheDocument()
  })
})
