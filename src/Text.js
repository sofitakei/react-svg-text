import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import reduceCSSCalc from 'reduce-css-calc'
import calculateWordWidths from './utils'

const Text = (props) => {
  const {
    angle,
    capHeight,
    children,
    dx,
    dy,
    fontSize,
    height,
    lineHeight,
    lineSpacing,
    offsetX,
    scaleToFit,
    style,
    textAnchor,
    verticalAnchor,
    width,
    ...textProps
  } = props

  const [wordsByLines, setWordsByLines] = useState([])
  const displayedLines = useMemo(() => wordsByLines.filter(({ showLine }) => showLine), [wordsByLines])

  const x = textProps.x + dx
  const y = textProps.y + dy

  const calculateWordsByLines = useCallback(() => {
    const wordWidths = calculateWordWidths(children, style)
    const { spaceWidth, wordsWithComputedWidth } = wordWidths
    return wordsWithComputedWidth.reduce((result, { word, width: wordWidth }) => {
      const currentLine = result[result.length - 1]

      if (currentLine && (currentLine.width + wordWidth + spaceWidth) < width) {
      // Word can be added to an existing line
        currentLine.words.push(word)
        currentLine.width += wordWidth + spaceWidth
      } else {
        // Add first word to line or word is too long to scaleToFit on existing line
        const newLine = { words: [word],
          width: wordWidth,
          showLine: height ? (fontSize + lineSpacing) * (result.length + 1) < height : true }
        result.push(newLine)
      }
      return result
    }, [])
  }, [children, fontSize, height, lineSpacing, style, width])

  const startDy = useMemo(() => {
    switch (verticalAnchor) {
      case 'start':
        return reduceCSSCalc(`calc(${capHeight})`)

      case 'middle':
        return reduceCSSCalc(`calc(${(displayedLines.length - 1) / 2} * -${lineHeight} + (${capHeight} / 2))`)

      default:
        return reduceCSSCalc(`calc(${displayedLines.length - 1} * -${lineHeight})`)
    }
  }, [capHeight, displayedLines.length, lineHeight, verticalAnchor])

  const transform = useMemo(() => {
    const transforms = []
    if (scaleToFit && wordsByLines.length) {
      const lineWidth = wordsByLines[0].width
      const sx = width / lineWidth
      const sy = sx
      const originX = x - sx * x
      const originY = y - sy * y
      transforms.push(`matrix(${sx}, 0, 0, ${sy}, ${originX}, ${originY})`)
    }
    if (angle) {
      transforms.push(`rotate(${angle}, ${x}, ${y})`)
    }

    return transforms.length ? transforms.join(' ') : ''
  }, [angle, scaleToFit, width, wordsByLines, x, y])

  useEffect(() => {
    // Only perform calculations if using features that require them (multiline, scaleToFit)
    if ((width || scaleToFit)) {
      const updatedWordsByLines = calculateWordsByLines()
      setWordsByLines(updatedWordsByLines)
    }
  }, [calculateWordsByLines, scaleToFit, width])

  return (displayedLines.length > 1
    ? (
      <text
        textAnchor={textAnchor}
        transform={transform}
        x={x}
        y={y}
        {...textProps}
      >
        {displayedLines.map((line, index) => (
          <tspan
            dy={index === 0 ? startDy : lineHeight}
            key={index}
            x={x}
          >
            {line.words.join(' ')}
          </tspan>
        ))}

        {wordsByLines.length > displayedLines.length
       && [<tspan key="ellipsis">...</tspan>, <title key="title">{children}</title>]}
      </text>
    )
    : <text {...props} y={lineHeight}>{children}</text>
  )
}

Text.propTypes = {
  angle: PropTypes.number,
  capHeight: PropTypes.string,
  children: PropTypes.node.isRequired,
  dx: PropTypes.number,
  dy: PropTypes.number,
  fontSize: PropTypes.number,
  height: PropTypes.number,
  lineHeight: PropTypes.string,
  lineSpacing: PropTypes.number,
  offsetX: PropTypes.func,
  scaleToFit: PropTypes.bool,
  style: PropTypes.object,
  textAnchor: PropTypes.oneOf(['start', 'middle', 'end', 'inherit']),
  verticalAnchor: PropTypes.oneOf(['start', 'middle', 'end']),
  width: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
}

Text.defaultProps = {
  angle: undefined,
  capHeight: '0.71em', // Magic number from d3
  dx: 0,
  dy: 0,
  fontSize: 15,
  height: undefined,
  lineHeight: '1em',
  lineSpacing: 0.3,
  offsetX: undefined,
  scaleToFit: false,
  style: {},
  textAnchor: 'start',
  verticalAnchor: 'end', // default SVG behavior
  width: undefined,
  x: 0,
  y: 0,
}

export default Text
