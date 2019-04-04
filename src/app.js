import React from 'react'
import Minibar from './components/minibar'
import Resizable from './components/resizable'
import Sidebar from './components/sidebar'
import Group from './components/group'
import Filter from './components/filter'
import { groupBy2 } from './utils/utils'
import GoogleMap from './map/map'
import { InfoWindow } from '@googlemap-react/core'
// import { labeledIcon } from './map/markers/markers.js'
// import ContouredPolygon from './map/contoured-polygon'
// import SuburbBoundary from './map/suburb-boundary'
import MarkerInfoWindowContent from './map/marker-infowindow-content'
import { colors, resizableProps } from './constants'
import DepotMarker from './map/depot-marker'
// import move from 'lodash-move';
import Panes from './components/panes';
import CustomControlBar from './map/custom-control-bar';
import RegionSelectControl from './map/region-select-control';
import LoadingIndicator from './components/loading-indicator';
import JobMarkers from './map/job-markers';
import Routes from './map/routes';
import StateProvider from './state-provider';

const drivers = ['SAM1', 'DRK', 'CHA'];
const panes = [...drivers, 'UNASSIGNED'];

function App(props) {


  return (
    <StateProvider>{(get, set, handle) =>
      <Resizable split='vertical' {...resizableProps}>
        <Sidebar>
          <Sidebar.Navigation>
            <Sidebar.NavButton id='City,PostalCode' active={get.groupBy === 'City,PostalCode'} onClick={set.groupBy} tooltip='Group by suburb'>location_city</Sidebar.NavButton>
            <Sidebar.NavButton id='PostalCode,City' active={get.groupBy === 'PostalCode,City'} onClick={set.groupBy} tooltip='Group by post code'>local_post_office</Sidebar.NavButton>
            <Sidebar.NavButton id='OrderId,' active={get.groupBy === 'OrderId,'} onClick={set.groupBy} tooltip='Sort by order number'>sort</Sidebar.NavButton>
            <Sidebar.NavButton id='Sequence,' active={get.groupBy === 'Sequence,'} onClick={set.groupBy} tooltip='Sort by delivery order'>format_list_numbered</Sidebar.NavButton>
            <Sidebar.NavButton id='editmode' onClick={handle.EditModeClick} tooltip='Auto assign'>scatter_plot</Sidebar.NavButton>
            <Sidebar.NavButton id='autoassign' onClick={handle.autoAssign} tooltip='Auto assign'>timeline</Sidebar.NavButton>
            <Sidebar.NavButton id='clearall' onClick={handle.clearAll} tooltip='Clear all'>clear_all</Sidebar.NavButton>
            <LoadingIndicator loading={get.working} />
          </Sidebar.Navigation>
          <Sidebar.Content>
            <Minibar>
              <Filter onChange={set.filter} />
              {/* <Minibar.Button onClick={() => setSortBy('City,PostalCode')}>location_city</Minibar.Button>
            <Minibar.Button onClick={() => setSortBy('PostalCode,City')}>local_post_office</Minibar.Button>
            <Minibar.Button onClick={() => setSortBy([])}>format_list_numbered</Minibar.Button> */}
            </Minibar>
            <Panes
              panes={panes}
              groupBy={'Driver'}
              items={get.filteredItems}
              isFiltered={get.isFiltered}
              onDrop={handle.Drop}
              onMaximizeEnd={handle.MaximizeEnd}
              onOpenInNew={handle.editRoute}
            >
              {items => {
                const groupedItems = groupBy2(items, get.groupBy);
                const groupKeys = Object.keys(groupedItems);
                return groupKeys.map(groupKey =>
                  <Group
                    key={groupKey}
                    id={groupKey.split(',')[0]}
                    type={get.groupBy.split(',')[0]}
                    items={groupedItems[groupKey]}
                    content={groupKey}
                    // onHeaderClick={handle.GroupHeaderClick}
                    onItemClick={set.selectMarker}
                    activeItemId={get.selectedMarkerId}
                    flatten={groupKey === 'undefined'}
                    count={groupedItems[groupKey].length}
                    expanded={get.isFiltered}
                    filter={get.filter}
                  />
                )
              }}
            </Panes>
          </Sidebar.Content>
        </Sidebar >
        <GoogleMap
          onClick={() => set.selectMarker(null)}
          onRightClick={handle.MapRightClick}
          cursor={get.cursor}
        >
          <DepotMarker
            id={'depot'}
            position={{ lat: -37.688797, lng: 145.005252 }}
            cursor={get.cursor}
          />
          <JobMarkers
            items={get.activeItems}
            selectedMarkerId={get.selectedMarkerId}
            cursor={get.cursor}
            showLabel={!get.mapEditMode.on}
            onMarkerClick={handle.MarkerClick}
            onMarkerRightClick={handle.MarkerRightClick}
            onMarkerMouseOver={set.selectMarker}
          />
          {get.selectedMarkerId &&
            <InfoWindow
              anchorId={get.selectedMarkerId}
              visible={get.selectedMarkerId}
              onCloseClick={() => set.selectMarker(null)}
              opts={{ disableAutoPan: true }}
            >
              <MarkerInfoWindowContent
                item={get.selectedItem}
                color={colors[get.selectedItem.Driver]}
                onDriverChange={handle.reassignItem}
                dropDownValues={colors}
              />
            </InfoWindow>
          }
          {/* <ContouredPolygon
          id='polygon'
          points={polygonPoints}
        /> */}
          <Routes hidden={get.isFiltered} paths={get.activePaths} onRightClick={handle.reassignRoute} />
          {/* <SuburbBoundary suburb={suburb} /> */}
          {get.mapEditMode.on &&
            <CustomControlBar small>
              <CustomControlBar.Select onSelectionChanged={handle.SelectionChange}>
                {drivers.map(driver =>
                  <CustomControlBar.IconButton key={driver} id={driver} title={driver} color={colors[driver]}>fiber_manual_record</CustomControlBar.IconButton>
                )}
              </CustomControlBar.Select>
              <RegionSelectControl
                id='regionSelectTool'
                title='Region select tool'
                hidden
                active={get.mapEditMode.tool === 'rectangle'}
                onSelectionComplete={handle.SelectionComplete}
                clearOnComplete
                color={colors[get.mapEditMode.id]}
              />
            </CustomControlBar>
          }
        </GoogleMap>
      </Resizable >
    }
    </StateProvider>
  );
}

export default App;
