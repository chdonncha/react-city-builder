import { useLoader, useThree } from '@react-three/fiber';
import React, { useEffect } from 'react';
import * as THREE from 'three';

interface CitySpriteProps {
  imageUrl: string;
  position: [number, number, number];
  scale: number;
  isFlat?: boolean;
  GRID_SIZE: number;
  GRID_DIVISIONS: number;
}

const CitySprite: React.FC<CitySpriteProps> = ({ imageUrl, position, scale, GRID_SIZE, GRID_DIVISIONS }) => {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const { scene } = useThree();
  const CELL_SIZE = GRID_SIZE / GRID_DIVISIONS;

  useEffect(() => {
    const geometry = new THREE.PlaneGeometry(CELL_SIZE, CELL_SIZE);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5, // enable semi-transparency
    });

    const object3D = new THREE.Mesh(geometry, material);
    object3D.rotation.x = -Math.PI / 2;
    object3D.position.set(position[0], position[1], position[2]);

    scene.add(object3D);

    return () => {
      material.dispose();
      texture.dispose();
      scene.remove(object3D);
    };
  }, [texture, scene, position, scale, CELL_SIZE]);

  return null;
};

export { CitySprite };
