Ext.define('EM.view.Scene', {
    extend: 'Ext.Component',
    fullscreen: true,
    config: {
        listeners: {
            painted: 'initScene',
            resize: 'onResize'
        }
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


        me.scene = new THREE.Scene();

        me.initCamera();
        me.initRenderer();
        me.initControls();
        me.initLights();
        me.addSphere();

        //me.addPlanet(-1050, 0, -5050, 'Sol' );

        Ext.StoreManager.first().each(function (record) {

            me.addPlanet(record.get('SX'), record.get('SY'), record.get('SZ'), record.get('ObjName'));


        }, me);

        me.addHelpers();
        //me.initFog();

        var axes = new THREE.AxisHelper(100);
        me.scene.add(axes);

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

        var VIEW_ANGLE = 90, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 50000;

        me.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        me.scene.add(me.camera);
        me.camera.position.set(0, -10000, 0);
        me.camera.lookAt(me.scene.position);


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
        //me.renderer = new THREE.CanvasRenderer();

        me.renderer = new THREE.WebGLRenderer({antialias: true});
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
    addPlanet: function (x, y, z, text) {

        var me = this,
            sphereGeometry = new THREE.SphereGeometry(15),
            textGeometry = THREE.TextGeometry(text, {
                font:'helvetiker'

            });
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x8888ff});
        var textMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: true } )
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        var txt = new THREE.Mesh(textGeometry, textMaterial);
        sphere.position.set(x, y, z);
        txt.position.set(x,y,z);
        me.scene.add(sphere);
        me.scene.add(txt);



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
        var me = this,
            axes = new THREE.AxisHelper(50);

        var geometry = new THREE.SphereGeometry(30, 32, 16);
        var material = new THREE.MeshLambertMaterial({ color: 0x000088 });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(40, 40, 40);
        me.scene.add(mesh);


        axes.position = mesh.position;
        me.scene.add(axes);

        var gridXZ = new THREE.GridHelper(10000, 1000);
        gridXZ.setColors(new THREE.Color(0x006600), new THREE.Color(0x006600));
        gridXZ.position.set(100, 0, 100);
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
        var origin = new THREE.Vector3(50, 100, 50);
        var terminus = new THREE.Vector3(75, 75, 75);
        var direction = new THREE.Vector3().subVectors(terminus, origin).normalize();
        var arrow = new THREE.ArrowHelper(direction, origin, 50, 0x884400);
        me.scene.add(arrow);
    }
});