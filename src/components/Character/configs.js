
export const CONFIGS = {
  name: 'cat',
  assetPath: '/models/cat_all_anims.glb',
  walkingSpeed: 0,
  runningSpeed: 0,
  meshScaler: 10,
  speedScaler: .25,
  defaultClipAction: 'crouch',
  defaultVisible: true,
  turningIncrement: .05,
  fadeIn: .5,
  scripts: {
    sit: 
      [
        {clipName: 'idle_sit_clean_loop', loop: 1 }, 
        {clipName: 'sit_to_stand', loop: 1},
        {clipName: 'idle_stand_loop', loop: 1},
        {clipName: 'stand_to_sit', loop: 1},
        {clipName: 'idle_sit_loop', loop: 1}
      ]
  },
  clipActions: [
    'crouch_to_stand', 
    'run_loop', 
    'idle_crouch_loop', 
    'idle_jump_high_ready_loop',
    'idle_lay_down_loop',
    'idle_sit_loop',
    'idle_sit_clean_loop',
    'idle_sleep_loop',
    'idle_stand_loop',
    'idle_stand_clean_loop',
    'jump',
    'jump_high',
    'sit_to_stand',
    'stand_to_crouch',
    'stand_to_run',
    'stand_to_jump_high_ready',
    'stand_to_sit',
    'walk_to_trot',
    'stand_to_walk',
    'turn_left_180',
    'turn_left_45',
    'turn_left_90',
    'turn_right_45',
    'turn_right_90',
    'turn_right_180',
    'attack_loop',
    'trot_loop',
    'walk_loop',
    'walk_to_stand',
    'stand_to_trot',
    'sneak_loop',
    'push_loop',
    'pull_loop'
  ]
}