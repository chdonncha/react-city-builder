import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';

import React, { useState } from 'react';
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const BuildingContent = () => {
    return (
      <>
        <button
          onClick={onToggleAxesVisibility}
          className={selected === 'axes' ? 'selected' : ''}
          onMouseDown={() => setSelected('axes')}
        >
          {showAxes ? 'Hide Axes' : 'Show Axes'}
        </button>
        <button
          onClick={onToggleGridVisibility}
          className={selected === 'grid' ? 'selected' : ''}
          onMouseDown={() => setSelected('grid')}
        >
          {showGrid ? 'Hide Grid' : 'Show Grid'}
        </button>
        <button
          onClick={() => onSelectResidential('low')}
          className={selected === 'lowResidential' ? 'selected' : ''}
          onMouseDown={() => setSelected('lowResidential')}
        >
          Low Density Residential
        </button>
        <button
          onClick={() => onSelectResidential('medium')}
          className={selected === 'mediumResidential' ? 'selected' : ''}
          onMouseDown={() => setSelected('mediumResidential')}
        >
          Medium Density Residential
        </button>
        <button
          onClick={() => onSelectResidential('high')}
          className={selected === 'highResidential' ? 'selected' : ''}
          onMouseDown={() => setSelected('highResidential')}
        >
          High Density Residential
        </button>
        <button
          onClick={() => onSelectCommercial('low')}
          className={selected === 'lowCommercial' ? 'selected' : ''}
          onMouseDown={() => setSelected('lowCommercial')}
        >
          Low Density Commercial
        </button>
        <button
          onClick={() => onSelectCommercial('medium')}
          className={selected === 'mediumCommercial' ? 'selected' : ''}
          onMouseDown={() => setSelected('mediumCommercial')}
        >
          Medium Density Commercial
        </button>
        <button
          onClick={() => onSelectCommercial('high')}
          className={selected === 'highCommercial' ? 'selected' : ''}
          onMouseDown={() => setSelected('highCommercial')}
        >
          High Density Commercial
        </button>
        <button
          onClick={() => onSelectIndustrial('low')}
          className={selected === 'lowIndustrial' ? 'selected' : ''}
          onMouseDown={() => setSelected('lowIndustrial')}
        >
          Low Density Industrial
        </button>
        <button
          onClick={() => onSelectIndustrial('medium')}
          className={selected === 'mediumIndustrial' ? 'selected' : ''}
          onMouseDown={() => setSelected('mediumIndustrial')}
        >
          Medium Density Industrial
        </button>
        <button
          onClick={() => onSelectIndustrial('high')}
          className={selected === 'highIndustrial' ? 'selected' : ''}
          onMouseDown={() => setSelected('highIndustrial')}
        >
          High Density Industrial
        </button>
      </>
    );
  };

  // @ts-ignore
  return (
    <>
      <IconButton onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <BuildingContent />
      </Drawer>
    </>
  );
};

export { BuildMenu };
