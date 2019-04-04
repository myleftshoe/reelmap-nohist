import React from 'react'
import { css } from '@emotion/core';
import { BeatLoader } from 'react-spinners'

const Busy = ({ busy }) =>
    <BeatLoader
        css={css`margin-top: auto;`}
        sizeUnit='px'
        size={6}
        color={'#FFF'}
        loading={busy}
    />

export default Busy;
