// Each brain structure is its own entity with detailed information.
// Structures are independent from the cognitive modules in the flow diagram,
// but cross-reference which modules they support.

export interface BrainStructure {
  meshName: string;          // GLB mesh name
  name: string;              // Display name
  category: 'deep' | 'cortical' | 'basal-ganglia' | 'white-matter' | 'brainstem' | 'other';
  description: string;       // What it does
  clinical: string;          // What happens when it's damaged
  relatedModules: string[];  // Which cognitive modules it participates in (cross-reference, not mapping)
  color: string;             // Display color for this structure
}

export const brainStructures: Record<string, BrainStructure> = {
  Amygdala1: {
    meshName: 'Amygdala1',
    name: 'Amygdala',
    category: 'deep',
    description: 'Almond-shaped nucleus in the medial temporal lobe. Rapidly evaluates the emotional significance and threat level of stimuli — it can trigger fear responses before conscious awareness via a fast subcortical route (thalamus → amygdala, bypassing cortex). Also involved in positive emotions, social evaluation, and emotional memory encoding. Sends widespread projections to cortex, hypothalamus, and brainstem.',
    clinical: 'Bilateral damage (Urbach-Wiethe disease) eliminates fear responses — patients approach snakes, don\'t flinch at threats. Overactivity is implicated in anxiety disorders, PTSD (exaggerated threat detection), and phobias. Amygdala-prefrontal connectivity is a key target in anxiety treatment.',
    relatedModules: ['emotional', 'memory', 'executive'],
    color: '#ff5599',
  },
  Left_hippocampus1: {
    meshName: 'Left_hippocampus1',
    name: 'Hippocampus',
    category: 'deep',
    description: 'Seahorse-shaped structure in the medial temporal lobe. The brain\'s memory encoding engine — binds disparate cortical representations (sights, sounds, emotions, context) into coherent episodic memories. Contains place cells (fire at specific locations) and is connected to entorhinal grid cells (metric coordinate system). Also critical for spatial navigation, imagination of future events, and creative recombination of memories.',
    clinical: 'Bilateral damage causes anterograde amnesia — inability to form new episodic memories (Henry Molaison / H.M.). Procedural memory and short-term memory remain intact, proving these are separate systems. Hippocampal atrophy is the earliest structural marker of Alzheimer\'s disease. London taxi drivers show enlarged posterior hippocampi.',
    relatedModules: ['memory', 'spatial', 'semantic', 'emotional'],
    color: '#9b6dff',
  },
  Left_insula: {
    meshName: 'Left_insula',
    name: 'Insula',
    category: 'deep',
    description: 'Hidden cortical region buried deep in the lateral sulcus. The brain\'s interoceptive hub — processes internal body signals: heartbeat awareness, breathing, gut feelings, pain, temperature, hunger, thirst. Also involved in empathy (feeling others\' pain), disgust recognition, and subjective emotional experience. Critical for the sense of embodied self.',
    clinical: 'Damage impairs recognition of disgust in facial expressions and reduces empathy for others\' pain. Insula dysfunction is implicated in eating disorders (disrupted interoception), addiction (craving signals), and alexithymia (inability to identify one\'s own emotions). Experienced meditators show increased insula cortical thickness.',
    relatedModules: ['emotional', 'executive', 'workingmem'],
    color: '#ff5599',
  },
  Cingulate_gyrus_right: {
    meshName: 'Cingulate_gyrus_right',
    name: 'Cingulate Gyrus',
    category: 'deep',
    description: 'C-shaped structure wrapping around the corpus callosum. The anterior portion (ACC) is the brain\'s conflict monitor and error detector — it fires when things aren\'t going as planned, when you need to override automatic behavior, or when competing responses conflict. The posterior portion is part of the default mode network (self-referential thinking, mind-wandering). Connects emotional and cognitive processing.',
    clinical: 'ACC damage causes apathy, reduced motivation, and failure to correct errors. ACC hyperactivity is a reliable finding in OCD (chronic "something is wrong" signal). The ACC is a key target for deep brain stimulation in treatment-resistant depression. Posterior cingulate deactivation is the signature of meditation and flow states.',
    relatedModules: ['executive', 'emotional', 'workingmem'],
    color: '#ff4466',
  },
  Right_cerebellar_hemisphere1: {
    meshName: 'Right_cerebellar_hemisphere1',
    name: 'Cerebellum',
    category: 'brainstem',
    description: 'Contains more neurons than the entire rest of the brain combined. Traditionally known for motor coordination and timing, but now understood to contribute to language processing, working memory, emotional regulation, and cognitive prediction. Builds internal "forward models" that predict the sensory consequences of actions — the basis of motor learning and automaticity.',
    clinical: 'Damage causes ataxia (clumsy, uncoordinated movement), dysarthria (slurred speech), and intention tremor. Cerebellar cognitive affective syndrome: executive dysfunction, spatial problems, personality changes, and language difficulties — revealing its role far beyond motor control.',
    relatedModules: ['motor', 'workingmem', 'phonological'],
    color: '#44dd88',
  },
  Brain_stem55: {
    meshName: 'Brain_stem55',
    name: 'Brainstem',
    category: 'brainstem',
    description: 'The most primitive part of the brain, controlling functions essential for survival. Regulates breathing, heart rate, blood pressure, swallowing, and consciousness/arousal. Contains nuclei for cranial nerves (facial sensation, eye movement, hearing). The reticular activating system here maintains wakefulness — damage causes coma.',
    clinical: 'Brainstem stroke can cause "locked-in syndrome" — complete paralysis with preserved consciousness. The patient is aware but cannot move or speak, communicating only through eye blinks. Brainstem death is the legal definition of death in most jurisdictions.',
    relatedModules: ['motor'],
    color: '#44dd88',
  },
  Hypothalamus_and_pituitary1: {
    meshName: 'Hypothalamus_and_pituitary1',
    name: 'Hypothalamus & Pituitary',
    category: 'deep',
    description: 'Despite being only ~1% of brain volume, the hypothalamus controls the body\'s hormonal system via the pituitary gland — the "master gland." Regulates hunger, thirst, body temperature, circadian rhythm, sexual behavior, and the fight-or-flight response. Receives input from the amygdala for emotional activation and from internal sensors monitoring blood chemistry.',
    clinical: 'Damage disrupts basic homeostasis: uncontrolled eating or starvation, inability to regulate body temperature, disrupted sleep-wake cycles, and hormonal imbalances affecting growth, reproduction, and stress responses. Hypothalamic-pituitary-adrenal (HPA) axis dysregulation is central to chronic stress and depression.',
    relatedModules: ['emotional', 'motor'],
    color: '#ff5599',
  },
  Mammillary_bodies1: {
    meshName: 'Mammillary_bodies1',
    name: 'Mammillary Bodies',
    category: 'deep',
    description: 'Small paired structures at the base of the brain, part of the Papez circuit for memory. Receive input from the hippocampus via the fornix and project to the anterior thalamus. Involved in spatial memory and head-direction sensing — part of the brain\'s internal compass system.',
    clinical: 'Damage (typically from thiamine deficiency in chronic alcoholism) causes Korsakoff\'s syndrome — severe anterograde amnesia with confabulation (making up memories to fill gaps). Patients cannot form new memories and may not recognize their own doctors from day to day.',
    relatedModules: ['memory', 'spatial'],
    color: '#9b6dff',
  },
  Right_thalamus: {
    meshName: 'Right_thalamus',
    name: 'Thalamus',
    category: 'deep',
    description: 'The brain\'s central relay station. Almost ALL sensory information (except smell) passes through the thalamus before reaching the cerebral cortex. It doesn\'t just relay — it actively filters and prioritizes signals, amplifying what\'s relevant and suppressing what\'s not. Also critical for consciousness, attention, and sleep regulation (thalamic reticular nucleus generates sleep spindles).',
    clinical: 'Thalamic stroke can cause a wide range of deficits depending on which nuclei are affected: sensory loss, movement disorders, memory impairment, or even "thalamic pain syndrome" — excruciating pain from ordinary touch. Fatal familial insomnia is a prion disease that destroys the thalamus, causing progressive inability to sleep, then death.',
    relatedModules: ['visual', 'auditory', 'spatial', 'executive'],
    color: '#888',
  },
  Right_thalamus1: {
    meshName: 'Right_thalamus1',
    name: 'Thalamus (medial nuclei)',
    category: 'deep',
    description: 'The medial thalamic nuclei are involved in memory, emotion, and arousal rather than sensory relay. The mediodorsal nucleus connects to the prefrontal cortex and is critical for working memory and executive function. The pulvinar (largest thalamic nucleus) integrates visual attention signals.',
    clinical: 'Mediodorsal nucleus damage impairs working memory and decision-making, similar to prefrontal damage. Pulvinar lesions cause visual attention deficits — difficulty filtering relevant from irrelevant visual information.',
    relatedModules: ['workingmem', 'executive', 'visual'],
    color: '#888',
  },
  Caudate_nucleus1: {
    meshName: 'Caudate_nucleus1',
    name: 'Caudate Nucleus',
    category: 'basal-ganglia',
    description: 'Part of the striatum (basal ganglia). Involved in reward-based learning, habit formation, and goal-directed behavior. Receives massive dopaminergic input from the substantia nigra. Plays a role in the cognitive loop — connecting prefrontal cortex goals to action selection. Also involved in language processing and spatial memory.',
    clinical: 'Caudate hyperactivity is implicated in OCD — compulsive checking may result from a caudate that can\'t properly "gate" completed actions. Caudate atrophy occurs in Huntington\'s disease, causing progressive movement disorders and cognitive decline.',
    relatedModules: ['executive', 'motor', 'memory'],
    color: '#888',
  },
  Left_putamen1: {
    meshName: 'Left_putamen1',
    name: 'Putamen',
    category: 'basal-ganglia',
    description: 'The largest structure in the basal ganglia. Primary role in motor planning and movement initiation — receives cortical motor signals and helps select and execute the right movement pattern. Also involved in various types of learning, particularly motor learning (skill acquisition) and reinforcement learning.',
    clinical: 'Putamen degeneration is the primary site of damage in Parkinson\'s disease — loss of dopaminergic input causes tremor, rigidity, and difficulty initiating movement. Putamen hemorrhage (stroke) is the most common location for hypertensive brain bleeds.',
    relatedModules: ['motor', 'memory'],
    color: '#888',
  },
  Left_globus_pallidus: {
    meshName: 'Left_globus_pallidus',
    name: 'Globus Pallidus',
    category: 'basal-ganglia',
    description: 'The output gateway of the basal ganglia. Normally inhibits the thalamus — when the striatum (caudate + putamen) signals "go," it releases the globus pallidus\'s inhibition, allowing movement. This double-negative gating mechanism (inhibiting an inhibitor) is how the brain selects which movements to execute and which to suppress.',
    clinical: 'Dysfunction contributes to dystonia (involuntary muscle contractions) and is a target for deep brain stimulation in Parkinson\'s disease. Damage can cause hemiballismus — wild, involuntary flinging movements of the limbs.',
    relatedModules: ['motor', 'executive'],
    color: '#888',
  },
  Corpus_callosum2: {
    meshName: 'Corpus_callosum2',
    name: 'Corpus Callosum',
    category: 'white-matter',
    description: 'The largest white matter structure in the brain — approximately 200 million axons connecting the left and right hemispheres. Enables the two halves of the brain to share information and coordinate. Different sections connect different cortical areas: anterior connects prefrontal regions, posterior connects visual areas.',
    clinical: 'Surgical severing (callosotomy, the "split-brain" procedure for epilepsy) produces remarkable effects: the left hand literally doesn\'t know what the right hand is doing. Patients can name an object in their right visual field but not their left, revealing the independence of the two hemispheres. Sperry\'s split-brain research won the Nobel Prize.',
    relatedModules: ['executive', 'visual', 'motor'],
    color: '#888',
  },
  Fornix_right: {
    meshName: 'Fornix_right',
    name: 'Fornix',
    category: 'white-matter',
    description: 'The main output tract of the hippocampus — a C-shaped bundle of axons carrying memory signals from the hippocampus to the mammillary bodies, anterior thalamus, and hypothalamus. Part of the Papez circuit for memory. The brain\'s "memory highway."',
    clinical: 'Fornix damage causes severe amnesia — similar to hippocampal damage but specifically disrupting the output pathway. Can occur from tumors, surgery, or traumatic brain injury. Fornix integrity (measured by DTI imaging) is a biomarker for Alzheimer\'s disease progression.',
    relatedModules: ['memory'],
    color: '#888',
  },
  Commissure_of_fornix1: {
    meshName: 'Commissure_of_fornix1',
    name: 'Hippocampal Commissure',
    category: 'white-matter',
    description: 'Where fibers from the left and right fornix cross between hemispheres. Allows the two hippocampi to communicate and coordinate memory encoding. Much smaller than the corpus callosum but functionally important for bilateral memory processes.',
    clinical: 'Isolated damage is rare but contributes to memory deficits when the fornix system is compromised.',
    relatedModules: ['memory'],
    color: '#888',
  },
  Anterior_commissure: {
    meshName: 'Anterior_commissure',
    name: 'Anterior Commissure',
    category: 'white-matter',
    description: 'A smaller bridge between hemispheres, primarily connecting the temporal lobes. Carries olfactory information and emotional/social signals between the two sides. Evolutionarily older than the corpus callosum — present in all mammals.',
    clinical: 'Can partially compensate when the corpus callosum is damaged. In split-brain patients, some emotional information can still cross between hemispheres via the anterior commissure.',
    relatedModules: ['emotional', 'semantic'],
    color: '#888',
  },
  Stria_terminalis4: {
    meshName: 'Stria_terminalis4',
    name: 'Stria Terminalis',
    category: 'white-matter',
    description: 'The primary output pathway from the amygdala to the hypothalamus and septal area. Carries sustained anxiety and stress signals — while the amygdala\'s direct projections handle fast fear responses, the stria terminalis mediates the slower, longer-lasting anxiety state. The "anxiety highway."',
    clinical: 'The bed nucleus of the stria terminalis (BNST) is a key node in anxiety disorders — it maintains the sustained state of apprehension and hypervigilance that characterizes generalized anxiety, distinct from the acute fear response.',
    relatedModules: ['emotional', 'executive'],
    color: '#888',
  },
  Stria_Medullaris: {
    meshName: 'Stria_Medullaris',
    name: 'Stria Medullaris',
    category: 'white-matter',
    description: 'Connects the septal area and lateral preoptic area to the habenula. The habenula is now recognized as a critical "anti-reward" center — it encodes disappointment and negative prediction errors, the neural signal for "that was worse than expected."',
    clinical: 'Habenula hyperactivity (driven by stria medullaris input) is implicated in depression — the brain\'s disappointment signal is chronically elevated. The habenula is an emerging target for deep brain stimulation in treatment-resistant depression.',
    relatedModules: ['emotional'],
    color: '#888',
  },
  Pons: {
    meshName: 'Pons',
    name: 'Pons',
    category: 'brainstem',
    description: 'Latin for "bridge" — sits between the midbrain and medulla, relaying signals between the cerebral cortex and cerebellum. Contains nuclei for facial sensation (trigeminal nerve), facial movement, eye movement, and hearing. The pontine reticular formation generates REM sleep — this is where dreams originate at the hardware level.',
    clinical: 'Pontine stroke can cause devastating deficits including locked-in syndrome (if affecting ventral pons) or disruption of REM sleep. Central pontine myelinolysis (from rapid correction of low sodium) destroys pontine myelin, causing quadriplegia and cognitive impairment.',
    relatedModules: ['motor', 'auditory'],
    color: '#44dd88',
  },
  Midbrain: {
    meshName: 'Midbrain',
    name: 'Midbrain',
    category: 'brainstem',
    description: 'Contains the substantia nigra (source of dopamine for the basal ganglia), the red nucleus (motor control), the periaqueductal gray (pain modulation and defensive behavior), and the ventral tegmental area (VTA — source of dopamine for the reward system and prefrontal cortex). A small structure with outsized influence on movement, reward, and pain.',
    clinical: 'Substantia nigra degeneration causes Parkinson\'s disease. VTA dysfunction is central to addiction (hijacked reward signals) and depression (blunted reward). Periaqueductal gray is the target of opioid pain relief — endorphins and morphine both act here.',
    relatedModules: ['motor', 'emotional', 'executive'],
    color: '#888',
  },
  Superior_colliculus: {
    meshName: 'Superior_colliculus',
    name: 'Superior Colliculus',
    category: 'brainstem',
    description: 'A layered structure on top of the midbrain that controls rapid eye movements (saccades) and visual orienting. Receives direct retinal input and creates a "map" of visual space. Critically, it provides the fast subcortical route to the amygdala — visual threat information reaches the amygdala via superior colliculus → pulvinar → amygdala in ~12ms, before the cortex has finished processing.',
    clinical: 'Damage impairs the ability to rapidly orient toward visual stimuli. The superior colliculus is why you flinch at something in your peripheral vision before you consciously see it — it\'s part of the brain\'s early warning system.',
    relatedModules: ['visual', 'emotional', 'motor'],
    color: '#4a9eff',
  },
  Ventricular_system: {
    meshName: 'Ventricular_system',
    name: 'Ventricular System',
    category: 'other',
    description: 'A network of fluid-filled cavities (lateral ventricles, third ventricle, fourth ventricle) that produce and circulate cerebrospinal fluid (CSF). CSF cushions the brain, removes metabolic waste, and transports hormones. The glymphatic system clears toxins during sleep via CSF flow — this is one reason sleep is essential for brain health.',
    clinical: 'Ventricular enlargement is a marker of brain atrophy in Alzheimer\'s and schizophrenia. Hydrocephalus (excess CSF) increases intracranial pressure, causing headaches, cognitive decline, and eventually brain damage if untreated. "Normal pressure hydrocephalus" in the elderly causes dementia, urinary incontinence, and gait disturbance — one of the few treatable causes of dementia.',
    relatedModules: [],
    color: '#888',
  },
  Pineal_gland1: {
    meshName: 'Pineal_gland1',
    name: 'Pineal Gland',
    category: 'other',
    description: 'Small endocrine gland that produces melatonin, the hormone that regulates circadian rhythm (sleep-wake cycle). Light detected by the retina inhibits melatonin production; darkness triggers it. Descartes famously (and incorrectly) proposed it as the "seat of the soul" — the interface between mind and body.',
    clinical: 'Pineal tumors can disrupt melatonin production, causing severe sleep disorders. Melatonin supplements are used for jet lag and circadian rhythm disorders. Calcification of the pineal gland increases with age and may contribute to age-related sleep deterioration.',
    relatedModules: [],
    color: '#888',
  },
  Optic_chiasm: {
    meshName: 'Optic_chiasm',
    name: 'Optic Chiasm',
    category: 'other',
    description: 'The X-shaped crossing point where the optic nerves partially cross. Fibers from the nasal (inner) half of each retina cross to the opposite side, while temporal (outer) fibers stay on the same side. This means each hemisphere receives visual information from the opposite visual field — a fundamental organizational principle of the visual system.',
    clinical: 'Pituitary tumors pressing on the optic chiasm cause bitemporal hemianopia — loss of peripheral vision in both eyes (tunnel vision). The specific pattern of visual field loss reveals exactly where in the visual pathway the damage is located, making it a powerful diagnostic tool.',
    relatedModules: ['visual'],
    color: '#4a9eff',
  },
  Right_choiroid_plexus1: {
    meshName: 'Right_choiroid_plexus1',
    name: 'Choroid Plexus',
    category: 'other',
    description: 'Vascular tissue lining the ventricles that produces cerebrospinal fluid at a rate of about 500ml per day. Also forms part of the blood-CSF barrier, filtering blood to create a clean fluid environment for the brain. Emerging research suggests it plays a role in immune surveillance of the brain.',
    clinical: 'Choroid plexus tumors (papillomas) can cause overproduction of CSF, leading to hydrocephalus. Choroid plexus calcification is normal with aging but increased calcification has been associated with neurodegenerative diseases.',
    relatedModules: [],
    color: '#888',
  },
  Septum_pellucidum2: {
    meshName: 'Septum_pellucidum2',
    name: 'Septum Pellucidum',
    category: 'other',
    description: 'A thin, two-layered membrane separating the lateral ventricles. Contains the septal nuclei, which are part of the reward system and connect to the hippocampus and hypothalamus. The septum modulates the hippocampus\'s theta rhythm, which is critical for memory encoding.',
    clinical: 'A "cavum septum pellucidum" (fluid-filled gap between the layers) is found at higher rates in boxers, football players, and others with repeated head trauma. It\'s considered a marker of chronic traumatic encephalopathy (CTE).',
    relatedModules: ['memory', 'emotional'],
    color: '#888',
  },
  // Cortical regions (split from hemisphere at runtime)
  cortex_prefrontal: {
    meshName: 'cortex_prefrontal',
    name: 'Prefrontal Cortex',
    category: 'cortical',
    description: 'The anterior frontal lobe — seat of executive function, planning, decision-making, personality, and social behavior. The dorsolateral prefrontal cortex (dlPFC) handles working memory. The orbitofrontal cortex (OFC) links emotion to decisions. The most recently evolved cortical region.',
    clinical: 'Damage causes dysexecutive syndrome: impaired planning, disinhibition, personality changes. Phineas Gage\'s iron rod through his prefrontal cortex changed his personality while leaving other functions intact. Prefrontal development continues until age ~25.',
    relatedModules: ['executive', 'workingmem'],
    color: '#ff4466',
  },
  cortex_motor_cortex: {
    meshName: 'cortex_motor_cortex',
    name: 'Primary Motor Cortex',
    category: 'cortical',
    description: 'The precentral gyrus — a strip just anterior to the central sulcus. Contains the motor homunculus: hands, face, and tongue have disproportionately large representations. Sends commands directly to muscles via the corticospinal tract.',
    clinical: 'Damage causes contralateral weakness or paralysis. Stroke here is the most common cause of hemiplegia. The homuncular organization means a small stroke can selectively paralyze just the hand or face.',
    relatedModules: ['motor'],
    color: '#44dd88',
  },
  cortex_somatosensory: {
    meshName: 'cortex_somatosensory',
    name: 'Somatosensory Cortex',
    category: 'cortical',
    description: 'The postcentral gyrus — just posterior to the central sulcus. Contains the sensory homunculus for touch, pressure, temperature, and proprioception. Hands, lips, and tongue are overrepresented.',
    clinical: 'Damage causes loss of sensation on the opposite side. Patients may lose the ability to identify objects by touch (astereognosis) while retaining basic sensation.',
    relatedModules: ['spatial'],
    color: '#4a9eff',
  },
  cortex_broca: {
    meshName: 'cortex_broca',
    name: 'Broca\'s Area',
    category: 'cortical',
    description: 'Posterior inferior frontal gyrus (BA 44/45). Computes hierarchical grammatical structure for both speech production and comprehension. Connected to Wernicke\'s area via the arcuate fasciculus.',
    clinical: 'Damage causes Broca\'s aphasia — non-fluent, telegraphic speech ("dog... bite... man") with relatively preserved comprehension of simple sentences.',
    relatedModules: ['syntactic', 'phonological', 'motor'],
    color: '#ff5599',
  },
  cortex_parietal: {
    meshName: 'cortex_parietal',
    name: 'Parietal Lobe',
    category: 'cortical',
    description: 'Contains the intraparietal sulcus (IPS) for numerical magnitude and spatial processing, the angular gyrus for semantic integration and reading, and the supramarginal gyrus for phonological processing.',
    clinical: 'Right parietal damage causes hemispatial neglect. Left parietal damage causes Gerstmann syndrome: finger agnosia, left-right confusion, dyscalculia, dysgraphia.',
    relatedModules: ['spatial', 'phonological', 'semantic'],
    color: '#ffcc33',
  },
  cortex_wernicke: {
    meshName: 'cortex_wernicke',
    name: 'Wernicke\'s Area',
    category: 'cortical',
    description: 'Posterior superior temporal gyrus, near the temporo-parietal junction. Maps acoustic speech signals onto phonological representations. Part of the ventral language stream (sound → meaning).',
    clinical: 'Damage causes Wernicke\'s aphasia — fluent but meaningless speech. Patients speak in well-formed sentences that make no sense and cannot understand spoken language.',
    relatedModules: ['phonological', 'auditory', 'semantic'],
    color: '#9b6dff',
  },
  cortex_anterior_temporal: {
    meshName: 'cortex_anterior_temporal',
    name: 'Anterior Temporal Lobe',
    category: 'cortical',
    description: 'The temporal pole — the brain\'s semantic hub (Patterson & Lambon Ralph). Integrates modality-specific features into unified, amodal concepts. Where you know what a "dog" is.',
    clinical: 'Semantic dementia causes gradual loss of conceptual knowledge: patients first lose specific concepts ("poodle") before general ones ("animal").',
    relatedModules: ['semantic'],
    color: '#ff8844',
  },
  cortex_temporal: {
    meshName: 'cortex_temporal',
    name: 'Temporal Lobe',
    category: 'cortical',
    description: 'Superior temporal gyrus processes auditory input. Middle temporal handles semantic processing. Inferior temporal specializes in object recognition including the fusiform face area.',
    clinical: 'Superior temporal damage impairs hearing and speech comprehension. Inferior temporal damage causes visual agnosia or prosopagnosia (face blindness).',
    relatedModules: ['auditory', 'semantic', 'visual'],
    color: '#00d4aa',
  },
  cortex_occipital: {
    meshName: 'cortex_occipital',
    name: 'Occipital Lobe',
    category: 'cortical',
    description: 'Entirely dedicated to vision. V1 (edges, orientation), V2 (contours), V3 (form), V4 (color), V5/MT (motion). Hierarchical processing — each area builds on the previous.',
    clinical: 'V1 damage causes cortical blindness. Some patients show "blindsight" — navigating obstacles they claim not to see, because subcortical visual pathways remain intact.',
    relatedModules: ['visual'],
    color: '#4a9eff',
  },
  cortex_frontal_other: {
    meshName: 'cortex_frontal_other',
    name: 'Premotor & Frontal Association',
    category: 'cortical',
    description: 'Premotor cortex (movement planning), supplementary motor area (internally generated sequences), and frontal eye fields (voluntary eye movements and visual attention).',
    clinical: 'Premotor damage causes ideomotor apraxia — inability to perform skilled movements on command despite intact comprehension and strength.',
    relatedModules: ['motor', 'executive', 'spatial'],
    color: '#ff7788',
  },
};

// Which structures activate for each task.
// Synced with the flow diagram descriptions in data.ts.
// Includes structures mentioned in descriptions PLUS neuroscientifically valid
// additions (e.g. thalamus as relay for sensory tasks, basal ganglia for motor tasks).
export const taskStructureActivations: Record<string, string[]> = {
  reading: [
    'cortex_occipital',           // Visual cortex (V1-V5) — orthographic analysis
    'cortex_wernicke',            // Posterior STG — sublexical phonological route
    'cortex_anterior_temporal',   // Anterior temporal — lexical/semantic route
    'cortex_broca',               // Broca's area — syntactic structure
    'cortex_parietal',            // Angular gyrus — reading integration
    'cortex_prefrontal',          // dlPFC — working memory
    'Cingulate_gyrus_right',      // ACC — comprehension monitoring
    'Left_hippocampus1',          // Hippocampus — world knowledge retrieval
    'Right_thalamus',             // Thalamus — visual relay (LGN)
  ],
  speech: [
    'cortex_anterior_temporal',   // Semantic network — conceptual intent
    'cortex_broca',               // Broca's area — grammatical encoding
    'cortex_wernicke',            // Posterior STG — phonological encoding
    'cortex_motor_cortex',        // M1 — articulation
    'cortex_prefrontal',          // dlPFC — working memory
    'cortex_temporal',            // Auditory cortex — self-monitoring feedback
    'Cingulate_gyrus_right',      // ACC — executive control
    'Left_hippocampus1',          // Hippocampus — knowledge retrieval
    'Right_cerebellar_hemisphere1', // Cerebellum — motor timing
    'Right_thalamus',             // Thalamus — motor relay
  ],
  math: [
    'cortex_occipital',           // Visual cortex — symbol recognition
    'cortex_parietal',            // IPS — magnitude, number line
    'cortex_anterior_temporal',   // Semantic — math fact retrieval
    'cortex_wernicke',            // Phonological loop — verbal rehearsal
    'cortex_prefrontal',          // dlPFC — working memory
    'cortex_motor_cortex',        // Motor — writing the answer
    'Cingulate_gyrus_right',      // ACC — sequencing operations
    'Left_hippocampus1',          // Hippocampus — stored procedures
  ],
  listening: [
    'cortex_temporal',            // Auditory cortex (A1, STG)
    'cortex_wernicke',            // Posterior STG — phonological decoding
    'cortex_broca',               // Broca's — syntactic parsing
    'cortex_anterior_temporal',   // Anterior temporal — meaning
    'cortex_prefrontal',          // dlPFC — working memory
    'Cingulate_gyrus_right',      // ACC — comprehension monitoring
    'Left_hippocampus1',          // Hippocampus — context retrieval
    'Amygdala1',                  // Amygdala — emotional prosody
    'Left_insula',                // Insula — emotional prosody
    'Right_thalamus',             // Thalamus — auditory relay (MGN)
  ],
  writing: [
    'cortex_occipital',           // Visual cortex — reading prompt + review loop
    'cortex_broca',               // Broca's — grammatical encoding
    'cortex_wernicke',            // Phonological — spelling
    'cortex_motor_cortex',        // Motor — handwriting/typing
    'cortex_prefrontal',          // dlPFC — working memory + planning
    'cortex_anterior_temporal',   // Semantic — content generation
    'Cingulate_gyrus_right',      // ACC — executive, error monitoring
    'Left_hippocampus1',          // Hippocampus — knowledge retrieval
    'Right_cerebellar_hemisphere1', // Cerebellum — motor coordination
  ],
  attention: [
    'cortex_occipital',           // Visual cortex — sensory stream
    'cortex_temporal',            // Auditory cortex — sensory stream
    'cortex_prefrontal',          // dlPFC — working memory (target template)
    'cortex_parietal',            // Parietal — spatial attention
    'Cingulate_gyrus_right',      // ACC — conflict monitoring
    'Left_hippocampus1',          // Hippocampus — task goal storage
    'Amygdala1',                  // Amygdala — motivational salience
    'Right_thalamus',             // Thalamus — sensory gating
    'Right_thalamus1',            // Thalamus (medial) — attention modulation
  ],
  decision: [
    'cortex_occipital',           // Visual cortex — perceive options
    'cortex_prefrontal',          // dlPFC + OFC — working memory + value
    'cortex_anterior_temporal',   // Semantic — comprehend options
    'Cingulate_gyrus_right',      // ACC — conflict monitoring
    'Left_hippocampus1',          // Hippocampus — past outcome retrieval
    'Amygdala1',                  // Amygdala — emotional valuation
    'Left_insula',                // Insula — somatic markers
    'Caudate_nucleus1',           // Caudate — reward-based learning
  ],
  problemsolving: [
    'cortex_occipital',           // Visual cortex — encode problem
    'cortex_prefrontal',          // dlPFC — working memory + strategy
    'cortex_parietal',            // IPS — spatial/relational reasoning
    'cortex_anterior_temporal',   // Semantic — known concepts
    'Cingulate_gyrus_right',      // ACC — strategy switching
    'Left_hippocampus1',          // Hippocampus — analogical search
  ],
  conversation: [
    'cortex_temporal',            // Auditory cortex — hear partner
    'cortex_wernicke',            // Wernicke's — decode speech
    'cortex_broca',               // Broca's — construct reply syntax
    'cortex_motor_cortex',        // Motor — articulate speech
    'cortex_anterior_temporal',   // Semantic — extract meaning
    'cortex_prefrontal',          // dlPFC — working memory, planning
    'Cingulate_gyrus_right',      // ACC — turn-taking, monitoring
    'Amygdala1',                  // Amygdala — emotional prosody
    'Left_insula',                // Insula — social-emotional processing
    'Left_hippocampus1',          // Hippocampus — shared context
    'Right_cerebellar_hemisphere1', // Cerebellum — speech timing
  ],
  creative: [
    'cortex_prefrontal',          // Anterior PFC — controlled defocusing
    'cortex_anterior_temporal',   // Semantic — broad concept activation
    'cortex_parietal',            // Parietal — relational reasoning
    'Cingulate_gyrus_right',      // ACC — evaluation
    'Left_hippocampus1',          // Hippocampus — remote associations
    'Amygdala1',                  // Amygdala — novelty detection
    'Caudate_nucleus1',           // Caudate — reward/dopamine signal
  ],
  navigation: [
    'cortex_occipital',           // Visual cortex — scene processing
    'cortex_parietal',            // IPS — spatial map
    'cortex_anterior_temporal',   // Semantic — landmark recognition
    'cortex_motor_cortex',        // Motor — locomotion
    'cortex_prefrontal',          // dlPFC — route planning
    'Cingulate_gyrus_right',      // ACC — replanning
    'Left_hippocampus1',          // Hippocampus — place cells, cognitive map
    'Right_cerebellar_hemisphere1', // Cerebellum — motor coordination
  ],
  running: [
    'cortex_occipital',           // Visual cortex — terrain scanning
    'cortex_parietal',            // Parietal — spatial mapping
    'cortex_motor_cortex',        // Motor — locomotion patterns
    'cortex_somatosensory',       // Somatosensory — proprioception
    'cortex_prefrontal',          // dlPFC — pacing goals
    'Cingulate_gyrus_right',      // ACC — fatigue management
    'Right_cerebellar_hemisphere1', // Cerebellum — coordination, timing
    'Caudate_nucleus1',           // Caudate — habit/motor selection
    'Left_putamen1',              // Putamen — movement initiation
    'Amygdala1',                  // Amygdala — motivation, runner's high
    'Brain_stem55',               // Brainstem — autonomic (heart, breathing)
    'Pons',                       // Pons — cerebellar relay
  ],
  startle: [
    'Amygdala1',                  // Amygdala — fast threat detection (~12ms)
    'Superior_colliculus',        // Superior colliculus — fast visual orienting
    'Hypothalamus_and_pituitary1', // Hypothalamus — fight/flight activation
    'Brain_stem55',               // Brainstem — motor nuclei (flinch/freeze)
    'cortex_motor_cortex',        // Motor cortex — startle motor response
    'Right_thalamus',             // Thalamus — sensory relay
    'cortex_prefrontal',          // dlPFC — conscious registration (delayed)
    'Cingulate_gyrus_right',      // ACC — threat evaluation (delayed)
    'Left_hippocampus1',          // Hippocampus — encode the event
  ],
  recall: [
    'cortex_prefrontal',          // dlPFC — direct the search
    'cortex_anterior_temporal',   // Semantic — contextual framework
    'cortex_parietal',            // Parietal — spatial context of memory
    'Left_hippocampus1',          // Hippocampus — pattern completion
    'Amygdala1',                  // Amygdala — emotional reactivation
    'Left_insula',                // Insula — emotional re-experiencing
    'Cingulate_gyrus_right',      // ACC — monitoring accuracy
    'Fornix_right',               // Fornix — hippocampal output
    'Mammillary_bodies1',         // Mammillary bodies — Papez circuit
  ],
  skilllearning: [
    'cortex_occipital',           // Visual cortex — observe target
    'cortex_parietal',            // Parietal — spatial error feedback
    'cortex_motor_cortex',        // Motor — execute movement
    'cortex_somatosensory',       // Somatosensory — proprioceptive feedback
    'cortex_prefrontal',          // dlPFC — working memory, goals
    'Cingulate_gyrus_right',      // ACC — error monitoring
    'Right_cerebellar_hemisphere1', // Cerebellum — forward models, automaticity
    'Caudate_nucleus1',           // Caudate — reward learning
    'Left_putamen1',              // Putamen — motor program storage
    'Amygdala1',                  // Amygdala — frustration/reward
    'Left_hippocampus1',          // Hippocampus — procedural memory encoding
  ],
  transcendence: [
    // NOTE: Executive control is ABSENT — cingulate NOT activated
    'Left_insula',                // Insula — interoception becomes primary awareness
    'Amygdala1',                  // Amygdala — shifts from threat to open awareness
    'Left_hippocampus1',          // Hippocampus — autobiographical self dampens
    // Default mode network quiets, prefrontal goes offline
  ],
  trauma: [
    'Amygdala1',                  // Amygdala — overwhelms everything
    'Hypothalamus_and_pituitary1', // Hypothalamus — HPA axis, fight/flight
    'cortex_motor_cortex',        // Motor — fight/flight/freeze response
    'Brain_stem55',               // Brainstem — autonomic survival
    'Left_insula',                // Insula — somatic experiencing
    'Left_hippocampus1',          // Hippocampus — FAILS to encode coherently
    'cortex_prefrontal',          // Prefrontal — overwhelmed, goes offline
    'Cingulate_gyrus_right',      // ACC — attempts regulation, fails
  ],
  dreaming: [
    'Left_hippocampus1',          // Hippocampus — replays memory fragments
    'Amygdala1',                  // Amygdala — curates by emotional significance
    'cortex_occipital',           // Visual cortex — generates imagery (hallucinating)
    'cortex_temporal',            // Temporal — auditory dream content
    'cortex_anterior_temporal',   // Anterior temporal — loose semantic associations
    'cortex_motor_cortex',        // Motor cortex — activates but body paralyzed (atonia)
    'Pons',                       // Pons — generates REM, triggers atonia
    'Right_thalamus',             // Thalamus — relays internal signals
    // NOTE: Executive control (prefrontal) is SUPPRESSED during REM
  ],
};
