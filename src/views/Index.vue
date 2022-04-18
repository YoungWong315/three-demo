<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
/* import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls' */
import Stats from 'stats.js'
import TWEEN from '@tweenjs/tween.js'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const query = router.currentRoute.value.query

// 场景
let scene = null
function initScene() {
  scene = new THREE.Scene()
}
// 相机
let camera = null
function initCamera() {
  camera = new THREE.PerspectiveCamera(75, 1, 1, 1000)
  // 相机默认在原点（0,0,0），要综合考虑场景中物体z轴的距离才能看到，需要z轴里原点远一些（靠近人的方向）
  camera.position.set(0, 0, 10)
  // camera.position.y = 0
}
// 渲染器
let renderer = null
function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true /* 抗锯齿(影响一部分性能) */ })
  renderer.setSize(800, 800)
  renderer.setClearColor(0x008000, 0.4)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.outputEncoding = THREE.sRGBEncoding
  const container = document.getElementById('three-container')
  if (container.childNodes.length > 0) {
    container.replaceChild(container.children[0], renderer.domElement)
  } else {
    container.appendChild(renderer.domElement)
  }
}
let controls = null
function initControls() {
  controls = new OrbitControls(camera, renderer.domElement)
  controls.update()
}
let light
function initLight() {
  light = new THREE.AmbientLight(0xffffff, 1.0)
  /* light = new THREE.DirectionalLight(0xffffff, 1.0)
  light.position.x = 0
  light.position.y = 0
  light.position.z = 100
  light.target = cube */
  scene.add(light)
}
// 画一个cube
let cube = null
function initCube() {
  const geometry = new THREE.BoxGeometry(1,1,1)
  // const geometry = new THREE.IcosahedronGeometry(1, 10)
  const material1 = new THREE.MeshLambertMaterial({color: 0xFFFFFF})
  const material2 = new THREE.MeshLambertMaterial({color: 0xFF0000})
  const material3 = new THREE.MeshLambertMaterial({color: 0x00FF00})
  const material4 = new THREE.MeshLambertMaterial({color: 0x0000FF})
  const material5 = new THREE.MeshLambertMaterial({color: 0xfefefe})

  const texture = new THREE.TextureLoader().load("test.jpeg")
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  const material6 = new THREE.MeshLambertMaterial({map: texture})

  cube = new THREE.Mesh(geometry, [material1, material2, material3, material4, material5, material6])
  scene.add(cube)
}
// 画一个网格
function initObject() {
  // 两种循环
  const geometry = new THREE.BufferGeometry()
  const geometry1 = new THREE.BufferGeometry()
  const material = new THREE.LineBasicMaterial({ vertexColors: true })

  let p1 = new THREE.Vector2(-100, 0, 0)
  let p2 = new THREE.Vector3(100, 0, 0)
  let p3 = new THREE.Vector3(0, -100, 0)
  let p4 = new THREE.Vector3(0, 1000, 0)

  let line1 = [
    -100, 0, 0,
    100, 0, 0
  ]
  let line2 = [
    0, -100, 0,
    0, 100, 0
  ]

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(line1, 3 ))
  geometry1.setAttribute('position', new THREE.Float32BufferAttribute(line2, 3 ))
  // geometry.setFromPoints([p1, p2])
  // geometry1.setFromPoints([p3, p4])

  const color1 = new THREE.Color(0xff0000), color2 = new THREE.Color(0x0000ff), color3 = new THREE.Color(0x00ff00)
  const colors = [
    color1.r, color1.g, color1.b,
    color2.r, color2.g, color2.b
  ]
  const colors1 = [
    color3.r, color3.g, color3.b,
    color2.r, color2.g, color2.b,
  ]
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3 ))
  geometry1.setAttribute('color', new THREE.Float32BufferAttribute(colors1, 3))

  for (let i = -20; i <= 20; i++) {
    const line = new THREE.Line(geometry, material)
    line.position.y = i
    scene.add(line)

    const line2 = new THREE.Line(geometry1, material)
    line2.position.x = i
    scene.add(line2)
  }
}
let stats = null
function initStats() {
  stats = new Stats()
  stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
  const style = stats.dom.getAttribute('style')
  stats.dom.setAttribute('style', style.replace('left: 0px', 'right: 0'))
  document.body.appendChild(stats.dom)
}

function initModel() {
  const loader = new GLTFLoader()
  loader.load(
    // resource URL
    'models/scene.gltf',
    // called when the resource is loaded
    (gltf) => {
      gltf.scene.position.x = 1
      gltf.scene.position.y = 1
      gltf.scene.position.z = 0
      scene.add(gltf.scene)
      /* gltf.animations // Array<THREE.AnimationClip>
      gltf.scene // THREE.Group
      gltf.scenes // Array<THREE.Group>
      gltf.cameras // Array<THREE.Camera>
      gltf.asset // Object */
    },
    // called while loading is progressing
    (xhr) => {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    (error) => {
      console.log('An error happened', error)
    }
  )
}
// 实时渲染
function render() {
  /* cube.rotation.x += 0.01
  cube.rotation.y += 0.01 */
  cube.rotateY(0.01)
  cube.rotateX(0.01)
  // cube.position.x += 0.01
  // 真正渲染
  renderer.render(scene, camera)
  requestAnimationFrame(render)
  stats.update()
  TWEEN.update()
}


onMounted(() => {
  initScene()
  initCamera()
  initRenderer()
  initControls()
  initCube()
  // initModel()
  initLight()
  initObject()
  initStats()
  render()

  let tween1 = new TWEEN.Tween(cube.position).to({ x: 4, y: 4, z: 4 }, 5 * 1000)
  let tween2 = new TWEEN.Tween(cube.position).to({ x: 0, y: 0, z: 0 }, 5 * 1000)
  tween1.chain(tween2)
  tween2.chain(tween1)  

  // tween1.start()
})
</script> 

<template>
  <div>
    <div>three demo</div>
    <div id="three-container"></div>
  </div>
</template>

<style scoped>
</style>