import GridOffIcon from '@mui/icons-material/GridOff';
import GridOnIcon from '@mui/icons-material/GridOn';
import { Fab } from '@mui/material';
import React from 'react';

interface ShowGridButtonProps {
  onToggleGridVisibility: () => void;
  showGrid: boolean;
}

const ShowGridButton: React.FC<ShowGridButtonProps> = ({ onToggleGridVisibility, showGrid }) => {
  return (
    <Fab onClick={onToggleGridVisibility} className="show-grid-button" sx={{ borderRadius: '50%' }}>
      {showGrid ? <GridOffIcon /> : <GridOnIcon />}
    </Fab>
  );
};

export { ShowGridButton };