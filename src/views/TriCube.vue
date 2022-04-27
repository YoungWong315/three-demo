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
  scene.fog = new THREE.Fog(0xff0000, 10, 1000)
}
// 相机
let camera = null
function initCamera() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
  // 相机默认在原点（0,0,0），要综合考虑场景中物体z轴的距离才能看到，需要z轴里原点远一些（靠近人的方向）
  camera.position.set(0, 0, 300)
  camera.up.set(0,1,0)
  // camera.lookAt(10, 10, 10)
}
// 渲染器
let renderer = null
function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true /* 抗锯齿(影响一部分性能) */ })
  renderer.setSize(window.innerWidth, window.innerHeight)
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
  // controls.autoRotate = true
  controls.update()
}
let light
function initLight() {
  // light = new THREE.AmbientLight(0xffffff, 1.0)
  light = new THREE.DirectionalLight(0xffffff, 1.0)
  light.position.x = 100
  light.position.y = 100
  light.position.z = 100

  const light2 = new THREE.DirectionalLight(0xffffff, 1.0)
  light.position.x = -100
  light.position.y = -100
  light.position.z = 100

  scene.add(light)
  scene.add(light2)
}
let triCube
function initTriangleCube() {
  const count = 10000
  const positions = new Float32Array(count * 3 * 3)
  const normals = new Float32Array(count * 3 * 3)
  const colors = new Float32Array(count * 3 * 3)

  const cubeDiameter = 100, cubeSemidiameter = cubeDiameter / 2 // 方形的直径和半径
  const triSize = 6, triSemiSize = triSize / 2 // 三角形的大小

  const pA = new THREE.Vector3()
  const pB = new THREE.Vector3()
  const pC = new THREE.Vector3()
  const cb = new THREE.Vector3()
  const ab = new THREE.Vector3()

  // i += 9, 一个三角形需要九个数字决定（一个点三个数字）
  for (let i = 0;i < positions.length - 1; i+=9) {
    // positions

    // 随机出在cube范围内的点 x = [-50, 50]，此处的 x,y,z 相当于三角形的中心点
    const x = Math.random() * cubeDiameter - cubeSemidiameter
    const y = Math.random() * cubeDiameter - cubeSemidiameter
    const z = Math.random() * cubeDiameter - cubeSemidiameter

    // 把中心点加上triSize，随机出三角形的三个顶点
    const ax = x + Math.random() * triSize - triSemiSize
    const ay = y + Math.random() * triSize - triSemiSize
    const az = z + Math.random() * triSize - triSemiSize

    const bx = x + Math.random() * triSize - triSemiSize
    const by = y + Math.random() * triSize - triSemiSize
    const bz = z + Math.random() * triSize - triSemiSize
    
    const cx = x + Math.random() * triSize - triSemiSize
    const cy = y + Math.random() * triSize - triSemiSize
    const cz = z + Math.random() * triSize - triSemiSize

    positions[i]   = ax
    positions[i+1] = ay
    positions[i+2] = az

    positions[i+3] = bx
    positions[i+4] = by
    positions[i+5] = bz
    
    positions[i+6] = cx
    positions[i+7] = cy
    positions[i+8] = cz

    // colors
    // [-50, 50] / 100 + 0.5 = [0, 1]
    const colorR = x / cubeDiameter + 0.5, colorG = y / cubeDiameter + 0.5, colorB = z / cubeDiameter + 0.5
    colors[i]   = colorR
    colors[i+1] = colorG
    colors[i+2] = colorB

    colors[i+3] = colorR
    colors[i+4] = colorG
    colors[i+5] = colorB
    
    colors[i+6] = colorR
    colors[i+7] = colorG
    colors[i+8] = colorB

    // 计算法线，为了显示光照效果（使用 MeshPhongMaterial 需要 ） 

    // 先初始化三个点（为了使用 Vector3 的函数）
    pA.set(ax, ay, az)
    pB.set(bx, by, bz)
    pC.set(cx, cy, cz)

    // 向量的减法，算出 c->b 和 a -> b 向量
    cb.subVectors(pC, pB)
    ab.subVectors(pA, pB)
    // 通过 cb 和 ab 向量求叉乘，得到向量积(正交向量，两两成90度角)。
    // 在物理学光学和计算机图形学中，叉积被用于求物体光照相关问题。求解光照的核心在于求出物体表面法线，而叉积运算保证了只要已知物体表面的两个非平行矢量（或者不在同一直线的三个点），就可依靠叉积求得法线 -- 百度百科
    cb.cross(ab)

    // 向量归一化，即不管向量表示多长，都转换成1，只表示方向
    cb.normalize()

    const nx = cb.x, ny = cb.y, nz = cb.z
    normals[i]   = nx
    normals[i+1] = ny
    normals[i+2] = nz

    normals[i+3] = nx
    normals[i+4] = ny
    normals[i+5] = nz
    
    normals[i+6] = nx
    normals[i+7] = ny
    normals[i+8] = nz
  }
  const geometry = new THREE.BufferGeometry()
  const material = new THREE.MeshPhongMaterial({ vertexColors: true, side: THREE.DoubleSide })

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))

  // geometry.computeBoundingBox()

  triCube = new THREE.Mesh(geometry, material)
  scene.add(triCube)
}
let stats = null
function initStats() {
  stats = new Stats()
  stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
  const style = stats.dom.getAttribute('style')
  stats.dom.setAttribute('style', style.replace('left: 0px', 'right: 0'))
  document.body.appendChild(stats.dom)
}
// 实时渲染
function render() {
  triCube.rotateX(0.01) // 旋转的值为 2 * Math.PI 为一周（360度）
  triCube.rotateY(0.01)
  // controls.update() // if controls.autoRotate sets to true
  // 真正渲染
  renderer.render(scene, camera)
  requestAnimationFrame(render)
  stats.update()
}

onMounted(() => {
  initScene()
  initCamera()
  initRenderer()
  initControls()
  initLight()
  initStats()
  initTriangleCube()
  render()

  window.onresize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth/ window.innerHeight
    camera.updateProjectionMatrix() // 相机参数修改后，需要使用此方法重新计算投影数据
  }
})
</script> 

<template>
  <div>
    <div>tricube demo</div>
    <div id="three-container"></div>
  </div>
</template>

<style scoped>
</style>