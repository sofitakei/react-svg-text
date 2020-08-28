import React, { Component } from 'react';
import PropTypes from 'prop-types';
import reduceCSSCalc from 'reduce-css-calc';
import { getStringWidth } from './utils';

const calculateWordWidths = (props) => {
  try {
    const words = props.children ? props.children.toString().split(/\s+/) : [];
    const wordsWithComputedWidth = words.map(word => (
      { word, width: getStringWidth(word, props.style) }
    ));

    const spaceWidth = getStringWidth('\u00A0', props.style);

    return { wordsWithComputedWidth, spaceWidth };
  } catch (e) {
    return null;
  }
};

class Text extends Component {

  static propTypes = {
    scaleToFit: PropTypes.bool,
    angle: PropTypes.number,
    textAnchor: PropTypes.oneOf(['start', 'middle', 'end', 'inherit']),
    verticalAnchor: PropTypes.oneOf(['start', 'middle', 'end']),
    style: PropTypes.object,
  };

  static defaultProps = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    lineHeight: '1em',
    capHeight: '0.71em', // Magic number from d3
    scaleToFit: false,
    textAnchor: 'start',
    verticalAnchor: 'end', // default SVG behavior
    fontSize: 15,
    lineSpacing: 0.3
  };

  state = {
    wordsByLines: [],
  };

  displayedLines = () => this.state.wordsByLines.filter((( { showLine } )=>showLine ))

  componentWillMount() {
    this.updateWordsByLines(this.props, true);
  }

  componentWillReceiveProps(nextProps) {
    const needCalculate = (
      this.props.children !== nextProps.children ||
      this.props.style !== nextProps.style
    );
    this.updateWordsByLines(nextProps, needCalculate);
  }

  updateWordsByLines(props, needCalculate) {

    // Only perform calculations if using features that require them (multiline, scaleToFit)
    if ((props.width || props.scaleToFit)) {
      if (needCalculate) {
        const wordWidths = calculateWordWidths(props);
    
        if (wordWidths) {
          const { wordsWithComputedWidth, spaceWidth } = wordWidths;

          this.wordsWithComputedWidth = wordsWithComputedWidth;
          this.spaceWidth = spaceWidth;
        } else {
          this.updateWordsWithoutCalculate(props);

          return;
        }
      }

      const wordsByLines = this.calculateWordsByLines(
        this.wordsWithComputedWidth,
        this.spaceWidth,
        props.width
      );
      this.setState({ wordsByLines });
    } else {
      this.updateWordsWithoutCalculate(props);
    }
  }

  updateWordsWithoutCalculate(props) {
    const words = props.children ? props.children.toString().split(/\s+/) : [];
    this.setState({ wordsByLines: [{ words }] });
  }

  calculateWordsByLines(wordsWithComputedWidth, spaceWidth, lineWidth) {
    const { scaleToFit, height, fontSize, lineSpacing } = this.props;
    return wordsWithComputedWidth.reduce((result, { word, width }) => {
      const currentLine = result[result.length - 1];

      if (currentLine && (lineWidth == null || scaleToFit ||
        (currentLine.width + width + spaceWidth) < lineWidth)) {
        // Word can be added to an existing line
        currentLine.words.push(word);
        currentLine.width += width + spaceWidth;
      } else {
        // Add first word to line or word is too long to scaleToFit on existing line
          const newLine = { words: [word], width, showLine: (fontSize + lineSpacing) * (result.length + 1) < height };
          result.push(newLine); 
      }
      return result;
    }, []);
  }


  render() {
    const {
      dx,
      dy,
      fontSize,
      textAnchor,
      verticalAnchor,
      scaleToFit,
      angle,
      lineHeight,
      lineSpacing,
      capHeight,
      getOffsetX,
      ...textProps
    } = this.props;
    const { wordsByLines } = this.state;

    const x = textProps.x + dx;
    const y = textProps.y + dy;
    let offsetX = 0
    let startDy;
    switch (verticalAnchor) {
      case 'start':
        startDy = reduceCSSCalc(`calc(${capHeight})`);
        break;
      case 'middle':
        startDy = reduceCSSCalc(
          `calc(${(this.displayedLines().length - 1) / 2} * -${lineHeight} + (${capHeight} / 2))`
        );
        break;
      default:
        startDy = reduceCSSCalc(`calc(${this.displayedLines().length - 1} * -${lineHeight})`);
        break;
    }

    const transforms = [];
    if (scaleToFit && wordsByLines.length) {
      const lineWidth = wordsByLines[0].width;
      const sx = this.props.width / lineWidth;
      const sy = sx;
      const originX = x - sx * x;
      const originY = y - sy * y;
      transforms.push(`matrix(${sx}, 0, 0, ${sy}, ${originX}, ${originY})`);
    }
    if (angle) {
      transforms.push(`rotate(${angle}, ${x}, ${y})`);
    }
    if (transforms.length) {
      textProps.transform = transforms.join(' ');
    }
    if(getOffsetX){
      const renderHeight = (fontSize + lineSpacing) * this.displayedLines().length
      offsetX = getOffsetX(renderHeight)
    }

    return (
      <text
        x={x + offsetX}
        y={y}
        textAnchor={textAnchor}
        {...textProps}
      >
        {
        this.displayedLines().map((line, index) => (
          <tspan x={x + offsetX} dy={index === 0 ? startDy : lineHeight} key={index}>
            {line.words.join(' ')}
          </tspan>
        ))

      }

      { wordsByLines.length > this.displayedLines().length &&
       [<tspan key="ellipsis">...</tspan>, <title key="title">{this.props.children}</title>]
      }
      </text>
    );
  }
}

export default Text;