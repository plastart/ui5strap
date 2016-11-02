sap.ui.controller("net__rozzo__webgl.visent__app.controllers.Home", {
	
	onInit : function () {
		if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

            var stats;
            var scene;
            var camera;
            var renderer;
            var model;
            var animations;
            var kfAnimations = [ ];
            var kfAnimationsLength = 0;
            var loader = new THREE.ColladaLoader();
            var lastTimestamp;
            var progress = 0;


            loader.load( './examples/visent/models/collada/pump/pump.dae', function ( collada ) {

                model = collada.scene;
                animations = collada.animations;
                kfAnimationsLength = animations.length;
                model.scale.x = model.scale.y = model.scale.z = 0.125; // 1/8 scale, modeled in cm

                init();
                start();
                animate( lastTimestamp );

            } ); 

            function init() {

                var container = document.createElement( 'div' );
                document.getElementById('webgl').appendChild( container );

                // Camera

                camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.01, 1000 );
                camera.position.set( -5.00181875, 3.42631375, 11.3102925 );
                camera.lookAt( new THREE.Vector3( -1.224774125, 2.18410625, 4.57969125 ) );

                // Scene

                scene = new THREE.Scene();

                // KeyFrame Animations

                var animHandler = THREE.AnimationHandler;

                for ( var i = 0; i < kfAnimationsLength; ++i ) {

                    var animation = animations[ i ];
                    animHandler.add( animation );

                    var kfAnimation = new THREE.KeyFrameAnimation( animation.node, animation.name );
                    kfAnimation.timeScale = 1;
                    kfAnimations.push( kfAnimation );

                }

                // Grid

                var material = new THREE.LineBasicMaterial( { color: 0x303030 } );
                var geometry = new THREE.Geometry();
                var floor = -0.04, step = 1, size = 14;

                for ( var i = 0; i <= size / step * 2; i ++ ) {

                    geometry.vertices.push( new THREE.Vector3( - size, floor, i * step - size ) );
                    geometry.vertices.push( new THREE.Vector3(   size, floor, i * step - size ) );
                    geometry.vertices.push( new THREE.Vector3( i * step - size, floor, -size ) );
                    geometry.vertices.push( new THREE.Vector3( i * step - size, floor,  size ) );

                }

                var line = new THREE.Line( geometry, material, THREE.LinePieces );
                scene.add( line );

                // Add the COLLADA

                model.getChildByName( 'camEye_camera', true ).visible = false;
                model.getChildByName( 'camTarget_camera', true ).visible = false;

                scene.add( model );

                // Lights

                pointLight = new THREE.PointLight( 0xffffff, 1.75 );
                pointLight.position = camera.position;
                pointLight.rotation = camera.rotation;
                pointLight.scale = camera.scale;

                scene.add( pointLight );

                // Renderer

                renderer = new THREE.WebGLRenderer( { antialias: true } );
                renderer.setSize( window.innerWidth, window.innerHeight );

                container.appendChild( renderer.domElement );

                // Stats

                stats = new Stats();
                stats.domElement.style.position = 'absolute';
                stats.domElement.style.top = '0px';

              //  container.appendChild( stats.domElement );

                //

                window.addEventListener( 'resize', onWindowResize, false );

            }

            function onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight );

            }

            function start() {

                for ( var i = 0; i < kfAnimationsLength; ++i ) {

                    var animation = kfAnimations[i];

                    for ( var h = 0, hl = animation.hierarchy.length; h < hl; h++ ) {

                        var keys = animation.data.hierarchy[ h ].keys;
                        var sids = animation.data.hierarchy[ h ].sids;
                        var obj = animation.hierarchy[ h ];

                        if ( keys.length && sids ) {

                            for ( var s = 0; s < sids.length; s++ ) {

                                var sid = sids[ s ];
                                var next = animation.getNextKeyWith( sid, h, 0 );

                                if ( next ) next.apply( sid );

                            }

                            obj.matrixAutoUpdate = false;
                            animation.data.hierarchy[ h ].node.updateMatrix();
                            obj.matrixWorldNeedsUpdate = true;

                        }

                    }

                    animation.play( false, 0 );
                    lastTimestamp = Date.now();

                }

            }

            function animate() {

                var timestamp = Date.now();
                var frameTime = ( timestamp - lastTimestamp ) * 0.001; // seconds

                if ( progress >= 0 && progress < 48 ) {

                    for ( var i = 0; i < kfAnimationsLength; ++i ) {

                        kfAnimations[ i ].update( frameTime );

                    }

                } else if ( progress >= 48 ) {

                    for ( var i = 0; i < kfAnimationsLength; ++i ) {

                        kfAnimations[ i ].stop();

                    }

                    progress = 0;
                    start();

                }

                progress += frameTime;
                lastTimestamp = timestamp;
                renderer.render( scene, camera );
                stats.update();
                requestAnimationFrame( animate );

            }
	}

});
