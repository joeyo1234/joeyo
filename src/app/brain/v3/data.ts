// ══════════════════════════════════════════════════
// COGNITIVE ARCHITECTURE DATA
// ══════════════════════════════════════════════════

export interface Module {
  id: string;
  name: string;
  tag: string;
  tier: number; // 1=sensory, 2=early, 3=deep, 4=integration, 5=output, 6=modulation
  x: number; // percentage
  y: number; // percentage
  color: string;
  region: string;
  desc: string;
}

export interface Task {
  id: string;
  name: string;
  title: string;
  activeModules: string[];
  sequence: Record<string, number>;
  activePaths: [string, string][];
  desc: string;
  bridges: { label: string; desc: string }[];
}

export interface BrainRegionDetail {
  title: string;
  anatomy: string;
  desc: string;
  clinical: string;
  color: string;
}

export const modules: Record<string, Module> = {
  visual:       { id: 'visual',       name: 'Visual Processing',   tag: 'Perceptual',  tier: 1, x: 22, y: 6,  color: '#4a9eff', region: 'V1–V5, occipital lobe, fusiform gyrus (VWFA)', desc: 'Retinal input → edge detection → pattern recognition → object identification. The Visual Word Form Area (left fusiform) specializes in letter/word recognition.' },
  auditory:     { id: 'auditory',     name: 'Auditory Processing',  tag: 'Perceptual',  tier: 1, x: 50, y: 6,  color: '#00d4aa', region: 'A1, superior temporal gyrus, Heschl\u2019s gyrus', desc: 'Cochlear input → spectrotemporal analysis → pitch, timing, loudness extraction. Segments the continuous acoustic stream into processable units.' },
  spatial:      { id: 'spatial',      name: 'Spatial Reasoning',    tag: 'Reasoning',   tier: 2, x: 18, y: 22, color: '#ffcc33', region: 'Posterior parietal cortex, intraparietal sulcus', desc: 'Mental rotation, magnitude processing, number line representation. The intraparietal sulcus is critical for numerical magnitude (Dehaene\u2019s triple-code model).' },
  phonological: { id: 'phonological', name: 'Phonological System',  tag: 'Language',    tier: 2, x: 48, y: 22, color: '#9b6dff', region: 'Posterior STG, supramarginal gyrus (L)', desc: 'Encodes sound-based representations of language. Contains Baddeley\u2019s phonological loop — a short-term buffer for speech sounds with articulatory rehearsal.' },
  semantic:     { id: 'semantic',     name: 'Semantic Network',     tag: 'Language',    tier: 3, x: 22, y: 40, color: '#ff8844', region: 'Anterior temporal lobe, angular gyrus', desc: 'Hub-and-spoke concept system (Patterson & Lambon Ralph). The anterior temporal lobe integrates modality-specific features into amodal meanings, categories, and associations.' },
  syntactic:    { id: 'syntactic',    name: 'Syntactic Engine',     tag: 'Language',    tier: 3, x: 50, y: 40, color: '#ff5599', region: 'Broca\u2019s area (BA 44/45), left IFG', desc: 'Computes hierarchical phrase structure for both comprehension (parsing) and production (grammatical encoding). Operates via Levelt\u2019s formulator model.' },
  workingmem:   { id: 'workingmem',   name: 'Working Memory',      tag: 'Integration', tier: 4, x: 27, y: 58, color: '#4a9eff', region: 'Dorsolateral PFC (BA 9/46), posterior parietal', desc: 'Baddeley\u2019s model: central executive + phonological loop + visuospatial sketchpad + episodic buffer. Capacity-limited (~4 chunks). The critical integration bottleneck.' },
  executive:    { id: 'executive',    name: 'Executive Control',    tag: 'Governance',  tier: 4, x: 52, y: 58, color: '#ff4466', region: 'Anterior PFC, anterior cingulate cortex (ACC)', desc: 'Conflict monitoring (ACC), inhibition, task switching, goal maintenance. Norman & Shallice\u2019s supervisory attentional system. Slow, effortful, fatigable.' },
  motor:        { id: 'motor',        name: 'Motor Output',         tag: 'Output',      tier: 5, x: 38, y: 78, color: '#44dd88', region: 'Primary motor cortex (M1), premotor, SMA, cerebellum', desc: 'Executes voluntary movement — speech articulation (ventral premotor), handwriting (dorsal stream), typing. Tightly coupled to sensory systems via feedback loops.' },
  emotional:    { id: 'emotional',    name: 'Emotional System',     tag: 'Modulation',  tier: 6, x: 80, y: 25, color: '#ff5599', region: 'Amygdala, OFC, insula, ventral striatum', desc: 'Evaluates affective significance and valence. Amygdala-driven salience detection, reward processing (ventral striatum), interoception (insula). Modulates all other systems.' },
  memory:       { id: 'memory',       name: 'Long-term Memory',     tag: 'Storage',     tier: 6, x: 80, y: 50, color: '#9b6dff', region: 'Hippocampus, entorhinal cortex, neocortical stores', desc: 'Hippocampus binds cortical representations into episodic memories. Systems consolidation transfers to neocortex over time. Also semantic (facts) and procedural (skills) subsystems.' },
};

export const connections: [string, string][] = [
  ['visual', 'phonological'], ['visual', 'spatial'], ['visual', 'semantic'], ['visual', 'workingmem'],
  ['visual', 'emotional'],
  ['auditory', 'phonological'], ['auditory', 'workingmem'],
  ['auditory', 'semantic'], ['auditory', 'emotional'],
  ['phonological', 'semantic'], ['phonological', 'syntactic'], ['phonological', 'workingmem'],
  ['phonological', 'motor'],
  ['spatial', 'workingmem'], ['spatial', 'motor'], ['spatial', 'semantic'],
  ['semantic', 'syntactic'], ['semantic', 'workingmem'], ['semantic', 'emotional'],
  ['syntactic', 'workingmem'], ['syntactic', 'phonological'],
  ['workingmem', 'executive'], ['workingmem', 'motor'], ['workingmem', 'memory'],
  ['workingmem', 'syntactic'],
  ['executive', 'motor'], ['executive', 'workingmem'],
  ['executive', 'semantic'], ['executive', 'emotional'],
  ['emotional', 'executive'], ['emotional', 'memory'], ['emotional', 'workingmem'],
  ['emotional', 'motor'],
  ['memory', 'semantic'], ['memory', 'workingmem'], ['memory', 'emotional'],
  ['motor', 'visual'], ['motor', 'auditory'],
];

export const feedbackPaths = new Set([
  'memory->semantic', 'memory->workingmem', 'memory->emotional',
  'executive->workingmem', 'executive->semantic', 'executive->emotional',
  'syntactic->phonological', 'motor->visual', 'motor->auditory',
  'workingmem->syntactic', 'emotional->workingmem', 'emotional->motor',
]);

export const tierBands = [
  { label: 'Sensory Input',     yStart: 0,  yEnd: 15 },
  { label: 'Early Processing',  yStart: 15, yEnd: 32 },
  { label: 'Deep Processing',   yStart: 32, yEnd: 50 },
  { label: 'Integration',       yStart: 50, yEnd: 68 },
  { label: 'Output',            yStart: 68, yEnd: 100 },
];

export const tasks: Record<string, Task> = {
  reading: {
    id: 'reading', name: 'Reading', title: 'Reading: Dual-Route Visual-Linguistic Integration',
    activeModules: ['visual', 'phonological', 'semantic', 'syntactic', 'workingmem', 'executive', 'memory', 'emotional'],
    sequence: { visual: 1, phonological: 2, semantic: 2, syntactic: 3, workingmem: 4, memory: 5, emotional: 5, executive: 6 },
    activePaths: [['visual', 'phonological'], ['visual', 'semantic'], ['phonological', 'semantic'], ['semantic', 'syntactic'], ['syntactic', 'workingmem'], ['semantic', 'workingmem'], ['workingmem', 'executive'], ['workingmem', 'memory'], ['memory', 'semantic'], ['semantic', 'emotional']],
    desc: '<strong>Visual cortex (V1–V5)</strong> performs orthographic analysis; the VWFA identifies letter strings as word-forms. Two parallel routes activate per Coltheart\u2019s dual-route model: the <strong>sublexical route</strong> converts graphemes to phonemes (posterior superior temporal gyrus), while the <strong>lexical route</strong> maps directly to meaning (anterior temporal lobe). <strong>Broca\u2019s area</strong> assembles syntactic structure incrementally. <strong>Working memory (dlPFC)</strong> holds sentence context while <strong>executive control (ACC)</strong> monitors comprehension and triggers re-reading when understanding breaks down. <strong>Long-term memory (hippocampus)</strong> retrieves world knowledge for inference.',
    bridges: [
      { label: 'Visual → Phonological', desc: 'The reading bridge. Grapheme-to-phoneme conversion via posterior STG. Breakdown = classic phonological dyslexia.' },
      { label: 'Visual → Semantic', desc: 'Direct lexical access via VWFA → anterior temporal lobe. Dominates for familiar words in skilled readers.' },
      { label: 'Phonological → Semantic', desc: 'The comprehension bridge. Can decode but not understand = hyperlexia pattern.' },
    ],
  },
  speech: {
    id: 'speech', name: 'Speech Production', title: 'Speech Production: From Concept to Vocalization',
    activeModules: ['semantic', 'memory', 'workingmem', 'executive', 'syntactic', 'phonological', 'motor', 'auditory'],
    sequence: { semantic: 1, memory: 1, workingmem: 2, executive: 2, syntactic: 3, phonological: 4, motor: 5, auditory: 6 },
    activePaths: [['semantic', 'workingmem'], ['memory', 'semantic'], ['workingmem', 'executive'], ['workingmem', 'syntactic'], ['semantic', 'syntactic'], ['syntactic', 'phonological'], ['phonological', 'motor'], ['executive', 'motor'], ['motor', 'auditory'], ['auditory', 'phonological']],
    desc: 'Per Levelt\u2019s blueprint model, speech begins with conceptual intent: the <strong>semantic network (anterior temporal lobe)</strong> activates the message to express, drawing on <strong>long-term memory (hippocampus)</strong> for relevant knowledge. <strong>Working memory (dlPFC)</strong> formulates the preverbal message while <strong>executive control (ACC)</strong> selects and sequences the communicative goal. <strong>Broca\u2019s area</strong> performs grammatical encoding — selecting lemmas and building syntactic frames. The <strong>phonological system (posterior STG)</strong> generates the articulatory score. <strong>Motor cortex (M1, premotor, cerebellum)</strong> executes articulation. <strong>Auditory cortex</strong> provides the self-monitoring feedback loop.',
    bridges: [
      { label: 'Semantic → Syntactic', desc: 'Thought-to-structure (Levelt\u2019s lemma access). Breakdown = word-finding difficulties, agrammatism in Broca\u2019s aphasia.' },
      { label: 'Phonological → Motor', desc: 'Articulatory score to motor execution. Breakdown = apraxia of speech (premotor cortex damage).' },
      { label: 'Motor → Auditory', desc: 'Self-monitoring loop. Without it, speech drifts without self-correction. Disrupted in conduction aphasia (arcuate fasciculus).' },
    ],
  },
  math: {
    id: 'math', name: 'Math', title: 'Mathematical Reasoning: Spatial-Symbolic Integration',
    activeModules: ['visual', 'spatial', 'semantic', 'phonological', 'workingmem', 'executive', 'memory', 'motor'],
    sequence: { visual: 1, spatial: 2, semantic: 2, phonological: 3, workingmem: 4, executive: 5, memory: 5, motor: 6 },
    activePaths: [['visual', 'spatial'], ['visual', 'semantic'], ['semantic', 'workingmem'], ['spatial', 'workingmem'], ['phonological', 'workingmem'], ['workingmem', 'executive'], ['memory', 'semantic'], ['workingmem', 'memory'], ['executive', 'motor'], ['motor', 'visual']],
    desc: '<strong>Visual cortex</strong> identifies digits, operators, and spatial layout. Per Dehaene\u2019s triple-code model, the <strong>intraparietal sulcus</strong> activates for magnitude processing — understanding "how much" numbers represent on a mental number line. <strong>Semantic network (angular gyrus)</strong> retrieves stored math facts. The <strong>phonological loop</strong> rehearses intermediate results subvocally. <strong>Working memory (dlPFC)</strong> holds the problem state while <strong>executive control (ACC)</strong> sequences multi-step operations. <strong>Hippocampus</strong> retrieves learned algorithms. <strong>Motor cortex</strong> writes the solution, with <strong>visual feedback</strong> confirming output.',
    bridges: [
      { label: 'Visual → Spatial', desc: 'The math bridge. Symbol recognition to magnitude intuition (intraparietal sulcus). Breakdown = dyscalculia.' },
      { label: 'Working Memory → Executive', desc: 'Holding intermediate results while sequencing steps. Working memory overload = computational errors.' },
      { label: 'Memory → Semantic', desc: 'Math fact retrieval (hippocampus → angular gyrus). Slow retrieval = bottleneck even when concepts are understood.' },
    ],
  },
  listening: {
    id: 'listening', name: 'Listening', title: 'Listening Comprehension: Auditory-Semantic Stream',
    activeModules: ['auditory', 'phonological', 'syntactic', 'semantic', 'workingmem', 'emotional', 'executive', 'memory'],
    sequence: { auditory: 1, phonological: 2, syntactic: 3, semantic: 3, workingmem: 4, emotional: 4, memory: 5, executive: 5 },
    activePaths: [['auditory', 'phonological'], ['phonological', 'syntactic'], ['phonological', 'semantic'], ['semantic', 'syntactic'], ['syntactic', 'workingmem'], ['semantic', 'workingmem'], ['semantic', 'emotional'], ['emotional', 'executive'], ['workingmem', 'executive'], ['workingmem', 'memory'], ['memory', 'semantic']],
    desc: '<strong>Auditory cortex (A1, Heschl\u2019s gyrus)</strong> performs spectrotemporal analysis. Per Hickok & Poeppel\u2019s dual-stream model, the <strong>posterior STG</strong> maps the acoustic stream onto phonological representations. The <strong>ventral stream</strong> extracts meaning, while <strong>Broca\u2019s area</strong> parses syntax incrementally. <strong>Working memory (dlPFC)</strong> holds discourse context. The <strong>amygdala and insula</strong> process emotional prosody in parallel. <strong>Executive control (ACC)</strong> resolves ambiguity and sustains attention. <strong>Hippocampus</strong> encodes the understood message.',
    bridges: [
      { label: 'Auditory → Phonological', desc: 'Speech stream segmentation (A1 → posterior STG). Breakdown = auditory processing disorder.' },
      { label: 'Semantic → Emotional', desc: 'Interpreting speaker intent, sarcasm, emotional content via amygdala and right-hemisphere prosody.' },
      { label: 'Working Memory → Executive', desc: 'Sustaining attention through extended speech. Working memory fatigue = comprehension drops in long lectures.' },
    ],
  },
  writing: {
    id: 'writing', name: 'Writing', title: 'Writing: Multi-System Orchestration',
    activeModules: ['visual', 'semantic', 'memory', 'executive', 'workingmem', 'syntactic', 'phonological', 'motor', 'emotional'],
    sequence: { visual: 1, semantic: 2, memory: 3, executive: 3, workingmem: 4, syntactic: 5, phonological: 5, motor: 6, emotional: 6 },
    activePaths: [['visual', 'semantic'], ['semantic', 'workingmem'], ['memory', 'semantic'], ['memory', 'workingmem'], ['executive', 'workingmem'], ['workingmem', 'syntactic'], ['syntactic', 'phonological'], ['phonological', 'workingmem'], ['workingmem', 'motor'], ['executive', 'motor'], ['motor', 'visual'], ['emotional', 'executive']],
    desc: 'The most demanding cognitive task — activates 9 modules. <strong>Visual cortex</strong> reads the prompt. <strong>Semantic network</strong> comprehends it. <strong>Hippocampus</strong> retrieves topic knowledge, and per Hayes & Flower\u2019s model, <strong>executive control</strong> plans the message. <strong>Working memory (dlPFC)</strong> juggles content, language, and mechanics simultaneously. <strong>Broca\u2019s area</strong> performs grammatical encoding, the <strong>phonological system</strong> handles spelling. <strong>Motor cortex and cerebellum</strong> execute handwriting or typing. The critical review loop: <strong>visual cortex</strong> reads the output back, feeding into <strong>executive control</strong> for error detection.',
    bridges: [
      { label: 'Semantic → Syntactic', desc: 'Idea-to-sentence via Broca\u2019s area. The most cognitively demanding step in writing. Breakdown = written agrammatism.' },
      { label: 'Phonological → Motor', desc: 'Spelling to physical writing (supramarginal gyrus → motor cortex). Breakdown = dysgraphia.' },
      { label: 'Motor → Visual', desc: 'The review loop. Seeing your written output re-enters the visual system for proofreading. Unique to writing vs. speech.' },
    ],
  },
  attention: {
    id: 'attention', name: 'Sustained Attention', title: 'Sustained Attention: The Orchestration System',
    activeModules: ['visual', 'auditory', 'emotional', 'executive', 'workingmem', 'memory', 'motor'],
    sequence: { visual: 1, auditory: 1, emotional: 2, executive: 3, workingmem: 3, memory: 4, motor: 5 },
    activePaths: [['visual', 'workingmem'], ['auditory', 'workingmem'], ['workingmem', 'executive'], ['executive', 'workingmem'], ['emotional', 'executive'], ['emotional', 'workingmem'], ['workingmem', 'memory'], ['memory', 'workingmem'], ['executive', 'motor']],
    desc: 'Per Posner & Petersen\u2019s attentional networks model: <strong>visual and auditory cortices</strong> provide the ongoing sensory stream. <strong>The emotional system</strong> evaluates motivational significance and modulates arousal. <strong>Executive control (anterior cingulate)</strong> detects targets, resolves conflicts, and sends top-down biasing signals. <strong>Working memory (dlPFC)</strong> maintains the target template and task rules. <strong>Hippocampus</strong> stores the task goals. The whole system cycles continuously.',
    bridges: [
      { label: 'Executive → Working Memory', desc: 'The regulation bridge. ADHD = breakdown here. Individual modules work, but the orchestration between them fails.' },
      { label: 'Emotional → Executive', desc: 'Self-regulation bridge (amygdala/LC → ACC). Anxiety floods executive resources with threat signals. Boredom depletes drive.' },
      { label: 'Sensory → Working Memory', desc: 'The gating bridge. Filtering relevant from irrelevant input. Breakdown = sensory overload, distractibility.' },
    ],
  },
  decision: {
    id: 'decision', name: 'Decision Making', title: 'Decision Making Under Uncertainty',
    activeModules: ['visual', 'semantic', 'emotional', 'workingmem', 'executive', 'memory', 'motor'],
    sequence: { visual: 1, semantic: 2, memory: 3, emotional: 3, workingmem: 4, executive: 5, motor: 6 },
    activePaths: [['visual', 'semantic'], ['semantic', 'workingmem'], ['semantic', 'emotional'], ['emotional', 'memory'], ['emotional', 'workingmem'], ['emotional', 'executive'], ['memory', 'semantic'], ['memory', 'workingmem'], ['workingmem', 'executive'], ['executive', 'workingmem'], ['executive', 'motor']],
    desc: '<strong>Visual cortex</strong> perceives options. <strong>Semantic networks</strong> comprehend their meaning. The <strong>hippocampus</strong> retrieves memories of past decisions, while the <strong>emotional system — particularly the OFC and ventral striatum</strong> — assigns subjective value through Damasio\u2019s somatic marker mechanism. <strong>Working memory (dlPFC)</strong> holds competing alternatives while <strong>executive control (ACC)</strong> monitors conflict and commits when evidence is sufficient.',
    bridges: [
      { label: 'Emotional → Working Memory', desc: 'The somatic marker bridge. OFC damage (Phineas Gage) leaves logic intact but devastates decisions — Iowa Gambling Task failures.' },
      { label: 'Working Memory → Executive', desc: 'Conflict monitoring gateway. In OCD, the ACC chronically signals "something is wrong," causing pathological indecisiveness.' },
      { label: 'Memory → Semantic', desc: 'Experience-based valuation. Hippocampal amnesia impairs future-oriented decisions — can\u2019t simulate outcomes without episodic "mental time travel."' },
    ],
  },
  problemsolving: {
    id: 'problemsolving', name: 'Problem Solving', title: 'Novel Problem Solving and Reasoning',
    activeModules: ['visual', 'semantic', 'spatial', 'workingmem', 'executive', 'memory', 'motor'],
    sequence: { visual: 1, semantic: 2, memory: 2, spatial: 3, workingmem: 4, executive: 5, motor: 6 },
    activePaths: [['visual', 'semantic'], ['visual', 'spatial'], ['semantic', 'workingmem'], ['memory', 'semantic'], ['memory', 'workingmem'], ['spatial', 'workingmem'], ['workingmem', 'executive'], ['executive', 'workingmem'], ['executive', 'semantic'], ['workingmem', 'motor'], ['executive', 'motor']],
    desc: 'Facing a novel challenge with no known procedure recruits a broad <strong>frontoparietal network</strong>. <strong>Visual cortex</strong> encodes the problem, interpreted through <strong>semantic networks</strong>. The <strong>hippocampus</strong> searches for analogous past experiences. The <strong>intraparietal sulcus</strong> performs spatial and relational reasoning. <strong>Working memory (dlPFC)</strong> holds the evolving problem state while <strong>executive control</strong> orchestrates hypothesis generation and strategy revision.',
    bridges: [
      { label: 'Spatial → Working Memory', desc: 'Mental model construction. Parietal damage disrupts ability to build internal simulations. Seen in constructional apraxia.' },
      { label: 'Executive → Working Memory', desc: 'Strategy switching loop. Frontal damage causes perseveration — repeating failed strategies (Wisconsin Card Sorting Task).' },
      { label: 'Memory → Working Memory', desc: 'Analogical transfer. Hippocampal damage blocks flexible recombination of stored knowledge into novel configurations.' },
    ],
  },
  conversation: {
    id: 'conversation', name: 'Conversation', title: 'Interactive Conversational Exchange',
    activeModules: ['auditory', 'phonological', 'semantic', 'syntactic', 'workingmem', 'executive', 'emotional', 'memory', 'motor'],
    sequence: { auditory: 1, phonological: 2, semantic: 3, emotional: 3, memory: 4, workingmem: 5, executive: 6, syntactic: 7, motor: 8 },
    activePaths: [['auditory', 'phonological'], ['phonological', 'semantic'], ['phonological', 'workingmem'], ['semantic', 'emotional'], ['semantic', 'workingmem'], ['emotional', 'memory'], ['emotional', 'workingmem'], ['emotional', 'executive'], ['memory', 'semantic'], ['memory', 'workingmem'], ['workingmem', 'executive'], ['executive', 'workingmem'], ['workingmem', 'syntactic'], ['syntactic', 'phonological'], ['phonological', 'motor'], ['executive', 'motor'], ['motor', 'auditory']],
    desc: 'The most demanding task — requiring rapid alternation between comprehension and production. <strong>Auditory cortex</strong> receives speech, <strong>phonological system</strong> decodes it. <strong>Semantic networks</strong> extract meaning while the <strong>emotional system</strong> processes prosody. The <strong>hippocampus</strong> retrieves shared context. <strong>Working memory</strong> juggles everything. <strong>Executive control</strong> manages turn-taking. <strong>Broca\u2019s area</strong> constructs the reply, <strong>motor cortex</strong> speaks, and the <strong>auditory loop</strong> monitors output.',
    bridges: [
      { label: 'Semantic → Emotional', desc: 'Pragmatic-affective bridge. Right hemisphere processes irony and indirect requests. Right hemisphere stroke patients miss social nuance entirely.' },
      { label: 'Working Memory → Executive', desc: 'Turn-taking control. ADHD impairs this: individuals interrupt not from social indifference but from a timing/inhibition deficit.' },
      { label: 'Emotional → Memory', desc: 'Social context retrieval. Amygdala tags interactions for hippocampal storage. Atypical connectivity here contributes to autism social difficulties.' },
    ],
  },
  creative: {
    id: 'creative', name: 'Creative Thinking', title: 'Creative Idea Generation',
    activeModules: ['semantic', 'memory', 'workingmem', 'executive', 'emotional', 'syntactic', 'motor'],
    sequence: { executive: 1, semantic: 2, memory: 2, emotional: 3, workingmem: 4, syntactic: 5, motor: 6 },
    activePaths: [['executive', 'semantic'], ['semantic', 'workingmem'], ['semantic', 'emotional'], ['memory', 'semantic'], ['memory', 'workingmem'], ['emotional', 'workingmem'], ['emotional', 'executive'], ['emotional', 'memory'], ['workingmem', 'executive'], ['executive', 'workingmem'], ['workingmem', 'syntactic'], ['syntactic', 'workingmem'], ['workingmem', 'motor']],
    desc: 'One of the rare <strong>internally generated</strong> tasks. <strong>Executive control</strong> relaxes semantic constraints, allowing <strong>semantic activation</strong> to spread across distant conceptual neighborhoods. The <strong>hippocampus</strong> retrieves remote memories for recombination. The <strong>ventral striatum</strong> generates the "aha" reward signal. <strong>Working memory</strong> holds ideas for iterative refinement. Neuroimaging shows creative individuals have increased <strong>default mode–executive network coupling</strong>.',
    bridges: [
      { label: 'Executive → Semantic', desc: 'Controlled defocusing. Early frontotemporal dementia can produce a burst of artistic creativity. Brainstorming\u2019s "suspend judgment" works by reducing prefrontal gating.' },
      { label: 'Emotional → Working Memory', desc: 'Novelty-value signal. In anhedonia (depression), blunted reward signal kills creative drive. Mild dopamine elevation in hypomania enhances output.' },
      { label: 'Memory → Semantic', desc: 'Remote association pipeline. REM sleep strengthens remote associations — why creative breakthroughs follow incubation and sleep.' },
    ],
  },
  navigation: {
    id: 'navigation', name: 'Navigation', title: 'Spatial Navigation and Wayfinding',
    activeModules: ['visual', 'spatial', 'memory', 'workingmem', 'executive', 'semantic', 'motor'],
    sequence: { visual: 1, spatial: 2, memory: 3, semantic: 3, workingmem: 4, executive: 5, motor: 6 },
    activePaths: [['visual', 'spatial'], ['visual', 'semantic'], ['visual', 'workingmem'], ['spatial', 'workingmem'], ['spatial', 'motor'], ['memory', 'semantic'], ['memory', 'workingmem'], ['semantic', 'workingmem'], ['workingmem', 'executive'], ['executive', 'workingmem'], ['executive', 'motor'], ['workingmem', 'motor'], ['workingmem', 'memory'], ['motor', 'visual']],
    desc: '<strong>Visual cortex</strong> processes the scene, feeding the <strong>posterior parietal cortex and IPS</strong> to construct a spatial representation. The <strong>hippocampus and entorhinal cortex</strong> are central: place cells fire at specific locations, grid cells provide coordinates (O\u2019Keefe & Moser, Nobel 2014). <strong>Semantic networks</strong> identify landmarks. <strong>Working memory</strong> holds position, destination, and waypoints. <strong>Executive control</strong> plans routes and replans. <strong>Motor cortex</strong> executes locomotion with <strong>visual feedback</strong> updating the spatial model.',
    bridges: [
      { label: 'Spatial → Working Memory', desc: 'Cognitive map maintenance. Parietal damage causes topographical disorientation — landmarks are seen but spatial relationships are meaningless.' },
      { label: 'Memory → Working Memory', desc: 'Hippocampal place system. London taxi drivers have enlarged posterior hippocampi. Early Alzheimer\u2019s targets entorhinal cortex first.' },
      { label: 'Motor → Visual', desc: 'Sensorimotor update loop. Motor commands predict visual scene changes. This is why passengers get carsick more than drivers.' },
    ],
  },
  running: {
    id: 'running', name: 'Running', title: 'Coordinated Locomotion',
    activeModules: ['visual', 'spatial', 'motor', 'workingmem', 'executive', 'emotional', 'memory'],
    sequence: { visual: 1, spatial: 2, memory: 2, motor: 3, workingmem: 3, executive: 4, emotional: 4 },
    activePaths: [['visual', 'spatial'], ['visual', 'emotional'], ['spatial', 'motor'], ['spatial', 'workingmem'], ['memory', 'workingmem'], ['workingmem', 'executive'], ['workingmem', 'motor'], ['executive', 'motor'], ['executive', 'emotional'], ['emotional', 'motor'], ['emotional', 'memory']],
    desc: 'Running engages a continuous sensorimotor loop. <strong>Visual cortex</strong> scans terrain → <strong>posterior parietal cortex</strong> maps obstacles → <strong>motor cortex, premotor, SMA, cerebellum</strong> generate rhythmic locomotion. <strong>Working memory</strong> holds route and pace goals while <strong>executive control</strong> manages pacing and fatigue. <strong>The emotional system</strong> drives motivation, manages pain, and produces the runner\u2019s high via endocannabinoid release.',
    bridges: [
      { label: 'Spatial → Motor', desc: 'Real-time trajectory adjustment — dodging obstacles without conscious thought. Damage causes optic ataxia.' },
      { label: 'Executive → Emotional', desc: 'Top-down regulation of fatigue and pain. Lets marathon runners push through "the wall." When this fatigues, motivational collapse.' },
      { label: 'Emotional → Motor', desc: 'Motivational drive directly to motor circuits — the dopaminergic "wanting" signal. Runner\u2019s high flows through this route.' },
    ],
  },
  startle: {
    id: 'startle', name: 'Startle Response', title: 'Fright / Startle Response',
    activeModules: ['auditory', 'visual', 'emotional', 'motor', 'workingmem', 'executive', 'memory'],
    sequence: { auditory: 1, visual: 1, emotional: 1, motor: 2, workingmem: 3, executive: 3, memory: 4 },
    activePaths: [['auditory', 'emotional'], ['visual', 'emotional'], ['emotional', 'motor'], ['emotional', 'workingmem'], ['emotional', 'executive'], ['workingmem', 'executive'], ['executive', 'workingmem'], ['emotional', 'memory']],
    desc: 'The brain\u2019s fastest circuit — an amygdala hijack where emotion drives action <em>before</em> conscious awareness. A sudden noise reaches the <strong>amygdala</strong> in ~12ms via a subcortical shortcut, <em>bypassing</em> cortical analysis. The amygdala triggers <strong>motor cortex and brainstem</strong> — you flinch before you know why. Only <em>then</em> does <strong>working memory</strong> register what happened and <strong>executive control</strong> evaluates the threat. The <strong>hippocampus</strong> encodes the event.',
    bridges: [
      { label: 'Auditory → Emotional', desc: 'The fastest sensory-to-emotion pathway (~12ms via thalamo-amygdala route). Amygdala lesions (Urbach–Wiethe disease) dramatically reduce acoustic startle.' },
      { label: 'Emotional → Motor', desc: 'Amygdala\u2019s direct projections produce the startle — eye blink, neck flexion, freeze — within 30–50ms. Genuinely involuntary.' },
      { label: 'Emotional → Executive', desc: 'After the reflex, the amygdala signals for conscious threat evaluation. In PTSD, this pathway is dysregulated — persistent hypervigilance.' },
    ],
  },
  recall: {
    id: 'recall', name: 'Memory Recall', title: 'Episodic Remembering',
    activeModules: ['auditory', 'memory', 'semantic', 'emotional', 'workingmem', 'executive'],
    sequence: { auditory: 1, memory: 2, semantic: 2, workingmem: 3, emotional: 3, executive: 4 },
    activePaths: [['auditory', 'semantic'], ['auditory', 'workingmem'], ['memory', 'semantic'], ['memory', 'workingmem'], ['memory', 'emotional'], ['semantic', 'workingmem'], ['semantic', 'emotional'], ['emotional', 'workingmem'], ['workingmem', 'executive'], ['executive', 'workingmem'], ['executive', 'semantic']],
    desc: 'A sensory cue triggers <strong>hippocampal pattern completion</strong>: the hippocampus reactivates stored fragments, feeding them into <strong>semantic networks</strong> which provide contextual framework. Fragments converge in <strong>working memory</strong> where the scene is reconstructed. The <strong>amygdala and insula</strong> reactivate the original emotional state. <strong>Executive systems</strong> direct the search. Memories are not replayed but <em>rebuilt</em> each time.',
    bridges: [
      { label: 'Memory → Semantic', desc: 'Hippocampus reactivates traces, anterior temporal lobe provides scaffolding. Semantic dementia: episodic fragments without interpretive framework.' },
      { label: 'Memory → Emotional', desc: 'Hippocampus reactivates the amygdala\u2019s emotional record. In PTSD, hyperactive — traumatic memories trigger full re-experiencing.' },
      { label: 'Executive → Working Memory', desc: 'Monitors reconstruction for accuracy. Frontal damage produces confabulation — mixing real and fabricated without knowing.' },
    ],
  },
  skilllearning: {
    id: 'skilllearning', name: 'Skill Learning', title: 'Motor Skill Acquisition',
    activeModules: ['visual', 'spatial', 'workingmem', 'executive', 'motor', 'emotional', 'memory'],
    sequence: { visual: 1, spatial: 2, workingmem: 2, executive: 3, motor: 4, emotional: 5, memory: 5 },
    activePaths: [['visual', 'spatial'], ['visual', 'workingmem'], ['spatial', 'motor'], ['spatial', 'workingmem'], ['workingmem', 'executive'], ['workingmem', 'motor'], ['executive', 'motor'], ['executive', 'workingmem'], ['executive', 'emotional'], ['emotional', 'motor'], ['workingmem', 'memory'], ['memory', 'workingmem']],
    desc: 'Learning a new motor skill — juggling, riding a bike — engages a repeated attempt–feedback–adjust loop. <strong>Visual cortex</strong> observes the target → <strong>posterior parietal cortex</strong> analyzes spatial geometry → <strong>working memory</strong> holds the goal. <strong>Executive control</strong> plans each attempt → <strong>motor cortex and cerebellum</strong> execute. Feedback signals the error. <strong>The emotional system</strong> manages frustration and delivers reward. Over cycles, <strong>hippocampus</strong> consolidates procedural memory. Early learning is executive-heavy; with practice, control transfers to cerebellar-motor circuits.',
    bridges: [
      { label: 'Executive → Motor', desc: 'During early acquisition, heavy top-down control. The cerebellum gradually builds a forward model — the neural basis of automaticity.' },
      { label: 'Spatial → Working Memory', desc: 'Visuospatial error signal makes deliberate practice effective. Parietal lesions: patients attempt but cannot learn from spatial errors.' },
      { label: 'Executive → Emotional', desc: 'Prefrontal cortex suppresses quit impulses. ADHD children abandon skill learning prematurely from frustration intolerance, not motor inability.' },
    ],
  },
  transcendence: {
    id: 'transcendence', name: 'Transcendence', title: 'Flow States and Self-Transcendence',
    activeModules: ['emotional', 'memory', 'workingmem'],
    sequence: { emotional: 1, memory: 1, workingmem: 2 },
    activePaths: [['emotional', 'memory'], ['emotional', 'workingmem'], ['memory', 'emotional'], ['memory', 'workingmem']],
    desc: 'The most paradoxical state — defined by what <em>goes quiet</em>. Only three systems remain central: the <strong>emotional system (insula)</strong> shifts to pure phenomenal awareness — interoceptive signals become the primary content of consciousness. The <strong>hippocampus</strong> reduces autobiographical broadcasting, dampening the self-referential loop. <strong>Working memory</strong> shifts from verbal-analytical to present-moment awareness. Executive control, sensory processing, motor, and language are notably <em>absent</em>. The same signature appears across meditation, psychedelic research, and Csikszentmihalyi\u2019s flow studies.',
    bridges: [
      { label: 'Emotional → Working Memory', desc: 'Insula\u2019s interoceptive signals replace verbal thought. Experienced meditators show increased insula thickness — they\u2019ve literally rewired this pathway.' },
      { label: 'Memory → Emotional', desc: 'Normally the hippocampus feeds autobiographical context to the amygdala. In transcendence, this loop dampens — the self dissolves. Psilocybin/DMT specifically disrupt this pathway.' },
      { label: 'Emotional → Memory', desc: 'The emotional signal to hippocampus shifts to non-judgmental awareness. The hippocampus stops future-simulation and past-rumination — the "eternal present." A trainable skill, not a mystical accident.' },
    ],
  },
  trauma: {
    id: 'trauma', name: 'Trauma Response', title: 'Traumatic Stress and System Breakdown',
    activeModules: ['visual', 'auditory', 'emotional', 'motor', 'memory', 'workingmem', 'executive'],
    sequence: { visual: 1, auditory: 1, emotional: 1, motor: 2, memory: 3, workingmem: 4, executive: 4 },
    activePaths: [['visual', 'emotional'], ['auditory', 'emotional'], ['emotional', 'motor'], ['emotional', 'memory'], ['emotional', 'workingmem'], ['emotional', 'executive'], ['memory', 'emotional'], ['executive', 'emotional'], ['executive', 'workingmem']],
    desc: 'What happens when the architecture is <em>overwhelmed</em>. Sensory input floods the <strong>amygdala</strong> so intensely it <em>overrides</em> normal processing. The amygdala triggers <strong>motor cortex</strong> for fight/flight/freeze while overwhelming <strong>working memory</strong>. The <strong>hippocampus</strong> cannot encode coherently under extreme amygdala activation — memory is stored as disconnected fragments without temporal context. <strong>Executive control</strong> attempts regulation but is overpowered. The event is stored in emotional memory but not autobiographical narrative. Van der Kolk\u2019s principle: "the body keeps the score."',
    bridges: [
      { label: 'Emotional → Memory', desc: 'The central wound. Hippocampus can\u2019t bind fragments into coherent memory. PTSD flashbacks feel like the event is happening <em>now</em> because it was never encoded as "past." Trauma therapy (EMDR) re-engages hippocampal binding.' },
      { label: 'Emotional → Executive', desc: 'Amygdala overwhelms prefrontal control — the rational mind goes offline. This is neurobiological, not a failure of willpower. "Just think rationally" is neurologically naive.' },
      { label: 'Memory → Emotional', desc: 'The perpetuation loop. Fragments re-trigger the amygdala because the hippocampus never encoded "that was then, this is now." Therapy targets this loop specifically.' },
    ],
  },
  dreaming: {
    id: 'dreaming', name: 'Dreaming', title: 'Dreams and Offline Processing',
    activeModules: ['memory', 'emotional', 'visual', 'semantic', 'motor'],
    sequence: { memory: 1, emotional: 1, visual: 2, semantic: 2, motor: 3 },
    activePaths: [['memory', 'emotional'], ['memory', 'semantic'], ['emotional', 'memory'], ['emotional', 'motor'], ['semantic', 'emotional'], ['visual', 'emotional']],
    desc: 'The brain\u2019s <em>offline</em> architecture — executive control and external input go dark. The <strong>hippocampus</strong> replays recent experiences in compressed, recombined form. The <strong>amygdala</strong> curates by emotional significance. <strong>Visual cortex</strong> hallucinates vivid imagery without retinal input. <strong>Semantic networks</strong> make loose associations (dream bizarreness). <strong>Motor cortex</strong> activates as if executing dream actions, but brainstem atonia paralyzes the body. <strong>Executive control is suppressed</strong> — no logic, no "this is weird."<br><br>A key paradox: the hippocampus is active as a <em>source</em> (replaying fragments) but not a <em>destination</em> (dreams aren\u2019t encoded). Norepinephrine — critical for encoding — is nearly absent during REM. You only recall a dream if you wake during it.',
    bridges: [
      { label: 'Memory → Emotional', desc: 'Walker\u2019s "sleep to forget, sleep to remember" — REM strips emotional intensity while preserving information. Disrupted in depression and PTSD.' },
      { label: 'Emotional → Memory', desc: 'Amygdala curates which memories get replayed. Stress and unresolved conflicts get priority — why nightmares replay traumatic material.' },
      { label: 'Memory → Semantic', desc: 'Systems consolidation — how "what happened today" becomes "how the world works." Source of dream-derived creative breakthroughs.' },
    ],
  },
};

export const brainRegionDetails: Record<string, BrainRegionDetail> = {
  visual: { title: 'Visual Cortex', anatomy: 'Primary visual cortex (V1) at the occipital pole, surrounding association areas V2–V5. The Visual Word Form Area (VWFA) in left fusiform gyrus specializes in orthographic processing.', desc: 'Performs hierarchical feature extraction from retinal input: V1 detects edges and orientation, V2 processes contours, V4 handles color and form, V5/MT processes motion. In reading, the VWFA acts as a learned "letterbox" — recognizing letter strings as visual word forms.', clinical: 'Damage to V1 causes cortical blindness. Damage to the VWFA causes pure alexia (letter-by-letter reading). V5 damage causes akinetopsia (motion blindness).', color: '#4a9eff' },
  auditory: { title: 'Auditory Cortex', anatomy: 'Primary auditory cortex (A1) in Heschl\'s gyrus on the superior temporal plane, with belt and parabelt association areas.', desc: 'Performs spectrotemporal analysis: extracting pitch, timing, loudness, and timbre. A1 is tonotopically organized. Surrounding belt areas extract phoneme boundaries, voice identity, and spatial location.', clinical: 'Bilateral damage causes cortical deafness. Unilateral left damage can cause word deafness. Right hemisphere auditory cortex is important for musical pitch and emotional prosody.', color: '#00d4aa' },
  spatial: { title: 'Posterior Parietal Cortex', anatomy: 'Posterior parietal cortex including the intraparietal sulcus (IPS), superior parietal lobule, and the angular and supramarginal gyri.', desc: 'Processes spatial relationships, magnitude, and sensorimotor transformations. The intraparietal sulcus is critical for numerical magnitude — Dehaene\'s "mental number line."', clinical: 'Left IPS damage causes dyscalculia (Gerstmann syndrome). Right parietal damage causes hemispatial neglect. Bilateral damage causes Balint\'s syndrome.', color: '#ffcc33' },
  phonological: { title: 'Wernicke\'s Area / Posterior STG', anatomy: 'Posterior superior temporal gyrus and supramarginal gyrus in the left hemisphere. Connected to Broca\'s area via the arcuate fasciculus.', desc: 'The core sound-to-language interface. Encodes, stores, and manipulates phonological representations. Contains Baddeley\'s phonological loop.', clinical: 'Damage causes Wernicke\'s aphasia — fluent but meaningless speech. Phonological processing deficits are the core mechanism in developmental dyslexia.', color: '#9b6dff' },
  semantic: { title: 'Anterior Temporal Lobe', anatomy: 'Anterior and inferior temporal cortex, with the temporal pole as a semantic "hub." Also involves the angular gyrus.', desc: 'The brain\'s meaning system — Patterson & Lambon Ralph\'s hub-and-spoke model. The anterior temporal lobe integrates modality-specific features into unified concepts.', clinical: 'Progressive damage (semantic dementia) causes gradual loss of word meaning and object knowledge. Acute left temporal damage causes anomia.', color: '#ff8844' },
  syntactic: { title: 'Broca\'s Area', anatomy: 'Posterior inferior frontal gyrus, Brodmann areas 44 and 45. Left-lateralized in ~95% of right-handed individuals.', desc: 'Computes hierarchical grammatical structure for both comprehension and production. Its role is better described as "hierarchical structure building."', clinical: 'Damage causes Broca\'s aphasia — non-fluent, telegraphic speech. Comprehension of complex syntax is also impaired.', color: '#ff5599' },
  workingmem: { title: 'Dorsolateral Prefrontal Cortex', anatomy: 'Lateral surface of the prefrontal cortex, Brodmann areas 9 and 46.', desc: 'The brain\'s central workspace — temporarily maintains and manipulates information. Per Baddeley\'s model: phonological loop, visuospatial sketchpad, episodic buffer, central executive.', clinical: 'Dysfunction is central to ADHD, schizophrenia, and age-related cognitive decline. Working memory capacity predicts academic achievement.', color: '#4a9eff' },
  executive: { title: 'Anterior Prefrontal Cortex / ACC', anatomy: 'Anterior (frontopolar) prefrontal cortex and anterior cingulate cortex (ACC).', desc: 'The brain\'s supervisor. The ACC monitors for conflicts and errors. The anterior PFC handles goal maintenance, task switching, and strategic planning.', clinical: 'ACC damage causes apathy and failure to correct errors. Prefrontal damage causes dysexecutive syndrome. Executive dysfunction is common across ADHD, TBI, and frontal lobe dementia.', color: '#ff4466' },
  motor: { title: 'Motor Cortex', anatomy: 'Precentral gyrus (primary motor cortex / M1), premotor cortex, supplementary motor area (SMA), and the cerebellum.', desc: 'Plans, sequences, and executes voluntary movement. The cerebellum provides timing, coordination, and error correction.', clinical: 'M1 damage causes contralateral paralysis. Premotor damage causes apraxia. Cerebellar damage causes ataxia and dysarthria.', color: '#44dd88' },
  emotional: { title: 'Limbic System (Amygdala, Insula)', anatomy: 'Deep structures: amygdala, insula, orbitofrontal cortex, and ventral striatum. NOT visible on the lateral cortical surface.', desc: 'Evaluates affective significance. The amygdala detects threat. The insula processes body states. The OFC links emotion to decisions. The ventral striatum drives reward and motivation.', clinical: 'Amygdala damage eliminates fear (Urbach-Wiethe disease). Insula damage impairs disgust recognition. Dysfunctional circuits underlie anxiety, PTSD, addiction, depression.', color: '#ff5599' },
  memory: { title: 'Hippocampal Formation', anatomy: 'Hippocampus, entorhinal cortex, perirhinal cortex, and parahippocampal cortex — located in the medial temporal lobe.', desc: 'The brain\'s memory encoding engine. Binds disparate cortical representations into coherent episodic memories. Also supports spatial navigation (place cells, grid cells).', clinical: 'Bilateral damage causes anterograde amnesia (H.M. / Henry Molaison). Hippocampal atrophy is the earliest marker of Alzheimer\'s disease.', color: '#9b6dff' },
};
