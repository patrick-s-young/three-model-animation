# three-model-animation
Three.js system for FBX model animation and interaction.
![three-gltf-animation_640x512_24fps](https://user-images.githubusercontent.com/42591798/222059278-ba36a4ad-53a7-40db-a76f-1ea1188558cf.gif)

The challenge was to convert animations involving movement (walk-to-stand, walk-loop, etc) into treadmill animations while still keeping the nuances of the original animator's work (the cat model was downloaded from [Turbosquid](https://www.turbosquid.com/3d-models/platform-animations-3d-model-1258856)). This required these steps:
- Extract relevant position and quaternion tracks from FBX model, setting the model's tracks to zero.
- Using Three.js' VectorKeyframeTrack and QuaternionKeyframeTrack to emulate the AnimationAction's interpolation method (specifically, InterpolantFactoryMethodLinear).
- Creating Position and Quaternion methods to update the cat model's parent mesh (cat modal is added to a THREE.Group()).

The reasons for developing this 'track extraction' method are two-fold:
- Updating the cat model's position at the end of each loop felt clunky. I had to wait until the subsequent animation started and then do the update (if not, the cat would jump back to the start of the previous cycle before moving to its new position).
- I want the cat to be able to walk to a specific position (user places a bowl of cat food and cat walks to it). The cat model has 45, 90, and 180 degree turn animations. These can be used to point the cat in the general direction. Ideally, as the cat is walking toward the bowel, any 'course correction' needed could be applied using a relatively subtle arc while the walk loop is in motion (slightly rotating the model with each frame until it has lined up with the bowl). For this use case, having the position and quaternion tracks separate from the model animation makes controlling the cat a bit more intuitive for the developer.

Note: using FBX because GLTF results in the first frame of the animation duplicated and placed at the end (added by Three.js for a smoother looping animation).

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
git clone https://github.com/patrick-s-young/three-model-animation.git # or clone your own fork
cd three-model-animation
npm install
npm start
```

## Built With

* [Three.js](https://www.npmjs.com/package/three) - An easy to use, lightweight, cross-browser, general purpose 3D library.
* [webpack](https://webpack.js.org/) - static module builder.
* [Turbosquid](https://www.turbosquid.com/3d-models/platform-animations-3d-model-1258856) - 3D characters, skeletal rigs, and animations.

## Authors

* **Patrick Young** - [Patrick Young](https://github.com/patrick-s-young)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
