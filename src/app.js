import React from 'react'
import Resizable from './components/resizable'
import { resizableProps } from './constants'
import useToast from './hooks/useToast'
import Sidebars from './components/sidebars';
import MapMaster from './map/map-master';

const openInNew = id => window.open(`http://localhost:3006/${id}`)


function App({ state, dispatch }) {

  console.log('rendering', state.activeItems);
  useToast(state.toast);

  return (
    <Resizable split='vertical' {...resizableProps}>
      <Sidebars state={state} dispatch={dispatch} />
      <MapMaster state={state} dispatch={dispatch} />
    </Resizable >
  )
}

export default App;
