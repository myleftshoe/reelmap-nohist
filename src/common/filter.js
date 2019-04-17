import React, { useState } from 'react';
import styled from '@emotion/styled';
import Highlight from 'react-highlighter'
import { theme } from './constants';

export const SearchHighlight = props =>
    // react-highlighter will error if children is not a string
    <div style={{ pointerEvents: 'none' }}>
        <Highlight matchStyle={{ backgroundColor: theme.searchHighlightColor }} search={Filter.value}>
            {props.children + ''}
        </Highlight>
    </div>

export const searchable = value =>
    <SearchHighlight>
        {value}
    </SearchHighlight>

const FilterInput = styled.input`
    flex: 1 1 258px;
    color: white;
    background-color: #fff1;
    border: none;
    padding: 0px 5px;
    margin: 8px 10px;
    height: 1.6em;
    justify-self: flex-start;
`

function Filter(props) {

    const [value, setValue] = useState('');

    function handleFocus({ target }) {
        setValue('');
        Filter.value = '';
        props.onChange && props.onChange('');
    }
    function handleChange({ target }) {
        setValue(target.value);
        Filter.value = target.value;
        props.onChange && props.onChange(target.value);
    }

    return <FilterInput placeholder='Filter' type='text' value={value} onChange={handleChange} onFocus={handleFocus} />
}

Filter.value = '';

Filter.apply = function (data, keys) {
    if (!Filter.value)
        return data.slice();
    return data.filter(data => keys.reduce((matched, key) => matched || data[key].toUpperCase().includes(Filter.value.toUpperCase()), false))
}

export default Filter;