import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useRef, useState } from 'react';
import * as THREE from 'three';

import { BuildMenu } from '../BuildMenu/BuildMenu';
import { GridAndAxes } from '../Grid/GridAndAxes';
import { RotateButtons } from '../RotateButtons/RotateButtons';

const RenderGrid: React.FC = () => {
  const GRID_SIZE = 200;
  const GRID_DIVISIONS = 50;
  const TILE_SIZE = GRID_SIZE / GRID_DIVISIONS;

  const generateRandomMap = (size) => {
    const map = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(Math.random() < 0.5 ? 'grass' : 'water');
      }
      map.push(row);
    }
    return map;
  };

  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [selectedZone, setSelectedZone] = useState<{ type: string | null; density: string | null }>({
    type: null,
    density: null,
  });
  const [currentSelected, setCurrentSelected] = useState<{ x: number; y: number } | null>(null);
  const [map, setMap] = useState(generateRandomMap(GRID_DIVISIONS));

  const toggleGridVisibility = () => setShowGrid(!showGrid);
  const toggleAxesVisibility = () => setShowAxes(!showAxes);
  const handleSelectZone = (type: string, density: string) => setSelectedZone({ type, density });
  const handleSelectRoad = () => setSelectedZone({ type: 'road', density: null });

  const orbitControlsRef = useRef(null);
  const cameraRef = useRef<THREE.OrthographicCamera>(null);

  const rotateCamera = (angleDegrees: number) => {
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
      <RotateButtons rotateCamera={rotateCamera} />
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
        <GridAndAxes
          showGrid={showGrid}
          showAxes={showAxes}
          selectedZone={selectedZone}
          currentSelected={currentSelected}
          setCurrentSelected={setCurrentSelected}
          map={map}
        />
        <OrbitControls ref={orbitControlsRef} enableRotate={false} enableZoom={true} enablePan={true} />
      </Canvas>
    </>
  );
};

export { RenderGrid };
