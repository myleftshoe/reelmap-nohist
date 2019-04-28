import React from 'react'
import { useStore } from 'outstated'
import driverStore from '../app/driver-store'
import CustomControlBar from './custom-control-bar';
import RegionSelectControl from './region-select-control';


function MapControls({ state, dispatch, handleAction }) {
    return <>
        <RouteBar state={state} dispatch={dispatch} />
        <ShowDetailsButton state={state} dispatch={dispatch} handleAction={handleAction} />
        <ClearButton state={state} dispatch={dispatch} />
        <CalculateButton state={state} dispatch={dispatch} />
        <RegionSelectTool state={state} dispatch={dispatch} />
    </>
}

function RegionSelectTool({ state, dispatch }) {
    const drivers = useStore(driverStore);
    const { color } = drivers.get(state.mapEditMode.id);
    return (
        <RegionSelectControl
            id='regionSelectTool'
            title='Region select tool'
            hidden
            active={state.mapEditMode.tool}
            onSelectionComplete={dispatch('selection-complete')}
            clearOnComplete
            color={color}
        />
    )
}

function RouteButton({ label, onLabelClick, onIconClick, selected }) {

    const drivers = useStore(driverStore);
    const { color } = drivers.get(label);

    function handleLabelClick(e) {
        onLabelClick && onLabelClick(e.target.id);
    }

    return <>
        <CustomControlBar.IconButton small
            id={label}
            title={label}
            color={drivers.get(label).color}
            // disabled
            onClick={onIconClick}
            style={{ margin: '0px 4px', flexBasis: '24px', flexGrow: 0, backgroundColor: color, border: '1px solid black' }}
        >
            fiber_manual_record
        </CustomControlBar.IconButton>
        <CustomControlBar.TextButton small
            id={label}
            onClick={handleLabelClick}
            color='black'
            style={{ border: 'none', justifyContent: 'flex-start' }}
            textLabel={label}
        >
            {label}
            <span type='checkbox' style={{ paddingLeft: 12, paddingBottom: 3, fontWeight: 'bold', opacity: !selected && 0 }} >✓</span>
            {/* <i style={{ fontSize: 16 }} className='material-icons'>check_mark</i> */}
        </CustomControlBar.TextButton>
    </>
}

function RouteBar({ state, dispatch }) {
    const drivers = useStore(driverStore);

    function handleClick(id) {
        if (state.selectedDrivers.includes(id))
            state.setSelectedDrivers(state.selectedDrivers.filter(driver => driver !== id));
        else
            state.setSelectedDrivers([...state.selectedDrivers, id])
        // dispatch('maximize-end')(id);
    }

    return (
        <CustomControlBar position='LEFT_TOP' small switchDirection style={{ backgroundColor: '#fff', padding: 3 }}>
            {drivers.keys().map(id =>
                <RouteButton key={id} selected={state.selectedDrivers.includes(id) || !state.selectedDrivers.length} id={id} label={id} onLabelClick={handleClick} onIconClick={e => dispatch('selection-change')([id])} />
            )}
        </CustomControlBar>
    )
}

function ShowDetailsButton({ state, dispatch, handleAction }) {
    return <>
        <CustomControlBar position='LEFT_TOP' small switchDirection  >
            <CustomControlBar.TextButton
                id='clear-all'
                onClick={() => handleAction('toggle-show-details')}
                title='Show details'
                style={{ width: 100 }}
            >
                Show Details
            </CustomControlBar.TextButton>
        </CustomControlBar>
    </>
}

function ClearButton({ state, dispatch }) {
    return <>
        <CustomControlBar position='LEFT_TOP' small switchDirection  >
            <CustomControlBar.TextButton
                id='clear-all'
                onClick={dispatch('clear-all')}
                title='Clear all routes'
                style={{ width: 100 }}
            >
                Clear
            </CustomControlBar.TextButton>
        </CustomControlBar>
    </>
}

function CalculateButton({ state, dispatch }) {
    return <>
        <CustomControlBar position='LEFT_TOP' small switchDirection  >
            <CustomControlBar.TextButton
                id='calculate-balanced-route'
                onClick={() => dispatch('auto-assign')({ balanced: false })}
                title='Allocate evenly across all vehicles'
                style={{ width: 100 }}
            >
                Calculate
            </CustomControlBar.TextButton>
        </CustomControlBar>
    </>
}

export default MapControls;