import React, { useState } from 'react';
import SplitPane from './react-split-pane';
import '../resizer.css'

function Resizable({ defaultSize, minSize, maxSize, children }) {

    const [size, setSize] = useState(defaultSize);

    function handleResizerDoubleClick() {
        if (size === defaultSize)
            setSize(50)
        else
            setSize(defaultSize)
    }

    return <SplitPane
        split="vertical"
        minSize={minSize}
        maxSize={maxSize}
        defaultSize={defaultSize}
        hideResistance={200}
        hiddenSize={50}
        size={size}
        onChange={setSize}
        onResizerDoubleClick={handleResizerDoubleClick}
    >
        {children}
    </SplitPane>
}

export default Resizable;
