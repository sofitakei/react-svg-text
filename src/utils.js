import PropTypes from 'prop-types'
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import reduceCSSCalc from 'reduce-css-calc'

const MEASUREMENT_ELEMENT_ID = '__react_svg_text_measurement_id'

const getStringWidth = (str, style) => {
  try {
    // Calculate length of each word to be used to determine number of words per line
    let textEl = document.getElementById(MEASUREMENT_ELEMENT_ID)
    if (!textEl) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      textEl.setAttribute('id', MEASUREMENT_ELEMENT_ID)
      svg.appendChild(textEl)
      document.body.appendChild(svg)
    }

    Object.assign(textEl.style, style)
    textEl.textContent = str
    return textEl.getComputedTextLength()
  } catch (e) {
    return null
  }
}

const calculateWordWidths = (words, style) => {
  try {
    const wordArray = words && words.length ? words.toString().split(/\s+/) : []
    const wordsWithComputedWidth = wordArray.map(word => (
      { word, width: getStringWidth(word, style) }
    ))

    const spaceWidth = getStringWidth('\u00A0', style)
    return { wordsWithComputedWidth, spaceWidth }
  } catch (e) {
    return null
  }
}

export default calculateWordWidths
