export interface ExerciseDetail {
  id: string;
  name: string;
  category: 'Chest' | 'Back' | 'Shoulders' | 'Legs' | 'Arms' | 'Core';
  targetMuscle: string;
  secondaryMuscles: string[];
  equipment: 'Barbell' | 'Dumbbell' | 'Machine' | 'Cable' | 'Bodyweight' | 'Kettlebell';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  startingPosition: string; // Setup: One short instruction
  executionSteps: string[]; // Movement: 2–3 concise steps
  breathingCue: string;     // Breathing: One short cue
  commonMistakes: string[]; // Avoid: 1–2 common mistakes
  easierVariation: string;
  harderVariation: string;
  safetyCautions: string;
  recommendedSetsReps: string;
  recommendedRest: string;
  svgType: string;
}

export const EXERCISE_DATABASE: ExerciseDetail[] = [
  // ==========================================
  // CHEST
  // ==========================================
  {
    id: 'barbell_bench_press',
    name: 'Barbell Bench Press',
    category: 'Chest',
    targetMuscle: 'Mid & Lower Pectorals',
    secondaryMuscles: ['Front Delts', 'Triceps'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    startingPosition: 'Lie flat, eyes under bar, feet planted, shoulder blades retracted.',
    executionSteps: [
      'Unrack bar directly over mid-chest with wrists stacked.',
      'Lower bar with control to lower sternum, elbows angled at 45–70°.',
      'Press upward and slightly backward over shoulders to lockout.'
    ],
    breathingCue: 'Inhale on the descent; exhale forcefully on the press.',
    commonMistakes: [
      'Flaring elbows out at 90°, putting extreme stress on shoulders.',
      'Bouncing the bar off the ribcage.'
    ],
    easierVariation: 'Dumbbell Bench Press or Machine Chest Press',
    harderVariation: 'Paused Bench Press (2-second pause on chest)',
    safetyCautions: 'Always use safety pins or a spotter; maintain shoulder blade retraction.',
    recommendedSetsReps: '3–4 sets of 6–10 reps',
    recommendedRest: '90–120s',
    svgType: 'chest_press',
  },
  {
    id: 'dumbbell_bench_press',
    name: 'Dumbbell Flat Bench Press',
    category: 'Chest',
    targetMuscle: 'Pectoralis Major',
    secondaryMuscles: ['Front Delts', 'Triceps'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    startingPosition: 'Lie on flat bench, holding dumbbells at chest level with neutral wrists.',
    executionSteps: [
      'Press dumbbells up in a gentle arc over mid-chest.',
      'Lower weights smoothly until you feel a comfortable chest stretch.',
      'Drive weights back up without clanging them at the top.'
    ],
    breathingCue: 'Inhale on the way down; exhale as you press up.',
    commonMistakes: [
      'Dropping weights too fast and losing tension at the bottom.',
      'Excessively arching the lower back.'
    ],
    easierVariation: 'Machine Chest Press',
    harderVariation: 'Incline Dumbbell Press',
    safetyCautions: 'Kick dumbbells up with thighs when getting into position to protect shoulders.',
    recommendedSetsReps: '3–4 sets of 8–12 reps',
    recommendedRest: '75–90s',
    svgType: 'chest_press',
  },
  {
    id: 'incline_dumbbell_press',
    name: 'Incline Dumbbell Bench Press',
    category: 'Chest',
    targetMuscle: 'Upper Chest (Clavicular Head)',
    secondaryMuscles: ['Front Delts', 'Triceps'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    startingPosition: 'Set bench to 30–45° incline, lie back with dumbbells at shoulder level.',
    executionSteps: [
      'Press dumbbells upward directly over upper chest.',
      'Lower weights under control over 2–3 seconds for a full stretch.',
      'Press back up smoothly while keeping shoulder blades squeezed together.'
    ],
    breathingCue: 'Inhale lowering the weights; exhale as you press up.',
    commonMistakes: [
      'Setting bench angle too steep (>45°), turning it into a shoulder press.',
      'Flaring elbows straight out sideways.'
    ],
    easierVariation: 'Incline Machine Press or Incline Push-Ups',
    harderVariation: '1.5 Rep Incline Dumbbell Press',
    safetyCautions: 'Keep elbows tucked at 45° to protect rotator cuffs.',
    recommendedSetsReps: '3–4 sets of 8–12 reps',
    recommendedRest: '75–90s',
    svgType: 'chest_press',
  },
  {
    id: 'machine_chest_press',
    name: 'Seated Machine Chest Press',
    category: 'Chest',
    targetMuscle: 'Chest (Stabilized Track)',
    secondaryMuscles: ['Triceps', 'Anterior Deltoids'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    startingPosition: 'Adjust seat so handles align with mid-chest; plant feet firmly on floor.',
    executionSteps: [
      'Grip handles and press smoothly until arms are almost fully extended.',
      'Slowly return handles over 2–3 seconds without letting weight stack slam.',
      'Keep shoulders held against the back pad throughout.'
    ],
    breathingCue: 'Exhale pressing forward; inhale returning under control.',
    commonMistakes: [
      'Letting shoulders shrug forward off the backrest.',
      'Locking elbows violently at end range.'
    ],
    easierVariation: 'Resistance Band Chest Press',
    harderVariation: 'Free Weight Dumbbell Bench Press',
    safetyCautions: 'Excellent spine and shoulder friendly choice for beginners and recovery.',
    recommendedSetsReps: '3–4 sets of 10–12 reps',
    recommendedRest: '60–90s',
    svgType: 'chest_press',
  },
  {
    id: 'cable_chest_flyes',
    name: 'Standing Cable Chest Flyes',
    category: 'Chest',
    targetMuscle: 'Pectoral Adduction & Inner Chest',
    secondaryMuscles: ['Anterior Deltoids'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    startingPosition: 'Set pulleys to chest height, take a staggered stance with a slight forward lean.',
    executionSteps: [
      'Maintain a slight elbow bend and bring handles together in front of chest.',
      'Squeeze chest muscles hard for 1 full second at the center.',
      'Slowly open arms wide until you feel a gentle chest stretch.'
    ],
    breathingCue: 'Exhale bringing hands together; inhale as arms open out.',
    commonMistakes: [
      'Bending and straightening elbows like a press instead of a flye.',
      'Rocking body back and forth using momentum.'
    ],
    easierVariation: 'Pec Deck Machine Flyes',
    harderVariation: 'Incline Cable Flyes with Pause',
    safetyCautions: 'Avoid letting elbows travel behind shoulder line if you have anterior shoulder tightness.',
    recommendedSetsReps: '3–4 sets of 12–15 reps',
    recommendedRest: '60s',
    svgType: 'chest_press',
  },
  {
    id: 'dumbbell_flyes',
    name: 'Dumbbell Chest Flyes',
    category: 'Chest',
    targetMuscle: 'Pectoralis Major Stretch',
    secondaryMuscles: ['Front Delts'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    startingPosition: 'Lie on flat bench with dumbbells extended above chest, palms facing each other.',
    executionSteps: [
      'With a slight bend in elbows, lower dumbbells in a wide arc until chest stretches.',
      'Do not lower weights beyond bench level.',
      'Bring dumbbells back together along the same arc, squeezing chest at the top.'
    ],
    breathingCue: 'Inhale lowering arms wide; exhale hugging weights together.',
    commonMistakes: [
      'Dropping dumbbells too deep and straining shoulder ligaments.',
      'Straightening arms completely.'
    ],
    easierVariation: 'Cable Chest Flyes',
    harderVariation: 'Incline Dumbbell Flyes',
    safetyCautions: 'Use moderate weight; the focus is tension and stretch, not heavy loading.',
    recommendedSetsReps: '3 sets of 10–12 reps',
    recommendedRest: '60–75s',
    svgType: 'chest_press',
  },
  {
    id: 'pushups',
    name: 'Standard Push-Ups',
    category: 'Chest',
    targetMuscle: 'Chest, Core & Triceps',
    secondaryMuscles: ['Front Delts', 'Serratus'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    startingPosition: 'High plank position with hands slightly wider than shoulder-width, core braced.',
    executionSteps: [
      'Lower body in a straight line until chest is 2 inches off floor, elbows at 45°.',
      'Keep core and glutes squeezed so hips do not sag.',
      'Push floor away firmly to return to top plank position.'
    ],
    breathingCue: 'Inhale on the way down; exhale pushing up.',
    commonMistakes: [
      'Sagging hips or piking glutes into the air.',
      'Flaring elbows out perpendicular to torso.'
    ],
    easierVariation: 'Hands-Elevated Incline Push-Ups or Knee Push-Ups',
    harderVariation: 'Deficit Push-Ups or Diamond Push-Ups',
    safetyCautions: 'Keep neck neutral by looking at the floor 6 inches ahead of hands.',
    recommendedSetsReps: '3–4 sets of 10–20 reps',
    recommendedRest: '60s',
    svgType: 'chest_press',
  },
  {
    id: 'incline_pushups',
    name: 'Incline / Hands-Elevated Push-Ups',
    category: 'Chest',
    targetMuscle: 'Lower Chest & Core (Joint Safe)',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    startingPosition: 'Place hands on a bench or sturdy bar, body in a straight line from head to heels.',
    executionSteps: [
      'Lower chest toward the elevated surface with elbows at 45°.',
      'Touch edge of surface lightly with sternum.',
      'Press firmly back to full arm extension.'
    ],
    breathingCue: 'Inhale on the descent; exhale pressing away.',
    commonMistakes: [
      'Dropping head forward before chest touches.',
      'Bending at hips instead of whole body moving together.'
    ],
    easierVariation: 'Wall Push-Ups',
    harderVariation: 'Standard Floor Push-Ups',
    safetyCautions: 'Gentle on wrists and shoulders; ideal for building baseline pushing strength.',
    recommendedSetsReps: '3 sets of 10–15 reps',
    recommendedRest: '60s',
    svgType: 'chest_press',
  },

  // ==========================================
  // SHOULDERS
  // ==========================================
  {
    id: 'overhead_barbell_press',
    name: 'Standing Barbell Overhead Press (OHP)',
    category: 'Shoulders',
    targetMuscle: 'Anterior Deltoids & Shoulder Girdle',
    secondaryMuscles: ['Triceps', 'Upper Chest', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    startingPosition: 'Stand tall with bar racked across front shoulders, grip just outside shoulders.',
    executionSteps: [
      'Brace glutes and abs, tilt head slightly back to clear chin.',
      'Press bar straight upward in a vertical line.',
      'Bring head forward under bar as arms lock out overhead.'
    ],
    breathingCue: 'Inhale and brace at bottom; exhale as bar passes crown of head.',
    commonMistakes: [
      'Leaning backward excessively and compressing lumbar spine.',
      'Pressing bar forward in an arc instead of straight up.'
    ],
    easierVariation: 'Seated Dumbbell Shoulder Press',
    harderVariation: 'Push Press or Strict Z-Press (seated on floor)',
    safetyCautions: 'Keep glutes locked tight to prevent lumbar hyperextension.',
    recommendedSetsReps: '3–4 sets of 6–8 reps',
    recommendedRest: '90–120s',
    svgType: 'overhead_press',
  },
  {
    id: 'seated_dumbbell_shoulder_press',
    name: 'Seated Dumbbell Shoulder Press',
    category: 'Shoulders',
    targetMuscle: 'Anterior & Lateral Deltoids',
    secondaryMuscles: ['Triceps', 'Upper Traps'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    startingPosition: 'Sit with back against upright bench, dumbbells held at shoulder level.',
    executionSteps: [
      'Press dumbbells up overhead along a gentle inward arc.',
      'Lower weights slowly until upper arms are parallel to floor.',
      'Keep elbows tracked slightly forward (scapular plane), not flared wide.'
    ],
    breathingCue: 'Exhale pressing overhead; inhale on the controlled lowering.',
    commonMistakes: [
      'Arching lower back off bench backrest.',
      'Banging dumbbells together at top lockout.'
    ],
    easierVariation: 'Machine Shoulder Press',
    harderVariation: 'Standing Dumbbell Overhead Press',
    safetyCautions: 'Elbows 30° forward protects shoulders from subacromial impingement.',
    recommendedSetsReps: '3–4 sets of 8–12 reps',
    recommendedRest: '75–90s',
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
    startingPosition: 'Stand with light dumbbells at sides, slight forward torso lean (5–10°).',
    executionSteps: [
      'Lead with elbows, raising arms out sideways until parallel to floor.',
      'Keep a slight bend in elbows; do not shrug neck.',
      'Lower weights slowly over 2 seconds without letting them swing.'
    ],
    breathingCue: 'Exhale on the raise; inhale on the slow descent.',
    commonMistakes: [
      'Using momentum and swinging hips to hoist the weights.',
      'Turning thumbs up, transferring load away from side delts.'
    ],
    easierVariation: 'Cable Lateral Raise or Resistance Band Lateral Raise',
    harderVariation: 'Incline Bench Lateral Raise',
    safetyCautions: 'Strict form with light weights works far better than heavy swinging.',
    recommendedSetsReps: '3–4 sets of 12–15 reps',
    recommendedRest: '60s',
    svgType: 'lateral_raise',
  },
  {
    id: 'cable_lateral_raises',
    name: 'Cable Lateral Raises',
    category: 'Shoulders',
    targetMuscle: 'Side Delts (Constant Tension)',
    secondaryMuscles: ['Traps'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    startingPosition: 'Stand sideways to low pulley, holding handle with far hand across body.',
    executionSteps: [
      'Raise arm out to the side until parallel to floor.',
      'Pause for a split-second at peak contraction.',
      'Lower cable weight under constant resistance back across body.'
    ],
    breathingCue: 'Exhale lifting outward; inhale lowering across body.',
    commonMistakes: [
      'Twisting torso to lift the cable.',
      'Raising arm too high above shoulder level.'
    ],
    easierVariation: 'Dumbbell Lateral Raise',
    harderVariation: 'Behind-the-Back Cable Lateral Raise',
    safetyCautions: 'Provides continuous tension at bottom stretch where dumbbells offer none.',
    recommendedSetsReps: '3 sets of 12–15 reps',
    recommendedRest: '60s',
    svgType: 'lateral_raise',
  },
  {
    id: 'face_pulls',
    name: 'Cable Face Pulls',
    category: 'Shoulders',
    targetMuscle: 'Rear Delts & Rotator Cuff',
    secondaryMuscles: ['Rhomboids', 'Mid-Traps'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    startingPosition: 'Set cable rope at eye level; grip rope with thumbs pointing backward.',
    executionSteps: [
      'Step back, pull rope toward nose while spreading rope ends apart.',
      'Rotate hands back so forearms become vertical (external rotation).',
      'Squeeze rear shoulders hard for 1 second, then return slowly.'
    ],
    breathingCue: 'Exhale pulling toward face; inhale returning arms forward.',
    commonMistakes: [
      'Using too much weight and leaning backward to pull.',
      'Pulling down to chest like a row instead of high to face.'
    ],
    easierVariation: 'Band Face Pulls or Prone Rear Delt Flyes',
    harderVariation: 'Face Pull to Overhead Press Combo',
    safetyCautions: 'Essential posture and shoulder health movement; keep elbows high.',
    recommendedSetsReps: '3–4 sets of 12–15 reps',
    recommendedRest: '60s',
    svgType: 'row',
  },
  {
    id: 'dumbbell_rear_delt_flyes',
    name: 'Bent-Over Dumbbell Rear Delt Flyes',
    category: 'Shoulders',
    targetMuscle: 'Posterior Deltoids',
    secondaryMuscles: ['Rhomboids', 'Trapezius'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    startingPosition: 'Hinge forward at hips with flat back, dumbbells hanging beneath chest.',
    executionSteps: [
      'With elbows slightly bent, raise arms out to sides in a wide reverse hug.',
      'Squeeze back of shoulders at peak height.',
      'Lower dumbbells slowly without bouncing at the bottom.'
    ],
    breathingCue: 'Exhale lifting out; inhale lowering weights.',
    commonMistakes: [
      'Rounding the lower back while bent over.',
      'Shrugging upper neck to move the weights.'
    ],
    easierVariation: 'Chest-Supported Rear Delt Flyes on Incline Bench',
    harderVariation: 'Cable Reverse Flyes',
    safetyCautions: 'Support chest on an incline bench if your lower back fatigues.',
    recommendedSetsReps: '3 sets of 12–15 reps',
    recommendedRest: '60s',
    svgType: 'lateral_raise',
  },
  {
    id: 'pike_pushups',
    name: 'Bodyweight Pike Push-Ups',
    category: 'Shoulders',
    targetMuscle: 'Front Deltoids & Triceps',
    secondaryMuscles: ['Upper Chest', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    startingPosition: 'Pike hips high in an inverted V-shape, hands shoulder-width, heels elevated.',
    executionSteps: [
      'Bend elbows and lower crown of head forward toward floor between hands.',
      'Keep hips high throughout descent.',
      'Push firmly through shoulders to return to high pike position.'
    ],
    breathingCue: 'Inhale lowering head forward; exhale pressing back up.',
    commonMistakes: [
      'Allowing hips to drop flat into a standard push-up.',
      'Lowering head straight down instead of slightly forward (forming tripod).'
    ],
    easierVariation: 'Hands-Elevated Pike Push-Ups',
    harderVariation: 'Feet-Elevated Pike Push-Ups or Handstand Push-Ups',
    safetyCautions: 'Keep core engaged to avoid shifting weight too abruptly onto wrists.',
    recommendedSetsReps: '3 sets of 8–12 reps',
    recommendedRest: '60–90s',
    svgType: 'overhead_press',
  },

  // ==========================================
  // BACK
  // ==========================================
  {
    id: 'pullups',
    name: 'Wide-Grip Pull-Ups / Chin-Ups',
    category: 'Back',
    targetMuscle: 'Latissimus Dorsi & Upper Back',
    secondaryMuscles: ['Biceps', 'Rhomboids', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    startingPosition: 'Hang from overhead bar with hands just outside shoulder-width, shoulders active.',
    executionSteps: [
      'Pull elbows down and back toward ribs, leading with chest toward bar.',
      'Continue until chin clears the bar cleanly.',
      'Lower under control over 2–3 seconds back to active dead hang.'
    ],
    breathingCue: 'Exhale pulling upward; inhale on the controlled descent.',
    commonMistakes: [
      'Kicking legs or kipping to generate momentum.',
      'Dropping abruptly into passive dead hang, straining shoulder joints.'
    ],
    easierVariation: 'Band-Assisted Pull-Ups or Lat Pulldowns',
    harderVariation: 'Weighted Pull-Ups or 3-second Paused Pull-Ups',
    safetyCautions: 'Keep shoulder blades depressed; never let joints snap at bottom.',
    recommendedSetsReps: '3–4 sets of 5–10 reps',
    recommendedRest: '90–120s',
    svgType: 'pullup',
  },
  {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    category: 'Back',
    targetMuscle: 'Latissimus Dorsi (Lats)',
    secondaryMuscles: ['Biceps', 'Rear Delts', 'Rhomboids'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    startingPosition: 'Sit with thighs secured under pads; grip bar slightly wider than shoulders.',
    executionSteps: [
      'Lean back 10–15° and pull bar down smoothly toward upper collarbone.',
      'Drive elbows down and in toward ribcage, squeezing lats.',
      'Slowly resist cable on the return over 2–3 seconds for a full stretch.'
    ],
    breathingCue: 'Exhale pulling down to chest; inhale returning up.',
    commonMistakes: [
      'Swinging torso violently backward to pull heavy weight.',
      'Pulling bar behind the neck (dangerous for rotator cuffs).'
    ],
    easierVariation: 'Resistance Band Pulldowns',
    harderVariation: 'Bodyweight Wide-Grip Pull-Ups',
    safetyCautions: 'Never pull behind neck; pull to upper chest only.',
    recommendedSetsReps: '3–4 sets of 8–12 reps',
    recommendedRest: '60–90s',
    svgType: 'pullup',
  },
  {
    id: 'barbell_bent_row',
    name: 'Bent-Over Barbell Row',
    category: 'Back',
    targetMuscle: 'Mid-Back & Rhomboids',
    secondaryMuscles: ['Lats', 'Erector Spinae', 'Biceps'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    startingPosition: 'Hinge hips to 45°, flat back, grip bar just outside knees with wrists firm.',
    executionSteps: [
      'Pull bar smoothly to lower ribcage / belly button.',
      'Lead with elbows and pinch shoulder blades together at top.',
      'Lower bar with control back to knee level without rounding back.'
    ],
    breathingCue: 'Exhale pulling bar up; inhale lowering with control.',
    commonMistakes: [
      'Standing too upright, turning it into a shrug.',
      'Jerking torso upward to heave the weight.'
    ],
    easierVariation: 'Chest-Supported Dumbbell Row or Seated Cable Row',
    harderVariation: 'Pendlay Row (dead-stop from floor every rep)',
    safetyCautions: 'Keep core braced and spine neutral; do not round lower back.',
    recommendedSetsReps: '3–4 sets of 6–10 reps',
    recommendedRest: '90–120s',
    svgType: 'row',
  },
  {
    id: 'chest_supported_row',
    name: 'Chest-Supported Incline Dumbbell Row',
    category: 'Back',
    targetMuscle: 'Upper & Mid Back (Spine Safe)',
    secondaryMuscles: ['Rhomboids', 'Rear Delts', 'Biceps'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    startingPosition: 'Lie chest-down on 30–45° incline bench, dumbbells hanging straight down.',
    executionSteps: [
      'Initiate pull by retracting shoulder blades together.',
      'Drive elbows back toward hips, pulling dumbbells to side of ribs.',
      'Squeeze shoulder blades for 1 second, then lower under control.'
    ],
    breathingCue: 'Exhale pulling up; inhale lowering weights.',
    commonMistakes: [
      'Lifting chest off bench by arching lower back.',
      'Pulling with biceps instead of leading with elbows.'
    ],
    easierVariation: 'Seated Cable Row',
    harderVariation: 'Seal Row on Flat Bench',
    safetyCautions: 'Eliminates lower back strain completely; highly recommended for posture.',
    recommendedSetsReps: '3–4 sets of 10–12 reps',
    recommendedRest: '60–90s',
    svgType: 'row',
  },
  {
    id: 'single_arm_dumbbell_row',
    name: 'Single-Arm Dumbbell Row',
    category: 'Back',
    targetMuscle: 'Lats & Rhomboids',
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    startingPosition: 'Place one knee and hand on flat bench, spine parallel to floor, opposite hand holding dumbbell.',
    executionSteps: [
      'Pull dumbbell up toward hip, driving elbow straight back.',
      'Squeeze lat firmly at top without rotating torso.',
      'Lower weight smoothly to full stretch at bottom.'
    ],
    breathingCue: 'Exhale rowing upward; inhale lowering down.',
    commonMistakes: [
      'Rotating shoulders and twisting torso to jerk the weight.',
      'Pulling weight toward chest instead of hip.'
    ],
    easierVariation: 'Chest-Supported Incline Row',
    harderVariation: 'Kroc Rows (high-rep heavy dumbbell rows)',
    safetyCautions: 'Keep supporting arm locked and back flat.',
    recommendedSetsReps: '3 sets of 8–12 reps per side',
    recommendedRest: '60s',
    svgType: 'row',
  },
  {
    id: 'cable_seated_row',
    name: 'Seated Cable Row',
    category: 'Back',
    targetMuscle: 'Mid-Back, Rhomboids & Traps',
    secondaryMuscles: ['Lats', 'Biceps'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    startingPosition: 'Sit with feet on footplates, knees slightly bent, back upright, grip V-bar handle.',
    executionSteps: [
      'Pull handle into abdomen, squeezing shoulder blades together.',
      'Keep torso upright with natural arch in spine; do not lean back.',
      'Slowly extend arms forward for a full stretch in upper back.'
    ],
    breathingCue: 'Exhale pulling handle to ribs; inhale returning forward.',
    commonMistakes: [
      'Rocking back and forth violently with lower back momentum.',
      'Shrugging shoulders into ears.'
    ],
    easierVariation: 'Resistance Band Seated Row',
    harderVariation: 'Single-Arm Cable Row with Pause',
    safetyCautions: 'Keep knees soft; avoid rounding spine when reaching forward.',
    recommendedSetsReps: '3–4 sets of 10–12 reps',
    recommendedRest: '60–75s',
    svgType: 'row',
  },
  {
    id: 'inverted_rows',
    name: 'Bodyweight Inverted Rows',
    category: 'Back',
    targetMuscle: 'Upper Back & Lats',
    secondaryMuscles: ['Biceps', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    startingPosition: 'Hang under a secure barbell in a rack, heels on floor, body forming a straight plank.',
    executionSteps: [
      'Pull chest up to bar by driving elbows back.',
      'Squeeze shoulder blades tightly at top.',
      'Lower body smoothly back to straight arms.'
    ],
    breathingCue: 'Exhale pulling chest to bar; inhale lowering body.',
    commonMistakes: [
      'Sagging hips or dropping neck backward.',
      'Not touching chest to bar for full range of motion.'
    ],
    easierVariation: 'Raise bar height to make angle more vertical',
    harderVariation: 'Elevate feet on bench or wear weighted vest',
    safetyCautions: 'Ensure bar is racked securely in the J-hooks.',
    recommendedSetsReps: '3 sets of 8–12 reps',
    recommendedRest: '60s',
    svgType: 'row',
  },

  // ==========================================
  // LEGS & GLUTES
  // ==========================================
  {
    id: 'barbell_back_squat',
    name: 'Barbell Back Squat',
    category: 'Legs',
    targetMuscle: 'Quadriceps & Glutes',
    secondaryMuscles: ['Hamstrings', 'Adductors', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    startingPosition: 'Bar across upper traps, feet shoulder-width, toes angled slightly out (15–30°).',
    executionSteps: [
      'Brace core, break at hips and knees simultaneously.',
      'Descend until thighs are parallel to floor, keeping knees tracking with toes.',
      'Drive powerfully through mid-foot and heels to stand back up.'
    ],
    breathingCue: 'Inhale and brace core before descent; exhale rising past sticking point.',
    commonMistakes: [
      'Knees collapsing inward (valgus collapse) on ascent.',
      'Heels lifting off floor from shifting weight forward.'
    ],
    easierVariation: 'Goblet Squat or Leg Press',
    harderVariation: 'Front Squat or 3-second Paused Squat',
    safetyCautions: 'Always set safety pins just below parallel; keep chest upright.',
    recommendedSetsReps: '3–4 sets of 6–10 reps',
    recommendedRest: '120–180s',
    svgType: 'squat',
  },
  {
    id: 'goblet_squat',
    name: 'Dumbbell / Kettlebell Goblet Squat',
    category: 'Legs',
    targetMuscle: 'Quadriceps, Glutes & Core',
    secondaryMuscles: ['Upper Back', 'Adductors'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    startingPosition: 'Hold dumbbell vertically against mid-chest, feet slightly wider than shoulders.',
    executionSteps: [
      'Sit hips back and down between thighs, chest held high.',
      'Let elbows track inside knees at bottom for natural depth.',
      'Push through full foot to stand tall and squeeze glutes.'
    ],
    breathingCue: 'Inhale descending; exhale driving up to stand.',
    commonMistakes: [
      'Holding weight away from chest, fatiguing arms.',
      'Rounding upper back at bottom depth.'
    ],
    easierVariation: 'Bodyweight Box Squat',
    harderVariation: 'Barbell Front Squat',
    safetyCautions: 'Superb spine-friendly squat for learning proper squat depth.',
    recommendedSetsReps: '3–4 sets of 10–12 reps',
    recommendedRest: '60–90s',
    svgType: 'squat',
  },
  {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift (RDL)',
    category: 'Legs',
    targetMuscle: 'Hamstrings & Gluteal Chain',
    secondaryMuscles: ['Lower Back', 'Lats', 'Grip'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    startingPosition: 'Stand tall with dumbbells in front of thighs, knees soft with a slight 15° bend.',
    executionSteps: [
      'Push hips straight backward toward wall behind you with flat spine.',
      'Slide weights down shins until you feel a deep hamstring stretch.',
      'Contract glutes and drive hips forward back to tall posture.'
    ],
    breathingCue: 'Inhale and brace core at top; exhale as hips lock out.',
    commonMistakes: [
      'Bending knees into a squat instead of hinging hips back.',
      'Rounding spine or letting dumbbells drift away from legs.'
    ],
    easierVariation: 'Glute Bridges or Machine Leg Curls',
    harderVariation: 'Barbell RDL or Single-Leg RDL',
    safetyCautions: 'Keep weights skimming shins; stop descent when hips stop traveling backward.',
    recommendedSetsReps: '3–4 sets of 8–12 reps',
    recommendedRest: '90–120s',
    svgType: 'rdl',
  },
  {
    id: 'leg_press',
    name: '45-Degree Incline Leg Press',
    category: 'Legs',
    targetMuscle: 'Quadriceps & Glutes',
    secondaryMuscles: ['Hamstrings', 'Calves'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    startingPosition: 'Sit with back flat on pad; place feet shoulder-width on platform center.',
    executionSteps: [
      'Release safety handles and lower platform smoothly until knees reach 90°.',
      'Press through heels and mid-foot to push sled back up.',
      'Stop just shy of full knee lockout to maintain muscle tension.'
    ],
    breathingCue: 'Inhale lowering platform down; exhale pushing weight away.',
    commonMistakes: [
      'Locking knees violently at the top.',
      'Letting glutes lift off seat at bottom, rounding lower spine.'
    ],
    easierVariation: 'Bodyweight Squats or Goblet Squat',
    harderVariation: 'Single-Leg 45° Leg Press',
    safetyCautions: 'Never let lower back curl off the backrest at maximum depth.',
    recommendedSetsReps: '3–4 sets of 10–12 reps',
    recommendedRest: '90s',
    svgType: 'squat',
  },
  {
    id: 'lying_leg_curls',
    name: 'Lying Hamstring Leg Curls',
    category: 'Legs',
    targetMuscle: 'Hamstrings (Knee Flexion)',
    secondaryMuscles: ['Calves'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    startingPosition: 'Lie prone on machine, roller pad positioned just below calf muscles.',
    executionSteps: [
      'Curl heels smoothly toward glutes through full range of motion.',
      'Hold peak squeeze for 1 second at top.',
      'Lower roller pad slowly over 2–3 seconds back to start.'
    ],
    breathingCue: 'Exhale curling heels up; inhale lowering under control.',
    commonMistakes: [
      'Jerking hips off bench to initiate movement.',
      'Letting weights crash down on the eccentric return.'
    ],
    easierVariation: 'Resistance Band Leg Curls',
    harderVariation: 'Single-Leg Hamstring Curls',
    safetyCautions: 'Keep hips pinned flat against the bench pad.',
    recommendedSetsReps: '3 sets of 10–12 reps',
    recommendedRest: '60s',
    svgType: 'rdl',
  },
  {
    id: 'bulgarian_split_squat',
    name: 'Bulgarian Split Squat',
    category: 'Legs',
    targetMuscle: 'Quadriceps & Glute Max',
    secondaryMuscles: ['Hamstrings', 'Adductors', 'Balance'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    startingPosition: 'Stand a stride length in front of bench, rear foot laces resting on top of bench.',
    executionSteps: [
      'Descend vertically until front thigh is parallel to floor and rear knee hovers.',
      'Keep front knee tracking in line with toes.',
      'Push through front heel to return to top standing position.'
    ],
    breathingCue: 'Inhale descending down; exhale pushing up.',
    commonMistakes: [
      'Standing too close to bench, jamming front knee forward.',
      'Collapsing chest forward over front thigh.'
    ],
    easierVariation: 'Split Squat with both feet on floor',
    harderVariation: '1.5 Rep Bulgarian Split Squat with Dumbbells',
    safetyCautions: 'Unilateral gold standard for knee health and fixing left-right leg imbalances.',
    recommendedSetsReps: '3 sets of 8–10 reps per leg',
    recommendedRest: '60–90s',
    svgType: 'squat',
  },
  {
    id: 'lunges',
    name: 'Walking / Reverse Dumbbell Lunges',
    category: 'Legs',
    targetMuscle: 'Quadriceps & Glutes',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    startingPosition: 'Stand tall holding dumbbells at sides, feet hip-width apart.',
    executionSteps: [
      'Step backward (or forward), lowering both knees to 90° angles.',
      'Keep front knee directly above ankle, rear knee lightly grazing floor.',
      'Drive through front heel to return to tall standing position.'
    ],
    breathingCue: 'Inhale stepping and lowering; exhale pushing back to standing.',
    commonMistakes: [
      'Front knee caving inward or slamming rear knee on floor.',
      'Taking strides that are too narrow, cramping hips.'
    ],
    easierVariation: 'Static Split Squats or Bodyweight Lunges',
    harderVariation: 'Walking Dumbbell Lunges with Deficit',
    safetyCautions: 'Reverse lunges are gentler on patellar tendons than forward lunges.',
    recommendedSetsReps: '3 sets of 10–12 reps per leg',
    recommendedRest: '60s',
    svgType: 'squat',
  },
  {
    id: 'bodyweight_squats',
    name: 'Bodyweight Air Squats',
    category: 'Legs',
    targetMuscle: 'Quadriceps & Hip Mobility',
    secondaryMuscles: ['Glutes', 'Calves'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    startingPosition: 'Stand tall with feet shoulder-width apart, arms held out for balance.',
    executionSteps: [
      'Hinge hips and bend knees, sitting down to parallel depth.',
      'Keep chest tall and heels glued to floor.',
      'Push through full foot to return to standing.'
    ],
    breathingCue: 'Inhale descending; exhale rising to standing.',
    commonMistakes: [
      'Rising onto toes.',
      'Letting knees cave inward.'
    ],
    easierVariation: 'Chair Squats',
    harderVariation: 'Jump Squats or Goblet Squats',
    safetyCautions: 'Great warmup and baseline mobility test.',
    recommendedSetsReps: '3 sets of 15–20 reps',
    recommendedRest: '45–60s',
    svgType: 'squat',
  },
  {
    id: 'glute_bridges',
    name: 'Floor Glute Bridges',
    category: 'Legs',
    targetMuscle: 'Glutes & Hamstrings (Spine Safe)',
    secondaryMuscles: ['Lower Back', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    startingPosition: 'Lie on back, knees bent, feet flat on floor hip-width apart, arms at sides.',
    executionSteps: [
      'Drive through heels and lift hips until thighs and torso align.',
      'Squeeze glutes hard at the top for 1–2 seconds.',
      'Lower hips slowly back to floor without losing core brace.'
    ],
    breathingCue: 'Exhale lifting hips; inhale lowering down.',
    commonMistakes: [
      'Overextending lower back at top instead of squeezing glutes.',
      'Pushing through toes instead of heels.'
    ],
    easierVariation: 'Double-Leg Floor Bridge with shorter hold',
    harderVariation: 'Single-Leg Glute Bridge or Barbell Hip Thrust',
    safetyCautions: '100% spine-safe; excellent for sedentary glute amnesia.',
    recommendedSetsReps: '3 sets of 12–15 reps',
    recommendedRest: '45–60s',
    svgType: 'rdl',
  },
  {
    id: 'standing_calf_raises',
    name: 'Standing Dumbbell Calf Raises',
    category: 'Legs',
    targetMuscle: 'Gastrocnemius & Calves',
    secondaryMuscles: ['Soleus', 'Ankle Stabilizers'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    startingPosition: 'Stand on edge of step with balls of feet; hold dumbbell in one hand for load.',
    executionSteps: [
      'Lower heels below step level for a full calf stretch.',
      'Press up onto big toes as high as possible.',
      'Hold peak calf squeeze for 1 second, then lower under control.'
    ],
    breathingCue: 'Exhale rising on toes; inhale lowering heels.',
    commonMistakes: [
      'Bouncing rapidly without pausing for the stretch and squeeze.',
      'Bending knees to cheat the movement.'
    ],
    easierVariation: 'Flat Floor Bodyweight Calf Raises',
    harderVariation: 'Single-Leg Standing Calf Raises with Dumbbell',
    safetyCautions: 'Hold onto a wall or sturdy rail for balance.',
    recommendedSetsReps: '3–4 sets of 12–15 reps',
    recommendedRest: '45–60s',
    svgType: 'squat',
  },
  {
    id: 'bodyweight_calf_raises',
    name: 'Single-Leg Bodyweight Calf Raises',
    category: 'Legs',
    targetMuscle: 'Calves & Ankle Stability',
    secondaryMuscles: ['Foot Intrinsic Muscles'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    startingPosition: 'Stand on one foot near a wall for balance, opposite foot hooked behind ankle.',
    executionSteps: [
      'Rise all the way onto ball of foot with locked straight leg.',
      'Pause at top for 1 full second.',
      'Lower heel slowly back to floor over 2 seconds.'
    ],
    breathingCue: 'Exhale rising up; inhale lowering down.',
    commonMistakes: [
      'Rushing through reps with bouncing.',
      'Rolling weight onto outside toes instead of big toe.'
    ],
    easierVariation: 'Double-Leg Bodyweight Calf Raises',
    harderVariation: 'Weighted Standing Calf Raises',
    safetyCautions: 'Builds robust Achilles tendons and ankle balance.',
    recommendedSetsReps: '3 sets of 15 reps per leg',
    recommendedRest: '45s',
    svgType: 'squat',
  },

  // ==========================================
  // ARMS
  // ==========================================
  {
    id: 'barbell_bicep_curl',
    name: 'Standing Barbell / EZ-Bar Bicep Curl',
    category: 'Arms',
    targetMuscle: 'Biceps Brachii',
    secondaryMuscles: ['Brachialis', 'Forearms'],
    equipment: 'Barbell',
    difficulty: 'Beginner',
    startingPosition: 'Stand tall holding barbell with underhand shoulder-width grip, elbows pinned to sides.',
    executionSteps: [
      'Curl bar upward toward shoulders while keeping elbows stationary.',
      'Squeeze biceps firmly at top of movement.',
      'Lower bar slowly over 2–3 seconds to full arm extension.'
    ],
    breathingCue: 'Exhale curling up; inhale lowering down under control.',
    commonMistakes: [
      'Swinging torso and hips backward to heave bar up.',
      'Letting elbows drift far forward, taking tension off biceps.'
    ],
    easierVariation: 'Dumbbell Hammer Curls or Cable Curls',
    harderVariation: 'Incline Dumbbell Bicep Curls or 21s',
    safetyCautions: 'Use an EZ-Curl bar if straight barbell causes wrist discomfort.',
    recommendedSetsReps: '3–4 sets of 8–12 reps',
    recommendedRest: '60s',
    svgType: 'curl',
  },
  {
    id: 'dumbbell_hammer_curl',
    name: 'Dumbbell Neutral Hammer Curl',
    category: 'Arms',
    targetMuscle: 'Brachialis & Forearms (Wrist Safe)',
    secondaryMuscles: ['Biceps Brachii'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    startingPosition: 'Stand tall with dumbbells hanging at sides, palms facing each other (neutral grip).',
    executionSteps: [
      'Pin elbows tight against ribcage.',
      'Curl dumbbells upward while keeping palms facing in.',
      'Lower weights smoothly over 2–3 seconds until arms are fully straight.'
    ],
    breathingCue: 'Exhale curling up; inhale lowering under control.',
    commonMistakes: [
      'Flaring elbows outward during curl.',
      'Using body momentum to swing weights.'
    ],
    easierVariation: 'Cable Rope Hammer Curls',
    harderVariation: 'Incline Bench Hammer Curls',
    safetyCautions: 'Neutral grip is gentle on wrists and prevents inner elbow strain.',
    recommendedSetsReps: '3–4 sets of 10–12 reps',
    recommendedRest: '60s',
    svgType: 'curl',
  },
  {
    id: 'incline_dumbbell_curl',
    name: 'Incline Dumbbell Bicep Curl',
    category: 'Arms',
    targetMuscle: 'Biceps Long Head (Maximum Stretch)',
    secondaryMuscles: ['Brachialis', 'Forearms'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    startingPosition: 'Sit on bench inclined to 45–60°, arms hanging straight down behind torso.',
    executionSteps: [
      'Curl dumbbells up while keeping upper arms pointed toward floor.',
      'Supinate wrists (turn palms up) as weights rise.',
      'Lower dumbbells slowly to feel deep bicep stretch at bottom.'
    ],
    breathingCue: 'Exhale curling up; inhale lowering into stretch.',
    commonMistakes: [
      'Swinging elbows forward to cheat the stretch.',
      'Setting bench too flat (<45°), straining anterior shoulder.'
    ],
    easierVariation: 'Standing Dumbbell Curl',
    harderVariation: 'Spider Curls (chest supported on incline bench)',
    safetyCautions: 'Incline curl produces intense long-head tension; start light.',
    recommendedSetsReps: '3 sets of 10–12 reps',
    recommendedRest: '60–75s',
    svgType: 'curl',
  },
  {
    id: 'triceps_rope_pushdown',
    name: 'Cable Triceps Rope Pushdown',
    category: 'Arms',
    targetMuscle: 'Lateral & Medial Triceps',
    secondaryMuscles: ['Anconeus', 'Forearms'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    startingPosition: 'Face high cable pulley, grip rope with neutral hands, elbows pinned to sides.',
    executionSteps: [
      'Extend forearms downward by contracting triceps.',
      'Spread rope ends outward at bottom for peak contraction.',
      'Slowly return rope until forearms are horizontal (90° bend).'
    ],
    breathingCue: 'Exhale pushing down; inhale as hands return up.',
    commonMistakes: [
      'Letting elbows swing forward and backward like a row.',
      'Hunching shoulders forward over the rope.'
    ],
    easierVariation: 'Straight Bar Triceps Pushdown',
    harderVariation: 'Overhead Cable Triceps Extension',
    safetyCautions: 'Keep wrists firm and locked; avoid wrist flexion at bottom.',
    recommendedSetsReps: '3–4 sets of 12–15 reps',
    recommendedRest: '60s',
    svgType: 'triceps',
  },
  {
    id: 'overhead_dumbbell_tricep_extension',
    name: 'Overhead Two-Arm Dumbbell Extension',
    category: 'Arms',
    targetMuscle: 'Triceps Long Head',
    secondaryMuscles: ['Triceps Lateral Head'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    startingPosition: 'Sit upright holding one dumbbell overhead with both hands cupping the upper plate.',
    executionSteps: [
      'Keep elbows pointing forward and lower dumbbell behind head.',
      'Descend until elbows are at 90° and you feel a deep triceps stretch.',
      'Extend arms back overhead to full lockout.'
    ],
    breathingCue: 'Inhale lowering behind head; exhale pressing overhead.',
    commonMistakes: [
      'Flaring elbows out wide, placing torque on elbow joints.',
      'Arching lower back off seat.'
    ],
    easierVariation: 'Cable Rope Overhead Extension',
    harderVariation: 'Single-Arm Overhead Dumbbell Extension',
    safetyCautions: 'Keep elbows tucked; do not let weight drop too deep behind neck.',
    recommendedSetsReps: '3 sets of 10–12 reps',
    recommendedRest: '60–75s',
    svgType: 'triceps',
  },
  {
    id: 'diamond_pushups',
    name: 'Diamond Close-Grip Push-Ups',
    category: 'Arms',
    targetMuscle: 'Triceps & Inner Chest',
    secondaryMuscles: ['Front Delts', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    startingPosition: 'Plank position with thumbs and index fingers touching under chest to form a diamond.',
    executionSteps: [
      'Lower chest toward diamond shape with elbows tracking close to ribs.',
      'Touch chest lightly to hands.',
      'Press firmly back to plank lockout using triceps.'
    ],
    breathingCue: 'Inhale lowering down; exhale pressing up.',
    commonMistakes: [
      'Flaring elbows out sideways instead of brushing ribcage.',
      'Sagging hips during the push.'
    ],
    easierVariation: 'Hands-Elevated Diamond Push-Ups or Knee Diamond Push-Ups',
    harderVariation: 'Feet-Elevated Diamond Push-Ups',
    safetyCautions: 'If wrists ache, widen hands slightly to shoulder-width close grip.',
    recommendedSetsReps: '3 sets of 8–12 reps',
    recommendedRest: '60s',
    svgType: 'triceps',
  },
  {
    id: 'bench_dips',
    name: 'Bench Tricep Dips',
    category: 'Arms',
    targetMuscle: 'Triceps Brachii',
    secondaryMuscles: ['Front Delts', 'Chest'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    startingPosition: 'Place hands on edge of bench behind you, fingers forward, feet extended in front.',
    executionSteps: [
      'Lower hips straight down by bending elbows to 90°.',
      'Keep back close to the bench edge throughout.',
      'Press through palms to push back up to straight arms.'
    ],
    breathingCue: 'Inhale lowering body; exhale pushing up.',
    commonMistakes: [
      'Letting hips drift far forward, overstretching front shoulders.',
      'Shrugging shoulders into ears at bottom.'
    ],
    easierVariation: 'Bend knees with feet flat on floor',
    harderVariation: 'Elevate feet on opposite bench or add lap plate',
    safetyCautions: 'Do not dip below 90° elbow bend to protect anterior shoulder capsule.',
    recommendedSetsReps: '3 sets of 10–12 reps',
    recommendedRest: '60s',
    svgType: 'triceps',
  },

  // ==========================================
  // CORE
  // ==========================================
  {
    id: 'hanging_knee_raises',
    name: 'Hanging Knee / Leg Raises',
    category: 'Core',
    targetMuscle: 'Rectus Abdominis & Lower Abs',
    secondaryMuscles: ['Hip Flexors', 'Forearm Grip'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    startingPosition: 'Hang from pull-up bar with overhand grip, shoulders engaged, legs straight down.',
    executionSteps: [
      'Tuck pelvis and raise knees up toward chest in a controlled curl.',
      'Hold knees tight at top for a 1-second abdominal squeeze.',
      'Lower legs slowly without letting body swing like a pendulum.'
    ],
    breathingCue: 'Exhale bringing knees to chest; inhale lowering legs down.',
    commonMistakes: [
      'Swinging body back and forth using momentum.',
      'Only flexing hips without curling pelvis upward.'
    ],
    easierVariation: 'Captains Chair Knee Raises or Lying Floor Reverse Crunches',
    harderVariation: 'Straight Leg Hanging Toes-to-Bar',
    safetyCautions: 'Control the descent completely to stop body swinging.',
    recommendedSetsReps: '3 sets of 10–15 reps',
    recommendedRest: '60s',
    svgType: 'plank',
  },
  {
    id: 'plank',
    name: 'Forearm Core Plank',
    category: 'Core',
    targetMuscle: 'Transverse Abdominis & Deep Stabilizers',
    secondaryMuscles: ['Glutes', 'Quads', 'Shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    startingPosition: 'Forearms on floor with elbows directly under shoulders, legs extended on toes.',
    executionSteps: [
      'Tuck pelvis into posterior tilt, forming straight line from head to heels.',
      'Push floor away through forearms to engage upper back.',
      'Squeeze abs, glutes, and quads simultaneously for duration of hold.'
    ],
    breathingCue: 'Maintain steady, shallow belly breaths while holding tension.',
    commonMistakes: [
      'Allowing hips to sag down, straining lower back.',
      'Piking hips into air and reducing core tension.'
    ],
    easierVariation: 'Kneeling Forearm Plank',
    harderVariation: 'RKC Maximum-Tension Plank or Plank with Shoulder Taps',
    safetyCautions: 'Stop if lower back sags or aches; tension quality beats duration.',
    recommendedSetsReps: '3 sets of 30–60 second holds',
    recommendedRest: '45–60s',
    svgType: 'plank',
  },
  {
    id: 'deadbug',
    name: 'Supine Dead Bug Core Stabilization',
    category: 'Core',
    targetMuscle: 'Deep Core (Spine Neutral)',
    secondaryMuscles: ['Pelvic Floor', 'Hip Flexors'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    startingPosition: 'Lie on back, arms pointing to ceiling, knees bent at 90° above hips.',
    executionSteps: [
      'Press lower back flat into floor (zero gap under spine).',
      'Slowly lower right arm and left leg toward floor while maintaining flat back.',
      'Return to center and repeat with opposite arm and leg.'
    ],
    breathingCue: 'Exhale extending limbs; inhale returning to center.',
    commonMistakes: [
      'Letting lower back arch off floor as leg extends.',
      'Moving limbs too fast and losing core brace.'
    ],
    easierVariation: 'Tap heels to floor with bent knees instead of extending leg straight',
    harderVariation: 'Hold light dumbbells or yoga block against knees',
    safetyCautions: 'Gold-standard spine-safe rehab exercise for lower back protection.',
    recommendedSetsReps: '3 sets of 8–10 reps per side',
    recommendedRest: '45s',
    svgType: 'plank',
  },
];
