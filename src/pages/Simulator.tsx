import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Pause, Play, RotateCcw, Gamepad2, Layers, ArrowLeft } from "lucide-react";
import { buildSimulator, DroneState, MissionStatus, Waypoint } from "../components/simulator/SimulatorEngine";
import { agriculturePayloads, otherPayloads, IndustryType } from "../data/configurator";

// Virtual Joystick for mobile
function VirtualJoystick({
  label,
  onMove,
}: {
  label: string;
  onMove: (x: number, y: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ active: boolean; startX: number; startY: number }>({ active: false, startX: 0, startY: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragRef.current = { active: true, startX: touch.clientX, startY: touch.clientY };
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!dragRef.current.active || !containerRef.current || !stickRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragRef.current.startX;
    const dy = touch.clientY - dragRef.current.startY;
    const maxR = 28;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const scale = dist > maxR ? maxR / dist : 1;
    const cx = dx * scale;
    const cy = dy * scale;
    stickRef.current.style.transform = `translate(${cx}px, ${cy}px)`;
    onMove(cx / maxR, cy / maxR);
  }, [onMove]);

  const handleTouchEnd = useCallback(() => {
    dragRef.current.active = false;
    if (stickRef.current) stickRef.current.style.transform = "translate(0,0)";
    onMove(0, 0);
  }, [onMove]);

  useEffect(() => {
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchMove, handleTouchEnd]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="text-label-sm text-[#4a5c4a]">{label}</div>
      <div
        ref={containerRef}
        className="relative w-20 h-20 rounded-full border border-white/15 flex items-center justify-center cursor-pointer select-none"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
        onTouchStart={handleTouchStart}
      >
        <div
          ref={stickRef}
          className="w-8 h-8 rounded-full bg-[#22c55e] border border-[#22c55e]/60 transition-transform"
          style={{ touchAction: "none", willChange: "transform" }}
        />
      </div>
    </div>
  );
}

// Radar minimap
function RadarMap({
  position,
  waypoints,
}: {
  position: { x: number; z: number };
  waypoints: Waypoint[];
}) {
  const size = 110;
  const scale = size / 200;
  const cx = size / 2 + position.x * scale;
  const cz = size / 2 + position.z * scale;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="block"
    >
      <rect width={size} height={size} fill="rgba(8,13,8,0.92)" rx="2" />
      <rect width={size} height={size} fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="1" rx="2" />
      {[0.25, 0.5, 0.75].map((f) => (
        <g key={f}>
          <line x1={size * f} y1={0} x2={size * f} y2={size} stroke="rgba(34,197,94,0.15)" />
          <line x1={0} y1={size * f} x2={size} y2={size * f} stroke="rgba(34,197,94,0.15)" />
        </g>
      ))}
      <circle cx={size / 2} cy={size / 2} r={size * 0.44} fill="none" stroke="rgba(34,197,94,0.2)" strokeWidth="0.5" />
      {waypoints.map((wp, i) => {
        const wx = size / 2 + wp.position.x * scale;
        const wz = size / 2 + wp.position.z * scale;
        return (
          <g key={i}>
            <circle
              cx={wx}
              cy={wz}
              r={3.5}
              fill={wp.reached ? "rgba(34,197,94,0.3)" : "#f59e0b"}
              stroke={wp.reached ? "none" : "#fbbf24"}
              strokeWidth="0.8"
            />
            {!wp.reached && (
              <text x={wx + 4} y={wz + 3} fontSize="6" fill="#fbbf24" fontFamily="monospace">
                {wp.label.replace("WAYPOINT ", "W")}
              </text>
            )}
          </g>
        );
      })}
      <circle cx={Math.max(4, Math.min(size - 4, cx))} cy={Math.max(4, Math.min(size - 4, cz))} r={3.5} fill="#22c55e" />
      <circle cx={Math.max(4, Math.min(size - 4, cx))} cy={Math.max(4, Math.min(size - 4, cz))} r={6} fill="none" stroke="rgba(34,197,94,0.6)" strokeWidth="0.6" />
      <text x={4} y={size - 4} fontSize="6" fill="rgba(34,197,94,0.6)" fontFamily="monospace">RADAR</text>
    </svg>
  );
}

// ── Main Simulator Page ───────────────────────────────────────────────────────
export default function Simulator() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial query params
  const initialIndustry = (searchParams.get("industry") as IndustryType) || "agriculture";
  const initialPayload = searchParams.get("payload") || (initialIndustry === "agriculture" ? "sprayer" : "solar-cleaning");

  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>(initialIndustry);
  const [selectedPayload, setSelectedPayload] = useState<string>(initialPayload);
  const [showMissionDrawer, setShowMissionDrawer] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<ReturnType<typeof buildSimulator> | null>(null);

  const [started, setStarted] = useState(false);
  const [paused, setPausedState] = useState(false);

  const [droneTelemetry, setDroneTelemetry] = useState<DroneState>({
    position: { x: 0, y: 3, z: 0 } as any,
    velocity: { x: 0, y: 0, z: 0 } as any,
    yaw: 0,
    pitch: 0,
    roll: 0,
    altitude: 3,
    battery: 100,
    speed: 0,
    actionActive: true,
    actionMetric: "INITIALIZING...",
    industry: selectedIndustry,
    payload: selectedPayload,
    workProgress: 0,
  });

  const [missionState, setMissionState] = useState<MissionStatus>({
    active: true,
    currentWaypoint: 0,
    complete: false,
    score: 0,
  });

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Active mission details lookup
  const activeMissionDetails = useMemo(() => {
    const all = [...agriculturePayloads, ...otherPayloads];
    return all.find((m) => m.id === selectedPayload) || agriculturePayloads[0];
  }, [selectedPayload]);

  // Synchronize URL query params
  const applyMission = (ind: IndustryType, pld: string) => {
    setSelectedIndustry(ind);
    setSelectedPayload(pld);
    setSearchParams({ industry: ind, payload: pld });
    if (simRef.current) {
      simRef.current.setMissionConfig(ind, pld);
    }
  };

  const startSim = useCallback(() => {
    setStarted(true);
  }, []);

  useEffect(() => {
    if (!started || !containerRef.current) return;

    const sim = buildSimulator(containerRef.current, {
      industry: selectedIndustry,
      payload: selectedPayload,
    });
    simRef.current = sim;

    sim.onStateChange((s) => {
      setDroneTelemetry({ ...s });
      setWaypoints(sim.getWaypoints());
    });

    sim.onMissionChange((m) => setMissionState({ ...m }));

    timerRef.current = setInterval(() => {
      setElapsedTime((t) => t + 1);
    }, 1000);

    return () => {
      sim.destroy();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started]);

  const handlePause = useCallback(() => {
    if (!simRef.current) return;
    const newPaused = !paused;
    setPausedState(newPaused);
    simRef.current.setPaused(newPaused);
    if (newPaused && timerRef.current) clearInterval(timerRef.current);
    else timerRef.current = setInterval(() => setElapsedTime((t) => t + 1), 1000);
  }, [paused]);

  const handleReset = useCallback(() => {
    if (!simRef.current) return;
    simRef.current.resetDrone();
    setMissionState({ active: true, currentWaypoint: 0, complete: false, score: 0 });
    setElapsedTime(0);
    setPausedState(false);
    simRef.current.setPaused(false);
  }, []);

  const handleToggleAction = useCallback(() => {
    if (!simRef.current) return;
    simRef.current.toggleAction();
  }, []);

  useEffect(() => {
    return () => {
      simRef.current?.destroy();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#070c08" }}>
      <div className="h-20" />

      {/* ── Pre-launch screen ─────────────────────────────────────────────────── */}
      {!started ? (
        <section className="flex-1 flex flex-col items-center justify-center px-6 text-center py-16 max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="text-label text-[#f59e0b] mb-3 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              GoAG AEROSPACE 3D FLIGHT SIMULATOR
            </div>
            <h1
              className="font-bold text-[#f3f4f6] mb-4 tracking-tight leading-[1.12]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.4rem)" }}
            >
              REAL-TIME MISSION <span className="text-[#22c55e]">FLIGHT SIMULATOR</span>
            </h1>
            <p className="text-[#9ca3af] text-[17px] max-w-2xl mx-auto mb-8 leading-relaxed">
              Experience the physical aerodynamics and dynamic work imitation of your configured GoAG drone. Powered by hardware physics and field-accurate simulation.
            </p>

            {/* ── MISSION & APPLICATION SELECTOR ────────────────────────────── */}
            <div className="mb-10 border border-white/10 rounded-sm p-6 text-left shadow-2xl" style={{ background: "#0e1610" }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/10 gap-3 mb-5">
                <div>
                  <div className="text-label text-[#22c55e] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                    SELECT INDUSTRY & MISSION APPLICATION
                  </div>
                  <div className="text-[13px] text-[#9ca3af] mt-0.5">
                    Choose the task to experience the authentic 3D environment & dynamic work action.
                  </div>
                </div>

                {/* Industry Toggle: Agriculture vs Other */}
                <div className="flex items-center gap-1.5 p-1 bg-[#070c08] border border-white/10 rounded-sm">
                  <button
                    id="sim-ind-agriculture"
                    onClick={() => applyMission("agriculture", "sprayer")}
                    className="px-4 py-2 rounded-sm text-[12px] font-bold transition-all"
                    style={{
                      background: selectedIndustry === "agriculture" ? "#22c55e" : "transparent",
                      color: selectedIndustry === "agriculture" ? "#070c08" : "#9ca3af",
                    }}
                  >
                    🌱 AGRICULTURE
                  </button>
                  <button
                    id="sim-ind-other"
                    onClick={() => applyMission("other", "solar-cleaning")}
                    className="px-4 py-2 rounded-sm text-[12px] font-bold transition-all"
                    style={{
                      background: selectedIndustry === "other" ? "#f59e0b" : "transparent",
                      color: selectedIndustry === "other" ? "#070c08" : "#9ca3af",
                    }}
                  >
                    ⚙️ OTHER
                  </button>
                </div>
              </div>

              {/* Sub-options for Selected Industry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {(selectedIndustry === "agriculture" ? agriculturePayloads : otherPayloads).map((opt) => {
                  const isSelected = selectedPayload === opt.id;
                  return (
                    <button
                      key={opt.id}
                      id={`sim-opt-${opt.id}`}
                      onClick={() => applyMission(selectedIndustry, opt.id)}
                      className="p-4 rounded-sm border text-left transition-all flex flex-col justify-between"
                      style={{
                        background: isSelected ? "rgba(245,158,11,0.12)" : "#070c08",
                        borderColor: isSelected ? "#f59e0b" : "rgba(255,255,255,0.08)",
                      }}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[13.5px] font-bold text-[#f3f4f6]">{opt.label}</span>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />}
                        </div>
                        <div className="text-[11px] text-[#fbbf24] font-medium mb-1">{opt.subLabel}</div>
                        <div className="text-[11.5px] text-[#9ca3af] leading-relaxed line-clamp-2">
                          {opt.description}
                        </div>
                      </div>
                      <div className="text-[10.5px] font-mono text-[#22c55e] mt-3 pt-2 border-t border-white/10">
                        {opt.industry === "agriculture"
                          ? opt.id === "sprayer"
                            ? "🌽 Maize field spraying mist"
                            : "🌱 Granular broadcast disc"
                          : "⚙️ Dynamic active simulation"}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Mission Summary Banner */}
              <div className="mt-5 p-4 rounded-sm border border-white/10 bg-[#070c08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[14px] font-bold text-[#f3f4f6] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
                    SIMULATING: {activeMissionDetails?.label.toUpperCase()}
                  </div>
                  <div className="text-[12.5px] text-[#9ca3af] mt-0.5">
                    {selectedIndustry === "agriculture"
                      ? "Lush authentic maize crop field with furrowed soil. Drone features dynamic atomized spray mist and wet swath coverage."
                      : activeMissionDetails?.description}
                  </div>
                </div>
                <div className="font-mono text-[12px] text-[#fbbf24] whitespace-nowrap bg-white/[0.04] px-3 py-1.5 border border-white/10 rounded-sm">
                  KEY [E]: WORK ACTION TOGGLE
                </div>
              </div>
            </div>

            {/* Controls Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 text-left">
              <div className="border border-white/10 rounded-sm p-6 shadow-xl" style={{ background: "#0e1610" }}>
                <div className="text-label text-[#f59e0b] mb-4 font-bold">DESKTOP FLIGHT CONTROLS</div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {[
                    ["W / S", "Forward / Backward"],
                    ["A / D", "Strafe Left / Right"],
                    ["← →", "Yaw (Turn)"],
                    ["SPACE", "Ascend (Thrust)"],
                    ["CTRL", "Descend"],
                    ["E", "Toggle Work Action"],
                    ["R", "Reset Drone"],
                    ["ESC", "Pause Flight"],
                  ].map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2.5">
                      <kbd className="px-2 py-1 text-[11px] font-mono text-[#fbbf24] border border-[#f59e0b]/40 font-bold rounded bg-[#f59e0b]/10 min-w-8 text-center">
                        {key}
                      </kbd>
                      <span className="text-[13px] text-[#9ca3af]">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-white/10 rounded-sm p-6 shadow-xl" style={{ background: "#0e1610" }}>
                <div className="text-label text-[#22c55e] mb-4 font-bold">MISSION OBJECTIVES</div>
                <div className="space-y-3">
                  {["A", "B", "C"].map((wp, i) => (
                    <div key={wp} className="flex items-center gap-3">
                      <div className="w-6 h-6 border border-[#22c55e]/50 flex items-center justify-center rounded-sm bg-[#22c55e]/10">
                        <span className="text-[11px] text-[#22c55e] font-mono font-bold">{wp}</span>
                      </div>
                      <span className="text-[13.5px] text-[#9ca3af]">
                        {[
                          "Fly over Waypoint Alpha (field sector north)",
                          "Execute active mission pass at Waypoint Bravo",
                          "High-altitude telemetric return at Waypoint Charlie",
                        ][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="start-simulator-btn"
                onClick={startSim}
                className="btn-amber px-12 py-5 rounded-sm text-[14px] font-bold flex items-center gap-3 shadow-xl shadow-[#f59e0b]/25"
              >
                <Gamepad2 className="w-5 h-5" />
                LAUNCH FLIGHT SIMULATOR ({activeMissionDetails?.label.toUpperCase()})
              </button>

              <button
                onClick={() => navigate("/build-your-drone")}
                className="btn-outline px-6 py-5 rounded-sm text-[13px] font-bold flex items-center gap-2 text-[#9ca3af] hover:text-[#f3f4f6]"
              >
                <ArrowLeft className="w-4 h-4" /> BACK TO CONFIGURATOR
              </button>
            </div>
          </motion.div>
        </section>
      ) : (
        /* ── Active simulator ───────────────────────────────────────────────── */
        <div className="flex-1 relative" style={{ minHeight: "calc(100vh - 80px)" }}>
          {/* Canvas container */}
          <div ref={containerRef} className="absolute inset-0" />

          {/* ── HUD ─────────────────────────────────────────────────────────── */}
          <div className="absolute inset-0 pointer-events-none select-none">
            {/* Top HUD bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4">
              {/* Left: Time & Flight Status */}
              <div
                className="px-4 py-2.5 border border-white/10 rounded-sm flex items-center gap-4"
                style={{ background: "rgba(7,12,8,0.9)", backdropFilter: "blur(8px)" }}
              >
                <div>
                  <div className="text-label-sm text-[#9ca3af] mb-0.5">TIME</div>
                  <div className="text-[#f3f4f6] font-mono font-bold text-lg leading-none">
                    {formatTime(elapsedTime)}
                  </div>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div>
                  <div className="text-label-sm text-[#22c55e] mb-0.5">ACTIVE MISSION</div>
                  <div className="text-[#f3f4f6] font-bold text-[13px] leading-none">
                    {activeMissionDetails?.label.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Center: Real-time Work Action Banner */}
              <div
                className="px-5 py-2.5 border border-white/10 flex items-center gap-3.5 rounded-sm pointer-events-auto"
                style={{ background: "rgba(7,12,8,0.9)", backdropFilter: "blur(8px)" }}
              >
                <button
                  id="action-toggle-hud-btn"
                  onClick={handleToggleAction}
                  className="flex items-center gap-2 px-3 py-1 rounded-sm border transition-all text-[11.5px] font-mono font-bold"
                  style={{
                    background: droneTelemetry.actionActive ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.18)",
                    borderColor: droneTelemetry.actionActive ? "#22c55e" : "#ef4444",
                    color: droneTelemetry.actionActive ? "#22c55e" : "#ef4444",
                  }}
                >
                  <span className="w-2 h-2 rounded-full animate-ping" style={{ background: droneTelemetry.actionActive ? "#22c55e" : "#ef4444" }} />
                  {droneTelemetry.actionActive ? "ACTION: ACTIVE [E]" : "ACTION: OFF [E]"}
                </button>

                <div className="h-6 w-px bg-white/10" />

                <div className="text-[12px] font-mono text-[#fbbf24]">
                  {droneTelemetry.actionMetric}
                </div>
              </div>

              {/* Right: Waypoint progress & Score */}
              <div
                className="px-4 py-2.5 border border-white/10 flex items-center gap-4 rounded-sm"
                style={{ background: "rgba(7,12,8,0.9)", backdropFilter: "blur(8px)" }}
              >
                <div className="flex items-center gap-2">
                  {["A", "B", "C"].map((wp, i) => (
                    <div
                      key={wp}
                      className="w-6 h-6 border flex items-center justify-center rounded-sm"
                      style={{
                        borderColor: missionState.currentWaypoint > i
                          ? "#22c55e"
                          : missionState.currentWaypoint === i
                            ? "#f59e0b"
                            : "rgba(255,255,255,0.15)",
                        background: missionState.currentWaypoint > i
                          ? "rgba(34,197,94,0.2)"
                          : missionState.currentWaypoint === i
                            ? "rgba(245,158,11,0.2)"
                            : "transparent",
                      }}
                    >
                      <span
                        className="text-[10px] font-mono font-bold"
                        style={{ color: missionState.currentWaypoint > i ? "#22c55e" : missionState.currentWaypoint === i ? "#fbbf24" : "#9ca3af" }}
                      >
                        {missionState.currentWaypoint > i ? "✓" : wp}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-6 w-px bg-white/10" />

                <div className="text-right">
                  <div className="text-label-sm text-[#9ca3af] mb-0.5">SCORE</div>
                  <div className="text-[#fbbf24] font-mono font-bold text-lg leading-none">
                    {missionState.score}
                  </div>
                </div>
              </div>
            </div>

            {/* Left: Altitude + Speed + Work Coverage */}
            <div
              className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 px-4 py-5 border border-white/10 rounded-sm"
              style={{ background: "rgba(7,12,8,0.88)", backdropFilter: "blur(8px)" }}
            >
              {[
                { label: "ALT", val: `${droneTelemetry.altitude.toFixed(1)}m` },
                { label: "SPD", val: `${(droneTelemetry.speed * 3.6).toFixed(1)} km/h` },
                { label: "PROGRESS", val: `${droneTelemetry.workProgress}%` },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-label-sm text-[#9ca3af]">{item.label}</div>
                  <div className="font-mono text-[#f3f4f6] text-[15px] font-bold">{item.val}</div>
                </div>
              ))}
            </div>

            {/* Bottom right: Battery + Radar */}
            <div className="absolute bottom-20 right-6 flex flex-col items-end gap-3.5">
              {/* Battery */}
              <div
                className="px-4 py-2.5 border border-white/10 rounded-sm"
                style={{ background: "rgba(7,12,8,0.88)", backdropFilter: "blur(8px)" }}
              >
                <div className="text-label-sm text-[#9ca3af] mb-1">BATTERY</div>
                <div className="flex items-center gap-3">
                  <div className="w-28 h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${droneTelemetry.battery}%`,
                        background: droneTelemetry.battery > 30 ? "#22c55e" : droneTelemetry.battery > 15 ? "#f59e0b" : "#ef4444",
                      }}
                    />
                  </div>
                  <span className="font-mono text-[#f3f4f6] text-[12px] font-bold">
                    {droneTelemetry.battery.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Radar */}
              <div className="border border-[#22c55e]/30 rounded-sm overflow-hidden shadow-lg">
                <RadarMap position={{ x: droneTelemetry.position.x ?? 0, z: droneTelemetry.position.z ?? 0 }} waypoints={waypoints} />
              </div>
            </div>

            {/* Controls hint */}
            <div
              className="absolute bottom-20 left-6 px-4 py-3 border border-white/10 text-[11px] font-mono text-[#9ca3af] rounded-sm"
              style={{ background: "rgba(7,12,8,0.8)", backdropFilter: "blur(8px)" }}
            >
              <div>W/S — FWD/BCK · A/D — STRAFE</div>
              <div>SPACE/CTRL — ALTITUDE</div>
              <div>← → — YAW (TURN)</div>
              <div className="text-[#fbbf24] font-bold">E — WORK ACTION TOGGLE</div>
              <div>R — RESET · ESC — PAUSE</div>
            </div>
          </div>

          {/* ── Bottom controls bar (pointer-events on) ─────────────────────── */}
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 border-t border-white/10"
            style={{ background: "rgba(7,12,8,0.95)", backdropFilter: "blur(12px)" }}
          >
            {/* Mobile joystick */}
            <div className="flex items-center gap-6 md:opacity-0 pointer-events-auto">
              <VirtualJoystick label="MOVE" onMove={() => {}} />
              <VirtualJoystick label="YAW / ALT" onMove={() => {}} />
            </div>

            {/* Center buttons: Mission Switcher + Pause + Reset */}
            <div className="flex items-center gap-3 pointer-events-auto">
              {/* Mission quick switch button */}
              <button
                id="switch-mission-btn"
                onClick={() => setShowMissionDrawer(!showMissionDrawer)}
                className="btn-outline px-5 py-3 rounded-sm flex items-center gap-2 font-bold text-[12.5px] border-[#f59e0b]/50 text-[#fbbf24]"
              >
                <Layers className="w-3.5 h-3.5" />
                SWITCH MISSION ({activeMissionDetails?.label})
              </button>

              <button
                id="sim-pause-btn"
                onClick={handlePause}
                className="btn-outline px-6 py-3 rounded-sm flex items-center gap-2 font-bold text-[12.5px]"
              >
                {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                {paused ? "RESUME" : "PAUSE"}
              </button>

              <button
                id="sim-reset-btn"
                onClick={handleReset}
                className="btn-outline px-6 py-3 rounded-sm flex items-center gap-2 font-bold text-[12.5px]"
              >
                <RotateCcw className="w-3.5 h-3.5" /> RESET
              </button>
            </div>

            <button
              onClick={() => navigate("/build-your-drone")}
              className="text-[12px] font-mono text-[#9ca3af] hover:text-[#f3f4f6] pointer-events-auto"
            >
              EXIT SIMULATOR →
            </button>
          </div>

          {/* ── Mission Switch Drawer Overlay ─────────────────────────────────── */}
          <AnimatePresence>
            {showMissionDrawer && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[92vw] border border-white/15 p-6 rounded-sm shadow-2xl"
                style={{ background: "#0e1610", backdropFilter: "blur(16px)" }}
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                    <span className="text-[14px] font-bold text-[#f3f4f6]">SELECT FLIGHT MISSION</span>
                  </div>
                  <button
                    onClick={() => setShowMissionDrawer(false)}
                    className="text-[11px] font-mono text-[#9ca3af] hover:text-white px-2 py-1 border border-white/10 rounded"
                  >
                    CLOSE [ESC]
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Agriculture Group */}
                  <div>
                    <div className="text-label-sm text-[#22c55e] mb-2 font-bold">1. AGRICULTURE (MAIZE CROP FIELD)</div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {agriculturePayloads.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            applyMission("agriculture", opt.id);
                            setShowMissionDrawer(false);
                          }}
                          className="p-3 text-left border rounded-sm transition-all"
                          style={{
                            background: selectedPayload === opt.id ? "rgba(34,197,94,0.15)" : "#070c08",
                            borderColor: selectedPayload === opt.id ? "#22c55e" : "rgba(255,255,255,0.08)",
                          }}
                        >
                          <div className="text-[13px] font-bold text-[#f3f4f6]">{opt.label}</div>
                          <div className="text-[11px] text-[#9ca3af]">{opt.subLabel}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Other Group */}
                  <div>
                    <div className="text-label-sm text-[#f59e0b] mb-2 font-bold">2. OTHER INDUSTRIAL & TACTICAL</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {otherPayloads.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            applyMission("other", opt.id);
                            setShowMissionDrawer(false);
                          }}
                          className="p-2.5 text-left border rounded-sm transition-all"
                          style={{
                            background: selectedPayload === opt.id ? "rgba(245,158,11,0.15)" : "#070c08",
                            borderColor: selectedPayload === opt.id ? "#f59e0b" : "rgba(255,255,255,0.08)",
                          }}
                        >
                          <div className="text-[12px] font-bold text-[#f3f4f6] truncate">{opt.label}</div>
                          <div className="text-[10px] text-[#9ca3af] truncate">{opt.subLabel}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Pause overlay ────────────────────────────────────────────────── */}
          <AnimatePresence>
            {paused && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-20"
                style={{ background: "rgba(7,12,8,0.8)", backdropFilter: "blur(12px)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center">
                  <div className="text-label text-[#f59e0b] mb-3 font-bold">PAUSED</div>
                  <h2
                    className="font-bold text-[#f3f4f6] mb-6"
                    style={{ fontSize: "3rem", letterSpacing: "-0.04em", lineHeight: 0.9 }}
                  >
                    MISSION ON HOLD
                  </h2>
                  <button
                    onClick={handlePause}
                    className="btn-amber px-9 py-4 rounded-sm flex items-center gap-2 mx-auto font-bold shadow-xl"
                  >
                    <Play className="w-4 h-4" /> RESUME FLIGHT
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Mission complete overlay ─────────────────────────────────────── */}
          <AnimatePresence>
            {missionState.complete && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-30"
                style={{ background: "rgba(7,12,8,0.9)", backdropFilter: "blur(16px)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-center px-6">
                  <motion.div
                    className="text-label text-[#f59e0b] mb-3 font-bold"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    MISSION ACCOMPLISHED
                  </motion.div>
                  <motion.h2
                    className="font-bold text-[#f3f4f6] mb-2"
                    style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 0.9 }}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                  >
                    EXCELLENT WORK,
                    <br />
                    <span style={{ color: "#22c55e" }}>COMMANDER.</span>
                  </motion.h2>
                  <div className="text-[16px] text-[#9ca3af] mb-4">
                    Target application: <strong className="text-[#fbbf24]">{activeMissionDetails?.label}</strong> completed successfully.
                  </div>
                  <motion.div
                    className="text-label text-[#fbbf24] mb-8 text-4xl font-mono font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {missionState.score} PTS
                  </motion.div>
                  <motion.div
                    className="flex items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <button onClick={handleReset} className="btn-amber px-9 py-4 rounded-sm flex items-center gap-2 font-bold shadow-xl">
                      <RotateCcw className="w-4 h-4" /> FLY AGAIN
                    </button>
                    <button onClick={() => navigate("/build-your-drone")} className="btn-outline px-7 py-4 rounded-sm flex items-center gap-2 font-bold text-[#f3f4f6]">
                      CONFIGURE ANOTHER DRONE
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
