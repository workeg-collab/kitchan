import React from 'react';
import { RoomConfig, MaterialFinishes, BacksplashConfig } from '../../types';

interface Room3DProps {
  room: RoomConfig;
  materials: MaterialFinishes;
  backsplash: BacksplashConfig;
  isolatedWallId?: 'all' | 'wall-a' | 'wall-b' | 'wall-c' | 'wall-d' | null;
}

export const Room3D: React.FC<Room3DProps> = ({
  room,
  materials,
  backsplash,
  isolatedWallId = 'all',
}) => {
  const { width, length, ceilingHeight, wallThickness } = room;

  const W = width / 1000;
  const L = length / 1000;
  const H = ceilingHeight / 1000;
  const T = wallThickness / 1000;

  const floorColor = materials.floorColor || '#8c6843';
  const wallColor = materials.wallColor || '#f1f5f9';
  const splashColor = materials.backsplashColor || '#e2e8f0';

  const showWallA = !isolatedWallId || isolatedWallId === 'all' || isolatedWallId === 'wall-a';
  const showWallB = !isolatedWallId || isolatedWallId === 'all' || isolatedWallId === 'wall-b';
  const showWallC = isolatedWallId === 'wall-c' || isolatedWallId === 'all';
  const showWallD = !isolatedWallId || isolatedWallId === 'all' || isolatedWallId === 'wall-d';

  return (
    <group>
      {/* --- FLOOR --- */}
      <mesh
        position={[W / 2, 0, L / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[W, L]} />
        <meshStandardMaterial color={floorColor} roughness={0.4} metalness={0.05} />
      </mesh>

      {/* --- WALL A (BACK WALL at Z = 0) --- */}
      {showWallA && (
        <mesh position={[W / 2, H / 2, -T / 2]} receiveShadow>
          <boxGeometry args={[W + 2 * T, H, T]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>
      )}

      {/* --- WALL B (RIGHT WALL at X = W) --- */}
      {showWallB && (
        <mesh position={[W + T / 2, H / 2, L / 2]} receiveShadow>
          <boxGeometry args={[T, H, L + 2 * T]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>
      )}

      {/* --- WALL C (FRONT WALL at Z = L) --- */}
      {showWallC && (
        <mesh position={[W / 2, H / 2, L + T / 2]} receiveShadow>
          <boxGeometry args={[W + 2 * T, H, T]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>
      )}

      {/* --- WALL D (LEFT WALL at X = 0) --- */}
      {showWallD && (
        <mesh position={[-T / 2, H / 2, L / 2]} receiveShadow>
          <boxGeometry args={[T, H, L + 2 * T]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>
      )}

      {/* --- BACKSPLASH TILE STRIPS --- */}
      {backsplash.enabled && (
        <>
          {/* Backsplash on Wall A */}
          {showWallA && (
            <mesh
              position={[W / 2, (0.85 + backsplash.height / 2000), 0.008]}
              receiveShadow
            >
              <boxGeometry args={[W, backsplash.height / 1000, 0.015]} />
              <meshStandardMaterial color={splashColor} roughness={0.2} metalness={0.1} />
            </mesh>
          )}
          {/* Backsplash on Wall B */}
          {showWallB && (
            <mesh
              position={[W - 0.008, (0.85 + backsplash.height / 2000), L / 2]}
              rotation={[0, -Math.PI / 2, 0]}
              receiveShadow
            >
              <boxGeometry args={[L, backsplash.height / 1000, 0.015]} />
              <meshStandardMaterial color={splashColor} roughness={0.2} metalness={0.1} />
            </mesh>
          )}
          {/* Backsplash on Wall C */}
          {showWallC && (
            <mesh
              position={[W / 2, (0.85 + backsplash.height / 2000), L - 0.008]}
              rotation={[0, Math.PI, 0]}
              receiveShadow
            >
              <boxGeometry args={[W, backsplash.height / 1000, 0.015]} />
              <meshStandardMaterial color={splashColor} roughness={0.2} metalness={0.1} />
            </mesh>
          )}
          {/* Backsplash on Wall D */}
          {showWallD && (
            <mesh
              position={[0.008, (0.85 + backsplash.height / 2000), L / 2]}
              rotation={[0, Math.PI / 2, 0]}
              receiveShadow
            >
              <boxGeometry args={[L, backsplash.height / 1000, 0.015]} />
              <meshStandardMaterial color={splashColor} roughness={0.2} metalness={0.1} />
            </mesh>
          )}
        </>
      )}

      {/* --- CEILING DOWNLIGHTS (Visual spots) --- */}
      <group position={[W / 2, H - 0.02, L / 2]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 0.01, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} />
        </mesh>
      </group>
    </group>
  );
};
