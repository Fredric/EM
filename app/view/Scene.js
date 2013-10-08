Ext.define('EM.view.Scene', {
    extend: 'Ext.Component',
    fullscreen: true,
    config: {
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
                particle.position.y = record.get('SY');
                particle.position.z = record.get('SZ');
                particle.scale.x = particle.scale.y = 30;
                me.scene.add(particle);
                geometry.vertices.push(particle.position);


            }

            if (record.get('ObjType') === "Gate") {

                destination = Ext.StoreManager.first().getById(record.get('destination'));

                particle = new THREE.Particle(gateMaterial);
                particle.position.x = record.get('SX');
                particle.position.y = record.get('SY');
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
                particle.position.y = record.get('SY');
                particle.position.z = record.get('SZ');
                particle.scale.x = particle.scale.y = 20;
                me.scene.add(particle);
                geometry.vertices.push(particle.position);
                //me.addWormhole(record.get('SX'), record.get('SY'), record.get('SZ'), record.get('ObjName'), record);

            }

            if (destination) {
                from = {
                    x: record.get('SX'),
                    y: record.get('SY'),
                    z: record.get('SZ')
                };
                to = {
                    x: destination.get('SX'),
                    y: destination.get('SY'),
                    z: destination.get('SZ')
                }
                me.addLine(from, to);
            }


        }, me);

        // me.addHelpers();
        //me.initFog();

//        var axes = new THREE.AxisHelper(1000);
//        me.scene.add(axes);

        (function animloop() {
            requestAnimationFrame(animloop);
            me.renderMe();
            me.updateMe()
        })();
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

//        var spritey = me.makeTextSprite(" " +text+ " ",
//            { fontsize: 30, borderColor: {r: 255, g: 0, b: 0, a: 1.0}, backgroundColor: {r: 255, g: 100, b: 100, a: 0.8} });
//        spritey.position.set(x, y, z);
//        me.scene.add(spritey);

    },
    addLine: function (from, to) {
        var me = this;
        var lineGeometry = new THREE.Geometry();
        var vertArray = lineGeometry.vertices;
        vertArray.push(new THREE.Vector3(from.x, from.y, from.z), new THREE.Vector3(to.x, to.y, to.z));
        lineGeometry.computeLineDistances();
        var lineMaterial = new THREE.LineBasicMaterial({color:0x3366FF});
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
        return;
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
    }
});