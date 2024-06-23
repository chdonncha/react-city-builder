import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import { Fab } from '@mui/material';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { ThreeEvent } from '@react-three/fiber';
import React, { useRef, useState } from 'react';
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
  onMouseDown: (event: ThreeEvent<PointerEvent>) => void;
  onMouseEnter: (event: ThreeEvent<PointerEvent>) => void;
  onMouseUp: (event: ThreeEvent<PointerEvent>) => void;
  selected?: boolean;
}

const GridSquare: React.FC<GridSquareProps> = ({ position, color, onMouseDown, onMouseEnter, onMouseUp }) => {
  return (
    <mesh
      position={position as [number, number, number]}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerDown={onMouseDown}
      onPointerEnter={onMouseEnter}
      onPointerUp={onMouseUp}
    >
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

const Grid: React.FC<GridProps> = ({ size, selectedZone, currentSelected }) => {
  const [cells, setCells] = useState(() => {
    const initialCells = [];
    for (let x = -size / 2; x < size / 2; x += CELL_SIZE) {
      for (let y = -size / 2; y < size / 2; y += CELL_SIZE) {
        initialCells.push({ x, y, type: null, density: null, building: null });
      }
    }
    return initialCells;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
  const [tempCells, setTempCells] = useState(cells);
  const [draggedCells, setDraggedCells] = useState<{ x: number, y: number }[]>([]);

  const handleMouseDown = (x: number, y: number, event: ThreeEvent<PointerEvent>) => {
    if (event.nativeEvent.button !== 0) return; // Ensure it is a left-click
    setIsDragging(true);
    setDragStart({ x, y });
    setDraggedCells([]);
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (isDragging && selectedZone.type) {
      updateTempCells(x, y);
    }
  };

  const handleMouseUp = (event: ThreeEvent<PointerEvent>) => {
    if (event.nativeEvent.button !== 0) return; // Ensure it is a left-click
    if (isDragging && selectedZone.type) {
      setCells(tempCells);
    }
    setIsDragging(false);
    setDragStart(null);
    setDraggedCells([]);
  };

  const updateTempCells = (x: number, y: number) => {
    if (!dragStart) return;

    const xMin = Math.min(dragStart.x, x);
    const xMax = Math.max(dragStart.x, x);
    const yMin = Math.min(dragStart.y, y);
    const yMax = Math.max(dragStart.y, y);

    const newDraggedCells: { x: number, y: number }[] = [];

    const newTempCells = cells.map(cell => {
      if (selectedZone.type === 'road') {
        // Allow roads only in straight lines
        if (dragStart.x === x) {
          // Vertical line
          if (cell.x === dragStart.x && cell.y >= yMin && cell.y <= yMax) {
            newDraggedCells.push({ x: cell.x, y: cell.y });
            return {
              ...cell,
              type: selectedZone.type,
              density: selectedZone.density,
              building: selectedZone.type,
            };
          }
        } else if (dragStart.y === y) {
          // Horizontal line
          if (cell.y === dragStart.y && cell.x >= xMin && cell.x <= xMax) {
            newDraggedCells.push({ x: cell.x, y: cell.y });
            return {
              ...cell,
              type: selectedZone.type,
              density: selectedZone.density,
              building: selectedZone.type,
            };
          }
        }
      } else if (cell.x >= xMin && cell.x <= xMax && cell.y >= yMin && cell.y <= yMax) {
        newDraggedCells.push({ x: cell.x, y: cell.y });
        return {
          ...cell,
          type: selectedZone.type,
          density: selectedZone.density,
          building: selectedZone.type,
        };
      }
      return cell;
    });

    setTempCells(newTempCells);
    setDraggedCells(newDraggedCells);
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

  const isDraggedCell = (x: number, y: number) => {
    return draggedCells.some(cell => cell.x === x && cell.y === y);
  };

  return (
    <>
      {tempCells.map((cell) => (
        <React.Fragment key={`${cell.x}-${cell.y}`}>
          <GridSquare
            position={[cell.x + CELL_SIZE / 2, -0.1, cell.y + CELL_SIZE / 2]}
            onMouseDown={(event) => handleMouseDown(cell.x, cell.y, event)}
            onMouseEnter={() => handleMouseEnter(cell.x, cell.y)}
            onMouseUp={handleMouseUp}
            color={getColor(cell, currentSelected)}
          />
          {(!isDraggedCell(cell.x, cell.y)) && cell.building && (
            <CitySprite
              imageUrl={getBuildingTexture(cell.building)}
              position={[cell.x + CELL_SIZE / 2, 1, cell.y + CELL_SIZE / 2]}
              scale={1}
              GRID_SIZE={GRID_SIZE}
              GRID_DIVISIONS={GRID_DIVISIONS}
            />
          )}
        </React.Fragment>
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
        <OrthographicCamera ref={cameraRef} position={[0, 200, 0]} near={-500} far={500} zoom={50} makeDefault />
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
