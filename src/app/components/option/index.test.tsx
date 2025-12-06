import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Option from './index'

// Mock PreloadImage
jest.mock('../preloadImage', () => {
  return function PreloadImage({ src, alt }: { src: string; alt: string }) {
    return <img src={src} alt={alt} data-testid="preload-image" />
  }
})

// Mock Audio
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn(),
  pause: jest.fn(),
  currentTime: 0,
}))

describe('Option component', () => {
  const defaultProps = {
    image: 'test.png',
    text: 'Test Option',
    value: 'test-value',
    audio: '/audio/test.mp3',
    score: 5,
    questionId: 'question_1',
    isSelected: false,
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders option with correct text and image', () => {
    render(<Option {...defaultProps} />)
    expect(screen.getByText('Test Option')).toBeInTheDocument()
    expect(screen.getByTestId('preload-image')).toHaveAttribute(
      'src',
      '/images/answers/test.png',
    )
  })

  it('applies selected styling when isSelected is true', () => {
    render(<Option {...defaultProps} isSelected={true} />)
    const option = screen.getByText('Test Option').closest('div')
    expect(option).toHaveClass('border-blue-400', 'shadow-md')
    expect(screen.getByAltText('selected')).toBeInTheDocument()
  })

  it('does not show selected overlay when isSelected is false', () => {
    render(<Option {...defaultProps} isSelected={false} />)
    expect(screen.queryByAltText('selected')).not.toBeInTheDocument()
  })

  it('calls onChange with correct parameters when clicked', async () => {
    const onChange = jest.fn()
    const user = userEvent.setup()
    render(<Option {...defaultProps} onChange={onChange} />)
    const option = screen.getByText('Test Option').closest('div')
    await user.click(option!)
    expect(onChange).toHaveBeenCalledWith('test-value', 5, 'question_1')
  })

  it('plays audio when clicked and audio is provided', async () => {
    const mockPlay = jest.fn()
    ;(global.Audio as jest.Mock).mockImplementation(() => ({
      play: mockPlay,
    }))
    const user = userEvent.setup()
    render(<Option {...defaultProps} audio="/audio/test.mp3" />)
    const option = screen.getByText('Test Option').closest('div')
    await user.click(option!)
    expect(global.Audio).toHaveBeenCalledWith('/audio/test.mp3')
    expect(mockPlay).toHaveBeenCalled()
  })

  it('does not play audio when audio is not provided', async () => {
    const user = userEvent.setup()
    render(<Option {...defaultProps} audio="" />)
    const option = screen.getByText('Test Option').closest('div')
    await user.click(option!)
    expect(global.Audio).not.toHaveBeenCalled()
  })
})
