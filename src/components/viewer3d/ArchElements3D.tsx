import React from 'react';
import { ArchitecturalElement } from '../../types';
import { getItemBoundingBox } from '../../utils/cadGeometry';

interface ArchElements3DProps {
  elements: ArchitecturalElement[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export const ArchElements3D: React.FC<ArchElements3DProps> = ({
  elements,
  selectedId = null,
  onSelect,
}) => {
  return (
    <group>
      {elements.map((el) => {
        const { id, type, width, height, depth, x, y, z, rotation } = el;
        const W = width / 1000;
        const H = height / 1000;
        const D = depth / 1000;
        const rotRad = (-rotation * Math.PI) / 180;
        const normRot = ((rotation % 360) + 360) % 360;
        const isSelected = selectedId === id;

        // Position calculation: Doors and Windows are embedded directly INSIDE the wall thickness
        let posX = 0;
        let posZ = 0;
        const posY = (z + height / 2) / 1000;

        if (type === 'door' || type === 'window') {
          if (normRot === 0) {
            // Wall A (Top): Frame is centered inside Wall A thickness at Z = -D / 2
            posX = (x + width / 2) / 1000;
            posZ = -D / 2;
          } else if (normRot === 90) {
            // Wall B (Right): Frame is centered inside Wall B thickness at X = x + D / 2
            posX = (x + depth / 2) / 1000;
            posZ = (y + width / 2) / 1000;
          } else if (normRot === 180) {
            // Wall C (Bottom): Frame is centered inside Wall C thickness at Z = y + D / 2
            posX = (x - width / 2) / 1000;
            posZ = (y + depth / 2) / 1000;
          } else if (normRot === 270) {
            // Wall D (Left): Frame is centered inside Wall D thickness at X = -D / 2
            posX = -D / 2;
            posZ = (y - width / 2) / 1000;
          } else {
            const bbox = getItemBoundingBox(x, y, width, depth, rotation);
            posX = bbox.centerX / 1000;
            posZ = bbox.centerY / 1000;
          }
        } else {
          // Columns, Beams, Pipes
          const bbox = getItemBoundingBox(x, y, width, depth, rotation);
          posX = bbox.centerX / 1000;
          posZ = bbox.centerY / 1000;
        }

        return (
          <group
            key={id}
            position={[posX, posY, posZ]}
            rotation={[0, rotRad, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(id);
            }}
          >
            {/* WINDOW (Embedded inside Wall Thickness) */}
            {type === 'window' && (
              <group>
                {/* Outer Jambs & Sills Frame */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[W, H, D + 0.02]} />
                  <meshStandardMaterial color="#f8fafc" roughness={0.4} />
                </mesh>
                {/* Glass Panes */}
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[W - 0.08, H - 0.08, 0.012]} />
                  <meshPhysicalMaterial
                    color="#bae6fd"
                    transparent
                    opacity={0.45}
                    roughness={0.05}
                    transmission={0.9}
                    ior={1.5}
                  />
                </mesh>
                {/* Interior Marble Sill */}
                <mesh position={[0, -H / 2 + 0.015, D / 2 + 0.02]} castShadow>
                  <boxGeometry args={[W + 0.06, 0.03, 0.08]} />
                  <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
                </mesh>
              </group>
            )}

            {/* DOOR (Embedded inside Wall Thickness with Swing Leaf) */}
            {type === 'door' && (
              <group>
                {/* Outer Wall Door Frame */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[W, H, D + 0.02]} />
                  <meshStandardMaterial color="#f8fafc" roughness={0.6} />
                </mesh>
                {/* Door Panel */}
                <mesh position={[0, 0, 0]} castShadow>
                  <boxGeometry args={[W - 0.06, H - 0.04, 0.045]} />
                  <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
                </mesh>
                {/* Door Lever Handle */}
                <mesh position={[W * 0.35, 0, 0.035]} castShadow>
                  <boxGeometry args={[0.12, 0.02, 0.05]} />
                  <meshStandardMaterial color="#09090b" metalness={0.85} roughness={0.2} />
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
