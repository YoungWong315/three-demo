<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const webglCanvasRef = ref(null)
const query = router.currentRoute.value.query

// 场景
let scene = null
function initScene() {
  scene = new THREE.Scene()
}
// 相机
let camera = null
function initCamera() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
  // 相机默认在原点（0,0,0），所以什么都看不到，需要z轴里原点远一些（靠近人的方向）
  camera.position.z = 5
  camera.position.y = 0
  console.log(camera)
}
// 渲染器
let renderer = null
function initRenderer() {
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x008000, 0.4)
  document.body.appendChild(renderer.domElement)
}
// 灯光目前无效
let light
function initLight() {
    light = new THREE.DirectionalLight(0xFF0000, 1.0, 0)
    light.position.set(100, 100, 200)
    scene.add(light)
}
// 画一个cube
let cube = null
function initCube() {
  const geometry = new THREE.BoxGeometry(1,1,1)
  const material = new THREE.MeshBasicMaterial({color: 0x00ffff})
  cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
}
// 画一个线
function initObject() {
  var geometry = new THREE.BufferGeometry()
  var material = new THREE.LineBasicMaterial( { color: 0xffffff } )

  // 这样设置点，是一个斜线
  var p1 = new THREE.Vector3( -100, 0, 100 )
  var p2 = new THREE.Vector3(  100, 0, -100 )
  geometry.setFromPoints([p1, p2])

  var line = new THREE.Line(geometry, material)
  scene.add(line)
}
// 实时渲染
function render() {
  requestAnimationFrame(render)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  // 真正渲染
  renderer.render(scene, camera)
}

onMounted(() => {
  initScene()
  initCamera()
  initRenderer()
  // xxxxxxxx
  initLight()
  initCube()
  initObject()
  render()
})
</script> 

<template>
  <div>
    <div>three demo</div>
  </div>
</template>
<style scoped>

</style>