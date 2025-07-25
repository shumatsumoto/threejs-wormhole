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
const tubeLength = 100;
const geo = new THREE.CylinderGeometry(
  radius,
  radius,
  tubeLength,
  32,
  2048,
  true
);
const tubeVerts = geo.attributes.position;

const mat = new THREE.PointsMaterial({
  color: 0x0099ff,
  size: 0.05,
  vertexColors: true,
});
const points = new THREE.Points(geo, mat);
points.rotation.x = Math.PI / 2;
scene.add(points);

let p = new THREE.Vector3();
let v3 = new THREE.Vector3();
const noise = new ImprovedNoise();
let noiseFreq = 0.2;
let hueNoiseFreq = 0.1;
const col = new THREE.Color();

let noiseAmp = 0.5;
const colors = [];

for (let i = 0; i < tubeVerts.length; i++) {
  p.fromBufferAttribute(tubeVerts, i);
  v3.copy(p);
  let vertexNoise = noise.noise(
    v3.x * noiseFreq,
    v3.y * noiseFreq,
    v3.z * noiseFreq
  );
  v3.addScaledVector(p, vertexNoise * noiseAmp);
  tubeVerts.setXYZ(i, v3.x, p.y, v3.z);

  let hueNoise = noise.noise(
    v3.x * hueNoiseFreq,
    v3.y * hueNoiseFreq,
    v3.z * hueNoiseFreq
  );
  col.setHSL(hueNoise, 1, 0.5);
  colors.push(col.r, col.g, col.b);
}

geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

console.log(v3);
console.log("Tube Vertices:", tubeVerts);

function animate(t) {
  requestAnimationFrame(animate);
  // camera.position.x = Math.cos(t * 0.001) * 1.5;
  // camera.position.y = Math.sin(t * 0.001) * 1.5;
  points.rotation.y += 0.002;
  renderer.render(scene, camera);
}

animate(0);

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
