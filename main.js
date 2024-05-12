import * as THREE from 'three';

//spinning control
let speed = 0.0;
const SPEED_STEP = 0.0001;
const MAX_SPEED = 0.035;
const MIN_SPEED = 0.005;
let speedup = true;

//color controls
const INITIAL_COLOR = 'ffffff';
let targetColor = parseHexColor(INITIAL_COLOR);
let currentColor = parseHexColor(INITIAL_COLOR);
const transitionSpeed = 600;
let transitionStep;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.set(10, 10, 10)
camera.lookAt(scene.position)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
renderer.shadowMap.enable = true;
document.body.appendChild(renderer.domElement);
const geometry = new THREE.BoxGeometry(3, 3, 3)
const material = new THREE.MeshStandardMaterial({
    color: 0xF2F2F2
})
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, 0)
cube.castShadow = true;
scene.add(cube);
let spoltLight = new THREE.SpotLight(rgb2hex(currentColor), 40)
spoltLight.position.set(3, 3, 3)
spoltLight.target = cube;
scene.add(spoltLight)

function update() {
    if (speedup) {
        if (speed + SPEED_STEP > MAX_SPEED) {
            speedup = false;
        }
    } else {
        if (speed - SPEED_STEP < MIN_SPEED) {
            speedup = true;
        }
    }
    if (speedup) {
        speed += SPEED_STEP;
    } else {
        speed -= SPEED_STEP;
    }
    cube.rotation.x += speed;
    cube.rotation.y += speed;
    cube.rotation.z += speed;
    updateTargetColor();
    updateCurrentColor()
    spoltLight.color.setRGB(currentColor[0] / 255, currentColor[1] / 255, currentColor[2] / 255);

}

function run() {
    update();
    render();
    requestAnimationFrame(run);
}

function render() {
    renderer.render(scene, camera);
}

function updateTargetColor() {
    if (currentColor.every((v, i) =>
        targetColor[i] === v
    )) {
        targetColor = generateColor();
        transitionStep = currentColor.map((v, i) => (targetColor[i] - v) / transitionSpeed);
    }
}

function parseHexColor(hexCode) {
    return hexCode.match(/.{1,2}/g).map(v => parseInt(v, 16));
}

function stringToHex(string) {
    return parseInt(string, 16)
}

function minMaxRNG(maximum, minimum) {
    return (Math.random() * (maximum - minimum)) + minimum;
}

function generateColor() {
    let color = [];
    for (let i = 0; i < 3; i++) {
        let num = minMaxRNG(0, 255);
        color.push(num);
    }
    return color;
}

function rgb2hex(colorArray) {
    return stringToHex(colorArray.map(v => v.toString(16)).join());
}

function updateCurrentColor() {
    transitionStep.forEach((v, i) => {
        if (Math.abs(currentColor[i] - targetColor[i]) < Math.abs(v)) {
            currentColor[i] = targetColor[i]
        } else {
            currentColor[i] += v
        }
    });
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/ window.innerHeight
    camera.updateProjectionMatrix()

}, false);

run();



