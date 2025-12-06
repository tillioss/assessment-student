import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Slider from './index'

// Mock HTMLAudioElement play method
const mockPlay = jest.fn().mockResolvedValue(undefined)
HTMLMediaElement.prototype.play = mockPlay

describe('Slider component', () => {
  const answerOptions = [
    { label: 'Option 1', value: '1', audio: '/audio/1.mp3' },
    { label: 'Option 2', value: '2', audio: '/audio/2.mp3' },
    { label: 'Option 3', value: '3', audio: '/audio/3.mp3' },
  ]

  const defaultProps = {
    onChange: jest.fn(),
    answerOptions,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockPlay.mockClear()
  })

  it('renders slider with all options', () => {
    render(<Slider {...defaultProps} />)
    answerOptions.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument()
    })
  })

  it('starts at index 0', () => {
    render(<Slider {...defaultProps} />)
    const buttons = screen.getAllByRole('button')
    const firstButton = buttons.find((btn) =>
      btn.querySelector('.bg-red-500'),
    )
    expect(firstButton).toBeDefined()
  })

  it('calls onChange when option is clicked', async () => {
    const onChange = jest.fn()
    const user = userEvent.setup()
    render(<Slider {...defaultProps} onChange={onChange} />)
    const option2 = screen.getByText('Option 2')
    await user.click(option2)
    expect(onChange).toHaveBeenCalledWith('2', 0, 'skip')
  })

  it('plays audio when option is selected', async () => {
    const user = userEvent.setup()
    render(<Slider {...defaultProps} />)
    const option2 = screen.getByText('Option 2')
    await user.click(option2)
    // Audio should be played via the audio element ref
    expect(mockPlay).toHaveBeenCalled()
  })

  it('updates active indicator when option is clicked', async () => {
    const user = userEvent.setup()
    render(<Slider {...defaultProps} />)
    const option2 = screen.getByText('Option 2')
    await user.click(option2)
    const buttons = screen.getAllByRole('button')
    const activeButton = buttons.find((btn) =>
      btn.querySelector('.bg-red-500'),
    )
    expect(activeButton).toBeDefined()
  })

  it('calculates percentage correctly', () => {
    render(<Slider {...defaultProps} />)
    const sliderTrack = screen
      .getByText('Option 1')
      .closest('.flex')
      ?.previousElementSibling
    const fill = sliderTrack?.querySelector('.bg-yellow-200')
    expect(fill).toHaveStyle({ width: '0%' })
  })
})

