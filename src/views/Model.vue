<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
/* import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls' */
import Stats from 'stats.js'
import TWEEN from '@tweenjs/tween.js'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const containerWidth = window.innerWidth
const containerHeight = window.innerHeight

// 场景
let scene = null
function initScene () {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf2f2f2);
  // scene.fog = new THREE.Fog(0xf2f2f2, 200, 1000);
}
// 相机
let camera = null
function initCamera () {
  camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 1, 1000)
  // 相机默认在原点（0,0,0），要综合考虑场景中物体z轴的距离才能看到，需要z轴里原点远一些（靠近人的方向）
  camera.position.set(0, 15, 20)
  camera.up.set(0, 1, 0)
}
// 渲染器
let renderer = null
function initRenderer () {
  renderer = new THREE.WebGLRenderer({ antialias: true /* 抗锯齿(影响一部分性能) */ })
  renderer.setSize(containerWidth, containerHeight)
  renderer.setClearColor(0x00ffffff, 0.4)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.physicallyCorrectLights = true
  renderer.shadowMap.enabled = true
  renderer.shadowMap.needsUpdate = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  const container = document.getElementById('three-container')
  if (container.childNodes.length > 0) {
    container.replaceChild(container.children[0], renderer.domElement)
  } else {
    container.appendChild(renderer.domElement)
  }
}
let orbitControls = null
function initControls () {
  orbitControls = new OrbitControls(camera, renderer.domElement)
  // controls.autoRotate = true
  orbitControls.update()
}
let light
function initLight () {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  light = new THREE.DirectionalLight(0xffffff, 2.0)
  light.position.set(100, 100, 100)
  light.castShadow = true
  scene.add(ambientLight)
  scene.add(light)

}
function initGround () {
  // ground
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const grid = new THREE.GridHelper(1000, 1000, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);
}

let model1 = null
let model2 = null
let model3 = null
let mixer = null
function initModel () {
  /* const loader1 = new GLTFLoader()
  loader1.load(
    // resource URL
    'models/mcc/gltf/123.gltf',
    // called when the resource is loaded
    (gltf) => {
      model1 = gltf
      model1.scene.position.x = 1
      model1.scene.position.y = 1
      model1.scene.position.z = 0
      scene.add(model1.scene)
    },
    // called while loading is progressing
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    (error) => {
      console.log('An error happened', error)
    }
  ) */

  const loader2 = new GLTFLoader()
  loader2.load(
    // resource URL
    'models/mcc/122.glb',
    // called when the resource is loaded
    (gltf) => {
      model2 = gltf
      model2.scene.position.x = 1
      model2.scene.position.y = 1
      model2.scene.position.z = 0
      scene.add(model2.scene)
    },
    // called while loading is progressing
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    (error) => {
      console.log('An error happened', error)
    }
  )

  /* const loader3 = new FBXLoader()
  loader3.load(
    // resource URL
    // 'models/Samba Dancing.fbx',
    'models/mcc/111.fbx',
    // called when the resource is loaded
    (object) => {
      model3 = object
      // mixer = new THREE.AnimationMixer(object);

      // const action = mixer.clipAction(object.animations[0]);
      // action.play();

      // object.traverse(function (child) {

      //   if (child.isMesh) {

      //     child.castShadow = true;
      //     child.receiveShadow = true;

      //   }
      // });
      scene.add(model3)
    },
    // called while loading is progressing
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    (error) => {
      console.log('An error happened', error)
    }
  ) */
}

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
function onPointerMove (event) {
  // console.log(event)
  pointer.x = event.clientX / containerWidth * 2 - 1
  pointer.y = event.clientY / containerHeight * 2 - 1
}

// 实时渲染
const clock = new THREE.Clock();
function render () {
  raycaster.setFromCamera(pointer, camera)

  // 真正渲染
  renderer.render(scene, camera)
}
function animate () {
  requestAnimationFrame(animate)

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  render()
}

function onKeyDown (event) {
  const { keyCode } = event
  switch (keyCode) {
    case 37: // left
      // camera.rotateY(-0.01)
      model1.scene.position.x -= 0.1
      break
    case 38: // up
      // camera.position.z += 1
      model1.scene.position.y += 0.1
      break
    case 39: // right
      // camera.rotateY(0.01)
      model1.scene.position.x += 0.1
      break
    case 40: // down
      model1.scene.position.y -= 0.1
      break
  }
}

onMounted(() => {
  initScene()
  initCamera()
  initRenderer()
  initControls()
  initGround()
  initModel()
  initLight()

  animate()

  document.addEventListener('mousemove', onPointerMove)
  document.addEventListener('keydown', onKeyDown)
})
</script> 

<template>
  <div>
    <div id="three-container"></div>
  </div>
</template>

<style scoped></style>