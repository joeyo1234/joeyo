// Maps GLB mesh names from the Embodi3D brain model to cognitive module IDs.
// The GLB contains 28 meshes (right side). Each is mirrored at runtime to create
// 56 total meshes. Mirrored meshes are prefixed with "Mirror_".

export type ModuleId =
  | 'visual' | 'auditory' | 'spatial' | 'phonological'
  | 'semantic' | 'syntactic' | 'workingmem' | 'executive'
  | 'motor' | 'emotional' | 'memory';

export interface MeshMapping {
  meshName: string;
  moduleId: ModuleId | null;
  label: string;
}

export const meshMappings: MeshMapping[] = [
  // ═══ RIGHT SIDE (original from GLB) ═══

  // Deep structures → cognitive modules
  { meshName: 'Amygdala1',                    moduleId: 'emotional',  label: 'R. Amygdala' },
  { meshName: 'Left_hippocampus1',            moduleId: 'memory',     label: 'R. Hippocampus' },
  { meshName: 'Left_insula',                  moduleId: 'emotional',  label: 'R. Insula' },
  { meshName: 'Cingulate_gyrus_right',        moduleId: 'executive',  label: 'R. Cingulate Gyrus' },
  { meshName: 'Right_cerebellar_hemisphere1', moduleId: 'motor',      label: 'R. Cerebellum' },
  { meshName: 'Brain_stem55',                 moduleId: 'motor',      label: 'Brainstem' },
  { meshName: 'Hypothalamus_and_pituitary1',  moduleId: 'emotional',  label: 'Hypothalamus' },
  { meshName: 'Mammillary_bodies1',           moduleId: 'memory',     label: 'Mammillary Bodies' },
  { meshName: 'Right_thalamus',               moduleId: null,         label: 'R. Thalamus' },
  { meshName: 'Right_thalamus1',              moduleId: null,         label: 'R. Thalamus (med.)' },

  // Basal ganglia
  { meshName: 'Caudate_nucleus1',             moduleId: null,         label: 'R. Caudate' },
  { meshName: 'Left_putamen1',                moduleId: null,         label: 'R. Putamen' },
  { meshName: 'Left_globus_pallidus',         moduleId: null,         label: 'R. Globus Pallidus' },

  // White matter tracts
  { meshName: 'Corpus_callosum2',             moduleId: null,         label: 'Corpus Callosum' },
  { meshName: 'Fornix_right',                 moduleId: null,         label: 'R. Fornix' },
  { meshName: 'Commissure_of_fornix1',        moduleId: null,         label: 'Fornix Commissure' },
  { meshName: 'Anterior_commissure',          moduleId: null,         label: 'Ant. Commissure' },
  { meshName: 'Stria_terminalis4',            moduleId: null,         label: 'R. Stria Terminalis' },
  { meshName: 'Stria_Medullaris',             moduleId: null,         label: 'R. Stria Medullaris' },

  // Brainstem substructures
  { meshName: 'Pons',                         moduleId: 'motor',      label: 'Pons' },
  { meshName: 'Midbrain',                     moduleId: null,         label: 'Midbrain' },
  { meshName: 'Superior_colliculus',          moduleId: 'visual',     label: 'Superior Colliculus' },

  // Other
  { meshName: 'Ventricular_system',           moduleId: null,         label: 'Ventricles' },
  { meshName: 'Pineal_gland1',               moduleId: null,         label: 'Pineal Gland' },
  { meshName: 'Optic_chiasm',                moduleId: 'visual',     label: 'Optic Chiasm' },
  { meshName: 'Right_choiroid_plexus1',       moduleId: null,         label: 'R. Choroid Plexus' },
  { meshName: 'Septum_pellucidum2',           moduleId: null,         label: 'Septum Pellucidum' },

  // Cortical surface
  { meshName: 'Right_Hemisphere_transparent', moduleId: null,         label: 'R. Cerebral Cortex' },

  // ═══ LEFT SIDE (mirrored at runtime, prefix "Mirror_") ═══

  { meshName: 'Mirror_Amygdala1',                    moduleId: 'emotional',  label: 'L. Amygdala' },
  { meshName: 'Mirror_Left_hippocampus1',            moduleId: 'memory',     label: 'L. Hippocampus' },
  { meshName: 'Mirror_Left_insula',                  moduleId: 'emotional',  label: 'L. Insula' },
  { meshName: 'Mirror_Cingulate_gyrus_right',        moduleId: 'executive',  label: 'L. Cingulate Gyrus' },
  { meshName: 'Mirror_Right_cerebellar_hemisphere1', moduleId: 'motor',      label: 'L. Cerebellum' },
  { meshName: 'Mirror_Brain_stem55',                 moduleId: 'motor',      label: 'Brainstem (mirror)' },
  { meshName: 'Mirror_Hypothalamus_and_pituitary1',  moduleId: 'emotional',  label: 'Hypothalamus (mirror)' },
  { meshName: 'Mirror_Mammillary_bodies1',           moduleId: 'memory',     label: 'Mammillary Bodies (mirror)' },
  { meshName: 'Mirror_Right_thalamus',               moduleId: null,         label: 'L. Thalamus' },
  { meshName: 'Mirror_Right_thalamus1',              moduleId: null,         label: 'L. Thalamus (med.)' },

  { meshName: 'Mirror_Caudate_nucleus1',             moduleId: null,         label: 'L. Caudate' },
  { meshName: 'Mirror_Left_putamen1',                moduleId: null,         label: 'L. Putamen' },
  { meshName: 'Mirror_Left_globus_pallidus',         moduleId: null,         label: 'L. Globus Pallidus' },

  { meshName: 'Mirror_Corpus_callosum2',             moduleId: null,         label: 'Corpus Callosum (mirror)' },
  { meshName: 'Mirror_Fornix_right',                 moduleId: null,         label: 'L. Fornix' },
  { meshName: 'Mirror_Commissure_of_fornix1',        moduleId: null,         label: 'Fornix Commissure (mirror)' },
  { meshName: 'Mirror_Anterior_commissure',          moduleId: null,         label: 'Ant. Commissure (mirror)' },
  { meshName: 'Mirror_Stria_terminalis4',            moduleId: null,         label: 'L. Stria Terminalis' },
  { meshName: 'Mirror_Stria_Medullaris',             moduleId: null,         label: 'L. Stria Medullaris' },

  { meshName: 'Mirror_Pons',                         moduleId: 'motor',      label: 'Pons (mirror)' },
  { meshName: 'Mirror_Midbrain',                     moduleId: null,         label: 'Midbrain (mirror)' },
  { meshName: 'Mirror_Superior_colliculus',          moduleId: 'visual',     label: 'Superior Colliculus (mirror)' },

  { meshName: 'Mirror_Ventricular_system',           moduleId: null,         label: 'Ventricles (mirror)' },
  { meshName: 'Mirror_Pineal_gland1',               moduleId: null,         label: 'Pineal Gland (mirror)' },
  { meshName: 'Mirror_Optic_chiasm',                moduleId: 'visual',     label: 'Optic Chiasm (mirror)' },
  { meshName: 'Mirror_Right_choiroid_plexus1',       moduleId: null,         label: 'L. Choroid Plexus' },
  { meshName: 'Mirror_Septum_pellucidum2',           moduleId: null,         label: 'Septum Pellucidum (mirror)' },

  { meshName: 'Mirror_Right_Hemisphere_transparent', moduleId: null,         label: 'L. Cerebral Cortex' },
];

export function buildMeshLookup(): Map<string, MeshMapping> {
  const map = new Map<string, MeshMapping>();
  for (const m of meshMappings) map.set(m.meshName, m);
  return map;
}
