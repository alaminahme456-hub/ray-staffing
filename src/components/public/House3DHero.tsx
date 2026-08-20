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
  porch:    '#E8E3DA',
  sill:     '#DDD8CF',
}

/* ═══════════════════════════════════════════
   Easing Functions
   ═══════════════════════════════════════════ */
function easeOutCubic(t: number) {
  t = Math.max(0, Math.min(1, t))
  return 1 - Math.pow(1 - t, 3)
}

function easeOutBack(t: number) {
  t = Math.max(0, Math.min(1, t))
  const c1 = 1.2
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

function easeInOutQuart(t: number) {
  t = Math.max(0, Math.min(1, t))
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
}

/* ═══════════════════════════════════════════
   Piece Config
   ═══════════════════════════════════════════ */
interface Piece {
  id: string
  size: [number, number, number]
  pos: [number, number, number]
  color: string
  rough?: number
  metal?: number
  emissive?: string
  emissiveI?: number
  opacity?: number
  from: [number, number, number]
  delay: number
  dur: number
  ease: 'cubic' | 'back'
}

/* ── Total assembly: ~5.2 seconds ── */
const PIECES: Piece[] = [
  /* ── Phase 1: Foundation (0 – 0.9s) ── */
  { id:'foundation',    size:[5.4,0.18,4.4],    pos:[0,0.09,0],       color:C.concrete, rough:0.92, from:[0,-5,0],       delay:0,   dur:0.9,  ease:'cubic' },

  /* ── Phase 2: Walls (0.6 – 2.2s) ── */
  { id:'gf-wall',       size:[5.0,2.7,4.0],     pos:[0,1.53,0],       color:C.wall,    rough:0.72, from:[-8,1.53,0],    delay:0.6, dur:1.0,  ease:'cubic' },
  { id:'ff-wall',       size:[4.8,2.2,3.8],     pos:[0,3.49,0],       color:C.wallUp,  rough:0.72, from:[0,11,0],       delay:1.3, dur:0.9,  ease:'cubic' },

  /* ── Phase 3: Door + Porch (1.9 – 2.5s) ── */
  { id:'door-frame',    size:[1.1,2.25,0.05],   pos:[0.7,1.57,1.96],  color:C.frame,   rough:0.65, from:[0.7,1.57,6],    delay:1.9, dur:0.55, ease:'back' },
  { id:'door',          size:[0.9,2.05,0.08],   pos:[0.7,1.52,1.93],  color:C.door,    rough:0.35,metal:0.1, from:[0.7,1.52,6],  delay:1.95,dur:0.5,  ease:'back' },
  { id:'door-glass',    size:[0.5,0.7,0.04],    pos:[0.7,2.15,1.94],  color:C.glass,   rough:0.05,metal:0.2, emissive:'#223344',emissiveI:0.25, from:[0.7,2.15,6], delay:2.0, dur:0.45, ease:'back' },
  { id:'porch-overhang',size:[1.4,0.08,0.6],    pos:[0.7,2.78,2.25],  color:C.porch,   rough:0.7,  from:[0.7,6,2.25],    delay:2.1, dur:0.4,  ease:'cubic' },
  { id:'porch-pillar-L',size:[0.08,1.2,0.08],   pos:[0.12,2.18,2.53], color:C.frame,   rough:0.7,  from:[-2,2.18,4],     delay:2.15,dur:0.35, ease:'back' },
  { id:'porch-pillar-R',size:[0.08,1.2,0.08],   pos:[1.28,2.18,2.53], color:C.frame,   rough:0.7,  from:[3,2.18,4],      delay:2.2, dur:0.35,  ease:'back' },

  /* ── Phase 4: Ground-Floor Windows (2.1 – 2.7s) ── */
  { id:'gf-wf-L',       size:[1.25,1.45,0.05],  pos:[-1.5,1.62,1.95], color:C.frame,   rough:0.65, from:[-6,1.62,3.5],  delay:2.1, dur:0.5,  ease:'back' },
  { id:'gf-wg-L',       size:[1.1,1.3,0.06],    pos:[-1.5,1.62,1.93], color:C.glass,   rough:0.05,metal:0.2, emissive:'#223344',emissiveI:0.3, from:[-6,1.62,3.5], delay:2.15,dur:0.45,ease:'back' },
  { id:'gf-wf-R',       size:[1.25,1.45,0.05],  pos:[1.9,1.62,1.95],  color:C.frame,   rough:0.65, from:[6,1.62,3.5],   delay:2.2, dur:0.5,  ease:'back' },
  { id:'gf-wg-R',       size:[1.1,1.3,0.06],    pos:[1.9,1.62,1.93],  color:C.glass,   rough:0.05,metal:0.2, emissive:'#223344',emissiveI:0.3, from:[6,1.62,3.5],  delay:2.25,dur:0.45,ease:'back' },
  { id:'gf-sill-L',     size:[1.35,0.06,0.14],  pos:[-1.5,0.85,1.97], color:C.sill,    rough:0.8,  from:[-6,0.85,3.5],  delay:2.3, dur:0.35, ease:'cubic' },
  { id:'gf-sill-R',     size:[1.35,0.06,0.14],  pos:[1.9,0.85,1.97],  color:C.sill,    rough:0.8,  from:[6,0.85,3.5],   delay:2.35,dur:0.35,ease:'cubic' },

  /* ── Phase 5: First-Floor Windows (2.5 – 3.2s) ── */
  { id:'ff-wf-L',       size:[1.15,1.35,0.05],  pos:[-1.4,3.52,1.85], color:C.frame,   rough:0.65, from:[-5,3.52,3.5],  delay:2.5, dur:0.5,  ease:'back' },
  { id:'ff-wg-L',       size:[1.0,1.2,0.06],    pos:[-1.4,3.52,1.83], color:C.glass,   rough:0.05,metal:0.2, emissive:'#223344',emissiveI:0.3, from:[-5,3.52,3.5], delay:2.55,dur:0.45,ease:'back' },
  { id:'ff-wf-C',       size:[0.95,1.35,0.05],  pos:[0.3,3.52,1.85],  color:C.frame,   rough:0.65, from:[0,3.52,5],     delay:2.6, dur:0.5,  ease:'back' },
  { id:'ff-wg-C',       size:[0.8,1.2,0.06],    pos:[0.3,3.52,1.83],  color:C.glass,   rough:0.05,metal:0.2, emissive:'#223344',emissiveI:0.3, from:[0,3.52,5],     delay:2.65,dur:0.45,ease:'back' },
  { id:'ff-wf-R',       size:[1.15,1.35,0.05],  pos:[1.8,3.52,1.85],  color:C.frame,   rough:0.65, from:[5,3.52,3.5],   delay:2.7, dur:0.5,  ease:'back' },
  { id:'ff-wg-R',       size:[1.0,1.2,0.06],    pos:[1.8,3.52,1.83],  color:C.glass,   rough:0.05,metal:0.2, emissive:'#223344',emissiveI:0.3, from:[5,3.52,3.5],  delay:2.75,dur:0.45,ease:'back' },

  /* ── Phase 6: Roof (2.9 – 3.8s) ── */
  /* (handled separately with custom geometry) */

  /* ── Phase 7: Chimney (3.4 – 4.1s) ── */
  { id:'chimney',       size:[0.5,1.7,0.5],     pos:[1.3,6.35,-0.6],  color:C.chimney, rough:0.78, from:[1.3,13,-0.6],  delay:3.4, dur:0.7,  ease:'cubic' },
  { id:'chimney-cap',   size:[0.62,0.1,0.62],   pos:[1.3,7.25,-0.6],  color:C.concrete, rough:0.85, from:[1.3,13.8,-0.6],delay:3.7, dur:0.4,  ease:'cubic' },

  /* ── Phase 8: Landscaping (3.6 – 4.5s) ── */
  { id:'step',          size:[1.3,0.14,0.55],   pos:[0.7,0.07,2.35],  color:C.concrete, rough:0.9,  from:[0.7,-3,2.35],  delay:3.6, dur:0.5,  ease:'cubic' },
  { id:'path',          size:[1.1,0.02,2.2],    pos:[0.7,0.01,3.4],   color:C.path,    rough:0.85, from:[0.7,-3,3.4],   delay:3.7, dur:0.5,  ease:'cubic' },
  { id:'garden-bed',    size:[4.0,0.12,0.8],    pos:[-0.2,0.06,2.6],  color:C.hedge,   rough:0.95, from:[-0.2,-2,2.6],  delay:3.9, dur:0.4,  ease:'cubic' },
  { id:'hedge-L',       size:[0.45,0.55,2.8],   pos:[-3.1,0.275,0.3], color:C.hedge,   rough:0.95, from:[-3.1,-1.5,0.3],delay:4.0, dur:0.35, ease:'cubic' },
  { id:'hedge-R',       size:[0.45,0.55,2.8],   pos:[3.1,0.275,0.3],  color:C.hedge,   rough:0.95, from:[3.1,-1.5,0.3], delay:4.1, dur:0.35, ease:'cubic' },
]

/* Roof config – custom extruded geometry with eave overhang */
const ROOF = {
  pos:   [0, 5.55, 0] as [number, number, number],
  from:  [0, 14, 0] as [number, number, number],
  delay: 2.9,
  dur:   0.9,
}

/* ═══════════════════════════════════════════
   Animated Box Piece
   ═══════════════════════════════════════════ */
function AnimatedPiece({ p, progressRef }: { p: Piece; progressRef: React.RefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null!)
  const easeFn = p.ease === 'back' ? easeOutBack : easeOutCubic

  useFrame(() => {
    if (!mesh.current) return
    const elapsed = progressRef.current ?? 0
    if (elapsed < p.delay) { mesh.current.visible = false; return }
    mesh.current.visible = true
    const f = easeFn((elapsed - p.delay) / p.dur)
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
   Roof – Triangular Prism with Eaves
   ═══════════════════════════════════════════ */
function Roof({ progressRef }: { progressRef: React.RefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null!)

  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    /* Wider than walls for eave overhang (walls ±2.4, roof ±3.0) */
    shape.moveTo(-3.0, 0)
    shape.lineTo(0, 2.0)
    shape.lineTo(3.0, 0)
    shape.closePath()
    /* Deeper than walls for front/back overhang */
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 4.5, bevelEnabled: false })
    geo.translate(0, 0, -2.25)
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
      <meshStandardMaterial color={C.roof} roughness={0.4} metalness={0.12} />
    </mesh>
  )
}

/* ═══════════════════════════════════════════
   Cinematic Camera System
   ═══════════════════════════════════════════ */
function CameraSystem({
  mouseX, mouseY, progressRef, reducedMotion, isMobile,
}: {
  mouseX: number
  mouseY: number
  progressRef: React.RefObject<number>
  reducedMotion: boolean
  isMobile: boolean
}) {
  const { camera } = useThree()
  const smooth = useRef({ x: 0, y: 0 })

  /* Camera positions: start zoomed out, dolly in */
  const camStart = isMobile ? [9, 6.5, 9] as [number, number, number]
                       : [10.5, 7.5, 10.5] as [number, number, number]
  const camEnd   = isMobile ? [6.5, 5, 6.5] as [number, number, number]
                       : [7.5, 5.5, 7.5] as [number, number, number]

  useFrame(() => {
    const t = progressRef.current ?? 0

    /* Base position: dolly in over 5 seconds */
    let bx: number, by: number, bz: number
    if (reducedMotion || t > 5) {
      bx = camEnd[0]; by = camEnd[1]; bz = camEnd[2]
    } else {
      const f = easeInOutQuart(t / 5)
      bx = camStart[0] + (camEnd[0] - camStart[0]) * f
      by = camStart[1] + (camEnd[1] - camStart[1]) * f
      bz = camStart[2] + (camEnd[2] - camStart[2]) * f
    }

    /* Very subtle orbit after assembly complete */
    if (t > 5.2 && !reducedMotion) {
      const ot = (t - 5.2) * 0.12
      bx += Math.sin(ot) * 0.35
      bz += Math.cos(ot) * 0.35
    }

    /* Mouse / touch parallax */
    const lerpSpeed = isMobile ? 0.04 : 0.025
    smooth.current.x += (mouseX - smooth.current.x) * lerpSpeed
    smooth.current.y += (mouseY - smooth.current.y) * lerpSpeed

    const parallaxScale = isMobile ? 1.0 : 1.8
    camera.position.x = bx + smooth.current.x * parallaxScale
    camera.position.y = by + smooth.current.y * 0.6
    camera.position.z = bz + smooth.current.x * 0.5
    camera.lookAt(0, 2.6, 0)
  })

  return null
}

/* ═══════════════════════════════════════════
   Dynamic Lighting with Completion Boost
   ═══════════════════════════════════════════ */
function SceneLighting({ progressRef }: { progressRef: React.RefObject<number> }) {
  const keyLight = useRef<THREE.DirectionalLight>(null!)
  const ambientLight = useRef<THREE.AmbientLight>(null!)

  useFrame(() => {
    const t = progressRef.current ?? 0
    if (t < 4.5) return
    /* Smoothly boost lighting on completion */
    const dt = Math.min((t - 4.5) / 1.2, 1)
    const f = easeOutCubic(dt)
    if (keyLight.current) keyLight.current.intensity = 1.5 + f * 0.5
    if (ambientLight.current) ambientLight.current.intensity = 0.12 + f * 0.06
  })

  return (
    <>
      <ambientLight ref={ambientLight} intensity={0.12} color="#B8D4C8" />
      {/* Key light – warm sunlight */}
      <directionalLight
        ref={keyLight}
        position={[6, 12, 6]}
        intensity={1.5}
        color="#FFF5E0"
        castShadow
      />
      {/* Fill light – cool blue from opposite side */}
      <directionalLight position={[-5, 7, -4]} intensity={0.3} color="#C0D4E4" />
      {/* Rim light – subtle backlight for depth */}
      <directionalLight position={[0, 8, -8]} intensity={0.2} color="#D8E8F0" />
    </>
  )
}

/* ═══════════════════════════════════════════
   Gold Completion Pulse
   ═══════════════════════════════════════════ */
function GoldPulse({ progressRef }: { progressRef: React.RefObject<number> }) {
  const light = useRef<THREE.PointLight>(null!)

  useFrame(() => {
    if (!light.current) return
    const t = progressRef.current ?? 0
    if (t < 4.5) { light.current.intensity = 0; return }
    const dt = t - 4.5
    if (dt < 0.35)      light.current.intensity = (dt / 0.35) * 6
    else if (dt < 1.0) light.current.intensity = 6 - ((dt - 0.35) / 0.65) * 5.2
    else               light.current.intensity = 0.8
  })

  return <pointLight ref={light} position={[0, 8.5, 2]} color={C.gold} distance={20} decay={2} />
}

/* ═══════════════════════════════════════════
   Scene – Orchestrator
   ═══════════════════════════════════════════ */
function Scene({
  mouseX, mouseY, reducedMotion, progressRef, isMobile,
}: {
  mouseX: number
  mouseY: number
  reducedMotion: boolean
  progressRef: React.RefObject<number>
  isMobile: boolean
}) {
  const startRef = useRef(0)
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (reducedMotion) {
      ;(progressRef as React.MutableRefObject<number>).current = 100
      return
    }
    if (startRef.current === 0) startRef.current = state.clock.elapsedTime
    const elapsed = state.clock.elapsedTime - startRef.current
    ;(progressRef as React.MutableRefObject<number>).current = elapsed

    /* Settle + breathe after assembly */
    if (groupRef.current) {
      if (elapsed > 4.5 && elapsed < 5.5) {
        /* Tiny settling bounce */
        const st = (elapsed - 4.5) / 1.0
        groupRef.current.position.y = -Math.sin(st * Math.PI) * 0.04 * (1 - st)
        groupRef.current.rotation.y = Math.sin(st * Math.PI) * 0.003 * (1 - st)
      } else if (elapsed >= 5.5) {
        /* Subtle living breathing */
        const bt = (elapsed - 5.5) * 0.35
        groupRef.current.position.y = Math.sin(bt) * 0.012
      }
    }
  })

  return (
    <>
      <fog attach="fog" args={[C.bg, 20, 45]} />
      <color attach="background" args={[C.bg]} />

      {/* Lighting */}
      <SceneLighting progressRef={progressRef} />

      {/* Camera */}
      <CameraSystem
        mouseX={mouseX} mouseY={mouseY}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
        isMobile={isMobile}
      />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[24, 64]} />
        <meshStandardMaterial color={C.ground} roughness={1} />
      </mesh>

      {/* Ground shadow blob under house */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0.3]}>
        <circleGeometry args={[3.8, 32]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.12} />
      </mesh>

      {/* Subtle gold glow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[5, 48]} />
        <meshStandardMaterial
          color={C.gold}
          transparent
          opacity={0.035}
          emissive={C.gold}
          emissiveIntensity={0.35}
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
        <svg width="140" height="140" viewBox="0 0 140 140" fill="none" className="mx-auto mb-4" aria-hidden="true">
          <rect x="22" y="58" width="80" height="55" rx="2" fill={C.wall} opacity="0.8" />
          <rect x="22" y="28" width="80" height="35" rx="2" fill={C.wallUp} opacity="0.75" />
          <polygon points="14,30 62,10 110,30" fill={C.roof} opacity="0.85" />
          <rect x="50" y="72" width="15" height="41" rx="1" fill={C.door} opacity="0.9" />
          <rect x="52" y="74" width="5" height="10" rx="0.5" fill={C.glass} opacity="0.5" />
          <rect x="28" y="66" width="14" height="12" rx="1" fill={C.glass} opacity="0.5" />
          <rect x="72" y="66" width="14" height="12" rx="1" fill={C.glass} opacity="0.5" />
          <rect x="28" y="38" width="12" height="10" rx="1" fill={C.glass} opacity="0.45" />
          <rect x="56" y="38" width="10" height="10" rx="1" fill={C.glass} opacity="0.45" />
          <rect x="78" y="38" width="12" height="10" rx="1" fill={C.glass} opacity="0.45" />
          <rect x="82" y="14" width="9" height="22" rx="1" fill={C.chimney} opacity="0.7" />
          <rect x="80" y="12" width="13" height="3" rx="1" fill={C.concrete} opacity="0.6" />
          <rect x="22" y="108" width="80" height="3" rx="1" fill={C.concrete} opacity="0.5" />
        </svg>
        <p className="text-[#8A9B8E] text-sm font-medium">Quality Housing Solutions</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Loading Placeholder
   ═══════════════════════════════════════════ */
function LoadingPlaceholder() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-4"
      style={{ background: C.bg }}
      role="status"
      aria-label="Loading 3D experience"
    >
      <div className="relative">
        <div className="w-7 h-7 border-2 border-[#C4942A]/20 rounded-full" />
        <div className="absolute inset-0 w-7 h-7 border-2 border-transparent border-t-[#C4942A] rounded-full animate-spin" />
      </div>
      <p className="text-[#8A9B8E] text-sm font-medium tracking-wide">Building your experience...</p>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Main Export — Reusable Hero Component
   ═══════════════════════════════════════════ */
export default function House3DHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const progressRef = useRef(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [webglOk, setWebglOk] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setIsMobile(window.innerWidth < 768)
    try {
      const c = document.createElement('canvas')
      if (!(c.getContext('webgl') || c.getContext('experimental-webgl'))) setWebglOk(false)
    } catch { setWebglOk(false) }
  }, [])

  const updatePointer = (clientX: number, clientY: number) => {
    if (!containerRef.current || reducedMotion) return
    const r = containerRef.current.getBoundingClientRect()
    setMouse({
      x: ((clientX - r.left) / r.width - 0.5) * 2,
      y: ((clientY - r.top) / r.height - 0.5) * -2,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => updatePointer(e.clientX, e.clientY)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) updatePointer(e.touches[0].clientX, e.touches[0].clientY)
  }

  if (!webglOk) return <StaticFallback />

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      role="img"
      aria-label="3D animated house representing RAY housing expertise"
    >
      <CanvasErrorBoundary fallback={<StaticFallback />}>
        <Suspense fallback={<LoadingPlaceholder />}>
          <Canvas
            shadows
            camera={{ position: [10.5, 7.5, 10.5], fov: 38, near: 0.1, far: 100 }}
            dpr={[1, isMobile ? 1.25 : 1.5]}
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
              isMobile={isMobile}
            />
          </Canvas>
        </Suspense>
      </CanvasErrorBoundary>
    </div>
  )
}