Ext.define('EM.view.Scene', {
    extend: 'Ext.Component',
    fullscreen: true,
    config: {
        colissionArray: [],
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
                destination = null;
                particle = new THREE.Particle(systemMaterial);
                particle.position.x = record.get('SX');
                particle.position.y = 0 //record.get('SY');
                particle.position.z = record.get('SZ');
                particle.scale.x = particle.scale.y = 30;
                me.scene.add(particle);
                geometry.vertices.push(particle.position);


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
                me.addLine(from, to);
            }

            me.addTxt(record.get('SX'), record.get('SZ'), record.get('ObjName'))
            //me.addCube(record.get('SX'), 0, record.get('SZ'))


        }, me);

//        var origin = new THREE.Vector3(-1000, 0, 1000);
//        var terminus = new THREE.Vector3(2000, 0, 1000);
//        var direction = new THREE.Vector3().subVectors(terminus, origin);
//
//
//
//        //me.scene.add( new THREE.ArrowHelper(terminus, origin, 1000, 0xffffff));
//
//       var ray = new THREE.Raycaster(origin.clone(), terminus);
//        var collisionResults = ray.intersectObjects(me.getColissionArray());
//        console.log(me.getColissionArray().length, collisionResults);


        // me.addHelpers();
        //me.initFog();

//        var axes = new THREE.AxisHelper(1000);
//        me.scene.add(axes);

        (function animloop() {
            requestAnimationFrame(animloop);
            me.renderMe();
            me.updateMe()
        })();


//        Ext.each(me.getColissionArray(), function(mesh){
//            if(me.checkCube(mesh)){
//                me.scene.remove(mesh)
//            }
//        });

    },
    initCamera: function () {
        var me = this,
            SCREEN_WIDTH = me.element.getWidth(),
            SCREEN_HEIGHT = me.element.getHeight();

        var VIEW_ANGLE = 90, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 100000;

        me.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        me.scene.add(me.camera);
        me.camera.position.set(0, -10000, 0);
        me.camera.lookAt(me.scene.position);

        me.camera.rotation.x = 90 * Math.PI / 180
        me.camera.rotation.z = 0 * Math.PI / 180


        /////////
        // SKY //
        /////////

        // recommend either a skybox or fog effect (can't use both at the same time)
        // without one of these, the scene's background color is determined by webpage background

        // make sure the camera's "far" value is large enough so that it will render the skyBox!

        // fog must be added to scene before first render


        //renderer.render(me.scene, me.camera)


        //me.controls.update()


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
        me.controls = new THREE.EditorControls(me.camera, me.renderer.domElement);
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
        //me.controls.update();
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
            sphereGeometry = new THREE.SphereGeometry(15, 20);
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x8888ff});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(x, y, z);
        me.scene.add(sphere);
        record.sprite = sphere


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
    addLine: function (from, to) {
        var me = this;
        var lineGeometry = new THREE.Geometry();
        var vertArray = lineGeometry.vertices;
        vertArray.push(new THREE.Vector3(from.x, from.y, from.z), new THREE.Vector3(to.x, to.y, to.z));
        lineGeometry.computeLineDistances();
        var lineMaterial = new THREE.LineBasicMaterial({color: 0x3366FF});
        var line = new THREE.Line(lineGeometry, lineMaterial);
        me.scene.add(line);

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
        //axes = new THREE.AxisHelper(4000);

//        var geometry = new THREE.SphereGeometry(30, 32, 16);
//        var material = new THREE.MeshLambertMaterial({ color: 0x000088 });
//        var mesh = new THREE.Mesh(geometry, material);
//        mesh.position.set(40, 40, 40);
//        me.scene.add(mesh);


//        axes.position.set(40,40, 40);
//        me.scene.add(axes);

        var gridXZ = new THREE.GridHelper(10000, 1000);
        gridXZ.setColors(new THREE.Color(0x006600), new THREE.Color(0x006600));
        gridXZ.position.set(0, 0, 0);
        me.scene.add(gridXZ);

//        var gridXY = new THREE.GridHelper(100, 10);
//        gridXY.position.set(100, 100, 0);
//        gridXY.rotation.x = Math.PI / 2;
//        gridXY.setColors(new THREE.Color(0x000066), new THREE.Color(0x000066));
//        me.scene.add(gridXY);
//
//        var gridYZ = new THREE.GridHelper(100, 10);
//        gridYZ.position.set(0, 100, 100);
//        gridYZ.rotation.z = Math.PI / 2;
//        gridYZ.setColors(new THREE.Color(0x660000), new THREE.Color(0x660000));
//        me.scene.add(gridYZ);

        // direction (normalized), origin, length, color(hex)
//        var origin = new THREE.Vector3(50, 100, 50);
//        var terminus = new THREE.Vector3(75, 75, 75);
//        var direction = new THREE.Vector3().subVectors(terminus, origin).normalize();
//        var arrow = new THREE.ArrowHelper(direction, origin, 50, 0x884400);
//        me.scene.add(arrow);
    },
    makeTextSprite: function (message, parameters) {

        var me = this;
        if (parameters === undefined) parameters = {};

        var fontface = parameters.hasOwnProperty("fontface") ?
            parameters["fontface"] : "Arial";

        var fontsize = parameters.hasOwnProperty("fontsize") ?
            parameters["fontsize"] : 18;

        var borderThickness = parameters.hasOwnProperty("borderThickness") ?
            parameters["borderThickness"] : 4;

        var borderColor = parameters.hasOwnProperty("borderColor") ?
            parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 1.0 };

        var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
            parameters["backgroundColor"] : { r: 255, g: 255, b: 255, a: 1.0 };

        var spriteAlignment = THREE.SpriteAlignment.topLeft;

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;

        // get size data (height depends only on font size)
        var metrics = context.measureText(message);
        var textWidth = metrics.width;

        // background color
        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
            + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
            + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;
        me.roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
        // 1.4 is extra height factor for text below baseline: g,j,p,q.

        // text color
        context.fillStyle = "rgba(0, 0, 0, 1.0)";

        context.fillText(message, borderThickness, fontsize + borderThickness);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial(
            { map: texture, useScreenCoordinates: false, alignment: spriteAlignment });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(100, 50, 1.0);
        return sprite;
    },
    roundRect: function (ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    },
    addTxt: function (x, z, text) {
        var me = this;
        var canvas1 = document.createElement('canvas');
        var context1 = canvas1.getContext('2d');
        context1.font = "Bold 40px Arial";
        context1.fillStyle = "rgba(255,0,0,0.95)";
        context1.fillText(text, 0, 60);

        // canvas contents will be used for a texture
        var texture1 = new THREE.Texture(canvas1)
        texture1.needsUpdate = true;

        var material1 = new THREE.MeshBasicMaterial({map: texture1, side: THREE.DoubleSide });
        material1.transparent = true;


        var mesh1 = new THREE.Mesh(
            new THREE.PlaneGeometry(400, canvas1.height),
            material1
        );


        mesh1.position.set(x, 0, z);
        mesh1.rotation.x = 90 * Math.PI / 180
        me.scene.add(mesh1);

        mesh1.updateMatrixWorld()

        me.getColissionArray().push(mesh1)

        if(me.checkCube(mesh1)){
            mesh1.translateX(100);
            mesh1.translateY(100);
            mesh1.translateZ(250);

            mesh1.updateMatrixWorld()
            if(me.checkCube(mesh1)){
                mesh1.translateZ(500);
                mesh1.updateMatrixWorld()
                if(me.checkCube(mesh1)){
                    console.log('still')
                }

                //me.scene.remove(mesh1)

            }

        }

    },
    addCube: function (x, y, z) {
        var me = this,
            cubeGeometry = new THREE.CubeGeometry(400, 100, 10);
        var cubeMaterial = new THREE.MeshBasicMaterial({color: 0x8888ff});
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(x, y, z);
        cube.rotation.x = 90 * Math.PI / 180
        me.scene.add(cube);
        me.getColissionArray().push(cube)


    },
    checkCube: function (cube) {
        var ray,
            hit = false,
            me = this;

        var collisions, i,
        // Maximum distance from the origin before we consider collision
            distance = 200;

        me.caster = new THREE.Raycaster();
        //me.scene.add(cube);
        me.rays = [
            new THREE.Vector3(1, 0, -1),
            new THREE.Vector3(1, 0, 1),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(1, 0, -1),
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(-1, 0, -1),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(-1, 0, 1)

        ];
        //console.log(me.rays[0])
        for (i = 0; i < this.rays.length; i += 1) {
            me.caster.set(cube.position.clone()
                , this.rays[i]);


            //me.scene.add(new THREE.ArrowHelper(this.rays[i].normalize()), cube.position, 200, 0xffffff )
            collisions = this.caster.intersectObjects(me.getColissionArray());
            if (collisions.length > 0 && collisions[0].distance <= distance) {
                //console.log(i, collisions[0].distance)
                hit = true
            }
        }

//        var originPoint = cube.position.clone();
//
//
//        var hit = false;
//        for (var vertexIndex = 0; vertexIndex < cube.geometry.vertices.length; vertexIndex++) {
//            var localVertex = cube.geometry.vertices[vertexIndex].clone();
//            var globalVertex = localVertex.applyMatrix4(cube.matrix);
//            var directionVector = globalVertex.sub(cube.position);
//            var ray = new THREE.Raycaster(originPoint, directionVector.clone());
//            var collisionResults = ray.intersectObjects(me.getColissionArray());
//
//
//            if (collisionResults.length > 0 && collisionResults[0].distance < 2000) {
//
//                hit = true
//
//            }
//
//        }

        return hit === true ? hit : false

    }
});