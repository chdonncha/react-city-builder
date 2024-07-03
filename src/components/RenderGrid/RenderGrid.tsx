import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useRef, useState } from 'react';
import * as THREE from 'three';

import { generateRandomMap } from '../../utils/mapUtils'; // Adjust the path based on your actual folder structure
import { BuildMenu } from '../BuildMenu/BuildMenu';
import { GridAndAxes } from '../Grid/GridAndAxes';
import { RotateButtons } from '../RotateButtons/RotateButtons';
import { ShowGridButton } from '../ShowGridButton/ShowGridButton';

const RenderGrid: React.FC = () => {
  const GRID_DIVISIONS = 50;

  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(false);
  const [selectedZone, setSelectedZone] = useState<{ type: string | null; density: string | null }>({
    type: null,
    density: null,
  });
  const [currentSelected, setCurrentSelected] = useState<{ x: number; y: number } | null>(null);
  const [map] = useState(generateRandomMap(GRID_DIVISIONS));

  const toggleGridVisibility = () => setShowGrid(!showGrid);
  const toggleAxesVisibility = () => setShowAxes(!showAxes);
  const handleSelectAssembler = (level: number) => setSelectedZone({ type: `assembler${level}`, density: null });
  const handleSelectExcavator = (level: number) => setSelectedZone({ type: `excavator${level}`, density: null });
  const handleSelectConveyor = () => setSelectedZone({ type: 'conveyor', density: null });

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
      <ShowGridButton onToggleGridVisibility={toggleGridVisibility} showGrid={showGrid} />
      <RotateButtons rotateCamera={rotateCamera} />
      <BuildMenu
        onToggleGridVisibility={toggleGridVisibility}
        onToggleAxesVisibility={toggleAxesVisibility}
        onSelectAssembler={handleSelectAssembler}
        onSelectExcavator={handleSelectExcavator}
        onSelectConveyor={handleSelectConveyor}
        showGrid={showGrid}
        showAxes={showAxes}
      />
      <Canvas>
        <OrthographicCamera
          ref={cameraRef}
          position={[0, 200, 0]}
          near={-500}
          far={500}
          zoom={50}
          makeDefault
        />
        <GridAndAxes
          showGrid={showGrid}
          showAxes={showAxes}
          selectedZone={selectedZone}
          currentSelected={currentSelected}
          setCurrentSelected={setCurrentSelected}
          map={map}
        />
        <OrbitControls
          ref={orbitControlsRef}
          enableRotate={false}
          enableZoom={true}
          enablePan={true}
          minZoom={8}
          maxZoom={40}
        />
      </Canvas>
    </>
  );
};

export { RenderGrid };
