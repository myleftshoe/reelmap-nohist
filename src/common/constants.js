
export const colors = {
    CHA: 'red',
    DRK: 'purple',
    SAM1: 'green',
    UNASSIGNED: 'blue'
}

export const resizableProps = {
    minSize: 300,
    maxSize: 874,
    defaultSize: 360,
}

// export const drivers = ['SAM1', 'DRK', 'CHA'];

function Driver(id, { color, start, end } = {}) {
    this.id = id;
    this.color = color || 'black';
    this.start = start || 32400;
    this.end = end || 61200;
}

export const drivers = new Map([
    ['CHA', new Driver('CHA', { color: 'red' })],
    ['DRK', new Driver('DRK', { color: 'purple' })],
    ['SAM1', new Driver('SAM1', { color: 'green' })],
]);

export const panes = [...(drivers.keys()), 'UNASSIGNED'];

export const theme = {
    badgeColor: '#facf00',
    searchHighlightColor: '#facf00',
}
