import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import { Fab } from '@mui/material';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import residentialTexture from '../../textures/residential.png';
import commercialTexture from '../../textures/residential.png';
import industrialTexture from '../../textures/residential.png';
import roadTexture from '../../textures/road.png';

import './RenderGrid.css';
import { BuildMenu } from '../BuildMenu/BuildMenu';
import { CitySprite } from '../CitySprite/CitySprite';

const GRID_SIZE = 200;
const GRID_DIVISIONS = 50;
const CELL_SIZE = GRID_SIZE / GRID_DIVISIONS;

interface GridSquareProps {
  position: number[];
  color: string;
  onClick: () => void;
  selected?: boolean;
}

const GridSquare: React.FC<GridSquareProps> = ({ position, color, onClick, selected }) => {
  return (
    <mesh position={position as [number, number, number]} rotation={[-Math.PI / 2, 0, 0]} onClick={onClick}>
      <planeGeometry args={[CELL_SIZE, CELL_SIZE]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
};

interface GridProps {
  size: number;
  selectedZone: { type: string | null; density: string | null };
  currentSelected: { x: number; y: number } | null;
  setCurrentSelected: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
}

const Grid: React.FC<GridProps> = ({ size, selectedZone, currentSelected, setCurrentSelected }) => {
  const [cells, setCells] = useState(() => {
    const initialCells = [];
    for (let x = -size / 2; x < size / 2; x += CELL_SIZE) {
      for (let y = -size / 2; y < size / 2; y += CELL_SIZE) {
        initialCells.push({ x, y, type: null, density: null, building: null });
      }
    }
    return initialCells;
  });

  const handleCellClick = (x, y) => {
    if (selectedZone.type) {
      setCells(
        cells.map((cell) =>
          cell.x === x && cell.y === y
            ? {
                ...cell,
                type: selectedZone.type,
                density: selectedZone.density,
                building: selectedZone.type,
              }
            : cell
        )
      );
    } else {
      setCurrentSelected({ x, y });
    }
  };

  const getColor = (cell, currentSelected) => {
    if (currentSelected && cell.x === currentSelected.x && cell.y === currentSelected.y) return 'lightgrey';
    switch (cell.type) {
      case 'residential':
        return cell.density === 'low' ? 'lightgreen' : cell.density === 'medium' ? 'green' : 'darkgreen';
      case 'commercial':
        return cell.density === 'low' ? 'lightblue' : cell.density === 'medium' ? 'blue' : 'darkblue';
      case 'industrial':
        return cell.density === 'low' ? 'wheat' : cell.density === 'medium' ? 'yellow' : 'goldenrod';
      case 'road':
        return 'dimgrey';
      default:
        return 'white';
    }
  };

  const getBuildingTexture = (type: any) => {
    switch (type) {
      case 'residential':
        return residentialTexture;
      case 'commercial':
        return commercialTexture;
      case 'industrial':
        return industrialTexture;
      case 'road':
        return roadTexture;
      default:
        return null; // Default or unknown type
    }
  };

  return (
    <>
      {cells.map((cell) => (
        <>
          <GridSquare
            key={`${cell.x}-${cell.y}`}
            position={[cell.x + CELL_SIZE / 2, 0, cell.y + CELL_SIZE / 2]}
            onClick={() => handleCellClick(cell.x, cell.y)}
            color={getColor(cell, currentSelected)}
          />
          {cell.building && (
            <CitySprite
              imageUrl={getBuildingTexture(cell.building)}
              position={[cell.x + CELL_SIZE / 2, 1, cell.y + CELL_SIZE / 2]}
              scale={1}
              isFlat={cell.building === 'road'}
              GRID_SIZE={GRID_SIZE}
              GRID_DIVISIONS={GRID_DIVISIONS}
            />
          )}
        </>
      ))}
    </>
  );
};

interface GridAndAxesProps {
  showGrid: boolean;
  showAxes: boolean;
  selectedZone: { type: string | null; density: string | null };
  currentSelected: { x: number; y: number } | null;
  setCurrentSelected: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
}

const GridAndAxes: React.FC<GridAndAxesProps> = ({
  showGrid,
  showAxes,
  selectedZone,
  currentSelected,
  setCurrentSelected,
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
      />
    </>
  );
};

const RenderGrid = () => {
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [selectedZone, setSelectedZone] = useState<{ type: string | null; density: string | null }>({
    type: null,
    density: null,
  });
  const [currentSelected, setCurrentSelected] = useState<{ x: number; y: number } | null>(null);

  const toggleGridVisibility = () => setShowGrid(!showGrid);
  const toggleAxesVisibility = () => setShowAxes(!showAxes);
  const handleSelectZone = (type: string, density: string) => {
    setSelectedZone({ type, density });
  };
  const handleSelectRoad = () => {
    setSelectedZone({ type: 'road', density: null });
  };
  const orbitControlsRef = useRef(null);
  // @ts-ignore
  const cameraRef = useRef<THREE.OrthographicCamera>(null);

  const rotateCamera = (angleDegrees) => {
    const controls = orbitControlsRef.current;
    if (controls) {
      const offset = controls.object.position.clone().sub(controls.target);
      const angleRadians = THREE.MathUtils.degToRad(angleDegrees);
      const rotationMatrix = new THREE.Matrix4();

      rotationMatrix.makeRotationY(angleRadians);
      offset.applyMatrix4(rotationMatrix);

      controls.object.position.copy(controls.target.clone().add(offset));
      controls.object.lookAt(controls.target);
      controls.object.up.set(0, 1, 0);

      controls.update();
    }
  };

  return (
    <>
      <Fab onClick={() => rotateCamera(90)} className="rotate-left-button" sx={{ borderRadius: '50%' }}>
        <RotateLeftIcon />
      </Fab>
      <Fab onClick={() => rotateCamera(-90)} className="rotate-right-button" sx={{ borderRadius: '50%' }}>
        <RotateRightIcon />
      </Fab>
      <BuildMenu
        onToggleGridVisibility={toggleGridVisibility}
        onToggleAxesVisibility={toggleAxesVisibility}
        onSelectResidential={(density) => handleSelectZone('residential', density)}
        onSelectCommercial={(density) => handleSelectZone('commercial', density)}
        onSelectIndustrial={(density) => handleSelectZone('industrial', density)}
        onSelectRoad={handleSelectRoad}
        showGrid={showGrid}
        showAxes={showAxes}
      />
      <Canvas>
        <OrthographicCamera
          ref={cameraRef}
          position={[100, 100, 100]}
          left={-window.innerWidth / 2}
          right={window.innerWidth / 2}
          top={window.innerHeight / 2}
          bottom={-window.innerHeight / 2}
          near={-500}
          far={500}
          zoom={50}
          makeDefault
        />
        {/*<ambientLight intensity={0.5} />*/}
        {/*<pointLight position={[100, 100, 100]} />*/}
        <GridAndAxes
          showGrid={showGrid}
          showAxes={showAxes}
          selectedZone={selectedZone}
          currentSelected={currentSelected}
          setCurrentSelected={setCurrentSelected}
        />
        <OrbitControls ref={orbitControlsRef} enableRotate={false} enableZoom={true} enablePan={true} />
      </Canvas>
    </>
  );
};

export { RenderGrid };
