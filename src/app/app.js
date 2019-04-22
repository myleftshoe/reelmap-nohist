import React from 'react'
import Resizable from '../common/resizable'
import { resizableProps } from '../common/constants'
import { useToast } from '../toasts'
import Sidebars from '../sidebar/sidebars';
import MapContainer from '../map/map-container';
import TimelineHoriz from '../sidebar/timeline-horiz'

const openInNew = id => window.open(`http://localhost:3006/${id}`)

function App({ state, dispatch }) {

  console.log('rendering', state.activeItems);
  useToast(state.toast);

  return <div style={{ display: 'flex', flexDirection: 'column' }}>
    {/* <div style={{ height: '0px', width: 'calc(100vw - 50px)', backgroundColor: '#2c2c2f', position: 'absolute', bottom: '0px', left: '50px', zIndex: 100, overflowX: 'auto' }}>
      <TimelineHoriz state={state} dispatch={dispatch} />
    </div> */}
    <div>
      <Resizable split='vertical' {...resizableProps}>
        <Sidebars state={state} dispatch={dispatch} />
        <MapContainer state={state} dispatch={dispatch} />
      </Resizable >
    </div>
  </div>
}

export default App;
