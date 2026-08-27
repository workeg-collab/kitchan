import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CabinetItem, MaterialFinishes, CountertopConfig, PlinthConfig } from '../../types';
import { getItemBoundingBox } from '../../utils/cadGeometry';

interface Cabinet3DProps {
  cabinet: CabinetItem;
  materials: MaterialFinishes;
  countertop: CountertopConfig;
  plinth: PlinthConfig;
  isOpenDoors?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const Cabinet3D: React.FC<Cabinet3DProps> = ({
  cabinet,
  materials,
  countertop,
  plinth,
  isOpenDoors = false,
  isSelected = false,
  onSelect,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);

  const W = cabinet.width / 1000;
  const H = cabinet.height / 1000;
  const D = cabinet.depth / 1000;

  const bbox = getItemBoundingBox(cabinet.x, cabinet.y, cabinet.width, cabinet.depth, cabinet.rotation);
  const X = bbox.centerX / 1000;
  const Y = (cabinet.z + cabinet.height / 2) / 1000;
  const Z = bbox.centerY / 1000;

  const isBed = cabinet.category === 'bed' || cabinet.type.startsWith('bed-');
  const isNightstand = cabinet.category === 'nightstand';
  const isDresser = cabinet.category === 'dresser';
  const isWardrobe = cabinet.category === 'wardrobe' || cabinet.category === 'closet-internals';
  const isLibrary = cabinet.category === 'library-full' || cabinet.category === 'bookshelf' || cabinet.category === 'tv-media';
  const isKitchenBase = cabinet.category === 'base';

  // Smooth Door Opening Animation
  useFrame((_, delta) => {
    const targetAngle = isOpenDoors ? Math.PI / 2.2 : 0;
    if (leftDoorRef.current) {
      leftDoorRef.current.rotation.y = THREE.MathUtils.damp(leftDoorRef.current.rotation.y, -targetAngle, 6, delta);
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.rotation.y = THREE.MathUtils.damp(rightDoorRef.current.rotation.y, targetAngle, 6, delta);
    }
  });

  const bodyColor = cabinet.materialBody || materials.bodyColor || '#cbd5e1';
  const frontColor = cabinet.materialFront || materials.frontColor || '#f8fafc';
  const topColor = materials.countertopColor || '#f8fafc';
  const selectionHighlight = isSelected ? '#3b82f6' : undefined;

  return (
    <group
      ref={groupRef}
      position={[X, Y, Z]}
      rotation={[0, (-cabinet.rotation * Math.PI) / 180, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* 1. BED 3D MODEL */}
      {isBed ? (
        <group>
          {/* Bed Base Frame */}
          <mesh position={[0, -H / 2 + 0.18, 0]} castShadow receiveShadow>
            <boxGeometry args={[W, 0.36, D]} />
            <meshStandardMaterial color={frontColor} roughness={0.6} />
          </mesh>

          {/* Mattress */}
          <mesh position={[0, -H / 2 + 0.36 + 0.12, 0.05]} castShadow receiveShadow>
            <boxGeometry args={[W - 0.1, 0.24, D - 0.15]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>

          {/* Headboard */}
          <mesh position={[0, 0.1, -D / 2 + 0.05]} castShadow receiveShadow>
            <boxGeometry args={[W + 0.1, H, 0.1]} />
            <meshStandardMaterial color={selectionHighlight || frontColor} roughness={0.5} />
          </mesh>

          {/* Pillows */}
          <mesh position={[-W / 4, -H / 2 + 0.52, -D / 2 + 0.4]} rotation={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.55, 0.12, 0.4]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
          </mesh>
          <mesh position={[W / 4, -H / 2 + 0.52, -D / 2 + 0.4]} rotation={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.55, 0.12, 0.4]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
          </mesh>
        </group>
      ) : isDresser && cabinet.hasMirror ? (
        /* 2. DRESSER WITH VERTICAL MIRROR */
        <group>
          {/* Dresser Cabinet Body */}
          <mesh position={[0, -H / 2 + 0.425, 0]} castShadow receiveShadow>
            <boxGeometry args={[W, 0.85, D]} />
            <meshStandardMaterial color={bodyColor} roughness={0.6} />
          </mesh>

          {/* Mirror Frame & Glass */}
          <mesh position={[0, 0.45, -D / 2 + 0.02]} castShadow>
            <boxGeometry args={[W * 0.75, 0.9, 0.03]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ) : (
        /* 3. STANDARD MODULAR CARCASE (Kitchen, Wardrobes, Libraries) */
        <group>
          {/* Left Side Panel */}
          <mesh position={[-W / 2 + 0.009, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.018, H, D]} />
            <meshStandardMaterial color={bodyColor} roughness={0.6} />
          </mesh>

          {/* Right Side Panel */}
          <mesh position={[W / 2 - 0.009, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.018, H, D]} />
            <meshStandardMaterial color={bodyColor} roughness={0.6} />
          </mesh>

          {/* Bottom Panel */}
          <mesh position={[0, -H / 2 + 0.009, 0]} castShadow receiveShadow>
            <boxGeometry args={[W - 0.036, 0.018, D]} />
            <meshStandardMaterial color={bodyColor} roughness={0.6} />
          </mesh>

          {/* Top Panel (or Rails) */}
          <mesh position={[0, H / 2 - 0.009, 0]} castShadow receiveShadow>
            <boxGeometry args={[W - 0.036, 0.018, D]} />
            <meshStandardMaterial color={bodyColor} roughness={0.6} />
          </mesh>

          {/* Back Panel */}
          <mesh position={[0, 0, -D / 2 + 0.015]} receiveShadow>
            <boxGeometry args={[W - 0.036, H - 0.036, 0.006]} />
            <meshStandardMaterial color={bodyColor} roughness={0.7} />
          </mesh>

          {/* Shelves */}
          {cabinet.shelfCount > 0 &&
            Array.from({ length: Math.min(cabinet.shelfCount, 6) }).map((_, idx) => {
              const sy = -H / 2 + ((idx + 1) * H) / (Math.min(cabinet.shelfCount, 6) + 1);
              return (
                <mesh key={idx} position={[0, sy, 0]} castShadow receiveShadow>
                  <boxGeometry args={[W - 0.036, 0.018, D - 0.02]} />
                  <meshStandardMaterial color={bodyColor} roughness={0.6} />
                </mesh>
              );
            })}

          {/* Wardrobe Hanging Rails */}
          {cabinet.hasHangingRail && (
            <mesh position={[0, H / 2 - 0.25, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, W - 0.04, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
            </mesh>
          )}

          {/* Kitchen Base Countertop */}
          {isKitchenBase && countertop.enabled && (
            <mesh position={[0, H / 2 + (countertop.thickness / 2000), (countertop.overhangFront / 2000)]} castShadow receiveShadow>
              <boxGeometry args={[W + (countertop.overhangSides * 2 / 1000), countertop.thickness / 1000, D + (countertop.overhangFront / 1000)]} />
              <meshStandardMaterial color={topColor} roughness={0.3} metalness={0.1} />
            </mesh>
          )}

          {/* Doors & Fronts */}
          {cabinet.doorCount === 1 && (
            <group ref={leftDoorRef} position={[-W / 2 + 0.009, 0, D / 2 + 0.009]}>
              <mesh position={[W / 2 - 0.009, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[W - 0.004, H - 0.004, 0.018]} />
                <meshStandardMaterial color={selectionHighlight || frontColor} roughness={0.5} />
              </mesh>
            </group>
          )}

          {cabinet.doorCount >= 2 && cabinet.doorType !== 'open' && (
            <>
              {/* Left Door */}
              <group ref={leftDoorRef} position={[-W / 2 + 0.009, 0, D / 2 + 0.009]}>
                <mesh position={[W / 4 - 0.009, 0, 0]} castShadow receiveShadow>
                  <boxGeometry args={[W / 2 - 0.004, H - 0.004, 0.018]} />
                  <meshStandardMaterial color={selectionHighlight || frontColor} roughness={0.5} />
                </mesh>
              </group>
              {/* Right Door */}
              <group ref={rightDoorRef} position={[W / 2 - 0.009, 0, D / 2 + 0.009]}>
                <mesh position={[-W / 4 + 0.009, 0, 0]} castShadow receiveShadow>
                  <boxGeometry args={[W / 2 - 0.004, H - 0.004, 0.018]} />
                  <meshStandardMaterial color={selectionHighlight || frontColor} roughness={0.5} />
                </mesh>
              </group>
            </>
          )}
        </group>
      )}

      {/* Selection Bounding Box Outline */}
      {isSelected && (
        <lineSegments position={[0, 0, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(W + 0.02, H + 0.02, D + 0.02)]} />
          <lineBasicMaterial color="#2563eb" linewidth={2} />
        </lineSegments>
      )}
    </group>
  );
};
