import React from 'react'
import Resizable from '../common/resizable'
import { resizableProps } from '../common/constants'
import { useToast } from '../toasts'
import Sidebars from '../sidebar/sidebars';
import MapContainer from '../map/map-container';
import TextButton from '../common/text-button';


function App({ state, dispatch }) {

  console.log('rendering', state.activeItems);
  useToast(state.toast);

  return <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: '0 0 40px', width: '100vw', backgroundColor: '#2c2c2f', display: 'flex', flexDiretion: 'row', justifyContent: 'space-evenly' }}>
      <TextButton color='white'>Assign</TextButton>
      <div style={{ flex: '0 0 1px', backgroundColor: '#fff3' }} />
      <TextButton color='white'>Plan</TextButton>
    </div>
    <div>
      <Resizable split='vertical' {...resizableProps}>
        <Sidebars state={state} dispatch={dispatch} />
        <MapContainer state={state} dispatch={dispatch} />
      </Resizable >
    </div>
  </div>
}

export default App;
