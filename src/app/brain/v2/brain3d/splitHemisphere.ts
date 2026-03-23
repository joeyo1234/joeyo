import * as THREE from 'three';

// Splits the hemisphere mesh geometry into approximate cortical regions
// based on vertex positions in 3D space.
//
// Coordinate system (from inspecting the GLB):
//   Y axis: anterior (+) to posterior (-)
//   Z axis: ventral (less negative) to dorsal (more negative)
//   X axis: medial (+) to lateral (-)
//
// The hemisphere mesh has translation [-1.6, -7.3, -15.8] applied,
// so we work in world-space coordinates.

export interface CorticalRegion {
  name: string;
  meshName: string; // for the mapping system
  geometry: THREE.BufferGeometry;
  color: string;
  description: string;
  clinical: string;
  relatedModules: string[];
}

// Classify a world-space vertex into a cortical region
function classifyVertex(x: number, y: number, z: number): string {
  // Hemisphere local coords + translation offset:
  // Y ranges roughly -48 to 77 (anterior=high, posterior=low)
  // Z ranges roughly -85 to -4 (dorsal=very negative, ventral=near 0)
  // X ranges roughly -40 to 10 (lateral=negative, medial=positive)

  const isLateral = x < -5;
  const isDorsal = z < -55;
  const isVentral = z > -30;
  const isAnterior = y > 30;
  const isMidAnterior = y > 10 && y <= 30;
  const isPosterior = y < -15;
  const isMidPosterior = y >= -15 && y <= 10;
  const isInferior = z > -40;

  // Occipital lobe — posterior ~20%
  if (isPosterior && y < -25) return 'occipital';

  // Motor cortex — narrow strip around Y=10-20, dorsal
  if (isMidAnterior && y > 15 && y <= 25 && isDorsal) return 'motor_cortex';

  // Somatosensory cortex — narrow strip around Y=5-15, dorsal
  if (isMidPosterior && y >= 5 && y <= 15 && isDorsal) return 'somatosensory';

  // Broca's area — inferior frontal, anterior, lateral
  if (isAnterior && isLateral && isInferior && !isDorsal) return 'broca';

  // Prefrontal cortex — anterior + dorsal (excluding Broca's)
  if (isAnterior) return 'prefrontal';

  // Wernicke's / posterior STG — lateral, mid-posterior, inferior
  if (isMidPosterior && isLateral && isInferior) return 'wernicke';

  // Anterior temporal — anterior-inferior, lateral
  if (isMidAnterior && isLateral && isVentral) return 'anterior_temporal';

  // Temporal lobe — lateral, inferior (catch-all for lateral-ventral)
  if (isLateral && isInferior) return 'temporal';

  // Parietal lobe — superior posterior (catch-all for dorsal posterior)
  if (isMidPosterior || (isPosterior && y >= -25)) return 'parietal';

  // Frontal (remaining mid-anterior)
  if (isMidAnterior) return 'frontal_other';

  return 'parietal'; // fallback
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
    description: 'The anterior portion of the frontal lobe — the seat of executive function, planning, decision-making, personality, and social behavior. The dorsolateral prefrontal cortex (dlPFC) handles working memory. The orbitofrontal cortex (OFC) links emotion to decisions. The most recently evolved cortical region in humans.',
    clinical: 'Damage causes dysexecutive syndrome: impaired planning, disinhibition, personality changes. The famous case of Phineas Gage — an iron rod through his prefrontal cortex changed his personality while leaving other functions intact. Prefrontal development continues until age ~25, explaining adolescent risk-taking.',
    relatedModules: ['executive', 'workingmem'],
  },
  motor_cortex: {
    name: 'Primary Motor Cortex',
    color: '#44dd88',
    description: 'The precentral gyrus — a strip of cortex just anterior to the central sulcus. Contains the motor homunculus: a distorted map of the body where hands, face, and tongue have disproportionately large representations (reflecting their fine motor demands). Sends commands directly to muscles via the corticospinal tract.',
    clinical: 'Damage causes contralateral weakness or paralysis (right motor cortex controls left body and vice versa). Stroke here is the most common cause of hemiplegia. The homuncular organization means a small stroke can selectively paralyze just the hand or just the face.',
    relatedModules: ['motor'],
  },
  somatosensory: {
    name: 'Somatosensory Cortex',
    color: '#4a9eff',
    description: 'The postcentral gyrus — just posterior to the central sulcus. Contains the sensory homunculus: a body map for touch, pressure, temperature, and proprioception. Like the motor cortex, hands, lips, and tongue are overrepresented. Processes the raw "feel" of the world.',
    clinical: 'Damage causes loss of sensation (numbness) on the opposite side of the body. Cortical sensory loss is more nuanced than peripheral — patients may lose the ability to identify objects by touch (astereognosis) while retaining basic sensation.',
    relatedModules: ['spatial'],
  },
  broca: {
    name: 'Broca\'s Area',
    color: '#ff5599',
    description: 'Located in the posterior inferior frontal gyrus (BA 44/45). Computes hierarchical grammatical structure for both speech production and comprehension. Also involved in action sequencing, music syntax, and sign language. Connected to Wernicke\'s area via the arcuate fasciculus.',
    clinical: 'Damage causes Broca\'s aphasia — non-fluent, telegraphic speech ("dog... bite... man") with relatively preserved comprehension of simple sentences. But complex syntax comprehension is also impaired, revealing its role in structure-building, not just production.',
    relatedModules: ['syntactic', 'phonological', 'motor'],
  },
  parietal: {
    name: 'Parietal Lobe',
    color: '#ffcc33',
    description: 'The posterior superior cortex between the central sulcus and occipital lobe. Contains the intraparietal sulcus (IPS) for numerical magnitude and spatial processing, the angular gyrus for semantic integration and reading, and the supramarginal gyrus for phonological processing. Integrates sensory information into spatial representations.',
    clinical: 'Right parietal damage causes hemispatial neglect — patients ignore the entire left side of space, not eating food from the left side of their plate, not dressing their left side. Left parietal damage causes Gerstmann syndrome: finger agnosia, left-right confusion, dyscalculia, dysgraphia.',
    relatedModules: ['spatial', 'phonological', 'semantic'],
  },
  wernicke: {
    name: 'Wernicke\'s Area',
    color: '#9b6dff',
    description: 'Located at the posterior superior temporal gyrus, near the junction with the parietal lobe. Critical for speech comprehension — maps acoustic speech signals onto phonological representations (sound patterns of words). Part of the ventral language stream (sound → meaning).',
    clinical: 'Damage causes Wernicke\'s aphasia — fluent but meaningless speech (word salad). Patients speak in well-formed sentences that make no sense and cannot understand spoken language. They are often unaware of their deficit, unlike Broca\'s patients who are painfully aware.',
    relatedModules: ['phonological', 'auditory', 'semantic'],
  },
  anterior_temporal: {
    name: 'Anterior Temporal Lobe',
    color: '#ff8844',
    description: 'The temporal pole — the brain\'s semantic hub (Patterson & Lambon Ralph\'s hub-and-spoke model). Integrates modality-specific features (what things look like, sound like, feel like) into unified, amodal concepts. This is where you know what a "dog" is — not just the word, but the full concept.',
    clinical: 'Progressive degeneration (semantic dementia / semantic variant PPA) causes gradual loss of conceptual knowledge: patients first lose specific concepts ("poodle") before general ones ("dog" before "animal"). They may not recognize common objects or understand common words.',
    relatedModules: ['semantic'],
  },
  temporal: {
    name: 'Temporal Lobe',
    color: '#00d4aa',
    description: 'The lateral temporal cortex below the Sylvian fissure. Superior temporal gyrus processes auditory input. Middle temporal gyrus handles semantic and visual processing. Inferior temporal gyrus specializes in complex object recognition (including the fusiform face area for face recognition).',
    clinical: 'Superior temporal damage impairs hearing and speech comprehension. Inferior temporal damage causes visual agnosia (inability to recognize objects by sight) or prosopagnosia (inability to recognize faces). The fusiform face area specifically handles face identity — damage makes all faces look the same.',
    relatedModules: ['auditory', 'semantic', 'visual'],
  },
  occipital: {
    name: 'Occipital Lobe',
    color: '#4a9eff',
    description: 'The most posterior lobe, entirely dedicated to vision. Contains V1 (primary visual cortex) which processes basic features (edges, orientation, color), V2 (contours and textures), V3 (form), V4 (color and form), and V5/MT (motion). Visual processing is hierarchical — each area builds on the previous.',
    clinical: 'V1 damage causes cortical blindness (the eyes work but the brain can\'t process the signals). Remarkably, some V1-blind patients show "blindsight" — they can navigate around obstacles they claim not to see, because subcortical visual pathways (superior colliculus) remain intact.',
    relatedModules: ['visual'],
  },
  frontal_other: {
    name: 'Frontal Association Cortex',
    color: '#ff7788',
    description: 'The lateral frontal cortex between the prefrontal and motor regions. Includes premotor cortex (movement planning and preparation), supplementary motor area (internally generated movement sequences), and frontal eye fields (voluntary eye movements and visual attention).',
    clinical: 'Premotor damage causes ideomotor apraxia — the inability to perform skilled movements on command despite intact comprehension and strength. Patients know what a hammer is for but can\'t pantomime using one. SMA damage specifically impairs internally initiated movement.',
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

  // Classify each vertex
  const vertexRegions: string[] = [];
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i) + tx;
    const y = posAttr.getY(i) + ty;
    const z = posAttr.getZ(i) + tz;
    vertexRegions.push(classifyVertex(x, y, z));
  }

  // Group triangles by majority vote of their 3 vertices
  const regionTriangles: Record<string, number[]> = {};
  for (let i = 0; i < indexAttr.count; i += 3) {
    const a = indexAttr.getX(i);
    const b = indexAttr.getX(i + 1);
    const c = indexAttr.getX(i + 2);

    // Majority vote
    const regions = [vertexRegions[a], vertexRegions[b], vertexRegions[c]];
    const counts: Record<string, number> = {};
    regions.forEach(r => { counts[r] = (counts[r] || 0) + 1; });
    const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

    if (!regionTriangles[winner]) regionTriangles[winner] = [];
    regionTriangles[winner].push(a, b, c);
  }

  // Create separate geometries for each region
  const results: CorticalRegion[] = [];

  for (const [regionId, indices] of Object.entries(regionTriangles)) {
    const config = regionConfigs[regionId];
    if (!config) continue;

    // Create new geometry with the same vertex data but only the region's triangles
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
