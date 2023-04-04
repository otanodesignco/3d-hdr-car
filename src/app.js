import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import GUI from 'lil-gui'



// sizes object
const sizes = 
{
    width: window.innerWidth,
    height: window.innerHeight
}

// canvas
const canvas = document.querySelector('canvas.webgl')

// setup scene
const scene = new THREE.Scene()




/**
 * 
 * Camera Setup
 * 
 */

// setup camera
const camera = new THREE.PerspectiveCamera( 90, sizes.width / sizes.height, 0.1, 100 )
camera.position.z = 4 // move camera back

/**
 * 
 *  Lights
 * 
 */

// const worldLight = new THREE.AmbientLight( 0x404040, 1 )
// scene.add( worldLight )

/**
 * 
 *  setup Renderer
 * 
 */

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: canvas
})

renderer.setSize( sizes.width, sizes.height )
renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) )
renderer.outputEncoding = THREE.sRGBEncoding
renderer.physicallyCorrectLights = true
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1

/**
*
*  Setup orbit control
*
*/

const controls = new OrbitControls( camera, canvas )
controls.enableDamping = true

/**
 * 
 *  Models and Meshes
 * 
 */

// floor geometry
const floorGeo = new THREE.PlaneGeometry( 6, 6 )

// floor material
const floorMat = new THREE.MeshBasicMaterial(
    {
        color: 0xff
    }
)

// floor mesh

const floor = new THREE.Mesh( floorGeo, floorMat )
floor.rotation.x = -90 * ( Math.PI / 180 )
floor.position.y = -1

// car model 

let car = ''

// car material

const carMat = new THREE.MeshPhysicalMaterial({
    color: 0x066f68,
    emissive: 0x000000,
    roughness: 0.1,
    metalness: 0,
    reflectivity: 0.5,
    clearcoat: 0.36,
    clearcoatRoughness: 0.2,
    metalnessMap: new THREE.TextureLoader().load('./textures/metal.png'),
    normalMap: new THREE.TextureLoader().load('./textures/normal.png'),
    roughnessMap: new THREE.TextureLoader().load('./textures/roughness.png'),
})

// object to hold car meshes to change the cars color
let carBody = ''


new GLTFLoader().load('./models/Car/car2.glb', ( glb ) =>
{

    // assign carparts as new meshes to manipulate the colors
    carBody = glb.scene.getObjectByName( 'Car_Body' )
    carBody.material = carMat
    
    
    car = glb.scene
    car.position.y = -1
    car.position.z = 1.2
    car.rotation.y = -90 * ( Math.PI / 180 )

    scene.add( car )
})


/**
 * 
 *  Debug
 * 
 */

const debug = new GUI()

debug.addColor( carMat, 'color' )
debug.addColor( carMat, 'emissive')
debug.add( carMat, 'metalness').min( 0.0 ).max( 1.0 ).step( 0.01 )
debug.add( carMat, 'roughness').min( 0.0 ).max( 1.0 ).step( 0.01 )
debug.add( carMat, 'reflectivity').min( 0.0 ).max( 1.0 ).step( 0.01 )
debug.add( carMat, 'clearcoat').min( 0.0 ).max( 1.0 ).step( 0.01 )
debug.add( carMat, 'clearcoatRoughness').min( 0.0 ).max( 1.0 ).step( 0.01 )



/** 
 * 
 *  Add Meshes & Models to scene
 * 
*/


// add meshes

scene.add( floor )

/**
 * 
 * 
 * Enviroment Map
 * 
 */

// enviroment map

new RGBELoader().load('./textures/environmentMaps/building.hdr', ( env ) =>
{
    env.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = env
    

})

/**
 * 
 *  Handle Resize of screen
 * 
 */

window.addEventListener('resize', () =>
{
    // update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // update renderer
    renderer.setSize( sizes.width, sizes.height )
    renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) )
})

/**
*
*  Animate method
*
*/


const animate = () =>
{


    // rotate car
    if( car )
    {
        // car is loaded rotate it
        car.rotation.y += 1 * 0.008
    }

    // render scene
    renderer.render( scene, camera )

    // update controls
    controls.update()

    window.requestAnimationFrame( animate )

}

animate()