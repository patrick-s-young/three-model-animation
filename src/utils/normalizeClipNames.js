export const normalizeClipNames = ({
  object3D,
  normalizedClipNames
}) => {
  object3D.animations.forEach(animClip => {
    normalizedClipNames.forEach(normalizedClipName => {
      if (animClip.name.indexOf(normalizedClipName) !== -1)  animClip.name = normalizedClipName;
    })
  });
}