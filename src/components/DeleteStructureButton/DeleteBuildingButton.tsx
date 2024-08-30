import DeleteIcon from '@mui/icons-material/Delete';
import { Fab } from '@mui/material';
import React from 'react';

interface DeleteBuildingButtonProps {
  onDeleteBuilding: () => void;
}

const DeleteBuildingButton: React.FC<DeleteBuildingButtonProps> = ({ onDeleteBuilding }) => {
  return (
    <Fab onClick={onDeleteBuilding} className="delete-building-button" sx={{ borderRadius: '50%' }}>
      <DeleteIcon />
    </Fab>
  );
};

export { DeleteBuildingButton };
