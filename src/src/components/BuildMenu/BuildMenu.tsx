import React from 'react';

const BuildMenu = ({
                       onToggleGridVisibility,
                       onToggleAxesVisibility,
                       showGrid,
                       showAxes,
                       onSelectResidential,
                       onSelectCommercial,
                       onSelectIndustrial,
                   }) => {
    return (
        <>
            <button onClick={onToggleGridVisibility}>
                {showGrid ? 'Hide Grid' : 'Show Grid'}
            </button>
            <button onClick={onToggleAxesVisibility}>
                {showAxes ? 'Hide Axes' : 'Show Axes'}
            </button>
            <button onClick={() => onSelectResidential('low')}>
                Low Density Residential
            </button>
            <button onClick={() => onSelectResidential('medium')}>
                Medium Density Residential
            </button>
            <button onClick={() => onSelectResidential('high')}>
                High Density Residential
            </button>
            <button onClick={() => onSelectCommercial('low')}>
                Low Density Commercial
            </button>
            <button onClick={() => onSelectCommercial('medium')}>
                Medium Density Commercial
            </button>
            <button onClick={() => onSelectCommercial('high')}>
                High Density Commercial
            </button>
            <button onClick={() => onSelectIndustrial('low')}>
                Low Density Industrial
            </button>
            <button onClick={() => onSelectIndustrial('medium')}>
                Medium Density Industrial
            </button>
            <button onClick={() => onSelectIndustrial('high')}>
                High Density Industrial
            </button>
        </>
    );
};

export default BuildMenu;
