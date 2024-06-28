import React from 'react';

import { Grid } from './Grid';

const GRID_SIZE = 200;
const GRID_DIVISIONS = 50;

interface GridAndAxesProps {
  showGrid: boolean;
  showAxes: boolean;
  selectedZone: { type: string | null; density: string | null };
  currentSelected: { x: number; y: number } | null;
  setCurrentSelected: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
  map: string[][];
}

const GridAndAxes: React.FC<GridAndAxesProps> = ({
                                                   showGrid,
                                                   showAxes,
                                                   selectedZone,
                                                   currentSelected,
                                                   setCurrentSelected,
                                                   map,
                                                 }) => {
  return (
    <>
      {showGrid && <gridHelper args={[GRID_SIZE, GRID_DIVISIONS, 'red', 'gray']} />}
      {showAxes && <axesHelper args={[100]} />}
      <Grid
        size={GRID_SIZE}
        selectedZone={selectedZone}
        currentSelected={currentSelected}
        setCurrentSelected={setCurrentSelected}
        map={map}
      />
    </>
  );
};

export { GridAndAxes };
