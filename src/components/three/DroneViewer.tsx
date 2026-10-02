import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

// ── Procedural Hexacopter Drone Model ────────────────────────────────────────

function HexcopterModel({
  exploded = false,
  autoRotate = false,
}: {
  exploded?: boolean;
  autoRotate?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const propsRef = useRef<THREE.Mesh[]>([]);
  const t = useRef(0);

  // Materials
  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a1f1a",
        metalness: 0.6,
        roughness: 0.35,
        envMapIntensity: 1.2,
      }),
    []
  );
  const armMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#151815",
        metalness: 0.7,
        roughness: 0.3,
      }),
    []
  );
  const motorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0f120f",
        metalness: 0.9,
        roughness: 0.15,
      }),
    []
  );
  const propMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1e261e",
        metalness: 0.3,
        roughness: 0.5,
        transparent: true,
        opacity: 0.85,
      }),
    []
  );
  const greenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2c7a2c",
        emissive: "#1a4a1a",
        emissiveIntensity: 0.4,
        metalness: 0.5,
        roughness: 0.4,
      }),
    []
  );
  const tankMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a231a",
        metalness: 0.4,
        roughness: 0.6,
      }),
    []
  );

  // 6 arm positions for hexacopter (60° apart)
  const armAngles = useMemo(
    () => Array.from({ length: 6 }, (_, i) => (i * Math.PI * 2) / 6),
    []
  );

  useFrame((_, delta) => {
    t.current += delta;
    // Gentle idle hover
    if (groupRef.current && !autoRotate) {
      groupRef.current.position.y = Math.sin(t.current * 0.8) * 0.03;
      groupRef.current.rotation.z = Math.sin(t.current * 0.5) * 0.008;
    }
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }
    // Propeller spin
    propsRef.current.forEach((mesh, i) => {
      if (mesh) mesh.rotation.y += delta * (12 + i * 0.5);
    });
  });

  const explodeOffset = exploded ? 0.6 : 0;

  return (
    <group ref={groupRef}>
      {/* ── MAIN BODY ── */}
      <mesh material={bodyMat} position={[0, 0 + explodeOffset * 0.1, 0]}>
        <cylinderGeometry args={[0.28, 0.22, 0.12, 8]} />
      </mesh>
      {/* Top cover plate */}
      <mesh material={armMat} position={[0, 0.07 + explodeOffset * 0.25, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.04, 8]} />
      </mesh>
      {/* Electronics bay */}
      <mesh material={bodyMat} position={[0, -0.04, 0]}>
        <boxGeometry args={[0.18, 0.06, 0.14]} />
      </mesh>

      {/* ── SPRAY TANK ── */}
      <mesh
        material={tankMat}
        position={[0, -0.18 - explodeOffset * 0.5, 0]}
      >
        <boxGeometry args={[0.2, 0.14, 0.16]} />
      </mesh>
      {/* Tank end caps */}
      <mesh material={motorMat} position={[0.11, -0.18 - explodeOffset * 0.5, 0]}>
        <boxGeometry args={[0.02, 0.14, 0.14]} />
      </mesh>
      <mesh material={motorMat} position={[-0.11, -0.18 - explodeOffset * 0.5, 0]}>
        <boxGeometry args={[0.02, 0.14, 0.14]} />
      </mesh>
      {/* Spray bar */}
      <mesh material={armMat} position={[0, -0.26 - explodeOffset * 0.6, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.5, 6]} />
      </mesh>
      {/* Nozzles */}
      {[-0.18, -0.06, 0.06, 0.18].map((x, i) => (
        <group key={i} position={[x, -0.3 - explodeOffset * 0.65, 0]}>
          <mesh material={greenMat}>
            <cylinderGeometry args={[0.012, 0.008, 0.04, 6]} />
          </mesh>
        </group>
      ))}

      {/* ── CAMERA GIMBAL ── */}
      <mesh material={motorMat} position={[0, -0.1 - explodeOffset * 0.35, 0.16 + explodeOffset * 0.3]}>
        <sphereGeometry args={[0.055, 12, 12]} />
      </mesh>
      <mesh material={greenMat} position={[0, -0.1 - explodeOffset * 0.35, 0.215 + explodeOffset * 0.35]}>
        <cylinderGeometry args={[0.022, 0.018, 0.025, 8]} />
      </mesh>

      {/* ── 6 ARMS + MOTORS + PROPS ── */}
      {armAngles.map((angle, i) => {
        const armLength = 0.52;
        const motorX = Math.sin(angle) * armLength;
        const motorZ = Math.cos(angle) * armLength;
        const armX = Math.sin(angle) * (armLength / 2);
        const armZ = Math.cos(angle) * (armLength / 2);
        const explodeArmOffset = exploded
          ? { x: Math.sin(angle) * explodeOffset * 0.8, z: Math.cos(angle) * explodeOffset * 0.8 }
          : { x: 0, z: 0 };

        return (
          <group key={i} position={[explodeArmOffset.x, 0, explodeArmOffset.z]}>
            {/* Arm */}
            <mesh
              material={armMat}
              position={[armX, 0.02, armZ]}
              rotation={[0, -angle, 0]}
            >
              <boxGeometry args={[armLength, 0.028, 0.04]} />
            </mesh>

            {/* Motor housing */}
            <mesh material={motorMat} position={[motorX, 0.03, motorZ]}>
              <cylinderGeometry args={[0.055, 0.05, 0.06, 10]} />
            </mesh>
            <mesh material={armMat} position={[motorX, 0.065, motorZ]}>
              <cylinderGeometry args={[0.04, 0.04, 0.02, 10]} />
            </mesh>

            {/* Green LED ring */}
            <mesh material={greenMat} position={[motorX, 0.018, motorZ]}>
              <torusGeometry args={[0.052, 0.006, 6, 16]} />
            </mesh>

            {/* Propeller */}
            <mesh
              ref={(el) => {
                if (el) propsRef.current[i] = el;
              }}
              material={propMat}
              position={[motorX, 0.092, motorZ]}
            >
              <boxGeometry args={[0.42, 0.008, 0.045]} />
            </mesh>
            {/* Propeller blade 2 */}
            <mesh
              material={propMat}
              position={[motorX, 0.092, motorZ]}
              rotation={[0, Math.PI / 2, 0]}
            >
              <boxGeometry args={[0.42, 0.008, 0.045]} />
            </mesh>

            {/* Landing struts (on 3 alternating arms) */}
            {i % 2 === 0 && (
              <>
                <mesh
                  material={armMat}
                  position={[motorX * 0.55, -0.18, motorZ * 0.55]}
                  rotation={[0, -angle, 0.12]}
                >
                  <cylinderGeometry args={[0.012, 0.012, 0.32, 6]} />
                </mesh>
                <mesh material={motorMat} position={[motorX * 0.55, -0.35, motorZ * 0.55]}>
                  <sphereGeometry args={[0.018, 8, 8]} />
                </mesh>
              </>
            )}
          </group>
        );
      })}

      {/* ── ANTENNA ── */}
      <mesh material={greenMat} position={[0.1, 0.18, -0.08]}>
        <cylinderGeometry args={[0.006, 0.004, 0.18, 5]} />
      </mesh>
      <mesh material={greenMat} position={[0.1, 0.27, -0.08]}>
        <sphereGeometry args={[0.01, 6, 6]} />
      </mesh>

      {/* ── BATTERY (visible when exploded) ── */}
      {exploded && (
        <mesh material={tankMat} position={[0, 0.12 + explodeOffset * 0.4, 0]}>
          <boxGeometry args={[0.22, 0.06, 0.1]} />
        </mesh>
      )}

      {/* ── FLOOR SHADOW ── */}
      <mesh position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

// ── Camera controller for zoom buttons ───────────────────────────────────────

function CameraController({
  zoomIn,
  zoomOut,
  reset,
}: {
  zoomIn: boolean;
  zoomOut: boolean;
  reset: boolean;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (reset) {
      camera.position.set(0, 0.6, 2.0);
      camera.lookAt(0, 0, 0);
    }
  }, [reset, camera]);
  useEffect(() => {
    if (zoomIn) {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      camera.position.addScaledVector(dir, 0.15);
    }
  }, [zoomIn, camera]);
  useEffect(() => {
    if (zoomOut) {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      camera.position.addScaledVector(dir, -0.15);
    }
  }, [zoomOut, camera]);
  return null;
}

// ── Hotspot Overlay ───────────────────────────────────────────────────────────

interface Hotspot {
  label: string;
  detail: string;
  screenX: string;
  screenY: string;
}

// ── DroneViewer Component ─────────────────────────────────────────────────────

interface DroneViewerProps {
  modelUrl?: string;
  hotspots?: Hotspot[];
  enableExplodedView?: boolean;
  autoRotate?: boolean;
  height?: string;
  className?: string;
}

const defaultHotspots: Hotspot[] = [
  { label: "Antenna", detail: "High-gain 2.4/5.8 GHz", screenX: "62%", screenY: "18%" },
  { label: "Motor", detail: "KV 110PV System", screenX: "82%", screenY: "35%" },
  { label: "Nozzle", detail: "Anti-drip Nozzle", screenX: "78%", screenY: "72%" },
  { label: "Tank", detail: "10–16 L Capacity", screenX: "30%", screenY: "65%" },
  { label: "Battery", detail: "14S 16800mAh 14S", screenX: "68%", screenY: "58%" },
];

export default function DroneViewer({
  hotspots = defaultHotspots,
  enableExplodedView = false,
  autoRotate = false,
  height = "480px",
  className = "",
}: DroneViewerProps) {
  const [exploded, setExploded] = useState(false);
  const [zoomInTrigger, setZoomInTrigger] = useState(false);
  const [zoomOutTrigger, setZoomOutTrigger] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const triggerZoomIn = () => {
    setZoomInTrigger(true);
    setTimeout(() => setZoomInTrigger(false), 50);
  };
  const triggerZoomOut = () => {
    setZoomOutTrigger(true);
    setTimeout(() => setZoomOutTrigger(false), 50);
  };
  const triggerReset = () => {
    setResetTrigger(true);
    setTimeout(() => setResetTrigger(false), 50);
  };

  if (webglFailed) {
    return (
      <div
        className={`relative flex items-center justify-center bg-[#0f160f] border border-white/5 ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-label text-[#4a5c4a] mb-2">3D VIEWER UNAVAILABLE</div>
          <p className="text-[#4a5c4a] text-xs">WebGL is not supported on this device.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ height, background: "#080d08" }}
    >
      {/* Three.js Canvas */}
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          if (!gl) setWebglFailed(true);
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.6, 2.0]} fov={45} />
        <CameraController
          zoomIn={zoomInTrigger}
          zoomOut={zoomOutTrigger}
          reset={resetTrigger}
        />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[3, 5, 3]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
          color="#d0e8d0"
        />
        <directionalLight position={[-3, 2, -2]} intensity={0.6} color="#1a3a1a" />
        <pointLight position={[0, -0.5, 0]} intensity={0.4} color="#2c7a2c" distance={3} />
        <pointLight position={[0, 2, 1]} intensity={0.3} color="#a0c8a0" />

        <Environment preset="night" />

        <HexcopterModel exploded={exploded} autoRotate={autoRotate} />

        {/* Subtle ground plane */}
        <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[4, 4]} />
          <meshStandardMaterial color="#0a0f0a" metalness={0.1} roughness={0.9} />
        </mesh>

        <OrbitControls
          enablePan={false}
          minDistance={0.8}
          maxDistance={4}
          maxPolarAngle={Math.PI * 0.8}
          autoRotate={autoRotate && !exploded}
          autoRotateSpeed={1.5}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      {/* Hotspot overlays */}
      {hotspots.map((spot, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: spot.screenX, top: spot.screenY }}
        >
          <button
            className="relative group"
            onClick={() => setActiveHotspot(activeHotspot === i ? null : i)}
            aria-label={`View ${spot.label} info`}
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full border border-[#2c7a2c] animate-ping opacity-30" />
            {/* Dot */}
            <span className="block w-3 h-3 rounded-full bg-[#2c7a2c] border border-[#3a9a3a] shadow-[0_0_8px_rgba(44,122,44,0.6)]" />
          </button>

          {/* Connector line + label */}
          <div
            className="absolute pointer-events-none whitespace-nowrap"
            style={{ left: "16px", top: "-2px" }}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-px bg-[#2c7a2c]/50" />
              <div
                className="border border-[#2c7a2c]/30 bg-[#080d08]/90 px-2.5 py-1.5"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <div className="text-[9px] font-mono text-[#2c7a2c] tracking-widest leading-none mb-0.5">
                  {spot.detail}
                </div>
                <div className="text-[11px] font-mono text-[#eef0ee] tracking-wide leading-none">
                  {spot.label}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controls overlay */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {[
          { icon: ZoomIn, fn: triggerZoomIn, label: "Zoom in", id: "viewer-zoom-in" },
          { icon: ZoomOut, fn: triggerZoomOut, label: "Zoom out", id: "viewer-zoom-out" },
          { icon: RotateCcw, fn: triggerReset, label: "Reset view", id: "viewer-reset" },
        ].map(({ icon: Icon, fn, label, id }) => (
          <button
            key={id}
            id={id}
            onClick={fn}
            aria-label={label}
            className="w-8 h-8 flex items-center justify-center border border-white/10 bg-black/40 text-[#8a9c8a] hover:text-[#2c7a2c] hover:border-[#2c7a2c]/40 transition-all"
            style={{ backdropFilter: "blur(8px)" }}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
        {enableExplodedView && (
          <button
            id="viewer-explode"
            onClick={() => setExploded(!exploded)}
            aria-label={exploded ? "Collapse view" : "Exploded view"}
            className={`w-8 h-8 flex items-center justify-center border transition-all ${
              exploded
                ? "border-[#2c7a2c]/60 bg-[#2c7a2c]/10 text-[#2c7a2c]"
                : "border-white/10 bg-black/40 text-[#8a9c8a] hover:text-[#2c7a2c]"
            }`}
            style={{ backdropFilter: "blur(8px)" }}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Corner labels */}
      <div className="absolute top-3 left-4 text-label-sm text-[#2d3c2d]">
        GoAG AGRI X10
      </div>
      <div className="absolute bottom-3 left-0 right-0 text-center text-label-sm text-[#2d3c2d]">
        DRAG TO ROTATE · SCROLL TO ZOOM · TOUCH SUPPORTED
      </div>

      {/* Exploded mode indicator */}
      {exploded && (
        <div className="absolute top-3 right-3 text-label-sm text-[#2c7a2c] bg-[#2c7a2c]/10 border border-[#2c7a2c]/20 px-2 py-1">
          EXPLODED VIEW
        </div>
      )}
    </div>
  );
}
