'use client';

import { useRef, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';

// ─── TIPOVI ──────────────────────────────────────────────────────────────────
interface KeysRef {
  ArrowUp: boolean;
  ArrowDown: boolean;
  ArrowLeft: boolean;
  ArrowRight: boolean;
  KeyW: boolean;
  KeyS: boolean;
  KeyA: boolean;
  KeyD: boolean;
  [key: string]: boolean;
}

interface PlayerProps {
  playerRef: React.RefObject<THREE.Group>;
  keysRef: React.RefObject<KeysRef>;
}

interface FollowCameraProps {
  playerRef: React.RefObject<THREE.Group>;
}

interface GridProps {
  playerRef: React.RefObject<THREE.Group>;
}

// ─── KONSTANTE ────────────────────────────────────────────────────────────────
const MOVE_SPEED = 0.09;
const GRID_HALF = 40;
const GRID_STEP = 2.2;

// ─── KAMERA IZA IGRAČA ───────────────────────────────────────────────────────
function FollowCamera({ playerRef }: FollowCameraProps) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const lookAtPos = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!playerRef.current) return;
    const p = playerRef.current.position;
    targetPos.current.set(p.x, p.y + 5.5, p.z + 11);
    lookAtPos.current.set(p.x, p.y + 0.8, p.z);
    camera.position.lerp(targetPos.current, 0.07);
    camera.lookAt(lookAtPos.current);
  });

  return null;
}

// ─── BESKONAČNI NEON GRID ────────────────────────────────────────────────────
function NeonGrid({ playerRef }: GridProps) {
  const gridRef = useRef<THREE.Group>(null);

  const hLineGeo = new THREE.BoxGeometry(GRID_HALF * 2, 0.01, 0.022);
  const vLineGeo = new THREE.BoxGeometry(0.022, 0.01, GRID_HALF * 2);
  const cyanMat = new THREE.MeshBasicMaterial({ color: '#00e5ff', transparent: true, opacity: 0.45 });
  const magentaMat = new THREE.MeshBasicMaterial({ color: '#ff00c8', transparent: true, opacity: 0.3 });
  const highlightMat = new THREE.MeshBasicMaterial({ color: '#ff00ff', transparent: true, opacity: 0.95 });

  useFrame(() => {
    if (!gridRef.current || !playerRef.current) return;
    const px = playerRef.current.position.x;
    const pz = playerRef.current.position.z;
    gridRef.current.position.x = Math.round(px / GRID_STEP) * GRID_STEP;
    gridRef.current.position.z = Math.round(pz / GRID_STEP) * GRID_STEP;
  });

  const hLines = [];
  const vLines = [];
  const count = Math.floor(GRID_HALF / GRID_STEP);

  for (let i = -count; i <= count; i++) {
    hLines.push(<mesh key={`h${i}`} geometry={hLineGeo} material={cyanMat} position={[0, 0, i * GRID_STEP]} />);
    vLines.push(<mesh key={`v${i}`} geometry={vLineGeo} material={magentaMat} position={[i * GRID_STEP, 0, 0]} />);
  }

  return (
    <group ref={gridRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
        <planeGeometry args={[GRID_HALF * 2, GRID_HALF * 2]} />
        <meshBasicMaterial color="#06000f" />
      </mesh>
      {hLines}
      {vLines}
      <mesh geometry={new THREE.BoxGeometry(GRID_HALF * 2, 0.018, 0.07)} material={highlightMat} position={[0, 0.005, 0]} />
    </group>
  );
}

// ─── RETRO SUNCE ─────────────────────────────────────────────────────────────
function RetroSun() {
  return (
    <group position={[0, 9, -55]}>
      <mesh>
        <circleGeometry args={[10, 64]} />
        <meshBasicMaterial color="#ff4488" />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[0, -3 + i * 0.7, 0.01]}>
          <planeGeometry args={[20, 0.22]} />
          <meshBasicMaterial color="#0d0020" />
        </mesh>
      ))}
      <mesh position={[0, -6, -0.5]}>
        <planeGeometry args={[30, 8]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.25} />
      </mesh>
      <mesh>
        <ringGeometry args={[10, 12.5, 64]} />
        <meshBasicMaterial color="#ff2266" transparent opacity={0.12} />
      </mesh>
      <pointLight color="#ff4488" intensity={4} distance={120} />
      <pointLight color="#ff6600" intensity={2} distance={80} position={[0, -8, 0]} />
    </group>
  );
}

// ─── NEONSKI GRAD ────────────────────────────────────────────────────────────
function CyberBuildings() {
  const buildings = [
    { p: [-18, 7, -30] as [number,number,number], s: [3.5, 14, 3] as [number,number,number], c: '#ff00aa' },
    { p: [-14, 5, -26] as [number,number,number], s: [2.8, 10, 2.5] as [number,number,number], c: '#00e5ff' },
    { p: [-23, 9, -34] as [number,number,number], s: [4.5, 18, 3.5] as [number,number,number], c: '#8b5cf6' },
    { p: [-10, 4, -22] as [number,number,number], s: [2.2, 8, 2] as [number,number,number], c: '#ff6600' },
    { p: [-28, 11, -38] as [number,number,number], s: [5, 22, 4] as [number,number,number], c: '#ff0066' },
    { p: [-19, 6, -24] as [number,number,number], s: [2.5, 12, 2.5] as [number,number,number], c: '#00ffcc' },
    { p: [-32, 8, -32] as [number,number,number], s: [4, 16, 3.5] as [number,number,number], c: '#cc00ff' },
    { p: [-8,  3, -20] as [number,number,number], s: [2, 6, 2] as [number,number,number], c: '#ff4400' },
    { p: [16,  5, -42] as [number,number,number], s: [3, 10, 3] as [number,number,number], c: '#4400ff' },
    { p: [22,  7, -46] as [number,number,number], s: [4, 14, 3] as [number,number,number], c: '#220066' },
    { p: [28,  6, -44] as [number,number,number], s: [3, 12, 3] as [number,number,number], c: '#330088' },
    { p: [12,  4, -40] as [number,number,number], s: [2.5, 8, 2.5] as [number,number,number], c: '#110044' },
  ];

  return (
    <group>
      {buildings.map((b, i) => (
        <group key={i}>
          <mesh position={b.p}>
            <boxGeometry args={b.s} />
            <meshStandardMaterial color="#0a0020" emissive={b.c} emissiveIntensity={i < 8 ? 0.18 : 0.06} />
          </mesh>
          <mesh position={b.p}>
            <boxGeometry args={[b.s[0] + 0.08, b.s[1] + 0.08, b.s[2] + 0.08]} />
            <meshBasicMaterial color={b.c} wireframe transparent opacity={i < 8 ? 0.6 : 0.2} />
          </mesh>
          {i < 8 && (
            <mesh position={[b.p[0], b.p[1] + b.s[1] / 2 + 0.05, b.p[2]]}>
              <boxGeometry args={[b.s[0] + 0.1, 0.1, b.s[2] + 0.1]} />
              <meshBasicMaterial color={b.c} />
            </mesh>
          )}
        </group>
      ))}
      <pointLight position={[-18, 12, -28]} color="#ff00aa" intensity={3} distance={25} />
      <pointLight position={[-28, 15, -36]} color="#8b5cf6" intensity={3} distance={30} />
      <pointLight position={[-12, 8, -22]}  color="#00e5ff" intensity={2} distance={20} />
    </group>
  );
}

// ─── NEONSKI ZNAKOVI ──────────────────────────────────────────────────────────
function NeonSigns() {
  const signs = [
    { pos: [-16, 5, -22] as [number,number,number], text: 'ARCADE', color: '#ff00aa' },
    { pos: [-12, 3.5, -20] as [number,number,number], text: 'RAMEN', color: '#ff6600' },
    { pos: [-22, 7, -28] as [number,number,number], text: '電気街', color: '#00e5ff' },
    { pos: [-19, 4, -24] as [number,number,number], text: 'TECHNO', color: '#8b5cf6' },
    { pos: [-26, 9, -32] as [number,number,number], text: '未来', color: '#ff00cc' },
  ];

  return (
    <group>
      {signs.map((s, i) => (
        <Billboard key={i} position={s.pos}>
          <Text fontSize={0.7} color={s.color} anchorX="center" anchorY="middle" outlineWidth={0.04} outlineColor={s.color}>
            {s.text}
          </Text>
        </Billboard>
      ))}
    </group>
  );
}

// ─── SILUETE PALMI ────────────────────────────────────────────────────────────
function Palms() {
  const palmPositions: [number, number, number][] = [
    [-6, 0, -12], [-4, 0, -16], [-8, 0, -20],
    [-3, 0, -8],  [3, 0, -10],  [5, 0, -14],
    [7, 0, -18],  [-11, 0, -18],
  ];

  return (
    <group>
      {palmPositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.12, 0.18, 4, 6]} />
            <meshBasicMaterial color="#0a0015" />
          </mesh>
          {[0, 60, 120, 180, 240, 300].map((deg, j) => (
            <mesh
              key={j}
              position={[
                Math.cos((deg * Math.PI) / 180) * 0.9,
                4.2,
                Math.sin((deg * Math.PI) / 180) * 0.9,
              ]}
              rotation={[-0.5, (deg * Math.PI) / 180, 0.3]}
            >
              <planeGeometry args={[1.8, 0.35]} />
              <meshBasicMaterial color="#0d0020" side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// ─── PLUTAJUĆI WIREFRAME OBJEKTI ──────────────────────────────────────────────
function FloatingObjects() {
  const objects = [
    { pos: [6, 4, -18] as [number,number,number],   type: 'box', color: '#06b6d4', size: 0.9 },
    { pos: [-2, 5, -22] as [number,number,number],  type: 'box', color: '#8b5cf6', size: 0.7 },
    { pos: [10, 3, -14] as [number,number,number],  type: 'ico', color: '#06b6d4', size: 0.8 },
    { pos: [4, 6, -30] as [number,number,number],   type: 'box', color: '#ff00aa', size: 1.1 },
    { pos: [-5, 7, -28] as [number,number,number],  type: 'ico', color: '#8b5cf6', size: 0.6 },
    { pos: [14, 5, -20] as [number,number,number],  type: 'pyr', color: '#06b6d4', size: 0.7 },
    { pos: [8, 4, -35] as [number,number,number],   type: 'box', color: '#ff6600', size: 0.85 },
  ];

  return (
    <>
      {objects.map((obj, i) => (
        <Float key={i} speed={0.6 + i * 0.15} rotationIntensity={1.5} floatIntensity={1.8}>
          <mesh position={obj.pos}>
            {obj.type === 'box' && <boxGeometry args={[obj.size, obj.size, obj.size]} />}
            {obj.type === 'ico' && <icosahedronGeometry args={[obj.size * 0.7, 0]} />}
            {obj.type === 'pyr' && <tetrahedronGeometry args={[obj.size, 0]} />}
            <meshBasicMaterial color={obj.color} wireframe />
          </mesh>
        </Float>
      ))}
    </>
  );
}

// ─── ASTRONAUT ────────────────────────────────────────────────────────────────
function Astronaut({ playerRef, keysRef }: PlayerProps) {
  const bodyRef   = useRef<THREE.Group>(null);
  const leftLeg   = useRef<THREE.Mesh>(null);
  const rightLeg  = useRef<THREE.Mesh>(null);
  const antennaRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!playerRef.current) return;
    const t = clock.elapsedTime;
    const k = keysRef.current!;
    const moving = k.ArrowUp || k.ArrowDown || k.ArrowLeft || k.ArrowRight || k.KeyW || k.KeyS || k.KeyA || k.KeyD;

    if (k.ArrowUp    || k.KeyW) playerRef.current.position.z -= MOVE_SPEED;
    if (k.ArrowDown  || k.KeyS) playerRef.current.position.z += MOVE_SPEED;
    if (k.ArrowLeft  || k.KeyA) playerRef.current.position.x -= MOVE_SPEED;
    if (k.ArrowRight || k.KeyD) playerRef.current.position.x += MOVE_SPEED;

    let targetRot = playerRef.current.rotation.y;
    if      (k.ArrowLeft  || k.KeyA) targetRot =  Math.PI * 0.5;
    else if (k.ArrowRight || k.KeyD) targetRot = -Math.PI * 0.5;
    else if (k.ArrowUp    || k.KeyW) targetRot =  Math.PI;
    else if (k.ArrowDown  || k.KeyS) targetRot =  0;
    playerRef.current.rotation.y = THREE.MathUtils.lerp(playerRef.current.rotation.y, targetRot, 0.14);

    if (leftLeg.current && rightLeg.current) {
      const swing = moving ? Math.sin(t * 9) * 0.45 : 0;
      leftLeg.current.rotation.x  = THREE.MathUtils.lerp(leftLeg.current.rotation.x,  swing, 0.2);
      rightLeg.current.rotation.x = THREE.MathUtils.lerp(rightLeg.current.rotation.x, -swing, 0.2);
    }

    if (!moving) {
      playerRef.current.position.y = Math.sin(t * 1.1) * 0.07;
    } else {
      playerRef.current.position.y = THREE.MathUtils.lerp(playerRef.current.position.y, 0, 0.1);
    }

    if (bodyRef.current) {
      bodyRef.current.rotation.z = Math.sin(t * 1.4) * 0.025;
    }

    if (antennaRef.current) {
      (antennaRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.5 + Math.abs(Math.sin(t * 3)) * 2.5;
    }
  });

  const suitColor   = '#c8a8e0';
  const accentColor = '#06b6d4';

  return (
    <group ref={playerRef} position={[0, 0, 0]}>
      <group ref={bodyRef}>
        {/* Torzo */}
        <mesh position={[0, 1.05, 0]}>
          <capsuleGeometry args={[0.28, 0.55, 8, 16]} />
          <meshStandardMaterial color={suitColor} metalness={0.35} roughness={0.45} emissive="#3a0080" emissiveIntensity={0.1} />
        </mesh>
        {/* Panel na prsima */}
        <mesh position={[0, 1.0, 0.3]}>
          <boxGeometry args={[0.3, 0.22, 0.02]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.8} />
        </mesh>
        {[-0.08, 0, 0.08].map((x, i) => (
          <mesh key={i} position={[x, 0.94, 0.32]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshStandardMaterial color={i === 1 ? '#ff6600' : '#8b5cf6'} emissive={i === 1 ? '#ff6600' : '#8b5cf6'} emissiveIntensity={2} />
          </mesh>
        ))}
        {/* Kaciga */}
        <mesh position={[0, 1.72, 0]}>
          <sphereGeometry args={[0.33, 32, 32]} />
          <meshStandardMaterial color={suitColor} metalness={0.65} roughness={0.18} />
        </mesh>
        {/* Vizir */}
        <mesh position={[0, 1.72, 0.14]}>
          <sphereGeometry args={[0.24, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#cc88ff" emissive="#9900ff" emissiveIntensity={0.55} transparent opacity={0.55} metalness={0.95} roughness={0.05} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 1.76, 0.36]}>
          <boxGeometry args={[0.18, 0.03, 0.01]} />
          <meshBasicMaterial color={accentColor} />
        </mesh>
        {/* Antena */}
        <mesh position={[0, 2.1, 0]}>
          <cylinderGeometry args={[0.013, 0.013, 0.28, 6]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.9} />
        </mesh>
        <mesh position={[0, 2.26, 0]} ref={antennaRef}>
          <sphereGeometry args={[0.038, 8, 8]} />
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
        </mesh>
        <pointLight position={[0, 2.26, 0]} color="#ff00ff" intensity={0.6} distance={2.5} />
        {/* Lijeva ruka */}
        <group position={[-0.44, 1.08, 0]}>
          <mesh rotation={[0, 0, 0.22]}>
            <capsuleGeometry args={[0.1, 0.38, 6, 8]} />
            <meshStandardMaterial color={suitColor} metalness={0.3} roughness={0.5} />
          </mesh>
          <mesh position={[-0.12, -0.32, 0]}>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshStandardMaterial color="#1a0a2e" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
        {/* Desna ruka */}
        <group position={[0.44, 1.08, 0]}>
          <mesh rotation={[0, 0, -0.22]}>
            <capsuleGeometry args={[0.1, 0.38, 6, 8]} />
            <meshStandardMaterial color={suitColor} metalness={0.3} roughness={0.5} />
          </mesh>
          <mesh position={[0.12, -0.32, 0]}>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshStandardMaterial color="#1a0a2e" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
        {/* Lijeva noga */}
        <group position={[-0.18, 0.52, 0]}>
          <mesh ref={leftLeg} position={[0, -0.35, 0]}>
            <capsuleGeometry args={[0.12, 0.45, 6, 8]} />
            <meshStandardMaterial color={suitColor} metalness={0.25} roughness={0.5} />
          </mesh>
          <mesh position={[-0.02, -0.75, 0.08]}>
            <boxGeometry args={[0.22, 0.14, 0.38]} />
            <meshStandardMaterial color="#1a0a2e" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
        {/* Desna noga */}
        <group position={[0.18, 0.52, 0]}>
          <mesh ref={rightLeg} position={[0, -0.35, 0]}>
            <capsuleGeometry args={[0.12, 0.45, 6, 8]} />
            <meshStandardMaterial color={suitColor} metalness={0.25} roughness={0.5} />
          </mesh>
          <mesh position={[0.02, -0.75, 0.08]}>
            <boxGeometry args={[0.22, 0.14, 0.38]} />
            <meshStandardMaterial color="#1a0a2e" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
        {/* Jetpack */}
        <mesh position={[0, 1.05, -0.42]}>
          <boxGeometry args={[0.55, 0.72, 0.28]} />
          <meshStandardMaterial color="#222233" metalness={0.8} roughness={0.2} emissive="#0033ff" emissiveIntensity={0.4} />
        </mesh>
        {[-0.16, 0.16].map((x, i) => (
          <group key={i} position={[x, 0.62, -0.42]}>
            <mesh>
              <cylinderGeometry args={[0.07, 0.05, 0.2, 6]} />
              <meshStandardMaterial color="#333344" metalness={0.9} />
            </mesh>
            <mesh position={[0, -0.18, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={3} transparent opacity={0.85} />
            </mesh>
            <pointLight position={[0, -0.18, 0]} color={accentColor} intensity={1} distance={2} />
          </group>
        ))}
        <pointLight position={[0, 1.5, 0.5]} color="#9933ff" intensity={0.8} distance={4} />
      </group>
    </group>
  );
}

// ─── WIREFRAME PLANINE ────────────────────────────────────────────────────────
function WireframeMountains() {
  const peaks: [number, number, number][] = [
    [18, 0, -38], [25, 0, -44], [32, 0, -40],
    [15, 0, -46], [28, 0, -50], [22, 0, -34],
  ];
  const heights = [8, 11, 7, 13, 9, 6];

  return (
    <group>
      {peaks.map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1] + heights[i] / 2 - 0.5, pos[2]]}>
          <coneGeometry args={[5 + i * 0.5, heights[i], 4]} />
          <meshBasicMaterial color="#1a0066" wireframe />
        </mesh>
      ))}
    </group>
  );
}

// ─── SCENA ────────────────────────────────────────────────────────────────────
interface SceneProps {
  playerRef: React.RefObject<THREE.Group>;
  keysRef: React.RefObject<KeysRef>;
}

function Scene({ playerRef, keysRef }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.06} color="#1a0040" />
      <directionalLight position={[0, 20, -20]} intensity={0.4} color="#ff4488" />
      <FollowCamera playerRef={playerRef} />
      <NeonGrid playerRef={playerRef} />
      <RetroSun />
      <CyberBuildings />
      <NeonSigns />
      <Palms />
      <FloatingObjects />
      <WireframeMountains />
      <Astronaut playerRef={playerRef} keysRef={keysRef} />
      <Stars radius={120} depth={60} count={6000} factor={4} saturation={0.6} fade speed={0.4} />
    </>
  );
}

// ─── TOUCH JOYSTICK ───────────────────────────────────────────────────────────
function TouchJoystick({ keysRef }: { keysRef: React.RefObject<KeysRef> }) {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const pointerId = useRef<number | null>(null);
  const MAX_R = 32;

  const reset = useCallback(() => {
    const k = keysRef.current!;
    k.ArrowUp = k.ArrowDown = k.ArrowLeft = k.ArrowRight = false;
    if (knobRef.current) knobRef.current.style.transform = 'translate(-50%,-50%)';
  }, [keysRef]);

  const apply = useCallback((clientX: number, clientY: number) => {
    const base = baseRef.current;
    if (!base) return;
    const r = base.getBoundingClientRect();
    let dx = clientX - (r.left + r.width / 2);
    let dy = clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist > MAX_R) { dx = (dx / dist) * MAX_R; dy = (dy / dist) * MAX_R; }
    if (knobRef.current) knobRef.current.style.transform = `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
    const k = keysRef.current!;
    const dead = 0.35;
    const nx = dx / MAX_R; const ny = dy / MAX_R;
    k.ArrowLeft  = nx < -dead; k.ArrowRight = nx > dead;
    k.ArrowUp    = ny < -dead; k.ArrowDown  = ny > dead;
  }, [keysRef]);

  return (
    <div
      ref={baseRef}
      className="fixed bottom-20 right-6 z-30 touch-none select-none md:hidden"
      style={{ width: 100, height: 100 }}
      onPointerDown={e => { if (pointerId.current !== null) return; pointerId.current = e.pointerId; baseRef.current?.setPointerCapture(e.pointerId); apply(e.clientX, e.clientY); }}
      onPointerMove={e => { if (pointerId.current !== e.pointerId) return; apply(e.clientX, e.clientY); }}
      onPointerUp={e => { if (pointerId.current !== e.pointerId) return; pointerId.current = null; baseRef.current?.releasePointerCapture(e.pointerId); reset(); }}
      onPointerCancel={e => { if (pointerId.current !== e.pointerId) return; pointerId.current = null; reset(); }}
    >
      <div className="absolute inset-0 rounded-full border border-white/15 bg-black/45 backdrop-blur-md" style={{ boxShadow: '0 0 20px #ff009944' }} />
      <div
        ref={knobRef}
        className="absolute left-1/2 top-1/2 rounded-full border-2 border-[#ff0099]/70 bg-gradient-to-br from-[#ff0099]/90 to-[#8b5cf6]/80"
        style={{ width: 42, height: 42, transform: 'translate(-50%,-50%)' }}
      />
    </div>
  );
}

// ─── GLAVNI EXPORT ────────────────────────────────────────────────────────────
export default function RetrowaveRoom() {
  const playerRef = useRef<THREE.Group>(null!);
  const keysRef = useRef<KeysRef>({
    ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
    KeyW: false, KeyS: false, KeyA: false, KeyD: false,
  });

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code in keysRef.current) { e.preventDefault(); (keysRef.current as Record<string, boolean>)[e.code] = true; }
  }, []);

  const onKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code in keysRef.current) { (keysRef.current as Record<string, boolean>)[e.code] = false; }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); };
  }, [onKeyDown, onKeyUp]);

  return (
    <div className="relative w-full h-screen bg-[#06000f] overflow-hidden">
      <Canvas
        camera={{ position: [0, 5.5, 11], fov: 68, near: 0.1, far: 300 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      >
        <Suspense fallback={null}>
          <Scene playerRef={playerRef} keysRef={keysRef} />
        </Suspense>
      </Canvas>

      {/* Naslov */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
        <div className="w-3 h-3 rounded-sm bg-[#8b5cf6]" />
        <span className="font-mono text-lg tracking-widest" style={{ color: '#e8e8f0', textShadow: '0 0 12px #8b5cf6' }}>
          <span style={{ color: '#ff4488' }}>Retrowave</span> Showcase
        </span>
      </div>

      {/* Kontrole */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-3 pointer-events-none select-none" style={{ fontFamily: 'monospace' }}>
        <div className="flex flex-col items-center gap-1">
          <kbd className="px-3 py-1 rounded text-xs text-[#e8e8f0] border border-[#8b5cf6]/60 bg-black/50" style={{ boxShadow: '0 0 8px #8b5cf644' }}>↑ W</kbd>
          <div className="flex gap-1">
            <kbd className="px-3 py-1 rounded text-xs text-[#e8e8f0] border border-[#8b5cf6]/60 bg-black/50">← A</kbd>
            <kbd className="px-3 py-1 rounded text-xs text-[#e8e8f0] border border-[#8b5cf6]/60 bg-black/50">↓ S</kbd>
            <kbd className="px-3 py-1 rounded text-xs text-[#e8e8f0] border border-[#8b5cf6]/60 bg-black/50">→ D</kbd>
          </div>
          <span className="text-[10px] text-[#8888aa] mt-0.5">MOVE</span>
        </div>
      </div>

      {/* Touch joystick (mobile) */}
      <TouchJoystick keysRef={keysRef} />
    </div>
  );
}
