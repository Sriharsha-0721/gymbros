// EXERCISE MEDIA & ANATOMICAL HIGHLIGHT MAPPINGS
// Sourced from licensed ExerciseDB / GymVisual community dataset
// Provides high-resolution animated GIFs, static poster fallbacks, and anatomical muscle highlighting

export type AnatomyMuscle =
  | 'chest'
  | 'front_delts'
  | 'side_delts'
  | 'rear_delts'
  | 'traps'
  | 'rhomboids'
  | 'lats'
  | 'lower_back'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'glutes'
  | 'quads'
  | 'hamstrings'
  | 'calves';

export interface ExerciseMediaRecord {
  id: string;
  datasetId: string;
  name: string;
  targetMuscle: string;
  secondaryMuscles: string[];
  gifUrl: string;
  posterUrl: string;
  primaryAnatomy: AnatomyMuscle[];
  secondaryAnatomy: AnatomyMuscle[];
  attribution: string;
}

export const EXERCISE_MEDIA_DATABASE: Record<string, ExerciseMediaRecord> = {
  'barbell_bench_press': {
    id: 'barbell_bench_press',
    datasetId: '0025',
    name: 'barbell bench press',
    targetMuscle: 'pectorals',
    secondaryMuscles: ["triceps","shoulders"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0025-EIeI8Vf.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0025-EIeI8Vf.jpg',
    primaryAnatomy: ["chest"],
    secondaryAnatomy: ["front_delts","triceps"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'dumbbell_bench_press': {
    id: 'dumbbell_bench_press',
    datasetId: '0289',
    name: 'dumbbell bench press',
    targetMuscle: 'pectorals',
    secondaryMuscles: ["triceps","shoulders"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0289-SpYC0Kp.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0289-SpYC0Kp.jpg',
    primaryAnatomy: ["chest"],
    secondaryAnatomy: ["front_delts","triceps"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'incline_dumbbell_press': {
    id: 'incline_dumbbell_press',
    datasetId: '0314',
    name: 'dumbbell incline bench press',
    targetMuscle: 'pectorals',
    secondaryMuscles: ["shoulders","triceps"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0314-ns0SIbU.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0314-ns0SIbU.jpg',
    primaryAnatomy: ["chest"],
    secondaryAnatomy: ["front_delts","triceps"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'machine_chest_press': {
    id: 'machine_chest_press',
    datasetId: '0577',
    name: 'lever chest press',
    targetMuscle: 'pectorals',
    secondaryMuscles: ["triceps","shoulders"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0577-T0yTjgW.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0577-T0yTjgW.jpg',
    primaryAnatomy: ["chest"],
    secondaryAnatomy: ["front_delts","triceps"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'cable_chest_flyes': {
    id: 'cable_chest_flyes',
    datasetId: '0227',
    name: 'cable standing fly',
    targetMuscle: 'pectorals',
    secondaryMuscles: ["deltoids","triceps"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0227-Pr9Rhf4.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0227-Pr9Rhf4.jpg',
    primaryAnatomy: ["chest"],
    secondaryAnatomy: ["front_delts","triceps"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'dumbbell_flyes': {
    id: 'dumbbell_flyes',
    datasetId: '0308',
    name: 'dumbbell fly',
    targetMuscle: 'pectorals',
    secondaryMuscles: ["shoulders"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0308-yz9nUhF.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0308-yz9nUhF.jpg',
    primaryAnatomy: ["chest"],
    secondaryAnatomy: ["front_delts","triceps"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'pushups': {
    id: 'pushups',
    datasetId: '0662',
    name: 'push-up',
    targetMuscle: 'pectorals',
    secondaryMuscles: ["triceps","deltoids","core"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0662-I4hDWkc.jpg',
    primaryAnatomy: ["chest"],
    secondaryAnatomy: ["front_delts","triceps"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'incline_pushups': {
    id: 'incline_pushups',
    datasetId: '0493',
    name: 'incline push-up',
    targetMuscle: 'pectorals',
    secondaryMuscles: ["triceps","shoulders"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0493-B1EVP9F.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0493-B1EVP9F.jpg',
    primaryAnatomy: ["chest"],
    secondaryAnatomy: ["front_delts","triceps"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'overhead_barbell_press': {
    id: 'overhead_barbell_press',
    datasetId: '1456',
    name: 'barbell standing close grip military press',
    targetMuscle: 'delts',
    secondaryMuscles: ["triceps","upper back"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1456-wdRZISl.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/1456-wdRZISl.jpg',
    primaryAnatomy: ["front_delts"],
    secondaryAnatomy: ["triceps","side_delts","traps"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'seated_dumbbell_shoulder_press': {
    id: 'seated_dumbbell_shoulder_press',
    datasetId: '0405',
    name: 'dumbbell seated shoulder press',
    targetMuscle: 'delts',
    secondaryMuscles: ["triceps","upper back"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0405-znQUdHY.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0405-znQUdHY.jpg',
    primaryAnatomy: ["front_delts"],
    secondaryAnatomy: ["triceps","side_delts","traps"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'lateral_raises': {
    id: 'lateral_raises',
    datasetId: '0334',
    name: 'dumbbell lateral raise',
    targetMuscle: 'delts',
    secondaryMuscles: ["traps"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0334-DsgkuIt.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0334-DsgkuIt.jpg',
    primaryAnatomy: ["side_delts"],
    secondaryAnatomy: ["traps"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'cable_lateral_raises': {
    id: 'cable_lateral_raises',
    datasetId: '0178',
    name: 'cable lateral raise',
    targetMuscle: 'delts',
    secondaryMuscles: ["traps","triceps"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0178-goJ6ezq.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0178-goJ6ezq.jpg',
    primaryAnatomy: ["side_delts"],
    secondaryAnatomy: ["traps"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'face_pulls': {
    id: 'face_pulls',
    datasetId: '0203',
    name: 'cable rear delt row (with rope)',
    targetMuscle: 'delts',
    secondaryMuscles: ["trapezius","rhomboids","biceps"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0203-wqNPGCg.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0203-wqNPGCg.jpg',
    primaryAnatomy: ["rear_delts"],
    secondaryAnatomy: ["traps","rhomboids","biceps"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'dumbbell_rear_delt_flyes': {
    id: 'dumbbell_rear_delt_flyes',
    datasetId: '0380',
    name: 'dumbbell rear lateral raise',
    targetMuscle: 'delts',
    secondaryMuscles: ["traps","rhomboids"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0380-v1qBec9.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0380-v1qBec9.jpg',
    primaryAnatomy: ["rear_delts"],
    secondaryAnatomy: ["traps","rhomboids","biceps"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'pike_pushups': {
    id: 'pike_pushups',
    datasetId: '0279',
    name: 'decline push-up',
    targetMuscle: 'pectorals',
    secondaryMuscles: ["triceps","shoulders"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0279-i5cEhka.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0279-i5cEhka.jpg',
    primaryAnatomy: ["front_delts"],
    secondaryAnatomy: ["triceps","side_delts","traps"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'pullups': {
    id: 'pullups',
    datasetId: '0652',
    name: 'pull-up',
    targetMuscle: 'lats',
    secondaryMuscles: ["biceps","forearms"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0652-lBDjFxJ.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0652-lBDjFxJ.jpg',
    primaryAnatomy: ["lats"],
    secondaryAnatomy: ["biceps","rhomboids","forearms"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'lat_pulldown': {
    id: 'lat_pulldown',
    datasetId: '0198',
    name: 'cable pulldown',
    targetMuscle: 'lats',
    secondaryMuscles: ["biceps","forearms"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0198-RVwzP10.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0198-RVwzP10.jpg',
    primaryAnatomy: ["lats"],
    secondaryAnatomy: ["biceps","rhomboids","forearms"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'barbell_bent_row': {
    id: 'barbell_bent_row',
    datasetId: '0027',
    name: 'barbell bent over row',
    targetMuscle: 'upper back',
    secondaryMuscles: ["biceps","forearms"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0027-eZyBC3j.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0027-eZyBC3j.jpg',
    primaryAnatomy: ["lats","rhomboids"],
    secondaryAnatomy: ["biceps","rear_delts","forearms"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'chest_supported_row': {
    id: 'chest_supported_row',
    datasetId: '0327',
    name: 'dumbbell incline row',
    targetMuscle: 'upper back',
    secondaryMuscles: ["biceps","shoulders"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0327-7vG5o25.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0327-7vG5o25.jpg',
    primaryAnatomy: ["lats","rhomboids"],
    secondaryAnatomy: ["biceps","rear_delts","forearms"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'single_arm_dumbbell_row': {
    id: 'single_arm_dumbbell_row',
    datasetId: '0292',
    name: 'dumbbell one arm bent-over row',
    targetMuscle: 'upper back',
    secondaryMuscles: ["biceps","forearms"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0292-C0MA9bC.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0292-C0MA9bC.jpg',
    primaryAnatomy: ["lats","rhomboids"],
    secondaryAnatomy: ["biceps","rear_delts","forearms"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'cable_seated_row': {
    id: 'cable_seated_row',
    datasetId: '0861',
    name: 'cable seated row',
    targetMuscle: 'upper back',
    secondaryMuscles: ["biceps","forearms"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0861-fUBheHs.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0861-fUBheHs.jpg',
    primaryAnatomy: ["lats","rhomboids"],
    secondaryAnatomy: ["biceps","rear_delts","forearms"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'inverted_rows': {
    id: 'inverted_rows',
    datasetId: '0499',
    name: 'inverted row',
    targetMuscle: 'upper back',
    secondaryMuscles: ["biceps","forearms"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0499-bZGHsAZ.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0499-bZGHsAZ.jpg',
    primaryAnatomy: ["lats","rhomboids"],
    secondaryAnatomy: ["biceps","rear_delts","forearms"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'barbell_back_squat': {
    id: 'barbell_back_squat',
    datasetId: '0043',
    name: 'barbell full squat',
    targetMuscle: 'glutes',
    secondaryMuscles: ["quadriceps","hamstrings","calves","core"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0043-qXTaZnJ.jpg',
    primaryAnatomy: ["quads"],
    secondaryAnatomy: ["glutes","calves","hamstrings"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'goblet_squat': {
    id: 'goblet_squat',
    datasetId: '1760',
    name: 'dumbbell goblet squat',
    targetMuscle: 'quads',
    secondaryMuscles: ["glutes","hamstrings","calves"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1760-yn8yg1r.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/1760-yn8yg1r.jpg',
    primaryAnatomy: ["quads"],
    secondaryAnatomy: ["glutes","calves","hamstrings"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'romanian_deadlift': {
    id: 'romanian_deadlift',
    datasetId: '0085',
    name: 'barbell romanian deadlift',
    targetMuscle: 'hamstrings & gluteal chain',
    secondaryMuscles: ["lower back", "lats"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0085-wQ2c4XD.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0085-wQ2c4XD.jpg',
    primaryAnatomy: ["hamstrings", "glutes"],
    secondaryAnatomy: ["lower_back"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'leg_press': {
    id: 'leg_press',
    datasetId: '1463',
    name: 'sled 45° leg press (side pov)',
    targetMuscle: 'glutes',
    secondaryMuscles: ["quadriceps","hamstrings","calves"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1463-2Qh2J1e.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/1463-2Qh2J1e.jpg',
    primaryAnatomy: ["quads"],
    secondaryAnatomy: ["glutes","calves","hamstrings"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'lying_leg_curls': {
    id: 'lying_leg_curls',
    datasetId: '0586',
    name: 'lever lying leg curl',
    targetMuscle: 'hamstrings',
    secondaryMuscles: ["calves"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0586-17lJ1kr.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0586-17lJ1kr.jpg',
    primaryAnatomy: ["hamstrings"],
    secondaryAnatomy: ["glutes","lower_back"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'bulgarian_split_squat': {
    id: 'bulgarian_split_squat',
    datasetId: '0410',
    name: 'dumbbell single leg split squat',
    targetMuscle: 'quads',
    secondaryMuscles: ["glutes","hamstrings","calves"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0410-qx4fgX7.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0410-qx4fgX7.jpg',
    primaryAnatomy: ["quads","glutes"],
    secondaryAnatomy: ["hamstrings","calves"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'lunges': {
    id: 'lunges',
    datasetId: '0336',
    name: 'dumbbell lunge',
    targetMuscle: 'glutes',
    secondaryMuscles: ["quadriceps","hamstrings","calves"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0336-RRWFUcw.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0336-RRWFUcw.jpg',
    primaryAnatomy: ["quads","glutes"],
    secondaryAnatomy: ["hamstrings","calves"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'bodyweight_squats': {
    id: 'bodyweight_squats',
    datasetId: '3119',
    name: 'potty squat',
    targetMuscle: 'abs',
    secondaryMuscles: ["quadriceps","glutes"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3119-75Bgtjy.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/3119-75Bgtjy.jpg',
    primaryAnatomy: ["quads"],
    secondaryAnatomy: ["glutes","calves","hamstrings"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'glute_bridges': {
    id: 'glute_bridges',
    datasetId: '1409',
    name: 'barbell glute bridge',
    targetMuscle: 'glutes',
    secondaryMuscles: ["hamstrings","lower back"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1409-qKBpF7I.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/1409-qKBpF7I.jpg',
    primaryAnatomy: ["glutes"],
    secondaryAnatomy: ["hamstrings","lower_back"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'standing_calf_raises': {
    id: 'standing_calf_raises',
    datasetId: '0417',
    name: 'dumbbell standing calf raise',
    targetMuscle: 'calves',
    secondaryMuscles: ["ankles"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0417-dPmaUaU.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0417-dPmaUaU.jpg',
    primaryAnatomy: ["calves"],
    secondaryAnatomy: [],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'bodyweight_calf_raises': {
    id: 'bodyweight_calf_raises',
    datasetId: '1372',
    name: 'barbell standing calf raise',
    targetMuscle: 'calves',
    secondaryMuscles: ["hamstrings","glutes"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1372-8ozhUIZ.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/1372-8ozhUIZ.jpg',
    primaryAnatomy: ["calves"],
    secondaryAnatomy: [],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'barbell_bicep_curl': {
    id: 'barbell_bicep_curl',
    datasetId: '0031',
    name: 'barbell curl',
    targetMuscle: 'biceps',
    secondaryMuscles: ["forearms"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0031-25GPyDY.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0031-25GPyDY.jpg',
    primaryAnatomy: ["biceps"],
    secondaryAnatomy: ["forearms"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'dumbbell_hammer_curl': {
    id: 'dumbbell_hammer_curl',
    datasetId: '0313',
    name: 'dumbbell hammer curl',
    targetMuscle: 'biceps',
    secondaryMuscles: ["forearms"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0313-slDvUAU.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0313-slDvUAU.jpg',
    primaryAnatomy: ["biceps"],
    secondaryAnatomy: ["forearms"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'incline_dumbbell_curl': {
    id: 'incline_dumbbell_curl',
    datasetId: '0318',
    name: 'dumbbell incline curl',
    targetMuscle: 'biceps',
    secondaryMuscles: ["forearms"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0318-ae9UoXQ.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0318-ae9UoXQ.jpg',
    primaryAnatomy: ["biceps"],
    secondaryAnatomy: ["forearms"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'triceps_rope_pushdown': {
    id: 'triceps_rope_pushdown',
    datasetId: '0200',
    name: 'cable pushdown (with rope attachment)',
    targetMuscle: 'triceps',
    secondaryMuscles: ["forearms"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0200-dU605di.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0200-dU605di.jpg',
    primaryAnatomy: ["triceps"],
    secondaryAnatomy: ["chest","front_delts"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'overhead_dumbbell_tricep_extension': {
    id: 'overhead_dumbbell_tricep_extension',
    datasetId: '2188',
    name: 'dumbbell seated triceps extension',
    targetMuscle: 'triceps',
    secondaryMuscles: ["shoulders"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2188-kont8Ut.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/2188-kont8Ut.jpg',
    primaryAnatomy: ["triceps"],
    secondaryAnatomy: ["chest","front_delts"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'diamond_pushups': {
    id: 'diamond_pushups',
    datasetId: '0283',
    name: 'diamond push-up',
    targetMuscle: 'triceps',
    secondaryMuscles: ["chest","shoulders"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0283-soIB2rj.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0283-soIB2rj.jpg',
    primaryAnatomy: ["triceps"],
    secondaryAnatomy: ["chest","front_delts"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'bench_dips': {
    id: 'bench_dips',
    datasetId: '0129',
    name: 'bench dip (knees bent)',
    targetMuscle: 'triceps',
    secondaryMuscles: ["chest","shoulders"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0129-RrLske5.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0129-RrLske5.jpg',
    primaryAnatomy: ["triceps"],
    secondaryAnatomy: ["chest","front_delts"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'hanging_knee_raises': {
    id: 'hanging_knee_raises',
    datasetId: '0011',
    name: 'assisted hanging knee raise',
    targetMuscle: 'abs',
    secondaryMuscles: ["hip flexors"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0011-03lzqwk.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0011-03lzqwk.jpg',
    primaryAnatomy: ["abs"],
    secondaryAnatomy: ["obliques","lower_back"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'plank': {
    id: 'plank',
    datasetId: '0464',
    name: 'front plank with twist',
    targetMuscle: 'abs',
    secondaryMuscles: ["obliques","shoulders"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0464-CosupLu.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0464-CosupLu.jpg',
    primaryAnatomy: ["abs"],
    secondaryAnatomy: ["obliques","lower_back"],
    attribution: '© Gym visual — https://gymvisual.com/'
  },
  'deadbug': {
    id: 'deadbug',
    datasetId: '0276',
    name: 'dead bug',
    targetMuscle: 'abs',
    secondaryMuscles: ["hip flexors","lower back"],
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0276-iny3m5y.gif',
    posterUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0276-iny3m5y.jpg',
    primaryAnatomy: ["abs"],
    secondaryAnatomy: ["obliques","lower_back"],
    attribution: '© Gym visual — https://gymvisual.com/'
  }
};

export const resolveAnatomyMuscles = (text: string): AnatomyMuscle[] => {
  const clean = text.toLowerCase();
  const matched: AnatomyMuscle[] = [];

  if (clean.includes('chest') || clean.includes('pectoral') || clean.includes('pec')) matched.push('chest');
  if (clean.includes('front delt') || clean.includes('anterior delt')) matched.push('front_delts');
  if (clean.includes('side delt') || clean.includes('lateral delt') || clean.includes('lateral raise')) matched.push('side_delts');
  if (clean.includes('rear delt') || clean.includes('posterior delt') || clean.includes('face pull')) matched.push('rear_delts');
  if (clean.includes('trap') || clean.includes('rhomboid') || clean.includes('upper back')) {
    if (clean.includes('rhomboid')) matched.push('rhomboids');
    matched.push('traps');
  }
  if (clean.includes('lat') || clean.includes('pulldown') || clean.includes('pull-up') || clean.includes('pullup')) matched.push('lats');
  if (clean.includes('lower back') || clean.includes('erector') || clean.includes('lumbar')) matched.push('lower_back');
  if (clean.includes('bicep') || clean.includes('brachii')) matched.push('biceps');
  if (clean.includes('tricep')) matched.push('triceps');
  if (clean.includes('forearm') || clean.includes('wrist') || clean.includes('grip')) matched.push('forearms');
  if (clean.includes('ab') || clean.includes('core') || clean.includes('crunches') || clean.includes('plank')) matched.push('abs');
  if (clean.includes('oblique')) matched.push('obliques');
  if (clean.includes('glute') || clean.includes('hip')) matched.push('glutes');
  if (clean.includes('quad') || clean.includes('squat') || clean.includes('leg press') || clean.includes('leg extension')) matched.push('quads');
  if (clean.includes('hamstring') || clean.includes('rdl') || clean.includes('deadlift') || clean.includes('leg curl')) matched.push('hamstrings');
  if (clean.includes('calf') || clean.includes('calves') || clean.includes('gastrocnemius') || clean.includes('soleus')) matched.push('calves');

  // Shoulder catch-all if neither front/side/rear specified
  if ((clean.includes('shoulder') || clean.includes('deltoid')) && !matched.some(m => ['front_delts', 'side_delts', 'rear_delts'].includes(m))) {
    matched.push('front_delts', 'side_delts');
  }

  return Array.from(new Set(matched));
};

export const getExerciseMedia = (exerciseId: string, exerciseName?: string): ExerciseMediaRecord | null => {
  if (EXERCISE_MEDIA_DATABASE[exerciseId]) {
    return EXERCISE_MEDIA_DATABASE[exerciseId];
  }
  if (exerciseName) {
    const clean = exerciseName.toLowerCase();
    for (const [key, record] of Object.entries(EXERCISE_MEDIA_DATABASE)) {
      if (clean.includes(key) || key.includes(clean) || clean.includes(record.name)) {
        return record;
      }
    }

    // Dynamic anatomical fallback for any custom or new exercise in the database
    const resolvedPrimary = resolveAnatomyMuscles(exerciseName);
    if (resolvedPrimary.length > 0) {
      return {
        id: exerciseId,
        datasetId: 'custom',
        name: exerciseName,
        targetMuscle: exerciseName,
        secondaryMuscles: [],
        gifUrl: '',
        posterUrl: '',
        primaryAnatomy: resolvedPrimary,
        secondaryAnatomy: [],
        attribution: 'GYMCREW Anatomical Engine'
      };
    }
  }
  return null;
};

