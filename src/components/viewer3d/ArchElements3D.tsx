import React from 'react';
import { ArchitecturalElement } from '../../types';

interface ArchElements3DProps {
  elements: ArchitecturalElement[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const ArchElements3D: React.FC<ArchElements3DProps> = ({
  elements,
  selectedId,
  onSelect,
}) => {
  return (
    <group>
      {elements.map((el) => {
        const { id, type, width, height, depth, x, y, z, rotation } = el;
        const W = width / 1000;
        const H = height / 1000;
        const D = depth / 1000;
        const posX = (x + width / 2) / 1000;
        const posZ = (y + depth / 2) / 1000;
        const posY = (z + height / 2) / 1000;
        const rotRad = (-rotation * Math.PI) / 180;
        const isSelected = selectedId === id;

        return (
          <group
            key={id}
            position={[posX, posY, posZ]}
            rotation={[0, rotRad, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(id);
            }}
          >
            {/* WINDOW */}
            {type === 'window' && (
              <group>
                {/* Frame */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[W, H, D]} />
                  <meshStandardMaterial color="#f8fafc" roughness={0.5} />
                </mesh>
                {/* Glass Panes */}
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[W - 0.08, H - 0.08, 0.01]} />
                  <meshPhysicalMaterial
                    color="#bae6fd"
                    transparent
                    opacity={0.4}
                    roughness={0.05}
                    transmission={0.9}
                    ior={1.5}
                  />
                </mesh>
              </group>
            )}

            {/* DOOR */}
            {type === 'door' && (
              <group>
                {/* Outer Frame */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[W, H, D]} />
                  <meshStandardMaterial color="#f8fafc" roughness={0.6} />
                </mesh>
                {/* Door Panel */}
                <mesh position={[0, 0, 0]} castShadow>
                  <boxGeometry args={[W - 0.06, H - 0.04, 0.04]} />
                  <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
                </mesh>
                {/* Door Lever Handle */}
                <mesh position={[W * 0.35, 0, 0.03]} castShadow>
                  <boxGeometry args={[0.12, 0.02, 0.05]} />
                  <meshStandardMaterial color="#09090b" metalness={0.8} roughness={0.2} />
                </mesh>
              </group>
            )}

            {/* COLUMN */}
            {type === 'column' && (
              <mesh castShadow receiveShadow>
                <boxGeometry args={[W, H, D]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.8} />
              </mesh>
            )}

            {/* BEAM */}
            {type === 'beam' && (
              <mesh castShadow receiveShadow>
                <boxGeometry args={[W, H, D]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
              </mesh>
            )}

            {/* PIPE */}
            {type === 'pipe' && (
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[W / 2, W / 2, H, 24]} />
                <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.3} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};
