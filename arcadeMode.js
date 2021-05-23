THREE.TextureLoader.crossOrigin = "";

var DRAGU = {
  stats: null,
  scene: null,
  renderer: null,
  camera: null,
  control: null,
  textureLoader: new THREE.TextureLoader(),
  aloader: new THREE.GLTFLoader(),
  clock: new THREE.Clock(),
  transform: new Ammo.btTransform(),
  mixer: null,
  composers: null,
  velocity: 400,
  brake: 0,
  alpha: 0,
  rotationFrom: new THREE.Vector3(0, 0, 0),
  draguPlayer: new THREE.Mesh(),
  playerLevel: 0,
  player_rotateY: 0,
  wanderTreshold: 0,
  breathFire: false,
  cannons: [],
  generalMat: new THREE.MeshLambertMaterial({
    color: new THREE.Color("white").multiplyScalar(2.0), //'#D57C41',#99E0EE
    flatShading: true
  }),
  initialize: function() {
    // renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container = document.getElementById("renderSpace");
    document.body.appendChild(this.container);
    this.container.appendChild(this.renderer.domElement);

    function openFullscreen() {
      var elem = document.getElementById("renderSpace");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
      }
      elem.style.width = '100%';
      elem.style.height = '100%';
    }
    this.container.onclick = openFullscreen;
    
    //stats
    this.stats = new Stats();
    this.stats.domElement.style.position = "absolute";
    this.stats.domElement.style.top = "100px";
    this.stats.domElement.style.zIndex = 100;
    this.container.appendChild(this.stats.domElement);

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#6122A1");
    this.scene.fog = new THREE.Fog(
      new THREE.Color("#6122A1"),
      0.0000000025,
      2000
    ); //1500

    // camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.position.set(
      1.429157584539651e-13,
      828.6455390860693,
      384.97815717003306
    );
    this.camera.lookAt(this.scene.position);
    this.camera.rotation.order = "YXZ";
    //tpsCamera
    this.tpsCamera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    // light
    this.ambient = new THREE.AmbientLight("#6122A1");
    this.scene.add(this.ambient);

    this.basiclight = new THREE.PointLight(0xffffff);
    this.basiclight.position.set(100, 250, 250);
    this.scene.add(this.basiclight);

    var scene = this.scene;
    var renderer = this.renderer;
    var camera = this.camera;
    
    
    
    //load cliff
    var island = new this.createTriCliffs();
    island.scale.set(20, 50, 20);
    island.position.y = 50;
    island.rotation.x = -Math.PI;
    scene.add(island);

    //this.enemy.position.y = 900
    var island2 = new this.createTriCliffs();
    island2.scale.set(180, 210, 180);
    //island2.position.y = 50
    island2.position.z = -600;
    island2.rotation.x = -Math.PI;
    scene.add(island2);
    
    var island3 = new this.createTriCliffs();
    island3.scale.set(180 * 1.2, 210 * 1.2, 180 * 1.2);
    island3.position.y = 100;
    island3.position.z = -1100;
    island3.rotation.x = -Math.PI;
    scene.add(island3);

    var island4 = new this.createTriCliffs();
    island4.scale.set(180 * .8, 180 * 5.2, 180 * .8);
    island4.position.y = 1500;
    island4.position.z = 1100;
    island4.rotation.x = -Math.PI;
    scene.add(island4);

    
    this.enemies = [];
    var bn = 50;
    this.enemyEntities = [];
    for (var i = 0; i < 3; i++) {
      this.enemy = new THREE.Mesh(
        new THREE.CylinderGeometry(5, 5, 20, 32),
        new THREE.MeshBasicMaterial({ color: "red" })
      );
      scene.add(this.enemy);
      this.enemy.geometry.applyMatrix(
        new THREE.Matrix4().makeTranslation(0, 10, 0)
      );
      this.enemy.scale.set(1.2, 1.2, 8);
      this.enemy.geometry.applyMatrix(
        new THREE.Matrix4().makeRotationX(Math.PI / 2)
      );

      this.enemyBody = new THREE.Mesh(
        new THREE.BoxGeometry(50, 10, 80),
        new THREE.MeshBasicMaterial({ color: "orange" })
      );

      this.entity = new SteeringEntity(this.enemyBody);
      this.entity.position.copy(island2.position);
      this.entity.wander_min = {
        x: -100,
        z: -600
      }
      this.entity.wander_max = {
        x: 100,
        z: -300
      }
      
      this.entity.position.y += 120;
      this.enemyEntities.push(this.entity);
      scene.add(this.entity);

      if (i == 1) this.entity.position.x += 100;
      if (i == 2){
        this.entity.position.copy(island.position);
        this.entity.position.y += 50
        this.entity.wander_min = {
        x: this.entity.position.x,
        z: this.entity.position.z
      }
      this.entity.wander_max = {
        x: this.entity.position.x,
        z: this.entity.position.z
      }
      }
      this.enemies.push(this.enemy);
    }

    var cliff2 = new this.createTriCliffs();
    cliff2.scale.set(20 * 3, 150 * 6, 20 * 3);
    cliff2.position.x = -850;
    cliff2.position.y = -200 * 3;
    cliff2.position.z = -500;
    cliff2.rotation.y = Math.PI / 2;
    scene.add(cliff2);
    

    //create ladder
    /*var ladder1 = this.createladder(island, cliff);
    scene.add(ladder1);

    var ladder2 = this.createladder(island, cliff2);
    scene.add(ladder2);

    /*var ladder3 = this.createladder(cliff, cliff2);
    scene.add(ladder3);
    ladder3.position.y = 400;*/
    
    var cliffs = []
    for(var i = 0; i<5; i++){
    var cliff3 = new this.createTriCliffs();
    cliff3.scale.set(20 * 3, 150 * 6, 20 * 3);
    cliff3.rotation.y = Math.PI / 2;
    scene.add(cliff3);
      if((i % 2)== 0){
    cliff3.position.x = 850;
    cliff3.position.y = -200 * 3;
    cliff3.position.z += 400*(i)
      }else{
    cliff3.position.x = -850;
    cliff3.position.y = -200 * 3;
    cliff3.position.z += 400*(i)
      }
    cliffs.push(cliff3)
    }
    
  
    
    //load cloudy ground
    var cloudy_ground = new this.createCloudyGround();
    scene.add(cloudy_ground);

    var cloudy_ground2 = cloudy_ground.clone();
    scene.add(cloudy_ground2);
    cloudy_ground2.position.copy(cliff2.position);
    cloudy_ground2.position.y -= 100;
    //load postprocess
    this.loadPostprocess();

    //load player
    scene.add(this.draguPlayer);
    this.draguPlayer_psd = this.draguPlayer.clone();
    scene.add(this.draguPlayer_psd);

    this.player_mouth = new THREE.Mesh();
    scene.add(this.player_mouth);
    this.player_mouth.parent = this.draguPlayer_psd;
    this.player_mouth.rotation.x = 2.6499999999999986;
    this.player_mouth.position.z = -50;
    this.player_mouth.position.y = 42;

    //dragon breath particle
    var f = getSmokeParticle();
    

    this.player_mouth.add(f.mesh);
    this.fireb = f
    
    this.loadPlayer(14);

    //load physics
    DRAGU.initPhysics();
    DRAGU.playerPhysics();
    this.addArbitaryGeometry(cliff2, "convex");
    this.addArbitaryGeometry(island, "convex");
    this.addArbitaryGeometry(island2, "convex");
    this.addArbitaryGeometry(island3, "convex");
    this.addArbitaryGeometry(island4, "convex");
    
    for(var i = 0; i<cliffs.length; i++){
      this.addArbitaryGeometry(cliffs[i], "convex");
    }
    this.playerLocomotive();
    
    
    //create compass
    this.createCompass()
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  },
  initPhysics: function() {
    var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    var broadphase = new Ammo.btDbvtBroadphase();
    var solver = new Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(
      dispatcher,
      broadphase,
      solver,
      collisionConfiguration
    );
    this.physicsWorld.setGravity(new Ammo.btVector3(0, 0, 0));
    this.physicsWorld.rB = [];
  },
  rigidBodytoMesh: function() {
    for (var i = 0; i < this.physicsWorld.rB.length; i++) {
      var rigidB = this.physicsWorld.rB[i][0];
      var mesh = this.physicsWorld.rB[i][1];
      var transform = this.transform;
      rigidB.getMotionState().getWorldTransform(transform);
      origin = transform.getOrigin();

      mesh.position.x = origin.x();
      mesh.position.y = origin.y();
      mesh.position.z = origin.z();
      
      //mesh.translateZ(-this.brake)

      if (mesh.name === "player" && rigidB.name === "player") {
        //mesh.rotation.y = this.camera.rotation.y
        //mesh.rotation.x = this.camera.rotation.x
        mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), this.player_rotateY * 2);

        this.movePlayer(rigidB, mesh, 1);
        //DRAGU.pursuePlayer(new THREE.Vector3(origin.x(), origin.y(), origin.z()))
      }
    }
  },
  createCompass: function(){
    var texture = this.textureLoader.load( 'https://cdn.glitch.com/3da1885b-3463-4252-8ded-723332b5de34%2FCompass_Points.png?v=1579739073833' );
    texture.anisotropy = this.renderer.getMaxAnisotropy()
    texture.minFilter = THREE.LinearFilter;
    
				var geometry = new THREE.CylinderGeometry( 40, 40, 2, 32 );
                geometry.scale(8, 8, 8)
				var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );

				this.compass = new THREE.Mesh( geometry, material );
				this.scene.add( this.compass );

        this.compass.parent = this.tpsCamera
        this.compass.position.z += -800
        this.compass.position.y += (350)
        this.compass.rotation.x = 0.4750000000000003
        
    
        /*this.marker = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 10, 2))
    
        this.scene.add(this.marker)
              
        this.marker.parent = this.tpsCamera
        this.marker.position.z += -500/5
        this.marker.position.y += 200/5*/
      

  },
  playerPhysics: function() {
    var scene = this.scene;
    var physicsWorld = this.physicsWorld;
    const objectShape = new Ammo.btBoxShape(new Ammo.btVector3(70, 60, 70)); // Create block 50x2x50
    const objectTransform = new Ammo.btTransform();
    objectTransform.setIdentity();
    objectTransform.setOrigin(new Ammo.btVector3(30, 500, 400)); // Set initial position
    const objectMass = 1000.005; // Mass of 0 means ground won't move from gravity or collisions
    const localInertia = new Ammo.btVector3(0, 0, 0);
    const motionState = new Ammo.btDefaultMotionState(objectTransform);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      objectMass,
      motionState,
      objectShape,
      localInertia
    );
    const objectAmmo = new Ammo.btRigidBody(rbInfo);
    objectAmmo.mesh = this.draguPlayer;
    physicsWorld.addRigidBody(objectAmmo);
    objectAmmo.name = objectAmmo.mesh.name = "player";
    objectAmmo.mesh.children[0].rotation.x = -0.7399999999999991;
    objectAmmo.setDamping(0.05, 0.85);

    this.physicsWorld.rB.push([objectAmmo, objectAmmo.mesh]);
  },
  movePlayer: function(meshPhysics, mesh, maxSpeed) {
    var velocity = this.velocity;
    var angle = mesh.rotation.y;
    var brake = this.brake;

    meshPhysics.setLinearVelocity(
      new Ammo.btVector3(
        (-velocity*brake) * Math.sin(angle),
        this.playerLevel,
        (-velocity*brake) * Math.cos(angle)
      )
    );
    meshPhysics.setAngularVelocity(new Ammo.btVector3(0, 0, 0));
    meshPhysics.activate();
  },
  createCannons: function(enemy) {
    var bulletId = this.cannons.length + 1;

    this.cannons[bulletId] = new THREE.Mesh(new THREE.SphereGeometry(10, 2, 2));
    this.cannons[bulletId].material.color = new THREE.Color("yellow").multiplyScalar(100);
    this.cannons[bulletId].position.copy(enemy.position);
    this.cannons[bulletId].lookAt(this.draguPlayer.position);
    this.cannons[bulletId].speed = 0.05;
    this.cannons[bulletId].lifetimer = 0;

    this.scene.add(this.cannons[bulletId]);
  },
  shootCannons: function() {
    for (var i = 0, max = this.cannons.length; i < max; i += 1) {
      if (!this.cannons[i] || this.cannons[i] == undefined) continue; //Empty, Skip.

      //this.cannons[i].position.lerp(this.draguPlayer.position, .05)
      this.cannons[i].translateOnAxis(new THREE.Vector3(0, 0, 1), 50);
      this.cannons[i].lifetimer += 1;

      if (this.cannons[i].lifetimer > 50)
        this.scene.remove(this.cannons[i]), (this.cannons[i] = null);
    }
  },
  addArbitaryGeometry: function(mesh, type) {
    var scene = this.scene;
    var physicsWorld = this.physicsWorld;
    var geometry = mesh.geometry;
    if (geometry.type === "BufferGeometry")
      var g = new THREE.Geometry().fromBufferGeometry(geometry);
    else var g = geometry;

    var arbitaryMesh = new AmmoMesh(g, mesh, type);
    physicsWorld.addRigidBody(arbitaryMesh.rigidBody);
  },
  createBoundaries: function(){
    var lfboundary = new THREE.Mesh(new THREE.BoxBufferGeometry(20, 1400, 5550))
    lfboundary.position.y = 100
    lfboundary.position.x = 900
    this.scene.add(lfboundary)
    
    this.physicsWorld.addRigidBody(this.boundaryImpostor( 20, 1400, 5550, lfboundary));
    
    var rboundary = new THREE.Mesh(new THREE.BoxBufferGeometry(20, 1400, 5550))
    rboundary.position.y = 100
    rboundary.position.x = -900
    this.scene.add(rboundary)
    
    this.physicsWorld.addRigidBody(this.boundaryImpostor( 20, 1400, 5550, rboundary));
    
    var bkboundary = new THREE.Mesh(new THREE.BoxBufferGeometry(1500, 1400, 20))
    bkboundary.position.y = 100
    bkboundary.position.z = -1700
    this.scene.add(bkboundary)
    
    this.physicsWorld.addRigidBody(this.boundaryImpostor( 1500, 1000, 20, bkboundary));
    
    var mat = new THREE.MeshLambertMaterial({
        color: new THREE.Color("white").multiplyScalar(3),
        map: DRAGU.textureLoader.load(
          "https://cdn.glitch.com/832401c3-8cbf-42db-acce-98209736affc%2Fanimated-smoke-png-png-image-animated-smoke-png-240_240.png?v=1578848811658"
        ),
        transparent: true,
        opacity: 5,
        side: THREE.DoubleSide
      })
   // lfboundary.material = rboundary.material = bkboundary.material = mat
    lfboundary.visible = rboundary.visible = bkboundary.visible = false
  },
  boundaryImpostor: function( xdim, ydim, zdim, mesh) {

    var shape = new Ammo.btBoxShape( new Ammo.btVector3( xdim / 2, ydim / 2, zdim / 2 ) );
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( mesh.position.x, mesh.position.y, mesh.position.z ) );
    shape.setLocalScaling(new Ammo.btVector3(mesh.scale.x, mesh.scale.y, mesh.scale.z));
    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    var motionState = new Ammo.btDefaultMotionState( transform );
    var cInfo = new Ammo.btRigidBodyConstructionInfo( 0, motionState, shape, localInertia);
    var body = new Ammo.btRigidBody(cInfo);

    return body;

  },
  createUniformDelta: function(max, min) {
    var dmax = max || 0.02;
    var dmin = min || 0.005;
    return Math.random() * (dmax - dmin) + dmin;
  },
  loadPostprocess: function() {
    this.composer = new THREE.EffectComposer(this.renderer);
    var renderPass = new THREE.RenderPass(this.scene, this.tpsCamera);
    this.composer.addPass(renderPass);

    //custom shader pass
    var vertShader = document.getElementById("vertexShader").textContent;
    var fragShader = document.getElementById("fragmentShader").textContent;
    var counter = 0.0;
    var myEffect = {
      uniforms: {
        tDiffuse: { value: null },
        amount: { value: counter }
      },
      vertexShader: vertShader,
      fragmentShader: fragShader
    };

    var customPass = new THREE.ShaderPass(myEffect);
    customPass.renderToScreen = true;
    this.composer.addPass(customPass);
  },
  createTriCliffs: function() {
    const map = (val, smin, smax, emin, emax) =>
      ((emax - emin) * (val - smin)) / (smax - smin) + emin;
    const jitter = (geo, per) =>
      geo.vertices.forEach(v => {
        v.x += map(Math.random(), 0, 1, -per, per);
        v.y += map(Math.random(), 0, 1, -per, per);
        v.z += map(Math.random(), 0, 1, -per, per);
      });
    const chopBottom = (geo, bottom) =>
      geo.vertices.forEach(v => (v.y = Math.max(v.y, bottom)));

    const geo = new THREE.Geometry();

    const tuft1 = new THREE.SphereGeometry(1.5, 7, 8);
    tuft1.translate(-2, 0, 0);
    geo.merge(tuft1);

    const tuft2 = new THREE.SphereGeometry(1.5, 7, 8);
    tuft2.translate(2, 0, 0);
    geo.merge(tuft2);

    const tuft3 = new THREE.SphereGeometry(2.0, 7, 8);
    geo.merge(tuft3);

    jitter(geo, 0.2);
    chopBottom(geo, -0.5);
    geo.computeFlatVertexNormals();

    return new THREE.Mesh(
      new THREE.BufferGeometry().fromGeometry(geo),
      DRAGU.generalMat
    );
  },
  createCloudyGround: function() {
    var ground = new THREE.Mesh(
      new THREE.CircleGeometry(500, 32),
      new THREE.MeshLambertMaterial({
        color: new THREE.Color("white").multiplyScalar(3),
        map: DRAGU.textureLoader.load(
          "https://cdn.glitch.com/832401c3-8cbf-42db-acce-98209736affc%2Fanimated-smoke-png-png-image-animated-smoke-png-240_240.png?v=1578848811658"
        ),
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      })
    );
    ground.rotation.x = -Math.PI / 2;
    return ground;
  },

  loadPlayer: function(scale) {
    var scene = this.scene;
    this.tpsCamera.parent = this.draguPlayer;
    var cameraOffset = this.draguPlayer.position.clone();
    this.tpsCamera.position.x = cameraOffset.x;
    this.tpsCamera.position.y = cameraOffset.y + 340;
    this.tpsCamera.position.z = cameraOffset.z + 405;

    this.draguPlayer.add(this.tpsCamera);
    this.draguPlayer.rotation.order = "YXZ";
    this.draguPlayer_psd.rotation.order = "YXZ";
    var url =
      "https://cdn.glitch.com/832401c3-8cbf-42db-acce-98209736affc%2Fdragonx.gltf?v=1578877313903";
    this.aloader.load(url, function(data) {
      gltf = data;
      var object;
      if (gltf.scene !== undefined) {
        object = gltf.scene; // default scene
      } else if (gltf.scenes.length > 0) {
        object = gltf.scenes[0]; // other scene
      }
      object.scale.set(scale, scale, scale);
      var remap = DRAGU.textureLoader.load(
        "https://cdn.glitch.com/ca440387-5ef4-4401-a707-6a988d4e8bc5%2Flambert8_diffuse.png?v=1578877668820"
      );
      remap.flipY = false;
     
  
      data.scene.traverse(child => {
        if (child instanceof THREE.Mesh) {
          if ((child.material.type = "MeshStandardMaterial")) {
            child.material.dispose();
            scene.remove(child.material);

            child.material = new THREE.MeshBasicMaterial({
              color: new THREE.Color("white").multiplyScalar(4), //child.material.color.multiplyScalar(1),
              side: THREE.DoubleSide,
              map: remap,
              morphTargets: true
            })
          }
        }
      });

      var animations = gltf.animations;
      if (animations && animations.length) {
        DRAGU.mixer = new THREE.AnimationMixer(object);
        for (var i = 0; i < animations.length; i++) {
          var chunkedAnimation = AnimationUtils.subclip(
            animations[i],
            "flydragula",
            10,
            50,
            24
          );
          DRAGU.mixer
            .clipAction(chunkedAnimation)
            .play()
            .setDuration(2);
        }
      }

      scene.add(object);
      object.rotation.y = Math.PI / 2;
      object.parent = DRAGU.draguPlayer_psd;
    });
  },
  createladder: function(meshA, meshB) {
    var p = new THREE.CatmullRomCurve3([
      meshA.position.clone(),
      meshB.position.clone()
    ]);
    var laddergeo = new THREE.TubeGeometry(p, 20, 4.2, 3, false);
    var ladder = new THREE.Mesh(laddergeo, this.generalMat);
    var map = (val, smin, smax, emin, emax) =>
      ((emax - emin) * (val - smin)) / (smax - smin) + emin;
    var amt = 5;
    ladder.geometry.vertices.forEach(v => {
      v.x += map(Math.random(), 0, 1, -amt, amt);
      v.y += map(Math.random(), 0, 1, -amt, amt);
      v.z += map(Math.random(), 0, 1, -amt, amt);
    });
    ladder.geometry.vertices.forEach(v => (v.y = Math.max(v.y, -0.4)));
    return ladder;
  },
  onWindowResize: function(event) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  },
  playerLocomotive: function() {
    function handlePlayerInput(e) {
      if (e.repeat) return;
      if (e.which == 87) this.brake = 1;
      if (e.which == 68) this.player_rotateY = -0.01;
      if (e.which == 65) this.player_rotateY = 0.01;
      if (e.which == 87) this.brake = 1;
      if (e.which == 32) this.playerLevel = -300;
      if (e.which == 70) this.breathFire = true;
    }

    function cancelPlayerInput(e) {
      if (e.repeat) return;
      if (e.which == 87) this.brake = 0;
      
      if (e.which == 68) this.player_rotateY = 0;
      if (e.which == 65) this.player_rotateY = 0;
      
      if (e.which == 32) this.playerLevel = 0;
      if (e.which == 70) this.breathFire = false;
    }
    document.addEventListener("keydown", handlePlayerInput.bind(this), false);
    document.addEventListener("keyup", cancelPlayerInput.bind(this), false);
  },
  randint: function(min, max) {
    return Math.round(Math.random() * Math.abs(max - min) + min);
  },
  animate: function() {
    this.stats.update();
    this.compass.rotation.y = -this.draguPlayer.rotation.y
    if (this.mixer) this.mixer.update(this.createUniformDelta(0.03, 0.01));
    this.composer.render(this.scene, this.tpsCamera);
    var dt = this.clock.getDelta();
    this.physicsWorld.stepSimulation(dt, 1);
    this.rigidBodytoMesh();

    this.draguPlayer_psd.position.copy(this.draguPlayer.position);

    if (this.player_rotateY == -0.01)
      this.rotationFrom.lerp(new THREE.Vector3(0, 0, -Math.PI / 4), 0.05);
    if (this.player_rotateY == 0.01)
      this.rotationFrom.lerp(new THREE.Vector3(0, 0, Math.PI / 4), 0.05);
    if (this.playerLevel == -300)
      this.rotationFrom.lerp(new THREE.Vector3(-Math.PI / 3, 0, 0), 0.05);
    if (this.player_rotateY == 0)
      this.rotationFrom.lerp(new THREE.Vector3(0, 0, 0), 0.05);

    this.draguPlayer_psd.rotation.setFromVector3(this.rotationFrom);
    this.draguPlayer_psd.rotation.y = this.draguPlayer.rotation.y;

    this.wanderTreshold += 1;
    for (var i = 0; i < this.enemies.length; i++) {
      this.enemyEntities[i].maxSpeed = 1.2;
      this.enemyEntities[i].avoidDistance = 0.2;
      this.enemyEntities[i].radius = 100;
      this.enemyEntities[i].avoid(this.enemyEntities);
      this.enemyEntities[i].lookWhereGoing(true);
      if (this.wanderTreshold % 50 == 0)
        this.enemyEntities[i].seek(
          new THREE.Vector3(
            this.randint(this.enemyEntities[i].wander_min.x, this.enemyEntities[i].wander_max.x),
            0,
            this.randint(this.enemyEntities[i].wander_min.z, this.enemyEntities[i].wander_max.z)
          )
        );

      this.enemies[i].position.copy(this.enemyEntities[i].position);
      this.enemies[i].lookAt(this.draguPlayer.position);
      if (Math.round(Math.random() * 50) == 0)
        this.createCannons(this.enemies[i]);
      this.enemyEntities[i].update();
    }
    this.shootCannons();

    //dragon breath
    var f = getSmokeParticle();
    if(this.breathFire){
    this.rotationFrom.lerp(new THREE.Vector3(-Math.PI / 3, 0, 0), 0.05);
    f.fire(-.001);
    f.mesh.material.color.setHex(0x555555);
    f.mesh.material.opacity = 2;
    //this.player_mouth.add(f.mesh);
    }
    
    
 /*   this.fireb.fire(-.001);
    this.fireb.mesh.material.color.setHex(0x555555);
    this.fireb.mesh.material.opacity = 2;
    this.player_mouth.add(this.fireb.mesh);
    */
    requestAnimationFrame(this.animate.bind(this));
    
  }
};

window.onload = function() {
  DRAGU.initialize();
  DRAGU.createBoundaries();
  DRAGU.animate();
};
