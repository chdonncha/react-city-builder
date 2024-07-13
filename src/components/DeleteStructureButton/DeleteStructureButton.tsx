import DeleteIcon from '@mui/icons-material/Delete';
import { Fab } from '@mui/material';
import React from 'react';

interface DeleteStructureButtonProps {
  onDeleteStructure: () => void;
}

const DeleteStructureButton: React.FC<DeleteStructureButtonProps> = ({ onDeleteStructure }) => {
  return (
    <Fab onClick={onDeleteStructure} className="delete-structure-button" sx={{ borderRadius: '50%' }}>
      <DeleteIcon />
    </Fab>
  );
};

export { DeleteStructureButton };
