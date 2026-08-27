import React from 'react';
import { ApplianceItem } from '../../types';

interface Appliance3DProps {
  appliance: ApplianceItem;
  isSelected: boolean;
  onSelect: () => void;
}

export const Appliance3D: React.FC<Appliance3DProps> = ({
  appliance,
  isSelected,
  onSelect,
}) => {
  const { id, type, width, height, depth, x, y, z, rotation, finish } = appliance;

  const W = width / 1000;
  const H = height / 1000;
  const D = depth / 1000;
  const posX = (x + width / 2) / 1000;
  const posZ = (y + depth / 2) / 1000;
  const posY = (z + height / 2) / 1000;

  const rotRad = (-rotation * Math.PI) / 180;
  const bodyColor = finish === 'black' ? '#18181b' : finish === 'white' ? '#f8fafc' : '#94a3b8'; // stainless steel default

  return (
    <group
      position={[posX, posY, posZ]}
      rotation={[0, rotRad, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[W + 0.02, H + 0.02, D + 0.02]} />
          <meshBasicMaterial color="#38bdf8" wireframe />
        </mesh>
      )}

      {/* --- FREESTANDING REFRIGERATOR --- */}
      {type === 'fridge-freestanding' && (
        <group>
          {/* Main Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[W, H, D]} />
            <meshStandardMaterial color={bodyColor} metalness={0.75} roughness={0.25} />
          </mesh>
          {/* Freezer Separation Line */}
          <mesh position={[0, -H * 0.15, D / 2 + 0.002]}>
            <boxGeometry args={[W - 0.01, 0.008, 0.005]} />
            <meshStandardMaterial color="#09090b" roughness={0.5} />
          </mesh>
          {/* Vertical Door Split Line (French door) */}
          <mesh position={[0, H * 0.2, D / 2 + 0.002]}>
            <boxGeometry args={[0.006, H * 0.6, 0.005]} />
            <meshStandardMaterial color="#09090b" roughness={0.5} />
          </mesh>
          {/* Stainless Handles */}
          <mesh position={[-0.04, H * 0.15, D / 2 + 0.03]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, H * 0.4, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.04, H * 0.15, D / 2 + 0.03]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, H * 0.4, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Ice Dispenser Glass Panel */}
          <mesh position={[-W * 0.25, H * 0.15, D / 2 + 0.002]}>
            <boxGeometry args={[0.16, 0.22, 0.005]} />
            <meshStandardMaterial color="#09090b" roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* --- INDUCTION COOKTOP --- */}
      {type === 'cooktop-induction' && (
        <group>
          {/* Glass Top Plate */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[W, H, D]} />
            <meshStandardMaterial color="#09090b" roughness={0.1} metalness={0.8} />
          </mesh>
          {/* 4 Induction Rings */}
          <mesh position={[-W * 0.22, H / 2 + 0.001, -D * 0.2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.001, 32]} />
            <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[W * 0.22, H / 2 + 0.001, -D * 0.2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.001, 32]} />
            <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[-W * 0.22, H / 2 + 0.001, D * 0.2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.001, 32]} />
            <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[W * 0.22, H / 2 + 0.001, D * 0.2]}>
            <cylinderGeometry args={[0.11, 0.11, 0.001, 32]} />
            <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={0.6} />
          </mesh>
          {/* Touch Slider Controls */}
          <mesh position={[0, H / 2 + 0.001, D * 0.38]}>
            <boxGeometry args={[W * 0.4, 0.001, 0.03]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}

      {/* --- BUILT-IN OVEN --- */}
      {type === 'oven-builtin' && (
        <group>
          {/* Outer Housing */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[W, H, D]} />
            <meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Glass Door Window */}
          <mesh position={[0, -H * 0.08, D / 2 + 0.003]}>
            <boxGeometry args={[W * 0.8, H * 0.55, 0.005]} />
            <meshStandardMaterial color="#09090b" roughness={0.1} />
          </mesh>
          {/* Handle */}
          <mesh position={[0, H * 0.26, D / 2 + 0.03]} castShadow>
            <boxGeometry args={[W * 0.75, 0.02, 0.02]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Control Dials / Digital Display */}
          <mesh position={[0, H * 0.38, D / 2 + 0.004]}>
            <boxGeometry args={[0.14, 0.04, 0.002]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.7} />
          </mesh>
        </group>
      )}

      {/* --- UNDERMOUNT SINK & FAUCET --- */}
      {(type === 'sink-single' || type === 'sink-double') && (
        <group>
          {/* Sink Basin */}
          <mesh position={[0, -H / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[W, H, D]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Gooseneck Arch Faucet */}
          <group position={[0, 0, -D * 0.3]}>
            {/* Base Pillar */}
            <mesh position={[0, 0.12, 0]} castShadow>
              <cylinderGeometry args={[0.018, 0.022, 0.24, 16]} />
              <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.2} /> {/* Brushed brass or chrome */}
            </mesh>
            {/* Arched Spout */}
            <mesh position={[0, 0.28, 0.08]} rotation={[0.6, 0, 0]} castShadow>
              <cylinderGeometry args={[0.014, 0.014, 0.18, 16]} />
              <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Single Lever Handle */}
            <mesh position={[0.035, 0.08, 0]} rotation={[0, 0, -0.6]} castShadow>
              <cylinderGeometry args={[0.006, 0.006, 0.08, 16]} />
              <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        </group>
      )}

      {/* --- EXTRACTOR HOOD --- */}
      {type === 'hood-wall' && (
        <group>
          {/* Bottom Canopy */}
          <mesh position={[0, -H * 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[W, H * 0.3, D]} />
            <meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.25} />
          </mesh>
          {/* Chimney Flue */}
          <mesh position={[0, H * 0.15, -D * 0.15]} castShadow receiveShadow>
            <boxGeometry args={[0.3, H * 0.7, 0.28]} />
            <meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.25} />
          </mesh>
          {/* Filter Mesh Underside */}
          <mesh position={[0, -H / 2 + 0.002, 0]}>
            <boxGeometry args={[W * 0.85, 0.002, D * 0.8]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.4} />
          </mesh>
        </group>
      )}

      {/* --- DISHWASHER --- */}
      {type === 'dishwasher' && (
        <group>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[W, H, D]} />
            <meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.25} />
          </mesh>
          {/* Top Control Strip */}
          <mesh position={[0, H / 2 - 0.04, D / 2 + 0.002]}>
            <boxGeometry args={[W - 0.02, 0.06, 0.003]} />
            <meshStandardMaterial color="#09090b" roughness={0.4} />
          </mesh>
          <mesh position={[0, H / 2 - 0.04, D / 2 + 0.004]}>
            <boxGeometry args={[0.1, 0.02, 0.002]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
          </mesh>
        </group>
      )}
    </group>
  );
};
