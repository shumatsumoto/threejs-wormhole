import * as THREE from "https://cdn.skypack.dev/three@0.133.1";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js";
import { ImprovedNoise } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/math/ImprovedNoise.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0.5, 0.5, 15);
const renderer = new THREE.WebGLRenderer({ antialias: true });
scene.fog = new THREE.FogExp2(0x000000, 0.025);
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const radius = 3;
const tubeLength = 10;
const geo = new THREE.CylinderGeometry(
  radius,
  radius,
  tubeLength,
  32,
  256,
  true
);
const mat = new THREE.MeshNormalMaterial();
const tube = new THREE.Mesh(geo, mat);
scene.add(tube);

function animate(t) {
  requestAnimationFrame(animate);
  // camera.position.x = Math.cos(t * 0.001) * 1.5;
  // camera.position.y = Math.sin(t * 0.001) * 1.5;
  tube.rotation.y = t * 0.0005;
  renderer.render(scene, camera);
}

animate(0);

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
