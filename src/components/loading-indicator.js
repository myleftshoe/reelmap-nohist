import React from 'react'
import { css } from '@emotion/core';
import { BeatLoader } from 'react-spinners'

const LoadingIndicator = ({ loading }) =>
    <BeatLoader
        css={css`margin-top: auto;`}
        sizeUnit='px'
        size={6}
        color={'#FFF'}
        loading={loading}
    />

export default LoadingIndicator;
