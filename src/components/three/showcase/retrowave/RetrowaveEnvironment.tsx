'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { SHOWCASE_CONFIG } from '../constants'
import { registerRetrowaveShader, RETROWAVE_SPEED, SIMPLEX_NOISE_GLSL, type RetrowaveShader } from './noise'

function buildPalmGeometry() {
  const parts: THREE.BufferGeometry[] = []

  const log = new THREE.CylinderGeometry(0.25, 0.125, 10, 5, 4, true)
  log.translate(0, 5, 0)
  parts.push(log)

  for (let i = 0; i < 20; i++) {
    const leaf = new THREE.CircleGeometry(1.25, 4)
    leaf.translate(0, 1.25, 0)
    leaf.rotateX(-Math.PI / 2)
    leaf.scale(0.25, 1, 0.25 + Math.random() * 0.5)
    const pos = leaf.getAttribute('position') as THREE.BufferAttribute
    for (let j = 0; j < pos.count; j++) {
      if (pos.getY(j) === 0) pos.setY(j, 0.25)
    }
    leaf.rotateX((Math.random() - 0.5) * Math.PI * 0.5)
    leaf.rotateY(Math.random() * Math.PI * 2)
    leaf.translate(0, 10, 0)
    parts.push(leaf)
  }

  const merged = mergeGeometries(parts, false)
  if (!merged) return new THREE.BoxGeometry(0.1, 0.1, 0.1)
  merged.rotateZ(THREE.MathUtils.degToRad(-1.5))
  return merged
}

function createRoadMaterial(registry: RetrowaveShader[]) {
  const mat = new THREE.MeshBasicMaterial({ color: 0xff00ee })
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.time = { value: 0 }
    registerRetrowaveShader(shader as unknown as RetrowaveShader, registry)

    shader.vertexShader =
      `
      uniform float time;
      varying vec3 vPos;
      ${SIMPLEX_NOISE_GLSL}
    ` + shader.vertexShader

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
        vec2 tuv = uv;
        float t = time * 0.01 * ${RETROWAVE_SPEED.toFixed(1)};
        tuv.y += t;
        transformed.y = snoise(vec3(tuv * 5.0, 0.0)) * 5.0;
        transformed.y *= smoothstep(5.0, 15.0, abs(transformed.x));
        vPos = transformed;
      `,
    )

    shader.fragmentShader =
      `
      uniform float time;
      varying vec3 vPos;

      float gridLine(vec3 position, float width, vec3 step) {
        vec3 tempCoord = position / step;
        vec2 coord = tempCoord.xz;
        coord.y -= time * ${RETROWAVE_SPEED.toFixed(1)} / 2.0;
        vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord * width);
        return min(min(grid.x, grid.y), 1.0);
      }
    ` + shader.fragmentShader

    shader.fragmentShader = shader.fragmentShader.replace(
      'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
      `
        float lx = abs(fract(vPos.x / 2.0 - 0.5) - 0.5) / fwidth(vPos.x);
        float lz = abs(fract((vPos.z - time * ${RETROWAVE_SPEED.toFixed(1)} / 2.0) / 2.0 - 0.5) - 0.5) / fwidth(vPos.z);
        float mag = 1.0 - min(lx, 1.0);
        float cyan = 1.0 - min(lz, 1.0);
        vec3 road = mix(vec3(0.0, 0.75, 1.0), vec3(0.0), smoothstep(5.0, 7.5, abs(vPos.x)));
        vec3 neon = road;
        neon += vec3(1.0, 0.05, 0.82) * mag * 1.4;
        neon += vec3(0.05, 1.0, 1.0) * cyan * 1.4;
        float l = gridLine(vPos, 2.0, vec3(2.0));
        vec3 c = mix(neon, outgoingLight, l * 0.35);
        gl_FragColor = vec4(c, diffuseColor.a);
      `,
    )
  }
  return mat
}

function createPalmMaterial(registry: RetrowaveShader[]) {
  const mat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.time = { value: 0 }
    registerRetrowaveShader(shader as unknown as RetrowaveShader, registry)

    shader.vertexShader =
      `
      uniform float time;
      attribute vec3 instPosition;
    ` + shader.vertexShader

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
        transformed.x *= sign(instPosition.x);
        vec3 ip = instPosition;
        ip.z = mod(50.0 + ip.z + time * ${RETROWAVE_SPEED.toFixed(1)}, 100.0) - 50.0;
        transformed *= 0.4 + smoothstep(50.0, 45.0, abs(ip.z)) * 0.6;
        transformed += ip;
      `,
    )
  }
  return mat
}

function createSunMaterial(registry: RetrowaveShader[]) {
  const mat = new THREE.MeshBasicMaterial({ color: 0xff8800, fog: false, transparent: true })
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.time = { value: 0 }
    registerRetrowaveShader(shader as unknown as RetrowaveShader, registry)

    shader.vertexShader =
      `
      varying vec2 vUv;
    ` + shader.vertexShader

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
        vUv = uv;
      `,
    )

    shader.fragmentShader =
      `
      varying vec2 vUv;
    ` + shader.fragmentShader

    shader.fragmentShader = shader.fragmentShader.replace(
      'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
      `
        float scan = step(0.5, vUv.y) * step(mod(vUv.y * 40.0, 1.0), 0.55);
        vec3 top = mix(vec3(1.0, 0.92, 0.45), vec3(1.0, 0.45, 0.75), smoothstep(0.0, 0.5, vUv.y));
        vec3 col = mix(top, vec3(0.02, 0.0, 0.06), scan);
        float alpha = smoothstep(0.5, 0.72, vUv.y);
        gl_FragColor = vec4(col, alpha);
      `,
    )
  }
  return mat
}

function PalmInstances({ material }: { material: THREE.MeshBasicMaterial }) {
  const palmGeom = useMemo(() => buildPalmGeometry(), [])
  const instGeom = useMemo(() => {
    const geo = new THREE.InstancedBufferGeometry()
    geo.index = palmGeom.index
    geo.attributes.position = palmGeom.attributes.position
    if (palmGeom.attributes.normal) geo.attributes.normal = palmGeom.attributes.normal
    if (palmGeom.attributes.uv) geo.attributes.uv = palmGeom.attributes.uv
    const palmPos: number[] = []
    for (let i = 0; i < 8; i++) {
      palmPos.push(-5, 0, i * 20 - 10 - 50)
      palmPos.push(5, 0, i * 20 - 50)
    }
    geo.setAttribute('instPosition', new THREE.InstancedBufferAttribute(new Float32Array(palmPos), 3))
    return geo
  }, [palmGeom])

  return <mesh geometry={instGeom} material={material} />
}

export function RetrowaveEnvironment() {
  const { scene } = useThree()
  const shaderRegistry = useRef<RetrowaveShader[]>([])
  const { horizonZ } = SHOWCASE_CONFIG

  const roadMaterial = useMemo(() => createRoadMaterial(shaderRegistry.current), [])
  const palmMaterial = useMemo(() => createPalmMaterial(shaderRegistry.current), [])
  const sunMaterial = useMemo(() => createSunMaterial(shaderRegistry.current), [])

  useEffect(() => {
    const bg = new THREE.Color(0xffaa44)
    const prevBg = scene.background
    const prevFog = scene.fog
    scene.background = bg
    scene.fog = new THREE.Fog(bg, 42, 95)
    return () => {
      scene.background = prevBg
      scene.fog = prevFog
    }
  }, [scene])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (const shader of shaderRegistry.current) {
      shader.uniforms.time.value = t
    }
  })

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100, 200, 200]} />
        <primitive object={roadMaterial} attach="material" />
      </mesh>

      <PalmInstances material={palmMaterial} />

      <mesh position={[0, 8, horizonZ - 440]} material={sunMaterial}>
        <circleGeometry args={[200, 64]} />
      </mesh>
    </group>
  )
}

export function RetrowaveLighting() {
  return (
    <>
      <ambientLight color={0xffaa88} intensity={0.55} />
      <hemisphereLight args={[0xffccaa, 0x220033, 0.35]} />
    </>
  )
}
