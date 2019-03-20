const baseSvg = (fillColor, borderColor, opacity,) => `
    <path style="fill:${fillColor}; ${opacity};stroke:${borderColor};stroke-width:2"
        d="M15,28.9c-1.6-3-8-9.4-9.9-13.5c-0.6-1.3-1-2.7-1-4.2C4.2,5.7,9.1,1.1,15,1.1s10.9,4.6,10.9,10.1
        c0,1.5-0.4,2.9-1,4.2l0,0C23,19.5,16.6,25.9,15,28.9L15,28.9z"
    />
`;

export const labeledSvg = (label, fillColor, borderColor) => `<?xml version="1.0"?>
<svg version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="30px" height="30px"
>
    <path d="M0 0h30v30H0z" fill="none"/>
    <g>
        ${baseSvg(fillColor, borderColor)}
        <style>
            .small { font: 10px roboto; font-weight: 100; fill: ${borderColor} }
        </style>
        <text class="small" x="15px" y="15px" text-anchor="middle" stroke="${borderColor}" dy=".0em">${label}</text>
    </g>
</svg>
`;
export const labeledSvg2 = (label, fillColor, borderColor) => `
<svg version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="30px" height="30px"
>
    <path d="M0 0h30v30H0z" fill="none"/>
    <g>
        ${baseSvg(fillColor, borderColor)}
        <style>
            .small { font: 10px roboto; font-weight: 100; fill: ${borderColor} }
        </style>
        <text class="small" x="15px" y="15px" text-anchor="middle" stroke="${borderColor}" dy=".0em">${label}</text>
    </g>
</svg>
`;

const raisedLabeledSvg = (label, fillColor, borderColor, opacity, badgeColor) => `<?xml version="1.0"?>
<svg version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="32px" height="36px"
>
    <path d="M0 0h32v36H0z" fill="none"/>
    <filter id="shadow" width="1.5" height="1.5" x="-.2" y="-.2">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur"/>
        <feColorMatrix result="bluralpha" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0"/>
        <feOffset in="bluralpha" dx="3" dy="3" result="offsetBlur"/>
        <feMerge>
            <feMergeNode in="offsetBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
    </filter>
    <g filter="url(#shadow)">
        ${baseSvg(fillColor, borderColor, opacity)}
        <style>
            .small { font: 10px roboto; font-weight: 100; fill: ${borderColor} }
        </style>
    </g>
    <text class="small" x="15px" y="15px" text-anchor="middle" stroke="${borderColor}" dy=".0em">${label}</text>
    <circle cx="24" cy="4" r="4" fill="${badgeColor}"/>
</svg>
`;

export const labeledIcon = ({label="", color="blue", opacity=1, disabled=false, raised=false, inverted=false, badgeColor="transparent"}) => {
    const opacityValue = disabled ? "0.4" : "";
    const opacitySvg  = opacity ? `fill-opacity:${opacityValue};` : "";
    let fillColor = color;
    let borderColor = "white";
    if (inverted) {
        fillColor = "white";
        borderColor = color;
    }
    let svg;
    if (raised)
        svg = raisedLabeledSvg(label, fillColor, borderColor, opacitySvg, badgeColor);
    else
        svg = labeledSvg(label, fillColor, borderColor, opacitySvg, badgeColor);
    const icon = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
        anchor: {x:15, y:30},
        // scaledSize: new google.maps.Size(32,32)
    };
    return icon;
}

