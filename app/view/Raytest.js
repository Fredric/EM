var camera, scene, renderer, geometry, material, mesh;

init();
animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 300;
    
    scene.add(camera);

    //Add cuba at 40/40
    geometry = new THREE.CubeGeometry(20, 20, 20);
    material = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    
    //Add Ray    
    var origin = new THREE.Vector3(100, 0, 0),
        direction = new THREE.Vector3(-1, 0, 0),
        ray = new THREE.Raycaster(origin, direction),
        collisionResults = ray.intersectObjects([mesh]);
      
    alert('Ray collides with mesh. Distance :' + collisionResults[0].distance)
    
    //Add Arrow to show ray
    scene.add( new THREE.ArrowHelper(direction, origin, 50, 0x000000));
    
    
    
    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

}

function animate() {

    requestAnimationFrame(animate);
    render();

}

function render() {

    renderer.render(scene, camera);
    camera.updateProjectionMatrix();

}