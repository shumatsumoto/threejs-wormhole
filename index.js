import * as THREE from "https://cdn.skypack.dev/three@0.133.1";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js";
import { ImprovedNoise } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/math/ImprovedNoise.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0.5, 0.5, 15);
const renderer = new THREE.WebGLRenderer({ antialias: true });
scene.fog = new THREE.FogExp2(0x000000, 0.01);
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

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
const tubeVerts = geo.attributes.position;

const mat = new THREE.PointsMaterial({ color: 0x0099ff, size: 0.25 });
const points = new THREE.Points(geo, mat);
points.rotation.x = Math.PI / 2;
scene.add(points);

let p = new THREE.Vector3();
let v3 = new THREE.Vector3();
const noise = new ImprovedNoise();
let noiseFreq = 0.9;

for (let i = 0; i < tubeVerts.length; i++) {
  p.fromBufferAttribute(tubeVerts, i);
  v3.copy(p);
  let vertexNoise = noise.noise(
    v3.x * noiseFreq,
    v3.y * noiseFreq,
    v3.z * noiseFreq
  );
  v3.addScaledVector(p, vertexNoise);
  tubeVerts.setXYZ(i, v3.x, v3.y, v3.z);
}

function animate(t) {
  requestAnimationFrame(animate);
  // camera.position.x = Math.cos(t * 0.001) * 1.5;
  // camera.position.y = Math.sin(t * 0.001) * 1.5;
  points.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate(0);

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
