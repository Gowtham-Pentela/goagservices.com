import * as THREE from "three";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface DroneState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  yaw: number;
  pitch: number;
  roll: number;
  altitude: number;
  battery: number;
  speed: number;
  actionActive: boolean;
  actionMetric: string;
  industry: string;
  payload: string;
  workProgress: number;
}

export interface Waypoint {
  position: THREE.Vector3;
  reached: boolean;
  label: string;
}

export interface MissionStatus {
  active: boolean;
  currentWaypoint: number;
  complete: boolean;
  score: number;
}

export interface SimulatorAPI {
  canvas: HTMLCanvasElement;
  destroy: () => void;
  getState: () => DroneState;
  getMission: () => MissionStatus;
  getWaypoints: () => Waypoint[];
  resetDrone: () => void;
  setPaused: (v: boolean) => void;
  toggleAction: () => boolean;
  setActionActive: (v: boolean) => void;
  setMissionConfig: (industry: string, payload: string) => void;
  onStateChange: (cb: (s: DroneState) => void) => void;
  onMissionChange: (cb: (m: MissionStatus) => void) => void;
}

// ── Helper: Create Maize Plant Geometry ──────────────────────────────────────
function createMaizePlant(): THREE.Group {
  const plantGroup = new THREE.Group();

  // Stalk
  const stalkMat = new THREE.MeshStandardMaterial({
    color: 0x4a7c2e,
    roughness: 0.8,
  });
  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 2.0, 6), stalkMat);
  stalk.position.y = 1.0;
  stalk.castShadow = true;
  stalk.receiveShadow = true;
  plantGroup.add(stalk);

  // Nodes on stalk
  const nodeMat = new THREE.MeshStandardMaterial({ color: 0x3d6624 });
  for (let ny = 0.4; ny <= 1.6; ny += 0.4) {
    const nodeRing = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.03, 6), nodeMat);
    nodeRing.position.y = ny;
    plantGroup.add(nodeRing);
  }

  // Drooping arching corn leaves
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x558f32,
    roughness: 0.7,
    side: THREE.DoubleSide,
  });

  const leafAngles = [0.2, 1.8, 3.3, 4.9, 0.9, 2.5];
  const leafHeights = [0.6, 0.9, 1.2, 1.4, 1.6, 1.75];

  leafAngles.forEach((angle, idx) => {
    const leafCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.cos(angle) * 0.4, 0.15, Math.sin(angle) * 0.4),
      new THREE.Vector3(Math.cos(angle) * 0.8, -0.1, Math.sin(angle) * 0.8),
      new THREE.Vector3(Math.cos(angle) * 1.1, -0.45, Math.sin(angle) * 1.1),
    ]);
    const leafGeo = new THREE.TubeGeometry(leafCurve, 8, 0.045 * (1 - idx * 0.08), 4, false);
    const leafMesh = new THREE.Mesh(leafGeo, leafMat);
    leafMesh.position.y = leafHeights[idx];
    leafMesh.castShadow = true;
    plantGroup.add(leafMesh);
  });

  // Tassel (top flower silk)
  const tasselMat = new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.9 });
  const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 5), tasselMat);
  tassel.position.y = 2.15;
  plantGroup.add(tassel);

  // Corn ears on stalk
  const huskMat = new THREE.MeshStandardMaterial({ color: 0x7da43b });
  const ear = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.35, 6), huskMat);
  ear.position.set(0.08, 1.1, 0.05);
  ear.rotation.z = -0.45;
  plantGroup.add(ear);

  return plantGroup;
}

// ── Helper: Create 3D Stick Man Figure ───────────────────────────────────────
function createStickMan(color = 0x38bdf8, pose = 0): THREE.Group {
  const man = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 0.5,
    roughness: 0.4,
    metalness: 0.2,
  });

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), mat);
  head.position.y = 1.75;
  head.castShadow = true;
  man.add(head);

  // Torso
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.72), mat);
  torso.position.y = 1.25;
  torso.castShadow = true;
  man.add(torso);

  // Hips
  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.28), mat);
  hips.rotation.z = Math.PI / 2;
  hips.position.y = 0.88;
  man.add(hips);

  // Legs standing on ground
  [-0.1, 0.1].forEach((lx) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.88), mat);
    leg.position.set(lx, 0.44, 0);
    leg.castShadow = true;
    man.add(leg);
  });

  // Arms according to pose
  if (pose === 0) {
    // Left arm raised & pointing up at the hologram in awe
    const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.75), mat);
    arm1.position.set(0.22, 1.52, 0.2);
    arm1.rotation.x = -Math.PI / 2.8;
    arm1.rotation.z = -0.35;
    man.add(arm1);

    const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.62), mat);
    arm2.position.set(-0.22, 1.15, 0);
    arm2.rotation.z = 0.2;
    man.add(arm2);
  } else if (pose === 1) {
    // Both arms raised cheering at the hologram
    [-0.22, 0.22].forEach((ax, idx) => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7), mat);
      arm.position.set(ax, 1.55, 0.1);
      arm.rotation.x = -Math.PI / 3.5;
      arm.rotation.z = idx === 0 ? 0.45 : -0.45;
      man.add(arm);
    });
  } else {
    // Hands on hips, head tilted up
    [-0.2, 0.2].forEach((ax, idx) => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.52), mat);
      arm.position.set(ax, 1.2, 0.05);
      arm.rotation.z = idx === 0 ? 0.55 : -0.55;
      man.add(arm);
    });
  }

  return man;
}

// ── Simulator Engine ─────────────────────────────────────────────────────────
export function buildSimulator(
  container: HTMLElement,
  initialConfig: { industry?: string; payload?: string } = {}
): SimulatorAPI {
  let currentIndustry = initialConfig.industry || "agriculture";
  let currentPayload = initialConfig.payload || (currentIndustry === "agriculture" ? "sprayer" : "solar-cleaning");

  // ── Renderer ──
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  container.appendChild(renderer.domElement);

  // ── Scene ──
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a160d);
  scene.fog = new THREE.Fog(0x0a160d, 70, 220);

  // ── Camera ──
  const camera = new THREE.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.1, 600);
  camera.position.set(0, 5, -10);

  // ── Lighting ──
  const ambient = new THREE.AmbientLight(0x2a3d2c, 0.9);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfffae0, 1.6);
  sun.position.set(50, 90, 40);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 350;
  sun.shadow.camera.left = -90;
  sun.shadow.camera.right = 90;
  sun.shadow.camera.top = 90;
  sun.shadow.camera.bottom = -90;
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0x5a7a58, 0.4);
  fill.position.set(-30, 25, -20);
  scene.add(fill);

  // ── Environment Root Group ──
  const envGroup = new THREE.Group();
  scene.add(envGroup);

  // ── Action Visuals Root Group ──
  const actionGroup = new THREE.Group();
  scene.add(actionGroup);

  // ── Drone Root Group ──
  const droneGroup = new THREE.Group();
  droneGroup.position.set(0, 3, 0);
  droneGroup.castShadow = true;
  scene.add(droneGroup);

  // ── Build Base Airframe (Hexacopter) ──
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x141a14, metalness: 0.7, roughness: 0.25 });
  const armMat = new THREE.MeshStandardMaterial({ color: 0x0d120d, metalness: 0.8, roughness: 0.2 });
  const amberLedMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.8 });
  const greenLedMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.8 });
  const propMat = new THREE.MeshStandardMaterial({ color: 0x1b231b, transparent: true, opacity: 0.75 });

  // Central Hub
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.1, 8), bodyMat);
  body.castShadow = true;
  droneGroup.add(body);

  // Avionics Dome
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), bodyMat);
  dome.position.y = 0.05;
  droneGroup.add(dome);

  // Landing Gear Skids
  const skidMat = new THREE.MeshStandardMaterial({ color: 0x181e18, metalness: 0.6 });
  [-0.18, 0.18].forEach((gx) => {
    const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.22), skidMat);
    leg1.position.set(gx, -0.11, 0.12);
    leg1.rotation.x = 0.2;
    droneGroup.add(leg1);

    const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.22), skidMat);
    leg2.position.set(gx, -0.11, -0.12);
    leg2.rotation.x = -0.2;
    droneGroup.add(leg2);

    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.44), skidMat);
    bar.rotation.x = Math.PI / 2;
    bar.position.set(gx, -0.22, 0);
    droneGroup.add(bar);
  });

  // 6 Arms & Propellers
  const propGroups: THREE.Group[] = [];
  const armAngles = [0, 1, 2, 3, 4, 5].map((i) => (i * Math.PI * 2) / 6);
  armAngles.forEach((angle, idx) => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.02, 0.025), armMat);
    arm.position.set(Math.sin(angle) * 0.35, 0, Math.cos(angle) * 0.35);
    arm.rotation.y = -angle;
    arm.castShadow = true;
    droneGroup.add(arm);

    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.045, 8), bodyMat);
    motor.position.set(Math.sin(angle) * 0.58, 0.025, Math.cos(angle) * 0.58);
    droneGroup.add(motor);

    const led = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.005, 4, 12), idx < 2 ? amberLedMat : greenLedMat);
    led.position.copy(motor.position);
    led.position.y -= 0.012;
    droneGroup.add(led);

    const propGroup = new THREE.Group();
    propGroup.position.set(Math.sin(angle) * 0.58, 0.065, Math.cos(angle) * 0.58);
    const propBlade = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.005, 0.032), propMat);
    propGroup.add(propBlade);
    droneGroup.add(propGroup);
    propGroups.push(propGroup);
  });

  // Drone spotlight
  const droneLight = new THREE.PointLight(0x22c55e, 0.8, 14);
  droneLight.position.y = -0.15;
  droneGroup.add(droneLight);

  // ── Dynamic Payload Hardware Attachment Slot ──
  const payloadAttachmentGroup = new THREE.Group();
  payloadAttachmentGroup.position.y = -0.14;
  droneGroup.add(payloadAttachmentGroup);

  // ── Screen Video Setup (Screen.mp4 from Images folder) ──
  const screenVideo = document.createElement("video");
  screenVideo.src = "/Screen.mp4";
  screenVideo.crossOrigin = "anonymous";
  screenVideo.loop = true;
  screenVideo.muted = true;
  screenVideo.playsInline = true;
  screenVideo.autoplay = true;
  screenVideo.play().catch(() => {});
  const videoTexture = new THREE.VideoTexture(screenVideo);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBAFormat;

  // ── Hologram Logo Texture (logo.png from Images folder) ──
  const logoTexture = new THREE.TextureLoader().load("/logo.png");

  // ── Mission State ──
  let actionActive = true;
  let workProgress = 0;
  let spraySwathCounter = 0;

  // Wet crop swaths pool for agriculture spraying
  const wetSwaths: THREE.Mesh[] = [];
  const wetSwathMat = new THREE.MeshStandardMaterial({
    color: 0x1c3a16,
    roughness: 0.35,
    metalness: 0.1,
    transparent: true,
    opacity: 0.6,
  });

  // ── Build Specific Drone Hardware Attachment ──
  function rebuildDronePayloadHardware() {
    while (payloadAttachmentGroup.children.length > 0) {
      payloadAttachmentGroup.remove(payloadAttachmentGroup.children[0]);
    }

    if (currentIndustry === "agriculture") {
      if (currentPayload === "sprayer") {
        // Sprayer: Dual tank + wide transverse spray booms + 6 dropper nozzles mounted directly under drone arms (reference: Spraying.webp)
        const tankMat = new THREE.MeshStandardMaterial({ color: 0x224422, roughness: 0.4 });
        const tank = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.18), tankMat);
        tank.castShadow = true;
        payloadAttachmentGroup.add(tank);

        const boomMat = new THREE.MeshStandardMaterial({ color: 0x101510, metalness: 0.8 });
        // Main transverse boom
        const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.25), boomMat);
        boom.rotation.z = Math.PI / 2;
        boom.position.set(0, -0.09, 0);
        payloadAttachmentGroup.add(boom);

        // Fore & aft arm boom trusses
        [-0.32, 0.32].forEach((bx) => {
          const cross = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.65), boomMat);
          cross.rotation.x = Math.PI / 2;
          cross.position.set(bx, -0.09, 0);
          payloadAttachmentGroup.add(cross);
        });

        // 6 atomizing nozzles mounted with vertical droppers under each drone arm
        const armNozzleCoords: [number, number, number][] = [
          [-0.58, -0.22, 0.0],
          [-0.26, -0.22, 0.28],
          [-0.26, -0.22, -0.28],
          [0.26, -0.22, 0.28],
          [0.26, -0.22, -0.28],
          [0.58, -0.22, 0.0],
        ];

        armNozzleCoords.forEach(([nx, ny, nz]) => {
          const dropper = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.13), boomMat);
          dropper.position.set(nx, ny + 0.065, nz);
          payloadAttachmentGroup.add(dropper);

          const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.035, 8), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 }));
          nozzle.rotation.x = Math.PI;
          nozzle.position.set(nx, ny, nz);
          payloadAttachmentGroup.add(nozzle);
        });
      } else {
        // Spreader: Conical granular fertilizer hopper + spinning broadcast disc
        const hopperMat = new THREE.MeshStandardMaterial({ color: 0x2a382a, roughness: 0.5 });
        const hopper = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.07, 0.18, 8), hopperMat);
        payloadAttachmentGroup.add(hopper);

        const spinnerDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.012, 12), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 }));
        spinnerDisc.position.y = -0.11;
        spinnerDisc.name = "spreaderDisc";
        payloadAttachmentGroup.add(spinnerDisc);
      }
    } else {
      // Other Options
      switch (currentPayload) {
        case "solar-cleaning": {
          // Solar Cleaning: Dual angled wash jets (reference: solar cleaning.jpeg)
          const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.24), new THREE.MeshStandardMaterial({ color: 0x1e3a5f }));
          tank.rotation.z = Math.PI / 2;
          payloadAttachmentGroup.add(tank);

          const bar = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.02, 0.02), new THREE.MeshStandardMaterial({ color: 0x8899aa }));
          bar.position.set(0, -0.12, 0.1);
          payloadAttachmentGroup.add(bar);

          [-0.28, 0.28].forEach((jx) => {
            const jet = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.06, 6), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
            jet.rotation.x = Math.PI / 3;
            jet.position.set(jx, -0.15, 0.12);
            payloadAttachmentGroup.add(jet);
          });
          break;
        }
        case "high-rise-cleaning": {
          // High Rise Cleaning: Extended forward pressure wand (reference: high building cleaning.jpeg)
          const wand = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.85), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 }));
          wand.rotation.z = Math.PI / 2;
          wand.rotation.y = 0.45;
          wand.position.set(0.42, -0.06, 0);
          payloadAttachmentGroup.add(wand);

          const nozzleTip = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.05, 6), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
          nozzleTip.rotation.z = -Math.PI / 2;
          nozzleTip.position.set(0.85, -0.06, -0.38);
          payloadAttachmentGroup.add(nozzleTip);
          break;
        }
        case "flower-dropping": {
          const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.1, 0.16, 8), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 }));
          payloadAttachmentGroup.add(basket);
          const rim = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.015, 6, 12), new THREE.MeshStandardMaterial({ color: 0xfbbf24 }));
          rim.rotation.x = Math.PI / 2;
          rim.position.y = 0.08;
          payloadAttachmentGroup.add(rim);
          break;
        }
        case "hologram": {
          // Hologram Projector Pod with glowing lens
          const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.12, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 }));
          payloadAttachmentGroup.add(pod);
          const lens = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
          lens.rotation.x = Math.PI;
          lens.position.y = -0.06;
          payloadAttachmentGroup.add(lens);
          break;
        }
        case "screen": {
          // Screen: Suspended VERTICAL aerial LED billboard playing Screen.mp4 video so customers can clearly watch it!
          screenVideo.play().catch(() => {});

          // Suspension steel rigging cables from drone skids down to the vertical screen
          const cableMat = new THREE.LineBasicMaterial({ color: 0x94a3b8 });
          const cornerPositions = [-0.6, 0.6];
          cornerPositions.forEach((cx) => {
            const cableGeo = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(cx * 0.3, 0, 0),
              new THREE.Vector3(cx, -1.75 + 1.25, 0),
            ]);
            const cable = new THREE.Line(cableGeo, cableMat);
            payloadAttachmentGroup.add(cable);
          });

          // Large VERTICAL Portrait Billboard Frame (1.4m wide x 2.45m tall, 9:16 portrait video format matching Screen.mp4)
          const screenGroup = new THREE.Group();
          screenGroup.position.set(0, -1.75, 0);

          const frameMat = new THREE.MeshStandardMaterial({ color: 0x050811, metalness: 0.8, roughness: 0.2 });
          const frame = new THREE.Mesh(new THREE.BoxGeometry(1.42, 2.48, 0.07), frameMat);
          frame.castShadow = true;
          screenGroup.add(frame);

          // LED Border Bezel (GoAG Bio Green)
          const bezelMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
          const topGlow = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.02, 0.072), bezelMat);
          topGlow.position.y = 1.22;
          screenGroup.add(topGlow);
          const btmGlow = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.02, 0.072), bezelMat);
          btmGlow.position.y = -1.22;
          screenGroup.add(btmGlow);
          const leftGlow = new THREE.Mesh(new THREE.BoxGeometry(0.02, 2.44, 0.072), bezelMat);
          leftGlow.position.x = -0.69;
          screenGroup.add(leftGlow);
          const rightGlow = new THREE.Mesh(new THREE.BoxGeometry(0.02, 2.44, 0.072), bezelMat);
          rightGlow.position.x = 0.69;
          screenGroup.add(rightGlow);

          // Front-facing vertical screen displaying GoAG Logo (9:16 portrait)
          const screenMat = new THREE.MeshBasicMaterial({
            map: logoTexture,
            transparent: true,
            side: THREE.DoubleSide,
            toneMapped: false,
          });
          const frontScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.34, 2.38), screenMat);
          frontScreen.position.z = 0.038;
          screenGroup.add(frontScreen);

          // Back-facing vertical screen (so spectators from both sides see GoAG Logo)
          const backScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.34, 2.38), screenMat);
          backScreen.rotation.y = Math.PI;
          backScreen.position.z = -0.038;
          screenGroup.add(backScreen);

          payloadAttachmentGroup.add(screenGroup);
          break;
        }
        case "winch-mechanism": {
          // Winch Mechanism: Heavy-duty motorized cable winch spool (ONLY winch, NO spray)
          const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.16), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 }));
          bracket.position.y = -0.04;
          payloadAttachmentGroup.add(bracket);

          const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.14), new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 }));
          drum.rotation.z = Math.PI / 2;
          drum.position.y = -0.08;
          payloadAttachmentGroup.add(drum);

          const motorHousing = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
          motorHousing.position.set(0.1, -0.08, 0);
          payloadAttachmentGroup.add(motorHousing);
          break;
        }
        case "thermal-fogger": {
          [-0.08, 0.08].forEach((px) => {
            const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.35, 8), new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7 }));
            pipe.rotation.x = Math.PI / 2;
            pipe.position.set(px, -0.06, -0.15);
            payloadAttachmentGroup.add(pipe);

            const glowRing = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.008, 6, 12), new THREE.MeshBasicMaterial({ color: 0xff4500 }));
            glowRing.position.set(px, -0.06, -0.32);
            payloadAttachmentGroup.add(glowRing);
          });
          break;
        }
        case "seed-ball": {
          const tubeMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, metalness: 0.5 });
          [-0.06, 0.06].forEach((tx) => {
            [-0.06, 0.06].forEach((tz) => {
              const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2), tubeMat);
              tube.position.set(tx, -0.08, tz);
              payloadAttachmentGroup.add(tube);
            });
          });
          break;
        }
      }
    }
  }

  // ── Particle Systems Manager ──
  let particlePoints: THREE.Points | null = null;
  let particlePositions: Float32Array;
  let particleVelocities: Float32Array;
  let particleLifetimes: Float32Array;
  let particleMaxLife: Float32Array;
  const PARTICLE_COUNT = 300;

  // Custom objects for Hologram, Winch, etc.
  let holoBeam: THREE.Mesh | null = null;
  let holoSphereGroup: THREE.Group | null = null;
  let holoSphereMesh: THREE.Mesh | null = null;
  let holoGeodesicMesh: THREE.Mesh | null = null;
  let holoOrbitalRings: THREE.Mesh[] = [];
  let holoLogoMesh: THREE.Group | null = null;
  let winchCableMesh: THREE.Line | null = null;
  let winchCrate: THREE.Group | THREE.Mesh | null = null;

  function initActionSystems() {
    while (actionGroup.children.length > 0) {
      actionGroup.remove(actionGroup.children[0]);
    }
    if (particlePoints) {
      particlePoints.geometry.dispose();
      (particlePoints.material as THREE.Material).dispose();
      particlePoints = null;
    }
    holoOrbitalRings = [];
    holoLogoMesh = null;
    holoSphereMesh = null;
    holoGeodesicMesh = null;
    holoSphereGroup = null;
    holoBeam = null;
    winchCableMesh = null;
    winchCrate = null;

    particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    particleVelocities = new Float32Array(PARTICLE_COUNT * 3);
    particleLifetimes = new Float32Array(PARTICLE_COUNT);
    particleMaxLife = new Float32Array(PARTICLE_COUNT);

    // Initialize all particles inactive
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlePositions[i * 3 + 1] = -999;
      particleLifetimes[i] = 999;
      particleMaxLife[i] = 1.0;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    let pColor = 0x60a5fa;
    let pSize = 0.12;

    if (currentPayload === "sprayer") {
      pColor = 0xbfdbfe; // Atomized liquid mist
      pSize = 0.1;
    } else if (currentPayload === "spreader") {
      pColor = 0xfef08a; // Golden urea fertilizer granules
      pSize = 0.14;
    } else if (currentPayload === "solar-cleaning" || currentPayload === "high-rise-cleaning") {
      pColor = 0x38bdf8; // Pressurized water jets
      pSize = 0.12;
    } else if (currentPayload === "flower-dropping") {
      pColor = 0xf97316; // Marigold / Rose petals
      pSize = 0.22;
    } else if (currentPayload === "thermal-fogger") {
      pColor = 0xe2e8f0; // Thick white aerosol smoke
      pSize = 0.7;
    } else if (currentPayload === "seed-ball") {
      pColor = 0x15803d; // Dense green bio seed balls
      pSize = 0.18;
    }

    // Only create points if the payload actually uses particles (NEVER for winch, hologram, screen!)
    const usesParticles = ["sprayer", "spreader", "solar-cleaning", "high-rise-cleaning", "flower-dropping", "thermal-fogger", "seed-ball"].includes(currentPayload);

    if (usesParticles) {
      const pMat = new THREE.PointsMaterial({
        color: pColor,
        size: pSize,
        transparent: true,
        opacity: currentPayload === "thermal-fogger" ? 0.4 : 0.85,
        blending: currentPayload === "thermal-fogger" ? THREE.NormalBlending : THREE.AdditiveBlending,
        depthWrite: false,
      });

      particlePoints = new THREE.Points(pGeo, pMat);
      actionGroup.add(particlePoints);
    }

    // ── Setup SPHERICAL Hologram System with GoAG Services Logo ──
    if (currentPayload === "hologram") {
      // 1. Volumetric Light Cone from drone projector pod down to the top of the sphere
      const coneGeo = new THREE.ConeGeometry(1.65, 2.5, 24, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0x22c55e,
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      holoBeam = new THREE.Mesh(coneGeo, coneMat);
      holoBeam.rotation.x = Math.PI;
      actionGroup.add(holoBeam);

      // 2. Spherical Hologram Root Group
      const sphereGroup = new THREE.Group();
      holoSphereGroup = sphereGroup;

      // A. Glowing 3D Translucent Holographic Sphere
      const sphereGeo = new THREE.SphereGeometry(1.65, 32, 24);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: 0x22c55e,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      holoSphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereGroup.add(holoSphereMesh);

      // B. Outer Geodesic Wireframe Sphere Lattice
      const geoLattice = new THREE.IcosahedronGeometry(1.68, 2);
      const latticeMat = new THREE.MeshBasicMaterial({
        color: 0x4ade80,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      holoGeodesicMesh = new THREE.Mesh(geoLattice, latticeMat);
      sphereGroup.add(holoGeodesicMesh);

      // C. Multi-Axis Rotating Orbital Rings
      holoOrbitalRings = [];
      const ringConfigs = [
        { r: 1.82, color: 0x22c55e, rx: Math.PI / 2, ry: 0, rz: 0 },
        { r: 1.78, color: 0xf59e0b, rx: Math.PI / 4, ry: 0, rz: Math.PI / 4 },
        { r: 1.78, color: 0x38bdf8, rx: -Math.PI / 4, ry: 0, rz: -Math.PI / 4 },
      ];
      ringConfigs.forEach((cfg) => {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(cfg.r - 0.035, cfg.r + 0.035, 48),
          new THREE.MeshBasicMaterial({
            color: cfg.color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        );
        ring.rotation.set(cfg.rx, cfg.ry, cfg.rz);
        sphereGroup.add(ring);
        holoOrbitalRings.push(ring);
      });

      // D. Floating GoAG Services Logo inside the Spherical Hologram!
      const logoGroup = new THREE.Group();
      holoLogoMesh = logoGroup;
      const logoMat = new THREE.MeshBasicMaterial({
        map: logoTexture,
        transparent: true,
        opacity: 0.96,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      // Primary logo plane
      const p1 = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.55), logoMat);
      logoGroup.add(p1);
      // Cross logo plane (90 deg) so it's fully 3D and readable from all angles inside the sphere!
      const p2 = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.55), logoMat);
      p2.rotation.y = Math.PI / 2;
      logoGroup.add(p2);

      // Central radiant amber/green energy core
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 16, 16),
        new THREE.MeshBasicMaterial({
          color: 0xfbbf24,
          transparent: true,
          opacity: 0.75,
          blending: THREE.AdditiveBlending,
        })
      );
      logoGroup.add(core);

      sphereGroup.add(logoGroup);
      actionGroup.add(sphereGroup);
    }

    // ── Setup Winch Mechanism (ONLY winch & cargo, NO spray) ──
    if (currentPayload === "winch-mechanism") {
      const cableGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -3.5, 0)]);
      const cableMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, linewidth: 3 });
      winchCableMesh = new THREE.Line(cableGeo, cableMat);
      actionGroup.add(winchCableMesh);

      // Heavy-duty relief cargo crate with hazard frame
      const crateGroup = new THREE.Group();
      const crateMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.3 });
      const crateBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 0.65), crateMat);
      crateBody.castShadow = true;
      crateGroup.add(crateBody);

      // Black hazard band
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.15, 0.66), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      crateGroup.add(band);

      // Top steel lifting hook
      const hook = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 6, 12), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
      hook.position.y = 0.32;
      crateGroup.add(hook);

      winchCrate = crateGroup;
      actionGroup.add(crateGroup);
    }
  }

  // ── Build Entire 3D Environment ──
  function rebuildEnvironment() {
    while (envGroup.children.length > 0) {
      const child = envGroup.children[0];
      envGroup.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }
    wetSwaths.length = 0;

    if (currentIndustry === "agriculture") {
      // ══════════════════════════════════════════════════════════════════════
      // AGRICULTURE ENVIRONMENT: AUTHENTIC MAIZE (CORN) CROP FIELD
      // ══════════════════════════════════════════════════════════════════════
      scene.background = new THREE.Color(0x0a160d);
      scene.fog = new THREE.Fog(0x0a160d, 65, 220);

      // 1. Rich Furrowed Loam Soil (No plain green mat!)
      const groundGeo = new THREE.PlaneGeometry(300, 300, 60, 60);
      const groundMat = new THREE.MeshStandardMaterial({
        color: 0x2a1d13, // Rich dark organic soil
        roughness: 0.95,
        metalness: 0.05,
      });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      envGroup.add(ground);

      // 2. Furrow Ridges (Plowed earth trenches running along crop rows)
      const furrowMat = new THREE.MeshStandardMaterial({ color: 0x1f140c, roughness: 1.0 });
      for (let r = -24; r <= 24; r++) {
        const furrow = new THREE.Mesh(new THREE.BoxGeometry(140, 0.12, 0.4), furrowMat);
        furrow.position.set(0, 0.06, r * 2.2);
        furrow.receiveShadow = true;
        envGroup.add(furrow);
      }

      // 3. 3D Maize Plants (Corn stalks with drooping broad leaves and golden tassels)
      const maizeRowSpacing = 2.2;
      const plantSpacing = 2.4;

      for (let row = -14; row <= 14; row++) {
        const rowZ = row * maizeRowSpacing;
        for (let col = -22; col <= 22; col += plantSpacing) {
          const maizePlant = createMaizePlant();
          const jitterX = (Math.random() - 0.5) * 0.35;
          const jitterZ = (Math.random() - 0.5) * 0.25;
          const scale = 0.85 + Math.random() * 0.3;
          maizePlant.scale.set(scale, scale, scale);
          maizePlant.position.set(col + jitterX, 0, rowZ + jitterZ);
          maizePlant.rotation.y = Math.random() * Math.PI * 2;
          envGroup.add(maizePlant);
        }
      }

      // 4. Irrigation trenches & dirt access track
      const roadGeo = new THREE.PlaneGeometry(16, 200);
      const roadMat = new THREE.MeshStandardMaterial({ color: 0x3d2c1c, roughness: 0.9 });
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(58, 0.02, 0);
      envGroup.add(road);

      // 5. Border Windbreak Trees
      const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x422e1b });
      const treeLeafMat = new THREE.MeshStandardMaterial({ color: 0x22491a, roughness: 0.8 });
      const treeCoords: [number, number][] = [
        [-65, -50], [-65, 0], [-65, 50], [-65, -80], [-65, 80],
        [65, -50], [65, 0], [65, 50], [65, -80], [65, 80],
        [-30, -85], [0, -85], [30, -85],
        [-30, 85], [0, 85], [30, 85],
      ];
      treeCoords.forEach(([tx, tz]) => {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.6, 5), treeTrunkMat);
        trunk.position.set(tx, 2.5, tz);
        trunk.castShadow = true;
        envGroup.add(trunk);

        const crown = new THREE.Mesh(new THREE.ConeGeometry(3.5, 7.5, 7), treeLeafMat);
        crown.position.set(tx, 8, tz);
        crown.castShadow = true;
        envGroup.add(crown);
      });
    } else {
      // ══════════════════════════════════════════════════════════════════════
      // OTHER ENVIRONMENTS (SOLAR, HIGH-RISE, FLOWER, HOLOGRAM, ETC.)
      // ══════════════════════════════════════════════════════════════════════
      switch (currentPayload) {
        case "solar-cleaning": {
          // Vast Photovoltaic Solar Farm (reference: solar cleaning.jpeg)
          scene.background = new THREE.Color(0x0e171f);
          scene.fog = new THREE.Fog(0x0e171f, 80, 240);

          const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshStandardMaterial({ color: 0x3d352b, roughness: 0.95 }));
          ground.rotation.x = -Math.PI / 2;
          ground.receiveShadow = true;
          envGroup.add(ground);

          const panelMat = new THREE.MeshStandardMaterial({
            color: 0x0f2744, // Dark deep reflective silicon blue
            metalness: 0.85,
            roughness: 0.15,
          });
          const rackMat = new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.7 });

          for (let r = -8; r <= 8; r++) {
            const rz = r * 8.0;
            for (let c = -20; c <= 20; c += 8) {
              const panelGroup = new THREE.Group();
              panelGroup.position.set(c, 0, rz);

              const table = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.1, 3.2), panelMat);
              table.rotation.x = 0.45;
              table.position.set(0, 1.4, 0);
              table.castShadow = true;
              table.receiveShadow = true;
              panelGroup.add(table);

              [-2.5, 2.5].forEach((px) => {
                const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4), rackMat);
                leg.position.set(px, 0.7, 0);
                panelGroup.add(leg);
              });
              envGroup.add(panelGroup);
            }
          }
          break;
        }

        case "high-rise-cleaning": {
          // Modern Skyscraper Facade (reference: high building cleaning.jpeg)
          scene.background = new THREE.Color(0x0a101d);
          scene.fog = new THREE.Fog(0x0a101d, 70, 250);

          const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshStandardMaterial({ color: 0x1f2937 }));
          ground.rotation.x = -Math.PI / 2;
          ground.receiveShadow = true;
          envGroup.add(ground);

          // Towering Skyscraper Facade with architectural teal/blue reflective glass
          const bldgGeo = new THREE.BoxGeometry(20, 95, 140);
          const bldgMat = new THREE.MeshStandardMaterial({
            color: 0x0e3e52, // Teal/blue reflective glass
            metalness: 0.9,
            roughness: 0.12,
          });
          const skyscraper = new THREE.Mesh(bldgGeo, bldgMat);
          skyscraper.position.set(24, 47, 0);
          skyscraper.castShadow = true;
          skyscraper.receiveShadow = true;
          envGroup.add(skyscraper);

          // Window Mullion Grids
          const mullionMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
          for (let fy = 5; fy <= 90; fy += 4.5) {
            const ledge = new THREE.Mesh(new THREE.BoxGeometry(20.2, 0.3, 140.2), mullionMat);
            ledge.position.set(24, fy, 0);
            envGroup.add(ledge);
          }
          break;
        }

        case "flower-dropping": {
          scene.background = new THREE.Color(0x181008);
          scene.fog = new THREE.Fog(0x181008, 60, 200);

          const plaza = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshStandardMaterial({ color: 0x854d27, roughness: 0.8 }));
          plaza.rotation.x = -Math.PI / 2;
          plaza.receiveShadow = true;
          envGroup.add(plaza);

          const rangoli = new THREE.Mesh(new THREE.RingGeometry(2, 28, 32), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 }));
          rangoli.rotation.x = -Math.PI / 2;
          rangoli.position.set(0, 0.02, 10);
          envGroup.add(rangoli);
          break;
        }

        case "hologram": {
          // Nocturnal Arena with Stick Men Watching the GoAG Services Hologram!
          scene.background = new THREE.Color(0x030712);
          scene.fog = new THREE.Fog(0x030712, 60, 190);

          const floor = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshStandardMaterial({ color: 0x050914, roughness: 0.3, metalness: 0.7 }));
          floor.rotation.x = -Math.PI / 2;
          floor.receiveShadow = true;
          envGroup.add(floor);

          // Glowing Concentric Light Rings
          [8, 16, 28, 42].forEach((r, idx) => {
            const ring = new THREE.Mesh(
              new THREE.RingGeometry(r - 0.25, r + 0.25, 48),
              new THREE.MeshBasicMaterial({ color: idx % 2 === 0 ? 0x22c55e : 0x06b6d4, side: THREE.DoubleSide })
            );
            ring.rotation.x = -Math.PI / 2;
            ring.position.set(0, 0.05, 10);
            envGroup.add(ring);
          });

          // ── PLACE STICK MEN WATCHING THE HOLOGRAM (Requirement 2) ──
          const stickMenAngles = [0.4, 0.9, 1.5, 2.1, 2.7, 3.4, 4.0, 4.8, 5.5];
          const stickMenColors = [0x38bdf8, 0x22c55e, 0xfbbf24, 0x38bdf8, 0xa855f7, 0x22c55e, 0xfbbf24, 0x38bdf8, 0x22c55e];

          stickMenAngles.forEach((ang, idx) => {
            const dist = 5.5 + (idx % 3) * 1.2;
            const sx = Math.sin(ang) * dist;
            const sz = 10 + Math.cos(ang) * dist;
            const stickMan = createStickMan(stickMenColors[idx], idx % 3);
            stickMan.position.set(sx, 0, sz);
            // Face the central hologram point (0, 3, 10)
            stickMan.lookAt(0, 1.75, 10);
            envGroup.add(stickMan);
          });
          break;
        }

        case "screen": {
          // Aerial LED Broadcast Exhibition Arena with Spectators Watching the Vertical Screen!
          scene.background = new THREE.Color(0x060c14);
          scene.fog = new THREE.Fog(0x060c14, 60, 210);

          const plaza = new THREE.Mesh(
            new THREE.PlaneGeometry(300, 300),
            new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.65, metalness: 0.25 })
          );
          plaza.rotation.x = -Math.PI / 2;
          plaza.receiveShadow = true;
          envGroup.add(plaza);

          // LED Ground Border Guideway Lines
          [-18, 18].forEach((gx) => {
            const lane = new THREE.Mesh(
              new THREE.BoxGeometry(0.35, 0.02, 120),
              new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
            );
            lane.position.set(gx, 0.02, 0);
            envGroup.add(lane);
          });

          // Audience / spectators standing on ground looking up at the vertical video screen!
          const audienceCoords: [number, number, number][] = [
            [-3.8, 0, -6.5],
            [-1.6, 0, -7.5],
            [0.6, 0, -6.8],
            [3.4, 0, -7.8],
            [-2.4, 0, -9.5],
            [2.0, 0, -9.0],
            [-4.8, 0, -11.0],
            [4.5, 0, -10.5],
          ];
          const audienceColors = [0x38bdf8, 0x22c55e, 0xfbbf24, 0x38bdf8, 0xa855f7, 0x22c55e, 0xfbbf24, 0x38bdf8];

          audienceCoords.forEach(([ax, ay, az], idx) => {
            const man = createStickMan(audienceColors[idx % audienceColors.length], idx % 3);
            man.position.set(ax, ay, az);
            man.lookAt(0, 1.65, 0); // Looking up at the suspended vertical video screen
            envGroup.add(man);
          });
          break;
        }

        case "winch-mechanism": {
          // Remote Logistics Target Outpost (ONLY winch & cargo targets)
          scene.background = new THREE.Color(0x131a15);
          scene.fog = new THREE.Fog(0x131a15, 60, 210);

          const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshStandardMaterial({ color: 0x33281e, roughness: 0.9 }));
          ground.rotation.x = -Math.PI / 2;
          ground.receiveShadow = true;
          envGroup.add(ground);

          // Marked Dropzone Targets for Cargo Winch Delivery
          [
            [20, 0, -15],
            [-20, 0, 20],
            [5, 0, 40],
          ].forEach(([dx, dy, dz]) => {
            const dropzone = new THREE.Mesh(
              new THREE.RingGeometry(2, 4.5, 24),
              new THREE.MeshStandardMaterial({ color: 0xf59e0b, side: THREE.DoubleSide })
            );
            dropzone.rotation.x = -Math.PI / 2;
            dropzone.position.set(dx, dy + 0.03, dz);
            envGroup.add(dropzone);

            const center = new THREE.Mesh(new THREE.CircleGeometry(1.5, 16), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
            center.rotation.x = -Math.PI / 2;
            center.position.set(dx, dy + 0.04, dz);
            envGroup.add(center);
          });
          break;
        }

        case "thermal-fogger": {
          scene.background = new THREE.Color(0x0e190f);
          scene.fog = new THREE.Fog(0x0e190f, 50, 180);

          const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshStandardMaterial({ color: 0x223318, roughness: 0.9 }));
          ground.rotation.x = -Math.PI / 2;
          ground.receiveShadow = true;
          envGroup.add(ground);

          for (let r = -6; r <= 6; r++) {
            for (let c = -15; c <= 15; c += 5) {
              const treeTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 3.5), new THREE.MeshStandardMaterial({ color: 0x3e2716 }));
              treeTrunk.position.set(c, 1.75, r * 7);
              treeTrunk.castShadow = true;
              envGroup.add(treeTrunk);

              const treeCanopy = new THREE.Mesh(new THREE.SphereGeometry(2.8, 8, 6), new THREE.MeshStandardMaterial({ color: 0x1b4317, roughness: 0.85 }));
              treeCanopy.position.set(c, 4.8, r * 7);
              treeCanopy.castShadow = true;
              envGroup.add(treeCanopy);
            }
          }
          break;
        }

        case "seed-ball": {
          scene.background = new THREE.Color(0x1a1c15);
          scene.fog = new THREE.Fog(0x1a1c15, 65, 210);

          const groundGeo = new THREE.PlaneGeometry(300, 300, 30, 30);
          const posAttr = groundGeo.attributes.position;
          for (let i = 0; i < posAttr.count; i++) {
            const vx = posAttr.getX(i);
            const vy = posAttr.getY(i);
            const hill = Math.sin(vx * 0.05) * Math.cos(vy * 0.05) * 3.5;
            posAttr.setZ(i, hill);
          }
          groundGeo.computeVertexNormals();

          const ground = new THREE.Mesh(groundGeo, new THREE.MeshStandardMaterial({ color: 0x4a3b2c, roughness: 0.95 }));
          ground.rotation.x = -Math.PI / 2;
          ground.receiveShadow = true;
          envGroup.add(ground);
          break;
        }

        default: {
          const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshStandardMaterial({ color: 0x18241b, roughness: 0.8 }));
          ground.rotation.x = -Math.PI / 2;
          ground.receiveShadow = true;
          envGroup.add(ground);
        }
      }
    }
  }

  // ── Waypoints Setup ──
  const waypointPositions: [number, number, number][] = [
    [20, 3.5, -15],
    [-20, 4.5, 20],
    [5, 5.5, 45],
  ];
  const waypointMeshes: THREE.Group[] = [];
  const waypointLabels = ["WAYPOINT 1", "WAYPOINT 2", "WAYPOINT 3"];

  const waypoints: Waypoint[] = waypointPositions.map((pos, i) => {
    const wpGroup = new THREE.Group();
    wpGroup.position.set(...pos);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2, 0.08, 8, 32),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x15803d, emissiveIntensity: 0.8 })
    );
    ring.rotation.x = Math.PI / 2;
    wpGroup.add(ring);

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, pos[1], 6),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x15803d, emissiveIntensity: 0.4 })
    );
    pole.position.y = -pos[1] / 2;
    wpGroup.add(pole);

    const light = new THREE.PointLight(0x22c55e, 0.8, 12);
    wpGroup.add(light);

    scene.add(wpGroup);
    waypointMeshes.push(wpGroup);

    return {
      position: new THREE.Vector3(...pos),
      reached: false,
      label: waypointLabels[i],
    };
  });

  // ── Drone State ──
  const droneState: DroneState = {
    position: new THREE.Vector3(0, 3, 0),
    velocity: new THREE.Vector3(),
    yaw: 0,
    pitch: 0,
    roll: 0,
    altitude: 3,
    battery: 100,
    speed: 0,
    actionActive: true,
    actionMetric: "",
    industry: currentIndustry,
    payload: currentPayload,
    workProgress: 0,
  };

  const mission: MissionStatus = {
    active: true,
    currentWaypoint: 0,
    complete: false,
    score: 0,
  };

  // ── Keyboard Controls ──
  const keys: Record<string, boolean> = {};
  let isPaused = false;
  let stateCallback: ((s: DroneState) => void) | null = null;
  let missionCallback: ((m: MissionStatus) => void) | null = null;

  const onKeyDown = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    keys[k] = true;
    if (e.key === " ") e.preventDefault();
    if (e.key === "Escape") isPaused = !isPaused;
    if (k === "r") resetDrone();
    if (k === "e") {
      actionActive = !actionActive;
      droneState.actionActive = actionActive;
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    keys[e.key.toLowerCase()] = false;
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  function resetDrone() {
    droneState.position.set(0, 3, 0);
    droneState.velocity.set(0, 0, 0);
    droneState.yaw = 0;
    droneState.pitch = 0;
    droneState.roll = 0;
    droneState.battery = 100;
    droneState.speed = 0;
    droneState.workProgress = 0;
    workProgress = 0;
    waypoints.forEach((w) => (w.reached = false));
    waypointMeshes.forEach((m) => { m.visible = true; });
    mission.currentWaypoint = 0;
    mission.complete = false;
    mission.score = 0;
  }

  // Camera Follow
  const camTarget = new THREE.Vector3();
  const camPos = new THREE.Vector3(0, 5, -10);

  let batteryTimer = 0;
  let timeElapsed = 0;
  let rafId: number;
  let lastTime = performance.now();

  // Initialize
  rebuildEnvironment();
  rebuildDronePayloadHardware();
  initActionSystems();

  // ── Animation Loop ──
  function animate() {
    rafId = requestAnimationFrame(animate);
    const now = performance.now();
    const rawDt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (isPaused) {
      renderer.render(scene, camera);
      return;
    }

    const dt = rawDt;
    timeElapsed += dt;

    // ── Spin Propellers ──
    for (const pg of propGroups) pg.rotation.y += dt * 18;

    // ── Spreader Disc Spin ──
    if (currentPayload === "spreader" && actionActive) {
      const disc = payloadAttachmentGroup.getObjectByName("spreaderDisc");
      if (disc) disc.rotation.y += dt * 35;
    }

    // ── Flight Physics ──
    const fwd = new THREE.Vector3(-Math.sin(droneState.yaw), 0, -Math.cos(droneState.yaw));
    const right = new THREE.Vector3(Math.cos(droneState.yaw), 0, -Math.sin(droneState.yaw));
    const accel = new THREE.Vector3();
    const thrust = 8.5;

    if (keys["w"] || keys["arrowup"]) accel.addScaledVector(fwd, thrust);
    if (keys["s"] || keys["arrowdown"]) accel.addScaledVector(fwd, -thrust);
    if (keys["a"]) accel.addScaledVector(right, -thrust);
    if (keys["d"]) accel.addScaledVector(right, thrust);
    if (keys[" "]) accel.y += thrust * 1.3;
    if (keys["control"] || keys["shift"]) accel.y -= thrust * 1.3;
    if (keys["arrowleft"]) droneState.yaw += dt * 1.7;
    if (keys["arrowright"]) droneState.yaw -= dt * 1.7;

    droneState.velocity.multiplyScalar(0.89);
    droneState.velocity.addScaledVector(accel, dt);

    const hSpeed = Math.sqrt(droneState.velocity.x ** 2 + droneState.velocity.z ** 2);
    if (hSpeed > 14) {
      const scale = 14 / hSpeed;
      droneState.velocity.x *= scale;
      droneState.velocity.z *= scale;
    }
    droneState.velocity.y = Math.max(-8, Math.min(8, droneState.velocity.y));
    droneState.position.addScaledVector(droneState.velocity, dt);

    droneState.position.y = Math.max(0.6, droneState.position.y);
    droneState.position.x = Math.max(-95, Math.min(95, droneState.position.x));
    droneState.position.z = Math.max(-95, Math.min(95, droneState.position.z));

    droneState.altitude = droneState.position.y;
    droneState.speed = droneState.velocity.length();

    droneGroup.position.copy(droneState.position);
    droneGroup.rotation.y = droneState.yaw;
    droneGroup.rotation.z = -droneState.velocity.x * 0.04;
    droneGroup.rotation.x = droneState.velocity.z * 0.04;

    // ── Update Active Work Action Simulation ──
    const isFlying = droneState.altitude > 0.8;
    const isWorking = actionActive && isFlying;

    if (isWorking) {
      workProgress = Math.min(100, workProgress + dt * 2.5);
    }
    droneState.actionActive = isWorking;
    droneState.workProgress = Math.round(workProgress);

    // Update Action Metric Text for HUD
    if (currentPayload === "sprayer") {
      droneState.actionMetric = isWorking
        ? `SPRAY: 4.8 L/min · SWATH 6.5m · TANK ${Math.max(0, 16 - workProgress * 0.16).toFixed(1)}L`
        : "SPRAYER IDLE [PRESS E TO ACTIVATE]";
    } else if (currentPayload === "spreader") {
      droneState.actionMetric = isWorking
        ? `SPREAD: 25 kg/ha · 850 RPM · HOPPER ${Math.max(0, 16 - workProgress * 0.16).toFixed(1)}kg`
        : "SPREADER IDLE [PRESS E TO ACTIVATE]";
    } else if (currentPayload === "solar-cleaning") {
      droneState.actionMetric = isWorking ? "WASH JET: 120 BAR · 9.4 L/min · WASHING PANELS" : "WASH JETS OFF [PRESS E]";
    } else if (currentPayload === "high-rise-cleaning") {
      droneState.actionMetric = isWorking ? "FACADE JET: 140 BAR · CLEANING SKYSCRAPER GLASS" : "WASH JET OFF [PRESS E]";
    } else if (currentPayload === "flower-dropping") {
      droneState.actionMetric = isWorking ? `DISPENSING MARIGOLD PETALS · ${Math.round(workProgress * 12)} SHOWERED` : "DISPENSER IDLE [PRESS E]";
    } else if (currentPayload === "hologram") {
      droneState.actionMetric = isWorking ? "GoAG SERVICES 3D HOLOGRAPHIC PROJECTION ACTIVE" : "PROJECTOR OFF [PRESS E]";
    } else if (currentPayload === "screen") {
      droneState.actionMetric = "AERIAL LED BROADCAST: DISPLAYING GOAG SERVICES LOGO";
    } else if (currentPayload === "winch-mechanism") {
      // ONLY winch mechanism, no spraying!
      droneState.actionMetric = isWorking ? "WINCH MOTOR: CABLE UNSPURLED · CARGO PAYLOAD LOWERED" : "WINCH HOISTED [PRESS E]";
    } else if (currentPayload === "thermal-fogger") {
      droneState.actionMetric = isWorking ? "PULSE-JET FOGGER: 480°C · DISPERSING THERMAL SMOKE" : "FOGGER STANDBY [PRESS E]";
    } else if (currentPayload === "seed-ball") {
      droneState.actionMetric = isWorking ? `SEED-BALL LAUNCHER: ${Math.round(workProgress * 4)} PELLETS FIRED` : "LAUNCHER IDLE [PRESS E]";
    }

    // ── Update Action Particles (ONLY for spray, spread, wash, petals, smoke, seeds; NEVER FOR WINCH/HOLOGRAM/SCREEN) ──
    const canSpawnParticles = isWorking && !["winch-mechanism", "hologram", "screen"].includes(currentPayload);

    if (particlePoints) {
      const pos = particlePoints.geometry.attributes.position.array as Float32Array;

      if (canSpawnParticles) {
        // Arm nozzle locations in drone local coordinates (mounted directly under 6 arms)
        const SPRAY_ARM_NOZZLES: [number, number, number][] = [
          [-0.58, -0.22, 0.0],
          [-0.26, -0.22, 0.28],
          [-0.26, -0.22, -0.28],
          [0.26, -0.22, 0.28],
          [0.26, -0.22, -0.28],
          [0.58, -0.22, 0.0],
        ];

        const spawnCount = currentPayload === "sprayer" ? 12 : currentPayload === "spreader" ? 6 : currentPayload === "thermal-fogger" ? 4 : 5;
        for (let s = 0; s < spawnCount; s++) {
          const idx = Math.floor(Math.random() * PARTICLE_COUNT);
          if (particleLifetimes[idx] >= particleMaxLife[idx]) {
            particleLifetimes[idx] = 0;
            particleMaxLife[idx] = currentPayload === "thermal-fogger" ? 2.5 : currentPayload === "flower-dropping" ? 2.8 : 1.2;

            if (currentPayload === "sprayer") {
              // 1. FOR SPRAYING: SPRAY DIRECTLY FROM THE ARMS OF THE DRONE (NOT FROM CENTER)
              const armIdx = Math.floor(Math.random() * SPRAY_ARM_NOZZLES.length);
              const [anX, anY, anZ] = SPRAY_ARM_NOZZLES[armIdx];
              const localNozzle = new THREE.Vector3(
                anX + (Math.random() - 0.5) * 0.04,
                anY,
                anZ + (Math.random() - 0.5) * 0.04
              );
              localNozzle.applyEuler(droneGroup.rotation);
              const worldNozzlePos = droneState.position.clone().add(localNozzle);

              pos[idx * 3] = worldNozzlePos.x;
              pos[idx * 3 + 1] = worldNozzlePos.y;
              pos[idx * 3 + 2] = worldNozzlePos.z;

              // Cone spray velocity driving down under that arm with propeller downdraft
              particleVelocities[idx * 3] = localNozzle.x * 1.6 + (Math.random() - 0.5) * 0.8 + droneState.velocity.x * 0.35;
              particleVelocities[idx * 3 + 1] = -5.8 - Math.random() * 2.2;
              particleVelocities[idx * 3 + 2] = localNozzle.z * 1.6 + (Math.random() - 0.5) * 0.8 + droneState.velocity.z * 0.35;
            } else {
              const dronePos = droneState.position;
              pos[idx * 3] = dronePos.x + (Math.random() - 0.5) * 0.4;
              pos[idx * 3 + 1] = dronePos.y - 0.25;
              pos[idx * 3 + 2] = dronePos.z + (Math.random() - 0.5) * 0.4;

              if (currentPayload === "spreader") {
                const bAngle = Math.random() * Math.PI * 2;
                const bSpeed = 4.0 + Math.random() * 3.5;
                particleVelocities[idx * 3] = Math.sin(bAngle) * bSpeed + droneState.velocity.x * 0.3;
                particleVelocities[idx * 3 + 1] = -2.0 - Math.random() * 1.5;
                particleVelocities[idx * 3 + 2] = Math.cos(bAngle) * bSpeed + droneState.velocity.z * 0.3;
              } else if (currentPayload === "flower-dropping") {
                particleVelocities[idx * 3] = (Math.random() - 0.5) * 1.5;
                particleVelocities[idx * 3 + 1] = -1.2 - Math.random() * 0.8;
                particleVelocities[idx * 3 + 2] = (Math.random() - 0.5) * 1.5;
              } else if (currentPayload === "thermal-fogger") {
                particleVelocities[idx * 3] = (Math.random() - 0.5) * 2.2 - fwd.x * 3.0;
                particleVelocities[idx * 3 + 1] = 0.3 + (Math.random() - 0.5) * 0.8;
                particleVelocities[idx * 3 + 2] = (Math.random() - 0.5) * 2.2 - fwd.z * 3.0;
              } else if (currentPayload === "high-rise-cleaning") {
                // Pressurized water jet spraying toward the building facade (+X)
                particleVelocities[idx * 3] = 7.0 + (Math.random() - 0.5) * 1.2;
                particleVelocities[idx * 3 + 1] = -2.0 - Math.random() * 1.5;
                particleVelocities[idx * 3 + 2] = (Math.random() - 0.5) * 1.5;
              } else if (currentPayload === "solar-cleaning") {
                // Pressurized water jets shooting downward onto panels
                particleVelocities[idx * 3] = (Math.random() - 0.5) * 1.5;
                particleVelocities[idx * 3 + 1] = -6.5;
                particleVelocities[idx * 3 + 2] = (Math.random() - 0.5) * 1.5;
              } else {
                // Seed ball
                particleVelocities[idx * 3] = (Math.random() - 0.5) * 0.5;
                particleVelocities[idx * 3 + 1] = -5.0;
                particleVelocities[idx * 3 + 2] = (Math.random() - 0.5) * 0.5;
              }
            }
          }
        }
      }

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (particleLifetimes[i] < particleMaxLife[i]) {
          particleLifetimes[i] += dt;
          pos[i * 3] += particleVelocities[i * 3] * dt;
          pos[i * 3 + 1] += particleVelocities[i * 3 + 1] * dt;
          pos[i * 3 + 2] += particleVelocities[i * 3 + 2] * dt;

          if (pos[i * 3 + 1] <= 0.05) {
            pos[i * 3 + 1] = 0.05;
            particleVelocities[i * 3] *= 0.5;
            particleVelocities[i * 3 + 2] *= 0.5;
          }
        } else {
          pos[i * 3 + 1] = -999;
        }
      }
      particlePoints.geometry.attributes.position.needsUpdate = true;
    }

    // ── Dynamic Wet Swath Trail on Maize Crop (Sprayer) ──
    if (currentPayload === "sprayer" && isWorking) {
      spraySwathCounter += dt;
      if (spraySwathCounter > 0.35 && hSpeed > 1.2) {
        spraySwathCounter = 0;
        const swath = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 3.2), wetSwathMat);
        swath.rotation.x = -Math.PI / 2;
        swath.rotation.z = droneState.yaw;
        swath.position.set(droneState.position.x, 0.05, droneState.position.z);
        scene.add(swath);
        wetSwaths.push(swath);
        if (wetSwaths.length > 50) {
          const old = wetSwaths.shift();
          if (old) scene.remove(old);
        }
      }
    }

    // ── Spherical Hologram Animation (Requirement 3: Spherical Hologram with GoAG Logo) ──
    if (holoSphereGroup && holoBeam) {
      if (isWorking) {
        holoBeam.visible = true;
        holoSphereGroup.visible = true;

        // Volumetric light projector cone connects drone to the top of the sphere
        holoBeam.position.set(droneState.position.x, droneState.position.y - 1.45, droneState.position.z);

        // Spherical hologram floats below the drone
        holoSphereGroup.position.set(droneState.position.x, droneState.position.y - 2.85, droneState.position.z);

        // Rotate the outer geodesic wireframe sphere lattice
        if (holoGeodesicMesh) {
          holoGeodesicMesh.rotation.y += dt * 0.8;
          holoGeodesicMesh.rotation.x += dt * 0.35;
        }

        // Rotate orbital gimbal rings in multi-axis directions
        holoOrbitalRings.forEach((r, idx) => {
          if (idx === 0) r.rotation.z += dt * 1.6;
          else if (idx === 1) r.rotation.y += dt * 1.3;
          else r.rotation.x += dt * 1.4;
        });

        // Rotate the GoAG Services logo floating at the center of the sphere
        if (holoLogoMesh) {
          holoLogoMesh.rotation.y += dt * 1.4;
        }

        // Harmonic respiration pulse of the spherical hologram
        const pulse = 1.0 + Math.sin(timeElapsed * 3.5) * 0.05;
        holoSphereGroup.scale.set(pulse, pulse, pulse);
      } else {
        holoBeam.visible = false;
        holoSphereGroup.visible = false;
      }
    }

    // ── Winch Cable & Cargo Crate Animation (ONLY winch mechanism, NO spraying) ──
    if (winchCableMesh && winchCrate) {
      const droneP = droneState.position;
      // Cable unspools downward when action is active; hoists up when off
      const cableLen = isWorking ? Math.min(droneP.y - 0.35, 4.2) : 1.2;
      const crateP = new THREE.Vector3(droneP.x, Math.max(0.28, droneP.y - cableLen), droneP.z);

      const cablePos = (winchCableMesh.geometry.attributes.position.array as Float32Array);
      cablePos[0] = droneP.x;
      cablePos[1] = droneP.y - 0.22;
      cablePos[2] = droneP.z;
      cablePos[3] = crateP.x;
      cablePos[4] = crateP.y + 0.32;
      cablePos[5] = crateP.z;
      winchCableMesh.geometry.attributes.position.needsUpdate = true;

      winchCrate.position.copy(crateP);
      winchCrate.rotation.y = droneState.yaw;
    }

    // ── Video Texture Update for Aerial Screen ──
    if (currentPayload === "screen" && videoTexture) {
      videoTexture.needsUpdate = true;
    }

    // ── Battery Drain ──
    batteryTimer += dt;
    if (batteryTimer >= 1) {
      droneState.battery = Math.max(0, droneState.battery - 0.25);
      batteryTimer = 0;
    }

    // ── Waypoint Checking ──
    if (!mission.complete && mission.currentWaypoint < waypoints.length) {
      const wp = waypoints[mission.currentWaypoint];
      const dist = droneState.position.distanceTo(wp.position);
      if (dist < 4.0) {
        wp.reached = true;
        waypointMeshes[mission.currentWaypoint].visible = false;
        mission.score += 100;
        mission.currentWaypoint++;
        if (mission.currentWaypoint >= waypoints.length) {
          mission.complete = true;
          mission.score += 500;
        }
        if (missionCallback) missionCallback({ ...mission });
      }
    }

    // Waypoint pulse
    waypointMeshes.forEach((wm, i) => {
      if (wm.visible) {
        wm.rotation.y += dt * 0.9;
        wm.children[0].scale.setScalar(1 + Math.sin(timeElapsed * 3 + i) * 0.08);
      }
    });

    // ── Camera Follow Smooth Lerp (optimized so customer can directly look at the vertical screen & spherical hologram) ──
    const isScreen = currentPayload === "screen";
    const isHolo = currentPayload === "hologram";
    const camDist = isScreen ? -5.8 : isHolo ? -6.8 : -8.5;
    const camHeight = isScreen ? 0.3 : isHolo ? 1.0 : 3.8;
    const targetY = isScreen ? droneState.position.y - 1.75 : isHolo ? droneState.position.y - 2.85 : droneState.position.y;

    const idealCamOffset = new THREE.Vector3(
      -Math.sin(droneState.yaw) * camDist,
      camHeight,
      -Math.cos(droneState.yaw) * camDist
    );
    const idealCamPos = droneState.position.clone().add(idealCamOffset);
    camPos.lerp(idealCamPos, 0.05);
    camera.position.copy(camPos);
    camTarget.lerp(new THREE.Vector3(droneState.position.x, targetY, droneState.position.z), 0.09);
    camera.lookAt(camTarget);

    if (stateCallback) {
      stateCallback({
        ...droneState,
        position: droneState.position.clone(),
        velocity: droneState.velocity.clone(),
      });
    }

    renderer.render(scene, camera);
  }

  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", onResize);

  animate();

  return {
    canvas: renderer.domElement,
    destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      screenVideo.pause();
      screenVideo.src = "";
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    },
    getState: () => ({ ...droneState, position: droneState.position.clone(), velocity: droneState.velocity.clone() }),
    getMission: () => ({ ...mission }),
    getWaypoints: () => waypoints.map((w) => ({ ...w, position: w.position.clone() })),
    resetDrone,
    setPaused(v) { isPaused = v; },
    toggleAction() {
      actionActive = !actionActive;
      droneState.actionActive = actionActive;
      return actionActive;
    },
    setActionActive(v) {
      actionActive = v;
      droneState.actionActive = actionActive;
    },
    setMissionConfig(ind: string, pld: string) {
      currentIndustry = ind;
      currentPayload = pld;
      droneState.industry = ind;
      droneState.payload = pld;
      droneState.workProgress = 0;
      workProgress = 0;
      rebuildEnvironment();
      rebuildDronePayloadHardware();
      initActionSystems();
    },
    onStateChange(cb) { stateCallback = cb; },
    onMissionChange(cb) { missionCallback = cb; },
  };
}
