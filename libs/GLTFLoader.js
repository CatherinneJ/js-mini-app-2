import {
  AnimationClip,
  AnimationMixer,
  FileLoader,
  LoaderUtils,
  MathUtils,
  Vector3,
  Scene,
  SkinnedMesh,
  Mesh,
  Group,
  NumberKeyframeTrack
} from '../libs/three.module.js';

import { GLTFRegistry } from './GLTFRegistry.js';
import { GLTFParser } from './GLTFParser.js';

class GLTFLoader {
  constructor(manager) {
    this.manager = manager !== undefined ? manager : THREE.DefaultLoadingManager;
  }
  // ... celý obsah loaderu ...
}

export { GLTFLoader };
