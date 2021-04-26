import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Text from './Text'

const wrapInSVG = node => <svg>{node}</svg>
const renderText = props => render(wrapInSVG(<Text {...props} />))
const text = 'This is really long text'

describe('<Text />', () => {
  beforeEach(() => {
    window.SVGElement.prototype.getBBox = () => ({
      width: 200,
      height: 20,
    })
    window.SVGElement.prototype.getComputedTextLength = () => 20
  })

  afterEach(() => {
    delete window.SVGElement.prototype.getBBox
    delete window.SVGElement.prototype.getComputedTextLength
  })
  it('Does not wrap long text if enough width', () => {
    renderText({ maxWidth: 5000,
      children: text })
    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('Wraps long text if not enough width', () => {
    renderText({ maxWidth: 500, children: text })
    expect(document.querySelectorAll('tspan')).toHaveLength(3)
  })

  it('Does not perform word length calculation if maxWidth props not set', () => {
    renderText({ children: text })

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('adjusts the startDy for middle vertical anchor', () => {
    renderText({ children: text, maxWidth: 200, verticalAnchor: 'middle' })
    expect(document.querySelectorAll('tspan')[0]).toHaveAttribute('dy', '-40')
  })

  it('adjusts the startDy for end vertical anchor', () => {
    renderText({ children: text, maxWidth: 200, verticalAnchor: 'end' })
    expect(document.querySelectorAll('tspan')[0]).toHaveAttribute('dy', '-80')
  })

  it('shows ellipsis if maxHeight is set and there is more content', () => {
    renderText({ children: text, maxWidth: 200, maxHeight: 30 })
    expect(document.querySelector('title')).toHaveTextContent(text)
    expect(screen.getByText('...')).toBeInTheDocument()
  })
})
