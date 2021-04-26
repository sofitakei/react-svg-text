import Text from '../../src/Text'

export default { title: 'Example/Demo',
  component: Text,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
    maxHeight: {
      control: {
        type: 'range',
        min: 12,
        max: 100,
      },
    },
    maxWidth: {
      control: {
        type: 'range',
        min: 20,
        max: 400,
      },
    },
    verticalAnchor: {
      type: 'radio',
      options: ['start', 'middle', 'end'],
    },
    x: {
      control: {
        type: 'number',
        min: 0,
        max: 200,
      },
    },
  } }

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

const width = 300
const text = 'Wrap me up if you would like'

const TextDemo = props => (
  <div>
    <svg
      style={styles.svg}
      width={width}
    >
      <Text
        y={20}
        {...props}
      >
        {props.children ? props.children : text}
      </Text>
    </svg>

  </div>
)

export const SimpleText = TextDemo.bind({})
SimpleText.args = { x: 0, maxWidth: 250, maxHeight: 100 }

export const CenteredText = TextDemo.bind({})
CenteredText.args = { verticalAnchor: 'start',
  x: width / 2,
  textAnchor: 'middle',
  maxWidth: 50,
  maxHeight: 100 }

export const RightAlignedText = TextDemo.bind({})
RightAlignedText.args = { verticalAnchor: 'start',
  x: width,
  textAnchor: 'end' }

export const StyledText = TextDemo.bind({})
StyledText.args = { x: 0,
  style: { fontSize: 24, maxWidth: 100, fontWeight: 700 } }

export const PositionedText = TextDemo.bind({})
PositionedText.args = {
  dx: 20,
  dy: 150,
}
