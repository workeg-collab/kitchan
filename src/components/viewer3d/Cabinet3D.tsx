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
  const flapDoorRef = useRef<THREE.Group>(null);

  const W = cabinet.width / 1000;
  const H = cabinet.height / 1000;
  const D = cabinet.depth / 1000;

  const bbox = getItemBoundingBox(cabinet.x, cabinet.y, cabinet.width, cabinet.depth, cabinet.rotation);
  const X = bbox.centerX / 1000;
  const Y = (cabinet.z + cabinet.height / 2) / 1000;
  const Z = bbox.centerY / 1000;

  const isBed = cabinet.category === 'bed' || cabinet.type.startsWith('bed-');
  const isSofa = cabinet.category === 'sofa' || cabinet.type.startsWith('living-sofa');
  const isCoffeeTable = cabinet.category === 'coffee-table' || cabinet.type === 'living-coffee-table';
  const isDiningTable = cabinet.category === 'dining-table' || cabinet.type === 'dining-table-6seat';
  const isTvSlatWall = cabinet.type === 'living-tv-slat-wall' || cabinet.category === 'tv-wall';
  const isPlant = cabinet.category === 'accent' || cabinet.type === 'accent-indoor-plant';
  const isKitchenBase = cabinet.category === 'base' || cabinet.category === 'island';
  const isFixedDoor = cabinet.doorType === 'fixed';
  const isFlapDoor = !isFixedDoor && (cabinet.flipUpDoor || cabinet.doorHinge === 'top' || cabinet.type.includes('loft') || cabinet.type.includes('lift-up') || cabinet.type.includes('aventos'));
  const isGlassVitrine = cabinet.hasGlassDoors || cabinet.doorType === 'glass-frame' || cabinet.type === 'wall-glass-vitrine' || cabinet.type.includes('glass');

  // Smooth Door Opening Animation
  useFrame((_, delta) => {
    const targetAngle = (isOpenDoors && !isFixedDoor) ? Math.PI / 2.2 : 0;
    const targetFlapAngle = (isOpenDoors && !isFixedDoor) ? -Math.PI / 2.5 : 0;

    if (leftDoorRef.current) {
      leftDoorRef.current.rotation.y = THREE.MathUtils.damp(leftDoorRef.current.rotation.y, -targetAngle, 6, delta);
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.rotation.y = THREE.MathUtils.damp(rightDoorRef.current.rotation.y, targetAngle, 6, delta);
    }
    if (flapDoorRef.current) {
      flapDoorRef.current.rotation.x = THREE.MathUtils.damp(flapDoorRef.current.rotation.x, targetFlapAngle, 6, delta);
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
          <mesh position={[-W / 4, -H / 2 + 0.52, -D / 2 + 0.35]} rotation={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[W / 2.5, 0.12, 0.4]} />
            <meshStandardMaterial color="#f1f5f9" />
          </mesh>
          <mesh position={[W / 4, -H / 2 + 0.52, -D / 2 + 0.35]} rotation={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[W / 2.5, 0.12, 0.4]} />
            <meshStandardMaterial color="#f1f5f9" />
          </mesh>
        </group>
      ) : isSofa ? (
        /* 2. LIVING SOFA 3D MODEL */
        <group>
          {/* Base Seating Cushion */}
          <mesh position={[0, -H / 2 + 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[W, 0.3, D]} />
            <meshStandardMaterial color={selectionHighlight || '#334155'} roughness={0.8} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.1, -D / 2 + 0.15]} castShadow receiveShadow>
            <boxGeometry args={[W, H * 0.7, 0.25]} />
            <meshStandardMaterial color={selectionHighlight || '#334155'} roughness={0.8} />
          </mesh>
          {/* Left Armrest */}
          <mesh position={[-W / 2 + 0.1, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.2, H * 0.55, D]} />
            <meshStandardMaterial color={selectionHighlight || '#334155'} roughness={0.8} />
          </mesh>
          {/* Right Armrest */}
          <mesh position={[W / 2 - 0.1, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.2, H * 0.55, D]} />
            <meshStandardMaterial color={selectionHighlight || '#334155'} roughness={0.8} />
          </mesh>
        </group>
      ) : isCoffeeTable || isDiningTable ? (
        /* 3. COFFEE & DINING TABLES */
        <group>
          {/* Tabletop */}
          <mesh position={[0, H / 2 - 0.02, 0]} castShadow receiveShadow>
            <boxGeometry args={[W, 0.04, D]} />
            <meshStandardMaterial color={topColor} roughness={0.25} metalness={0.1} />
          </mesh>
          {/* 4 Legs */}
          {[-W / 2 + 0.08, W / 2 - 0.08].map((lx, i) =>
            [-D / 2 + 0.08, D / 2 - 0.08].map((lz, j) => (
              <mesh key={`${i}-${j}`} position={[lx, 0, lz]} castShadow receiveShadow>
                <cylinderGeometry args={[0.025, 0.02, H - 0.04, 16]} />
                <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
              </mesh>
            ))
          )}
        </group>
      ) : isTvSlatWall ? (
        /* 4. SLAT ACCENT TV WALL PANEL */
        <group>
          {/* Back Panel */}
          <mesh position={[0, 0, -D / 2 + 0.02]} receiveShadow>
            <boxGeometry args={[W, H, 0.02]} />
            <meshStandardMaterial color={bodyColor} roughness={0.7} />
          </mesh>
          {/* Vertical Wood Slats */}
          {Array.from({ length: Math.floor(W / 0.08) }).map((_, idx) => {
            const sx = -W / 2 + 0.04 + idx * 0.08;
            return (
              <mesh key={idx} position={[sx, 0, -D / 2 + 0.04]} castShadow receiveShadow>
                <boxGeometry args={[0.035, H, 0.025]} />
                <meshStandardMaterial color={frontColor} roughness={0.6} />
              </mesh>
            );
          })}
          {/* Floating Lower Media Credenza */}
          <mesh position={[0, -H / 2 + 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[W * 0.9, 0.35, D]} />
            <meshStandardMaterial color={selectionHighlight || frontColor} roughness={0.5} />
          </mesh>
        </group>
      ) : isPlant ? (
        /* 5. DECORATIVE INDOOR PLANT */
        <group>
          {/* Ceramic Pot */}
          <mesh position={[0, -H / 2 + 0.25, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.18, 0.14, 0.5, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          {/* Green Plant Foliage */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#1b4332" roughness={0.8} />
          </mesh>
        </group>
      ) : (
        /* 6. STANDARD CABINET / DRESSING / LOFT / DRAWER 3D MODEL */
        <group>
          {/* Left Carcase Side */}
          <mesh position={[-W / 2 + 0.009, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.018, H, D]} />
            <meshStandardMaterial color={bodyColor} roughness={0.6} />
          </mesh>

          {/* Right Carcase Side */}
          <mesh position={[W / 2 - 0.009, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.018, H, D]} />
            <meshStandardMaterial color={bodyColor} roughness={0.6} />
          </mesh>

          {/* Bottom Panel */}
          <mesh position={[0, -H / 2 + 0.009, 0]} castShadow receiveShadow>
            <boxGeometry args={[W - 0.036, 0.018, D]} />
            <meshStandardMaterial color={bodyColor} roughness={0.6} />
          </mesh>

          {/* Top Panel */}
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

          {/* Kitchen Base / Island Countertop */}
          {isKitchenBase && countertop.enabled && (
            <mesh position={[0, H / 2 + countertop.thickness / 2000, countertop.overhangFront / 2000]} castShadow receiveShadow>
              <boxGeometry args={[W + (countertop.overhangSides * 2) / 1000, countertop.thickness / 1000, D + countertop.overhangFront / 1000]} />
              <meshStandardMaterial color={topColor} roughness={0.25} metalness={0.1} />
            </mesh>
          )}

          {/* --- A) FLIP-UP / LIFT-UP CEILING LOFT DOORS --- */}
          {isFlapDoor && (
            <group ref={flapDoorRef} position={[0, H / 2 - 0.009, D / 2 + 0.009]}>
              <mesh position={[0, -H / 2 + 0.009, 0]} castShadow receiveShadow>
                <boxGeometry args={[W - 0.004, H - 0.004, 0.018]} />
                <meshStandardMaterial color={selectionHighlight || frontColor} roughness={0.5} />
              </mesh>
              {/* Bottom Edge Metal Pull Handle */}
              <mesh position={[0, -H + 0.04, 0.012]} castShadow>
                <boxGeometry args={[W * 0.4, 0.015, 0.018]} />
                <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          )}

          {/* --- B) MULTIPLE DRAWERS FRONT FACADES --- */}
          {cabinet.drawerCount > 0 && !isFlapDoor && (
            <group position={[0, 0, D / 2 + 0.009]}>
              {Array.from({ length: cabinet.drawerCount }).map((_, i) => {
                const drawerH = (H - 0.004 * cabinet.drawerCount) / cabinet.drawerCount;
                const drawerY = -H / 2 + drawerH / 2 + i * (drawerH + 0.004);
                return (
                  <group key={i} position={[0, drawerY, 0]}>
                    <mesh castShadow receiveShadow>
                      <boxGeometry args={[W - 0.004, drawerH - 0.003, 0.018]} />
                      <meshStandardMaterial color={selectionHighlight || frontColor} roughness={0.5} />
                    </mesh>
                    {/* Metal Handle on Drawer */}
                    <mesh position={[0, 0, 0.012]} castShadow>
                      <boxGeometry args={[Math.min(W * 0.35, 0.2), 0.012, 0.018]} />
                      <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
                    </mesh>
                  </group>
                );
              })}
            </group>
          )}

          {/* --- C) FIXED FRONT DOOR / ARCHITECTURAL PANEL (ضلفة ثابتة لا تفتح) --- */}
          {isFixedDoor && cabinet.doorCount > 0 && cabinet.drawerCount === 0 && (
            <group position={[0, 0, D / 2 + 0.009]}>
              {cabinet.doorCount === 1 ? (
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[W - 0.004, H - 0.004, 0.018]} />
                  <meshStandardMaterial color={selectionHighlight || frontColor} roughness={0.5} />
                </mesh>
              ) : (
                Array.from({ length: cabinet.doorCount }).map((_, i) => {
                  const dW = (W - 0.004 * cabinet.doorCount) / cabinet.doorCount;
                  const dX = -W / 2 + dW / 2 + i * (dW + 0.004);
                  return (
                    <mesh key={i} position={[dX, 0, 0]} castShadow receiveShadow>
                      <boxGeometry args={[dW - 0.002, H - 0.004, 0.018]} />
                      <meshStandardMaterial color={selectionHighlight || frontColor} roughness={0.5} />
                    </mesh>
                  );
                })
              )}
            </group>
          )}

          {/* --- D) SINGLE HINGED DOOR (ضلفة مفردة) --- */}
          {!isFixedDoor && cabinet.doorCount === 1 && cabinet.drawerCount === 0 && !isFlapDoor && cabinet.doorType !== 'open' && (
            <group ref={leftDoorRef} position={[-W / 2 + 0.009, 0, D / 2 + 0.009]}>
              <mesh position={[W / 2 - 0.009, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[W - 0.004, H - 0.004, 0.018]} />
                {isGlassVitrine ? (
                  <meshPhysicalMaterial color="#94a3b8" transmission={0.7} opacity={0.6} transparent roughness={0.1} />
                ) : (
                  <meshStandardMaterial color={selectionHighlight || frontColor} roughness={0.5} />
                )}
              </mesh>
              {/* Handle */}
              <mesh position={[W - 0.05, 0, 0.012]} castShadow>
                <boxGeometry args={[0.015, 0.18, 0.018]} />
                <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          )}

          {/* --- E) DOUBLE HINGED DOORS / GLASS VITRINE (ضلفتين) --- */}
          {!isFixedDoor && cabinet.doorCount === 2 && cabinet.drawerCount === 0 && !isFlapDoor && cabinet.doorType !== 'open' && (
            <>
              {/* Left Door */}
              <group ref={leftDoorRef} position={[-W / 2 + 0.009, 0, D / 2 + 0.009]}>
                <mesh position={[W / 4 - 0.009, 0, 0]} castShadow receiveShadow>
                  <boxGeometry args={[W / 2 - 0.004, H - 0.004, 0.018]} />
                  {isGlassVitrine ? (
                    <meshPhysicalMaterial color="#94a3b8" transmission={0.7} opacity={0.6} transparent roughness={0.1} />
                  ) : (
                    <meshStandardMaterial color={selectionHighlight || frontColor} roughness={0.5} />
                  )}
                </mesh>
                {/* Left Door Handle */}
                <mesh position={[W / 2 - 0.035, 0, 0.012]} castShadow>
                  <boxGeometry args={[0.012, 0.16, 0.018]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
                </mesh>
              </group>

              {/* Right Door */}
              <group ref={rightDoorRef} position={[W / 2 - 0.009, 0, D / 2 + 0.009]}>
                <mesh position={[-W / 4 + 0.009, 0, 0]} castShadow receiveShadow>
                  <boxGeometry args={[W / 2 - 0.004, H - 0.004, 0.018]} />
                  {isGlassVitrine ? (
                    <meshPhysicalMaterial color="#94a3b8" transmission={0.7} opacity={0.6} transparent roughness={0.1} />
                  ) : (
                    <meshStandardMaterial color={selectionHighlight || frontColor} roughness={0.5} />
                  )}
                </mesh>
                {/* Right Door Handle */}
                <mesh position={[-W / 2 + 0.035, 0, 0.012]} castShadow>
                  <boxGeometry args={[0.012, 0.16, 0.018]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
                </mesh>
              </group>
            </>
          )}

          {/* --- F) 3 OR 4 DOORS (3 أو 4 ضلف) --- */}
          {!isFixedDoor && cabinet.doorCount >= 3 && cabinet.drawerCount === 0 && !isFlapDoor && cabinet.doorType !== 'open' && (
            <group position={[0, 0, D / 2 + 0.009]}>
              {Array.from({ length: cabinet.doorCount }).map((_, i) => {
                const dW = (W - 0.004 * cabinet.doorCount) / cabinet.doorCount;
                const dX = -W / 2 + dW / 2 + i * (dW + 0.004);
                return (
                  <group key={i} position={[dX, 0, 0]}>
                    <mesh castShadow receiveShadow>
                      <boxGeometry args={[dW - 0.003, H - 0.004, 0.018]} />
                      {isGlassVitrine ? (
                        <meshPhysicalMaterial color="#94a3b8" transmission={0.7} opacity={0.6} transparent roughness={0.1} />
                      ) : (
                        <meshStandardMaterial color={selectionHighlight || frontColor} roughness={0.5} />
                      )}
                    </mesh>
                    {/* Handle */}
                    <mesh position={[i % 2 === 0 ? dW / 2 - 0.025 : -dW / 2 + 0.025, 0, 0.012]} castShadow>
                      <boxGeometry args={[0.012, 0.16, 0.018]} />
                      <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
                    </mesh>
                  </group>
                );
              })}
            </group>
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
