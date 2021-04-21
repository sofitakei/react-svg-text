import React, { useState } from 'react'
import Text from '../src/Text'

const styles = {
    exampleText: {
    width: 200,
    },
    range: {
    marginLeft: 25,
    width: 275,
    },
    svg: {
    height: 200,
    display: 'block',
    border: '1px solid #aaa',
    marginBottom: 10,
    },
}

const Demo = () => {
  const [state, setState] = useState({
    exampleText: 'This is really long text',
    x: 0,
    y: 0,
    width: 300,
    height: 16,
    angle: 0,
    scaleToFit: false,
    textAnchor: 'start',
    verticalAnchor: 'start',
    fontSize: '1em',
    fontFamily: 'Arial',
    lineHeight: '1em',
    showAnchor: true,
    resizeSvg: true,
  })

    return (
      <div>
        <h2>Demo</h2>
        <svg width={state.resizeSvg ? state.width : 300} style={styles.svg}>
          <Text
            x={state.x}
            y={state.y}
            width={state.width}
            textAnchor={state.textAnchor}
            verticalAnchor={state.verticalAnchor}
            lineHeight={state.lineHeight}
            height={state.height}
            scaleToFit={state.scaleToFit}
            angle={state.angle}
            style={{ fontSize: state.fontSize, fontFamily: state.fontFamily }}
          >
            {state.exampleText}
          </Text>
          { state.showAnchor && <circle cx={state.x} cy={state.y} r="2" fill="red" /> }
        </svg>

        <div>
          text:
          <input
            type="text"
            style={styles.exampleText}
            value={state.exampleText}
            onChange={e => setState({...state, exampleText: e.target.value })}
          />
        </div>

        <div>
          x:
          <input
            type="range"
            style={styles.range}
            min="0" max="300"
            value={state.x}
            onChange={e => setState({...state, x: Number(e.target.value) })}
          />
          <input type="text" value={state.x} onChange={e => setState({...state, x: Number(e.target.value) })} />
        </div>

        <div>
          y:
          <input
            type="range"
            style={styles.range}
            min="0" max="200"
            value={state.y}
            onChange={e => setState({...state, y: Number(e.target.value) })}
          />
          <input type="text" value={state.y} onChange={e => setState({...state, y: Number(e.target.value) })} />
        </div>

        <div>
          width:
          <input
            type="range"
            style={styles.range}
            min="25" max="300"
            value={state.width}
            onChange={e => setState({...state, width: Number(e.target.value) })}
          /> {state.width}
        </div>

        <div>
          textAnchor:
          <label>
            <input
              type="radio"
              value="start"
              onChange={e => setState({...state, textAnchor: e.target.value })}
              checked={state.textAnchor === 'start'}
            /> start
          </label>
          <label>
            <input
              type="radio"
              value="middle"
              onChange={e => setState({...state, textAnchor: e.target.value })}
              checked={state.textAnchor === 'middle'}
            /> middle
          </label>
          <label>
            <input
              type="radio"
              value="end"
              onChange={e => setState({...state, textAnchor: e.target.value })}
              checked={state.textAnchor === 'end'}
            /> end
          </label>
        </div>

        <div>
          verticalAnchor:
          <label>
            <input
              type="radio"
              value="start"
              onChange={e => setState({...state, verticalAnchor: e.target.value })}
              checked={state.verticalAnchor === 'start'}
            /> start
          </label>
          <label>
            <input
              type="radio"
              value="middle"
              onChange={e => setState({...state, verticalAnchor: e.target.value })}
              checked={state.verticalAnchor === 'middle'}
            /> middle
          </label>
          <label>
            <input
              type="radio"
              value="end"
              onChange={e => setState({...state, verticalAnchor: e.target.value })}
              checked={state.verticalAnchor === 'end'}
            /> end
          </label>
        </div>

        <div>
          fontSize:
          <input
            type="text"
            value={state.fontSize}
            onChange={e => setState({...state, fontSize: e.target.value })}
          />
        </div>

        <div>
          fontFamily:
          <input
            type="text"
            value={state.fontFamily}
            onChange={e => setState({...state, fontFamily: e.target.value })}
          />
        </div>

        <div>
          lineHeight:
          <input
            type="text"
            value={state.lineHeight}
            onChange={e => setState({...state, lineHeight: e.target.value })}
          />
        </div>
        <div>
          height:
          <input
            type="text"
            value={state.height}
            onChange={e => setState({...state, height: e.target.value })}
          />
        </div>
        <div>
          angle:
          <input
            type="range"
            min="0" max="360"
            value={state.angle}
            onChange={e => setState({...state, angle: Number(e.target.value) })}
          />
        </div>

        <div>
          <label>
            scaleToFit:
            <input
              type="checkbox"
              onChange={e => setState({...state, scaleToFit: !state.scaleToFit })}
              checked={state.scaleToFit}
            />
          </label>
        </div>

        <div>
          <label>
            show anchor:
            <input
              type="checkbox"
              onChange={e => setState({...state, showAnchor: !state.showAnchor })}
              checked={state.showAnchor}
            />
          </label>
        </div>

        <div>
          <label>
            resize svg (container):
            <input
              type="checkbox"
              onChange={e => setState({...state, resizeSvg: !state.resizeSvg })}
              checked={state.resizeSvg}
            />
          </label>
        </div>

        <hr />

        <h2>Simple</h2>
        <svg width={state.resizeSvg ? state.width : 300} style={styles.svg}>
          <Text x={0} width={state.width} verticalAnchor="start">
            {state.exampleText}
          </Text>
        </svg>

        <h2>Centered</h2>
        <svg width={state.resizeSvg ? state.width : 300} style={styles.svg}>
          <Text x={state.width / 2} width={state.width} verticalAnchor="start" textAnchor="middle">
            {state.exampleText}
          </Text>
        </svg>

        <h2>Right-aligned</h2>
        <svg width={state.resizeSvg ? state.width : 300} style={styles.svg}>
          <Text x={state.width} width={state.width} verticalAnchor="start" textAnchor="end">
            {state.exampleText}
          </Text>
        </svg>

        <h2>Line height</h2>
        <svg width={state.resizeSvg ? state.width : 300} style={styles.svg}>
          <Text x={0} width={state.width} verticalAnchor="start" lineHeight="2em">
            {state.exampleText}
          </Text>
        </svg>

        <h2>Styled text (fontWeight)</h2>
        <svg width={state.resizeSvg ? state.width : 300} style={styles.svg}>
          <Text x={0} width={state.width} verticalAnchor="start" style={{ fontWeight: 900 }}>
            {state.exampleText}
          </Text>
        </svg>

        <h2>Styled (fontSize px)</h2>
        <svg width={state.resizeSvg ? state.width : 300} style={styles.svg}>
          <Text x={0} width={state.width} verticalAnchor="start" style={{ fontSize: '24px' }}>
            {state.exampleText}
          </Text>
        </svg>

        <h2>Styled (fontSize em)</h2>
        <svg width={state.resizeSvg ? state.width : 300} style={styles.svg}>
          <Text x={0} width={state.width} verticalAnchor="start" style={{ fontSize: '1.5em' }}>
            {state.exampleText}
          </Text>
        </svg>

        <h2>Styled (fontSize rem)</h2>
        <svg width={state.resizeSvg ? state.width : 300} style={styles.svg}>
          <Text x={0} width={state.width} verticalAnchor="start" style={{ fontSize: '1.5rem' }}>
            {state.exampleText}
          </Text>
        </svg>

        <h2>Styled (fontSize %)</h2>
        <svg width={state.resizeSvg ? state.width : 300} style={styles.svg}>
          <Text x={0} width={state.width} verticalAnchor="start" style={{ fontSize: '150%' }}>
            {state.exampleText}
          </Text>
        </svg>

        <h2>Fit</h2>
        <svg width={state.resizeSvg ? state.width : 300} style={styles.svg}>
          <Text width={state.width} verticalAnchor="start" scaleToFit>
            {state.exampleText}
          </Text>
        </svg>

        <h2>dx & dy</h2>
        <svg width={state.resizeSvg ? state.width : 300} style={styles.svg}>
          <Text x={50} y={50} dx={10} dy={-10}  width={state.width} verticalAnchor="start">
            {state.exampleText}
          </Text>
        </svg>

      </div>
    )
  }


export default Demo;
