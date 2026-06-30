'use client'

import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { initCharacterPosition, INITIAL_CHARACTER_HEADING } from './constants'

export const AstronautCharacter = forwardRef<THREE.Group | null>(function AstronautCharacter(_, ref) {
  const groupRef = useRef<THREE.Group>(null)

  useImperativeHandle(ref, () => groupRef.current as THREE.Group)

  useEffect(() => {
    if (groupRef.current) initCharacterPosition(groupRef.current, INITIAL_CHARACTER_HEADING)
  }, [])

  const suitMat = { color: 0xf5f5f5, roughness: 0.5, metalness: 0.1 }
  const blueMat = { color: 0x06b6d4, roughness: 0.4, metalness: 0.3 }
  const orangeMat = { color: 0xe07840, roughness: 0.5, metalness: 0.05 }
  const cyanMat = { color: 0x22d3ee, roughness: 0.5, metalness: 0.05 }
  const gloveMat = { color: 0xd4d4d4, roughness: 0.6, metalness: 0.05 }

  return (
    <group ref={groupRef}>
      <mesh position={[0, 1.6, 0]} scale={[1, 0.95, 0.9]} castShadow>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color={0xffffff} roughness={0.3} metalness={0.1} />
      </mesh>

      <mesh position={[0, 1.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.04, 16, 32]} />
        <meshStandardMaterial {...blueMat} />
      </mesh>

      <mesh position={[0, 1.55, 0.15]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <sphereGeometry args={[0.42, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={0x1a1a2e} roughness={0.1} metalness={0.8} transparent opacity={0.9} />
      </mesh>

      <mesh position={[-0.5, 1.6, 0]} scale={[0.8, 1, 0.8]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial {...blueMat} />
      </mesh>
      <mesh position={[0.5, 1.6, 0]} scale={[0.8, 1, 0.8]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial {...blueMat} />
      </mesh>

      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.7, 16]} />
        <meshStandardMaterial {...suitMat} />
      </mesh>

      <mesh position={[-0.32, 0.9, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.3]} />
        <meshStandardMaterial {...orangeMat} />
      </mesh>
      <mesh position={[0.32, 0.9, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.3]} />
        <meshStandardMaterial {...cyanMat} />
      </mesh>

      <mesh position={[0, 0.8, 0.35]}>
        <boxGeometry args={[0.25, 0.2, 0.1]} />
        <meshStandardMaterial {...orangeMat} />
      </mesh>
      <mesh position={[0, 0.8, 0.405]}>
        <planeGeometry args={[0.18, 0.15]} />
        <meshStandardMaterial {...blueMat} />
      </mesh>
      <mesh position={[0, 0.8, 0.41]}>
        <planeGeometry args={[0.15, 0.12]} />
        <meshBasicMaterial color={0x93c5fd} transparent opacity={0.9} />
      </mesh>

      <mesh position={[-0.45, 0.95, 0]} rotation={[0, 0, 0.4]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.25, 12]} />
        <meshStandardMaterial {...suitMat} />
      </mesh>
      <mesh position={[0.45, 0.95, 0]} rotation={[0, 0, -0.4]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.25, 12]} />
        <meshStandardMaterial {...suitMat} />
      </mesh>

      <mesh position={[-0.52, 0.85, 0]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.11, 0.11, 0.05, 12]} />
        <meshStandardMaterial {...blueMat} />
      </mesh>
      <mesh position={[0.52, 0.85, 0]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.11, 0.11, 0.05, 12]} />
        <meshStandardMaterial {...blueMat} />
      </mesh>

      <mesh name="leftArm" position={[-0.58, 0.72, 0]} rotation={[0, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.2, 12]} />
        <meshStandardMaterial {...gloveMat} />
      </mesh>
      <mesh name="rightArm" position={[0.58, 0.72, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.2, 12]} />
        <meshStandardMaterial {...gloveMat} />
      </mesh>

      <mesh position={[-0.18, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.3, 12]} />
        <meshStandardMaterial {...cyanMat} />
      </mesh>
      <mesh position={[0.18, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.3, 12]} />
        <meshStandardMaterial {...cyanMat} />
      </mesh>

      <mesh position={[-0.18, 0.32, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.04, 12]} />
        <meshStandardMaterial {...blueMat} />
      </mesh>
      <mesh position={[0.18, 0.32, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.04, 12]} />
        <meshStandardMaterial {...blueMat} />
      </mesh>

      <mesh name="leftLeg" position={[-0.18, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.25, 12]} />
        <meshStandardMaterial {...suitMat} />
      </mesh>
      <mesh name="rightLeg" position={[0.18, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.25, 12]} />
        <meshStandardMaterial {...suitMat} />
      </mesh>
    </group>
  )
})

export function animateAstronautWalk(group: THREE.Group, walkPhase: number) {
  const leftLeg = group.getObjectByName('leftLeg') as THREE.Mesh | undefined
  const rightLeg = group.getObjectByName('rightLeg') as THREE.Mesh | undefined
  const leftArm = group.getObjectByName('leftArm') as THREE.Mesh | undefined
  const rightArm = group.getObjectByName('rightArm') as THREE.Mesh | undefined

  if (leftLeg && rightLeg) {
    leftLeg.rotation.x = Math.sin(walkPhase) * 0.4
    rightLeg.rotation.x = Math.sin(walkPhase + Math.PI) * 0.4
  }
  if (leftArm && rightArm) {
    leftArm.rotation.x = Math.sin(walkPhase + Math.PI) * 0.3
    rightArm.rotation.x = Math.sin(walkPhase) * 0.3
  }
}

export function resetAstronautPose(group: THREE.Group) {
  ;(['leftLeg', 'rightLeg', 'leftArm', 'rightArm'] as const).forEach((name) => {
    const part = group.getObjectByName(name) as THREE.Mesh | undefined
    if (part) part.rotation.x *= 0.9
  })
}
