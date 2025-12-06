import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageDropdown from './index'
import { useTranslation } from 'react-i18next'
import { useRouter, useSearchParams } from 'next/navigation'

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

const mockChangeLanguage = jest.fn()
const mockReplace = jest.fn()
const mockUseTranslation = useTranslation as jest.Mock
const mockUseRouter = useRouter as jest.Mock
const mockUseSearchParams = useSearchParams as jest.Mock

describe('LanguageDropdown component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslation.mockReturnValue({
      i18n: {
        language: 'en',
        changeLanguage: mockChangeLanguage,
      },
      t: jest.fn((key: string) => key),
    })
    mockUseRouter.mockReturnValue({
      replace: mockReplace,
    })
    mockUseSearchParams.mockReturnValue({
      toString: jest.fn(() => ''),
    })
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/assessment',
      },
      writable: true,
    })
  })

  it('renders current language', () => {
    render(<LanguageDropdown />)
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('shows dropdown when button is clicked', async () => {
    const user = userEvent.setup()
    render(<LanguageDropdown />)
    const button = screen.getByLabelText('language.selectLanguage')
    await user.click(button)
    expect(screen.getByText('العربية')).toBeInTheDocument()
  })

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup()
    render(<LanguageDropdown />)
    const button = screen.getByLabelText('language.selectLanguage')
    await user.click(button)
    expect(screen.getByText('العربية')).toBeInTheDocument()

    const overlay = document.querySelector('.fixed.inset-0')
    await user.click(overlay!)
    expect(screen.queryByText('العربية')).not.toBeInTheDocument()
  })

  it('changes language when option is clicked', async () => {
    const user = userEvent.setup()
    render(<LanguageDropdown />)
    const button = screen.getByLabelText('language.selectLanguage')
    await user.click(button)
    const arabicOption = screen.getByText('العربية')
    await user.click(arabicOption)
    expect(mockChangeLanguage).toHaveBeenCalledWith('ar')
    expect(mockReplace).toHaveBeenCalled()
  })

  it('shows checkmark for current language', async () => {
    const user = userEvent.setup()
    render(<LanguageDropdown />)
    const button = screen.getByLabelText('language.selectLanguage')
    await user.click(button)
    const englishOptions = screen.getAllByText('English')
    const englishOption = englishOptions.find((el) => el.closest('button'))
    const svg = englishOption?.closest('button')?.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('updates URL with language parameter', async () => {
    const mockToString = jest.fn(() => 'existing=param')
    mockUseSearchParams.mockReturnValue({
      toString: mockToString,
    })
    const user = userEvent.setup()
    render(<LanguageDropdown />)
    const button = screen.getByLabelText('language.selectLanguage')
    await user.click(button)
    const arabicOption = screen.getByText('العربية')
    await user.click(arabicOption)
    expect(mockReplace).toHaveBeenCalledWith(
      '/assessment?existing=param&lang=ar',
    )
  })
})
