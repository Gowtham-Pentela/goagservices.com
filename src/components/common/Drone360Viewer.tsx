import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Compass,
  Cpu
} from "lucide-react";
import { DRONES_360_CATALOG, Drone360Data } from "../../data/drones360";

interface Drone360ViewerProps {
  initialDroneId?: string;
  showModelPicker?: boolean;
  showSpecsPanel?: boolean;
  compact?: boolean;
  className?: string;
  onDroneChange?: (drone: Drone360Data) => void;
}

export default function Drone360Viewer({
  initialDroneId = "10x-sprayer",
  showModelPicker = true,
  showSpecsPanel = true,
  compact = false,
  className = "",
  onDroneChange
}: Drone360ViewerProps) {
  // Active drone selection
  const [selectedDroneId, setSelectedDroneId] = useState<string>(initialDroneId);
  const activeDrone = DRONES_360_CATALOG.find((d) => d.id === selectedDroneId) || DRONES_360_CATALOG[0];

  // Continuous floating point angle (from 0 to totalFrames)
  const [continuousAngle, setContinuousAngle] = useState<number>(0);
  const continuousAngleRef = useRef<number>(0);

  // Playback & interaction state
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  // Auto-spin speed: time in ms for 1 full 360 revolution (18000ms = 18s slow-mo)
  const [spinDurationMs, setSpinDurationMs] = useState<number>(18000);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoadingDrone, setIsLoadingDrone] = useState<boolean>(true);
  const [specsDrawerOpen, setSpecsDrawerOpen] = useState<boolean>(!compact);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ clientX: number; clientY: number; angle: number }>({ clientX: 0, clientY: 0, angle: 0 });
  const lastXRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  const totalFrames = activeDrone.frameCount;

  // Keep ref in sync
  useEffect(() => {
    continuousAngleRef.current = continuousAngle;
  }, [continuousAngle]);

  // Sync external drone change
  useEffect(() => {
    if (onDroneChange) {
      onDroneChange(activeDrone);
    }
  }, [activeDrone, onDroneChange]);

  // Preload frames whenever activeDrone changes
  useEffect(() => {
    setIsLoadingDrone(true);
    let loadedCount = 0;
    const droneFrames = activeDrone.frames;

    droneFrames.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount >= Math.min(8, droneFrames.length)) {
          setIsLoadingDrone(false);
        }
      };
      img.onerror = () => {
        loadedCount += 1;
        if (loadedCount >= droneFrames.length) {
          setIsLoadingDrone(false);
        }
      };
    });

    setContinuousAngle(0);
    continuousAngleRef.current = 0;
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [activeDrone.id]);

  // Silky 60fps RequestAnimationFrame Animation Loop for Slow Motion Spin & Inertia
  useEffect(() => {
    let active = true;

    const animateLoop = (timestamp: number) => {
      if (!active) return;

      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const deltaTime = Math.min(100, timestamp - lastTimestampRef.current);
      lastTimestampRef.current = timestamp;

      if (!isDragging) {
        if (isAutoRotating) {
          // Slow motion continuous angular velocity
          // full revolution in spinDurationMs ms
          const deltaAngle = (deltaTime / spinDurationMs) * totalFrames;
          let newAngle = continuousAngleRef.current + deltaAngle;
          if (newAngle >= totalFrames) newAngle %= totalFrames;
          continuousAngleRef.current = newAngle;
          setContinuousAngle(newAngle);
        } else if (Math.abs(velocityRef.current) > 0.005) {
          // Inertia coasting on drag release
          velocityRef.current *= 0.94;
          let newAngle = continuousAngleRef.current + velocityRef.current;
          if (newAngle < 0) newAngle = (newAngle % totalFrames) + totalFrames;
          if (newAngle >= totalFrames) newAngle %= totalFrames;
          continuousAngleRef.current = newAngle;
          setContinuousAngle(newAngle);
        } else {
          velocityRef.current = 0;
        }
      }

      rafIdRef.current = requestAnimationFrame(animateLoop);
    };

    rafIdRef.current = requestAnimationFrame(animateLoop);

    return () => {
      active = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      lastTimestampRef.current = null;
    };
  }, [isAutoRotating, isDragging, totalFrames, spinDurationMs]);

  // Pointer Drag Handlers for Smooth Scrubbing
  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoomLevel > 1 && e.button === 0) {
      dragStartRef.current = {
        clientX: e.clientX - panPosition.x,
        clientY: e.clientY - panPosition.y,
        angle: continuousAngleRef.current
      };
    } else {
      dragStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        angle: continuousAngleRef.current
      };
      lastXRef.current = e.clientX;
    }
    setIsDragging(true);
    velocityRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    if (zoomLevel > 1) {
      const newX = e.clientX - dragStartRef.current.clientX;
      const newY = e.clientY - dragStartRef.current.clientY;
      const maxPan = (zoomLevel - 1) * 300;
      setPanPosition({
        x: Math.max(-maxPan, Math.min(maxPan, newX)),
        y: Math.max(-maxPan, Math.min(maxPan, newY))
      });
      return;
    }

    const deltaX = e.clientX - dragStartRef.current.clientX;
    // Drag sensitivity: pixels for 1 full 360 degree spin
    const pixelsPerRotation = 650;
    const angleDelta = (deltaX / pixelsPerRotation) * totalFrames;

    let targetAngle = dragStartRef.current.angle + angleDelta;
    while (targetAngle < 0) targetAngle += totalFrames;
    targetAngle %= totalFrames;

    continuousAngleRef.current = targetAngle;
    setContinuousAngle(targetAngle);

    // Calculate instantaneous velocity for smooth inertia release
    const currentVelocity = ((e.clientX - lastXRef.current) / pixelsPerRotation) * totalFrames * 0.4;
    velocityRef.current = currentVelocity;
    lastXRef.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setIsAutoRotating(false);
      let next = continuousAngleRef.current - 1;
      if (next < 0) next += totalFrames;
      continuousAngleRef.current = next;
      setContinuousAngle(next);
    } else if (e.key === "ArrowRight") {
      setIsAutoRotating(false);
      let next = (continuousAngleRef.current + 1) % totalFrames;
      continuousAngleRef.current = next;
      setContinuousAngle(next);
    } else if (e.key === " ") {
      e.preventDefault();
      setIsAutoRotating((prev) => !prev);
    }
  };

  // Preset angle jumps
  const jumpToAngle = (degrees: number) => {
    setIsAutoRotating(false);
    velocityRef.current = 0;
    const targetFraction = degrees / 360;
    const targetAngle = (targetFraction * totalFrames) % totalFrames;
    continuousAngleRef.current = targetAngle;
    setContinuousAngle(targetAngle);
  };

  // Calculate current angle degrees and label
  const currentDegrees = Math.round(((continuousAngle % totalFrames) / totalFrames) * 360);
  const getHeadingLabel = (deg: number) => {
    if (deg >= 340 || deg <= 20) return "FRONT (0°)";
    if (deg > 20 && deg < 70) return "FRONT-RIGHT (45°)";
    if (deg >= 70 && deg <= 110) return "RIGHT PROFILE (90°)";
    if (deg > 110 && deg < 160) return "REAR-RIGHT (135°)";
    if (deg >= 160 && deg <= 200) return "REAR HEADING (180°)";
    if (deg > 200 && deg < 250) return "REAR-LEFT (225°)";
    if (deg >= 250 && deg <= 290) return "LEFT PROFILE (270°)";
    return "FRONT-LEFT (315°)";
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // CONTINUOUS DUAL-IMAGE CROSSFADE CALCULATION:
  // Sub-pixel floating point angle determines base frame and next frame
  const normalizedAngle = ((continuousAngle % totalFrames) + totalFrames) % totalFrames;
  const baseFrameIndex = Math.floor(normalizedAngle);
  const nextFrameIndex = (baseFrameIndex + 1) % totalFrames;
  // Blend progress between base and next frame (0.00 to 1.00)
  const blendFactor = normalizedAngle - baseFrameIndex;

  const baseFrameUrl = activeDrone.frames[baseFrameIndex] || activeDrone.poster;
  const nextFrameUrl = activeDrone.frames[nextFrameIndex] || activeDrone.poster;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative select-none outline-none font-sans bg-[#080d0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl ${className} ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-none p-4" : ""
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 40%, rgba(34, 197, 94, 0.08) 0%, transparent 60%),
          linear-gradient(180deg, #070c09 0%, #0a110c 100%)
        `
      }}
    >
      {/* Top Header / Model Switcher Bar */}
      {showModelPicker && (
        <div className="relative z-20 px-4 sm:px-6 pt-5 pb-3 border-b border-white/5 backdrop-blur-md bg-black/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-green-500/10 text-[#22c55e] border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                  360° SMOOTH 3D STUDIO
                </span>
                <span className="text-white/40 text-[11px] font-mono">
                  {activeDrone.frameCount} ULTRA-SMOOTH CAD ANGLES
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                {activeDrone.name}
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-white/10 text-white/70 border border-white/10">
                  {activeDrone.series}
                </span>
              </h2>
            </div>

            {/* Drone Switcher Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {DRONES_360_CATALOG.map((drone) => {
                const isActive = drone.id === selectedDroneId;
                return (
                  <button
                    key={drone.id}
                    onClick={() => {
                      setSelectedDroneId(drone.id);
                      setIsAutoRotating(true);
                    }}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-2 border ${
                      isActive
                        ? "bg-[#22c55e] text-black border-[#22c55e] shadow-lg shadow-green-500/20"
                        : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{drone.name.replace("Agrown-", "").replace("Greaydon ", "G-")}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        isActive ? "bg-black/20 text-black font-bold" : "bg-white/10 text-white/50"
                      }`}
                    >
                      {drone.payloadType}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Studio Viewport */}
      <div className="relative w-full flex flex-col items-center justify-center min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] overflow-hidden">
        {/* Aerospace Concentric Ring Pedestal Grid */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
          <div className="relative w-[340px] sm:w-[480px] lg:w-[620px] aspect-square rounded-full border border-green-500/20 flex items-center justify-center">
            {/* Smooth radar line that mirrors continuous heading */}
            <div
              className="absolute inset-0 rounded-full border border-dashed border-green-500/30"
              style={{
                transform: `rotate(${currentDegrees}deg)`,
                transition: "transform 0.05s linear"
              }}
            />
            {/* Inner concentric rings */}
            <div className="w-[75%] aspect-square rounded-full border border-white/5 flex items-center justify-center">
              <div className="w-[60%] aspect-square rounded-full border border-green-500/10 flex items-center justify-center">
                <div className="w-[45%] aspect-square rounded-full border border-white/5" />
              </div>
            </div>
            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-white/5" />
            <div className="absolute h-full w-[1px] bg-white/5" />
          </div>
        </div>

        {/* Live Heading & Telemetry Watermark */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1">
          <div className="flex items-center gap-2 font-mono text-[11px] text-white/50 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/5">
            <Compass className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>AZIMUTH: <span className="text-[#22c55e] font-bold">{currentDegrees}°</span></span>
            <span className="text-white/20">|</span>
            <span className="text-white/80">{getHeadingLabel(currentDegrees)}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-white/40 px-3">
            <span>SMOOTH CAD INTERPOLATION (60 FPS DISSOLVE)</span>
          </div>
        </div>

        {/* Interactive Scrubbing / Continuous Dual-Layer Crossfade Image Stage */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative z-10 w-full h-full flex items-center justify-center p-6 cursor-grab active:cursor-grabbing touch-none select-none transition-transform duration-75`}
          style={{
            transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`
          }}
        >
          {/* Continuous Blending Canvas Container */}
          <div className="relative flex items-center justify-center h-[380px] sm:h-[440px] lg:h-[500px] w-full max-w-5xl">
            {/* Base Layer Image (100% visible) */}
            <img
              src={baseFrameUrl}
              alt={`${activeDrone.name} - Angle ${currentDegrees}°`}
              draggable={false}
              className="absolute max-h-full max-w-[92%] object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] pointer-events-none"
              style={{
                opacity: 1
              }}
              loading="eager"
            />

            {/* Overlaid Target Layer Image (Dynamic opacity cross-fade) */}
            <img
              src={nextFrameUrl}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="absolute max-h-full max-w-[92%] object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] pointer-events-none"
              style={{
                opacity: blendFactor,
                willChange: "opacity"
              }}
              loading="eager"
            />
          </div>

          {/* Loading Overlay */}
          {isLoadingDrone && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-30">
              <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-black/80 border border-green-500/20 shadow-2xl">
                <div className="w-10 h-10 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
                <div className="text-center font-mono">
                  <div className="text-sm font-bold text-white">STREAMING SMOOTH 3D TELEMETRY</div>
                  <div className="text-xs text-white/50">Buffering {activeDrone.name} CAD angles...</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scrub Overlay Hint */}
        {!isDragging && (
          <div className="absolute bottom-20 z-10 pointer-events-none text-center hidden sm:block">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/60 text-xs font-mono">
              <RotateCcw className="w-3.5 h-3.5 text-[#22c55e] animate-spin" style={{ animationDuration: "12s" }} />
              SLOW-MOTION 3D ROTATION • DRAG HORIZONTALLY FOR SMOOTH SCRUB
            </span>
          </div>
        )}

        {/* Floating Quick Preset Angles */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-lg border border-white/10">
          {[
            { label: "FRONT", deg: 0 },
            { label: "ISO", deg: 45 },
            { label: "SIDE", deg: 90 },
            { label: "REAR", deg: 180 },
            { label: "LEFT", deg: 270 }
          ].map((preset) => {
            const isNear = Math.abs(currentDegrees - preset.deg) < 20;
            return (
              <button
                key={preset.label}
                onClick={() => jumpToAngle(preset.deg)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                  isNear
                    ? "bg-[#22c55e] text-black"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                title={`Jump to ${preset.label} view`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Zoom & View Controls Toolbar */}
        <div className="absolute bottom-20 right-4 z-20 flex flex-col gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-xl">
          <button
            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.35))}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoomLevel((z) => {
                const next = Math.max(1, z - 0.35);
                if (next === 1) setPanPosition({ x: 0, y: 0 });
                return next;
              });
            }}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          {zoomLevel > 1 && (
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanPosition({ x: 0, y: 0 });
              }}
              className="p-1.5 rounded text-[10px] font-mono text-[#22c55e] hover:bg-white/10 font-bold"
              title="Reset Zoom"
            >
              1X
            </button>
          )}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {showSpecsPanel && (
            <button
              onClick={() => setSpecsDrawerOpen((o) => !o)}
              className={`p-2 rounded-lg transition-colors ${
                specsDrawerOpen ? "text-[#22c55e] bg-green-500/10" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
              title="Toggle Drone Spec Sheet"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Bottom Scrubber Bar & Slow-Motion Playback Controls */}
      <div className="relative z-20 px-4 sm:px-6 py-4 border-t border-white/5 bg-black/60 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Play/Pause Auto Spin */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoRotating((prev) => !prev)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all border ${
                isAutoRotating
                  ? "bg-[#22c55e] text-black border-[#22c55e] shadow-lg shadow-green-500/20"
                  : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
              aria-label={isAutoRotating ? "Pause Slow-Mo Spin" : "Start Slow-Mo Spin"}
            >
              {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoRotating ? "SLOW-MO ON" : "START SLOW-MO"}</span>
            </button>

            {/* Slow Motion Speed Selector */}
            {isAutoRotating && (
              <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                {[
                  { label: "CINEMATIC (20s)", duration: 20000 },
                  { label: "SLOW (14s)", duration: 14000 },
                  { label: "GLIDE (8s)", duration: 8000 }
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSpinDurationMs(s.duration)}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider transition-colors ${
                      spinDurationMs === s.duration ? "bg-[#22c55e] text-black font-bold" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Full Continuous Slider Track */}
          <div className="flex-1 w-full flex items-center gap-3">
            <span className="text-[11px] font-mono text-white/40 w-8 text-right">0°</span>
            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min={0}
                max={360}
                step={0.5}
                value={currentDegrees}
                onChange={(e) => {
                  setIsAutoRotating(false);
                  velocityRef.current = 0;
                  const deg = Number(e.target.value);
                  const targetAngle = (deg / 360) * totalFrames;
                  continuousAngleRef.current = targetAngle;
                  setContinuousAngle(targetAngle);
                }}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#22c55e] hover:bg-white/20 transition-all focus:outline-none"
                aria-label="360 smooth rotation slider"
              />
            </div>
            <span className="text-[11px] font-mono text-white/40 w-8">360°</span>
          </div>

          {/* Angle readout badge */}
          <div className="hidden md:flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-white/80">
              <span className="text-[#22c55e] font-bold">{currentDegrees}°</span> HEADING
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Specs & Action Drawer */}
      <AnimatePresence>
        {showSpecsPanel && specsDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/10 bg-[#090f0c] p-6 lg:p-8"
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#22c55e] mb-1">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>AUTHENTIC ENGINEERING SPECIFICATIONS</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{activeDrone.name}</h3>
                  <p className="text-sm text-white/60 mt-1 max-w-2xl">{activeDrone.tagline}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/build-your-drone"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold font-mono tracking-wider bg-[#22c55e] text-black hover:bg-[#16a34a] transition-all shadow-lg shadow-green-500/20"
                  >
                    <span>CUSTOMIZE IN DRONE BUILDER</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold font-mono tracking-wider bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all"
                  >
                    <span>BOOK ON-SITE DEMO</span>
                  </Link>
                </div>
              </div>

              {/* Dynamic Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-6">
                {Object.entries(activeDrone.specs).map(([key, value]) => {
                  if (!value) return null;
                  const formattedKey = key
                    .replace(/([A-Z])/g, " $1")
                    .toUpperCase()
                    .trim();

                  return (
                    <div
                      key={key}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-green-500/20 transition-colors"
                    >
                      <div className="text-[10px] font-mono text-white/40 tracking-wider mb-1">{formattedKey}</div>
                      <div className="text-sm sm:text-base font-bold text-white tracking-tight">{value}</div>
                    </div>
                  );
                })}
              </div>

              {/* Quality & Warranty Guarantees */}
              <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-white/60 font-mono">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-white/80">
                    <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                    2-Year Comprehensive Warranty
                  </span>
                  <span className="flex items-center gap-1.5 text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                    80% Made in India Certified
                  </span>
                  <span className="flex items-center gap-1.5 text-white/80">
                    <Zap className="w-4 h-4 text-[#f59e0b]" />
                    DGCA Type Certification Compliant
                  </span>
                </div>
                <div className="text-white/40 text-[11px]">
                  Official Hyderabad Hub: Plot No 72/P, Kukatpally • +91 98855 89001
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
