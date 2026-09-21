/**
 * Post-hydration content override for the Hero section.
 * Manages headline, description, CTAs, tabbed browser window mockup,
 * and the interactive 3D particle sphere from D-4.0.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.hero;
  if (!content || !window.DemazeOverride) return;

  var sphereLoading = false;

  function initHeroSphere(container) {
    if (!container || container.querySelector('canvas') || sphereLoading) return;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    sphereLoading = true;
    import('/assets/demaze/three.module.js').then(function (THREE) {
      sphereLoading = false;
      var activeContainer = document.getElementById('hero-sphere-container') || container;
      if (!activeContainer || activeContainer.querySelector('canvas')) return;
      var particlesCount = 1800;
      var speed = 0.45;
      var smoothing = 1.0;
      var scale = 0.50;
      var rotationDirection = 'clockwise';
      var dragSpeed = 0.5;
      var drag = true;
      var stopOnHover = false;
      var particleScale = 0.20;
      var cursorConfig = {
        enabled: true,
        radius: 55,
        strength: 1.0,
        clickForce: 4.0
      };

      function mapRange(val, inMin, inMax, outMin, outMax) {
        return inMax === inMin ? outMin : outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);
      }

      var autoSpeed = mapRange(speed, 0.1, 1, 0.01, 0.045) * (rotationDirection === 'anticlockwise' ? -1 : 1);
      var scaleFactor = 0.52;
      var particleSize = mapRange(Math.max(0.1, Math.min(1, particleScale)), 0.1, 1, 0.01, 0.1);
      var cursorRadius = 55;
      var cursorStrength = 6.0;

      var frictionCoeff = 0.94;
      var returnForceCoeff = 0.016;

      var positions = [];
      var originalPositions = [];
      var displacements = [];
      var impulseVelocities = [];

      var goldenAngle = Math.PI * (3 - Math.sqrt(5));
      var sphereRadius = 0.52;

      for (var i = 0; i < particlesCount; i++) {
        var yNorm = 1 - (i / (particlesCount - 1)) * 2;
        var radiusAtY = Math.sqrt(1 - yNorm * yNorm);
        var theta = goldenAngle * i;
        var x = Math.cos(theta) * radiusAtY * sphereRadius;
        var y = yNorm * sphereRadius;
        var z = Math.sin(theta) * radiusAtY * sphereRadius;

        positions.push(x, y, z);
        originalPositions.push(new THREE.Vector3(x, y, z));
        displacements.push(new THREE.Vector3(0, 0, 0));
        impulseVelocities.push(new THREE.Vector3(0, 0, 0));
      }

      var scene = new THREE.Scene();
      var group = new THREE.Group();
      scene.add(group);

      var sphereGeo = new THREE.SphereGeometry(0.0075, 8, 8);
      // Dynamic Cyan to Emerald Gradient
      var colorA = new THREE.Color(0.22, 0.74, 0.97); // #38bdf8 Electric Cyan
      var colorB = new THREE.Color(0.13, 0.77, 0.37); // #22c55e Emerald Green

      var sphereMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        blending: THREE.AdditiveBlending,
        transparent: false
      });

      var instancedMesh = new THREE.InstancedMesh(sphereGeo, sphereMat, particlesCount);
      var dummy = new THREE.Matrix4();
      var mixedColor = new THREE.Color();
      for (var j = 0; j < particlesCount; j++) {
        var idx = j * 3;
        dummy.setPosition(positions[idx], positions[idx + 1], positions[idx + 2]);
        instancedMesh.setMatrixAt(j, dummy);

        var t = j / (particlesCount - 1);
        mixedColor.copy(colorA).lerp(colorB, t);
        instancedMesh.setColorAt(j, mixedColor);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
      group.add(instancedMesh);

      // Internal Synaptic Brain Plexus
      var synapseCount = 36;
      var synapsePositions = [];
      for (var s = 0; s < synapseCount; s++) {
        var u = Math.random();
        var v = Math.random();
        var sTheta = u * 2.0 * Math.PI;
        var phi = Math.acos(2.0 * v - 1.0);
        var r = Math.cbrt(Math.random()) * (sphereRadius * 0.78);
        var sinPhi = Math.sin(phi);
        synapsePositions.push(new THREE.Vector3(
          r * sinPhi * Math.cos(sTheta),
          r * sinPhi * Math.sin(sTheta),
          r * Math.cos(phi)
        ));
      }

      var synapseLinePositions = [];
      for (var si = 0; si < synapseCount; si++) {
        for (var sj = si + 1; sj < synapseCount; sj++) {
          var d = synapsePositions[si].distanceTo(synapsePositions[sj]);
          if (d < sphereRadius * 0.48) {
            synapseLinePositions.push(
              synapsePositions[si].x, synapsePositions[si].y, synapsePositions[si].z,
              synapsePositions[sj].x, synapsePositions[sj].y, synapsePositions[sj].z
            );
          }
        }
      }

      var synapseGeo = new THREE.BufferGeometry();
      synapseGeo.setAttribute('position', new THREE.Float32BufferAttribute(synapseLinePositions, 3));
      var synapseMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      var synapseMesh = new THREE.LineSegments(synapseGeo, synapseMat);
      group.add(synapseMesh);

      // Core glow
      var coreGlowGeo = new THREE.SphereGeometry(sphereRadius * 0.22, 16, 16);
      var coreGlowMat = new THREE.MeshBasicMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      var coreGlow = new THREE.Mesh(coreGlowGeo, coreGlowMat);
      group.add(coreGlow);

      // Orbital rings
      var orbitGroup = new THREE.Group();
      scene.add(orbitGroup);

      var ringGeo1 = new THREE.TorusGeometry(sphereRadius * 1.08, 0.0022, 16, 80);
      var ringMat1 = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.85
      });
      var ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      ring1.rotation.x = Math.PI * 0.38;
      ring1.rotation.y = Math.PI * 0.12;
      orbitGroup.add(ring1);

      var ringGeo2 = new THREE.TorusGeometry(sphereRadius * 1.14, 0.0018, 16, 80);
      var ringMat2 = new THREE.MeshBasicMaterial({
        color: 0x22c55e,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.75
      });
      var ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      ring2.rotation.x = -Math.PI * 0.32;
      ring2.rotation.z = Math.PI * 0.36;
      orbitGroup.add(ring2);

      // Orbiting satellites
      var satelliteOrbs = [
        {
          mesh: new THREE.Mesh(new THREE.SphereGeometry(0.016, 18, 18), new THREE.MeshBasicMaterial({ color: 0x38bdf8 })),
          radius: sphereRadius * 1.08,
          inclination: Math.PI * 0.38,
          yaw: Math.PI * 0.12,
          speed: 0.0016,
          offset: 0
        },
        {
          mesh: new THREE.Mesh(new THREE.SphereGeometry(0.013, 18, 18), new THREE.MeshBasicMaterial({ color: 0x34d399 })),
          radius: sphereRadius * 1.08,
          inclination: Math.PI * 0.38,
          yaw: Math.PI * 0.12,
          speed: 0.0016,
          offset: Math.PI * 0.85
        },
        {
          mesh: new THREE.Mesh(new THREE.SphereGeometry(0.014, 18, 18), new THREE.MeshBasicMaterial({ color: 0x22c55e })),
          radius: sphereRadius * 1.14,
          inclination: -Math.PI * 0.32,
          yaw: Math.PI * 0.36,
          speed: -0.0012,
          offset: 1.5
        },
        {
          mesh: new THREE.Mesh(new THREE.SphereGeometry(0.011, 18, 18), new THREE.MeshBasicMaterial({ color: 0xffffff })),
          radius: sphereRadius * 1.14,
          inclination: -Math.PI * 0.32,
          yaw: Math.PI * 0.36,
          speed: -0.0012,
          offset: 4.2
        }
      ];
      satelliteOrbs.forEach(function (orb) { orbitGroup.add(orb.mesh); });

      // Sizing & Camera setup
      var boxW = activeContainer.clientWidth || 1080;
      var boxH = activeContainer.clientHeight || 670;

      var camera = new THREE.PerspectiveCamera(45, boxW / boxH, 0.1, 1000);
      camera.position.z = 2.95;

      var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(boxW, boxH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      var canvas = renderer.domElement;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      canvas.style.cursor = 'grab';
      activeContainer.appendChild(canvas);

      var currentRot = { x: 0, y: 0 };
      var targetRot = { x: 0, y: 0 };
      var velocityRot = { x: 0, y: 0 };
      var isDragging = false;
      var isHovered = false;
      var isSphereVisible = true;
      var sphereAnimId = null;
      var hasActiveDisplacements = false;
      var lastX = 0, lastY = 0, lastDragTime = 0;
      var mousePos = null;

      var lastTime = performance.now();
      var targetDelta = 1000 / 60;
      var smoothingFactor = smoothing === 0 ? 1 : mapRange(smoothing, 0, 1, 0.4, 0.03);
      var momentumDecay = mapRange(smoothing, 0, 1, 0.7, 0.96);

      // Pre-allocated vectors for displacement physics & orbital satellites
      var tempV = new THREE.Vector3();
      var worldV = new THREE.Vector3();
      var projV = new THREE.Vector3();
      var camCol0 = new THREE.Vector3();
      var camCol1 = new THREE.Vector3();
      var camCol2 = new THREE.Vector3();
      var pushVec = new THREE.Vector3();
      var invWorld = new THREE.Matrix4();
      var matrixItem = new THREE.Matrix4();
      var orbitV = new THREE.Vector3();
      var axisX = new THREE.Vector3(1, 0, 0);
      var axisY = new THREE.Vector3(0, 1, 0);

      var isPageScrolling = false;
      var scrollReleaseTimer = null;
      var frameCount = 0;
      window.addEventListener('scroll', function () {
        isPageScrolling = true;
        clearTimeout(scrollReleaseTimer);
        scrollReleaseTimer = setTimeout(function () {
          isPageScrolling = false;
        }, 120);
      }, { passive: true });

      function animate(now) {
        if (!isSphereVisible) {
          sphereAnimId = null;
          return;
        }

        frameCount++;
        // During active page scrolling, render every 2nd frame to leave 100% frame budget for butter-smooth 60 FPS scrolling
        if (isPageScrolling && (frameCount % 2 !== 0)) {
          sphereAnimId = requestAnimationFrame(animate);
          return;
        }

        var elapsed = now - lastTime;
        lastTime = now;
        var n = Math.min(Math.max(elapsed / targetDelta, 0.1), 3);
        var threshold = 0.01;

        var breathe = 1.0 + Math.sin(now * 0.0018) * 0.02;
        group.scale.set(breathe, breathe, breathe);
        synapseMat.opacity = 0.38 + Math.sin(now * 0.003) * 0.22;
        coreGlowMat.opacity = 0.22 + Math.sin(now * 0.0025) * 0.12;

        if (!isDragging && autoSpeed !== 0 && (!stopOnHover || !isHovered)) {
          targetRot.x += autoSpeed * 0.1 * n;
        }

        if (!isDragging && smoothing > 0) {
          if (Math.abs(velocityRot.x) > threshold || Math.abs(velocityRot.y) > threshold) {
            targetRot.x += velocityRot.x * n;
            targetRot.y += velocityRot.y * n;
            targetRot.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRot.y));
            var decay = Math.pow(momentumDecay, n);
            velocityRot.x *= decay;
            velocityRot.y *= decay;
          } else {
            velocityRot.x = 0;
            velocityRot.y = 0;
          }
        }

        var diffX = targetRot.x - currentRot.x;
        var diffY = targetRot.y - currentRot.y;
        if (Math.abs(diffX) > threshold || Math.abs(diffY) > threshold || autoSpeed !== 0 || isDragging) {
          var step = 1 - Math.pow(1 - smoothingFactor, n);
          currentRot.x += diffX * step;
          currentRot.y += diffY * step;
          currentRot.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, currentRot.y));
        }

        group.rotation.y = currentRot.x;
        group.rotation.x = currentRot.y;
        group.updateMatrixWorld(true);

        orbitGroup.rotation.y = currentRot.x * 0.4;
        orbitGroup.rotation.x = currentRot.y * 0.4;
        orbitGroup.updateMatrixWorld(true);

        for (var orbIdx = 0; orbIdx < satelliteOrbs.length; orbIdx++) {
          var orb = satelliteOrbs[orbIdx];
          var orbTheta = now * orb.speed + orb.offset;
          orbitV.set(Math.cos(orbTheta) * orb.radius, Math.sin(orbTheta) * orb.radius, 0);
          orbitV.applyAxisAngle(axisX, orb.inclination);
          orbitV.applyAxisAngle(axisY, orb.yaw);
          orb.mesh.position.copy(orbitV);
        }

        // Only compute individual particle displacements when mouse is active or settling!
        // When mouse is idle, group.rotation rotates the entire sphere with 0 CPU matrix math and 0 GPU uploads!
        if (mousePos || hasActiveDisplacements) {
          var curW = canvas.clientWidth || 540;
          var curH = canvas.clientHeight || 540;
          var radSq = cursorRadius * cursorRadius;

          camera.matrixWorld.extractBasis(camCol0, camCol1, camCol2);
          invWorld.copy(group.matrixWorld).invert();

          var maxDispSq = 0;

          for (var pi = 0; pi < originalPositions.length; pi++) {
            var orig = originalPositions[pi];
            var disp = displacements[pi];

            if (mousePos) {
              tempV.copy(orig).add(disp);
              worldV.copy(tempV).applyMatrix4(group.matrixWorld);

              projV.copy(worldV).project(camera);
              var screenX = (projV.x * 0.5 + 0.5) * curW;
              var screenY = (-projV.y * 0.5 + 0.5) * curH;

              var dx = mousePos.x - screenX;
              var dy = mousePos.y - screenY;
              var distSq = dx * dx + dy * dy;

              if (distSq < radSq && distSq > 0) {
                var dist = Math.sqrt(distSq);
                var ratio = (cursorRadius - dist) / cursorRadius;
                var angle = Math.atan2(dy, dx);
                var force = ratio * cursorStrength * speed * n;
                var forceX = -Math.cos(angle) * force * 0.01;
                var forceY = Math.sin(angle) * force * 0.01;

                pushVec.set(0, 0, 0);
                pushVec.addScaledVector(camCol0, forceX);
                pushVec.addScaledVector(camCol1, forceY);
                pushVec.applyMatrix4(invWorld);
                disp.add(pushVec);
                hasActiveDisplacements = true;
              }
            }

            disp.multiplyScalar(Math.pow(frictionCoeff, n));
            disp.multiplyScalar(1 - returnForceCoeff * speed * n);

            var dSq = disp.lengthSq();
            if (dSq > maxDispSq) maxDispSq = dSq;
          }

          if (impulseVelocities.length > 0) {
            for (var vi = 0; vi < impulseVelocities.length; vi++) {
              var vel = impulseVelocities[vi];
              displacements[vi].addScaledVector(vel, n * 0.1);
              vel.multiplyScalar(Math.pow(0.95, n));
              vel.multiplyScalar(1 - returnForceCoeff * speed * n);
            }
            hasActiveDisplacements = true;
          }

          for (var mi = 0; mi < originalPositions.length; mi++) {
            tempV.copy(originalPositions[mi]).add(displacements[mi]);
            matrixItem.setPosition(tempV.x, tempV.y, tempV.z);
            instancedMesh.setMatrixAt(mi, matrixItem);
          }
          instancedMesh.instanceMatrix.needsUpdate = true;

          // When mouse left and displacements have decayed below threshold, return to resting state
          if (!mousePos && maxDispSq < 0.00002) {
            hasActiveDisplacements = false;
            for (var rmi = 0; rmi < originalPositions.length; rmi++) {
              displacements[rmi].set(0, 0, 0);
              var origR = originalPositions[rmi];
              matrixItem.setPosition(origR.x, origR.y, origR.z);
              instancedMesh.setMatrixAt(rmi, matrixItem);
            }
            instancedMesh.instanceMatrix.needsUpdate = true;
          }
        }

        renderer.render(scene, camera);
        sphereAnimId = requestAnimationFrame(animate);
      }

      // IntersectionObserver: Pause RAF loop when hero sphere is off-screen!
      if ('IntersectionObserver' in window) {
        var sphereObserver = new IntersectionObserver(function (entries) {
          var entry = entries[0];
          isSphereVisible = entry.isIntersecting;
          if (isSphereVisible && !sphereAnimId) {
            lastTime = performance.now();
            sphereAnimId = requestAnimationFrame(animate);
          } else if (!isSphereVisible && sphereAnimId) {
            cancelAnimationFrame(sphereAnimId);
            sphereAnimId = null;
          }
        }, { rootMargin: '100px 0px 100px 0px' });
        sphereObserver.observe(activeContainer);
      }

      sphereAnimId = requestAnimationFrame(animate);

      if (drag) {
        canvas.addEventListener('mousedown', function (e) {
          isDragging = true;
          canvas.style.cursor = 'grabbing';
          velocityRot.x = 0;
          velocityRot.y = 0;
          lastX = e.clientX;
          lastY = e.clientY;
          lastDragTime = performance.now();

          function onMouseMove(moveEvt) {
            var nowTime = performance.now();
            var dt = nowTime - lastDragTime;
            var dragFactor = mapRange(dragSpeed, 0, 1, 0.001, 0.02);
            var mdx = moveEvt.clientX - lastX;
            var mdy = moveEvt.clientY - lastY;

            targetRot.x += mdx * dragFactor;
            targetRot.y += mdy * dragFactor;
            targetRot.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRot.y));

            if (dt > 0) {
              var fpsRatio = (1000 / 60) / dt;
              velocityRot.x = mdx * dragFactor * 0.3 * fpsRatio;
              velocityRot.y = mdy * dragFactor * 0.3 * fpsRatio;
            }

            lastX = moveEvt.clientX;
            lastY = moveEvt.clientY;
            lastDragTime = nowTime;
          }

          function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            isDragging = false;
            canvas.style.cursor = 'grab';
          }

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        });
      }

      canvas.addEventListener('mouseenter', function () { isHovered = true; });
      canvas.addEventListener('mouseleave', function () { isHovered = false; mousePos = null; });
      canvas.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        var relX = e.clientX - rect.left;
        var relY = e.clientY - rect.top;
        if (relX >= 0 && relX <= rect.width && relY >= 0 && relY <= rect.height) {
          mousePos = { x: relX, y: relY };
          hasActiveDisplacements = true;
        } else {
          mousePos = null;
        }
      });

      canvas.addEventListener('click', function (e) {
        if (!cursorConfig.enabled || !cursorConfig.clickForce) return;
        group.updateMatrixWorld(true);
        var rect = canvas.getBoundingClientRect();
        var clickX = e.clientX - rect.left;
        var clickY = e.clientY - rect.top;

        var curW = canvas.clientWidth || 540;
        var curH = canvas.clientHeight || 540;
        var ndcX = (clickX / curW) * 2 - 1;
        var ndcY = 1 - (clickY / curH) * 2;

        var rayOrigin = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
        var camPos = new THREE.Vector3().setFromMatrixPosition(camera.matrixWorld);
        var rayDir = new THREE.Vector3().subVectors(rayOrigin, camPos).normalize();

        var toCenter = new THREE.Vector3().subVectors(new THREE.Vector3(0, 0, 0), camPos);
        var centerDist = toCenter.length();
        var focalPoint = new THREE.Vector3().copy(camPos).addScaledVector(rayDir, centerDist);

        var clickRadSq = cursorRadius * cursorRadius;
        var clickStrength = cursorConfig.clickForce || 5;

        var pVec = new THREE.Vector3();
        var wVec = new THREE.Vector3();
        var pushDir = new THREE.Vector3();
        var invMat = new THREE.Matrix4().copy(group.matrixWorld).invert();

        for (var ci = 0; ci < originalPositions.length; ci++) {
          pVec.copy(originalPositions[ci]).add(displacements[ci]);
          wVec.copy(pVec).applyMatrix4(group.matrixWorld);

          var cdx = clickX - (wVec.x * 0.5 + 0.5) * curW;
          var cdy = clickY - (-wVec.y * 0.5 + 0.5) * curH;
          var distSq = cdx * cdx + cdy * cdy;

          if (distSq < clickRadSq && distSq > 0) {
            var dist = Math.sqrt(distSq);
            var intensity = ((cursorRadius - dist) / cursorRadius) * clickStrength;
            pushDir.subVectors(wVec, focalPoint);
            if (pushDir.length() > 0.001) {
              pushDir.normalize().multiplyScalar(intensity * 0.5);
              pushDir.applyMatrix4(invMat);
              impulseVelocities[ci].add(pushDir);
            }
          }
        }
      });

      var resizeObserver = new ResizeObserver(function () {
        if (!activeContainer || !camera || !renderer) return;
        var cw = activeContainer.clientWidth || 540;
        var ch = activeContainer.clientHeight || 540;
        camera.aspect = cw / ch;
        camera.updateProjectionMatrix();
        renderer.setSize(cw, ch);
      });
      resizeObserver.observe(activeContainer);
    }).catch(function (err) {
      console.error('Failed to load Three.js for hero sphere:', err);
    });
  }

  function initHeroLiquidHover(hero) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var bgContainer = hero.querySelector('.framer-1tc22uo');
    if (!bgContainer) return;
    if (bgContainer.querySelector('.demaze-liquid-canvas')) return;

    var bgImg = bgContainer.querySelector('img');
    var imgSrc = (bgImg && bgImg.src && !bgImg.src.includes('undefined'))
      ? bgImg.src
      : './assets/demaze/hero-alpine-bg.jpg';

    var canvas = document.createElement('canvas');
    canvas.className = 'demaze-liquid-canvas';
    canvas.style.cssText = 'position:absolute;top:-10%;left:-10%;width:120%;height:120%;display:block;pointer-events:none;z-index:1;opacity:0;transition:opacity 0.3s ease-out;';
    bgContainer.appendChild(canvas);

    var gl = canvas.getContext('webgl', { alpha: true, depth: false, antialias: false });
    if (!gl) return;

    gl.getExtension('OES_texture_float');
    gl.getExtension('OES_texture_float_linear');
    gl.clearColor(0, 0, 0, 0);

    // Fluid simulation parameters matching fuel.framer.website
    var cursorSize = 0.5;
    var cursorPower = 1.0;
    var distortionPower = 0.75;
    var resolution = 5;

    var m = {
      cursorSize: 0.5 + (cursorSize - 0.1) * 4.5 / 0.9,
      cursorPower: 5 + (cursorPower - 0.1) * 45 / 0.9,
      distortionPower: distortionPower
    };
    var overscan = 1.2;
    var mouse = {
      x: 0.5 * bgContainer.clientWidth,
      y: 0.4 * bgContainer.clientHeight,
      dx: 0,
      dy: 0,
      moved: false
    };
    var gridDim = { w: 0, h: 0 };
    var velDouble, presDouble, divFbo, outDouble, imgTex = null, imgAspect = 1;
    var isSimVisible = true;
    var animFrameId = null;

    var baseVertShader =
      'precision highp float;\n' +
      'varying vec2 vUv;\n' +
      'attribute vec2 a_position;\n' +
      'varying vec2 vL;\n' +
      'varying vec2 vR;\n' +
      'varying vec2 vT;\n' +
      'varying vec2 vB;\n' +
      'uniform vec2 u_texel;\n' +
      'void main () {\n' +
      '  vUv = .5 * (a_position + 1.);\n' +
      '  vL = vUv - vec2(u_texel.x, 0.);\n' +
      '  vR = vUv + vec2(u_texel.x, 0.);\n' +
      '  vT = vUv + vec2(0., u_texel.y);\n' +
      '  vB = vUv - vec2(0., u_texel.y);\n' +
      '  gl_Position = vec4(a_position, 0., 1.);\n' +
      '}';

    function compileShader(src, type) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        var err = gl.getShaderInfoLog(sh);
        gl.deleteShader(sh);
        throw new Error(err);
      }
      return sh;
    }

    function createProgram(vertSrc, fragSrc) {
      var prog = gl.createProgram();
      gl.attachShader(prog, compileShader(vertSrc, gl.VERTEX_SHADER));
      gl.attachShader(prog, compileShader(fragSrc, gl.FRAGMENT_SHADER));
      gl.bindAttribLocation(prog, 0, 'a_position');
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(prog) || 'Program link error');
      }
      var uniforms = {};
      var count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
      for (var i = 0; i < count; i++) {
        var u = gl.getActiveUniform(prog, i);
        if (u) uniforms[u.name] = gl.getUniformLocation(prog, u.name);
      }
      return { program: prog, uniforms: uniforms };
    }

    function renderQuad(fbo) {
      var vBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
      var iBuf = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuf);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);

      if (fbo == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, fbo.width, fbo.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      gl.deleteBuffer(vBuf);
      gl.deleteBuffer(iBuf);
    }

    function createFBO(w, h) {
      gl.activeTexture(gl.TEXTURE0);
      var tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, w, h, 0, gl.RGB, gl.FLOAT, null);
      var fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        fbo: fbo,
        width: w,
        height: h,
        attach: function (slot) {
          gl.activeTexture(gl.TEXTURE0 + slot);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          return slot;
        }
      };
    }

    function createDoubleFBO(w, h) {
      var f1 = createFBO(w, h);
      var f2 = createFBO(w, h);
      return {
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        read: function () { return f1; },
        write: function () { return f2; },
        swap: function () { var tmp = f1; f1 = f2; f2 = tmp; }
      };
    }

    var progSplat = createProgram(baseVertShader,
      'precision highp float;\n' +
      'precision highp sampler2D;\n' +
      'varying vec2 vUv;\n' +
      'uniform sampler2D u_input_texture;\n' +
      'uniform float u_ratio;\n' +
      'uniform float u_img_ratio;\n' +
      'uniform vec3 u_point_value;\n' +
      'uniform vec2 u_point;\n' +
      'uniform float u_point_size;\n' +
      'void main () {\n' +
      '  vec2 p = vUv - u_point.xy;\n' +
      '  p.x *= u_ratio;\n' +
      '  vec3 splat = .6 * pow(2., -dot(p, p) / u_point_size) * u_point_value;\n' +
      '  vec3 base = texture2D(u_input_texture, vUv).xyz;\n' +
      '  gl_FragColor = vec4(base + splat, 1.);\n' +
      '}'
    );

    var progDivergence = createProgram(baseVertShader,
      'precision highp float;\n' +
      'precision highp sampler2D;\n' +
      'varying highp vec2 vUv;\n' +
      'varying highp vec2 vL;\n' +
      'varying highp vec2 vR;\n' +
      'varying highp vec2 vT;\n' +
      'varying highp vec2 vB;\n' +
      'uniform sampler2D u_velocity_texture;\n' +
      'void main () {\n' +
      '  float L = texture2D(u_velocity_texture, vL).x;\n' +
      '  float R = texture2D(u_velocity_texture, vR).x;\n' +
      '  float T = texture2D(u_velocity_texture, vT).y;\n' +
      '  float B = texture2D(u_velocity_texture, vB).y;\n' +
      '  float div = .25 * (R - L + T - B);\n' +
      '  gl_FragColor = vec4(div, 0., 0., 1.);\n' +
      '}'
    );

    var progPressure = createProgram(baseVertShader,
      'precision highp float;\n' +
      'precision highp sampler2D;\n' +
      'varying highp vec2 vUv;\n' +
      'varying highp vec2 vL;\n' +
      'varying highp vec2 vR;\n' +
      'varying highp vec2 vT;\n' +
      'varying highp vec2 vB;\n' +
      'uniform sampler2D u_pressure_texture;\n' +
      'uniform sampler2D u_divergence_texture;\n' +
      'void main () {\n' +
      '  float L = texture2D(u_pressure_texture, vL).x;\n' +
      '  float R = texture2D(u_pressure_texture, vR).x;\n' +
      '  float T = texture2D(u_pressure_texture, vT).x;\n' +
      '  float B = texture2D(u_pressure_texture, vB).x;\n' +
      '  float divergence = texture2D(u_divergence_texture, vUv).x;\n' +
      '  float pressure = (L + R + B + T - divergence) * .25;\n' +
      '  gl_FragColor = vec4(pressure, 0., 0., 1.);\n' +
      '}'
    );

    var progGradient = createProgram(baseVertShader,
      'precision highp float;\n' +
      'precision highp sampler2D;\n' +
      'varying highp vec2 vUv;\n' +
      'varying highp vec2 vL;\n' +
      'varying highp vec2 vR;\n' +
      'varying highp vec2 vT;\n' +
      'varying highp vec2 vB;\n' +
      'uniform sampler2D u_pressure_texture;\n' +
      'uniform sampler2D u_velocity_texture;\n' +
      'void main () {\n' +
      '  float L = texture2D(u_pressure_texture, vL).x;\n' +
      '  float R = texture2D(u_pressure_texture, vR).x;\n' +
      '  float T = texture2D(u_pressure_texture, vT).x;\n' +
      '  float B = texture2D(u_pressure_texture, vB).x;\n' +
      '  vec2 velocity = texture2D(u_velocity_texture, vUv).xy;\n' +
      '  velocity.xy -= vec2(R - L, T - B);\n' +
      '  gl_FragColor = vec4(velocity, 0., 1.);\n' +
      '}'
    );

    var progAdvection = createProgram(baseVertShader,
      'precision highp float;\n' +
      'precision highp sampler2D;\n' +
      'varying vec2 vUv;\n' +
      'uniform sampler2D u_velocity_texture;\n' +
      'uniform sampler2D u_input_texture;\n' +
      'uniform vec2 u_texel;\n' +
      'uniform vec2 u_output_textel;\n' +
      'uniform float u_dt;\n' +
      'uniform float u_dissipation;\n' +
      'vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {\n' +
      '  vec2 st = uv / tsize - 0.5;\n' +
      '  vec2 iuv = floor(st);\n' +
      '  vec2 fuv = fract(st);\n' +
      '  vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);\n' +
      '  vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);\n' +
      '  vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);\n' +
      '  vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);\n' +
      '  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);\n' +
      '}\n' +
      'void main () {\n' +
      '  vec2 coord = vUv - u_dt * bilerp(u_velocity_texture, vUv, u_texel).xy * u_texel;\n' +
      '  vec4 velocity = bilerp(u_input_texture, coord, u_output_textel);\n' +
      '  gl_FragColor = u_dissipation * velocity;\n' +
      '}'
    );

    var progDisplay = createProgram(baseVertShader,
      'precision highp float;\n' +
      'precision highp sampler2D;\n' +
      'varying vec2 vUv;\n' +
      'uniform float u_ratio;\n' +
      'uniform float u_img_ratio;\n' +
      'uniform float u_disturb_power;\n' +
      'uniform sampler2D u_output_texture;\n' +
      'uniform sampler2D u_velocity_texture;\n' +
      'uniform sampler2D u_text_texture;\n' +
      'uniform vec2 u_point;\n' +
      'uniform float u_canvas_scale;\n' +
      'uniform float u_inner_scale;\n' +
      'vec2 get_img_uv() {\n' +
      '  vec2 uv = vUv - 0.5;\n' +
      '  uv *= u_canvas_scale;\n' +
      '  uv /= u_inner_scale;\n' +
      '  float containerAspect = u_ratio;\n' +
      '  float imageAspect = u_img_ratio;\n' +
      '  vec2 scale = vec2(1.0);\n' +
      '  if (containerAspect > imageAspect) {\n' +
      '    scale.y = imageAspect / containerAspect;\n' +
      '  } else {\n' +
      '    scale.x = containerAspect / imageAspect;\n' +
      '  }\n' +
      '  uv *= scale;\n' +
      '  return uv + 0.5;\n' +
      '}\n' +
      'vec2 get_frame_uv() {\n' +
      '  vec2 uv = vUv - 0.5;\n' +
      '  uv *= u_canvas_scale;\n' +
      '  uv /= u_inner_scale;\n' +
      '  return uv + 0.5;\n' +
      '}\n' +
      'float get_img_frame_alpha(vec2 uv, float img_frame_width) {\n' +
      '  float alpha = smoothstep(0., img_frame_width, uv.x) * smoothstep(1., 1. - img_frame_width, uv.x);\n' +
      '  alpha *= smoothstep(0., img_frame_width, uv.y) * smoothstep(1., 1. - img_frame_width, uv.y);\n' +
      '  return alpha;\n' +
      '}\n' +
      'vec3 sample_image_smooth(vec2 uv) {\n' +
      '  vec2 uvc = clamp(uv, 0.0, 1.0);\n' +
      '  vec3 base = texture2D(u_text_texture, vec2(uvc.x, 1.0 - uvc.y)).rgb;\n' +
      '  float yBelow = step(uv.y, 0.0);\n' +
      '  float yAbove = step(1.0, uv.y);\n' +
      '  float xLeft = step(uv.x, 0.0);\n' +
      '  float xRight = step(1.0, uv.x);\n' +
      '  float outOfBounds = max(max(yBelow, yAbove), max(xLeft, xRight));\n' +
      '  if (outOfBounds > 0.0) {\n' +
      '    float d = 0.002;\n' +
      '    vec3 sum = vec3(0.0);\n' +
      '    sum += texture2D(u_text_texture, vec2(clamp(uvc.x - d, 0.0, 1.0), 1.0 - clamp(uvc.y - d, 0.0, 1.0))).rgb;\n' +
      '    sum += texture2D(u_text_texture, vec2(clamp(uvc.x, 0.0, 1.0), 1.0 - clamp(uvc.y - d, 0.0, 1.0))).rgb;\n' +
      '    sum += texture2D(u_text_texture, vec2(clamp(uvc.x + d, 0.0, 1.0), 1.0 - clamp(uvc.y - d, 0.0, 1.0))).rgb;\n' +
      '    sum += texture2D(u_text_texture, vec2(clamp(uvc.x - d, 0.0, 1.0), 1.0 - clamp(uvc.y, 0.0, 1.0))).rgb;\n' +
      '    sum += texture2D(u_text_texture, vec2(clamp(uvc.x, 0.0, 1.0), 1.0 - clamp(uvc.y, 0.0, 1.0))).rgb;\n' +
      '    sum += texture2D(u_text_texture, vec2(clamp(uvc.x + d, 0.0, 1.0), 1.0 - clamp(uvc.y, 0.0, 1.0))).rgb;\n' +
      '    sum += texture2D(u_text_texture, vec2(clamp(uvc.x - d, 0.0, 1.0), 1.0 - clamp(uvc.y + d, 0.0, 1.0))).rgb;\n' +
      '    sum += texture2D(u_text_texture, vec2(clamp(uvc.x, 0.0, 1.0), 1.0 - clamp(uvc.y + d, 0.0, 1.0))).rgb;\n' +
      '    sum += texture2D(u_text_texture, vec2(clamp(uvc.x + d, 0.0, 1.0), 1.0 - clamp(uvc.y + d, 0.0, 1.0))).rgb;\n' +
      '    base = sum / 9.0;\n' +
      '  }\n' +
      '  return base;\n' +
      '}\n' +
      'void main () {\n' +
      '  float offset = texture2D(u_output_texture, vUv).r;\n' +
      '  vec2 velocity = texture2D(u_velocity_texture, vUv).xy;\n' +
      '  velocity += .001;\n' +
      '  vec2 img_uv = get_img_uv();\n' +
      '  img_uv -= u_disturb_power * normalize(velocity) * offset;\n' +
      '  img_uv -= u_disturb_power * normalize(velocity) * offset;\n' +
      '  vec2 frame_uv = get_frame_uv();\n' +
      '  frame_uv -= u_disturb_power * normalize(velocity) * offset;\n' +
      '  vec3 img = sample_image_smooth(img_uv);\n' +
      '  float opacity = get_img_frame_alpha(frame_uv, .002);\n' +
      '  gl_FragColor = vec4(img * opacity, opacity);\n' +
      '}'
    );

    function initFBOs() {
      velDouble = createDoubleFBO(gridDim.w, gridDim.h);
      presDouble = createDoubleFBO(gridDim.w, gridDim.h);
      divFbo = createFBO(gridDim.w, gridDim.h);
      outDouble = createDoubleFBO(gridDim.w, gridDim.h);
    }

    function resizeCanvas() {
      var w = bgContainer.clientWidth || 1440;
      var h = bgContainer.clientHeight || 900;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(2, Math.round(w * overscan * dpr));
      canvas.height = Math.max(2, Math.round(h * overscan * dpr));
      var dispW = w * overscan;
      var dispH = h * overscan;
      canvas.style.width = dispW + 'px';
      canvas.style.height = dispH + 'px';
      var aspect = dispW / dispH;
      var l = 128 + (resolution - 1) * 384 / 9;
      gridDim.w = Math.round(l * aspect);
      gridDim.h = Math.round(l);
    }

    function getNormalizedPointer() {
      var w = bgContainer.clientWidth * overscan;
      var h = bgContainer.clientHeight * overscan;
      var rx = 0.5 * (w - bgContainer.clientWidth);
      var ry = 0.5 * (h - bgContainer.clientHeight);
      return {
        u: (mouse.x + rx) / w,
        v: 1 - (mouse.y + ry) / h
      };
    }

    function recordPointer(clientX, clientY) {
      mouse.moved = true;
      mouse.dx = 6 * (clientX - mouse.x);
      mouse.dy = 6 * (clientY - mouse.y);
      mouse.x = clientX;
      mouse.y = clientY;
    }

    function loadTexture(src) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onload = function () {
        imgAspect = img.naturalWidth / Math.max(1, img.naturalHeight);
        imgTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, imgTex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, imgTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        canvas.style.opacity = '1';
      };
    }

    function renderFrame() {
      if (!isSimVisible) {
        animFrameId = null;
        return;
      }
      if (!imgTex) {
        animFrameId = requestAnimationFrame(renderFrame);
        return;
      }

      var dt = 1 / 60;
      if (mouse.moved) {
        mouse.moved = false;
        gl.useProgram(progSplat.program);
        gl.uniform1i(progSplat.uniforms.u_input_texture, velDouble.read().attach(1));
        gl.uniform1f(progSplat.uniforms.u_ratio, bgContainer.clientWidth / Math.max(1, bgContainer.clientHeight));
        var pt = getNormalizedPointer();
        gl.uniform2f(progSplat.uniforms.u_point, pt.u, pt.v);
        gl.uniform3f(progSplat.uniforms.u_point_value, mouse.dx, -mouse.dy, 0);
        gl.uniform1f(progSplat.uniforms.u_point_size, m.cursorSize * 0.001);
        renderQuad(velDouble.write());
        velDouble.swap();

        gl.uniform1i(progSplat.uniforms.u_input_texture, outDouble.read().attach(1));
        gl.uniform3f(progSplat.uniforms.u_point_value, m.cursorPower * 0.001, 0, 0);
        renderQuad(outDouble.write());
        outDouble.swap();
      }

      gl.useProgram(progDivergence.program);
      gl.uniform2f(progDivergence.uniforms.u_texel, velDouble.texelSizeX, velDouble.texelSizeY);
      gl.uniform1i(progDivergence.uniforms.u_velocity_texture, velDouble.read().attach(1));
      renderQuad(divFbo);

      gl.useProgram(progPressure.program);
      gl.uniform2f(progPressure.uniforms.u_texel, velDouble.texelSizeX, velDouble.texelSizeY);
      gl.uniform1i(progPressure.uniforms.u_divergence_texture, divFbo.attach(1));
      for (var step = 0; step < 16; step++) {
        gl.uniform1i(progPressure.uniforms.u_pressure_texture, presDouble.read().attach(2));
        renderQuad(presDouble.write());
        presDouble.swap();
      }

      gl.useProgram(progGradient.program);
      gl.uniform2f(progGradient.uniforms.u_texel, velDouble.texelSizeX, velDouble.texelSizeY);
      gl.uniform1i(progGradient.uniforms.u_pressure_texture, presDouble.read().attach(1));
      gl.uniform1i(progGradient.uniforms.u_velocity_texture, velDouble.read().attach(2));
      renderQuad(velDouble.write());
      velDouble.swap();

      gl.useProgram(progAdvection.program);
      gl.uniform2f(progAdvection.uniforms.u_texel, velDouble.texelSizeX, velDouble.texelSizeY);
      gl.uniform2f(progAdvection.uniforms.u_output_textel, velDouble.texelSizeX, velDouble.texelSizeY);
      gl.uniform1i(progAdvection.uniforms.u_velocity_texture, velDouble.read().attach(1));
      gl.uniform1i(progAdvection.uniforms.u_input_texture, velDouble.read().attach(1));
      gl.uniform1f(progAdvection.uniforms.u_dt, dt);
      gl.uniform1f(progAdvection.uniforms.u_dissipation, 0.97);
      renderQuad(velDouble.write());
      velDouble.swap();

      gl.useProgram(progAdvection.program);
      gl.uniform2f(progAdvection.uniforms.u_output_textel, outDouble.texelSizeX, outDouble.texelSizeY);
      gl.uniform1i(progAdvection.uniforms.u_input_texture, outDouble.read().attach(2));
      gl.uniform1f(progAdvection.uniforms.u_dt, 8 * dt);
      gl.uniform1f(progAdvection.uniforms.u_dissipation, 0.98);
      renderQuad(outDouble.write());
      outDouble.swap();

      gl.useProgram(progDisplay.program);
      var ptF = getNormalizedPointer();
      gl.uniform2f(progDisplay.uniforms.u_point, ptF.u, ptF.v);
      gl.uniform1i(progDisplay.uniforms.u_velocity_texture, velDouble.read().attach(2));
      gl.uniform1f(progDisplay.uniforms.u_ratio, bgContainer.clientWidth / Math.max(1, bgContainer.clientHeight));
      gl.uniform1f(progDisplay.uniforms.u_img_ratio, imgAspect);
      gl.uniform1f(progDisplay.uniforms.u_disturb_power, m.distortionPower);
      gl.uniform1i(progDisplay.uniforms.u_output_texture, outDouble.read().attach(1));
      gl.uniform1f(progDisplay.uniforms.u_canvas_scale, 1);
      gl.uniform1f(progDisplay.uniforms.u_inner_scale, 0.8333333333333334);
      if (imgTex) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, imgTex);
        gl.uniform1i(progDisplay.uniforms.u_text_texture, 0);
        renderQuad(null);
      }

      animFrameId = requestAnimationFrame(renderFrame);
    }

    resizeCanvas();
    initFBOs();
    loadTexture(imgSrc);

    // Track mouse & touch movements across the hero section
    hero.addEventListener('mousemove', function (e) {
      var rect = bgContainer.getBoundingClientRect();
      recordPointer(e.clientX - rect.left, e.clientY - rect.top);
    });

    hero.addEventListener('touchmove', function (e) {
      if (e.targetTouches && e.targetTouches[0]) {
        var t = e.targetTouches[0];
        var rect = bgContainer.getBoundingClientRect();
        recordPointer(t.clientX - rect.left, t.clientY - rect.top);
      }
    }, { passive: true });

    window.addEventListener('resize', function () {
      resizeCanvas();
      initFBOs();
      if (imgTex) gl.bindTexture(gl.TEXTURE_2D, imgTex);
    }, { passive: true });

    // IntersectionObserver to pause loop when scrolled away
    if ('IntersectionObserver' in window) {
      var heroObs = new IntersectionObserver(function (entries) {
        isSimVisible = entries[0].isIntersecting;
        if (isSimVisible && !animFrameId) {
          animFrameId = requestAnimationFrame(renderFrame);
        } else if (!isSimVisible && animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      }, { rootMargin: '100px 0px 100px 0px' });
      heroObs.observe(hero);
    }

    animFrameId = requestAnimationFrame(renderFrame);
  }

  function getHero() {
    return document.querySelector('section[data-framer-name="Hero"]');
  }

  function isHydrated(hero) {
    var h1 = hero && hero.querySelector('h1');
    return !!(h1 && h1.textContent.trim().length > 0);
  }

  function applyOverride(hero) {
    // 1. Badge text
    var badgeParagraphs = Array.prototype.filter.call(
      hero.querySelectorAll('[data-framer-name="Tag"] [data-framer-name="Badge Text"] p'),
      function (p) {
        return !p.closest('.framer-zeccam');
      }
    );
    badgeParagraphs.forEach(function (p) {
      p.textContent = content.badge;
      var textBox = p.closest('[data-framer-name="Badge Text"]');
      if (textBox) textBox.style.width = 'auto';
    });

    var tagWrapper = hero.querySelector('[data-framer-name="Tag"]');
    if (tagWrapper) {
      tagWrapper.style.width = 'auto';
      tagWrapper.style.maxWidth = 'none';
    }

    var pricePill = hero.querySelector('.framer-zeccam[data-framer-name="tag"]');
    if (pricePill) pricePill.style.display = 'none';

    // 2. Headline
    var h1 = hero.querySelector('h1');
    if (h1) h1.textContent = content.headline;

    // 3. Description
    var headlineWrapper = hero.querySelector('[data-framer-name="Headline"]');
    if (headlineWrapper && !hero.querySelector('.demaze-hero-desc')) {
      var desc = document.createElement('div');
      desc.className = 'demaze-hero-desc';
      var p = document.createElement('p');
      p.className = 'framer-text framer-styles-preset-17kfgzm';
      p.setAttribute('dir', 'auto');
      p.textContent = content.description;
      desc.appendChild(p);
      headlineWrapper.insertAdjacentElement('afterend', desc);
    }

    // 4. Primary CTA ("Let's Connect")
    var primaryLink = hero.querySelector('a[href="./contact"]');
    if (primaryLink) {
      primaryLink.setAttribute('href', content.primaryCTA.href);
      primaryLink
        .querySelectorAll('[data-framer-name="Get In Touch"] p, p')
        .forEach(function (p) {
          p.textContent = content.primaryCTA.text;
        });
    }

    // 5. Secondary CTA ("Explore Services")
    var secondaryLink = hero.querySelector('a[href="./integration"], a[href="./services"]');
    if (secondaryLink) {
      secondaryLink.setAttribute('href', content.secondaryCTA.href);
      secondaryLink
        .querySelectorAll('[data-framer-name="Call to Action Text"] p')
        .forEach(function (p) {
          p.textContent = content.secondaryCTA.text;
        });
    }

    // 6. Background image: enforce local alpine background
    var heroBgImg = hero.querySelector('.framer-1tc22uo img');
    if (heroBgImg) {
      heroBgImg.style.removeProperty('display');
      heroBgImg.style.display = 'block';
      heroBgImg.style.visibility = 'visible';
      heroBgImg.style.opacity = '1';
      if (!heroBgImg.src.includes('hero-alpine-bg.jpg') || heroBgImg.src.includes('cbqUucc')) {
        heroBgImg.src = './assets/demaze/hero-alpine-bg.jpg';
        heroBgImg.srcset = './assets/demaze/hero-alpine-bg.jpg 1x';
      }
    }

    // Ensure background image and liquid canvas stay locked post-hydration
    var bgContainer = hero.querySelector('.framer-1tc22uo');
    if (bgContainer && !bgContainer.__demazeEnforced) {
      bgContainer.__demazeEnforced = true;
      var bgObserver = new MutationObserver(function () {
        var img = bgContainer.querySelector('img');
        if (img && (!img.src.includes('hero-alpine-bg.jpg') || img.src.includes('cbqUucc'))) {
          img.src = './assets/demaze/hero-alpine-bg.jpg';
          img.srcset = './assets/demaze/hero-alpine-bg.jpg 1x';
        }
        if (!bgContainer.querySelector('.demaze-liquid-canvas')) {
          initHeroLiquidHover(hero);
        }
      });
      bgObserver.observe(bgContainer, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'srcset'] });
    }

    // Fuel-style Liquid Water Floating Ripple Effect
    initHeroLiquidHover(hero);

    // 7. Tabbed Browser Mockup Card + 3D Sphere Integration
    var tabCardEl = hero.querySelector('.framer-1ib2jhf, [data-framer-appear-id="1ib2jhf"]');
    if (tabCardEl) {
      tabCardEl.style.setProperty('display', 'block', 'important');
      // Hide old MOVIQ screenshot inside
      var oldImgs = tabCardEl.querySelectorAll('img');
      oldImgs.forEach(function (img) {
        img.style.setProperty('display', 'none', 'important');
      });

      if (!tabCardEl.querySelector('.demaze-browser-card')) {
        var card = document.createElement('div');
        card.className = 'demaze-browser-card';
        card.innerHTML =
          '<div class="demaze-browser-bar">' +
          '  <div class="demaze-window-dots">' +
          '    <span class="dot close"></span>' +
          '    <span class="dot min"></span>' +
          '    <span class="dot expand"></span>' +
          '  </div>' +
          '  <div class="demaze-browser-tab">' +
          '    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
          '      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>' +
          '      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>' +
          '    </svg>' +
          '    <span class="demaze-tab-url">demazetech.com</span>' +
          '    <span class="demaze-tab-badge">Neural AI Engine v4.0</span>' +
          '  </div>' +
          '  <div class="demaze-browser-actions">' +
          '    <span class="demaze-live-pulse"></span>' +
          '    <span class="demaze-live-text">Live Interactive Core</span>' +
          '  </div>' +
          '</div>' +
          '<div class="demaze-sphere-stage">' +
          '  <div id="hero-sphere-container"></div>' +
          '  <div class="demaze-telemetry-card demaze-telemetry-left">' +
          '    <div class="demaze-telemetry-hdr">' +
          '      <span class="demaze-pill-dot green"></span>' +
          '      <span>NEURAL ENGINE</span>' +
          '    </div>' +
          '    <div class="demaze-telemetry-metric">99.4%</div>' +
          '    <div class="demaze-telemetry-sub">Inference Precision · Autonomous AI</div>' +
          '  </div>' +
          '  <div class="demaze-telemetry-card demaze-telemetry-right">' +
          '    <div class="demaze-telemetry-hdr">' +
          '      <span class="demaze-pill-dot cyan"></span>' +
          '      <span>DEPLOYMENTS</span>' +
          '    </div>' +
          '    <div class="demaze-telemetry-metric">45+ Systems</div>' +
          '    <div class="demaze-telemetry-sub">Enterprise AI Deployments Active</div>' +
          '  </div>' +
          '</div>';

        tabCardEl.appendChild(card);
      }
      initHeroSphere(document.getElementById('hero-sphere-container'));

    }

    // 8. Inject Master Hero Styles
    if (!document.getElementById('demaze-hero-style')) {
      var hStyle = document.createElement('style');
      hStyle.id = 'demaze-hero-style';
      hStyle.textContent =
        '@keyframes demazeHeroFadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}' +
        'section[data-framer-name="Hero"], .framer-xj5vkr{' +
        '  position:relative!important;overflow:visible!important;' +
        '  height:1420px!important;max-height:1520px!important;aspect-ratio:auto!important;' +
        '  padding:160px 0 0!important;margin-bottom:0px!important;' +
        '}' +
        '@media (max-width: 1199px) {' +
        '  section[data-framer-name="Hero"], .framer-xj5vkr{' +
        '    height:1360px!important;max-height:1440px!important;' +
        '  }' +
        '}' +
        '@media (max-width: 809px) {' +
        '  section[data-framer-name="Hero"], .framer-xj5vkr{' +
        '    height:1380px!important;max-height:1480px!important;padding:150px 0 0!important;' +
        '  }' +
        '}' +
        'section[data-framer-name="Badge"]{' +
        '  margin-top:0px!important;position:relative!important;z-index:2!important;' +
        '}' +
        /* MOVIQ Native Background Image Wrapper Styling */
        '.framer-1tc22uo{' +
        '  position:absolute!important;top:0!important;left:50%!important;transform:translate(-50%)!important;' +
        '  width:100%!important;border-radius:32px!important;overflow:clip!important;z-index:0!important;' +
        '}' +
        '.framer-1tc22uo img{' +
        '  display:block!important;width:100%!important;height:100%!important;border-radius:inherit!important;' +
        '  object-position:center!important;object-fit:cover!important;' +
        '}' +
        'section[data-framer-name="Hero"] [data-framer-name="Container"], .framer-384jw6{' +
        '  position:relative!important;z-index:4!important;height:auto!important;min-height:auto!important;padding:0 24px!important;' +
        '}' +
        'section[data-framer-name="Hero"] [data-framer-name="Tag"]{' +
        '  animation:demazeHeroFadeUp 0.6s ease-out 0.1s both;position:relative;z-index:4;' +
        '  background-color:rgba(255, 255, 255, 0.3)!important;border-radius:100px!important;padding:8px 14px!important;' +
        '  border:1px solid rgba(255, 255, 255, 0.25)!important;backdrop-filter:blur(8px)!important;' +
        '}' +
        'section[data-framer-name="Hero"] h1{' +
        '  animation:demazeHeroFadeUp 0.6s ease-out 0.25s both;position:relative;z-index:4;text-wrap:balance;' +
        '  font-size:clamp(34px, 4.5vw, 68px)!important;line-height:1.15!important;margin:16px auto 0!important;' +
        '  color:#ffffff!important;text-shadow:0 2px 16px rgba(0,0,0,0.65)!important;text-align:center!important;' +
        '}' +
        'section[data-framer-name="Hero"] .demaze-hero-desc{' +
        '  animation:demazeHeroFadeUp 0.6s ease-out 0.4s both;position:relative;z-index:4;max-width:680px!important;margin:16px auto 0!important;text-align:center!important;' +
        '}' +
        'section[data-framer-name="Hero"] .demaze-hero-desc p{' +
        '  text-align:center!important;font-size:clamp(15px,1.3vw,18.5px)!important;line-height:1.6!important;' +
        '  color:rgba(255,255,255,0.95)!important;text-shadow:0 2px 10px rgba(0,0,0,0.75)!important;' +
        '}' +
        'section[data-framer-name="Hero"] [data-framer-name="Call to Action"], section[data-framer-name="Hero"] [data-framer-name="CTA Buttons"]{' +
        '  animation:demazeHeroFadeUp 0.6s ease-out 0.55s both;position:relative;z-index:4;gap:16px!important;margin-top:20px!important;' +
        '}' +
        /* Primary CTA ("Let's Connect") Styling & Hover */
        'section[data-framer-name="Hero"] a[href*="contact"]{' +
        '  width:auto!important;min-width:160px!important;height:48px!important;' +
        '  background:rgb(33, 37, 41)!important;' +
        '  border:1px solid rgba(255, 255, 255, 0.2)!important;border-radius:50px!important;' +
        '  box-shadow:0 4px 16px rgba(0,0,0,0.3)!important;text-decoration:none!important;' +
        '  transition:all 0.25s cubic-bezier(.22,1,.36,1)!important;' +
        '  overflow:hidden!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="contact"]:hover, section[data-framer-name="Hero"] a[href*="contact"].hover{' +
        '  border-color:rgba(255, 255, 255, 0.4)!important;' +
        '  transform:translateY(-2px)!important;box-shadow:0 8px 24px rgba(0,0,0,0.4)!important;' +
        '}' +
        /* Default white text on dark button */
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-1s9c08m p,' +
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-1s9c08m span,' +
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-1s9c08m .framer-text{' +
        '  color:#ffffff!important;--framer-text-color:#ffffff!important;font-weight:500!important;' +
        '}' +
        /* High-contrast dark text when white hover bubble expands */
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-ef3qfq p,' +
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-ef3qfq span,' +
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-ef3qfq .framer-text,' +
        'section[data-framer-name="Hero"] a[href*="contact"]:hover .framer-ef3qfq p,' +
        'section[data-framer-name="Hero"] a[href*="contact"].hover .framer-ef3qfq p{' +
        '  color:#0f172a!important;--framer-text-color:#0f172a!important;font-weight:600!important;' +
        '}' +
        /* Clean arrow button circle */
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-smbc9u{' +
        '  background-color:#ffffff!important;border-radius:100px!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-14ph69k img{' +
        '  display:block!important;width:100%!important;height:100%!important;' +
        '  filter:brightness(0)!important;' +
        '}' +
        /* Secondary CTA ("Explore Services") Styling */
        'section[data-framer-name="Hero"] a[href*="services"], section[data-framer-name="Hero"] a[href*="integration"]{' +
        '  background:#ffffff!important;border:1px solid #ffffff!important;' +
        '  box-shadow:0 4px 18px rgba(0,0,0,0.25)!important;border-radius:100px!important;transition:all 0.25s ease!important;' +
        '  color:#0f172a!important;text-decoration:none!important;width:auto!important;min-width:152px!important;padding:0 26px!important;height:48px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="services"]:hover, section[data-framer-name="Hero"] a[href*="integration"]:hover{' +
        '  background:#f8fafc!important;transform:translateY(-2px)!important;box-shadow:0 8px 24px rgba(0,0,0,0.3)!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="services"] *, section[data-framer-name="Hero"] a[href*="integration"] *{' +
        '  color:#0f172a!important;font-weight:600!important;text-shadow:none!important;text-decoration:none!important;white-space:nowrap!important;' +
        '}' +
        /* Tabbed Browser Mockup Container & Light Frosted Glass 3D Card */
        '.framer-1ib2jhf{' +
        '  display:block!important;position:absolute!important;top:650px!important;left:50%!important;' +
        '  transform:translateX(-50%)!important;opacity:1!important;visibility:visible!important;' +
        '  width:75%!important;max-width:1280px!important;aspect-ratio:1.4382 / 1!important;z-index:2!important;' +
        '  border-radius:20px!important;overflow:visible!important;' +
        '  transform-style:preserve-3d!important;will-change:transform!important;' +
        '}' +
        '@media (max-width: 1199px) {' +
        '  .framer-1ib2jhf{width:88%!important;top:640px!important;}' +
        '}' +
        '@media (max-width: 809px) {' +
        '  .framer-1ib2jhf{width:94%!important;top:690px!important;}' +
        '}' +
        '@media (max-width: 640px) {' +
        '  section[data-framer-name="Hero"] .demaze-hero-desc{margin:10px auto 0!important;}' +
        '  section[data-framer-name="Hero"] .demaze-hero-desc p{font-size:14.5px!important;line-height:1.5!important;}' +
        '  section[data-framer-name="Hero"] [data-framer-name="Call to Action"], section[data-framer-name="Hero"] [data-framer-name="CTA Buttons"]{margin-top:16px!important;gap:12px!important;}' +
        '}' +
        '.demaze-browser-card{' +
        '  width:100%;height:100%;border-radius:20px;' +
        '  background:rgba(255, 255, 255, 0.70);' +
        '  border:1px solid rgba(255, 255, 255, 0.75);' +
        '  box-shadow:0 30px 80px -20px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.9);' +
        '  overflow:hidden;position:relative;display:flex;flex-direction:column;' +
        '}' +
        '.demaze-browser-bar{' +
        '  height:38px;background:rgba(255, 255, 255, 0.85);' +
        '  border-bottom:1px solid rgba(255, 255, 255, 0.45);' +
        '  display:flex;align-items:center;justify-content:space-between;' +
        '  padding:0 16px;user-select:none;z-index:4;' +
        '}' +
        '.demaze-window-dots{display:flex;gap:7px;align-items:center;}' +
        '.demaze-window-dots .dot{width:9px;height:9px;border-radius:50%;display:inline-block;}' +
        '.demaze-window-dots .dot.close{background:#ef4444;box-shadow:0 0 6px rgba(239,68,68,0.4);}' +
        '.demaze-window-dots .dot.min{background:#f59e0b;box-shadow:0 0 6px rgba(245,158,11,0.4);}' +
        '.demaze-window-dots .dot.expand{background:#10b981;box-shadow:0 0 6px rgba(16,185,129,0.4);}' +
        '.demaze-browser-tab{' +
        '  background:rgba(255, 255, 255, 0.90);border:1px solid rgba(255, 255, 255, 0.95);' +
        '  box-shadow:0 2px 8px rgba(0, 0, 0, 0.04);' +
        '  border-radius:8px;padding:3px 12px;display:flex;align-items:center;gap:8px;' +
        '  color:#0f172a;font-size:12px;' +
        '}' +
        '.demaze-tab-url{font-weight:600;letter-spacing:0.01em;color:#0f172a;}' +
        '.demaze-tab-badge{' +
        '  background:rgba(37, 99, 235, 0.10);color:#2563eb;font-size:10.5px;' +
        '  padding:1.5px 7px;border-radius:6px;font-weight:600;border:1px solid rgba(37, 99, 235, 0.22);' +
        '}' +
        '.demaze-browser-actions{display:flex;align-items:center;gap:7px;}' +
        '.demaze-live-pulse{' +
        '  width:7px;height:7px;border-radius:50%;background:#10b981;' +
        '  box-shadow:0 0 8px #10b981;animation:demazePulse 2s ease-in-out infinite;' +
        '}' +
        '.demaze-live-text{font-size:11px;color:#475569;font-weight:600;}' +
        '@keyframes demazePulse{0%,100%{opacity:0.6;transform:scale(0.9);}50%{opacity:1;transform:scale(1.15);box-shadow:0 0 12px #10b981;}}' +
        '.demaze-sphere-stage{' +
        '  flex:1;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;' +
        '  background-image:radial-gradient(circle at 50% 45%, rgba(15, 23, 42, 0.55) 0%, rgba(10, 15, 30, 0.85) 100%), url("./assets/demaze/hero-alpine-bg.jpg");' +
        '  background-size:cover;background-position:center bottom;background-repeat:no-repeat;' +
        '}' +
        '.demaze-sphere-stage::before{' +
        '  content:"";position:absolute;inset:0;' +
        '  background:radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.12) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 75%);' +
        '  pointer-events:none;z-index:1;' +
        '}' +
        '#hero-sphere-container{' +
        '  position:absolute;inset:0;width:100%;height:100%;' +
        '  pointer-events:auto;cursor:grab;user-select:none;z-index:2;' +
        '}' +
        '#hero-sphere-container canvas{' +
        '  position:absolute;top:0;left:0;width:100%!important;height:100%!important;display:block;' +
        '}' +
        '.demaze-telemetry-card{' +
        '  position:absolute;z-index:5;' +
        '  background:rgba(255, 255, 255, 0.90);' +
        '  border:1px solid rgba(255, 255, 255, 0.95);border-radius:12px;padding:10px 14px;' +
        '  box-shadow:0 12px 32px rgba(0, 0, 0, 0.16);pointer-events:auto;' +
        '  transition:transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;' +
        '}' +
        '.demaze-telemetry-card:hover{transform:translateY(-3px);border-color:rgba(37, 99, 235, 0.3);box-shadow:0 14px 32px rgba(0,0,0,0.12);}' +
        '.demaze-telemetry-left{top:16px;left:20px;max-width:220px;}' +
        '.demaze-telemetry-right{bottom:16px;right:20px;max-width:230px;}' +
        '.demaze-telemetry-hdr{' +
        '  display:flex;align-items:center;gap:6px;font-size:10px;font-weight:700;' +
        '  letter-spacing:0.08em;color:#64748b;margin-bottom:2px;' +
        '}' +
        '.demaze-pill-dot{width:6px;height:6px;border-radius:50%;}' +
        '.demaze-pill-dot.green{background:#10b981;box-shadow:0 0 6px #10b981;}' +
        '.demaze-pill-dot.cyan{background:#0284c7;box-shadow:0 0 6px #0284c7;}' +
        '.demaze-telemetry-metric{' +
        '  font-size:17px;font-weight:700;color:#0f172a;' +
        '  font-family:"Stack Sans Headline", -apple-system, sans-serif;line-height:1.2;' +
        '}' +
        '.demaze-telemetry-sub{font-size:10.5px;color:#64748b;margin-top:2px;line-height:1.3;}' +
        '@media (max-width: 640px){' +
        '  .demaze-telemetry-card{display:none;}' +
        '  .demaze-browser-actions, .demaze-tab-badge{display:none!important;}' +
        '  .demaze-browser-bar{padding:0 12px!important;height:36px!important;}' +
        '  .demaze-browser-tab{padding:3px 10px!important;font-size:11.5px!important;}' +
        '  .demaze-window-dots{gap:5px!important;}' +
        '  .demaze-window-dots .dot{width:8px!important;height:8px!important;}' +
        '}';
      document.head.appendChild(hStyle);
    }
  }

  function verifyStuck(hero) {
    var h1 = hero.querySelector('h1');
    var headlineOk = !!(h1 && h1.textContent.trim() === content.headline);
    var badgeOk = Array.prototype.every.call(
      hero.querySelectorAll('[data-framer-name="Tag"] [data-framer-name="Badge Text"] p'),
      function (p) {
        return p.closest('.framer-zeccam') || p.textContent.trim() === content.badge;
      }
    );
    var bgImg = hero.querySelector('.framer-1tc22uo img');
    var bgImgOk = !!(bgImg && !bgImg.src.includes('cbqUucc') && bgImg.src.includes('hero-alpine-bg.jpg'));
    return headlineOk && badgeOk && bgImgOk;
  }

  window.DemazeOverride.run({
    getRoot: getHero,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
