import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import ParentMessage from './index'
import { useTranslation } from 'react-i18next'

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}))

const mockT = jest.fn((key: string) => key)
const mockUseTranslation = useTranslation as jest.Mock

describe('ParentMessage component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    mockUseTranslation.mockReturnValue({
      t: mockT,
    })
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('renders message when open is true', () => {
    render(<ParentMessage open={true} />)
    expect(screen.getByText('parentMessage.dearParents')).toBeInTheDocument()
    expect(screen.getByText('parentMessage.subtitle')).toBeInTheDocument()
  })

  it('does not render message when open is false', () => {
    render(<ParentMessage open={false} />)
    expect(
      screen.queryByText('parentMessage.dearParents'),
    ).not.toBeInTheDocument()
  })

  it('auto-closes after 3 seconds', async () => {
    render(<ParentMessage open={true} />)
    expect(screen.getByText('parentMessage.dearParents')).toBeInTheDocument()

    jest.advanceTimersByTime(3000)

    await waitFor(
      () => {
        expect(
          screen.queryByText('parentMessage.dearParents'),
        ).not.toBeInTheDocument()
      },
      { timeout: 4000 },
    )
  })

  it('updates when open prop changes', () => {
    const { rerender } = render(<ParentMessage open={false} />)
    expect(
      screen.queryByText('parentMessage.dearParents'),
    ).not.toBeInTheDocument()

    rerender(<ParentMessage open={true} />)
    expect(screen.getByText('parentMessage.dearParents')).toBeInTheDocument()
  })

  it('clears timer when component unmounts', () => {
    const { unmount } = render(<ParentMessage open={true} />)
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
    unmount()
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})
