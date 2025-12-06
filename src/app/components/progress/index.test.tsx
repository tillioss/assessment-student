import React from 'react'
import { render, screen } from '@testing-library/react'
import Progress from './index'
import i18n from '@/i18n'

// Mock i18n
jest.mock('@/i18n', () => ({
  __esModule: true,
  default: {
    language: 'en',
  },
}))

describe('Progress component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders progress bar with correct percentage', () => {
    render(<Progress current={5} total={10} />)
    const progressBar = screen.getByRole('img', { name: 'cat' }).parentElement
    const fill = progressBar?.querySelector('.bg-\\[\\#fde046\\]')
    expect(fill).toHaveStyle({ width: '50%' })
  })

  it('renders 0% when current is 0', () => {
    render(<Progress current={0} total={10} />)
    const progressBar = screen.getByRole('img', { name: 'cat' }).parentElement
    const fill = progressBar?.querySelector('.bg-\\[\\#fde046\\]')
    expect(fill).toHaveStyle({ width: '0%' })
  })

  it('renders 100% when current equals total', () => {
    render(<Progress current={10} total={10} />)
    const progressBar = screen.getByRole('img', { name: 'cat' }).parentElement
    const fill = progressBar?.querySelector('.bg-\\[\\#fde046\\]')
    expect(fill).toHaveStyle({ width: '100%' })
  })

  it('positions indicator correctly for English (LTR)', () => {
    ;(i18n as any).language = 'en'
    render(<Progress current={5} total={10} />)
    const indicator = screen.getByRole('img', { name: 'cat' })
    // For English (LTR), isltr = false, so left should be set to percentage, right to auto
    expect(indicator).toHaveStyle({ left: '50%', right: 'auto' })
  })

  it('positions indicator correctly for Arabic (RTL)', () => {
    ;(i18n as any).language = 'ar'
    render(<Progress current={5} total={10} />)
    const indicator = screen.getByRole('img', { name: 'cat' })
    // For Arabic (RTL), isltr = true, so left should be auto, right to percentage
    expect(indicator).toHaveStyle({ left: 'auto', right: '50%' })
  })
})

