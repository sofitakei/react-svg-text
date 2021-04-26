import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { MEASUREMENT_ELEMENT_ID, calculateWordWidths, calculateWordsByLines } from './utils'

const Text = (props) => {
  const { children, maxHeight, maxWidth, verticalAnchor, ...rest } = props
  const [wordWidths, setWordWidths] = useState()
  const [textLines, setTextLines] = useState([])
  const [style, setComputedStyle] = useState()
  const measureRef = useRef()
  const displayedLines = useMemo(
    () => textLines.filter(({ showLine }) => showLine),
    [textLines],
  )
  const ref = useCallback((node) => {
    setComputedStyle(node !== null ? window.getComputedStyle(node) : '')
  }, [])

  useEffect(() => {
    const el = document.getElementById(MEASUREMENT_ELEMENT_ID)
    if (el === null) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('id', MEASUREMENT_ELEMENT_ID)
      document.body.appendChild(svg)
      svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
      measureRef.current = svg
    } else {
      measureRef.current = el
    }
    return () => el && document.body.contains(el) ? document.body.removeChild(el) : null
  }, [])

  useEffect(() => {
    const wordWithWidths = calculateWordWidths(style, measureRef.current.firstElementChild, children)
    setWordWidths(wordWithWidths)
  }, [children, style])

  useEffect(() => {
    if (maxWidth && wordWidths) {
      const lines = calculateWordsByLines(wordWidths, maxWidth, maxHeight)
      setTextLines(lines)
    }
  }, [maxHeight, maxWidth, wordWidths, children])

  const startDy = useMemo(() => {
    if (wordWidths?.lineHeight) {
      switch (verticalAnchor) {
        case 'start':
          return wordWidths.lineHeight

        case 'middle':
          return -(((displayedLines.length - 1) * wordWidths.lineHeight) / 2)

        default:
          return -(displayedLines.length - 1) * wordWidths.lineHeight
      }
    } else {
      return 0
    }
  }, [displayedLines.length, verticalAnchor, wordWidths?.lineHeight])

  return (
    <text
      ref={ref}
      {...rest}
    >
      {textLines.length <= 1 ? (
        children
      ) : (
        <>
          {displayedLines.map((line, idx) => (
            <tspan
              dx={props.x + props.dx}
              dy={idx === 0 ? startDy + props.dy : wordWidths.lineHeight}
              key={idx}
              x={0}
            >
              {line.words.join(' ')}
            </tspan>
          ))}
          {displayedLines.length !== textLines.length && (
            <>
              <tspan>...</tspan>
              <title>{children}</title>
            </>
          )}
        </>
      )}
    </text>
  )
}

Text.propTypes = {
  children: PropTypes.node.isRequired,
  dx: PropTypes.number,
  dy: PropTypes.number,
  maxHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  verticalAnchor: PropTypes.oneOf(['start', 'middle', 'end']),
  x: PropTypes.number,
}

Text.defaultProps = {
  dx: 0,
  dy: 0,
  maxHeight: undefined,
  maxWidth: undefined,
  verticalAnchor: 'start',
  x: 0,
}

export default Text
