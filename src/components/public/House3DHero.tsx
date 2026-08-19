'use client'

import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════
   Colour Palette
   ═══════════════════════════════════════════ */
const C = {
  wall:     '#F5F0E8',
  wallUp:   '#EDE8DD',
  roof:     '#2C3E50',
  concrete: '#8B8680',
  door:     '#3D2B1F',
  glass:    '#7EB8D4',
  frame:    '#F0EBE0',
  ground:   '#0D2818',
  chimney:  '#6B5B4F',
  gold:     '#C4942A',
  hedge:    '#1A4028',
  path:     '#B8AFA3',
  bg:       '#050E07',
}

/* ═══════════════════════════════════════════
   Easing
   ═══════════════════════════════════════════ */
function easeOutCubic(t: number) {
  t = Math.max(0, Math.min(1, t))
  return 1 - Math.pow(1 - t, 3)
}

/* ═══════════════════════════════════════════
   Piece Config
   ═══════════════════════════════════════════ */
interface Piece {
  id: string
  size: [number, number, number]
  pos: [number, number, number]
  rot?: [number, number, number]
  color: string
  rough?: number
  metal?: number
  emissive?: string
  emissiveI?: number
  opacity?: number
  from: [number, number, number]
  delay: number
  dur: number
}

const PIECES: Piece[] = [
  /* ── Phase 1: Foundation ── */
  { id:'foundation',  size:[5.2,0.15,4.2],   pos:[0,0.075,0],      color:C.concrete, rough:0.9,  from:[0,-4,0],      delay:0,   dur:0.8 },

  /* ── Phase 2: Walls ── */
  { id:'gf-wall',     size:[4.8,2.7,3.8],    pos:[0,1.5,0],        color:C.wall,    rough:0.75, from:[-7,1.5,0],    delay:0.6, dur:0.9 },
  { id:'ff-wall',     size:[4.6,2.2,3.6],    pos:[0,3.5,0],        color:C.wallUp,  rough:0.75, from:[0,10,0],      delay:1.2, dur:0.9 },

  /* ── Phase 3: Door ── */
  { id:'door-frame',  size:[1.05,2.2,0.04],  pos:[0.7,1.55,1.94],  color:C.frame,   rough:0.7,  from:[0.7,1.55,5],   delay:1.9, dur:0.5 },
  { id:'door',        size:[0.85,2.0,0.08],  pos:[0.7,1.5,1.91],   color:C.door,    rough:0.4, metal:0.1, from:[0.7,1.5,5], delay:1.9, dur:0.5 },

  /* ── Phase 4: Ground-Floor Windows ── */
  { id:'gf-wf-L',     size:[1.2,1.4,0.04],   pos:[-1.4,1.6,1.93],  color:C.frame,   rough:0.7,  from:[-5,1.6,3],    delay:2.0, dur:0.45 },
  { id:'gf-wg-L',     size:[1.05,1.25,0.06], pos:[-1.4,1.6,1.91],  color:C.glass,   rough:0.05,metal:0.2, emissive:'#223344',emissiveI:0.3, from:[-5,1.6,3], delay:2.0, dur:0.45 },
  { id:'gf-wf-R',     size:[1.2,1.4,0.04],   pos:[1.8,1.6,1.93],   color:C.frame,   rough:0.7,  from:[5,1.6,3],     delay:2.1, dur:0.45 },
  { id:'gf-wg-R',     size:[1.05,1.25,0.06], pos:[1.8,1.6,1.91],   color:C.glass,   rough:0.05,metal:0.2, emissive:'#223344',emissiveI:0.3, from:[5,1.6,3],   delay:2.1, dur:0.45 },

  /* ── Phase 5: First-Floor Windows ── */
  { id:'ff-wf-L',     size:[1.1,1.3,0.04],   pos:[-1.3,3.5,1.83],  color:C.frame,   rough:0.7,  from:[-4,3.5,3],    delay:2.3, dur:0.45 },
  { id:'ff-wg-L',     size:[0.95,1.15,0.06], pos:[-1.3,3.5,1.81],  color:C.glass,   rough:0.05,metal:0.2, emissive:'#223344',emissiveI:0.3, from:[-4,3.5,3], delay:2.3, dur:0.45 },
  { id:'ff-wf-C',     size:[0.9,1.3,0.04],   pos:[0.3,3.5,1.83],   color:C.frame,   rough:0.7,  from:[0,3.5,4],     delay:2.4, dur:0.45 },
  { id:'ff-wg-C',     size:[0.75,1.15,0.06], pos:[0.3,3.5,1.81],   color:C.glass,   rough:0.05,metal:0.2, emissive:'#223344',emissiveI:0.3, from:[0,3.5,4],   delay:2.4, dur:0.45 },
  { id:'ff-wf-R',     size:[1.1,1.3,0.04],   pos:[1.7,3.5,1.83],   color:C.frame,   rough:0.7,  from:[4,3.5,3],     delay:2.5, dur:0.45 },
  { id:'ff-wg-R',     size:[0.95,1.15,0.06], pos:[1.7,3.5,1.81],   color:C.glass,   rough:0.05,metal:0.2, emissive:'#223344',emissiveI:0.3, from:[4,3.5,3],   delay:2.5, dur:0.45 },

  /* ── Phase 6: Chimney ── */
  { id:'chimney',     size:[0.45,1.6,0.45],  pos:[1.3,6.2,-0.6],   color:C.chimney, rough:0.8,  from:[1.3,12,-0.6],  delay:3.3, dur:0.7 },

  /* ── Phase 7: Landscaping ── */
  { id:'step',        size:[1.2,0.12,0.5],   pos:[0.7,0.06,2.3],   color:C.concrete, rough:0.9,  from:[0.7,-2,2.3],  delay:3.5, dur:0.5 },
  { id:'path',        size:[1.0,0.02,2.0],   pos:[0.7,0.01,3.3],   color:C.path,    rough:0.85, from:[0.7,-2,3.3],  delay:3.6, dur:0.5 },
  { id:'hedge-L',     size:[0.4,0.5,2.5],    pos:[-3.0,0.25,0.5],  color:C.hedge,   rough:0.95, from:[-3.0,-1,0.5], delay:3.8, dur:0.4 },
  { id:'hedge-R',     size:[0.4,0.5,2.5],    pos:[3.0,0.25,0.5],   color:C.hedge,   rough:0.95, from:[3.0,-1,0.5],  delay:3.9, dur:0.4 },
]

/* Roof config – custom extruded geometry */
const ROOF = {
  pos:   [0, 5.5, 0] as [number, number, number],
  from:  [0, 13, 0] as [number, number, number],
  delay: 2.8,
  dur:   0.9,
}

/* ═══════════════════════════════════════════
   Animated Box Piece
   ═══════════════════════════════════════════ */
function AnimatedPiece({ p, progressRef }: { p: Piece; progressRef: React.RefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    if (!mesh.current) return
    const elapsed = progressRef.current ?? 0
    if (elapsed < p.delay) { mesh.current.visible = false; return }
    mesh.current.visible = true
    const f = easeOutCubic((elapsed - p.delay) / p.dur)
    mesh.current.position.set(
      p.from[0] + (p.pos[0] - p.from[0]) * f,
      p.from[1] + (p.pos[1] - p.from[1]) * f,
      p.from[2] + (p.pos[2] - p.from[2]) * f,
    )
  })

  return (
    <mesh ref={mesh} position={p.from as any} castShadow receiveShadow>
      <boxGeometry args={p.size} />
      <meshStandardMaterial
        color={p.color}
        roughness={p.rough ?? 0.7}
        metalness={p.metal ?? 0}
        emissive={p.emissive ?? '#000000'}
        emissiveIntensity={p.emissiveI ?? 0}
        transparent={p.opacity !== undefined}
        opacity={p.opacity ?? 1}
      />
    </mesh>
  )
}

/* ═══════════════════════════════════════════
   Roof – Triangular Prism
   ═══════════════════════════════════════════ */
function Roof({ progressRef }: { progressRef: React.RefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null!)

  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-2.7, 0)
    shape.lineTo(0, 1.8)
    shape.lineTo(2.7, 0)
    shape.closePath()
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 4.1, bevelEnabled: false })
    geo.translate(0, 0, -2.05)
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame(() => {
    if (!mesh.current) return
    const elapsed = progressRef.current ?? 0
    if (elapsed < ROOF.delay) { mesh.current.visible = false; return }
    mesh.current.visible = true
    const f = easeOutCubic((elapsed - ROOF.delay) / ROOF.dur)
    mesh.current.position.set(
      ROOF.from[0] + (ROOF.pos[0] - ROOF.from[0]) * f,
      ROOF.from[1] + (ROOF.pos[1] - ROOF.from[1]) * f,
      ROOF.from[2] + (ROOF.pos[2] - ROOF.from[2]) * f,
    )
  })

  return (
    <mesh ref={mesh} position={ROOF.from as any} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={C.roof} roughness={0.45} metalness={0.15} />
    </mesh>
  )
}

/* ═══════════════════════════════════════════
   Gold Completion Pulse Light
   ═══════════════════════════════════════════ */
function GoldPulse({ progressRef }: { progressRef: React.RefObject<number> }) {
  const light = useRef<THREE.PointLight>(null!)

  useFrame(() => {
    if (!light.current) return
    const t = progressRef.current ?? 0
    if (t < 4.3) { light.current.intensity = 0; return }
    const dt = t - 4.3
    if (dt < 0.4)      light.current.intensity = (dt / 0.4) * 5
    else if (dt < 1.2) light.current.intensity = 5 - ((dt - 0.4) / 0.8) * 4.2
    else               light.current.intensity = 0.8
  })

  return <pointLight ref={light} position={[0, 8, 2]} color={C.gold} distance={18} decay={2} />
}

/* ═══════════════════════════════════════════
   Subtle Mouse Camera Rig
   ═══════════════════════════════════════════ */
function CameraRig({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const { camera } = useThree()
  const smooth = useRef({ x: 0, y: 0 })

  useFrame(() => {
    smooth.current.x += (mouseX - smooth.current.x) * 0.03
    smooth.current.y += (mouseY - smooth.current.y) * 0.03
    camera.position.x = 7.5 + smooth.current.x * 1.8
    camera.position.y = 5.5 + smooth.current.y * 0.8
    camera.position.z = 7.5 + smooth.current.x * 0.6
    camera.lookAt(0, 2.5, 0)
  })

  return null
}

/* ═══════════════════════════════════════════
   Scene – Orchestrator
   ═══════════════════════════════════════════ */
function Scene({
  mouseX, mouseY, reducedMotion, progressRef,
}: {
  mouseX: number
  mouseY: number
  reducedMotion: boolean
  progressRef: React.RefObject<number>
}) {
  const startRef = useRef(0)
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (reducedMotion) {
      ;(progressRef as React.MutableRefObject<number>).current = 100
      return
    }
    if (startRef.current === 0) startRef.current = state.clock.elapsedTime
    ;(progressRef as React.MutableRefObject<number>).current =
      state.clock.elapsedTime - startRef.current

    /* Very subtle breathing after assembly */
    if (groupRef.current) {
      const elapsed = state.clock.elapsedTime - startRef.current
      if (elapsed > 5) {
        groupRef.current.position.y = Math.sin((elapsed - 5) * 0.4) * 0.02
      }
    }
  })

  return (
    <>
      <fog attach="fog" args={[C.bg, 18, 42]} />
      <color attach="background" args={[C.bg]} />

      {/* Lighting */}
      <ambientLight intensity={0.12} color="#B8D4C8" />
      <directionalLight
        position={[6, 12, 6]}
        intensity={1.6}
        color="#FFF5E0"
        castShadow
      />
      <directionalLight position={[-4, 6, -3]} intensity={0.25} color="#C8D8E8" />

      {/* Camera */}
      <CameraRig mouseX={mouseX} mouseY={mouseY} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[22, 64]} />
        <meshStandardMaterial color={C.ground} roughness={1} />
      </mesh>

      {/* Subtle gold glow disc under house */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[4.5, 48]} />
        <meshStandardMaterial
          color={C.gold}
          transparent
          opacity={0.04}
          emissive={C.gold}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* House group */}
      <group ref={groupRef}>
        {PIECES.map((p) => (
          <AnimatedPiece key={p.id} p={p} progressRef={progressRef} />
        ))}
        <Roof progressRef={progressRef} />
      </group>

      {/* Gold pulse on completion */}
      <GoldPulse progressRef={progressRef} />
    </>
  )
}

/* ═══════════════════════════════════════════
   Error Boundary
   ═══════════════════════════════════════════ */
interface EBProps { children: React.ReactNode; fallback: React.ReactNode }
interface EBState { hasError: boolean }
class CanvasErrorBoundary extends React.Component<EBProps, EBState> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

/* ═══════════════════════════════════════════
   Static House Fallback (no WebGL)
   ═══════════════════════════════════════════ */
function StaticFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: C.bg }}>
      <div className="text-center">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="mx-auto mb-4 opacity-60">
          {/* Simple house SVG silhouette */}
          <rect x="25" y="50" width="70" height="50" rx="2" fill="#F5F0E8" opacity="0.8" />
          <polygon points="15,52 60,20 105,52" fill="#2C3E50" opacity="0.9" />
          <rect x="48" y="65" width="14" height="35" rx="1" fill="#3D2B1F" />
          <rect x="30" y="60" width="12" height="10" rx="1" fill="#7EB8D4" opacity="0.6" />
          <rect x="68" y="60" width="12" height="10" rx="1" fill="#7EB8D4" opacity="0.6" />
          <rect x="35" y="30" width="8" height="20" rx="1" fill="#6B5B4F" />
        </svg>
        <p className="text-[#8A9B8E] text-sm">3D house preview</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Main Export
   ═══════════════════════════════════════════ */
export default function House3DHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const progressRef = useRef(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [webglOk, setWebglOk] = useState(true)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    try {
      const c = document.createElement('canvas')
      if (!(c.getContext('webgl') || c.getContext('experimental-webgl'))) setWebglOk(false)
    } catch { setWebglOk(false) }
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || reducedMotion) return
    const r = containerRef.current.getBoundingClientRect()
    setMouse({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * -2,
    })
  }

  if (!webglOk) return <StaticFallback />

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      onMouseMove={handleMouseMove}
    >
      <CanvasErrorBoundary fallback={<StaticFallback />}>
        <Suspense
          fallback={
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: C.bg }}
            >
              <div className="w-8 h-8 border-2 border-[#C4942A]/30 border-t-[#C4942A] rounded-full animate-spin" />
            </div>
          }
        >
          <Canvas
            shadows
            camera={{ position: [7.5, 5.5, 7.5], fov: 40, near: 0.1, far: 100 }}
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
            }}
          >
            <Scene
              mouseX={mouse.x}
              mouseY={mouse.y}
              reducedMotion={reducedMotion}
              progressRef={progressRef}
            />
          </Canvas>
        </Suspense>
      </CanvasErrorBoundary>
    </div>
  )
}
