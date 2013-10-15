Ext.define('EM.view.Scene', {
    extend: 'Ext.Component',
    fullscreen: true,
    config: {
        colissionArray: [],
        systems: [],
        listeners: {
            painted: 'initScene',
            resize: 'onResize'

        }
    },
    kalle: function () {
        alert('tap')
    },
    onResize: function (a) {
        var me = this,
            SCREEN_WIDTH = me.element.getWidth(),
            SCREEN_HEIGHT = me.element.getHeight();
        if (me.renderer) {
            me.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
            me.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
            me.camera.updateProjectionMatrix();

        }
    },

    initScene: function () {
        var me = this;
        var destination;
        var particle;
        var from = {};
        var to = {};

        me.scene = new THREE.Scene();

        me.initCamera();
        me.initRenderer();
        me.initControls();
        // me.initLights();
        //me.addSphere();
        me.addHelpers();


        //me.addPlanet(-1050, 0, -5050, 'Sol' );
        var PI2 = Math.PI * 2;
        var systemMaterial = new THREE.ParticleCanvasMaterial({

            color: 0xCCCCCC,
            program: function (context) {

                context.beginPath();
                context.arc(0, 0, 1, 0, PI2, true);
                context.fill();

            }

        });
        var gateMaterial = new THREE.ParticleCanvasMaterial({

            color: 0xFF3366,
            program: function (context) {

                context.beginPath();
                context.arc(0, 0, 1, 0, PI2, true);
                context.fill();

            }

        });

        var geometry = new THREE.Geometry();
        Ext.StoreManager.first().each(function (record) {

            if (record.get('ObjType') === "System") {
//                destination = null;
//                particle = new THREE.Particle(systemMaterial);
//                particle.position.x = record.get('SX');
//                particle.position.y = 0 //record.get('SY');
//                particle.position.z = record.get('SZ');
//                particle.scale.x = particle.scale.y = 30;
//                me.scene.add(particle);
//                me.getSystems().push(particle);
//                geometry.vertices.push(particle.position);
                me.addPlanet(record.get('SX'), record.get('SY'), record.get('SZ'), record.get('ObjName'), record);

            }

            if (record.get('ObjType') === "Gate") {

                destination = Ext.StoreManager.first().getById(record.get('destination'));

                particle = new THREE.Particle(gateMaterial);
                particle.position.x = record.get('SX');
                particle.position.y = 0 //record.get('SY');
                particle.position.z = record.get('SZ');
                particle.scale.x = particle.scale.y = 20;
                me.scene.add(particle);
                geometry.vertices.push(particle.position);
                //me.addGate(record.get('SX'), record.get('SY'), record.get('SZ'), record.get('ObjName'), record);


            }
            if (record.get('ObjType') === "Wormhole") {
                destination = Ext.StoreManager.first().getById(record.get('destination'));
                particle = new THREE.Particle(gateMaterial);
                particle.position.x = record.get('SX');
                particle.position.y = 0//record.get('SY');
                particle.position.z = record.get('SZ');
                particle.scale.x = particle.scale.y = 20;
                me.scene.add(particle);
                geometry.vertices.push(particle.position);
                //me.addWormhole(record.get('SX'), record.get('SY'), record.get('SZ'), record.get('ObjName'), record);


            }

            if (destination) {
                from = {
                    x: record.get('SX'),
                    y: 0,//record.get('SY'),
                    z: record.get('SZ')
                };
                to = {
                    x: destination.get('SX'),
                    y: 0,//destination.get('SY'),
                    z: destination.get('SZ')
                }
                me.addLine(from, to, 0x003366);
            }
            // if (record.get('sector').indexOf('KQ') !== -1) {

            // me.addCube(record.get('SX'), 0, record.get('SZ'))

            //  }


        }, me);


        (function animloop() {
            requestAnimationFrame(animloop);
            me.renderMe();
            me.updateMe()
        })();


        Ext.each(me.getColissionArray(), function (mesh) {
            me.loopPosition(mesh)
            mesh.rotation.x = 90 * Math.PI / 180
            mesh.translateZ(4)
            mesh.visible = false;
        });
        Ext.each(me.getColissionArray(), function (mesh) {

        });

        //document.addEventListener('mousemove', onMouseMove, false);


    },
    onMouseMove: function () {

    },
    loopPosition: function (mesh) {
        var me = this;

        var origo = mesh.position.clone()

        mesh.translateZ(75)
        mesh.position.setX(origo.x + 400)

        while (me.checkMyPosition(mesh)) {

            mesh.translateZ(75)
            mesh.position.setX(origo.x + 400)

        }
        var endpoint = mesh.position.clone()

        endpoint.setX(endpoint.x - mesh.geometry.width / 2 - 10);
        //mesh.lableLine = me.addLine(origo, endpoint, 0x666666)

    },
    initCamera: function () {
        var me = this,
            SCREEN_WIDTH = me.element.getWidth(),
            SCREEN_HEIGHT = me.element.getHeight();

        var VIEW_ANGLE = 90, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 10000;

        me.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        me.scene.add(me.camera);
        me.camera.position.set(0, -5000, 0);
        me.camera.lookAt(me.scene.position);

        me.camera.rotation.x = 90 * Math.PI / 180
        me.camera.rotation.z = 0 * Math.PI / 180


    },
    initRenderer: function () {

        var me = this,
            SCREEN_WIDTH = me.element.getWidth(),
            SCREEN_HEIGHT = me.element.getHeight();
        me.renderer = new THREE.CanvasRenderer();

        //me.renderer = new THREE.WebGLRenderer({antialias: true});
        me.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        me.element.dom.appendChild(me.renderer.domElement);
    },
    initControls: function () {
        var me = this;
        me.controls = new THREE.OrbitControls(me.camera, me.renderer.domElement);
    },
    initLights: function () {
        var me = this;
        var light = new THREE.PointLight(0xffffff);
        light.position.set(0, 250, 0);
        me.scene.add(light);
        var ambientLight = new THREE.AmbientLight(0x111111);

    },


    updateMe: function () {
        var me = this;
        me.controls.update();
        if (me.camera.position.y >= -1001) {
            var frustum = new THREE.Frustum();
            var cameraViewProjectionMatrix = new THREE.Matrix4();

            // every time the camera or objects change position (or every frame)

            me.camera.updateMatrixWorld(); // make sure the camera matrix is updated
            me.camera.matrixWorldInverse.getInverse(me.camera.matrixWorld);
            cameraViewProjectionMatrix.multiplyMatrices(me.camera.projectionMatrix, me.camera.matrixWorldInverse);
            frustum.setFromMatrix(cameraViewProjectionMatrix);

            // frustum is now ready to check all the objects you need
            var c = 0
            var visibleTexts = [];


            Ext.each(me.getSystems(), function (mesh) {
                var arr = frustum.intersectsObject(mesh);
                mesh.text.visible = arr
                if(mesh.lableLine){
                                   mesh.lableLine.visible = arr
                               }

            });


        } else {
            Ext.each(me.getSystems(), function (mesh) {

                mesh.text.visible = false
                if(mesh.lableLine){
                    mesh.lableLine.visible = false
                }

            });
        }
    },

    renderMe: function () {
        var me = this;
        me.renderer.render(me.scene, me.camera);
    },

    addSphere: function () {
        var me = this,
            sphereGeometry = new THREE.SphereGeometry(50, 32, 16);
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x8888ff});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 0, 0);
        me.scene.add(sphere);

    },
    addPlanet: function (x, y, z, text, record) {

        var me = this,
            sphereGeometry = new THREE.CircleGeometry(15, 3);
        var sphereMaterial = new THREE.MeshNormalMaterial({color: 0x8888ff});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(x, y, z);
        me.scene.add(sphere);
        record.mesh = sphere;
        sphere.record = record;
        sphere.text = me.addTxt(record.get('SX'), record.get('SZ'), record.get('ObjName'))
        me.getSystems().push(sphere);


    },
    addGate: function (x, y, z, text, record) {

        var me = this,
            sphereGeometry = new THREE.SphereGeometry(15);
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xCCFF33});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(x, y, z);
        me.scene.add(sphere);
        record.sprite = sphere
    },
    addWormhole: function (x, y, z, text, record) {

        var me = this,
            sphereGeometry = new THREE.SphereGeometry(15);
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xFF3366});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(x, y, z);
        me.scene.add(sphere);
        record.sprite = sphere

        var spritey = me.makeTextSprite(" " + text + " ",
            { fontsize: 30, borderColor: {r: 255, g: 0, b: 0, a: 1.0}, backgroundColor: {r: 255, g: 100, b: 100, a: 0.8} });
        spritey.position.set(x, y, z);
        me.scene.add(spritey);

    },
    addLine: function (from, to, color) {
        var me = this;
        var lineGeometry = new THREE.Geometry();
        var vertArray = lineGeometry.vertices;
        vertArray.push(new THREE.Vector3(from.x, from.y, from.z), new THREE.Vector3(to.x, to.y, to.z));
        lineGeometry.computeLineDistances();
        var lineMaterial = new THREE.LineBasicMaterial({color: color});
        var line = new THREE.Line(lineGeometry, lineMaterial);
        line.translateY(4)
        me.scene.add(line);
        return line;
    },
    addSky: function () {
        var me = this;
        var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
        // BackSide: render faces from inside of the cube, instead of from outside (default).
        var skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide });
        var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
        me.scene.add(skyBox);
    },
    initFog: function () {
        var me = this;
        me.scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);
    },
    addHelpers: function () {
        var me = this;

        var gridXZ = new THREE.GridHelper(10000, 1000);
        gridXZ.setColors(new THREE.Color(0x006600), new THREE.Color(0x006600));
        gridXZ.position.set(0, 0, 0);
        me.scene.add(gridXZ);

    },

    addTxt: function (x, z, text) {
        var me = this;
        var canvas1 = document.createElement('canvas');
        canvas1.height = 50;
        canvas1.width = 350
        var context1 = canvas1.getContext('2d');
        context1.font = "40px Arial";
        context1.fillStyle = "rgba(255,0,0,0.95)";
        context1.fillText(text + " ", 0, 30);

        // canvas contents will be used for a texture
        var texture1 = new THREE.Texture(canvas1)
        texture1.needsUpdate = true;

        var material1 = new THREE.MeshBasicMaterial({map: texture1});
        // material1.transparent = true;


        var mesh1 = new THREE.Mesh(
            new THREE.PlaneGeometry(canvas1.width, canvas1.height),
            material1
        );


        mesh1.position.set(x, 0, z);
        // mesh1.rotation.x = 90 * Math.PI / 180
        me.scene.add(mesh1);

        mesh1.updateMatrixWorld()


        me.getColissionArray().push(mesh1)

        return mesh1

    },
    addCube: function (x, y, z) {
        var me = this,
            cubeGeometry = new THREE.CubeGeometry(400, 50, 10);
        var cubeMaterial = new THREE.MeshNormalMaterial({color: 0x8888ff});
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(x, y, z);
        cube.rotation.x = 90 * Math.PI / 180
        me.scene.add(cube);
        me.getColissionArray().push(cube)


    },
    checkMyPosition: function (cube) {
        var ray,
            hit = false,
            me = this;

        var collisions, i,
            distance = 50;

        me.rays = [
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(1, 0, -1),
            new THREE.Vector3(-1, 0, -1)
        ];

        me.caster = new THREE.Raycaster();

        cube.translateZ(30);
        cube.updateMatrixWorld()


        for (i = 0; i < this.rays.length; i += 1) {
            me.caster.set(cube.position.clone(), this.rays[i]);
            collisions = this.caster.intersectObjects(me.getColissionArray());
            if (collisions.length > 0 && collisions[0].distance <= distance) {
                hit = true
            }
        }
        cube.translateZ(-30);

        if (collisions.length > 0 && collisions[0].distance <= distance) {
            hit = true
        }


        cube.updateMatrixWorld()

        if (hit === false) {
            hit = me.checkCube(cube)
        }


        return hit === true ? hit : false
    },
    checkCube: function (cube) {

        var ray,
            hit = false,
            me = this,
            collisions, i,
            distance = 50;

        me.caster = new THREE.Raycaster();
        me.rays = [
            new THREE.Vector3(1, 0, -1),
            new THREE.Vector3(1, 0, 1),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(-1, 0, -1),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(-1, 0, 1)

        ];
        for (i = 0; i < this.rays.length; i += 1) {
            me.caster.set(cube.position.clone(), this.rays[i]);
            collisions = this.caster.intersectObjects(me.getColissionArray());
            if (collisions.length > 0 && collisions[0].distance <= distance) {
                hit = true
            }
        }
        return hit === true ? hit : false

    }
});