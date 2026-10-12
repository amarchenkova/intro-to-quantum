import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================================================
// AETHER-10K: Multi-Scale 3D Neutral-Atom Quantum Computer Digital Twin
// ============================================================================

const DATA = window.AETHER_DATA;

// --- Application State ---
const state = {
  selectedComponentId: 'zone-entangling',
  isolatedComponentId: null,
  activeScaleId: 'scale-2',
  speciesKey: 'dual-alkali',
  cutaway: true,
  showLabels: true,
  explodedFactor: 0, // 0.0 to 1.0
  cyclePlaying: true,
  cycleStage: 0,
  cycleTimer: 0,
  followStageCamera: false,
  layers: {
    slm: true,
    aod: true,
    rydberg: true,
    conveyor: true,
    mot: true,
    readout: true
  }
};

// --- Three.js Core Objects ---
const container = document.getElementById('canvas-container');
const labelsContainer = document.getElementById('labels-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060a14);

const camera = new THREE.PerspectiveCamera(
  42,
  container.clientWidth / container.clientHeight,
  0.002,
  160
);
camera.position.set(5.2, 3.8, 6.2);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance',
  logarithmicDepthBuffer: true
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.minDistance = 0.035;
controls.maxDistance = 42;
controls.target.set(0, 0.2, 0);

// Smooth Camera Flight Tween State
const cameraTween = {
  active: false,
  startPos: new THREE.Vector3(),
  endPos: new THREE.Vector3(),
  startTarget: new THREE.Vector3(),
  endTarget: new THREE.Vector3(),
  progress: 0,
  duration: 1.05
};

function flyCameraTo(posArray, targetArray, duration = 1.0) {
  cameraTween.startPos.copy(camera.position);
  cameraTween.endPos.set(posArray[0], posArray[1], posArray[2]);
  cameraTween.startTarget.copy(controls.target);
  cameraTween.endTarget.set(targetArray[0], targetArray[1], targetArray[2]);
  cameraTween.progress = 0;
  cameraTween.duration = duration;
  cameraTween.active = true;
}

// --- Lighting Setup ---
const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.72);
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.45);
dirLight1.position.set(14, 22, 16);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.75);
dirLight2.position.set(-15, 10, -12);
scene.add(dirLight2);

const corePointLight = new THREE.PointLight(0x38bdf8, 1.2, 8);
corePointLight.position.set(0, 0.4, 0);
scene.add(corePointLight);

// --- Component Registry & Exploded View Vectors ---
const componentGroups = new Map(); // id -> THREE.Group
const explodeVectors = new Map();  // id -> THREE.Vector3
const basePositions = new Map();   // id -> THREE.Vector3
const clickableMeshes = [];        // Array of Mesh with userData.componentId
const labelAnchors = [];           // { id, title, isZone, worldPos: Vector3, minDist, maxDist, el }

function registerComponentGroup(id, explodeVec = [0, 0, 0], labelInfo = null) {
  const group = new THREE.Group();
  group.name = id;
  group.userData.componentId = id;
  scene.add(group);
  componentGroups.set(id, group);
  basePositions.set(id, group.position.clone());
  explodeVectors.set(id, new THREE.Vector3(explodeVec[0], explodeVec[1], explodeVec[2]));

  if (labelInfo) {
    const el = document.createElement('div');
    el.className = `label-3d ${labelInfo.isZone ? 'zone-label' : ''}`;
    el.innerHTML = `<span class="lbl-dot"></span><span>${labelInfo.text}</span>`;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      selectComponent(id, true);
    });
    labelsContainer.appendChild(el);
    labelAnchors.push({
      id,
      group,
      localOffset: new THREE.Vector3(...(labelInfo.offset || [0, 0, 0])),
      minDist: labelInfo.minDist ?? 0.02,
      maxDist: labelInfo.maxDist ?? 40,
      el
    });
  }
  return group;
}

function tagGroupMeshes(group, id) {
  group.traverse((child) => {
    if (child.isMesh) {
      child.userData.componentId = id;
      clickableMeshes.push(child);
    }
  });
}

// --- Shared Materials ---
const mats = {
  steelTop: new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.75, roughness: 0.32 }),
  steelDark: new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.4 }),
  aluminum: new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.22 }),
  anodizedBlack: new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.65, roughness: 0.35 }),
  anodizedBlue: new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.7, roughness: 0.28 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.92, roughness: 0.16 }),
  copper: new THREE.MeshStandardMaterial({ color: 0xc2410c, metalness: 0.82, roughness: 0.26 }),
  muMetalOuter: new THREE.MeshPhysicalMaterial({
    color: 0x334155,
    metalness: 0.7,
    roughness: 0.25,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false
  }),
  quartzGlass: new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    metalness: 0.05,
    roughness: 0.05,
    transmission: 0.82,
    transparent: true,
    opacity: 0.32,
    ior: 1.46,
    depthWrite: false
  }),
  dichroicGlass: new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    metalness: 0.2,
    roughness: 0.08,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide
  }),
  teo2Crystal: new THREE.MeshPhysicalMaterial({
    color: 0x60a5fa,
    metalness: 0.1,
    roughness: 0.12,
    transparent: true,
    opacity: 0.75
  })
};

// Layer Groups for Laser Beams
const laserLayers = {
  slm: new THREE.Group(),
  aod: new THREE.Group(),
  rydberg: new THREE.Group(),
  conveyor: new THREE.Group(),
  mot: new THREE.Group(),
  readout: new THREE.Group()
};
Object.values(laserLayers).forEach((g) => scene.add(g));

// Helper for glowing laser cylinders
function createLaserBeam(start, end, radiusStart, radiusEnd, colorHex, opacity = 0.45) {
  const dir = new THREE.Vector3().subVectors(end, start);
  const len = dir.length();
  const geom = new THREE.CylinderGeometry(radiusEnd, radiusStart, len, 20, 1, true);
  geom.translate(0, len / 2, 0);
  geom.rotateX(Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.copy(start);
  mesh.lookAt(end);
  return mesh;
}

// ============================================================================
// BUILD 3D GEOMETRY ACROSS ALL 5 SCALES
// ============================================================================

// 1. Optical Table & Breadboard Grid (Scale 1)
function buildOpticalTable() {
  const g = registerComponentGroup('comp-optical-table', [0, -2.2, 0], {
    text: 'Active Optical Table (2.4m × 1.5m)',
    offset: [-7.5, -1.3, 4.8],
    minDist: 7,
    maxDist: 42
  });

  // Main honeycomb slab
  const slab = new THREE.Mesh(new THREE.BoxGeometry(18, 0.7, 11.5), mats.steelTop);
  slab.position.set(0, -1.95, 0);
  g.add(slab);

  // Subtle M6 tapped hole grid lines on top of optical table
  const gridHelper = new THREE.GridHelper(17.6, 44, 0x38bdf8, 0x1e293b);
  gridHelper.position.set(0, -1.59, 0);
  gridHelper.scale.z = 11.2 / 17.6;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.35;
  g.add(gridHelper);

  // 4 Pneumatic Isolator Legs
  const legCoords = [
    [-7.6, -3.5, -4.5],
    [7.6, -3.5, -4.5],
    [-7.6, -3.5, 4.5],
    [7.6, -3.5, 4.5]
  ];
  legCoords.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 2.5, 24), mats.steelDark);
    leg.position.set(x, y, z);
    g.add(leg);
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.35, 24), mats.brass);
    collar.position.set(x, y + 0.9, z);
    g.add(collar);
  });

  tagGroupMeshes(g, 'comp-optical-table');
}

// 2. Dual-Layer Mu-Metal Magnetic Shielding Enclosure (Scale 1)
let muMetalFrontHalf = null;
function buildMuMetalShield() {
  const g = registerComponentGroup('comp-mu-metal', [0, 3.2, 0], {
    text: 'Dual-Layer Mu-Metal Shield (>80 dB)',
    offset: [-4.2, 3.3, -3.5],
    minDist: 5.5,
    maxDist: 42
  });

  // Back/Top/Left structural shell (always visible as wireframe + translucent shell)
  const backBox = new THREE.Mesh(new THREE.BoxGeometry(10.8, 4.8, 7.6), mats.muMetalOuter);
  backBox.position.set(-0.6, 0.85, 0);
  g.add(backBox);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(10.8, 4.8, 7.6)),
    new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 })
  );
  edges.position.copy(backBox.position);
  g.add(edges);

  // Inner layer wireframe
  const innerEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(10.4, 4.4, 7.2)),
    new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.2 })
  );
  innerEdges.position.copy(backBox.position);
  g.add(innerEdges);

  // Solid removable front-right cutaway cover
  const coverMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.78,
    roughness: 0.28,
    transparent: true,
    opacity: 0.78
  });
  muMetalFrontHalf = new THREE.Mesh(new THREE.BoxGeometry(10.85, 4.85, 0.12), coverMat);
  muMetalFrontHalf.position.set(-0.6, 0.85, 3.82);
  muMetalFrontHalf.visible = !state.cutaway;
  g.add(muMetalFrontHalf);

  tagGroupMeshes(g, 'comp-mu-metal');
}

// 3. Remote 2D+ MOT Pre-Cooler & Differential Pumping Tube (Scale 1)
function build2DMOT() {
  const g = registerComponentGroup('comp-2d-mot', [-2.2, 0, 0], {
    text: '2D⁺ MOT Source & Diff. Pumping Tube',
    offset: [-4.6, 0.95, 0],
    minDist: 2.2,
    maxDist: 38
  });

  // 2D MOT Glass Cell
  const motGlass = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.85, 0.85), mats.quartzGlass);
  motGlass.position.set(-4.6, 0, 0);
  g.add(motGlass);

  // 2D Quadrupole RacTrack Coils around 2D MOT
  const coilPositions = [
    [-4.6, 0.52, 0, Math.PI / 2, 0],
    [-4.6, -0.52, 0, Math.PI / 2, 0],
    [-4.6, 0, 0.52, 0, 0],
    [-4.6, 0, -0.52, 0, 0]
  ];
  coilPositions.forEach(([x, y, z, rx, ry]) => {
    const c = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.05, 12, 32), mats.copper);
    c.position.set(x, y, z);
    c.rotation.set(rx, ry, 0);
    g.add(c);
  });

  // Differential Pumping Tube + Gate Valve connecting 2D MOT (-3.8) to Science Cell (-1.15)
  const diffTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 2.65, 24).rotateZ(Math.PI / 2),
    mats.aluminum
  );
  diffTube.position.set(-2.5, 0, 0);
  g.add(diffTube);

  // ConFlat CF Flanges along the differential pumping line
  [-3.8, -2.9, -1.9, -1.18].forEach((fx) => {
    const flange = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 0.09, 24).rotateZ(Math.PI / 2),
      mats.steelTop
    );
    flange.position.set(fx, 0, 0);
    g.add(flange);
  });

  // Rb/Cs Alkali Dispenser Ampoule below 2D MOT
  const ampoule = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.7, 16), mats.brass);
  ampoule.position.set(-4.6, -0.7, 0);
  g.add(ampoule);

  // 2D MOT Transverse Cooling Beams + Axial Push Beam
  const pushBeam = createLaserBeam(
    new THREE.Vector3(-5.8, 0, 0),
    new THREE.Vector3(-0.45, 0, 0),
    0.04,
    0.025,
    0xec4899,
    0.55
  );
  laserLayers.mot.add(pushBeam);

  const motCross1 = createLaserBeam(
    new THREE.Vector3(-4.6, 0, -1.4),
    new THREE.Vector3(-4.6, 0, 1.4),
    0.16,
    0.16,
    0xec4899,
    0.3
  );
  const motCross2 = createLaserBeam(
    new THREE.Vector3(-4.6, -1.4, 0),
    new THREE.Vector3(-4.6, 1.4, 0),
    0.16,
    0.16,
    0xec4899,
    0.3
  );
  laserLayers.mot.add(motCross1, motCross2);

  tagGroupMeshes(g, 'comp-2d-mot');
}

// 4. XHV Pumping Manifold (StarCell Ion Pump + Ti-Sub + SAES NEG)
function buildUHVPumps() {
  const g = registerComponentGroup('comp-uhv-pumps', [-1.5, -1.2, -1.8], {
    text: 'XHV Ion + NEG Pumps (<8×10⁻¹² Torr)',
    offset: [-2.6, -0.5, -2.1],
    minDist: 2.5,
    maxDist: 38
  });

  // 6-way UHV Cross connecting to differential tube & science chamber
  const crossZ = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 2.2, 24).rotateX(Math.PI / 2),
    mats.aluminum
  );
  crossZ.position.set(-2.5, 0, -1.1);
  g.add(crossZ);

  // Large StarCell Ion Pump Body
  const ionPump = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.15, 1.15), mats.anodizedBlack);
  ionPump.position.set(-2.5, -0.75, -2.1);
  g.add(ionPump);

  // Ferrite Magnet Yokes on Ion Pump
  const yoke = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.9, 0.35), mats.copper);
  yoke.position.set(-2.5, -0.75, -2.1);
  g.add(yoke);

  // Titanium Sublimation & NEG Cartridge Dome
  const negDome = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 1.1, 24), mats.steelTop);
  negDome.position.set(-2.5, 0.65, -2.1);
  g.add(negDome);

  tagGroupMeshes(g, 'comp-uhv-pumps');
}

// 5. Optical-Contact Bonded AR Fused-Silica Science Cell (Scale 3)
function buildScienceCell() {
  const g = registerComponentGroup('comp-science-cell', [0, 0, 0], {
    text: 'UHV Fused-Silica Science Cell (λ/20 AR)',
    offset: [0, 0.55, 0.68],
    minDist: 0.7,
    maxDist: 14
  });

  // Outer quartz walls (hollow appearance via physical glass + crisp cyan edges)
  const cellGeom = new THREE.BoxGeometry(2.1, 0.72, 1.18);
  const cellMesh = new THREE.Mesh(cellGeom, mats.quartzGlass);
  g.add(cellMesh);

  const cellEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(cellGeom),
    new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.75 })
  );
  g.add(cellEdges);

  // Glass-to-Metal Transition Collar on Left (-1.12)
  const collar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 0.22, 24).rotateZ(Math.PI / 2),
    mats.steelTop
  );
  collar.position.set(-1.12, 0, 0);
  g.add(collar);

  // 3D MOT 6-Axis Diagonal Laser Beams intersecting the Science Cell
  const diag1 = createLaserBeam(
    new THREE.Vector3(-1.3, -1.1, -1.3),
    new THREE.Vector3(1.3, 1.1, 1.3),
    0.09,
    0.09,
    0xec4899,
    0.22
  );
  const diag2 = createLaserBeam(
    new THREE.Vector3(-1.3, 1.1, 1.3),
    new THREE.Vector3(1.3, -1.1, -1.3),
    0.09,
    0.09,
    0xec4899,
    0.22
  );
  laserLayers.mot.add(diag1, diag2);

  tagGroupMeshes(g, 'comp-science-cell');
}

// 6. In-Vacuum 8-Rod Octupole E-Field Electrodes & 6.834 GHz MW Loop (Scale 3)
function buildInVacuumElectrodes() {
  const g = registerComponentGroup('comp-electrodes', [0, 0.35, 0], {
    text: '8-Rod Octupole E-Field & 6.834 GHz MW Loop',
    offset: [-0.68, 0.26, 0.45],
    minDist: 0.45,
    maxDist: 8
  });

  // 8 Gold-plated molybdenum octupole rods running parallel to X inside the quartz cell
  const rodOffsets = [
    [0.24, 0.38],
    [0.24, -0.38],
    [-0.24, 0.38],
    [-0.24, -0.38],
    [0.11, 0.48],
    [0.11, -0.48],
    [-0.11, 0.48],
    [-0.11, -0.48]
  ];
  rodOffsets.forEach(([y, z]) => {
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 1.75, 14).rotateZ(Math.PI / 2),
      mats.gold
    );
    rod.position.set(0, y, z);
    g.add(rod);
  });

  // In-Vacuum 6.834 GHz / 9.192 GHz Microwave Loop Antenna around the Storage/Entangling region
  const mwLoop = new THREE.Mesh(
    new THREE.TorusGeometry(0.36, 0.018, 14, 48).rotateX(Math.PI / 2),
    mats.copper
  );
  mwLoop.position.set(0.05, 0.28, 0);
  g.add(mwLoop);

  tagGroupMeshes(g, 'comp-electrodes');
}

// 7. 3-Axis Helmholtz Bias & Water-Cooled Anti-Helmholtz Coils (Scale 2)
function buildMagneticCoils() {
  const g = registerComponentGroup('comp-coils', [0, 0.9, 0], {
    text: '3-Axis Helmholtz & MOT Coils (Bz = 8.5 G)',
    offset: [1.35, 0.92, 1.05],
    minDist: 1.2,
    maxDist: 25
  });

  // Upper & Lower Z-Axis Anti-Helmholtz / Quantization Coils
  [0.88, -0.88].forEach((y) => {
    const coil = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.11, 18, 48).rotateX(Math.PI / 2),
      mats.copper
    );
    coil.position.set(0, y, 0);
    g.add(coil);

    const mountRing = new THREE.Mesh(
      new THREE.CylinderGeometry(1.28, 1.28, 0.06, 40, 1, true),
      mats.anodizedBlack
    );
    mountRing.position.set(0, y, 0);
    g.add(mountRing);
  });

  // Front & Back Z-Shim Rectangular/Circular Coils
  [0.92, -0.92].forEach((z) => {
    const shim = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.055, 14, 36), mats.copper);
    shim.position.set(0, 0, z);
    g.add(shim);
  });

  tagGroupMeshes(g, 'comp-coils');
}

// 8. Dual Opposing High-NA (NA = 0.75) Apochromatic Microscope Objectives (Scale 2 & 3)
function buildHighNAObjectives() {
  const g = registerComponentGroup('comp-objectives', [0, 0.65, 0], {
    text: 'Dual Opposing NA=0.75 Objectives (WD=4.2mm)',
    offset: [0.55, 0.75, 0],
    minDist: 0.4,
    maxDist: 22
  });

  // Build both Upper (+Y) and Lower (-Y) Objective Assemblies
  [1, -1].forEach((dir) => {
    const objGroup = new THREE.Group();

    // Conical Nosepiece approaching the 4mm quartz window
    const nose = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.52, 0.42, 32),
      mats.brass
    );
    nose.position.y = 0.62;
    if (dir === -1) {
      nose.rotation.x = Math.PI;
      nose.position.y = -0.62;
    }
    objGroup.add(nose);

    // Main Apochromatic Barrel
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.54, 0.54, 0.78, 32),
      mats.anodizedBlack
    );
    barrel.position.y = dir * 1.22;
    objGroup.add(barrel);

    // Gold Correction Collar Ring (4.0 mm Fused Silica Spherical Aberration Collar)
    const collar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.565, 0.565, 0.14, 32),
      mats.gold
    );
    collar.position.y = dir * 1.05;
    objGroup.add(collar);

    // Final Front Meniscus Lens Element gleaming at tip
    const frontLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.21, 0.04, 24),
      mats.dichroicGlass
    );
    frontLens.position.y = dir * 0.42;
    objGroup.add(frontLens);

    g.add(objGroup);
  });

  tagGroupMeshes(g, 'comp-objectives');
}

// 9. LCoS Spatial Light Modulator (SLM) Static Tweezer Arm (12,000 Sites)
function buildSLMArm() {
  const g = registerComponentGroup('comp-slm-arm', [1.8, 0.9, -1.2], {
    text: 'LCoS SLM Static Tweezer Arm (12,000 Sites)',
    offset: [3.2, 1.95, -1.2],
    minDist: 1.5,
    maxDist: 35
  });

  // Vertical Optical Tower Post
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.45, 3.5, 0.45), mats.anodizedBlack);
  tower.position.set(3.2, 0.15, -1.2);
  g.add(tower);

  // Water-Cooled LCoS SLM Head (1920 x 1200)
  const slmBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.35), mats.anodizedBlue);
  slmBody.position.set(3.2, 1.65, -1.2);
  slmBody.rotation.y = -Math.PI / 6;
  g.add(slmBody);

  // Reflective Silicon CMOS Window on SLM
  const slmScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.28), mats.dichroicGlass);
  slmScreen.position.set(3.04, 1.65, -1.01);
  slmScreen.rotation.y = -Math.PI / 6;
  g.add(slmScreen);

  // 4f Relay Telescope Lenses & Dichroic Combiner above Upper Objective
  const relayLens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.08, 24).rotateZ(Math.PI / 2),
    mats.dichroicGlass
  );
  relayLens.position.set(1.55, 1.65, -0.6);
  relayLens.rotation.y = -Math.PI / 3;
  g.add(relayLens);

  const upperDichroic = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.05, 0.62),
    mats.dichroicGlass
  );
  upperDichroic.position.set(0, 1.65, 0);
  upperDichroic.rotation.z = Math.PI / 4;
  g.add(upperDichroic);

  // SLM Laser Beam Path (813/852/1064 nm) into Upper Objective -> Focal Plane
  const beam1 = createLaserBeam(
    new THREE.Vector3(3.05, 1.65, -1.05),
    new THREE.Vector3(0, 1.65, 0),
    0.14,
    0.18,
    0xf43f5e,
    0.38
  );
  const beam2 = createLaserBeam(
    new THREE.Vector3(0, 1.65, 0),
    new THREE.Vector3(0, 0.0, 0),
    0.015,
    0.22,
    0xf43f5e,
    0.45
  );
  laserLayers.slm.add(beam1, beam2);

  tagGroupMeshes(g, 'comp-slm-arm');
}

// 10. Crossed 2D TeO2 Acousto-Optic Deflector (AOD) Shuttling Arm
function buildAODArm() {
  const g = registerComponentGroup('comp-aod-arm', [1.8, -0.8, 1.2], {
    text: 'Crossed 2D TeO₂ AOD Shuttling Arm (0.55 µm/µs)',
    offset: [2.9, -0.45, 1.4],
    minDist: 1.5,
    maxDist: 35
  });

  // Optical Rail Base
  const rail = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.18, 0.7), mats.anodizedBlack);
  rail.position.set(2.2, -1.35, 1.0);
  rail.rotation.y = Math.PI / 6;
  g.add(rail);

  // X-Axis and Y-Axis Shear-Mode TeO2 AOD Housings
  [
    [2.8, -0.95, 1.35, 'X-AOD'],
    [2.1, -0.95, 0.95, 'Y-AOD']
  ].forEach(([x, y, z]) => {
    const housing = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.52, 0.46), mats.brass);
    housing.position.set(x, y, z);
    housing.rotation.y = Math.PI / 6;
    g.add(housing);

    const crystal = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.5), mats.teo2Crystal);
    crystal.position.set(x, y, z);
    crystal.rotation.y = Math.PI / 6;
    g.add(crystal);
  });

  // Lower Dichroic Mirror under Lower High-NA Objective
  const lowerDichroic = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.05, 0.62),
    mats.dichroicGlass
  );
  lowerDichroic.position.set(0, -1.65, 0);
  lowerDichroic.rotation.z = -Math.PI / 4;
  g.add(lowerDichroic);

  // 2D AOD Shuttling Laser Path into Lower Objective -> Focal Plane
  const aodBeam1 = createLaserBeam(
    new THREE.Vector3(3.3, -0.95, 1.65),
    new THREE.Vector3(0, -1.65, 0),
    0.12,
    0.16,
    0xf59e0b,
    0.42
  );
  const aodBeam2 = createLaserBeam(
    new THREE.Vector3(0, -1.65, 0),
    new THREE.Vector3(0, 0, 0),
    0.015,
    0.2,
    0xf59e0b,
    0.48
  );
  laserLayers.aod.add(aodBeam1, aodBeam2);

  tagGroupMeshes(g, 'comp-aod-arm');
}

// 11. Counter-Propagating Top-Hat Rydberg Excitation Optics (480 nm + 780 nm / 302 nm)
let rydbergSheetMesh1 = null;
let rydbergSheetMesh2 = null;
function buildRydbergOptics() {
  const g = registerComponentGroup('comp-rydberg-optics', [0, 0, 1.8], {
    text: 'Top-Hat Rydberg Excitation Optics (99.55% CZ)',
    offset: [0.26, 0.42, 2.3],
    minDist: 1.2,
    maxDist: 35
  });

  // Front (+Z) 480nm Blue / 302nm UV Cylindrical Top-Hat Shaping Bench
  const frontBench = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 1.25), mats.anodizedBlue);
  frontBench.position.set(0.26, -0.1, 2.45);
  g.add(frontBench);

  const powellLensF = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.12, 24).rotateX(Math.PI / 2),
    mats.dichroicGlass
  );
  powellLensF.position.set(0.26, 0.0, 1.72);
  g.add(powellLensF);

  // Back (-Z) 780nm / 1038nm IR Counter-Propagating Shaping Bench
  const backBench = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 1.25), mats.anodizedBlack);
  backBench.position.set(0.26, -0.1, -2.45);
  g.add(backBench);

  const powellLensB = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.12, 24).rotateX(Math.PI / 2),
    mats.dichroicGlass
  );
  powellLensB.position.set(0.26, 0.0, -1.72);
  g.add(powellLensB);

  // Counter-Propagating Elliptical Flat-Top Laser Sheets strictly targeting Zone 4 (x = +0.26)
  rydbergSheetMesh1 = createLaserBeam(
    new THREE.Vector3(0.26, 0, 1.72),
    new THREE.Vector3(0.26, 0, 0),
    0.045,
    0.11,
    0x00e5ff,
    0.55
  );
  rydbergSheetMesh2 = createLaserBeam(
    new THREE.Vector3(0.26, 0, -1.72),
    new THREE.Vector3(0.26, 0, 0),
    0.045,
    0.11,
    0xff2a55,
    0.48
  );
  laserLayers.rydberg.add(rydbergSheetMesh1, rydbergSheetMesh2);

  // Also add the Optical Lattice Conveyor Belt Laser Source (1064 nm) targeting Zone 1 (x = -0.52)
  const conveyorSourceF = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.6, 20).rotateX(Math.PI / 2), mats.aluminum);
  conveyorSourceF.position.set(-0.52, 0, 1.75);
  g.add(conveyorSourceF);

  const conveyorSourceB = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.6, 20).rotateX(Math.PI / 2), mats.aluminum);
  conveyorSourceB.position.set(-0.52, 0, -1.75);
  g.add(conveyorSourceB);

  const convBeam = createLaserBeam(
    new THREE.Vector3(-0.52, 0, 1.65),
    new THREE.Vector3(-0.52, 0, -1.65),
    0.055,
    0.055,
    0x10b981,
    0.42
  );
  laserLayers.conveyor.add(convBeam);

  tagGroupMeshes(g, 'comp-rydberg-optics');
}

// 12. qCMOS / EMCCD Fluorescence Camera & Cavity Readout Port
let readoutConeMesh = null;
function buildQCMOSCamera() {
  const g = registerComponentGroup('comp-qcmos-camera', [-1.4, 1.4, 0], {
    text: 'qCMOS Fluorescence Camera (99.99% Fidelity)',
    offset: [-2.1, 2.55, 0],
    minDist: 1.5,
    maxDist: 35
  });

  // Camera Support Periscope Arm from Upper Dichroic (0, 1.65, 0) to qCMOS Sensor (-2.2, 2.35, 0)
  const tube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 2.2, 24).rotateZ(Math.PI / 2.4),
    mats.anodizedBlack
  );
  tube.position.set(-1.1, 2.0, 0);
  g.add(tube);

  // Back-Illuminated Water-Cooled qCMOS Camera Head
  const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.78, 0.78), mats.anodizedBlack);
  camBody.position.set(-2.2, 2.35, 0);
  g.add(camBody);

  // Gold Copper Liquid Cooling Plate on back of qCMOS
  const coolingPlate = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.72, 0.72), mats.copper);
  coolingPlate.position.set(-2.65, 2.35, 0);
  g.add(coolingPlate);

  // Upward Fluorescence Collection Cone from Zone 5 (+0.50, 0, 0) -> Upper Dichroic -> qCMOS
  readoutConeMesh = createLaserBeam(
    new THREE.Vector3(0.50, 0, 0),
    new THREE.Vector3(0, 1.65, 0),
    0.16,
    0.04,
    0xa855f7,
    0.45
  );
  const readoutRelay = createLaserBeam(
    new THREE.Vector3(0, 1.65, 0),
    new THREE.Vector3(-2.1, 2.35, 0),
    0.12,
    0.14,
    0xa855f7,
    0.4
  );
  laserLayers.readout.add(readoutConeMesh, readoutRelay);

  tagGroupMeshes(g, 'comp-qcmos-camera');
}

// 13. Real-Time FPGA / RF-SoC QEC Controller & Correlated ML Decoder Rack (Scale 1)
function buildFPGAController() {
  const g = registerComponentGroup('comp-fpga-controller', [2.8, 0, -1.8], {
    text: 'FPGA / RF-SoC QEC Controller & ML Decoder (<12 µs)',
    offset: [6.5, 2.3, -3.2],
    minDist: 4.0,
    maxDist: 42
  });

  // 19-inch Electronics Cabinet on Right Side of Optical Table
  const rack = new THREE.Mesh(new THREE.BoxGeometry(2.1, 3.6, 1.9), mats.steelDark);
  rack.position.set(6.5, 0.25, -3.2);
  g.add(rack);

  // Blade Server / AWG / RF-SoC Front Panels with LED status strips
  for (let i = 0; i < 6; i++) {
    const y = -1.1 + i * 0.48;
    const blade = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.36, 1.94), mats.anodizedBlack);
    blade.position.set(6.5, y, -3.2);
    g.add(blade);

    const ledColor = i % 2 === 0 ? 0x38bdf8 : 0x10b981;
    const ledStrip = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.04, 1.96),
      new THREE.MeshBasicMaterial({ color: ledColor })
    );
    ledStrip.position.set(6.5, y + 0.08, -3.2);
    g.add(ledStrip);
  }

  tagGroupMeshes(g, 'comp-fpga-controller');
}

// ============================================================================
// SCALE 4: 5-ZONE FOCAL PLANE MICRO-ARCHITECTURE (x = -0.64 to +0.64 at Origin)
// ============================================================================
const dynamicFocalObjects = {
  conveyorFringes: [],
  conveyorAtoms: [],
  reservoirAtoms: [],
  storagePatches: [],
  mobileShuttlePatches: [],
  entanglingPairs: [],
  blockadeSpheres: [],
  readoutAtoms: [],
  erasureHalos: [],
  dataAtomMeshes: [],
  ancillaAtomMeshes: []
};

function createZonePad(xCenter, width, depth, colorHex, labelText, compId) {
  const g = registerComponentGroup(compId, [0, 0, 0], {
    text: labelText,
    isZone: true,
    offset: [xCenter, 0.11, -depth * 0.45],
    minDist: 0.08,
    maxDist: 3.4
  });

  // Translucent zone floor boundary plate in focal plane
  const planeGeom = new THREE.BoxGeometry(width, 0.004, depth);
  const planeMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.16,
    depthWrite: false
  });
  const pad = new THREE.Mesh(planeGeom, planeMat);
  pad.position.set(xCenter, -0.004, 0);
  g.add(pad);

  // Crisp glowing zone perimeter border
  const border = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(width, 0.005, depth)),
    new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.8 })
  );
  border.position.copy(pad.position);
  g.add(border);

  return g;
}

function buildFiveZoneFocalPlane() {
  const atomSphereGeom = new THREE.SphereGeometry(0.0065, 16, 16);
  const tweezerConeGeom = new THREE.CylinderGeometry(0.002, 0.011, 0.075, 12, 1, true);

  // --------------------------------------------------------------------------
  // ZONE 1: Dual Optical Lattice Conveyor Belt (Chiu et al., Nature Sept 2025)
  // x in [-0.62, -0.44]
  // --------------------------------------------------------------------------
  const z1 = createZonePad(
    -0.53,
    0.17,
    0.52,
    0x10b981,
    'Zone 1: Lattice Conveyor Reload (300k atoms/s)',
    'zone-conveyor'
  );

  // Standing-wave 1064nm interference disks + moving cold atoms
  const fringeMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  for (let i = 0; i < 14; i++) {
    const zPos = -0.22 + (i / 14) * 0.44;
    const disk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.032, 0.004, 20).rotateX(Math.PI / 2),
      fringeMat
    );
    disk.position.set(-0.53, 0, zPos);
    z1.add(disk);
    dynamicFocalObjects.conveyorFringes.push(disk);

    const cAtom = new THREE.Mesh(
      atomSphereGeom,
      new THREE.MeshBasicMaterial({ color: 0x34d399 })
    );
    cAtom.position.set(-0.53 + (Math.random() - 0.5) * 0.03, 0, zPos);
    z1.add(cAtom);
    dynamicFocalObjects.conveyorAtoms.push(cAtom);
  }

  // Optical Baffle Wall shielding Zone 3 from Zone 1 cooling scatter
  const baffle1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.008, 0.09, 0.54),
    mats.anodizedBlack
  );
  baffle1.position.set(-0.44, 0, 0);
  z1.add(baffle1);
  tagGroupMeshes(z1, 'zone-conveyor');

  // --------------------------------------------------------------------------
  // ZONE 2: Reservoir & Defect-Free Sorting Zone (Manetsch/Endres, Nature 2025)
  // x in [-0.43, -0.23]
  // --------------------------------------------------------------------------
  const z2 = createZonePad(
    -0.33,
    0.19,
    0.52,
    0xf59e0b,
    'Zone 2: Reservoir & Defect-Free AOD Sorting',
    'zone-reservoir'
  );

  const dataAtomMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.85,
    roughness: 0.2
  });
  const ancillaAtomMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.85,
    roughness: 0.2
  });
  dynamicFocalObjects.dataAtomMeshes.push(dataAtomMat);
  dynamicFocalObjects.ancillaAtomMeshes.push(ancillaAtomMat);

  const slmTrapMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  // 5 x 9 Reservoir Tweezer Grid with animated AOD compression tweezers
  for (let ix = 0; ix < 5; ix++) {
    for (let iz = 0; iz < 9; iz++) {
      const px = -0.40 + ix * 0.035;
      const pz = -0.20 + iz * 0.05;
      const trap = new THREE.Mesh(tweezerConeGeom, slmTrapMat);
      trap.position.set(px, 0, pz);
      z2.add(trap);

      const atom = new THREE.Mesh(atomSphereGeom, (ix + iz) % 2 === 0 ? dataAtomMat : ancillaAtomMat);
      atom.position.set(px, 0, pz);
      z2.add(atom);
      dynamicFocalObjects.reservoirAtoms.push({
        mesh: atom,
        baseX: px,
        baseZ: pz,
        phase: ix * 0.7 + iz * 0.4
      });
    }
  }
  tagGroupMeshes(z2, 'zone-reservoir');

  // --------------------------------------------------------------------------
  // ZONE 3: Shielded Quantum Memory & Logical Storage Zone (T2 = 12.6s - 40s)
  // x in [-0.22, +0.11]
  // --------------------------------------------------------------------------
  const z3 = createZonePad(
    -0.055,
    0.32,
    0.52,
    0x38bdf8,
    'Zone 3: Shielded Logical Storage (22× Fidelity Gain)',
    'zone-storage'
  );

  // Create 6 Logical Code Patches (each a 3x3 physical qubit block representing Surface/Color/qLDPC patch)
  const patchCenters = [
    [-0.14, -0.15],
    [-0.14, 0.0],
    [-0.14, 0.15],
    [0.01, -0.15],
    [0.01, 0.0],
    [0.01, 0.15]
  ];
  patchCenters.forEach(([cx, cz], pIdx) => {
    const patchGroup = new THREE.Group();
    patchGroup.position.set(cx, 0, cz);

    // Logical patch outline plaque
    const plaque = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.095, 0.002, 0.095)),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55 })
    );
    patchGroup.add(plaque);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        const lx = dx * 0.028;
        const lz = dz * 0.028;
        const trap = new THREE.Mesh(tweezerConeGeom, slmTrapMat);
        trap.position.set(lx, 0, lz);
        patchGroup.add(trap);

        const isAncilla = (dx + dz) % 2 !== 0;
        const atom = new THREE.Mesh(atomSphereGeom, isAncilla ? ancillaAtomMat : dataAtomMat);
        atom.position.set(lx, 0, lz);
        patchGroup.add(atom);
      }
    }
    z3.add(patchGroup);
    dynamicFocalObjects.storagePatches.push({
      group: patchGroup,
      homeX: cx,
      homeZ: cz,
      isShuttlingPatch: pIdx >= 3 // Right-column logical patches shuttle into Zone 4!
    });
  });

  // Mobile 2D AOD Shuttling Tweezer Beams attached to the shuttling logical patches
  const aodTrapMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  dynamicFocalObjects.storagePatches
    .filter((p) => p.isShuttlingPatch)
    .forEach((p) => {
      const aodBeam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.048, 0.048, 0.12, 16, 1, true),
        aodTrapMat
      );
      p.group.add(aodBeam);
      p.aodHighlight = aodBeam;
    });

  tagGroupMeshes(z3, 'zone-storage');

  // --------------------------------------------------------------------------
  // ZONE 4: Parallel Rydberg Entangling Zone (Evered 2023 / Bluvstein 2026)
  // x in [+0.12, +0.40]
  // --------------------------------------------------------------------------
  const z4 = createZonePad(
    0.26,
    0.26,
    0.52,
    0x00e5ff,
    'Zone 4: Parallel Rydberg Entangling Zone (F_CZ = 99.55%)',
    'zone-entangling'
  );

  const blockadeMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.22,
    wireframe: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const blockadeWireMat = new THREE.MeshBasicMaterial({
    color: 0x7dd3fc,
    transparent: true,
    opacity: 0.45,
    wireframe: true
  });

  // Create 3x3 array of Rydberg-blockaded qubit pairs across Zone 4
  // Notice: The pair at (0.26, 0, 0.02) is our ultra-detailed Scale 5 microscopic showcase!
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      const px = 0.26 + col * 0.068;
      const pz = row * 0.14;

      // Skip the exact center pair here if we build the ultra-detailed Scale 5 assembly at (0.26, 0, 0.02)
      const isHeroPair = row === 0 && col === 0;
      const pairZ = isHeroPair ? 0.02 : pz;

      // Left Atom (Data) & Right Atom (Ancilla/Target) separated by d = 3.5 µm (0.018 units)
      const dHalf = 0.009;
      const trap1 = new THREE.Mesh(tweezerConeGeom, slmTrapMat);
      trap1.position.set(px - dHalf, 0, pairZ);
      const trap2 = new THREE.Mesh(tweezerConeGeom, aodTrapMat);
      trap2.position.set(px + dHalf, 0, pairZ);
      z4.add(trap1, trap2);

      const atom1 = new THREE.Mesh(atomSphereGeom, dataAtomMat);
      atom1.position.set(px - dHalf, 0, pairZ);
      const atom2 = new THREE.Mesh(atomSphereGeom, ancillaAtomMat);
      atom2.position.set(px + dHalf, 0, pairZ);
      z4.add(atom1, atom2);

      // Rydberg Blockade Sphere (Rb = 9.2 µm -> radius 0.026 around the pair)
      const rSphere = new THREE.Mesh(new THREE.SphereGeometry(0.026, 24, 24), blockadeMat);
      rSphere.position.set(px, 0, pairZ);
      const rWire = new THREE.Mesh(new THREE.SphereGeometry(0.0265, 14, 14), blockadeWireMat);
      rWire.position.set(px, 0, pairZ);
      z4.add(rSphere, rWire);

      dynamicFocalObjects.blockadeSpheres.push({ sphere: rSphere, wire: rWire, isHeroPair });
    }
  }

  tagGroupMeshes(z4, 'zone-entangling');

  // --------------------------------------------------------------------------
  // ZONE 5: Isolated Mid-Circuit Readout, Erasure Detection & Reset Zone
  // x in [+0.41, +0.62]
  // --------------------------------------------------------------------------
  const z5 = createZonePad(
    0.515,
    0.20,
    0.52,
    0xa855f7,
    'Zone 5: Mid-Circuit Readout, Erasure & Reset',
    'zone-readout'
  );

  // Knife-edge conjugate optical baffle between Zone 4 and Zone 5
  const baffle2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.008, 0.09, 0.54),
    mats.anodizedBlack
  );
  baffle2.position.set(0.405, 0, 0);
  z5.add(baffle2);

  // Ancilla Qubits undergoing 99.99% fluorescence readout + heralded erasure check
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xc084fc,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  for (let ix = 0; ix < 3; ix++) {
    for (let iz = -2; iz <= 2; iz++) {
      const rx = 0.455 + ix * 0.05;
      const rz = iz * 0.085;
      const atom = new THREE.Mesh(atomSphereGeom, ancillaAtomMat);
      atom.position.set(rx, 0, rz);
      z5.add(atom);

      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.009, 0.019, 24).rotateX(-Math.PI / 2),
        haloMat.clone()
      );
      halo.position.set(rx, 0.002, rz);
      z5.add(halo);
      dynamicFocalObjects.erasureHalos.push({
        halo,
        isErasureFlagged: ix === 1 && iz === 0
      });
    }
  }

  tagGroupMeshes(z5, 'zone-readout');
}

// ============================================================================
// SCALE 5: MICROSCOPIC SINGLE-TWEEZER PAIR, BLOCH VECTORS & RAMAN BEAM (10 µm)
// Centered at (0.26, 0, 0.02) inside Zone 4
// ============================================================================
const microVisuals = {
  blochArrow1: null,
  blochArrow2: null,
  ramanBeam: null,
  dipoleWaveRing: null
};

function buildMicroscopicTweezerShowcase() {
  const center = new THREE.Vector3(0.26, 0, 0.02);
  const dHalf = 0.009; // 3.5 µm physical separation scaled

  // 5A. High-Resolution Gaussian Optical Tweezer Hourglasses & Harmonic Trap Potential
  const gTweezer = registerComponentGroup('micro-tweezer-pair', [0, 0, 0], {
    text: 'w₀ = 0.8 µm Optical Tweezer Waist (d = 3.5 µm)',
    offset: [0.26 - dHalf, 0.048, 0.02],
    minDist: 0.02,
    maxDist: 0.55
  });

  [-dHalf, dHalf].forEach((dx, idx) => {
    // Upper and lower Gaussian waist cones meeting at the focal waist
    const waistMat = new THREE.MeshBasicMaterial({
      color: idx === 0 ? 0xf43f5e : 0xf59e0b,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const upperHorn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.0032, 0.055, 24, 8, true),
      waistMat
    );
    upperHorn.position.set(center.x + dx, 0.0275, center.z);

    const lowerHorn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0032, 0.016, 0.055, 24, 8, true),
      waistMat
    );
    lowerHorn.position.set(center.x + dx, -0.0275, center.z);
    gTweezer.add(upperHorn, lowerHorn);

    // 3D Harmonic Potential Energy Well Wireframe Bowl beneath atom
    const bowl = new THREE.Mesh(
      new THREE.SphereGeometry(0.0068, 16, 12, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.5 })
    );
    bowl.position.set(center.x + dx, -0.002, center.z);
    gTweezer.add(bowl);
  });
  tagGroupMeshes(gTweezer, 'micro-tweezer-pair');

  // 5B. Rydberg Van der Waals V(r) = C6/r^6 Blockade Shell & Dipole Coupling Arc
  const gBlockade = registerComponentGroup('micro-rydberg-blockade', [0, 0, 0], {
    text: 'Rydberg Blockade Sphere Rb = 9.2 µm (V = C₆/r⁶)',
    offset: [0.26 + 0.022, 0.036, 0.02],
    minDist: 0.02,
    maxDist: 0.55
  });

  const eqRing = new THREE.Mesh(
    new THREE.RingGeometry(0.025, 0.0265, 48).rotateX(Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
  );
  eqRing.position.copy(center);
  gBlockade.add(eqRing);
  microVisuals.dipoleWaveRing = eqRing;

  // Connecting dipole-dipole interaction cylinder between the two atoms
  const linkCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0014, 0.0014, dHalf * 2, 12).rotateZ(Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.9 })
  );
  linkCyl.position.copy(center);
  gBlockade.add(linkCyl);
  tagGroupMeshes(gBlockade, 'micro-rydberg-blockade');

  // 5C. Local Raman Addressing Beam (795 nm D1) & 3D Bloch Spin Vectors
  const gRaman = registerComponentGroup('micro-raman-addressing', [0, 0, 0], {
    text: 'Local Raman Addressing & Bloch Spin Vector',
    offset: [0.26 - dHalf - 0.015, -0.028, 0.02],
    minDist: 0.02,
    maxDist: 0.55
  });

  // Focused Local Raman Beam on Left Qubit
  const ramanBeam = createLaserBeam(
    new THREE.Vector3(center.x - dHalf, -0.06, center.z),
    new THREE.Vector3(center.x - dHalf, 0.035, center.z),
    0.0018,
    0.008,
    0x38bdf8,
    0.65
  );
  gRaman.add(ramanBeam);
  microVisuals.ramanBeam = ramanBeam;

  // Bloch Sphere cages and rotating spin state vectors on both atoms
  [-dHalf, dHalf].forEach((dx, idx) => {
    const blochCage = new THREE.Mesh(
      new THREE.SphereGeometry(0.0052, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.25 })
    );
    blochCage.position.set(center.x + dx, 0, center.z);
    gRaman.add(blochCage);

    const arrowGroup = new THREE.Group();
    arrowGroup.position.set(center.x + dx, 0, center.z);
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0006, 0.0006, 0.009, 8),
      new THREE.MeshBasicMaterial({ color: idx === 0 ? 0x22d3ee : 0xfbbf24 })
    );
    shaft.position.y = 0.0045;
    const tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.0016, 0.0032, 10),
      new THREE.MeshBasicMaterial({ color: idx === 0 ? 0x22d3ee : 0xfbbf24 })
    );
    tip.position.y = 0.0095;
    arrowGroup.add(shaft, tip);
    gRaman.add(arrowGroup);

    if (idx === 0) microVisuals.blochArrow1 = arrowGroup;
    else microVisuals.blochArrow2 = arrowGroup;
  });

  tagGroupMeshes(gRaman, 'micro-raman-addressing');
}

// Build all 17 components & zones!
buildOpticalTable();
buildMuMetalShield();
build2DMOT();
buildUHVPumps();
buildScienceCell();
buildInVacuumElectrodes();
buildMagneticCoils();
buildHighNAObjectives();
buildSLMArm();
buildAODArm();
buildRydbergOptics();
buildQCMOSCamera();
buildFPGAController();
buildFiveZoneFocalPlane();
buildMicroscopicTweezerShowcase();

// ============================================================================
// UI INITIALIZATION & INTERACTION BINDINGS
// ============================================================================

// 1. Render Top Scale Navigation Buttons
const scaleNavEl = document.getElementById('scale-nav');
DATA.scaleBookmarks.forEach((sb) => {
  const btn = document.createElement('button');
  btn.className = `scale-btn ${sb.id === state.activeScaleId ? 'active' : ''}`;
  btn.dataset.scaleId = sb.id;
  btn.innerHTML = `<span class="scale-lvl">${sb.level}</span><span class="scale-lbl">${sb.name}</span>`;
  btn.addEventListener('click', () => activateScaleBookmark(sb.id));
  scaleNavEl.appendChild(btn);
});

function activateScaleBookmark(scaleId) {
  const sb = DATA.scaleBookmarks.find((s) => s.id === scaleId);
  if (!sb) return;
  state.activeScaleId = scaleId;

  document.querySelectorAll('.scale-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.scaleId === scaleId);
  });

  if (sb.cutawayRecommended) {
    state.cutaway = true;
    document.getElementById('toggle-cutaway').checked = true;
    if (muMetalFrontHalf) muMetalFrontHalf.visible = false;
  }

  flyCameraTo(sb.cameraPos, sb.target, 1.05);
}

// 2. Render Left Component Tree
const componentTreeEl = document.getElementById('component-tree');
function renderComponentTree(filterText = '') {
  componentTreeEl.innerHTML = '';
  const query = filterText.trim().toLowerCase();

  // Group by category
  const categories = new Map();
  DATA.components.forEach((comp) => {
    if (
      query &&
      !comp.name.toLowerCase().includes(query) &&
      !comp.category.toLowerCase().includes(query) &&
      !comp.role.toLowerCase().includes(query)
    ) {
      return;
    }
    if (!categories.has(comp.category)) categories.set(comp.category, []);
    categories.get(comp.category).push(comp);
  });

  categories.forEach((items, catName) => {
    const catDiv = document.createElement('div');
    catDiv.className = 'tree-category';
    catDiv.innerHTML = `<div class="tree-category-title"><span>${catName}</span><span>${items.length}</span></div>`;

    items.forEach((comp) => {
      const btn = document.createElement('button');
      btn.className = `tree-item ${comp.id === state.selectedComponentId ? 'selected' : ''}`;
      btn.dataset.compId = comp.id;
      btn.innerHTML = `
        <span class="tree-item-name">${comp.name}</span>
        <span class="tree-item-scale">${comp.scale}</span>
      `;
      btn.addEventListener('click', () => selectComponent(comp.id, true));
      catDiv.appendChild(btn);
    });

    componentTreeEl.appendChild(catDiv);
  });
}

document.getElementById('component-search').addEventListener('input', (e) => {
  renderComponentTree(e.target.value);
});

// 3. Component Selection & Right Inspector Update
function selectComponent(compId, flyTo = false) {
  const comp = DATA.components.find((c) => c.id === compId);
  if (!comp) return;
  state.selectedComponentId = compId;

  // Update tree selection state
  document.querySelectorAll('.tree-item').forEach((el) => {
    el.classList.toggle('selected', el.dataset.compId === compId);
  });

  // Populate Right Panel Datasheet
  document.getElementById('insp-category').textContent = comp.category;
  document.getElementById('insp-title').textContent = comp.name;
  document.getElementById('insp-scale').textContent = comp.scale;
  document.getElementById('insp-role').textContent = comp.role;
  document.getElementById('insp-equation').textContent = comp.equation;

  const specsTable = document.getElementById('insp-specs-table');
  specsTable.innerHTML = Object.entries(comp.specs)
    .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
    .join('');

  const papersList = document.getElementById('insp-papers');
  papersList.innerHTML = comp.papers.map((p) => `<li>${p}</li>`).join('');

  if (flyTo && comp.focusPos && comp.focusTarget) {
    flyCameraTo(comp.focusPos, comp.focusTarget, 0.95);
  }
}

document.getElementById('btn-insp-zoom').addEventListener('click', () => {
  selectComponent(state.selectedComponentId, true);
});

document.getElementById('btn-insp-isolate').addEventListener('click', () => {
  if (state.isolatedComponentId === state.selectedComponentId) {
    state.isolatedComponentId = null;
    document.getElementById('btn-insp-isolate').textContent = '👁️ Isolate Part';
  } else {
    state.isolatedComponentId = state.selectedComponentId;
    document.getElementById('btn-insp-isolate').textContent = '🔄 Show All Parts';
  }
  applyIsolationAndExplode();
});

document.getElementById('btn-show-all').addEventListener('click', () => {
  state.isolatedComponentId = null;
  document.getElementById('btn-insp-isolate').textContent = '👁️ Isolate Part';
  applyIsolationAndExplode();
});

function applyIsolationAndExplode() {
  componentGroups.forEach((group, id) => {
    const base = basePositions.get(id);
    const exp = explodeVectors.get(id);
    group.position.set(
      base.x + exp.x * state.explodedFactor,
      base.y + exp.y * state.explodedFactor,
      base.z + exp.z * state.explodedFactor
    );

    if (state.isolatedComponentId) {
      group.visible = id === state.isolatedComponentId || id === 'comp-optical-table';
    } else {
      group.visible = true;
    }
  });
}

// 4. Cutaway, Labels, Exploded Slider & Optical Layer Toggles
document.getElementById('toggle-cutaway').addEventListener('change', (e) => {
  state.cutaway = e.target.checked;
  if (muMetalFrontHalf) muMetalFrontHalf.visible = !state.cutaway;
});

document.getElementById('toggle-labels').addEventListener('change', (e) => {
  state.showLabels = e.target.checked;
  labelsContainer.style.display = state.showLabels ? 'block' : 'none';
});

document.getElementById('slider-exploded').addEventListener('input', (e) => {
  const val = Number(e.target.value);
  state.explodedFactor = val / 100;
  document.getElementById('exploded-val').textContent = `${val}%`;
  applyIsolationAndExplode();
});

document.querySelectorAll('.layer-toggle input[data-layer]').forEach((input) => {
  input.addEventListener('change', (e) => {
    const layerKey = e.target.dataset.layer;
    state.layers[layerKey] = e.target.checked;
    if (laserLayers[layerKey]) {
      laserLayers[layerKey].visible = e.target.checked;
    }
  });
});

// 5. Species / Architecture Preset Selector
function applySpeciesPreset(presetKey) {
  const preset = DATA.speciesPresets[presetKey];
  if (!preset) return;
  state.speciesKey = presetKey;

  // Update atom & Rydberg colors in 3D scene
  dynamicFocalObjects.dataAtomMeshes.forEach((m) => {
    m.color.setHex(preset.atomColorData);
    m.emissive.setHex(preset.atomColorData);
  });
  dynamicFocalObjects.ancillaAtomMeshes.forEach((m) => {
    m.color.setHex(preset.atomColorAncilla);
    m.emissive.setHex(preset.atomColorAncilla);
  });
  if (rydbergSheetMesh1) rydbergSheetMesh1.material.color.setHex(preset.rydbergBeamColor1);
  if (rydbergSheetMesh2) rydbergSheetMesh2.material.color.setHex(preset.rydbergBeamColor2);

  // Update Right Panel Species Summary Box
  const box = document.getElementById('species-summary-box');
  box.innerHTML = `
    <div style="font-weight:700; color:#fff;">${preset.name}</div>
    <div style="color:var(--accent-amber); font-family:var(--font-mono); font-size:10px;">${preset.badge}</div>
    <div style="margin-top:3px;"><strong style="color:var(--text-muted);">Data Qubit:</strong> ${preset.dataSpecies}</div>
    <div><strong style="color:var(--text-muted);">Ancilla / Erasure:</strong> ${preset.ancillaSpecies}</div>
    <div><strong style="color:var(--text-muted);">Tweezers:</strong> ${preset.tweezerWavelength}</div>
    <div><strong style="color:var(--text-muted);">Rydberg Drive:</strong> ${preset.rydbergExcitation}</div>
    <div><strong style="color:var(--text-muted);">Coherence T₂:</strong> <span style="color:var(--accent-cyan); font-family:var(--font-mono);">${preset.coherenceT2}</span></div>
    <div><strong style="color:var(--text-muted);">2Q CZ Fidelity:</strong> <span style="color:var(--accent-emerald); font-family:var(--font-mono);">${preset.czFidelity}</span></div>
  `;
}

document.getElementById('species-preset-select').addEventListener('change', (e) => {
  applySpeciesPreset(e.target.value);
});

// 6. Quick Viewport Zoom Buttons
document.getElementById('btn-zoom-in').addEventListener('click', () => {
  const dir = new THREE.Vector3().subVectors(controls.target, camera.position);
  camera.position.addScaledVector(dir, 0.45);
});
document.getElementById('btn-zoom-out').addEventListener('click', () => {
  const dir = new THREE.Vector3().subVectors(camera.position, controls.target);
  camera.position.addScaledVector(dir, 0.65);
});
document.getElementById('btn-focus-zones').addEventListener('click', () => {
  activateScaleBookmark('scale-4');
  selectComponent('zone-entangling', false);
});
document.getElementById('btn-focus-tweezer').addEventListener('click', () => {
  activateScaleBookmark('scale-5');
  selectComponent('micro-rydberg-blockade', false);
});

// 7. Bottom 5-Stage Quantum Execution Cycle Simulator Bar
const cycleGridEl = document.getElementById('cycle-steps-grid');
DATA.executionStages.forEach((stg, idx) => {
  const btn = document.createElement('button');
  btn.className = `cycle-step-btn ${idx === 0 ? 'active' : ''}`;
  btn.dataset.stageIdx = idx;
  btn.textContent = stg.name;
  btn.addEventListener('click', () => {
    setCycleStage(idx, true);
  });
  cycleGridEl.appendChild(btn);
});

function setCycleStage(idx, userClicked = false) {
  state.cycleStage = idx;
  state.cycleTimer = 0;
  const stg = DATA.executionStages[idx];

  document.querySelectorAll('.cycle-step-btn').forEach((b, i) => {
    b.classList.toggle('active', i === idx);
  });
  document.getElementById('cycle-stage-name').textContent = stg.name;
  document.getElementById('cycle-stage-time').textContent = stg.duration;
  document.getElementById('cycle-stage-desc').textContent = stg.description;
  document.getElementById('cycle-stage-citation').textContent = stg.citation;

  if (state.followStageCamera || userClicked) {
    selectComponent(stg.zoneFocus, state.followStageCamera);
  }
}

document.getElementById('btn-cycle-play').addEventListener('click', (e) => {
  state.cyclePlaying = !state.cyclePlaying;
  e.currentTarget.textContent = state.cyclePlaying ? '⏸ Pause Cycle' : '▶ Play Cycle';
});

document.getElementById('btn-follow-stage').addEventListener('click', (e) => {
  state.followStageCamera = !state.followStageCamera;
  e.currentTarget.textContent = `🎥 Camera Follow Stage: ${state.followStageCamera ? 'ON' : 'OFF'}`;
  if (state.followStageCamera) {
    const stg = DATA.executionStages[state.cycleStage];
    selectComponent(stg.zoneFocus, true);
  }
});

// 8. 2023-2026 Literature & Benchmark Modal
const papersModal = document.getElementById('papers-modal');
document.getElementById('btn-open-papers').addEventListener('click', () => {
  papersModal.classList.remove('hidden');
});
document.getElementById('btn-close-papers').addEventListener('click', () => {
  papersModal.classList.add('hidden');
});
papersModal.addEventListener('click', (e) => {
  if (e.target === papersModal) papersModal.classList.add('hidden');
});

function populatePapersModal() {
  const banner = document.getElementById('modal-metrics-banner');
  const m = DATA.systemMetrics;
  const tiles = [
    { val: m.physicalQubits, lbl: 'Defect-Free Tweezer Array (Manetsch 2025)' },
    { val: m.continuousReloadRate, lbl: 'Dual Lattice Conveyor Reload (Chiu 2025)' },
    { val: m.twoQubitFidelity, lbl: 'Time-Optimal Parallel CZ Gate (Evered 2023)' },
    { val: m.coherenceTimeT2, lbl: 'Shielded Storage Coherence Time' }
  ];
  banner.innerHTML = tiles
    .map((t) => `<div class="metric-tile"><div class="m-val">${t.val}</div><div class="m-lbl">${t.lbl}</div></div>`)
    .join('');

  const grid = document.getElementById('modal-papers-grid');
  grid.innerHTML = DATA.papersDatabase
    .map(
      (p) => `
      <div class="paper-card">
        <div class="paper-card-top">
          <span>${p.journal}</span>
          <span>${p.year}</span>
        </div>
        <div class="paper-card-title">${p.title}</div>
        <div style="font-size:11px; color:#cbd5e1; font-weight:600;">${p.authors}</div>
        <div class="paper-card-desc">${p.highlight}</div>
        <div class="tag-row">
          ${p.tags.map((tag) => `<span class="paper-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `
    )
    .join('');
}

// 9. Raycasting Click-to-Inspect in 3D Viewport
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let pointerDownPos = { x: 0, y: 0 };

renderer.domElement.addEventListener('pointerdown', (e) => {
  pointerDownPos = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('pointerup', (e) => {
  const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
  if (dist > 5) return; // Ignore drag orbits

  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableMeshes, false);
  for (const hit of intersects) {
    const cid = hit.object.userData.componentId;
    // Skip outer shield click when cutaway is active so user can click interior optics
    if (cid === 'comp-mu-metal' && state.cutaway) continue;
    if (cid) {
      selectComponent(cid, false);
      break;
    }
  }
});

// ============================================================================
// MAIN ANIMATION LOOP & MULTI-SCALE TELEMETRY
// ============================================================================
const clock = new THREE.Clock();
const projVec = new THREE.Vector3();

function updateHUDScaleReadout(camDist) {
  const hudEl = document.getElementById('hud-fov-scale');
  let label = '';
  if (camDist > 10) {
    label = `Scale 1 • ${(camDist * 0.14).toFixed(1)} m Macro System View`;
  } else if (camDist > 2.6) {
    label = `Scale 2 • ${Math.round(camDist * 95)} mm Optical Core & Objectives`;
  } else if (camDist > 0.95) {
    label = `Scale 3 • ${Math.round(camDist * 45)} mm UHV Quartz Science Cell`;
  } else if (camDist > 0.22) {
    label = `Scale 4 • ${Math.round(camDist * 850)} µm 5-Zone Focal Plane`;
  } else {
    label = `Scale 5 • ${(camDist * 90).toFixed(1)} µm Single Tweezer & Blockade`;
  }
  hudEl.textContent = label;

  // Adapt OrbitControls panspeed & zoomspeed smoothly across 5 orders of magnitude
  controls.zoomSpeed = camDist < 0.5 ? 0.85 : 1.1;
  controls.panSpeed = Math.max(0.15, Math.min(1.2, camDist * 0.35));
}

function updateFloatingLabels(camDist) {
  if (!state.showLabels) return;
  const width = container.clientWidth;
  const height = container.clientHeight;

  labelAnchors.forEach((anchor) => {
    if (!anchor.group.visible || camDist < anchor.minDist || camDist > anchor.maxDist) {
      anchor.el.style.display = 'none';
      return;
    }
    projVec.copy(anchor.group.position).add(anchor.localOffset);
    projVec.project(camera);

    if (projVec.z > 1 || projVec.z < -1) {
      anchor.el.style.display = 'none';
      return;
    }

    const x = (projVec.x * 0.5 + 0.5) * width;
    const y = (-(projVec.y * 0.5) + 0.5) * height;
    anchor.el.style.display = 'flex';
    anchor.el.style.left = `${x}px`;
    anchor.el.style.top = `${y}px`;
  });
}

function animateQuantumPhysics(dt, elapsed) {
  // Advance 5-stage quantum execution cycle every 4.2 seconds when playing
  if (state.cyclePlaying) {
    state.cycleTimer += dt;
    if (state.cycleTimer >= 4.2) {
      const nextStage = (state.cycleStage + 1) % DATA.executionStages.length;
      setCycleStage(nextStage, false);
    }
  }

  // 1. Zone 1: Continuous Optical Lattice Conveyor Belt (Chiu et al., Nature Sept 2025)
  dynamicFocalObjects.conveyorFringes.forEach((disk, idx) => {
    const zOffset = ((elapsed * 0.14 + idx / 14) % 1) * 0.44 - 0.22;
    disk.position.z = zOffset;
  });
  dynamicFocalObjects.conveyorAtoms.forEach((atom, idx) => {
    const zOffset = ((elapsed * 0.14 + (idx + 0.5) / 14) % 1) * 0.44 - 0.22;
    atom.position.z = zOffset;
  });

  // 2. Zone 2: Defect-Free AOD Sorting Compression Wave
  const sortWave = Math.sin(elapsed * 3.2) * 0.008;
  dynamicFocalObjects.reservoirAtoms.forEach((item, idx) => {
    if (idx % 3 === 0) {
      item.mesh.position.x = item.baseX + Math.sin(elapsed * 2.5 + item.phase) * 0.009;
    } else {
      item.mesh.position.z = item.baseZ + sortWave * Math.cos(item.phase);
    }
  });

  // 3. Zone 3 <-> Zone 4: Coherent 2D AOD Logical Patch Shuttling (Bluvstein et al., Nature 2024/2026)
  // Smoothly shuttle the right-column logical patches between Storage (x = 0.01) and Entangling (x = 0.23)
  let shuttleLerp = 0;
  if (state.cycleStage === 1) {
    shuttleLerp = 0.5 + 0.5 * Math.sin(elapsed * 3.0);
  } else if (state.cycleStage === 2) {
    shuttleLerp = 1.0; // Parked inside Zone 4 for Parallel Rydberg CZ Gate!
  } else if (state.cycleStage === 3) {
    shuttleLerp = 0.6;
  } else {
    shuttleLerp = 0.15 + 0.15 * Math.sin(elapsed * 1.4);
  }

  dynamicFocalObjects.storagePatches.forEach((p) => {
    if (p.isShuttlingPatch) {
      // Minimum-jerk-like smooth translation into Zone 4
      p.group.position.x = THREE.MathUtils.lerp(p.homeX, 0.20, shuttleLerp);
      if (p.aodHighlight) {
        p.aodHighlight.material.opacity = 0.18 + 0.45 * shuttleLerp;
      }
    }
  });

  // 4. Zone 4: Rydberg Blockade Spheres (Rb = 9.2 µm) Pulsing during CZ Gate
  const isGateActive = state.cycleStage === 2;
  const gatePulse = isGateActive
    ? 0.35 + 0.25 * Math.sin(elapsed * 12.0)
    : 0.14 + 0.06 * Math.sin(elapsed * 3.0);

  dynamicFocalObjects.blockadeSpheres.forEach(({ sphere, wire, isHeroPair }) => {
    sphere.material.opacity = isHeroPair ? gatePulse * 1.15 : gatePulse;
    const s = 1.0 + 0.06 * Math.sin(elapsed * 6.0);
    sphere.scale.setScalar(s);
    wire.rotation.y = elapsed * 0.6;
  });

  if (rydbergSheetMesh1 && rydbergSheetMesh2) {
    const beamOp = isGateActive ? 0.72 : 0.35;
    rydbergSheetMesh1.material.opacity = beamOp;
    rydbergSheetMesh2.material.opacity = beamOp;
  }

  // 5. Zone 5: Mid-Circuit Fluorescence Readout & Heralded Erasure Conversion Flash
  const isReadoutActive = state.cycleStage === 3;
  dynamicFocalObjects.erasureHalos.forEach(({ halo, isErasureFlagged }, idx) => {
    const s = 1.0 + 0.35 * ((elapsed * 2.2 + idx * 0.2) % 1);
    halo.scale.setScalar(s);
    if (isErasureFlagged) {
      // Heralded erasure flag glows bright amber-red!
      halo.material.color.setHex(0xf43f5e);
      halo.material.opacity = isReadoutActive ? 0.9 : 0.55;
    } else {
      halo.material.color.setHex(0xc084fc);
      halo.material.opacity = isReadoutActive ? 0.65 : 0.28;
    }
  });
  if (readoutConeMesh) {
    readoutConeMesh.material.opacity = isReadoutActive ? 0.68 : 0.32;
  }

  // 6. Scale 5 Microscopic Single-Tweezer Bloch Spin Precession & Dipole Ring
  if (microVisuals.blochArrow1 && microVisuals.blochArrow2) {
    microVisuals.blochArrow1.rotation.z = Math.sin(elapsed * 2.8) * 0.85;
    microVisuals.blochArrow1.rotation.x = Math.cos(elapsed * 2.1) * 0.45;
    microVisuals.blochArrow2.rotation.z = Math.cos(elapsed * 2.8 + Math.PI * 0.5) * 0.95;
  }
  if (microVisuals.dipoleWaveRing) {
    microVisuals.dipoleWaveRing.rotation.z = elapsed * 1.5;
  }
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.1);
  const elapsed = clock.getElapsedTime();

  // Smooth Camera Tweening
  if (cameraTween.active) {
    cameraTween.progress += dt / cameraTween.duration;
    if (cameraTween.progress >= 1) {
      cameraTween.progress = 1;
      cameraTween.active = false;
    }
    // Quintic smoothstep
    const t = cameraTween.progress;
    const ease = t * t * t * (t * (t * 6 - 15) + 10);
    camera.position.lerpVectors(cameraTween.startPos, cameraTween.endPos, ease);
    controls.target.lerpVectors(cameraTween.startTarget, cameraTween.endTarget, ease);
  }

  controls.update();

  const camDist = camera.position.distanceTo(controls.target);
  updateHUDScaleReadout(camDist);
  updateFloatingLabels(camDist);
  animateQuantumPhysics(dt, elapsed);

  renderer.render(scene, camera);
}

// Handle Window Resize
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// Initialize UI State & Start Loop
renderComponentTree();
applySpeciesPreset('dual-alkali');
selectComponent('zone-entangling', false);
populatePapersModal();
animate();
