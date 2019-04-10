import React from 'react'
// import styled from '@emotion/styled'
import { Tooltip as Tippy } from 'react-tippy'
import 'react-tippy/dist/tippy.css'

export default function Tooltip(props) {
    return <Tippy
        position='right'
        // size='small'
        title={props.content}
        theme='light'
        arrow
        delay={300}
        html={(
            <div style={{ fontSize: '.7rem' }}>
                {props.content}
            </div>
        )}
    >
        {props.children}
    </Tippy>
}