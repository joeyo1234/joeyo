import * as THREE from 'three';

export interface CorticalRegion {
  name: string;
  meshName: string;
  geometry: THREE.BufferGeometry;
  color: string;
  description: string;
  clinical: string;
  relatedModules: string[];
}

// Classify a vertex using NORMALIZED coordinates (0-1 range).
// nx: 0=medial, 1=lateral
// ny: 0=posterior, 1=anterior
// nz: 0=ventral(bottom), 1=dorsal(top)
function classifyNormalized(nx: number, ny: number, nz: number): string {
  // Occipital — posterior 18%
  if (ny < 0.18) return 'occipital';

  // Motor cortex — narrow strip, anterior-central, dorsal
  if (ny > 0.52 && ny < 0.62 && nz > 0.55) return 'motor_cortex';

  // Somatosensory — narrow strip just behind motor, dorsal
  if (ny > 0.42 && ny <= 0.52 && nz > 0.55) return 'somatosensory';

  // Broca's — inferior frontal, anterior, lateral
  if (ny > 0.65 && nx > 0.5 && nz < 0.45) return 'broca';

  // Prefrontal — very anterior
  if (ny > 0.72) return 'prefrontal';

  // Anterior temporal — anterior-inferior, lateral
  if (ny > 0.55 && nx > 0.45 && nz < 0.35) return 'anterior_temporal';

  // Wernicke's — lateral, mid-posterior, inferior
  if (ny > 0.2 && ny < 0.45 && nx > 0.5 && nz < 0.4) return 'wernicke';

  // Temporal — lateral, inferior
  if (nx > 0.45 && nz < 0.4) return 'temporal';

  // Frontal association — between prefrontal and motor
  if (ny > 0.62 && nz > 0.45) return 'frontal_other';

  // Parietal — dorsal posterior (catch-all for upper back)
  if (nz > 0.5) return 'parietal';

  // Fallback
  return 'temporal';
}

const regionConfigs: Record<string, {
  name: string;
  color: string;
  description: string;
  clinical: string;
  relatedModules: string[];
}> = {
  prefrontal: {
    name: 'Prefrontal Cortex',
    color: '#ff4466',
    description: 'The anterior frontal lobe — seat of executive function, planning, decision-making, personality, and social behavior. The dorsolateral prefrontal cortex (dlPFC) handles working memory. The orbitofrontal cortex (OFC) links emotion to decisions. The most recently evolved cortical region.',
    clinical: 'Damage causes dysexecutive syndrome: impaired planning, disinhibition, personality changes. Phineas Gage\'s iron rod through his prefrontal cortex changed his personality. Prefrontal development continues until age ~25.',
    relatedModules: ['executive', 'workingmem'],
  },
  motor_cortex: {
    name: 'Primary Motor Cortex',
    color: '#44dd88',
    description: 'The precentral gyrus — a strip just anterior to the central sulcus. Contains the motor homunculus: hands, face, and tongue have disproportionately large representations.',
    clinical: 'Damage causes contralateral weakness or paralysis. Stroke here is the most common cause of hemiplegia.',
    relatedModules: ['motor'],
  },
  somatosensory: {
    name: 'Somatosensory Cortex',
    color: '#4a9eff',
    description: 'The postcentral gyrus — just posterior to the central sulcus. Contains the sensory homunculus for touch, pressure, temperature, and proprioception.',
    clinical: 'Damage causes loss of sensation on the opposite side. Patients may lose the ability to identify objects by touch (astereognosis).',
    relatedModules: ['spatial'],
  },
  broca: {
    name: 'Broca\'s Area',
    color: '#ff5599',
    description: 'Posterior inferior frontal gyrus (BA 44/45). Computes hierarchical grammatical structure for speech production and comprehension. Connected to Wernicke\'s area via the arcuate fasciculus.',
    clinical: 'Damage causes Broca\'s aphasia — non-fluent, telegraphic speech with relatively preserved comprehension of simple sentences.',
    relatedModules: ['syntactic', 'phonological', 'motor'],
  },
  parietal: {
    name: 'Parietal Lobe',
    color: '#ffcc33',
    description: 'Contains the intraparietal sulcus (IPS) for numerical magnitude and spatial processing, the angular gyrus for semantic integration, and the supramarginal gyrus for phonological processing.',
    clinical: 'Right parietal damage causes hemispatial neglect. Left parietal damage causes Gerstmann syndrome: finger agnosia, dyscalculia, dysgraphia.',
    relatedModules: ['spatial', 'phonological', 'semantic'],
  },
  wernicke: {
    name: 'Wernicke\'s Area',
    color: '#9b6dff',
    description: 'Posterior superior temporal gyrus, near the temporo-parietal junction. Maps acoustic speech signals onto phonological representations. Part of the ventral language stream.',
    clinical: 'Damage causes Wernicke\'s aphasia — fluent but meaningless speech. Patients are often unaware of their deficit.',
    relatedModules: ['phonological', 'auditory', 'semantic'],
  },
  anterior_temporal: {
    name: 'Anterior Temporal Lobe',
    color: '#ff8844',
    description: 'The temporal pole — the brain\'s semantic hub. Integrates modality-specific features into unified, amodal concepts.',
    clinical: 'Semantic dementia causes gradual loss of conceptual knowledge: patients lose specific concepts before general ones.',
    relatedModules: ['semantic'],
  },
  temporal: {
    name: 'Temporal Lobe',
    color: '#00d4aa',
    description: 'Superior temporal gyrus processes auditory input. Middle temporal handles semantic processing. Inferior temporal specializes in object and face recognition.',
    clinical: 'Superior temporal damage impairs hearing and speech comprehension. Inferior temporal damage causes prosopagnosia (face blindness).',
    relatedModules: ['auditory', 'semantic', 'visual'],
  },
  occipital: {
    name: 'Occipital Lobe',
    color: '#4a9eff',
    description: 'Entirely dedicated to vision. V1 (edges), V2 (contours), V3 (form), V4 (color), V5/MT (motion). Hierarchical processing.',
    clinical: 'V1 damage causes cortical blindness. Some patients show "blindsight" — navigating obstacles they claim not to see.',
    relatedModules: ['visual'],
  },
  frontal_other: {
    name: 'Premotor & Frontal Association',
    color: '#ff7788',
    description: 'Premotor cortex (movement planning), supplementary motor area (internally generated sequences), and frontal eye fields (voluntary eye movements).',
    clinical: 'Premotor damage causes ideomotor apraxia — inability to perform skilled movements on command despite intact comprehension.',
    relatedModules: ['motor', 'executive', 'spatial'],
  },
};

export function splitHemisphere(
  hemisphereGeometry: THREE.BufferGeometry,
  hemispherePosition: [number, number, number],
): CorticalRegion[] {
  const posAttr = hemisphereGeometry.getAttribute('position');
  const indexAttr = hemisphereGeometry.getIndex();

  if (!posAttr || !indexAttr) return [];

  const tx = hemispherePosition[0];
  const ty = hemispherePosition[1];
  const tz = hemispherePosition[2];

  // First pass: find bounding box in world space
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i) + tx;
    const y = posAttr.getY(i) + ty;
    const z = posAttr.getZ(i) + tz;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
  }

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const rangeZ = maxZ - minZ || 1;

  console.log('[splitHemisphere] Bounds:', { minX, maxX, minY, maxY, minZ, maxZ });
  console.log('[splitHemisphere] Ranges:', { rangeX, rangeY, rangeZ });

  // Second pass: classify each vertex using normalized coordinates
  const vertexRegions: string[] = [];
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i) + tx;
    const y = posAttr.getY(i) + ty;
    const z = posAttr.getZ(i) + tz;

    // Normalize to 0-1 range
    const nx = (x - minX) / rangeX; // 0=medial, 1=lateral
    const ny = (y - minY) / rangeY; // 0=posterior, 1=anterior
    const nz = (z - minZ) / rangeZ; // 0=ventral, 1=dorsal

    vertexRegions.push(classifyNormalized(nx, ny, nz));
  }

  // Count vertices per region for debugging
  const regionCounts: Record<string, number> = {};
  vertexRegions.forEach(r => { regionCounts[r] = (regionCounts[r] || 0) + 1; });
  console.log('[splitHemisphere] Vertex distribution:', regionCounts);

  // Group triangles by majority vote
  const regionTriangles: Record<string, number[]> = {};
  for (let i = 0; i < indexAttr.count; i += 3) {
    const a = indexAttr.getX(i);
    const b = indexAttr.getX(i + 1);
    const c = indexAttr.getX(i + 2);

    const regions = [vertexRegions[a], vertexRegions[b], vertexRegions[c]];
    const counts: Record<string, number> = {};
    regions.forEach(r => { counts[r] = (counts[r] || 0) + 1; });
    const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

    if (!regionTriangles[winner]) regionTriangles[winner] = [];
    regionTriangles[winner].push(a, b, c);
  }

  console.log('[splitHemisphere] Triangle distribution:', Object.fromEntries(
    Object.entries(regionTriangles).map(([k, v]) => [k, v.length / 3])
  ));

  // Create separate geometries
  const results: CorticalRegion[] = [];
  for (const [regionId, indices] of Object.entries(regionTriangles)) {
    const config = regionConfigs[regionId];
    if (!config) continue;

    const newGeo = hemisphereGeometry.clone();
    newGeo.setIndex(indices);

    results.push({
      name: config.name,
      meshName: `cortex_${regionId}`,
      geometry: newGeo,
      color: config.color,
      description: config.description,
      clinical: config.clinical,
      relatedModules: config.relatedModules,
    });
  }

  return results;
}
