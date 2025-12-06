import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './index'

describe('Button component', () => {
  it('should show the correct text on the button', () => {
    render(
      <Button>
        <>Click me</>
      </Button>,
    )
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    render(
      <Button disabled>
        <>Disabled Button</>
      </Button>,
    )
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('bg-gray-400')
  })

  it('should not be disabled when disabled prop is false', () => {
    render(
      <Button disabled={false}>
        <>Enabled Button</>
      </Button>,
    )
    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
    expect(button).toHaveClass('bg-primary-700')
  })

  it('should call onClick when clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    render(
      <Button onClick={handleClick}>
        <>Clickable Button</>
      </Button>,
    )
    const button = screen.getByRole('button')
    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should not call onClick when disabled', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    render(
      <Button onClick={handleClick} disabled>
        <>Disabled Button</>
      </Button>,
    )
    const button = screen.getByRole('button')
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should pass through other button props', () => {
    render(
      <Button type="submit" aria-label="Submit form">
        <>Submit</>
      </Button>,
    )
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('aria-label', 'Submit form')
  })
})
