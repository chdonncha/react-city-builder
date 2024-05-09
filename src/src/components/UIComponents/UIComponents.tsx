import React from 'react';

const UIComponents = ({ onToggleGrid, onToggleAxes, showGrid, showAxes }) => {
    return (
        <>
            <button onClick={onToggleGrid}>
                {showGrid ? 'Hide Grid' : 'Show Grid'}
            </button>
            <button onClick={onToggleAxes}>
                {showAxes ? 'Hide Axes' : 'Show Axes'}
            </button>
        </>
    );
};

export default UIComponents;
