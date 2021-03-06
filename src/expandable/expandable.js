import React, { useState } from 'react'
import { Spring, config, animated } from 'react-spring'
import usePrevious from '../hooks/usePrevious';

// export function usePrevious(value) {
//   const ref = useRef()
//   useEffect(() => void (ref.current = value), [value])
//   return ref.current
// }

const Contents = ({ children, ...style }) => (
  <animated.div style={{ ...style, }}>
    {children}
  </animated.div>
)

function Expandable(props) {

  const { children, content } = props;
  const [expanded, setExpanded] = useState(props.expanded);
  const previous = usePrevious(props.expanded);

  if (props.expanded && !expanded)
    setExpanded(true);

  if (!props.expanded && previous && expanded)
    setExpanded(false);

  function handleClick() {
    setExpanded(!expanded);
    props.onClick && props.onClick();
  }

  const springProps = {
    config: {
      ...config.default,
      restSpeedThreshold: 1,
      restDisplacementThreshold: 0,
    },
    from: {
      overflow: 'hidden',
      height: 0,
      opacity: 0,
    },
    to: {
      height: expanded ? 'auto' : 0,
      opacity: expanded ? 1 : 0,
    }
  }
  // Can remove 'expanded &&' below but seems more responsive with when groupBy buttons clicked
  return (
    <div onClick={handleClick} >
      <span style={{ verticalAlign: 'middle', userSelect: 'text' }}>{content}</span>
      <Spring native {...springProps} render={Contents}>
        {expanded && children}
      </Spring>
    </div >
  )
}

export default Expandable;
