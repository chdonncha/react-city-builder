import React, { useEffect } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CitySpriteProps {
  imageUrl: string;
  position: [number, number, number];
  scale: number;
  isFlat?: boolean;
}

const CitySprite: React.FC<CitySpriteProps> = ({ imageUrl, position, scale, isFlat = false }) => {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const { scene } = useThree();

  useEffect(() => {
    let object3D;
    if (isFlat) {
      // Use PlaneGeometry for roads
      const geometry = new THREE.PlaneGeometry(scale, scale);
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      object3D = new THREE.Mesh(geometry, material);
      object3D.rotation.x = -Math.PI / 2;
      object3D.position.set(position[0], 0, position[2]);
    } else {
      // Use Sprite for buildings
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      object3D = new THREE.Sprite(spriteMaterial);
      object3D.scale.set(scale, scale, 1);
      object3D.position.set(...position);
    }
    scene.add(object3D);

    return () => {
      if (object3D.material) object3D.material.dispose();
      texture.dispose();
      scene.remove(object3D);
    };
  }, [texture, scene, position, scale, isFlat]);

  return null;
};

export { CitySprite };
