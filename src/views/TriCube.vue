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
  camera.position.set(200, 200, 300)
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

  const mesh = new THREE.Mesh(geometry, material)
  // 靠移动 mesh 的位置，调整group整体的中心点
  mesh.translateX(-50)
  mesh.translateZ(-50)
  mesh.translateY(50)

  triCube = new THREE.Group()
  triCube.add(mesh)

  // console.log(mesh) // mesh对象 里面的数据，都是 mesh 最早产生的默认数据
  const box3 = new THREE.Box3().setFromObject(mesh) // 获取到 mesh 当前的 boundingBox 坐标（因为有移动过）
  /* const meshCenter = box3.getCenter(mesh.position)
  console.log(box3, meshCenter) */

  const boxHelper = new THREE.BoxHelper(mesh, 0xffff00)
  triCube.add(boxHelper)

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

function initGrid() {
  const helper = new THREE.GridHelper(1000, 20, 0xff0000, 0x00ff00)
  scene.add(helper)
}

const raycaster = new THREE.Raycaster()
// 由于 triCube 本身就在canvas 0,0 处，pointer 默认也在 0,0 处。会导致初始化时，被看成相交状态。所以初始值修改成 -1,-1
const pointer = new THREE.Vector2(-1,-1)
function onPointerMove(event) {
  // 转换为归一化坐标
  /**
   * 1. event的 x,y 坐标是从左上角为 0,0
   * 2. there.js的 0,0 坐标为 canvas 中心点，且 x，y, z 轴的最大值为 1，最小值为 -1
   * 3. 所以要把鼠标的坐标转换为 Vector2 的坐标
   * 4. Vector2 坐标轴总长度是 2，所以 event.clientX / canvasWidth * 2 - 1，即是真实的 Vector2 x轴坐标，y轴坐标同理
   */
  pointer.x = (event.clientX / window.innerWidth * 2) - 1
  pointer.y = -(event.clientY / window.innerHeight * 2) + 1
}
// 实时渲染
let INTERSECTED
function render() {
  /* triCube.rotateX(0.01) // 旋转的值为 2 * Math.PI 为一周（360度）
  triCube.rotateY(0.01) */
  // 与上面效果一致
  const v1 = new THREE.Vector3(1,1,0)
  triCube.rotateOnAxis(v1, 0.01) // 围绕某一向量轴旋转
  // controls.update() // if controls.autoRotate sets to true
  // triCube.translateX(1)
  const box3 = new THREE.Box3().setFromObject(triCube) // 获取到object当前的boundingBox坐标（会随着object的移动或变形而改变）
  // console.log(box3)

  raycaster.setFromCamera(pointer, camera)
  // const intersects = raycaster.intersectObjects([scene.children], false)
  const intersects = raycaster.intersectObjects([triCube], false) // 这里只监听这一个物体
  // 由于 triCube 虽然由很多三角形组成，但是整体为一个 Mesh, 所以这里 pointer 与 triCube 相交时会把整体改成红色
  if ( intersects.length > 0 ) {
    // 从示例中看，intersects[ 0 ] 即是当前选中的物体
    if ( INTERSECTED != intersects[ 0 ].object) {
      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 0xff0000 );
    }
  } else {
    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
    INTERSECTED = null;
  }

  // 真正渲染
  renderer.render(scene, camera)
}

function animate() {
  requestAnimationFrame(animate)

  render()
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
  initGrid()

  animate()

  document.addEventListener('mousemove', onPointerMove)

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