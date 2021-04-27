const MEASUREMENT_ELEMENT_ID = '__react_svg_text_measurement_id'

const calculateWordsByLines = (words, wordWidths, maxWidth, maxHeight) => {
  const { lineHeight, spaceWidth, wordsWithComputedWidth } = wordWidths

  return words.toString().split(/\s+/).reduce((result, word) => {
    const wordWidth = wordsWithComputedWidth[word]
    const currentLine = result[result.length - 1]
    if (currentLine && currentLine.width + wordWidth + spaceWidth < maxWidth) {
      // Word can be added to an existing line
      currentLine.words.push(word)
      currentLine.width += wordWidth + spaceWidth
    } else {
      // Add first word to line or word is too long to scaleToFit on existing line
      const newLine = {
        words: [word],
        width: wordWidth,
        showLine: maxHeight
          ? lineHeight * (result.length + 1) < maxHeight
          : true,
      }
      result.push(newLine)
    }
    return result
  }, [])
}

const calculateWordWidths = (style, textNode, words) => {
  if (style && textNode) {
    Array.from(style).forEach(key => textNode.style.setProperty(
      key,
      style.getPropertyValue(key),
      style.getPropertyPriority(key),
    ))
    const wordArray = [...new Set(words.toString().split(/\s+/))]
    const wordsWithComputedWidth = wordArray.reduce((wordMap, word) => {
      textNode.textContent = word
      return { ...wordMap, [word]: textNode.getBBox().width }
    }, {})
    textNode.textContent = '\u00A0'
    const spaceWidth = textNode.getComputedTextLength()
    const lineHeight = textNode.getBBox().height
    textNode.setAttribute('style', '')
    return { wordsWithComputedWidth, spaceWidth, lineHeight }
  }
  return null
}


export { calculateWordWidths, calculateWordsByLines, MEASUREMENT_ELEMENT_ID }
