// Maps GLB mesh names from the Embodi3D brain model to cognitive module IDs.
// The GLB contains 28 individually named meshes, pre-assembled.

export type ModuleId =
  | 'visual' | 'auditory' | 'spatial' | 'phonological'
  | 'semantic' | 'syntactic' | 'workingmem' | 'executive'
  | 'motor' | 'emotional' | 'memory';

export interface MeshMapping {
  meshName: string;
  moduleId: ModuleId | null; // null = unmapped structure (rendered neutral)
  label: string;
}

export const meshMappings: MeshMapping[] = [
  // Deep structures mapped to cognitive modules
  { meshName: 'Amygdala1',                    moduleId: 'emotional',  label: 'Amygdala' },
  { meshName: 'Left_hippocampus1',            moduleId: 'memory',     label: 'Hippocampus' },
  { meshName: 'Left_insula',                  moduleId: 'emotional',  label: 'Insula' },
  { meshName: 'Cingulate_gyrus_right',        moduleId: 'executive',  label: 'Cingulate Gyrus (ACC)' },
  { meshName: 'Right_cerebellar_hemisphere1', moduleId: 'motor',      label: 'Cerebellum' },
  { meshName: 'Brain_stem55',                 moduleId: 'motor',      label: 'Brainstem' },
  { meshName: 'Hypothalamus_and_pituitary1',  moduleId: 'emotional',  label: 'Hypothalamus' },
  { meshName: 'Mammillary_bodies1',           moduleId: 'memory',     label: 'Mammillary Bodies' },
  { meshName: 'Right_thalamus',               moduleId: null,         label: 'Thalamus (lateral)' },
  { meshName: 'Right_thalamus1',              moduleId: null,         label: 'Thalamus (medial)' },

  // Basal ganglia — not directly mapped to a module
  { meshName: 'Caudate_nucleus1',             moduleId: null,         label: 'Caudate Nucleus' },
  { meshName: 'Left_putamen1',                moduleId: null,         label: 'Putamen' },
  { meshName: 'Left_globus_pallidus',         moduleId: null,         label: 'Globus Pallidus' },

  // White matter tracts — structural, not functional modules
  { meshName: 'Corpus_callosum2',             moduleId: null,         label: 'Corpus Callosum' },
  { meshName: 'Fornix_right',                 moduleId: null,         label: 'Fornix' },
  { meshName: 'Commissure_of_fornix1',        moduleId: null,         label: 'Commissure of Fornix' },
  { meshName: 'Anterior_commissure',          moduleId: null,         label: 'Anterior Commissure' },
  { meshName: 'Stria_terminalis4',            moduleId: null,         label: 'Stria Terminalis' },
  { meshName: 'Stria_Medullaris',             moduleId: null,         label: 'Stria Medullaris' },

  // Brainstem substructures
  { meshName: 'Pons',                         moduleId: 'motor',      label: 'Pons' },
  { meshName: 'Midbrain',                     moduleId: null,         label: 'Midbrain' },
  { meshName: 'Superior_colliculus',          moduleId: 'visual',     label: 'Superior Colliculus' },

  // Other structures
  { meshName: 'Ventricular_system',           moduleId: null,         label: 'Ventricular System' },
  { meshName: 'Pineal_gland1',               moduleId: null,         label: 'Pineal Gland' },
  { meshName: 'Optic_chiasm',                moduleId: 'visual',     label: 'Optic Chiasm' },
  { meshName: 'Right_choiroid_plexus1',       moduleId: null,         label: 'Choroid Plexus' },
  { meshName: 'Septum_pellucidum2',           moduleId: null,         label: 'Septum Pellucidum' },

  // Cortical surface — one transparent hemisphere
  { meshName: 'Right_Hemisphere_transparent', moduleId: null,         label: 'Cerebral Cortex' },
];

export function buildMeshLookup(): Map<string, MeshMapping> {
  const map = new Map<string, MeshMapping>();
  for (const m of meshMappings) map.set(m.meshName, m);
  return map;
}
