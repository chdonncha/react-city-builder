import React, {useState} from 'react';
import './BuildMenu.css';

const BuildMenu = ({
                       onToggleGridVisibility,
                       onToggleAxesVisibility,
                       showGrid,
                       showAxes,
                       onSelectResidential,
                       onSelectCommercial,
                       onSelectIndustrial,
                   }) => {
    const [selected, setSelected] = useState(null);

    return (
        <>
            <button onClick={onToggleGridVisibility}
                    className={selected === 'grid' ? 'selected' : ''}
                    onMouseDown={() => setSelected('grid')}>
                {showGrid ? 'Hide Grid' : 'Show Grid'}
            </button>
            <button onClick={onToggleAxesVisibility}
                    className={selected === 'axes' ? 'selected' : ''}
                    onMouseDown={() => setSelected('axes')}>
                {showAxes ? 'Hide Axes' : 'Show Axes'}
            </button>
            <button onClick={() => onSelectResidential('low')}
                    className={selected === 'lowResidential' ? 'selected' : ''}
                    onMouseDown={() => setSelected('lowResidential')}>
                Low Density Residential
            </button>
            <button onClick={() => onSelectResidential('medium')}
                    className={selected === 'mediumResidential' ? 'selected' : ''}
                    onMouseDown={() => setSelected('mediumResidential')}>
                Medium Density Residential
            </button>
            <button onClick={() => onSelectResidential('high')}
                    className={selected === 'highResidential' ? 'selected' : ''}
                    onMouseDown={() => setSelected('highResidential')}>
                High Density Residential
            </button>
            <button onClick={() => onSelectCommercial('low')}
                    className={selected === 'lowCommercial' ? 'selected' : ''}
                    onMouseDown={() => setSelected('lowCommercial')}>
                Low Density Commercial
            </button>
            <button onClick={() => onSelectCommercial('medium')}
                    className={selected === 'mediumCommercial' ? 'selected' : ''}
                    onMouseDown={() => setSelected('mediumCommercial')}>
                Medium Density Commercial
            </button>
            <button onClick={() => onSelectCommercial('high')}
                    className={selected === 'highCommercial' ? 'selected' : ''}
                    onMouseDown={() => setSelected('highCommercial')}>
                High Density Commercial
            </button>
            <button onClick={() => onSelectIndustrial('low')}
                    className={selected === 'lowIndustrial' ? 'selected' : ''}
                    onMouseDown={() => setSelected('lowIndustrial')}>
                Low Density Industrial
            </button>
            <button onClick={() => onSelectIndustrial('medium')}
                    className={selected === 'mediumIndustrial' ? 'selected' : ''}
                    onMouseDown={() => setSelected('mediumIndustrial')}>
                Medium Density Industrial
            </button>
            <button onClick={() => onSelectIndustrial('high')}
                    className={selected === 'highIndustrial' ? 'selected' : ''}
                    onMouseDown={() => setSelected('highIndustrial')}>
                High Density Industrial
            </button>
        </>
    );
};

export {BuildMenu};
