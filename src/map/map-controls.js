import React, { useState } from 'react'
import { colors, drivers } from '../common/constants';
import CustomControlBar from './custom-control-bar';
import RegionSelectControl from './region-select-control';
import useToggle from '../hooks/useToggle';
import '@trendmicro/react-checkbox/dist/react-checkbox.css';

function MapControls({ state, dispatch }) {
    console.log(state.activeRoutes)
    return <>
        <RouteBar state={state} dispatch={dispatch} />
        <CalculateButton state={state} dispatch={dispatch} />
        <RegionSelectControl
            id='regionSelectTool'
            title='Region select tool'
            hidden
            active={state.mapEditMode.tool}
            onSelectionComplete={dispatch('selection-complete')}
            clearOnComplete
            color={colors[state.mapEditMode.id]}
        />
    </>
}


function RouteButton({ label, onLabelClick, onIconClick, selected }) {
    function handleLabelClick(e) {
        onLabelClick && onLabelClick(e.target.id);
    }
    return <>
        <CustomControlBar.IconButton small
            id={label}
            title={label}
            color={colors[label]}
            // disabled
            onClick={onIconClick}
            style={{ margin: '0px 4px', flexBasis: '24px', flexGrow: 0, backgroundColor: colors[label], border: '1px solid black' }}
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

    function handleClick(id) {
        if (state.selectedDrivers.includes(id))
            state.setSelectedDrivers(state.selectedDrivers.filter(driver => driver !== id));
        else
            state.setSelectedDrivers([...state.selectedDrivers, id])
        // dispatch('maximize-end')(id);
    }

    return (
        <CustomControlBar position='LEFT_TOP' small switchDirection style={{ backgroundColor: '#fff', padding: 3 }}>
            {[...drivers.keys()].map(driver =>
                <RouteButton key={driver} selected={state.selectedDrivers.includes(driver) || !state.selectedDrivers.length} id={driver} label={driver} onLabelClick={handleClick} onIconClick={e => dispatch('selection-change')([driver])} />
            )}
        </CustomControlBar>
    )
}

function CalculateButton({ state, dispatch }) {
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
        <CustomControlBar position='LEFT_TOP' small switchDirection  >
            <CustomControlBar.TextButton
                id='calculate-balanced-route'
                onClick={() => dispatch('auto-assign')({ balanced: true })}
                title='Allocate evenly across all vehicles'
                style={{ width: 100 }}
            >
                Calculate
            </CustomControlBar.TextButton>
        </CustomControlBar>
    </>
}

export default MapControls;