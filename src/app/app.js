import React from 'react'
import Resizable from '../common/resizable'
import { resizableProps } from '../common/constants'
import { useToast } from '../toasts'
import Sidebars from '../sidebar/sidebars';
import MapContainer from '../map/map-container';

const openInNew = id => window.open(`http://localhost:3006/${id}`)

function App({ state, dispatch }) {

  console.log('rendering', state.activeItems);
  useToast(state.toast);

  return (
    <Resizable split='vertical' {...resizableProps}>
      <Sidebars state={state} dispatch={dispatch} />
      <MapContainer state={state} dispatch={dispatch} />
    </Resizable >
  )
}

export default App;
