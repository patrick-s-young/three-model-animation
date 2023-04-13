const meshScaler = 0.1;
export const CONFIGS = {
  CHARACTER: {
    name: 'cat',
    assetPath: '/models/cat/cat_model_2023.03.13h.fbx',
    meshScaler
  },
  ANIMATION: {
    defaultScript: 'demo',
    scripts: {
      demo: [
        {clipName: 'turn_right_45'},
        {clipName: 'stand_to_walk' },
        {clipName: 'walk_loop' },
       {clipName: 'walk_to_stand'},
       {clipName: 'turn_right_90'},
       {clipName: 'stand_to_walk' },
        {clipName: 'walk_loop' },
        {clipName: 'walk_to_stand'}
      ]
    },
    extractTracks: {
      stand_to_walk: { positionTrackName: 'TrajectorySHJnt.position' },
      walk_to_stand: { positionTrackName: 'TrajectorySHJnt.position' },
      turn_right_180: { quaternionTrackName: 'TrajectorySHJnt.quaternion'},
      turn_right_90: { quaternionTrackName: 'TrajectorySHJnt.quaternion'},
      turn_right_45: { quaternionTrackName: 'TrajectorySHJnt.quaternion'},
      walk_loop: { positionTrackName: 'TrajectorySHJnt.position' },
      turn_left_45: { quaternionTrackName: 'TrajectorySHJnt.quaternion'}
    },
    clipNames: [
      // 'sneak_loop',
      // 'push_loop',
      // 'pull_loop',
      
      ///////////////////
      // CROUCH TO CROUCH
     // 'idle_crouch_loop',
      // CROUCH TO STAND
     // 'crouch_to_stand', 

      ///////////////////////////
      // JUMP_READY TO JUMP_READY
     // 'idle_jump_high_ready_loop',

      //////////////////////
      // JUMP_READY TO STAND
    //  'jump_1',
     // 'jump_2',

      /////////////
      // LAY TO LAY
      //'idle_lay_down_loop',

      //////////////
      // RUN TO RUN
     // 'run_loop', 

      /////////////
      // SIT TO SIT
      //'idle_sit_loop',
     // 'idle_sit_clean_loop',
      // SIT TO STAND
     // 'sit_to_stand',

      ////////////////
      // SLEEP TO SLEEP
     // 'idle_sleep_loop',

      //////////////////
      // STAND TO CROUCH
     // 'stand_to_crouch',
      // STAND TO JUMP_READY
     // 'stand_to_jump_high_ready',
      // STAND TO RUN
     // 'stand_to_run', // need 'run_to_stand'
      // STAND TO SIT
     // 'stand_to_sit',
      // STAND TO STAND
      // 'attack_loop',
      // 'idle_stand_loop',
      // 'idle_stand_clean_loop',
      // 'turn_left_180',
      // 'turn_left_90',
      'turn_right_45',
      'turn_right_90',
      'turn_right_180',
      'turn_left_45',
      // STAND TO TROT
     // 'stand_to_trot',
      // STAND TO WALK
      'stand_to_walk',


      ///////////////
      // TROT TO TROT
     // 'trot_loop',

      /////////////////
      // WALK TO STAND
      'walk_to_stand',
      // WALK TO TROT
     // 'walk_to_trot', // need 'trot_to_walk', 'trot_to_stand'
      // WALK TO WALK
      'walk_loop',
    ]
  }
}

