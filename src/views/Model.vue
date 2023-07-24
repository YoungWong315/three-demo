<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
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
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  light = new THREE.DirectionalLight(0xffffff, 2.0)
  light.position.set(100, 100, 100)
  light.castShadow = true
  scene.add(ambientLight)
  scene.add(light)
}
let model = null
function initModel () {
  const loader = new GLTFLoader()
  loader.load(
    // resource URL
    'models/mcc/gltf/123.gltf',
    // called when the resource is loaded
    (gltf) => {
      model = gltf
      model.scene.position.x = 1
      model.scene.position.y = 1
      model.scene.position.z = 0
      scene.add(model.scene)
      /* gltf.animations // Array<THREE.AnimationClip>
      gltf.scene // THREE.Group
      gltf.scenes // Array<THREE.Group>
      gltf.cameras // Array<THREE.Camera>
      gltf.asset // Object */
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
}

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
function onPointerMove (event) {
  // console.log(event)
  pointer.x = event.clientX / containerWidth * 2 - 1
  pointer.y = event.clientY / containerHeight * 2 - 1
}

// 实时渲染
function render () {
  raycaster.setFromCamera(pointer, camera)

  // 真正渲染
  renderer.render(scene, camera)
}
function animate () {
  requestAnimationFrame(animate)
  // orbitControls.update();
  render()
}

function onKeyDown (event) {
  const { keyCode } = event
  switch (keyCode) {
    case 37: // left
      // camera.rotateY(-0.01)
      model.scene.position.x -= 0.1
      break
    case 38: // up
      // camera.position.z += 1
      model.scene.position.y += 0.1
      break
    case 39: // right
      // camera.rotateY(0.01)
      model.scene.position.x += 0.1
      break
    case 40: // down
      model.scene.position.y -= 0.1
      break
  }
}

onMounted(() => {
  initScene()
  initCamera()
  initRenderer()
  initControls()
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