const walk_loop = 2.6; 
const stand_to_walk = 2;
export const CONFIGS = {
  CHARACTER: {
    name: 'cat',
    assetPath: '/models/cat_model_test.fbx',
    meshScaler: .5
  },
  ANIMATION: {
    defaultScript: 'walkBackAndForth',
    scripts: {
      walkBackAndForth: 
        [
          {clipName: 'SHJntGrp|turn_right_90', rotate: -Math.PI/2 },
          {clipName: 'SHJntGrp|stand_to_walk', translate: stand_to_walk },
          {clipName: 'SHJntGrp|walk_loop', translate: walk_loop },
          {clipName: 'SHJntGrp|walk_to_stand' },
        ],
      idle: 
        [
          {clipName: 'stand_to_sit', rotate: 0 },
          {clipName: 'idle_sit_clean_loop', rotate: 0 },
          {clipName: 'sit_to_stand', rotate: 0 },
          {clipName: 'idle_stand_clean_loop', rotate: 0 }
        ],
      jump:
        [
          {clipName: 'stand_to_jump_high_ready', rotate: 0 },
          {clipName: 'idle_jump_high_ready_loop', rotate: 0 },
          {clipName: 'jump_high', rotate: 0 },
          {clipName: 'turn_right_45', rotate: -Math.PI/4 },
          {clipName: 'stand_to_sit', rotate: 0 },
          {clipName: 'idle_sit_clean_loop', rotate: 0 },
          {clipName: 'sit_to_stand', rotate: 0 }
        ]
    },
    clipActions: [
      // 'crouch_to_stand', 
      // 'run_loop', 
      // 'idle_crouch_loop', 
      // 'idle_jump_high_ready_loop',
      // 'idle_lay_down_loop',
      // 'idle_sit_loop',
      // 'idle_sit_clean_loop',
      // 'idle_sleep_loop',
      // 'idle_stand_loop',
      // 'idle_stand_clean_loop',
      // 'jump',
      // 'jump_high',
      // 'sit_to_stand',
      // 'stand_to_crouch',
      // 'stand_to_run',
      // 'stand_to_jump_high_ready',
      // 'stand_to_sit',
      // 'walk_to_trot',
       'SHJntGrp|stand_to_walk',
      // 'turn_left_180',
      // 'turn_left_45',
      // 'turn_left_90',
      // 'turn_right_45',
       'SHJntGrp|turn_right_90',
      // 'turn_right_180',
      // 'attack_loop',
      // 'trot_loop',
       'SHJntGrp|walk_loop',
       'SHJntGrp|walk_to_stand',
      // 'stand_to_trot',
      // 'sneak_loop',
      // 'push_loop',
      // 'pull_loop'
    ]
    // clipActions: [
    //   'crouch_to_stand', 
    //   'run_loop', 
    //   'idle_crouch_loop', 
    //   'idle_jump_high_ready_loop',
    //   'idle_lay_down_loop',
    //   'idle_sit_loop',
    //   'idle_sit_clean_loop',
    //   'idle_sleep_loop',
    //   'idle_stand_loop',
    //   'idle_stand_clean_loop',
    //   'jump',
    //   'jump_high',
    //   'sit_to_stand',
    //   'stand_to_crouch',
    //   'stand_to_run',
    //   'stand_to_jump_high_ready',
    //   'stand_to_sit',
    //   'walk_to_trot',
    //   'stand_to_walk',
    //   'turn_left_180',
    //   'turn_left_45',
    //   'turn_left_90',
    //   'turn_right_45',
    //   'turn_right_90',
    //   'turn_right_180',
    //   'attack_loop',
    //   'trot_loop',
    //   'walk_loop',
    //   'walk_to_stand',
    //   'stand_to_trot',
    //   'sneak_loop',
    //   'push_loop',
    //   'pull_loop'
    // ]
  }
}