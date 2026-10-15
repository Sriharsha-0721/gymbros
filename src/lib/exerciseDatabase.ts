export interface ExerciseDetail {
  id: string;
  name: string;
  category: 'Chest' | 'Back' | 'Shoulders' | 'Legs' | 'Arms' | 'Core';
  targetMuscle: string;
  secondaryMuscles: string[];
  equipment: 'Barbell' | 'Dumbbell' | 'Machine' | 'Cable' | 'Bodyweight' | 'Kettlebell';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  startingPosition: string;
  executionSteps: string[];
  breathingCue: string;
  commonMistakes: string[];
  easierVariation: string;
  harderVariation: string;
  safetyCautions: string;
  recommendedSetsReps: string;
  recommendedRest: string;
  svgType: 'chest_press' | 'squat' | 'pullup' | 'overhead_press' | 'row' | 'rdl' | 'curl' | 'triceps' | 'plank' | 'lateral_raise';
}

export const EXERCISE_DATABASE: ExerciseDetail[] = [
  {
    id: 'barbell_bench_press',
    name: 'Barbell Bench Press',
    category: 'Chest',
    targetMuscle: 'Mid & Lower Pectoralis Major',
    secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii', 'Serratus Anterior'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    startingPosition: 'Lie flat on bench with eyes directly under bar. Plant feet flat on the floor, retract shoulder blades, and grip bar slightly wider than shoulder-width with wrists straight.',
    executionSteps: [
      'Unrack bar with locked elbows, positioning it directly over mid-chest.',
      'Inhale deeply and lower the bar in a controlled path to the lower sternum (2–3 seconds).',
      'Keep elbows tucked at approximately a 45–70 degree angle to protect the rotator cuffs.',
      'Touch chest lightly without bouncing, then drive feet into the floor and press bar back up over shoulders while exhaling.',
      'Lock out arms smoothly at the top without unlocking shoulder blades.'
    ],
    breathingCue: 'Inhale and brace core on the descent; exhale forcefully past the sticking point on the press.',
    commonMistakes: [
      'Bouncing the bar aggressively off the sternum.',
      'Flaring elbows out at 90 degrees, stressing the shoulder joint.',
      'Lifting glutes off the bench to cheat the weight.'
    ],
    easierVariation: 'Dumbbell Flat Bench Press or Machine Chest Press',
    harderVariation: 'Pause Bench Press (2-second dead stop at chest) or Spoto Press',
    safetyCautions: 'Use safety spotter arms or a reliable spotter. Avoid thumbless (suicide) grip. If you have shoulder impingement, switch to Dumbbells with a neutral grip.',
    recommendedSetsReps: '3–4 sets of 6–10 reps',
    recommendedRest: '90–150 seconds',
    svgType: 'chest_press',
  },
  {
    id: 'incline_dumbbell_press',
    name: 'Incline Dumbbell Bench Press',
    category: 'Chest',
    targetMuscle: 'Clavicular (Upper) Pectorals',
    secondaryMuscles: ['Front Deltoids', 'Triceps Brachii'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    startingPosition: 'Set bench to a 30° to 45° incline. Sit with dumbbells resting on knees, then kick weights up to shoulders as you lie back. Retract scapulae.',
    executionSteps: [
      'Position dumbbells at shoulder level with wrists neutral and elbows angled at 45 degrees.',
      'Press dumbbells upwards along a slight inward arc until arms are extended above upper chest.',
      'Do not clang dumbbells together at the top; maintain tension throughout.',
      'Lower weights smoothly over 3 seconds until you feel a comfortable stretch across the upper chest.',
      'Pause for a fraction of a second at the bottom stretch before pressing again.'
    ],
    breathingCue: 'Inhale on the slow descent; exhale smoothly as you press upwards.',
    commonMistakes: [
      'Setting bench angle too steep (>45°), turning the exercise into a shoulder press.',
      'Arching lower back excessively to flatten the angle.'
    ],
    easierVariation: 'Incline Machine Chest Press or Push-Ups with feet elevated',
    harderVariation: '1.5 Rep Incline Dumbbell Press (down, half-up, down, full press)',
    safetyCautions: 'When finishing the set, bring knees up and set dumbbells on thighs rather than dropping them sideways.',
    recommendedSetsReps: '3–4 sets of 8–12 reps',
    recommendedRest: '75–90 seconds',
    svgType: 'chest_press',
  },
  {
    id: 'barbell_back_squat',
    name: 'Barbell Back Squat',
    category: 'Legs',
    targetMuscle: 'Quadriceps & Gluteus Maximus',
    secondaryMuscles: ['Hamstrings', 'Adductors', 'Erector Spinae', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    startingPosition: 'Position bar across upper trapezius (high-bar) or rear delts (low-bar). Grip bar firmly, step back, and set feet shoulder-width apart with toes flared slightly outwards (15–30°).',
    executionSteps: [
      'Take a deep belly breath and brace core 360 degrees (Valsalva maneuver).',
      'Hinge hips and bend knees simultaneously, pushing knees outward in line with toes.',
      'Descend until hip crease is at or slightly below the top of the patella (parallel depth).',
      'Maintain an upright neutral spine with chest up; avoid excessive forward lean.',
      'Drive powerfully through mid-foot and heels to return to standing position, exhaling at the top.'
    ],
    breathingCue: 'Big inhale and abdominal brace before descent; hold brace through the hole; exhale near the top.',
    commonMistakes: [
      'Knees caving inwards (valgus collapse) on the ascent.',
      'Shifting weight onto toes, causing heels to lift off the floor.',
      'Rounding the lower back at the bottom of the squat (butt wink).'
    ],
    easierVariation: 'Goblet Squat with Dumbbell or Box Squat',
    harderVariation: 'Barbell Front Squat or 3-second Paused Back Squat',
    safetyCautions: 'Always use safety pins set just below parallel. If you have lower back disc herniations, substitute with Leg Press or Belt Squats.',
    recommendedSetsReps: '3–4 sets of 6–10 reps',
    recommendedRest: '120–180 seconds',
    svgType: 'squat',
  },
  {
    id: 'goblet_squat',
    name: 'Dumbbell / Kettlebell Goblet Squat',
    category: 'Legs',
    targetMuscle: 'Quadriceps, Adductors & Core',
    secondaryMuscles: ['Glutes', 'Upper Back', 'Biceps'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    startingPosition: 'Hold a single dumbbell vertically against mid-chest with both hands cupping the top head. Stand with feet slightly wider than shoulder-width.',
    executionSteps: [
      'Keep elbows pointing down and chest lifted high.',
      'Break at hips and knees, sitting down between your thighs.',
      'Let elbows track inside knees at the bottom to open hips naturally.',
      'Pause briefly in deep squat position with flat spine.',
      'Drive through whole foot to stand tall and contract glutes at the top.'
    ],
    breathingCue: 'Inhale on the way down; exhale as you push the ground away.',
    commonMistakes: [
      'Holding the weight away from the body, fatiguing the shoulders.',
      'Collapsing the chest forward at the bottom.'
    ],
    easierVariation: 'Bodyweight Chair / Box Squat',
    harderVariation: '1.5 Rep Goblet Squats or Barbell Front Squat',
    safetyCautions: 'Excellent spine-safe alternative to back squats for lifters with lower back or shoulder mobility restrictions.',
    recommendedSetsReps: '3–4 sets of 10–12 reps',
    recommendedRest: '60–90 seconds',
    svgType: 'squat',
  },
  {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift (RDL)',
    category: 'Legs',
    targetMuscle: 'Hamstrings & Gluteal Chain',
    secondaryMuscles: ['Erector Spinae', 'Lats', 'Forearm Grip'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    startingPosition: 'Stand tall holding dumbbells or barbell in front of thighs. Soften knees slightly (15° bend) and lock this knee angle throughout the movement.',
    executionSteps: [
      'Push hips backward towards the wall behind you as if closing a car door with your glutes.',
      'Slide the weights closely down along your thighs and shins while keeping spine neutral.',
      'Lower until you feel a deep, loaded stretch in the hamstrings (typically mid-shin level).',
      'Do not round lower back or bend knees further into a squat.',
      'Contract glutes and hamstrings to pull hips forward back to starting position.'
    ],
    breathingCue: 'Inhale and brace core at the top; maintain abdominal pressure down; exhale as hips lock out.',
    commonMistakes: [
      'Turning the movement into a squat by bending knees excessively.',
      'Rounding the thoracic and lumbar spine to reach the floor.',
      'Letting the weights drift away from the legs.'
    ],
    easierVariation: 'Dumbbell Glute Bridges or Lying Leg Curls',
    harderVariation: 'Single-Leg Romanian Deadlift or Barbell Snatch-Grip RDL',
    safetyCautions: 'Keep weights in contact with shins. Stop the range of motion as soon as hips stop moving backward.',
    recommendedSetsReps: '3–4 sets of 8–12 reps',
    recommendedRest: '90–120 seconds',
    svgType: 'rdl',
  },
  {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    category: 'Back',
    targetMuscle: 'Latissimus Dorsi (Lats)',
    secondaryMuscles: ['Biceps Brachii', 'Brachialis', 'Rear Deltoids', 'Rhomboids'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    startingPosition: 'Sit at lat pulldown station with thighs secured under roller pads. Grip bar with hands just outside shoulder-width. Lean torso back slightly (10–15°).',
    executionSteps: [
      'Depress scapulae (pull shoulders down away from ears).',
      'Pull bar down smoothly toward upper chest, driving elbows downward and slightly inward.',
      'Squeeze lats firmly at the bottom position as the bar touches collarbone.',
      'Slowly resist the cable weight on the return path over 2–3 seconds.',
      'Allow full stretch at the top without letting shoulders shrug uncontrollably.'
    ],
    breathingCue: 'Exhale as you pull down to chest; inhale on the controlled upward stretch.',
    commonMistakes: [
      'Swinging torso backwards violently using momentum.',
      'Pulling bar behind the neck (dangerous for cervical spine & rotator cuff).'
    ],
    easierVariation: 'Resistance Band Pulldowns',
    harderVariation: 'Bodyweight Wide-Grip Pull-Ups or Heavy Neutral-Grip Pulldowns',
    safetyCautions: 'Never pull behind the neck. Ensure thigh pads are locked tightly so hips do not elevate.',
    recommendedSetsReps: '3–4 sets of 8–12 reps',
    recommendedRest: '60–90 seconds',
    svgType: 'pullup',
  },
  {
    id: 'chest_supported_row',
    name: 'Chest-Supported Incline Dumbbell Row',
    category: 'Back',
    targetMuscle: 'Rhomboids, Mid-Traps & Upper Back',
    secondaryMuscles: ['Latissimus Dorsi', 'Posterior Deltoids', 'Biceps'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    startingPosition: 'Set incline bench to 30°–45°. Lie prone with chest supported on bench and dumbbells hanging straight down with neutral grip.',
    executionSteps: [
      'Start with arms fully extended and shoulder blades open.',
      'Initiate pull by retracting shoulder blades together.',
      'Drive elbows backwards toward hips, pulling dumbbells to side of ribs.',
      'Squeeze shoulder blades together hard for 1 full second at the peak.',
      'Lower weights under control over 2–3 seconds back to dead hang.'
    ],
    breathingCue: 'Exhale on the pull; inhale as you lower the weights.',
    commonMistakes: [
      'Lifting chest off the bench using lower back extension.',
      'Jerking weights up using biceps rather than leading with elbows.'
    ],
    easierVariation: 'Seated Cable Row',
    harderVariation: 'Seal Row (flat bench) or 3-second isometric hold at top',
    safetyCautions: 'Optimal spine-safe row for lifters with lower back sensitivity since the bench fully supports axial load.',
    recommendedSetsReps: '3–4 sets of 10–12 reps',
    recommendedRest: '60–90 seconds',
    svgType: 'row',
  },
  {
    id: 'seated_dumbbell_shoulder_press',
    name: 'Seated Dumbbell Shoulder Press',
    category: 'Shoulders',
    targetMuscle: 'Anterior & Lateral Deltoids',
    secondaryMuscles: ['Triceps Brachii', 'Upper Trapezius', 'Serratus Anterior'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    startingPosition: 'Sit on vertical or slightly inclined bench (80°). Bring dumbbells to shoulder height with palms facing forward or semi-neutral (45°).',
    executionSteps: [
      'Brace core firmly and plant feet flat on the floor.',
      'Press dumbbells upwards overhead until arms are nearly locked.',
      'Keep elbows tracking in front of the body slightly (scapular plane), not flared out wide.',
      'Lower dumbbells slowly to ear level with a 2-second negative.',
      'Control weights at the bottom before initiating next rep.'
    ],
    breathingCue: 'Inhale at bottom; exhale as you press overhead.',
    commonMistakes: [
      'Hyperextending the lower back off the bench.',
      'Locking elbows violently at the top with loose shoulders.'
    ],
    easierVariation: 'Machine Shoulder Press',
    harderVariation: 'Standing Barbell Overhead Press (OHP)',
    safetyCautions: 'Pressing in the scapular plane (elbows 30° forward) significantly reduces subacromial shoulder impingement.',
    recommendedSetsReps: '3–4 sets of 8–12 reps',
    recommendedRest: '75–90 seconds',
    svgType: 'overhead_press',
  },
  {
    id: 'lateral_raises',
    name: 'Dumbbell Lateral Raises',
    category: 'Shoulders',
    targetMuscle: 'Lateral Deltoids (Side Delts)',
    secondaryMuscles: ['Supraspinatus', 'Upper Traps'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    startingPosition: 'Stand tall with slight forward torso tilt (5–10°). Hold light dumbbells at sides with slight bend in elbows.',
    executionSteps: [
      'Lead with elbows, raising arms out to sides along scapular plane.',
      'Raise weights until elbows reach shoulder height (parallel to floor).',
      'Keep pinky side of hand slightly elevated or flat; avoid thumb pointing straight up.',
      'Pause for a beat at parallel.',
      'Lower under strict control over 2 seconds; do not let dumbbells bounce off thighs.'
    ],
    breathingCue: 'Exhale on the raise; inhale on the controlled descent.',
    commonMistakes: [
      'Using excessive weight and swinging torso back and forth.',
      'Shrugging neck/traps to hoist the weight.'
    ],
    easierVariation: 'Cable Lateral Raise or Resistance Band Lateral Raise',
    harderVariation: 'Incline Bench Lateral Raise (eliminates momentum completely)',
    safetyCautions: 'Never use excessively heavy weights; lateral deltoids respond best to strict form and controlled time under tension.',
    recommendedSetsReps: '3–4 sets of 12–15 reps',
    recommendedRest: '60 seconds',
    svgType: 'lateral_raise',
  },
  {
    id: 'dumbbell_hammer_curl',
    name: 'Dumbbell Neutral Hammer Curl',
    category: 'Arms',
    targetMuscle: 'Brachialis & Brachioradialis',
    secondaryMuscles: ['Biceps Brachii', 'Forearm Flexors'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    startingPosition: 'Stand tall with dumbbells hanging at sides, palms facing each other (neutral grip). Shoulders down and back.',
    executionSteps: [
      'Pin elbows securely against the sides of your ribcage.',
      'Curl dumbbells upward while maintaining neutral palms-in grip.',
      'Squeeze forearm and outer bicep hard at the top contraction.',
      'Lower weights slowly over 2–3 seconds until arms are fully extended.',
      'Avoid swinging hips or leaning backward.'
    ],
    breathingCue: 'Exhale as you curl up; inhale on the eccentric lowering.',
    commonMistakes: [
      'Flaring elbows forward or outward during the lift.',
      'Swinging the body to gain momentum.'
    ],
    easierVariation: 'Cable Rope Hammer Curls',
    harderVariation: 'Cross-Body Hammer Curls or Incline Hammer Curls',
    safetyCautions: 'Neutral grip is gentle on the wrists and avoids the inner-elbow strain often caused by straight barbell curls.',
    recommendedSetsReps: '3–4 sets of 10–12 reps',
    recommendedRest: '60 seconds',
    svgType: 'curl',
  },
  {
    id: 'triceps_rope_pushdown',
    name: 'Cable Triceps Rope Pushdown',
    category: 'Arms',
    targetMuscle: 'Lateral & Medial Heads of Triceps',
    secondaryMuscles: ['Anconeus', 'Core'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    startingPosition: 'Stand facing high cable pulley with rope attachment. Grip rope with neutral hands, hinge slightly forward at hips, and tuck elbows tight to ribs.',
    executionSteps: [
      'Keep upper arms stationary throughout the entire rep.',
      'Extend forearms downward by contracting triceps.',
      'Spread rope ends outward at the bottom of the movement for maximum triceps squeeze.',
      'Hold the peak contraction for 1 second.',
      'Return weight slowly until forearms are just above horizontal (90° bend).'
    ],
    breathingCue: 'Exhale as you push down and spread the rope; inhale as weight returns.',
    commonMistakes: [
      'Letting elbows drift forward and backward like a row.',
      'Rounding shoulders forward over the weight stack.'
    ],
    easierVariation: 'Straight Bar Triceps Pushdown',
    harderVariation: 'Overhead Cable Triceps Extension',
    safetyCautions: 'Keep wrists locked straight to prevent forearm tendonitis.',
    recommendedSetsReps: '3–4 sets of 12–15 reps',
    recommendedRest: '60 seconds',
    svgType: 'triceps',
  },
  {
    id: 'plank',
    name: 'Forearm Core Plank',
    category: 'Core',
    targetMuscle: 'Transverse Abdominis & Deep Core Stabilizers',
    secondaryMuscles: ['Glutes', 'Quadriceps', 'Shoulders', 'Lower Back'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    startingPosition: 'Lie prone on floor. Prop yourself up on forearms with elbows directly beneath shoulders. Extend legs back on toes, feet hip-width apart.',
    executionSteps: [
      'Tuck pelvis into posterior pelvic tilt (engage glutes and draw navel toward spine).',
      'Form a straight line from head through hips down to heels.',
      'Actively push forearms into floor to keep shoulder blades from collapsing (serratus push).',
      'Squeeze quads, glutes, and abs simultaneously with maximum tension.',
      'Hold position statically while taking controlled shallow breaths.'
    ],
    breathingCue: 'Maintain steady, rhythmic diaphragmatic breaths while keeping abdominal wall braced.',
    commonMistakes: [
      'Allowing hips to sag down, putting shear stress on the lumbar spine.',
      'Piking hips too high in the air, removing tension from the core.',
      'Holding breath for prolonged periods.'
    ],
    easierVariation: 'Kneeling Forearm Plank or Incline Bench Plank',
    harderVariation: 'RKC Plank (maximum squeeze for 20 seconds) or Plank with Shoulder Taps',
    safetyCautions: 'Stop immediately if you feel pain in your lower back. Quality of tension always supersedes duration.',
    recommendedSetsReps: '3 sets of 30–60 second holds',
    recommendedRest: '45–60 seconds',
    svgType: 'plank',
  },
];
