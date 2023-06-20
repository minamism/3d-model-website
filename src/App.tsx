import "./App.css";
import * as THREE from "three";
import { useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function App() {
  let canvas: HTMLCanvasElement;
  let model: THREE.Group;

  useEffect(() => {
    canvas = document.getElementById("canvas") as HTMLCanvasElement;

    const sizes = {
      width: innerWidth,
      height: innerHeight,
    };

    //scene
    const scene: THREE.Scene = new THREE.Scene();

    //camera
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera( //カメラを近づけたら近づく、遠ざけたら遠くなるのをPerspectiveCamera
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.set(-4, 4, 10);

    //renderer
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true, //3Dだと端っこがギザギザになるからそれを滑らかにすることをantialias
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height); //お決まり
    renderer.setPixelRatio(window.devicePixelRatio); //お決まり

    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    //3Dモデルのインポート
    const gltfLoader = new GLTFLoader();

    let mixer: THREE.AnimationMixer;
    gltfLoader.load("./models/cheese.gltf", (gltf) => {
      model = gltf.scene;
      // model.scale.set(1.3, 1.3, 1.3);
      model.scale.set(0.0008, 0.0008, 0.0008);
      model.rotation.y = -Math.PI / 4;

      scene.add(model);

      mixer = new THREE.AnimationMixer(model);
      const clips = gltf.animations;
      clips.forEach(function (clip) {
        const action = mixer.clipAction(clip);
        action.play();
      })
    });

    //ライト
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    scene.add(pointLight);

    //アニメーション
    const tick = () => {
      renderer.render(scene, camera);

      if(mixer) {
        mixer.update(0.01);
      }

      requestAnimationFrame(tick);
    };
    tick();
  }, []);

  return (
    <>
      <canvas id="canvas"></canvas>
      <div className="mainContent">
        <h3>Minmi</h3>
        <p>Web Developer</p>
      </div>
    </>
  );
}

export default App;
