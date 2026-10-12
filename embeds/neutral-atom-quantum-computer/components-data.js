// ============================================================================
// AETHER-10K: Complete Engineering Database & 2023-2026 Literature Synthesis
// ============================================================================

window.AETHER_DATA = {
  systemMetrics: {
    name: "AETHER-10K Fault-Tolerant Zoned Neutral-Atom Processor",
    slmSites: "12,000 Static Tweezer Sites",
    physicalQubits: "6,100+ Defect-Free Physical Qubits",
    logicalQubits: "256–1,024 Logical Qubits (High-Rate qLDPC / Surface Hybrid)",
    continuousReloadRate: "300,000 atoms/s (>30,000 init qubits/s)",
    continuousRuntime: "> 2 Hours Uninterrupted Steady-State",
    twoQubitFidelity: "99.55% Raw Parallel CZ (99.80% Erasure-Converted)",
    singleQubitFidelity: "99.992% (Global MW) / 99.97% (Local Raman)",
    coherenceTimeT2: "12.6 s (Cs-133/Rb-87 Clock) | > 40 s (Yb-171 Nuclear Spin)",
    imagingFidelity: "99.99% Non-Destructive State Readout",
    shuttlingVelocity: "0.55 µm/µs (2D Crossed TeO2 AODs)",
    zonedFidelityGain: "22x Circuit Fidelity vs. Monolithic Array"
  },

  scaleBookmarks: [
    {
      id: "scale-1",
      level: "Scale 1 • 2.4 m",
      name: "Full System & Shielding",
      subtitle: "Optical Table, Mu-Metal Enclosure, Vacuum & FPGA Control",
      cameraPos: [19, 13, 21],
      target: [0, 0.2, 0],
      cutawayRecommended: false,
      description: "Macro-scale view of the vibration-isolated optical table, dual-layer mu-metal magnetic shielding, remote 2D+ MOT pre-cooling source, UHV pumping manifold, and real-time FPGA/RF-SoC quantum error correction controller."
    },
    {
      id: "scale-2",
      level: "Scale 2 • 400 mm",
      name: "Optical Core & High-NA Objectives",
      subtitle: "LCoS SLM, Crossed 2D AODs, Dichroic Tower & NA=0.75 Objectives",
      cameraPos: [5.2, 3.8, 6.2],
      target: [0, 0.2, 0],
      cutawayRecommended: true,
      description: "Meso-scale view of the optical delivery and imaging core: 12,000-site LCoS Spatial Light Modulator arm, crossed 2D TeO2 Acousto-Optic Deflector shuttling arm, counter-propagating 480nm/780nm Rydberg sheet optics, and dual opposing NA=0.75 microscope objectives."
    },
    {
      id: "scale-3",
      level: "Scale 3 • 60 mm",
      name: "UHV Fused-Silica Science Cell",
      subtitle: "XHV Quartz Cuvette (<10⁻¹¹ Torr), Octupole Electrodes & MW Loop",
      cameraPos: [1.65, 1.15, 2.05],
      target: [0, 0, 0],
      cutawayRecommended: true,
      description: "Millimeter-scale view of the optical-contact bonded AR-coated fused-silica science cell, 8 in-vacuum gold-plated octupole DC electric-field compensation electrodes (suppressing stray Rydberg Stark shifts to <1 mV/cm), and in-vacuum 6.834 GHz microwave antenna."
    },
    {
      id: "scale-4",
      level: "Scale 4 • 600 µm",
      name: "5-Zone Focal Plane Architecture",
      subtitle: "Conveyor Reloading, Sorting, Storage, Entangling & Readout Zones",
      cameraPos: [0.0, 0.58, 0.72],
      target: [0, 0, 0],
      cutawayRecommended: true,
      description: "Micro-scale view between the two High-NA objectives revealing the 5 spatially partitioned functional zones: (1) Dual Optical Lattice Conveyor Belt, (2) Reservoir & Defect-Free Sorting, (3) Shielded Storage Zone, (4) Rydberg Entangling Zone, and (5) Isolated Mid-Circuit Readout & Reset Zone."
    },
    {
      id: "scale-5",
      level: "Scale 5 • 10 µm",
      name: "Single Tweezer & Rydberg Blockade",
      subtitle: "w₀ = 0.8 µm Tweezer Waist, Bloch Spin & Rb = 9.2 µm Blockade",
      cameraPos: [0.26, 0.085, 0.145],
      target: [0.26, 0, 0.02],
      cutawayRecommended: true,
      description: "Microscopic single-qubit pair view inside the Rydberg Entangling Zone: diffraction-limited Gaussian optical tweezer hourglasses (w₀ = 0.8 µm), inter-atom separation d = 3.5 µm, trapped data/ancilla atoms with 3D Bloch spin vectors, Raman local addressing beam, and van der Waals V(r) = C₆/r⁶ Rydberg blockade shell."
    }
  ],

  speciesPresets: {
    "dual-alkali": {
      id: "dual-alkali",
      name: "Hybrid Dual-Species: ⁸⁷Rb (Data) + ¹³³Cs (Ancilla)",
      badge: "Harvard / QuEra + UChicago + Caltech Synthesis",
      dataSpecies: "⁸⁷Rb (Clock |F=1,mF=0⟩ ↔ |F=2,mF=0⟩)",
      ancillaSpecies: "¹³³Cs (Clock |F=3,mF=0⟩ ↔ |F=4,mF=0⟩)",
      tweezerWavelength: "813 nm (Rb) & 935 nm (Cs) Magic/Low-Crosstalk",
      rydbergExcitation: "780 nm + 480 nm (Rb 53S₁/₂) | 852 nm + 509 nm (Cs)",
      readoutWavelength: "780 nm (Rb D2) & 852 nm (Cs D2, Δλ = 72 nm Crosstalk-Free)",
      coherenceT2: "12.6 s (Cs Hyperfine) / 4.5 s (Rb Hyperfine)",
      czFidelity: "99.55% Parallel Intraspecies | 99.3% Interspecies Förster",
      atomColorData: 0x38bdf8,
      atomColorAncilla: 0xf59e0b,
      rydbergBeamColor1: 0x00e5ff,
      rydbergBeamColor2: 0xff2a55,
      summary: "Combines Harvard/QuEra's 5-zone reconfigurable AOD architecture and continuous lattice conveyor reloading with UChicago'sRb-Cs dual-species crosstalk-free syndrome extraction and Caltech's 6,100-atom Cs array scaling."
    },
    "yb171-erasure": {
      id: "yb171-erasure",
      name: "Alkaline-Earth: ¹⁷¹Yb Nuclear Spin + Erasure Conversion",
      badge: "Atom Computing / Microsoft + Princeton / Caltech Synthesis",
      dataSpecies: "¹⁷¹Yb Metastable ³P₀ Nuclear Spin |mI = -1/2⟩, |mI = +1/2⟩",
      ancillaSpecies: "¹⁷¹Yb Ancilla Sub-Array + Fast ³P₀/¹S₀ Erasure Flash",
      tweezerWavelength: "759 nm Magic Wavelength (Zero Differential AC Stark Shift)",
      rydbergExcitation: "302 nm Single-Photon UV (6s6p ³P₀ → 6s71s ³S₁)",
      readoutWavelength: "399 nm (¹S₀↔¹P₁) + 556 nm (¹S₀↔³P₁) + 1389 nm Erasure Check",
      coherenceT2: "> 40.0 s (J=0 Nuclear Spin-1/2, Insensitive to Magnetic Noise)",
      czFidelity: "99.50% Raw → 99.80% with Heralded Mid-Circuit Erasure Conversion",
      atomColorData: 0xa855f7,
      atomColorAncilla: 0x2dd4bf,
      rydbergBeamColor1: 0x8b5cf6,
      rydbergBeamColor2: 0x38bdf8,
      summary: "Encodes qubits in the I=1/2 nuclear spin of metastable ³P₀ Ytterbium-171 atoms. Converts 98% of spontaneous emission errors from Rydberg states into heralded, located erasure errors—dramatically boosting the QEC threshold."
    },
    "cs133-ultrascale": {
      id: "cs133-ultrascale",
      name: "Ultra-Scale 6,100-Qubit ¹³³Cs Array",
      badge: "Caltech Endres Lab (Nature Sept 2025) + Harvard Zoned QEC",
      dataSpecies: "¹³³Cs Hyperfine Clock |F=3,mF=0⟩ ↔ |F=4,mF=0⟩ (9.1926 GHz)",
      ancillaSpecies: "¹³³Cs Zoned Ancilla Patches (Shuttled to Zone 5 for Readout)",
      tweezerWavelength: "1064 nm / 852 nm High-Polarizability SLM Array (12,000 Sites)",
      rydbergExcitation: "459 nm (6S₁/₂→7P₁/₂) + 1038 nm (7P₁/₂→nS₁/₂) Inverted 2-Photon",
      readoutWavelength: "852 nm Λ-Enhanced Gray Molasses Non-Destructive Imaging",
      coherenceT2: "12.6 s Hyperfine Coherence (23 min Room-Temp Vacuum Lifetime)",
      czFidelity: "99.55% Time-Optimal Single-Pulse Levine-Pichler Gate",
      atomColorData: 0x60a5fa,
      atomColorAncilla: 0x34d399,
      rydbergBeamColor1: 0x3b82f6,
      rydbergBeamColor2: 0xf43f5e,
      summary: "Exploits Cesium-133's large scalar polarizability at 1064 nm to split laser power across 12,000 diffraction-limited traps, maintaining >6,100 defect-free qubits with 99.99% imaging fidelity and 12.6 s coherence."
    }
  },

  executionStages: [
    {
      id: 0,
      name: "Stage 1: Continuous Lattice Conveyor Reload & Sorting",
      duration: "Continuous Background (300,000 atoms/s)",
      zoneFocus: "zone-conveyor",
      description: "Dual 1064 nm standing-wave optical lattice conveyor belts transport cold atoms from the shielded 2D/3D MOT reservoir into Zone 1 without disturbing coherence in Zone 3. Crossed 2D AODs extract atoms into Zone 2 and execute parallel row/column compression into defect-free supply blocks.",
      citation: "N.-C. Chiu et al., Nature 646, 1075–1080 (Sept 2025); H. J. Manetsch et al., Nature (Sept 2025)"
    },
    {
      id: 1,
      name: "Stage 2: 2D AOD Coherent Logical Patch Shuttling",
      duration: "120–250 µs per Transport Move (v = 0.55 µm/µs)",
      zoneFocus: "zone-storage",
      description: "Multi-tone RF chirps on the crossed TeO2 2D AODs pick up entire logical qubit patches (e.g., [[8,3,2]] color codes, d=7 surface codes, or bivariate bicycle qLDPC blocks) from the Shielded Storage Zone (Zone 3) and translate them along minimum-jerk trajectories into the Rydberg Entangling Zone (Zone 4) with <0.05 vibrational quanta heating.",
      citation: "D. Bluvstein et al., Nature 626, 58–65 (2024); B. Lin, B. Tan, J. Cong (ZAC Compiler, 2025/2026)"
    },
    {
      id: 2,
      name: "Stage 3: Parallel Transversal Rydberg CZ Entanglement",
      duration: "240 ns Gate Pulse (F_CZ = 99.55% – 99.80%)",
      zoneFocus: "zone-entangling",
      description: "Data and ancilla (or paired logical) qubits sit at d = 3.5 µm separation—well inside the Rydberg blockade radius Rb = 9.2 µm. Counter-propagating 480 nm + 780 nm top-hat laser sheets apply a single smooth phase-modulated Levine-Pichler pulse, executing hundreds of transversal CZ gates in parallel.",
      citation: "S. J. Evered et al., Nature 622, 268–272 (2023); D. Bluvstein et al., Nature (2025/2026)"
    },
    {
      id: 3,
      name: "Stage 4: Mid-Circuit Readout & Heralded Erasure Detection",
      duration: "150 µs Fluorescence + 5 µs Erasure Flash",
      zoneFocus: "zone-readout",
      description: "Syndrome ancillas are shuttled into the optically baffled Readout Zone (Zone 5) or probed via crosstalk-free dual-species 852 nm light. Back-illuminated qCMOS imaging discriminates qubit states at 99.99% fidelity while a fast metastable flash converts spontaneous Rydberg decays into located erasure flags.",
      citation: "S. Ma et al., Nature 622 (2023); K. Singh et al., Science 380 (2023); Bluvstein et al., Nature (2025/2026)"
    },
    {
      id: 4,
      name: "Stage 5: Correlated ML Decoding, Reset & Qubit Reuse",
      duration: "< 15 µs FPGA Decode + Raman Recooling",
      zoneFocus: "comp-fpga-controller",
      description: "The FPGA/RF-SoC controller ingests syndrome + erasure bitstreams, runs correlated machine-learning / union-find decoding, updates the logical Pauli frame or triggers feedforward magic-state teleportation, and optically pumps + Raman-sideband recools the ancillas in Zone 5 for immediate mid-circuit reuse.",
      citation: "D. Bluvstein et al., Nature (2025/2026) [448-atom FT processor]; Microsoft & Atom Computing (2024–2026)"
    }
  ],

  components: [
    // ========================================================================
    // SUBSYSTEM 1: VACUUM, SHIELDING & ATOMIC SOURCE (Scale 1 & 3)
    // ========================================================================
    {
      id: "comp-optical-table",
      name: "Active Pneumatic Optical Table & Frame",
      category: "1. Vacuum, Shielding & Source",
      scale: "Scale 1 • Macro (2.4 m × 1.5 m)",
      focusPos: [18, 12, 20],
      focusTarget: [0, -1.5, 0],
      specs: {
        "Dimensions": "2400 mm × 1500 mm × 305 mm Honeycomb Steel",
        "Vibration Isolation": "Active Piezo + Pneumatic Isolators (< 0.5 nm RMS > 10 Hz)",
        "Thermal Stability": "Active Liquid-Chilled Baseplate (±0.02 °C)",
        "Pointing Stability": "< 50 nrad Beam Drift (Critical for 0.8 µm Tweezers)"
      },
      role: "Provides sub-nanometer mechanical and thermal stability so that 12,000 diffraction-limited optical tweezers remain registered to the High-NA objective focal plane over multi-hour continuous runs.",
      equation: "\\sigma_{\\text{pointing}} < 0.05 \\cdot \\frac{w_0}{f_{\\text{obj}}} \\approx 40\\text{ nrad}",
      papers: [
        "H. J. Manetsch et al. (Caltech), 'A tweezer array with 6,100 highly coherent atomic qubits', Nature (Sept 2025)",
        "Strategic Plan for Neutral Atom Quantum Computation, arXiv:2607.21554 (2026)"
      ]
    },
    {
      id: "comp-mu-metal",
      name: "Dual-Layer Mu-Metal Magnetic Shielding Enclosure",
      category: "1. Vacuum, Shielding & Source",
      scale: "Scale 1 • Macro (1.6 m × 1.1 m)",
      focusPos: [14, 9, 15],
      focusTarget: [0, 0.5, 0],
      specs: {
        "Material": "2 × 2.0 mm High-Permeability Hydrogen-Annealed Mu-Metal",
        "Shielding Factor": "> 10,000× (DC to 1 kHz), Residual ΔB < 20 µG",
        "Optical Feedthroughs": "AR-Coated Conformal Viewport Tubes",
        "Impact on Coherence": "Suppresses Zeeman dephasing to extend T₂ > 12.6 s – 40 s"
      },
      role: "Attenuates ambient 50/60 Hz power-line and geomagnetic field fluctuations by >80 dB around the science chamber, protecting hyperfine clock states and nuclear spins during long storage intervals.",
      equation: "\\frac{1}{T_2^*} \\propto \\left|\\frac{\\partial \\omega_{01}}{\\partial B}\\right| \\delta B_{\\text{rms}} = 2 g_F \\mu_B B_0 \\,\\delta B_{\\text{rms}} / \\hbar \\omega_{\\text{HF}}",
      papers: [
        "H. J. Manetsch et al., Nature (Sept 2025) — 12.6 s hyperfine coherence in 6,100 Cs array",
        "M. A. Norcia et al. (Atom Computing), PRX Quantum 5, 030316 (2024)"
      ]
    },
    {
      id: "comp-2d-mot",
      name: "Remote 2D⁺ MOT Pre-Cooler & Differential Pumping Tube",
      category: "1. Vacuum, Shielding & Source",
      scale: "Scale 1 • Macro (-6.5, 0, 0)",
      focusPos: [-6.5, 3.2, 5.5],
      focusTarget: [-5.2, 0.1, 0],
      specs: {
        "Source Vapor Pressure": "10⁻⁷ Torr (Rb-87 / Cs-133 Dispensers or Yb Oven)",
        "Cold Atomic Beam Flux": "> 2 × 10⁹ atoms/s at v_z ≈ 15 m/s",
        "Differential Pumping Tube": "Ø 1.2 mm × 120 mm Graphite/Titanium Channel (10⁵:1 ΔP)",
        "Push Laser": "780 nm / 852 nm / 399 nm Continuous Push Beam (1.5 mW)"
      },
      role: "Decouples the high-vapor-pressure atomic source from the extreme-high-vacuum (<10⁻¹¹ Torr) science cell. Feeds the continuous optical lattice conveyor reservoir without degrading the 23-minute vacuum lifetime of the quantum processor.",
      equation: "C_{\\text{tube}} = \\frac{\\pi d^3}{12 L} \\bar{v} \\approx 2.1 \\times 10^{-3}\\text{ L/s}",
      papers: [
        "N.-C. Chiu et al. (Harvard Lukin Group), 'Continuous operation of a coherent 3,000-qubit system', Nature 646, 1075–1080 (Sept 2025)"
      ]
    },
    {
      id: "comp-uhv-pumps",
      name: "XHV Pumping Manifold (StarCell Ion + Ti-Sub + NEG)",
      category: "1. Vacuum, Shielding & Source",
      scale: "Scale 1 • Macro (-3.5, -1.8, -2.5)",
      focusPos: [-4.5, 2.5, -6.5],
      focusTarget: [-3.2, -0.5, -1.5],
      specs: {
        "Base Pressure": "< 8 × 10⁻¹² Torr (Extreme High Vacuum / XHV)",
        "Pumping Speed": "300 L/s StarCell Ion + 1,200 L/s SAES CapaciTorr NEG",
        "Single-Atom Lifetime": "τ_vac ≈ 1,380 s (23 Minutes at 300 K; >10 hrs Cryo)",
        "Loss Rate per QEC Cycle": "< 7 × 10⁻⁷ per 1 ms cycle per qubit"
      },
      role: "Background gas collisions (primarily H₂) knock trapped atoms out of 0.5 mK deep optical tweezers. Achieving <10⁻¹¹ Torr raises single-atom vacuum lifetime to 23 minutes, making continuous reloading of a 10,000-atom array easily sustainable.",
      equation: "\\tau_{\\text{vac}} = \\frac{1}{n_{\\text{gas}} \\sigma_{\\text{coll}} \\bar{v}_{\\text{rel}}} \\approx 1,380\\text{ s}",
      papers: [
        "H. J. Manetsch et al. (Caltech), Nature (Sept 2025) — 23-minute room-temperature trap lifetime",
        "G. Pichard et al. (Pasqal / CNRS), PRX Quantum 5, 020352 (2024) — Cryogenic neutral atom trap lifetime"
      ]
    },
    {
      id: "comp-science-cell",
      name: "Optical-Contact Bonded AR Fused-Silica Science Cell",
      category: "1. Vacuum, Shielding & Source",
      scale: "Scale 3 • Millimeter (Center 0, 0, 0)",
      focusPos: [1.5, 1.0, 1.9],
      focusTarget: [0, 0, 0],
      specs: {
        "Dimensions": "80 mm × 32 mm × 32 mm Suprasil 3001 Quartz Cuvette",
        "Wall Thickness": "4.0 mm Optical Flats (λ/20 Wavefront Flatness)",
        "Bonding": "Hydroxide-Catalysis Optical Contact (350 °C Bakeable)",
        "AR Coating": "Double-Sided 8-Band IBS Coating (R < 0.15% at 461–1064 nm)"
      },
      role: "Provides ~3.5π steradians of unobstructed optical access around the atomic focal plane while maintaining <10⁻¹¹ Torr XHV. Wavefront flatness λ/20 ensures Strehl ratio S > 0.96 for the NA=0.75 tweezers.",
      equation: "S \\approx \\exp\\!\\left(-(2\\pi \\sigma_{\\text{WFE}} / \\lambda)^2\\right) > 0.96",
      papers: [
        "D. Bluvstein et al., Nature 626, 58–65 (2024)",
        "H. J. Manetsch et al., Nature (Sept 2025)"
      ]
    },
    {
      id: "comp-electrodes",
      name: "In-Vacuum 8-Rod Octupole E-Field & 6.834 GHz MW Loop",
      category: "1. Vacuum, Shielding & Source",
      scale: "Scale 3 • Millimeter (Inside Science Cell)",
      focusPos: [0.95, 0.75, 1.15],
      focusTarget: [0, 0, 0],
      specs: {
        "Electrode Geometry": "8 Gold-Coated Molybdenum Rods + 4 Corner Rings",
        "Residual DC E-Field": "< 0.8 mV/cm across 600 µm × 400 µm Focal Plane",
        "Rydberg Polarizability": "α(53S₁/₂) ≈ 71 MHz/(V/cm)² → Δν_Stark < 45 Hz",
        "Microwave Antenna": "In-Vacuum Impedance-Matched 6.834 GHz (Rb) / 9.192 GHz (Cs) Loop"
      },
      role: "Rydberg states (n = 53–71) have giant polarizabilities (~10⁸× ground state). The 8-electrode octupole actively zeroes stray patch charges on the quartz windows in all 3 axes and 5 gradients, while the MW loop drives global π/2 dynamical decoupling pulses.",
      equation: "\\Delta E_{\\text{Stark}} = -\\frac{1}{2} \\alpha_{nS} |\\mathbf{E}_{\\text{dc}} + \\mathbf{E}_{\\text{comp}}|^2, \\quad \\alpha_{nS} \\propto n^7",
      papers: [
        "S. J. Evered et al., Nature 622, 268–272 (2023) — 99.5% parallel entangling gates",
        "D. Bluvstein et al., Nature (2025/2026) — 448-atom fault-tolerant architecture"
      ]
    },
    {
      id: "comp-coils",
      name: "3-Axis Helmholtz Bias & Water-Cooled Anti-Helmholtz Coils",
      category: "1. Vacuum, Shielding & Source",
      scale: "Scale 2 • Meso (Surrounding Science Cell)",
      focusPos: [2.8, 2.2, 3.4],
      focusTarget: [0, 0, 0],
      specs: {
        "Quantization Bias Field": "B_z = 8.5000 G (Ultralow-Noise Current Source < 1 ppm)",
        "MOT Quadrupole Gradient": "18 G/cm (Switched off in < 80 µs via IGBT Snubber)",
        "X/Y/Z Trim Coils": "Active Fluxgate + Atomic Ramsey Feedback Stabilization",
        "Cooling": "Hollow-Core OFHC Copper with Deionized Water Chilling"
      },
      role: "Provides the quadrupole gradient for initial MOT/reservoir capture and the ultra-stable quantization field B_z = 8.5 G during computation, defining the clock-state quantization axis and lifting Zeeman degeneracy.",
      equation: "\\frac{\\delta B_z}{B_z} < 10^{-6} \\implies \\delta \\omega_{\\text{clock}} < 2\\pi \\times 0.03\\text{ Hz}",
      papers: [
        "H. J. Manetsch et al., Nature (Sept 2025)",
        "S. Ma et al., Nature 622, 279–284 (2023)"
      ]
    },

    // ========================================================================
    // SUBSYSTEM 2: OPTICAL TWEEZER, SHUTTLING & IMAGING CORE (Scale 2)
    // ========================================================================
    {
      id: "comp-objectives",
      name: "Dual Opposing High-NA (NA = 0.75) Apochromatic Objectives",
      category: "2. Optical Tweezer & Imaging Core",
      scale: "Scale 2 & 3 • Vertical Axis (0, ±1.15, 0)",
      focusPos: [1.8, 0.9, 2.2],
      focusTarget: [0, 0, 0],
      specs: {
        "Numerical Aperture": "NA = 0.75 (Glass-Thickness Compensated for 4.0 mm Fused Silica)",
        "Working Distance": "4.2 mm in Air / Vacuum",
        "Field of View (FOV)": "Ø 750 µm Diffraction-Limited (Strehl > 0.95)",
        "Diffraction Waist w₀": "0.78 µm at 813/852 nm | Resolution 0.52 µm at 461/780 nm"
      },
      role: "The upper objective projects the 12,000-site static SLM tweezer array while collecting upward fluorescence photons. The lower opposing objective projects the crossed 2D AOD mobile shuttling tweezers and local Raman addressing beams while doubling photon collection efficiency.",
      equation: "w_0 = \\frac{0.61 \\,\\lambda}{\\text{NA}} \\approx 0.69\\text{--}0.82\\text{ }\\mu\\text{m}, \\quad U_0 = \\frac{\\alpha(\\lambda) P}{\\pi c \\varepsilon_0 w_0^2}",
      papers: [
        "H. J. Manetsch et al. (Caltech), Nature (Sept 2025) — 12,000 traps across large FOV",
        "D. Bluvstein et al., Nature 626 (2024) & Nature (2025/2026)"
      ]
    },
    {
      id: "comp-slm-arm",
      name: "LCoS Spatial Light Modulator (SLM) Static Tweezer Arm",
      category: "2. Optical Tweezer & Imaging Core",
      scale: "Scale 2 • Optical Bench (+4.2, +1.8, -1.8)",
      focusPos: [5.5, 3.2, 2.2],
      focusTarget: [2.8, 1.5, -1.0],
      specs: {
        "SLM Resolution": "1920 × 1200 Liquid-Crystal-on-Silicon (Water-Cooled Dielectric)",
        "Laser Source": "50 W Ti:Sapphire / Fiber Amplifier (813 nm / 852 nm / 1064 nm)",
        "Hologram Synthesis": "Weighted Gerchberg-Saxton (WGS) + Zernike Wavefront Correction",
        "Trap Uniformity": "< 0.7% RMS Depth Variation across 12,000 Tweezer Sites"
      },
      role: "Imprints a computer-generated Fourier phase hologram onto the high-power trapping laser, generating 12,000 static optical tweezers simultaneously across the Reservoir, Storage, Entangling, and Readout zones.",
      equation: "\\phi_{\\text{SLM}}(u,v) = \\arg\\!\\left(\\sum_{k=1}^{12,000} w_k \\exp\\!\\left[-i \\frac{2\\pi}{\\lambda f}(u x_k + v y_k)\\right]\\right)",
      papers: [
        "H. J. Manetsch, G. Nomura, E. Bataille, M. Endres et al., Nature (Sept 2025)",
        "D. Kim et al., Optica / Rev. Sci. Instrum. — Camera-in-the-loop WGS trap equalization"
      ]
    },
    {
      id: "comp-aod-arm",
      name: "Crossed 2D TeO₂ Acousto-Optic Deflector (AOD) Shuttling Arm",
      category: "2. Optical Tweezer & Imaging Core",
      scale: "Scale 2 • Optical Bench (+4.2, -1.1, +1.8)",
      focusPos: [5.6, 1.4, 4.8],
      focusTarget: [2.6, -0.6, 1.2],
      specs: {
        "Crystal": "Orthogonal Shear-Mode TeO₂ (42 mm Aperture, v_ac = 650 m/s)",
        "RF Bandwidth": "50 MHz around 85 MHz Center (Time-Bandwidth Product > 2,500)",
        "Simultaneous Mobile Traps": "Up to 256 × 256 Independently Steerable Row/Column Beams",
        "Transport Speed": "0.55 µm/µs with Minimum-Jerk Polynomial Chirps"
      },
      role: "Provides the dynamic 'quantum data bus' of the processor. By ramping the depth of the 2D AOD tweezers up, translating the RF tones f_x(t), f_y(t) smoothly, and ramping down into target SLM sites, entire logical qubit patches are shuttled between Storage, Entangling, and Readout zones.",
      equation: "x(t) = \\frac{\\lambda f_{\\text{obj}}}{v_{\\text{ac}}} \\,\\Delta f_x(t), \\quad x(\\tau) = x_0 + \\Delta x \\left(10 s^3 - 15 s^4 + 6 s^5\\right)",
      papers: [
        "D. Bluvstein et al., Nature 604 (2022), Nature 626 (2024), Nature (2025/2026)",
        "B. Lin, B. Tan, J. Cong, 'ZAC: Reuse-Aware Compilation for Zoned Quantum Architectures' (2025/2026)"
      ]
    },
    {
      id: "comp-rydberg-optics",
      name: "Counter-Propagating Top-Hat Rydberg Excitation Optics",
      category: "2. Optical Tweezer & Imaging Core",
      scale: "Scale 2 • Horizontal Axis (±3.8, 0, ±1.6)",
      focusPos: [3.2, 2.2, 4.2],
      focusTarget: [0.2, 0, 0],
      specs: {
        "Excitation Scheme": "Two-Photon 480 nm (12 W SHG) + 780 nm | or 302 nm UV (Yb-171)",
        "Beam Shaping": " Powell Lens + Cylindrical Telescope → 15 µm × 220 µm Flat-Top Sheet",
        "Two-Photon Rabi Freq": "Ω / 2π = 4.6 MHz (Intermediate Detuning Δ / 2π = 7.8 GHz)",
        "Pulse Control": "Double-Pass AOM + EOM Arbitrary Phase/Amplitude Modulation"
      },
      role: "Projects a spatially flat (<0.5% intensity variation) elliptical laser sheet strictly across Zone 4 (the Rydberg Entangling Zone). Drives fast 240 ns time-optimal single-pulse CZ gates while leaving Zone 3 (Storage) and Zone 1 (Conveyor) completely dark.",
      equation: "H_{\\text{Ryd}} = \\sum_i \\frac{\\hbar \\Omega(t)}{2} \\left(e^{i\\phi(t)} |1_i\\rangle\\langle r_i| + \\text{h.c.}\\right) - \\sum_i \\hbar \\Delta(t)|r_i\\rangle\\langle r_i| + \\sum_{i<j} \\frac{C_6}{r_{ij}^6} n_i^r n_j^r",
      papers: [
        "S. J. Evered et al., 'High-fidelity parallel entangling gates on a neutral-atom quantum computer', Nature 622, 268–272 (2023)",
        "S. Ma et al., Nature 622, 279–284 (2023)"
      ]
    },
    {
      id: "comp-qcmos-camera",
      name: "qCMOS / EMCCD Fluorescence Camera & Cavity Readout Port",
      category: "2. Optical Tweezer & Imaging Core",
      scale: "Scale 2 • Upper Imaging Arm (-3.2, +2.8, +1.8)",
      focusPos: [-4.5, 4.2, 4.5],
      focusTarget: [-2.0, 2.2, 1.0],
      specs: {
        "Detector": "Back-Illuminated Photon-Number-Resolving qCMOS (0.22 e⁻ Read Noise)",
        "Readout Fidelity": "99.99% Non-Destructive State Discrimination (Loss < 6 × 10⁻⁵)",
        "Mid-Circuit ROI Speed": "120–150 µs Sub-Array Readout (or 15 µs Nanophotonic Cavity Mode)",
        "Erasure Channel": "Dual-Band Dichroic Split for Simultaneous ³P₀ Erasure Flash"
      },
      role: "Images scattered fluorescence photons from Zone 5 (Mid-Circuit Readout) and Zone 2 (Defect-Free Sorting), streaming sub-millisecond syndrome frames over CoaXPress-12 / PCIe Gen5 directly into the FPGA decoder.",
      equation: "F_{\\text{readout}} = 1 - \\frac{1}{2}\\left(\\text{erfc}(\\text{SNR}/\\sqrt{2}) + P_{\\text{depump}} + P_{\\text{loss}}\\right) = 99.99\\%",
      papers: [
        "H. J. Manetsch et al. (Caltech), Nature (Sept 2025) — 99.99% imaging fidelity",
        "D. Bluvstein et al., Nature (2025/2026) — Mid-circuit readout and qubit reuse"
      ]
    },
    {
      id: "comp-fpga-controller",
      name: "Real-Time FPGA / RF-SoC QEC Controller & Correlated ML Decoder",
      category: "2. Optical Tweezer & Imaging Core",
      scale: "Scale 1 • Control Rack (+6.8, +0.2, -3.5)",
      focusPos: [9.5, 3.8, 3.5],
      focusTarget: [6.5, 0.2, -3.2],
      specs: {
        "Compute Fabric": "UltraScale+ RF-SoC + Custom Tensor/FPGA Union-Find & ML Decoder",
        "AWG Channels": "32 × 4 GS/s 16-bit Phase-Coherent RF Channels (AOD + Rydberg + MW)",
        "Closed-Loop Latency": "< 12 µs Camera-to-RF Feedforward Latency",
        "Decoding Algorithm": "Correlated Machine-Learning + Heralded Erasure-Aware Decoder"
      },
      role: "Orchestrates the entire quantum computer in real time: computes Hungarian/compression moves for continuous reloading, synthesizes 2D AOD cubic-spline chirps, decodes surface/color/qLDPC syndromes with erasure flags, and executes mid-circuit Pauli frame updates and conditional teleportation.",
      equation: "p_L \\propto \\left(\\frac{p_{\\text{Pauli}}}{p_{\\text{th}}^{(P)}} + \\frac{p_{\\text{erasure}}}{p_{\\text{th}}^{(E)}}\\right)^{(d+1)/2}, \\quad p_{\\text{th}}^{(E)} \\approx 4.8 \\, p_{\\text{th}}^{(P)}",
      papers: [
        "D. Bluvstein et al., Nature (2025/2026) — Correlated ML decoding & below-threshold QEC",
        "Microsoft & Atom Computing (2024–2026) — Qubit virtualization & 28-logical-qubit execution"
      ]
    },

    // ========================================================================
    // SUBSYSTEM 3: 5-ZONE FOCAL PLANE MICRO-ARCHITECTURE (Scale 4)
    // ========================================================================
    {
      id: "zone-conveyor",
      name: "Zone 1: Dual Optical Lattice Conveyor Belt (Continuous Reloading)",
      category: "3. 5-Zone Focal Plane (600 µm)",
      scale: "Scale 4 • Focal Plane Left (x = -280 to -210 µm)",
      focusPos: [-0.52, 0.34, 0.44],
      focusTarget: [-0.52, 0, 0],
      specs: {
        "Mechanism": "Two-Stage 1064 nm + 852 nm Moving Standing-Wave Lattice Conveyors",
        "Atom Delivery Rate": "300,000 cold atoms/s → >30,000 initialized ground-state qubits/s",
        "Continuous Operation": "> 2 Hours Steady-State Operation of >3,000–10,000 Qubits",
        "Storage Crosstalk": "< 2 × 10⁻⁴ Decoherence per Reload via Baffle + Light-Shift Shield"
      },
      role: "Eliminates the pulsed single-shot bottleneck of neutral-atom processors. Freshly laser-cooled atoms ride the moving optical lattice interference fringes from the remote reservoir into Zone 1, where they are Raman-sideband cooled and handed off to Zone 2 while quantum circuits run uninterrupted in Zones 3–5.",
      equation: "v_{\\text{conveyor}}(t) = \\frac{\\lambda_{\\text{lat}}}{2} \\,\\Delta f_{\\text{AOM}}(t), \\quad \\Phi_{\\text{reload}} > 3 \\times 10^4\\text{ qubits/s}",
      papers: [
        "N.-C. Chiu et al. (Harvard Lukin Group), 'Continuous operation of a coherent 3,000-qubit system', Nature 646, 1075–1080 (Sept 2025)"
      ]
    },
    {
      id: "zone-reservoir",
      name: "Zone 2: Cold Reservoir & Defect-Free Sorting Zone",
      category: "3. 5-Zone Focal Plane (600 µm)",
      scale: "Scale 4 • Focal Plane Mid-Left (x = -210 to -100 µm)",
      focusPos: [-0.32, 0.32, 0.42],
      focusTarget: [-0.32, 0, 0],
      specs: {
        "Buffer Sites": "2,400 SLM Tweezer Sites at 3.5 µm Pitch",
        "Initial Loading": "82% Enhanced Gray-Molasses Collisional Blockade Loading",
        "Sorting Algorithm": "Parallel Row-Column Compression (12 ms Total Rearrangement)",
        "Defect-Free Yield": "> 99.95% Per Replenished Logical Patch"
      },
      role: "Extracts atoms from the Zone 1 conveyor into a stochastic 2D buffer array, takes a fast 50 µs occupancy snapshot, and uses the crossed 2D AODs to compress them into defect-free logical supply registers ready to replace lost or measured ancillas.",
      equation: "P_{\\text{defect-free}}(N) = \\left(1 - p_{\\text{move-loss}}\\right)^N > 99.5\\%",
      papers: [
        "H. J. Manetsch et al. (Caltech), Nature (Sept 2025)",
        "N.-C. Chiu et al. (Harvard), Nature 646 (Sept 2025)"
      ]
    },
    {
      id: "zone-storage",
      name: "Zone 3: Shielded Quantum Memory & Logical Storage Zone",
      category: "3. 5-Zone Focal Plane (600 µm)",
      scale: "Scale 4 • Focal Plane Center (x = -100 to +60 µm)",
      focusPos: [-0.04, 0.35, 0.45],
      focusTarget: [-0.04, 0, 0],
      specs: {
        "Capacity": "Up to 6,100 Physical Qubits in Logical Code Patches (5.0 µm Pitch)",
        "Supported Codes": "d=7 Surface Code | [[8,3,2]] Color Code | [[144,12,12]] qLDPC (>1/2 Rate)",
        "Coherence Time T₂": "12.6 s (Cs-133/Rb-87 XY8 DD) | > 40.0 s (Yb-171 Nuclear Spin)",
        "Idling Error Suppression": "22× Lower Decoherence vs. Monolithic Array (ZAC Benchmark)"
      },
      role: "Acts as the high-coherence quantum RAM of the processor. Because Zone 3 is spatially separated from the intense 480 nm / 302 nm Rydberg beams in Zone 4 and the resonant fluorescence photons in Zone 5, idling logical blocks experience virtually zero crosstalk.",
      equation: "\\mathcal{F}_{\\text{idle}}(\\tau) = \\exp\\!\\left[-(\\tau / T_2)^p\\right] > 99.99\\% \\text{ per } 1\\text{ ms QEC round}",
      papers: [
        "D. Bluvstein et al., Nature 626 (2024) & Nature (2025/2026)",
        "B. Lin, B. Tan, J. Cong (UCLA), 'ZAC: Reuse-Aware Compilation for Zoned Quantum Architectures' (2025/2026)",
        "QuEra, Harvard & MIT, 'High-Rate QEC with >1/2 Encoding Rate' (April 2026)"
      ]
    },
    {
      id: "zone-entangling",
      name: "Zone 4: Parallel Rydberg Entangling Zone",
      category: "3. 5-Zone Focal Plane (600 µm)",
      scale: "Scale 4 • Focal Plane Mid-Right (x = +60 to +180 µm)",
      focusPos: [0.26, 0.32, 0.42],
      focusTarget: [0.26, 0, 0],
      specs: {
        "Inter-Atom Pair Spacing": "d = 3.5 µm (Inside Rydberg Blockade Sphere Rb = 9.2 µm)",
        "Inter-Pair Spacing": "> 14 µm (Zero Crosstalk Between Parallel Gate Pairs)",
        "Gate Mechanism": "Time-Optimal Single-Pulse Phase-Modulated CZ (τ = 240 ns)",
        "Two-Qubit Gate Fidelity": "99.55% Raw Parallel | 99.80% with Erasure Conversion"
      },
      role: "Where all two-qubit entangling gates occur. 2D AOD mobile tweezers bring entire logical patches from Zone 3 into Zone 4, interleave each data qubit next to its target data or syndrome ancilla qubit at d = 3.5 µm, and execute transversal CZ gates across hundreds of pairs simultaneously in a single 240 ns global Rydberg flash.",
      equation: "U_{\\text{CZ}} = \\text{diag}\\!\\left(1,\\, e^{i\\theta},\\, e^{i\\theta},\\, e^{i(2\\theta + \\pi)}\\right), \\quad R_b = \\left(\\frac{C_6}{\\hbar \\Omega}\\right)^{1/6} \\approx 9.2\\text{ }\\mu\\text{m}",
      papers: [
        "S. J. Evered et al., Nature 622, 268–272 (2023) — 99.5% parallel entangling gates",
        "D. Bluvstein et al., Nature 626 (2024) & Nature (2025/2026)"
      ]
    },
    {
      id: "zone-readout",
      name: "Zone 5: Isolated Mid-Circuit Readout, Erasure & Reset Zone",
      category: "3. 5-Zone Focal Plane (600 µm)",
      scale: "Scale 4 • Focal Plane Far-Right (x = +180 to +280 µm)",
      focusPos: [0.50, 0.32, 0.42],
      focusTarget: [0.50, 0, 0],
      specs: {
        "Isolation": "Knife-Edge Conjugate Field Stop + Dual-Species 72 nm Spectral Detuning",
        "Syndrome Readout Time": "150 µs Free-Space High-NA | 15 µs Cavity-Enhanced Mode",
        "Erasure Conversion": "98% of Spontaneous Rydberg Decays Heralded in 5 µs Flash",
        "Mid-Circuit Qubit Reuse": "Optical Pumping + 3D Raman Sideband Recooling (< 200 µs)"
      },
      role: "Enables fault-tolerant repeated QEC cycles, magic-state teleportation, and dynamic circuits. Syndrome ancillas moved here are imaged without scattering a single resonant photon onto the data qubits in Zone 3, then recooled and optically pumped back to |0⟩ for immediate reuse.",
      equation: "\\epsilon_{\\text{crosstalk}} = N_{\\text{scat}} \\,\\frac{\\sigma_0}{4\\pi R_{\\text{zone}}^2} \\,\\frac{\\Gamma^2}{4\\Delta_{\\text{species}}^2 + \\Gamma^2} < 10^{-6}",
      papers: [
        "D. Bluvstein et al., Nature (2025/2026) — Mid-circuit qubit reset & repeated QEC",
        "K. Singh, C. E. Bradley, S. Anand, H. Bernien et al., Science 380, 1265–1269 (2023)",
        "S. Ma et al., Nature 622 (2023); P. Scholl et al., Nature 622 (2023)"
      ]
    },

    // ========================================================================
    // SUBSYSTEM 4: MICROSCOPIC TWEEZER & ATOMIC PHYSICS (Scale 5)
    // ========================================================================
    {
      id: "micro-tweezer-pair",
      name: "Diffraction-Limited Optical Tweezer Pair (w₀ = 0.8 µm)",
      category: "4. Single Tweezer & Atomic Physics (10 µm)",
      scale: "Scale 5 • Microscopic (Zone 4 Focus)",
      focusPos: [0.26, 0.08, 0.14],
      focusTarget: [0.26, 0, 0.02],
      specs: {
        "Beam Waist w₀": "0.78 µm (1/e² Radius), Rayleigh Range z_R = 2.3 µm",
        "Trap Depth U₀ / k_B": "0.45 mK (Storage) / Modulated during Gate",
        "Trap Frequencies": "ω_r / 2π = 85 kHz (Radial), ω_z / 2π = 18 kHz (Axial)",
        "Motional Occupation": "n̄_x,y,z < 0.06 via 3D Raman Sideband Cooling"
      },
      role: "Each optical tweezer is a tightly focused Gaussian laser beam where the AC Stark dipole force pulls a single cold neutral atom to the intensity maximum. Collisional light-assisted blockade ensures strictly 0 or 1 atom per trap.",
      equation: "U(\\mathbf{r}) = -\\frac{1}{2\\varepsilon_0 c} \\,\\text{Re}(\\alpha(\\omega)) \\,I_0 \\left(\\frac{w_0}{w(z)}\\right)^{\\!2} \\exp\\!\\left(-\\frac{2r^2}{w^2(z)}\\right)",
      papers: [
        "H. J. Manetsch et al. (Caltech), Nature (Sept 2025)",
        "S. J. Evered et al., Nature 622 (2023)"
      ]
    },
    {
      id: "micro-rydberg-blockade",
      name: "Rydberg Blockade Sphere (Rb = 9.2 µm) & Van der Waals Interaction",
      category: "4. Single Tweezer & Atomic Physics (10 µm)",
      scale: "Scale 5 • Microscopic (Zone 4 Focus)",
      focusPos: [0.26, 0.095, 0.16],
      focusTarget: [0.26, 0, 0.02],
      specs: {
        "Principal Quantum Number": "n = 53S₁/₂ (⁸⁷Rb) | n = 61S₁/₂ (¹³³Cs) | n = 71 ³S₁ (¹⁷¹Yb)",
        "Van der Waals Coeff C₆": "C₆ / h ≈ 220 GHz · µm⁶ (at n = 61)",
        "Interaction at d = 3.5 µm": "V(d) / h ≈ 120 MHz ≫ Ω / 2π = 4.6 MHz",
        "Blockade Radius Rb": "9.2 µm (Simultaneous |rr⟩ Excitation Shifted Out of Resonance)"
      },
      role: "When two trapped atoms are brought to d = 3.5 µm inside the Entangling Zone, the strong dipole-dipole / van der Waals interaction V(r) = C₆/r⁶ shifts the doubly excited Rydberg state |rr⟩ by ~120 MHz—preventing both atoms from entering |r⟩ simultaneously and imprinting a conditional π phase on |11⟩.",
      equation: "V(d) = \\frac{C_6}{d^6} \\gg \\hbar \\Omega \\implies |11\\rangle \\xrightarrow{\\text{2}\\pi\\text{ pulse}} -e^{2i\\theta}|11\\rangle",
      papers: [
        "S. J. Evered et al., Nature 622, 268–272 (2023)",
        "D. Bluvstein et al., Nature 626 (2024)"
      ]
    },
    {
      id: "micro-raman-addressing",
      name: "Local Raman Single-Qubit Addressing Beam & Bloch Spin",
      category: "4. Single Tweezer & Atomic Physics (10 µm)",
      scale: "Scale 5 • Microscopic (Zone 4 Focus)",
      focusPos: [0.23, 0.075, 0.125],
      focusTarget: [0.24, 0, 0.02],
      specs: {
        "Wavelength": "795 nm (Rb D1 Line, Δ = -150 GHz) / 556 nm (Yb-171)",
        "Single-Qubit Gate Time": "τ_1Q = 380 ns (Arbitrary SU(2) Rotation via 2D AOD)",
        "Single-Qubit Fidelity": "99.97% Local Addressed | 99.992% Global Microwave",
        "Neighbor Crosstalk": "< 4 × 10⁻⁵ at 3.5 µm Separation"
      },
      role: "Delivers focused two-photon stimulated Raman pulses or local AC Stark Z-phase shifts to individual qubits inside a logical block, enabling non-Clifford T-gate injection, magic state cultivation, and selective syndrome basis rotations.",
      equation: "\\Omega_{\\text{Raman}} = \\frac{\\Omega_1 \\Omega_2^*}{2 \\Delta_{\\text{D1}}}, \\quad U_{1Q}(\\theta, \\phi) = \\exp\\!\\left(-i \\frac{\\theta}{2}(\\cos\\phi\\,\\sigma_x + \\sin\\phi\\,\\sigma_y)\\right)",
      papers: [
        "D. Bluvstein et al., Nature (2025/2026) — Universal fault-tolerant logic & magic state cultivation",
        "S. J. Evered et al., Nature 622 (2023)"
      ]
    }
  ],

  papersDatabase: [
    {
      year: "2026",
      authors: "D. Bluvstein, M. D. Lukin et al. (Harvard / QuEra / MIT)",
      title: "A fault-tolerant neutral-atom architecture for universal quantum computation",
      journal: "Nature (2025/2026)",
      highlight: "448-atom zoned processor demonstrating repeated below-threshold QEC, mid-circuit qubit reset/reuse, logical teleportation, and correlated ML decoding.",
      tags: ["Zoned Architecture", "448 Qubits", "Below-Threshold QEC", "Mid-Circuit Reuse"]
    },
    {
      year: "2026",
      authors: "QuEra, Harvard & MIT Collaboration",
      title: "High-Rate Fault-Tolerant Quantum Error Correction Exceeding 1/2 Encoding Rate & Strategic Plan",
      journal: "arXiv:2607.21554 / Preprint (2026)",
      highlight: "Demonstrates >50% logical-to-physical encoding efficiency for quantum memory and outlines the 10,000-qubit utility roadmap.",
      tags: ["High-Rate qLDPC", ">1/2 Encoding Rate", "10K Qubit Roadmap"]
    },
    {
      year: "2025",
      authors: "N.-C. Chiu et al. (Harvard Lukin Group)",
      title: "Continuous operation of a coherent 3,000-qubit system",
      journal: "Nature 646, 1075–1080 (Sept 2025)",
      highlight: "Dual optical lattice conveyor belts reload 300,000 atoms/s (>30,000 qubits/s), maintaining >3,000 coherent qubits continuously for >2 hours.",
      tags: ["Continuous Reloading", "Optical Lattice Conveyor", "3,000+ Qubits", ">2 Hours"]
    },
    {
      year: "2025",
      authors: "H. J. Manetsch, G. Nomura, E. Bataille, M. Endres et al. (Caltech)",
      title: "A tweezer array with 6,100 highly coherent atomic qubits",
      journal: "Nature (Sept 2025)",
      highlight: "6,100 Cs-133 qubits in ~12,000 SLM traps with record 12.6 s hyperfine coherence, 99.99% imaging fidelity, and 23-minute room-temp lifetime.",
      tags: ["6,100 Qubits", "12.6 s Coherence", "99.99% Imaging", "23 min Lifetime"]
    },
    {
      year: "2025",
      authors: "B. Lin, B. Tan, J. Cong (UCLA)",
      title: "ZAC: Reuse-Aware Compilation for Zoned Quantum Architectures",
      journal: "ASPLOS / arXiv (2025/2026)",
      highlight: "Compiler and routing framework for zoned neutral-atom processors achieving up to 22x circuit fidelity improvement over monolithic arrays.",
      tags: ["ZAC Compiler", "22x Fidelity Gain", "AOD Routing"]
    },
    {
      year: "2024–2026",
      authors: "Microsoft & Atom Computing Collaboration",
      title: "Demonstration of 24 Entangled Logical Qubits and 28-Logical-Qubit Computation in Yb-171",
      journal: "Azure Quantum / Commercial 'Magne' Platform (Nov 2024 – 2026)",
      highlight: "1,180+ Yb-171 nuclear-spin qubits demonstrating 24-logical-qubit GHZ entanglement, erasure-aware syndrome extraction, and 28-logical-qubit algorithms.",
      tags: ["Yb-171 Nuclear Spin", "28 Logical Qubits", "Erasure Conversion"]
    },
    {
      year: "2024",
      authors: "D. Bluvstein et al. (Harvard / QuEra / MIT / NIST)",
      title: "Logical quantum processor based on reconfigurable atom arrays",
      journal: "Nature 626, 58–65 (2024)",
      highlight: "Pioneered the 3-zone (Storage, Entangling, Readout) reconfigurable architecture with up to 48 logical qubits and transversal color/surface/hypercube codes.",
      tags: ["48 Logical Qubits", "Transversal Gates", "Zoned Processor"]
    },
    {
      year: "2023",
      authors: "S. J. Evered et al. (Harvard / QuEra)",
      title: "High-fidelity parallel entangling gates on a neutral-atom quantum computer",
      journal: "Nature 622, 268–272 (2023)",
      highlight: "Achieved 99.5% two-qubit CZ gate fidelity across 60 parallel Rb-87 qubits using single-pulse time-optimal phase modulation.",
      tags: ["99.5% CZ Fidelity", "Time-Optimal Pulse", "Parallel Gates"]
    },
    {
      year: "2023",
      authors: "S. Ma et al. (Princeton) & P. Scholl et al. (Caltech)",
      title: "High-fidelity gates and mid-circuit erasure conversion in an atomic array",
      journal: "Nature 622, 279–284 & 273–278 (2023)",
      highlight: "Demonstrated mid-circuit erasure conversion in Yb-171 and Sr-88 metastable qubits, converting 98% of Rydberg decays into heralded located erasures.",
      tags: ["Erasure Conversion", "99.8% Post-Selected", "Alkaline-Earth"]
    },
    {
      year: "2023",
      authors: "K. Singh, C. E. Bradley, S. Anand, H. Bernien et al. (UChicago)",
      title: "Mid-circuit operations using the omg-architecture in a dual-species Rydberg array",
      journal: "Science 380, 1265–1269 (2023)",
      highlight: "Interleaved Rb-87 and Cs-133 arrays enabling crosstalk-free mid-circuit ancilla readout and quantum non-demolition syndrome measurement.",
      tags: ["Dual-Species Rb+Cs", "Crosstalk-Free Readout", "Mid-Circuit QND"]
    }
  ]
};
