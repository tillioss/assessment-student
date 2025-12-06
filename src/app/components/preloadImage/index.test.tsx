import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import PreloadImage from './index'

describe('PreloadImage component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders image with correct src and alt', () => {
    render(
      <PreloadImage
        src="/test-image.png"
        alt="Test image"
        className="test-class"
      />,
    )
    const img = screen.getByAltText('Test image')
    expect(img).toHaveAttribute('src', '/test-image.png')
    expect(img).toHaveClass('test-class')
  })

  it('shows loading state initially', () => {
    render(
      <PreloadImage
        src="/test-image.png"
        alt="Test image"
        className="test-class"
      />,
    )
    const img = screen.getByAltText('Test image')
    expect(img).toHaveClass('opacity-0')
  })

  it('shows image when loaded', async () => {
    const img = new Image()
    const loadEvent = new Event('load')
    Object.defineProperty(Image.prototype, 'onload', {
      get() {
        return this._onload
      },
      set(fn) {
        this._onload = fn
        if (this.src) {
          setTimeout(() => fn(loadEvent), 0)
        }
      },
    })

    render(
      <PreloadImage
        src="/test-image.png"
        alt="Test image"
        className="test-class"
      />,
    )

    await waitFor(() => {
      const imgElement = screen.getByAltText('Test image')
      expect(imgElement).toHaveClass('opacity-100')
    })
  })

  it('handles width and height props', () => {
    render(
      <PreloadImage
        src="/test-image.png"
        alt="Test image"
        className="test-class"
        width={100}
        height={200}
      />,
    )
    const img = screen.getByAltText('Test image')
    expect(img).toHaveAttribute('width', '100')
    expect(img).toHaveAttribute('height', '200')
  })

  it('does not create image when src is empty', () => {
    const createImageSpy = jest.spyOn(global, 'Image')
    render(
      <PreloadImage src="" alt="Test image" className="test-class" />,
    )
    // Image constructor should not be called with empty src
    expect(createImageSpy).not.toHaveBeenCalled()
  })

  it('resets loaded state when src changes', async () => {
    const { rerender } = render(
      <PreloadImage
        src="/test-image1.png"
        alt="Test image"
        className="test-class"
      />,
    )

    rerender(
      <PreloadImage
        src="/test-image2.png"
        alt="Test image"
        className="test-class"
      />,
    )

    const img = screen.getByAltText('Test image')
    expect(img).toHaveClass('opacity-0')
  })
})

