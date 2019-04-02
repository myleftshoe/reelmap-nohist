import React, { useState } from 'react';
import { CustomControl } from '@googlemap-react/core';
import S from './custom-control-bar-sc';
import useToggle from '../hooks/useToggle';

const CustomControlBar = ({ position = 'TOP_LEFT', small, children }) => {
    const vertical = position.startsWith('LEFT_') || position.startsWith('RIGHT_');
    return <CustomControl bindingPosition={position}>
        <S.ControlBar vertical={vertical}>{
            React.Children.map(children, child =>
                React.cloneElement(child, { small, vertical })
            )}
        </S.ControlBar>
    </CustomControl>
}

CustomControlBar.IconButton = ({ children: materialIconName, small, ...props }) => {
    const [active, toggleActive] = useToggle(false);
    return small
        ? <S.IconButtonSmall className='material-icons' active={active} onClick={toggleActive} {...props}>{materialIconName}</S.IconButtonSmall>
        : <S.IconButton className='material-icons' active={active} onClick={toggleActive} {...props}>{materialIconName}</S.IconButton>
}

CustomControlBar.TextButton = ({ children: materialIconName, small, ...props }) =>
    small
        ? <S.TextButtonSmall {...props}>{materialIconName}</S.TextButtonSmall>
        : <S.TextButton {...props}>{materialIconName}</S.TextButton>

export default CustomControlBar;

CustomControlBar.ButtonGroup = ({ onSelectionChanged, children, small, vertical }) => {
    console.log(children);
    const [selectedId, setSelectedId] = useState();
    function handleClick(child, e) {
        console.log(e.target.id, child)
        const id = e.target.id !== selectedId && e.target.id;
        setSelectedId(id);
        child.props.onClick && child.props.onClick(id);
        onSelectionChanged && onSelectionChanged(id);
    }
    return React.Children.map(children, child =>
        React.cloneElement(child, { small, vertical, active: selectedId === child.props.id, onClick: e => handleClick(child, e) })
    )
}

CustomControlBar.Select = ({ onSelectionChanged, children, small, vertical, multiple }) => {
    console.log(children);
    const [selected, setSelected] = useState(new Set());
    function handleClick(child, e) {
        const id = e.target.id;
        const _selected = new Set(selected);
        console.log(id, child, multiple);
        if (_selected.has(id))
            _selected.delete(id);
        else {
            if (!multiple) {
                _selected.clear();
            }
            _selected.add(id);
        }
        setSelected(new Set(_selected));
        child.props.onClick && child.props.onClick(id);
        onSelectionChanged && onSelectionChanged([..._selected.values()]);
    }
    return React.Children.map(children, child =>
        React.cloneElement(child, { small, vertical, active: selected.has(child.props.id), onClick: e => handleClick(child, e) })
    )
}