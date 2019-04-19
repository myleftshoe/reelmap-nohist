import React from 'react'
import { colors, drivers } from '../common/constants';
import CustomControlBar from './custom-control-bar';
import RegionSelectControl from './region-select-control';
import Badge from '../common/badge';

function MapControls({ state, dispatch }) {
    return <>
        <ToolBar state={state} dispatch={dispatch} />
        <RouteBar state={state} dispatch={dispatch} />
        <CalculateButton state={state} dispatch={dispatch} />
    </>
}

function RouteBar({ state, dispatch }) {
    return (
        <CustomControlBar position='LEFT_TOP' small style={{ width: 120, marginTop: 50 }} >
            <CustomControlBar.TextButton
                id='ALL'
                onClick={() => dispatch('maximize-end')(null)}
                style={{ padding: '7px 0px', marginBottom: 5, borderBottom: '1px solid #00000015' }}
                textLabel='All'
            >
                All <Badge>({state.items.count()})</Badge>
            </CustomControlBar.TextButton>
            {drivers.map(driver =>
                <CustomControlBar.TextButton
                    key={driver}
                    id={driver}
                    onClick={() => dispatch('maximize-end')(driver)}
                    color='white'
                    style={{ margin: 5, backgroundColor: colors[driver] }}
                    textLabel={driver}
                >
                    {driver} <Badge>({state.items.where('Driver', driver).count()})</Badge>
                </CustomControlBar.TextButton>
            )}
            <CustomControlBar.TextButton
                id='UNASSIGNED'
                style={{ padding: '7px 0px', marginTop: 5 }}
                onClick={() => dispatch('maximize-end')('UNASSIGNED')}
                textLabel='Unassigned'
            >
                Unassigned <Badge>({state.items.where('Driver', 'UNASSIGNED').count()})</Badge>
            </CustomControlBar.TextButton>
        </CustomControlBar>
    )
}

function ToolBar({ state, dispatch }) {
    return (
        <CustomControlBar small>
            <CustomControlBar.IconButton onClick={dispatch('editmode-click')}>{state.showPaths ? 'scatter_plot' : 'timeline'}</CustomControlBar.IconButton>
            <CustomControlBar.Select onSelectionChanged={dispatch('selection-change')}>
                {drivers.map(driver =>
                    <CustomControlBar.IconButton key={driver} id={driver} title={driver} color={colors[driver]}>fiber_manual_record</CustomControlBar.IconButton>
                )}
            </CustomControlBar.Select>
            <RegionSelectControl
                id='regionSelectTool'
                title='Region select tool'
                hidden
                active={state.mapEditMode.tool === 'rectangle'}
                onSelectionComplete={dispatch('selection-complete')}
                clearOnComplete
                color={colors[state.mapEditMode.id]}
            />
        </CustomControlBar>
    )
}

function CalculateButton({ state, dispatch }) {
    return (
        <CustomControlBar position='TOP_LEFT' small>
            <CustomControlBar.TextButton id='autoassign' onClick={dispatch('auto-assign')} tooltip='Auto assign'>Calculate!</CustomControlBar.TextButton>
        </CustomControlBar>
    )
}

export default MapControls;