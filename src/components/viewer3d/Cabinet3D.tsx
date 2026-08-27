import React, { useRef } from 'react';
import { CabinetItem, MaterialFinishes, CountertopConfig, PlinthConfig } from '../../types';
import * as THREE from 'three';

interface Cabinet3DProps {
  cabinet: CabinetItem;
  materials: MaterialFinishes;
  countertop: CountertopConfig;
  plinth: PlinthConfig;
  isOpenDoors: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export const Cabinet3D: React.FC<Cabinet3DProps> = ({
  cabinet,
  materials,
  countertop,
  plinth,
  isOpenDoors,
  isSelected,
  onSelect,
}) => {
  const {
    id,
    category,
    type,
    width,
    height,
    depth,
    x,
    y,
    z,
    rotation,
    shelfCount,
    doorCount,
    drawerCount,
    doorHinge,
    isOpen: itemIsOpen,
  } = cabinet;

  const openState = isOpenDoors || !!itemIsOpen;

  // Scale mm to 3D Three.js units (1 unit = 1 meter = 1000 mm)
  const W = width / 1000;
  const H = height / 1000;
  const D = depth / 1000;
  const posX = (x + width / 2) / 1000;
  const posZ = (y + depth / 2) / 1000; // Y in 2D is Z in Three.js
  const posY = (z + height / 2) / 1000;

  const rotRad = (-rotation * Math.PI) / 180;
  const boardT = 0.018; // 18mm carcase

  // Material Colors
  const frontColor = materials.frontColor || '#f8fafc';
  const carcassColor = materials.bodyColor || '#cbd5e1';
  const worktopColor = materials.countertopColor || '#f8fafc';
  const handleColor = materials.handleColor || '#09090b';

  const isWall = category === 'wall';
  const isTall = category === 'tall';
  const isBase = category === 'base' || category === 'corner';

  return (
    <group
      position={[posX, posY, posZ]}
      rotation={[0, rotRad, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Selection Bounding Wireframe */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[W + 0.02, H + 0.02, D + 0.02]} />
          <meshBasicMaterial color="#38bdf8" wireframe />
        </mesh>
      )}

      {/* --- CARCASE BOX --- */}
      {/* Left Gable Panel */}
      <mesh position={[-W / 2 + boardT / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[boardT, H, D]} />
        <meshStandardMaterial color={carcassColor} roughness={0.6} />
      </mesh>

      {/* Right Gable Panel */}
      <mesh position={[W / 2 - boardT / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[boardT, H, D]} />
        <meshStandardMaterial color={carcassColor} roughness={0.6} />
      </mesh>

      {/* Bottom Panel */}
      <mesh position={[0, -H / 2 + boardT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W - 2 * boardT, boardT, D]} />
        <meshStandardMaterial color={carcassColor} roughness={0.6} />
      </mesh>

      {/* Top Panel (Full for Wall/Tall, Rails for Base) */}
      {isWall || isTall ? (
        <mesh position={[0, H / 2 - boardT / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[W - 2 * boardT, boardT, D]} />
          <meshStandardMaterial color={carcassColor} roughness={0.6} />
        </mesh>
      ) : (
        <>
          <mesh position={[0, H / 2 - boardT / 2, -D / 2 + 0.05]} castShadow>
            <boxGeometry args={[W - 2 * boardT, boardT, 0.1]} />
            <meshStandardMaterial color={carcassColor} roughness={0.6} />
          </mesh>
          <mesh position={[0, H / 2 - boardT / 2, D / 2 - 0.05]} castShadow>
            <boxGeometry args={[W - 2 * boardT, boardT, 0.1]} />
            <meshStandardMaterial color={carcassColor} roughness={0.6} />
          </mesh>
        </>
      )}

      {/* Back Panel */}
      <mesh position={[0, 0, -D / 2 + 0.015]} receiveShadow>
        <boxGeometry args={[W - 2 * boardT, H - 2 * boardT, 0.006]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
      </mesh>

      {/* Internal Adjustable Shelves */}
      {shelfCount > 0 &&
        Array.from({ length: shelfCount }).map((_, idx) => {
          const shelfY = -H / 2 + ((H - boardT) / (shelfCount + 1)) * (idx + 1);
          return (
            <mesh key={idx} position={[0, shelfY, 0.01]} receiveShadow>
              <boxGeometry args={[W - 2 * boardT - 0.002, boardT, D - 0.03]} />
              <meshStandardMaterial color={carcassColor} roughness={0.6} />
            </mesh>
          );
        })}

      {/* Plinth / Kickboard (for Base & Tall) */}
      {(isBase || isTall) && plinth.enabled && (
        <mesh position={[0, -H / 2 - (plinth.height / 2000), D / 2 - 0.05]} castShadow receiveShadow>
          <boxGeometry args={[W, plinth.height / 1000, 0.018]} />
          <meshStandardMaterial color={materials.handleColor || '#1e293b'} roughness={0.7} />
        </mesh>
      )}

      {/* Countertop Slice (for Base Cabinets) */}
      {isBase && countertop.enabled && (
        <mesh position={[0, H / 2 + countertop.thickness / 2000, countertop.overhangFront / 2000]} castShadow receiveShadow>
          <boxGeometry args={[W, countertop.thickness / 1000, D + countertop.overhangFront / 1000]} />
          <meshStandardMaterial color={worktopColor} roughness={0.25} metalness={0.1} />
        </mesh>
      )}

      {/* --- FRONT DOORS / DRAWERS --- */}
      {/* Drawers */}
      {drawerCount > 0 &&
        Array.from({ length: drawerCount }).map((_, idx) => {
          const drwH = (H - 0.003 * (drawerCount + 1)) / drawerCount;
          const drwY = -H / 2 + 0.003 + drwH / 2 + idx * (drwH + 0.003);
          const pullOutZ = openState ? 0.35 : 0;

          return (
            <group key={idx} position={[0, drwY, D / 2 + boardT / 2 + pullOutZ]}>
              {/* Drawer Front Panel */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[W - 0.004, drwH, boardT]} />
                <meshStandardMaterial color={frontColor} roughness={0.7} metalness={0.05} />
              </mesh>
              {/* Drawer Box (Visible when pulled out) */}
              {openState && (
                <mesh position={[0, 0, -D / 2]} castShadow>
                  <boxGeometry args={[W - 0.05, drwH - 0.04, D - 0.05]} />
                  <meshStandardMaterial color="#94a3b8" roughness={0.5} />
                </mesh>
              )}
              {/* Drawer Handle */}
              {materials.handleStyle !== 'handleless' && (
                <mesh position={[0, 0, boardT / 2 + 0.015]} castShadow>
                  <boxGeometry args={[0.16, 0.012, 0.025]} />
                  <meshStandardMaterial color={handleColor} metalness={0.8} roughness={0.2} />
                </mesh>
              )}
            </group>
          );
        })}

      {/* Single Door */}
      {doorCount === 1 && drawerCount === 0 && (
        <group
          position={[doorHinge === 'left' ? -W / 2 : W / 2, 0, D / 2 + boardT / 2]}
          rotation={[0, openState ? (doorHinge === 'left' ? -1.4 : 1.4) : 0, 0]}
        >
          {/* Door leaf pivoted around hinge side */}
          <mesh
            position={[doorHinge === 'left' ? W / 2 - 0.002 : -W / 2 + 0.002, 0, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[W - 0.004, H - 0.004, boardT]} />
            <meshStandardMaterial color={frontColor} roughness={0.7} metalness={0.05} />
          </mesh>

          {/* Handle */}
          {materials.handleStyle !== 'handleless' && (
            <mesh
              position={[
                doorHinge === 'left' ? W - 0.04 : -W + 0.04,
                isWall ? -H / 3 : H / 3,
                boardT / 2 + 0.015,
              ]}
              castShadow
            >
              <boxGeometry args={[0.015, 0.16, 0.025]} />
              <meshStandardMaterial color={handleColor} metalness={0.8} roughness={0.2} />
            </mesh>
          )}
        </group>
      )}

      {/* Double Doors */}
      {doorCount === 2 && drawerCount === 0 && (
        <>
          {/* Left Door */}
          <group
            position={[-W / 2, 0, D / 2 + boardT / 2]}
            rotation={[0, openState ? -1.4 : 0, 0]}
          >
            <mesh position={[W / 4 - 0.002, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[W / 2 - 0.004, H - 0.004, boardT]} />
              <meshStandardMaterial color={frontColor} roughness={0.7} metalness={0.05} />
            </mesh>
            {materials.handleStyle !== 'handleless' && (
              <mesh position={[W / 2 - 0.04, isWall ? -H / 3 : H / 3, boardT / 2 + 0.015]} castShadow>
                <boxGeometry args={[0.015, 0.16, 0.025]} />
                <meshStandardMaterial color={handleColor} metalness={0.8} roughness={0.2} />
              </mesh>
            )}
          </group>

          {/* Right Door */}
          <group
            position={[W / 2, 0, D / 2 + boardT / 2]}
            rotation={[0, openState ? 1.4 : 0, 0]}
          >
            <mesh position={[-W / 4 + 0.002, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[W / 2 - 0.004, H - 0.004, boardT]} />
              <meshStandardMaterial color={frontColor} roughness={0.7} metalness={0.05} />
            </mesh>
            {materials.handleStyle !== 'handleless' && (
              <mesh position={[-W / 2 + 0.04, isWall ? -H / 3 : H / 3, boardT / 2 + 0.015]} castShadow>
                <boxGeometry args={[0.015, 0.16, 0.025]} />
                <meshStandardMaterial color={handleColor} metalness={0.8} roughness={0.2} />
              </mesh>
            )}
          </group>
        </>
      )}
    </group>
  );
};
