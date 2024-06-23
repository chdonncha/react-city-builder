import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import { Fab } from '@mui/material';
import React from 'react';

interface RotateButtonsProps {
  rotateCamera: (angleDegrees: number) => void;
}

const RotateButtons: React.FC<RotateButtonsProps> = ({ rotateCamera }) => {
  return (
    <>
      <Fab onClick={() => rotateCamera(90)} className="rotate-left-button" sx={{ borderRadius: '50%' }}>
        <RotateLeftIcon />
      </Fab>
      <Fab onClick={() => rotateCamera(-90)} className="rotate-right-button" sx={{ borderRadius: '50%' }}>
        <RotateRightIcon />
      </Fab>
    </>
  );
};

export { RotateButtons };
