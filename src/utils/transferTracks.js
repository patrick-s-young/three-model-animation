// Three
import * as THREE from 'three';


export const transferTracks = ({
  sourceObj3D,
  targetObj3D,
  transferTracksByClipName
}) => {
  sourceObj3D.animations.forEach(sourceAnimClip => {
    // Does the sourceAnimClip have tracks to be transferred?
      if (transferTracksByClipName[sourceAnimClip.name] !== undefined) {
        // clip with tracks to transfer has been found
        // loop over AnimationClip tracks to find the matching track name
        const targetAnimClip = new THREE.AnimationClip(sourceAnimClip.name, sourceAnimClip.duration, []);
        const { trackName:targetTrackName } =  transferTracksByClipName[sourceAnimClip.name];
        sourceAnimClip.tracks = sourceAnimClip.tracks.filter(sourceTrack => {
          if (targetTrackName === sourceTrack.name) {
            targetAnimClip.tracks.push(sourceTrack);
            return false;
          }
          return true;
        });
        targetObj3D.animations.push(targetAnimClip);
      } 
    });
}