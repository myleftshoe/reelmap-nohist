import React from 'react'
import { KmlLayer } from '@googlemap-react/core';

const url = (filename) => encodeURI(`https://raw.githubusercontent.com/aidanmorgan/aus_suburb_kml/master/VIC/${filename}.kml`);

export default React.memo(function SuburbBoundary({ suburb }) {
    return <KmlLayer id='kmllayer'
        opts={{
            url: url(suburb.toUpperCase()),
            suppressInfoWindows: true,
            preserveViewport: true,
            clickable: false,
            fillColor: 'pink',
        }}
    />
})