export type Exercise = {
  id: string;
  name: string;
  group: string[];
  category: string[];
  primary: string[];
  secondary: string[];
  equipment: string[];
  pattern: string;
  tags: string[];
};

function getGroup(id: string, category: string[]): string[] {
  const prefix = id.split("_")[0];
  switch (prefix) {
    case "chest": return ["chest"];
    case "shoulder": return ["shoulders"];
    case "back": return ["back"];
    case "trap": return ["traps"];
    case "biceps": return ["biceps"];
    case "triceps": return ["triceps"];
    case "quad": return ["quads"];
    case "calves": return ["calves"];
    case "core": return ["core"];
    case "full": return ["full_body"];
    case "posterior": {
      const g: string[] = [];
      if (category.includes("glutes")) g.push("glutes");
      if (category.includes("hamstrings") || category.includes("legs")) g.push("hamstrings");
      return g.length > 0 ? Array.from(new Set(g)) : ["hamstrings", "glutes"];
    }
    default: return [prefix];
  }
}

const RAW = `chest_001|Barbell Bench Press|chest|chest|triceps,front_delts|bb,bench|horizontal_press|compound,bilateral,strength
chest_002|Close-Grip Barbell Bench Press|chest,triceps|triceps,chest|front_delts|bb,bench|horizontal_press|compound,bilateral,strength
chest_003|Wide-Grip Barbell Bench Press|chest|chest|front_delts,triceps|bb,bench|horizontal_press|compound,bilateral,hypertrophy
chest_004|Incline Barbell Bench Press|chest|upper_chest|front_delts,triceps|bb,bench|horizontal_press|compound,bilateral,strength
chest_005|Decline Barbell Bench Press|chest|lower_chest|triceps,front_delts|bb,bench|horizontal_press|compound,bilateral
chest_006|Dumbbell Bench Press|chest|chest|triceps,front_delts|db,bench|horizontal_press|compound,bilateral
chest_007|Incline Dumbbell Bench Press|chest|upper_chest|front_delts,triceps|db,bench|horizontal_press|compound,bilateral
chest_008|Decline Dumbbell Bench Press|chest|lower_chest|triceps|db,bench|horizontal_press|compound,bilateral
chest_009|Dumbbell Floor Press|chest|chest,triceps|front_delts|db|horizontal_press|compound,bilateral
chest_010|Single-Arm Dumbbell Bench Press|chest|chest|core,triceps|db,bench|horizontal_press|compound,unilateral
chest_011|Alternating Dumbbell Bench Press|chest|chest|triceps,core|db,bench|horizontal_press|compound,unilateral
chest_012|Machine Chest Press|chest|chest|triceps,front_delts|machine|horizontal_press|compound,beginner
chest_013|Incline Machine Chest Press|chest|upper_chest|front_delts,triceps|machine|horizontal_press|compound,beginner
chest_014|Smith Machine Bench Press|chest|chest|triceps,front_delts|smith,bench|horizontal_press|compound,bilateral
chest_015|Smith Machine Incline Bench Press|chest|upper_chest|front_delts,triceps|smith,bench|horizontal_press|compound,bilateral
chest_016|Cable Chest Press|chest|chest|triceps,front_delts|cable|horizontal_press|compound
chest_017|Standing Cable Chest Press|chest|chest|core,triceps|cable|horizontal_press|compound
chest_018|Dumbbell Fly|chest|chest|front_delts|db,bench|fly|isolation
chest_019|Incline Dumbbell Fly|chest|upper_chest|front_delts|db,bench|fly|isolation
chest_020|Decline Dumbbell Fly|chest|lower_chest|front_delts|db,bench|fly|isolation
chest_021|Cable Fly Mid|chest|chest|front_delts|cable|fly|isolation
chest_022|Low-to-High Cable Fly|chest|upper_chest|front_delts|cable|fly|isolation
chest_023|High-to-Low Cable Fly|chest|lower_chest|front_delts|cable|fly|isolation
chest_024|Pec Deck Fly|chest|chest|front_delts|machine|fly|isolation,beginner
chest_025|Plate Squeeze Press|chest|chest|triceps,front_delts|plate,bench|horizontal_press|isolation
chest_026|Dumbbell Squeeze Press|chest|chest|triceps|db,bench|horizontal_press|isolation
chest_027|Landmine Chest Press|chest|upper_chest|shoulders,triceps|landmine|horizontal_press|compound
chest_028|Single-Arm Landmine Press|chest,shoulders|upper_chest,front_delts|triceps,core|landmine|horizontal_press|compound,unilateral
chest_029|Weighted Push-Up|chest|chest|triceps,front_delts|plate,bw|horizontal_press|compound
chest_030|Deficit Push-Up|chest|chest|triceps,front_delts|bw|horizontal_press|compound
chest_031|Feet-Elevated Push-Up|chest|upper_chest|triceps,front_delts|bw,bench|horizontal_press|compound
chest_032|Weighted Chest Dip|chest|lower_chest|triceps,front_delts|dip_station,plate|horizontal_press|compound
chest_033|Assisted Chest Dip|chest|lower_chest|triceps|machine|horizontal_press|compound,beginner
chest_034|Cable Pullover|chest,back|chest,lats|serratus|cable|extension|isolation
chest_035|Dumbbell Pullover|chest,back|chest,lats|serratus|db,bench|extension|isolation
shoulder_001|Standing Barbell Overhead Press|shoulders|front_delts,side_delts|triceps,core|bb|vertical_press|compound,strength
shoulder_002|Seated Barbell Overhead Press|shoulders|front_delts,side_delts|triceps|bb,bench|vertical_press|compound
shoulder_003|Push Press|shoulders|shoulders|triceps,legs,core|bb|vertical_press|compound,power
shoulder_004|Behind-Neck Press|shoulders|side_delts|triceps|bb|vertical_press|advanced
shoulder_005|Dumbbell Shoulder Press|shoulders|front_delts,side_delts|triceps|db,bench|vertical_press|compound
shoulder_006|Seated Dumbbell Shoulder Press|shoulders|front_delts,side_delts|triceps|db,bench|vertical_press|compound
shoulder_007|Arnold Press|shoulders|front_delts,side_delts|triceps|db,bench|vertical_press|compound
shoulder_008|Single-Arm Dumbbell Shoulder Press|shoulders|shoulders|triceps,core|db|vertical_press|compound,unilateral
shoulder_009|Machine Shoulder Press|shoulders|front_delts,side_delts|triceps|machine|vertical_press|compound,beginner
shoulder_010|Smith Machine Shoulder Press|shoulders|front_delts,side_delts|triceps|smith,bench|vertical_press|compound
shoulder_011|Landmine Shoulder Press|shoulders|front_delts|upper_chest,triceps|landmine|vertical_press|compound
shoulder_012|Half-Kneeling Landmine Press|shoulders|front_delts|core,triceps|landmine|vertical_press|compound,unilateral
shoulder_013|Cable Shoulder Press|shoulders|front_delts,side_delts|triceps|cable|vertical_press|compound
shoulder_014|Dumbbell Lateral Raise|shoulders|side_delts|traps|db|raise|isolation
shoulder_015|Cable Lateral Raise|shoulders|side_delts|traps|cable|raise|isolation
shoulder_016|Leaning Cable Lateral Raise|shoulders|side_delts|traps|cable|raise|isolation
shoulder_017|Machine Lateral Raise|shoulders|side_delts|traps|machine|raise|isolation,beginner
shoulder_018|Seated Dumbbell Lateral Raise|shoulders|side_delts|traps|db,bench|raise|isolation
shoulder_019|Dumbbell Front Raise|shoulders|front_delts|upper_chest|db|raise|isolation
shoulder_020|Plate Front Raise|shoulders|front_delts|upper_chest|plate|raise|isolation
shoulder_021|Cable Front Raise|shoulders|front_delts|upper_chest|cable|raise|isolation
shoulder_022|Barbell Front Raise|shoulders|front_delts|upper_chest|bb|raise|isolation
shoulder_023|Rear Delt Dumbbell Fly|shoulders|rear_delts|traps,rhomboids|db,bench|fly|isolation
shoulder_024|Bent-Over Rear Delt Raise|shoulders|rear_delts|traps,rhomboids|db|fly|isolation
shoulder_025|Cable Rear Delt Fly|shoulders|rear_delts|traps,rhomboids|cable|fly|isolation
shoulder_026|Reverse Pec Deck|shoulders|rear_delts|traps,rhomboids|machine|fly|isolation,beginner
shoulder_027|Face Pull|shoulders,upper_back|rear_delts|traps,rotator_cuff|cable|row|isolation
shoulder_028|Cable Y Raise|shoulders|lower_traps,rear_delts|rotator_cuff|cable|raise|isolation
shoulder_029|Dumbbell Y Raise|shoulders|lower_traps,rear_delts|rotator_cuff|db,bench|raise|isolation
shoulder_030|Cuban Press|shoulders|rotator_cuff,delts|traps|db|vertical_press|intermediate
shoulder_031|Cable External Rotation|shoulders|rotator_cuff|rear_delts|cable|rotation|isolation
shoulder_032|Dumbbell External Rotation|shoulders|rotator_cuff|rear_delts|db|rotation|isolation
shoulder_033|Upright Row|shoulders,traps|side_delts,traps|biceps|bb|row|compound
shoulder_034|Cable Upright Row|shoulders,traps|side_delts,traps|biceps|cable|row|compound
shoulder_035|Dumbbell Upright Row|shoulders,traps|side_delts,traps|biceps|db|row|compound
back_001|Conventional Deadlift|back,legs|posterior_chain|traps,hamstrings,glutes,core|bb|hinge|compound,strength
back_002|Rack Pull|back|spinal_erectors,traps|glutes,hamstrings|bb,rack|hinge|compound,strength
back_003|Deficit Deadlift|back,legs|posterior_chain|hamstrings,glutes,core|bb|hinge|compound,advanced
back_004|Snatch-Grip Deadlift|back,legs|upper_back,posterior_chain|hamstrings,glutes|bb|hinge|compound,advanced
back_005|Romanian Deadlift|back,legs|hamstrings,glutes|spinal_erectors|bb|hinge|compound
back_006|Dumbbell Romanian Deadlift|back,legs|hamstrings,glutes|spinal_erectors|db|hinge|compound
back_007|Trap Bar Deadlift|back,legs|glutes,quads,back|hamstrings,core|trapbar|hinge|compound,strength
back_008|Barbell Bent-Over Row|back|lats,mid_back|biceps,rear_delts|bb|row|compound
back_009|Pendlay Row|back|mid_back,lats|biceps,rear_delts|bb|row|compound,strength
back_010|Underhand Barbell Row|back|lats|biceps,mid_back|bb|row|compound
back_011|T-Bar Row|back|mid_back,lats|biceps,rear_delts|machine,landmine|row|compound
back_012|Chest-Supported T-Bar Row|back|mid_back,lats|biceps,rear_delts|machine|row|compound
back_013|Dumbbell Row|back|lats,mid_back|biceps,rear_delts|db,bench|row|compound,unilateral
back_014|Chest-Supported Dumbbell Row|back|mid_back,lats|biceps,rear_delts|db,bench|row|compound
back_015|Incline Dumbbell Row|back|mid_back,lats|rear_delts,biceps|db,bench|row|compound
back_016|Single-Arm Cable Row|back|lats,mid_back|biceps,core|cable|row|compound,unilateral
back_017|Seated Cable Row Neutral Grip|back|mid_back,lats|biceps,rear_delts|cable|row|compound
back_018|Seated Cable Row Wide Grip|back|mid_back,rear_delts|biceps,lats|cable|row|compound
back_019|Seated Cable Row Underhand|back|lats|biceps,mid_back|cable|row|compound
back_020|Machine Row|back|mid_back,lats|biceps,rear_delts|machine|row|compound,beginner
back_021|Hammer Strength Row|back|lats,mid_back|biceps,rear_delts|machine|row|compound
back_022|Meadows Row|back|lats,mid_back|biceps,rear_delts|landmine|row|compound,unilateral
back_023|Landmine Row|back|mid_back,lats|biceps,rear_delts|landmine|row|compound
back_024|Inverted Row|back|mid_back,lats|biceps,core|bw,bar|row|compound
back_025|Weighted Inverted Row|back|mid_back,lats|biceps,core|plate,bw,bar|row|compound
back_026|Pull-Up|back|lats|biceps,mid_back|bw|vertical_pull|compound
back_027|Weighted Pull-Up|back|lats|biceps,mid_back|plate,bw|vertical_pull|compound,strength
back_028|Chin-Up|back,biceps|lats,biceps|mid_back|bw|vertical_pull|compound
back_029|Weighted Chin-Up|back,biceps|lats,biceps|mid_back|plate,bw|vertical_pull|compound,strength
back_030|Assisted Pull-Up|back|lats|biceps,mid_back|machine|vertical_pull|compound,beginner
back_031|Lat Pulldown Wide Grip|back|lats|biceps,mid_back|cable|vertical_pull|compound
back_032|Lat Pulldown Neutral Grip|back|lats|biceps,mid_back|cable|vertical_pull|compound
back_033|Lat Pulldown Underhand|back|lats,biceps|mid_back|cable|vertical_pull|compound
back_034|Single-Arm Lat Pulldown|back|lats|biceps,core|cable|vertical_pull|compound,unilateral
back_035|Straight-Arm Pulldown|back|lats|chest,core|cable|extension|isolation
back_036|Machine Pullover|back|lats|chest|machine|extension|isolation
back_037|Dumbbell Pullover|back,chest|lats,chest|serratus|db,bench|extension|isolation
back_038|Cable Pullover|back,chest|lats,chest|serratus|cable|extension|isolation
back_039|Back Extension|back|spinal_erectors|glutes,hamstrings|bw,machine|hinge|compound
back_040|Weighted Back Extension|back|spinal_erectors|glutes,hamstrings|plate,machine|hinge|compound
back_041|Reverse Hyperextension|back,glutes|glutes,spinal_erectors|hamstrings|machine|hinge|compound
back_042|Good Morning|back,legs|hamstrings,spinal_erectors|glutes|bb|hinge|compound,advanced
back_043|Seated Good Morning|back|spinal_erectors|hamstrings,core|bb,bench|hinge|compound
back_044|Cable Row to Neck|upper_back|rear_delts,traps|rhomboids,biceps|cable|row|isolation
back_045|Chest-Supported Machine High Row|back|upper_back,lats|biceps,rear_delts|machine|row|compound
trap_001|Barbell Shrug|traps|upper_traps|forearms|bb|raise|isolation
trap_002|Dumbbell Shrug|traps|upper_traps|forearms|db|raise|isolation
trap_003|Smith Machine Shrug|traps|upper_traps|forearms|smith|raise|isolation
trap_004|Cable Shrug|traps|upper_traps|forearms|cable|raise|isolation
trap_005|Trap Bar Shrug|traps|upper_traps|forearms|trapbar|raise|isolation
trap_006|Behind-Back Barbell Shrug|traps|upper_traps|forearms|bb|raise|isolation
trap_007|Farmer Carry|traps,core|traps,forearms|core,legs|db,kb,trapbar|carry|compound
trap_008|Suitcase Carry|traps,core|obliques,forearms|traps|db,kb|carry|unilateral,core
trap_009|Overhead Carry|shoulders,core|shoulders,traps|core|db,kb,bb|carry|compound
trap_010|Face Pull|upper_back|rear_delts,traps|rotator_cuff|cable|row|isolation
trap_011|Cable High Row|upper_back|traps,rear_delts|rhomboids,biceps|cable|row|compound
trap_012|Dumbbell Scaption|shoulders,upper_back|delts,lower_traps|rotator_cuff|db|raise|isolation
trap_013|Prone Trap Raise|upper_back|lower_traps|rear_delts|db,bench|raise|isolation
trap_014|Chest-Supported Y Raise|upper_back|lower_traps|rear_delts|db,bench|raise|isolation
trap_015|Plate Halo|shoulders,upper_back|shoulders,traps|core|plate|rotation|mobility
biceps_001|Barbell Curl|biceps|biceps|forearms|bb|curl|isolation
biceps_002|EZ-Bar Curl|biceps|biceps|forearms|ez|curl|isolation
biceps_003|Dumbbell Curl|biceps|biceps|forearms|db|curl|isolation
biceps_004|Alternating Dumbbell Curl|biceps|biceps|forearms|db|curl|isolation,unilateral
biceps_005|Hammer Curl|biceps,forearms|brachialis,brachioradialis|biceps|db|curl|isolation
biceps_006|Cross-Body Hammer Curl|biceps,forearms|brachialis,brachioradialis|biceps|db|curl|isolation,unilateral
biceps_007|Incline Dumbbell Curl|biceps|long_head_biceps|forearms|db,bench|curl|isolation
biceps_008|Preacher Curl|biceps|biceps|forearms|ez,bench|curl|isolation
biceps_009|Dumbbell Preacher Curl|biceps|biceps|forearms|db,bench|curl|isolation,unilateral
biceps_010|Machine Preacher Curl|biceps|biceps|forearms|machine|curl|isolation,beginner
biceps_011|Cable Curl|biceps|biceps|forearms|cable|curl|isolation
biceps_012|Rope Cable Hammer Curl|biceps,forearms|brachialis,brachioradialis|biceps|cable|curl|isolation
biceps_013|Bayesian Cable Curl|biceps|long_head_biceps|forearms|cable|curl|isolation
biceps_014|High Cable Curl|biceps|biceps|forearms|cable|curl|isolation
biceps_015|Concentration Curl|biceps|biceps|forearms|db|curl|isolation,unilateral
biceps_016|Spider Curl|biceps|biceps|forearms|db,bench|curl|isolation
biceps_017|Zottman Curl|biceps,forearms|biceps,forearms|grip|db|curl|isolation
biceps_018|Drag Curl|biceps|biceps|forearms|bb|curl|isolation
biceps_019|Reverse Curl|forearms,biceps|brachioradialis|biceps|ez,bb|curl|isolation
biceps_020|Cable Reverse Curl|forearms,biceps|brachioradialis|biceps|cable|curl|isolation
biceps_021|Wrist Curl|forearms|wrist_flexors|grip|db,bb|curl|isolation
biceps_022|Reverse Wrist Curl|forearms|wrist_extensors|grip|db,bb|curl|isolation
biceps_023|Behind-Back Wrist Curl|forearms|wrist_flexors|grip|bb|curl|isolation
biceps_024|Plate Pinch Hold|forearms|grip|forearms|plate|isometric|isolation
biceps_025|Dead Hang|forearms,back|grip|lats,shoulders|bw|isometric|beginner
biceps_026|Weighted Dead Hang|forearms,back|grip|lats,shoulders|plate,bw|isometric|intermediate
biceps_027|Wrist Roller|forearms|forearms,grip|shoulders|wrist_roller|curl|isolation
biceps_028|Farmer Hold|forearms,traps|grip,traps|core|db,kb,trapbar|isometric|compound
triceps_001|Close-Grip Bench Press|triceps,chest|triceps|chest,front_delts|bb,bench|horizontal_press|compound,strength
triceps_002|Weighted Dip|triceps,chest|triceps|chest,front_delts|plate,bw|horizontal_press|compound
triceps_003|Assisted Dip|triceps,chest|triceps|chest|machine|horizontal_press|compound,beginner
triceps_004|Barbell Skull Crusher|triceps|triceps|shoulders|ez,bench|extension|isolation
triceps_005|Dumbbell Skull Crusher|triceps|triceps|shoulders|db,bench|extension|isolation
triceps_006|Incline Skull Crusher|triceps|long_head_triceps|shoulders|ez,bench|extension|isolation
triceps_007|Cable Skull Crusher|triceps|triceps|shoulders|cable,bench|extension|isolation
triceps_008|Overhead Cable Triceps Extension|triceps|long_head_triceps|core|cable|extension|isolation
triceps_009|Rope Pressdown|triceps|triceps|forearms|cable|extension|isolation
triceps_010|Straight-Bar Pressdown|triceps|triceps|forearms|cable|extension|isolation
triceps_011|V-Bar Pressdown|triceps|triceps|forearms|cable|extension|isolation
triceps_012|Single-Arm Cable Pressdown|triceps|triceps|forearms|cable|extension|isolation,unilateral
triceps_013|Reverse-Grip Cable Pressdown|triceps|medial_head_triceps|forearms|cable|extension|isolation
triceps_014|Dumbbell Overhead Triceps Extension|triceps|long_head_triceps|core|db|extension|isolation
triceps_015|Seated Dumbbell Overhead Extension|triceps|long_head_triceps|shoulders|db,bench|extension|isolation
triceps_016|Single-Arm Dumbbell Overhead Extension|triceps|long_head_triceps|shoulders|db|extension|isolation,unilateral
triceps_017|Cable Kickback|triceps|triceps|rear_delts|cable|extension|isolation
triceps_018|Dumbbell Kickback|triceps|triceps|rear_delts|db|extension|isolation
triceps_019|Machine Triceps Extension|triceps|triceps|forearms|machine|extension|isolation,beginner
triceps_020|Machine Dip|triceps,chest|triceps|chest|machine|horizontal_press|compound,beginner
triceps_021|JM Press|triceps|triceps|chest,front_delts|bb|horizontal_press|compound,advanced
triceps_022|Tate Press|triceps|triceps|chest|db,bench|extension|isolation
triceps_023|Diamond Push-Up|triceps,chest|triceps|chest,front_delts|bw|horizontal_press|compound
triceps_024|Weighted Diamond Push-Up|triceps,chest|triceps|chest|plate,bw|horizontal_press|compound
triceps_025|Bench Dip|triceps|triceps|chest,front_delts|bench,bw|horizontal_press|compound
quad_001|Back Squat|legs|quads,glutes|hamstrings,core|bb|squat|compound,strength
quad_002|High-Bar Back Squat|legs|quads|glutes,core|bb|squat|compound
quad_003|Low-Bar Back Squat|legs|glutes,quads|hamstrings,core|bb|squat|compound,strength
quad_004|Front Squat|legs|quads|core,upper_back,glutes|bb|squat|compound
quad_005|Pause Squat|legs|quads,glutes|core|bb|squat|compound
quad_006|Box Squat|legs|glutes,quads|hamstrings,core|bb,box|squat|compound
quad_007|Zercher Squat|legs|quads,glutes|core,upper_back|bb|squat|compound
quad_008|Goblet Squat|legs|quads,glutes|core|db,kb|squat|compound,beginner
quad_009|Dumbbell Front Squat|legs|quads,glutes|core|db|squat|compound
quad_010|Dumbbell Squat|legs|quads,glutes|core|db|squat|compound
quad_011|Smith Machine Squat|legs|quads,glutes|core|smith|squat|compound
quad_012|Hack Squat|legs|quads|glutes|machine|squat|compound
quad_013|Reverse Hack Squat|legs|glutes,quads|hamstrings|machine|squat|compound
quad_014|Leg Press|legs|quads,glutes|hamstrings|machine|squat|compound
quad_015|Single-Leg Press|legs|quads,glutes|hamstrings|machine|squat|compound,unilateral
quad_016|Belt Squat|legs|quads,glutes|hamstrings|machine|squat|compound
quad_017|Landmine Squat|legs|quads,glutes|core|landmine|squat|compound
quad_018|Bulgarian Split Squat|legs|quads,glutes|hamstrings,core|db,bench|lunge|compound,unilateral
quad_019|Front-Foot-Elevated Split Squat|legs|quads,glutes|core|db,plate|lunge|compound,unilateral
quad_020|Rear-Foot-Elevated Split Squat|legs|quads,glutes|hamstrings|db,bench|lunge|compound,unilateral
quad_021|Walking Lunge|legs|quads,glutes|hamstrings,core|db|lunge|compound,unilateral
quad_022|Reverse Lunge|legs|quads,glutes|hamstrings,core|db|lunge|compound,unilateral
quad_023|Forward Lunge|legs|quads,glutes|hamstrings,core|db|lunge|compound,unilateral
quad_024|Lateral Lunge|legs|adductors,quads,glutes|core|db|lunge|compound,unilateral
quad_025|Curtsy Lunge|legs|glutes,quads|adductors|db|lunge|compound,unilateral
quad_026|Step-Up|legs|quads,glutes|hamstrings,core|db,box|lunge|compound,unilateral
quad_027|Weighted Step-Down|legs|quads|glutes,core|db,box|lunge|compound,unilateral
quad_028|Sissy Squat|legs|quads|core|machine,bw|squat|isolation
quad_029|Leg Extension|legs|quads|none|machine|extension|isolation,beginner
quad_030|Single-Leg Extension|legs|quads|none|machine|extension|isolation,unilateral
quad_031|Wall Sit Weighted|legs|quads|glutes,core|plate,bw|isometric|isolation
quad_032|Spanish Squat|legs|quads|glutes|band|squat|isolation
quad_033|Cyclist Squat|legs|quads|glutes,core|db,plate|squat|compound
quad_034|Heels-Elevated Goblet Squat|legs|quads|glutes,core|db,plate|squat|compound
quad_035|Pistol Squat Weighted|legs|quads,glutes|core|db,bw|squat|advanced,unilateral
posterior_001|Romanian Deadlift|legs,back|hamstrings,glutes|spinal_erectors|bb|hinge|compound
posterior_002|Dumbbell Romanian Deadlift|legs,back|hamstrings,glutes|spinal_erectors|db|hinge|compound
posterior_003|Single-Leg Romanian Deadlift|legs|hamstrings,glutes|core|db,kb|hinge|compound,unilateral
posterior_004|Stiff-Leg Deadlift|legs,back|hamstrings|glutes,spinal_erectors|bb|hinge|compound
posterior_005|Good Morning|legs,back|hamstrings,glutes|spinal_erectors|bb|hinge|compound
posterior_006|Cable Pull-Through|legs|glutes,hamstrings|core|cable|hinge|compound
posterior_007|Kettlebell Swing|legs|glutes,hamstrings|core,back|kb|hinge|power
posterior_008|Dumbbell Swing|legs|glutes,hamstrings|core|db|hinge|power
posterior_009|Barbell Hip Thrust|glutes|glutes|hamstrings,core|bb,bench|extension|compound
posterior_010|Dumbbell Hip Thrust|glutes|glutes|hamstrings,core|db,bench|extension|compound
posterior_011|Machine Hip Thrust|glutes|glutes|hamstrings|machine|extension|compound,beginner
posterior_012|Smith Machine Hip Thrust|glutes|glutes|hamstrings|smith,bench|extension|compound
posterior_013|Single-Leg Hip Thrust|glutes|glutes|hamstrings,core|db,bw,bench|extension|unilateral
posterior_014|Glute Bridge|glutes|glutes|hamstrings,core|bb,db,bw|extension|compound
posterior_015|Barbell Glute Bridge|glutes|glutes|hamstrings|bb|extension|compound
posterior_016|Frog Pump Weighted|glutes|glutes|hamstrings|db,band|extension|isolation
posterior_017|Cable Glute Kickback|glutes|glutes|hamstrings|cable|extension|isolation,unilateral
posterior_018|Machine Glute Kickback|glutes|glutes|hamstrings|machine|extension|isolation,unilateral
posterior_019|Cable Hip Abduction|glutes|glute_medius|core|cable|raise|isolation,unilateral
posterior_020|Machine Hip Abduction|glutes|glute_medius|glutes|machine|raise|isolation,beginner
posterior_021|Band Hip Abduction|glutes|glute_medius|glutes|band|raise|isolation
posterior_022|Seated Leg Curl|hamstrings|hamstrings|calves|machine|curl|isolation,beginner
posterior_023|Lying Leg Curl|hamstrings|hamstrings|calves|machine|curl|isolation,beginner
posterior_024|Standing Leg Curl|hamstrings|hamstrings|calves|machine|curl|isolation,unilateral
posterior_025|Nordic Hamstring Curl|hamstrings|hamstrings|glutes,calves|bw|curl|advanced
posterior_026|Assisted Nordic Curl|hamstrings|hamstrings|glutes|band,bw|curl|intermediate
posterior_027|Razor Curl|hamstrings|hamstrings|glutes|bw|curl|advanced
posterior_028|Stability Ball Leg Curl|hamstrings|hamstrings|glutes,core|ball,bw|curl|beginner
posterior_029|Slider Leg Curl|hamstrings|hamstrings|glutes,core|sliders,bw|curl|beginner
posterior_030|Reverse Hyperextension|glutes,back|glutes,spinal_erectors|hamstrings|machine|extension|compound
posterior_031|45-Degree Hip Extension|glutes,hamstrings|glutes,hamstrings|spinal_erectors|machine,plate|hinge|compound
posterior_032|Cable Romanian Deadlift|legs|hamstrings,glutes|spinal_erectors|cable|hinge|compound
posterior_033|Landmine Romanian Deadlift|legs|hamstrings,glutes|spinal_erectors|landmine|hinge|compound
posterior_034|Dumbbell Sumo Deadlift|legs|glutes,adductors|hamstrings,quads|db|hinge|compound
posterior_035|Barbell Sumo Deadlift|legs,back|glutes,adductors|hamstrings,back|bb|hinge|compound,strength
posterior_036|Cable Hip Adduction|legs|adductors|core|cable|raise|isolation,unilateral
posterior_037|Machine Hip Adduction|legs|adductors|none|machine|raise|isolation,beginner
posterior_038|Cossack Squat Weighted|legs|adductors,glutes,quads|core|db,kb|lunge|compound,unilateral
posterior_039|Pull-Through to Squat|glutes,legs|glutes,hamstrings|quads,core|cable|hinge|compound
posterior_040|Sled Push|legs|quads,glutes|calves,core|sled|squat|compound,power
posterior_041|Sled Pull|legs|glutes,hamstrings|quads,calves|sled|hinge|compound,power
calves_001|Standing Calf Raise|calves|gastrocnemius|soleus|machine|raise|isolation
calves_002|Seated Calf Raise|calves|soleus|gastrocnemius|machine|raise|isolation
calves_003|Leg Press Calf Raise|calves|calves|none|machine|raise|isolation
calves_004|Smith Machine Calf Raise|calves|calves|none|smith|raise|isolation
calves_005|Dumbbell Standing Calf Raise|calves|calves|core|db|raise|isolation
calves_006|Single-Leg Dumbbell Calf Raise|calves|calves|core|db|raise|unilateral,isolation
calves_007|Donkey Calf Raise|calves|calves|none|machine|raise|isolation
calves_008|Barbell Calf Raise|calves|calves|core|bb|raise|isolation
calves_009|Farmer Walk on Toes|calves,forearms|calves|traps,grip|db,kb|carry|compound
calves_010|Jump Rope|calves|calves|conditioning|rope|power|beginner
calves_011|Tibialis Raise|calves|tibialis_anterior|none|bw|raise|isolation
calves_012|Weighted Tibialis Raise|calves|tibialis_anterior|none|machine,db|raise|isolation
calves_013|Seated Tibialis Raise|calves|tibialis_anterior|none|machine|raise|isolation
calves_014|Sled Push|calves,legs|calves,quads|glutes|sled|squat|compound
calves_015|Box Jump|calves,legs|calves,quads,glutes|core|box,bw|power|plyometric
core_001|Cable Crunch|core|abs|hip_flexors|cable|flexion|isolation
core_002|Kneeling Cable Crunch|core|abs|hip_flexors|cable|flexion|isolation
core_003|Machine Crunch|core|abs|hip_flexors|machine|flexion|isolation,beginner
core_004|Weighted Decline Sit-Up|core|abs|hip_flexors|plate,bench|flexion|isolation
core_005|Weighted Sit-Up|core|abs|hip_flexors|plate,bw|flexion|isolation
core_006|Weighted Crunch|core|abs|none|plate,bw|flexion|isolation
core_007|Dumbbell Side Bend|core|obliques|abs|db|flexion|isolation
core_008|Cable Side Bend|core|obliques|abs|cable|flexion|isolation
core_009|Hanging Knee Raise|core|abs|hip_flexors|bw|flexion|compound
core_010|Hanging Leg Raise|core|abs|hip_flexors|bw|flexion|compound
core_011|Captain's Chair Knee Raise|core|abs|hip_flexors|machine|flexion|beginner
core_012|Toes-to-Bar|core|abs|lats,hip_flexors|bw|flexion|advanced
core_013|Ab Wheel Rollout|core|abs|lats,shoulders|ab_wheel|anti_extension|advanced
core_014|Barbell Rollout|core|abs|lats,shoulders|bb|anti_extension|advanced
core_015|Stability Ball Rollout|core|abs|shoulders|ball|anti_extension|intermediate
core_016|Plank Weighted|core|abs|glutes,shoulders|plate,bw|isometric|core
core_017|Side Plank Weighted|core|obliques|shoulders,glutes|plate,bw|isometric|core
core_018|Dead Bug Weighted|core|abs|hip_flexors|db,bw|anti_extension|core
core_019|Hollow Body Hold Weighted|core|abs|hip_flexors|plate,bw|isometric|core
core_020|Pallof Press|core|obliques,abs|shoulders|cable,band|anti_rotation|core
core_021|Half-Kneeling Pallof Press|core|obliques,abs|glutes|cable,band|anti_rotation|core
core_022|Cable Wood Chop High-to-Low|core|obliques|abs,shoulders|cable|rotation|core
core_023|Cable Wood Chop Low-to-High|core|obliques|abs,shoulders|cable|rotation|core
core_024|Landmine Rotation|core|obliques|shoulders,abs|landmine|rotation|core
core_025|Russian Twist Weighted|core|obliques|abs|plate,medicine_ball|rotation|core
core_026|Medicine Ball Slam|core|abs,lats|shoulders,hips|medicine_ball|power|compound
core_027|Medicine Ball Rotational Throw|core|obliques|hips,shoulders|medicine_ball|rotation|power
core_028|Farmer Carry|core,forearms|core,grip|traps,legs|db,kb|carry|compound
core_029|Suitcase Carry|core|obliques|grip,traps|db,kb|carry|unilateral,core
core_030|Front Rack Carry|core|abs,upper_back|legs,shoulders|kb,db|carry|compound
core_031|Overhead Carry|core,shoulders|abs,shoulders|traps|db,kb,bb|carry|compound
core_032|Cable Dead Bug Pulldown|core|abs,lats|hip_flexors|cable|anti_extension|core
core_033|Decline Reverse Crunch|core|lower_abs|hip_flexors|bench,bw|flexion|core
core_034|Weighted Reverse Crunch|core|lower_abs|hip_flexors|db,bw|flexion|core
core_035|GHD Sit-Up|core|abs,hip_flexors|quads|machine|flexion|advanced
full_001|Power Clean|full_body|glutes,traps,legs|back,shoulders|bb|power|compound,advanced
full_002|Hang Clean|full_body|glutes,traps,legs|shoulders,back|bb|power|compound,advanced
full_003|Clean Pull|full_body|traps,glutes,hamstrings|back|bb|power|compound
full_004|Clean and Press|full_body|shoulders,legs|triceps,core|bb|power|compound,advanced
full_005|Dumbbell Clean and Press|full_body|shoulders,legs|triceps,core|db|power|compound
full_006|Kettlebell Clean and Press|full_body|shoulders,legs|core|kb|power|compound
full_007|Dumbbell Thruster|full_body|quads,shoulders|glutes,triceps,core|db|squat|compound
full_008|Barbell Thruster|full_body|quads,shoulders|glutes,triceps,core|bb|squat|compound
full_009|Kettlebell Swing|full_body|glutes,hamstrings|core,back|kb|hinge|power
full_010|Sled Push|full_body|quads,glutes|calves,core|sled|squat|compound
full_011|Sled Pull|full_body|glutes,hamstrings|quads,core|sled|hinge|compound
full_012|Farmer Carry|full_body|grip,traps,core|legs|db,kb,trapbar|carry|compound
full_013|Trap Bar Carry|full_body|traps,grip,core|legs|trapbar|carry|compound
full_014|Sandbag Carry|full_body|core,legs,back|grip|sandbag|carry|compound
full_015|Zercher Carry|full_body|core,upper_back|legs,biceps|bb|carry|compound
full_016|Bear Hug Carry|full_body|core,upper_back|legs|sandbag,plate|carry|compound
full_017|Turkish Get-Up|full_body|shoulders,core|hips|kb,db|rotation|compound
full_018|Dumbbell Snatch|full_body|hips,shoulders|traps,core|db|power|compound,unilateral
full_019|Kettlebell Snatch|full_body|hips,shoulders|traps,core|kb|power|compound,unilateral
full_020|Barbell Snatch Pull|full_body|traps,glutes,hamstrings|back|bb|power|compound,advanced
full_021|Landmine Clean and Press|full_body|shoulders,legs|core,triceps|landmine|power|compound
full_022|Medicine Ball Slam|full_body|core,lats|shoulders,hips|medicine_ball|power|compound
full_023|Battle Rope Wave|full_body|shoulders,core|arms|ropes|power|conditioning
full_024|Battle Rope Slam|full_body|shoulders,core|arms|ropes|power|conditioning
full_025|Burpee Dumbbell Deadlift|full_body|legs,chest|shoulders,core|db,bw|hinge|conditioning`;

export const EXERCISES: Exercise[] = RAW.trim().split("\n").map(line => {
  const [id, name, cat, primary, secondary, equipment, pattern, tags] = line.split("|");
  const category = cat.split(",");
  return {
    id,
    name,
    group: getGroup(id, category),
    category,
    primary: primary.split(","),
    secondary: secondary.split(","),
    equipment: equipment.split(","),
    pattern,
    tags: tags.split(","),
  };
});

export const MUSCLE_TABS = [
  { key: "all", label: "All" },
  { key: "chest", label: "Chest" },
  { key: "shoulders", label: "Shoulders" },
  { key: "back", label: "Back" },
  { key: "traps", label: "Traps" },
  { key: "biceps", label: "Biceps" },
  { key: "triceps", label: "Triceps" },
  { key: "quads", label: "Quads" },
  { key: "hamstrings", label: "Hams" },
  { key: "glutes", label: "Glutes" },
  { key: "calves", label: "Calves" },
  { key: "core", label: "Core" },
  { key: "full_body", label: "Full Body" },
];

export const EQUIPMENT_CHIPS = [
  { key: "all", label: "All" },
  { key: "barbell", label: "Barbell" },
  { key: "dumbbell", label: "Dumbbell" },
  { key: "cable", label: "Cable" },
  { key: "machine", label: "Machine" },
  { key: "smith", label: "Smith" },
  { key: "kettlebell", label: "KB" },
  { key: "plate", label: "Plate" },
  { key: "band", label: "Band" },
  { key: "bodyweight", label: "BW" },
  { key: "bench", label: "Bench" },
  { key: "landmine", label: "Landmine" },
  { key: "ez_bar", label: "EZ Bar" },
  { key: "trap_bar", label: "Trap Bar" },
  { key: "sled", label: "Sled" },
  { key: "medicine_ball", label: "Med Ball" },
];

export const EQUIP_MAP: Record<string, string> = {
  bb: "barbell", db: "dumbbell", kb: "kettlebell", cable: "cable",
  machine: "machine", smith: "smith", plate: "plate", band: "band",
  bw: "bodyweight", bench: "bench", landmine: "landmine", ez: "ez_bar",
  trapbar: "trap_bar", medicine_ball: "medicine_ball", sled: "sled",
};

export function matchesEquipment(ex: Exercise, filter: string): boolean {
  if (filter === "all") return true;
  return ex.equipment.some(e => EQUIP_MAP[e] === filter);
}
