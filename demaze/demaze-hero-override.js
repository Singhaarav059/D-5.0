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
      var colorA = new THREE.Color(0x7dd3fc);
      var colorB = new THREE.Color(0x2563eb);

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
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      var synapseMesh = new THREE.LineSegments(synapseGeo, synapseMat);
      group.add(synapseMesh);

      // Core glow
      var coreGlowGeo = new THREE.SphereGeometry(sphereRadius * 0.22, 16, 16);
      var coreGlowMat = new THREE.MeshBasicMaterial({
        color: 0x2563eb,
        transparent: true,
        opacity: 0.16,
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
        color: 0x60a5fa,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.7
      });
      var ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      ring1.rotation.x = Math.PI * 0.38;
      ring1.rotation.y = Math.PI * 0.12;
      orbitGroup.add(ring1);

      var ringGeo2 = new THREE.TorusGeometry(sphereRadius * 1.14, 0.0018, 16, 80);
      var ringMat2 = new THREE.MeshBasicMaterial({
        color: 0x93c5fd,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.6
      });
      var ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      ring2.rotation.x = -Math.PI * 0.32;
      ring2.rotation.z = Math.PI * 0.36;
      orbitGroup.add(ring2);

      // Orbiting satellites
      var satelliteOrbs = [
        {
          mesh: new THREE.Mesh(new THREE.SphereGeometry(0.016, 18, 18), new THREE.MeshBasicMaterial({ color: 0x2563eb })),
          radius: sphereRadius * 1.08,
          inclination: Math.PI * 0.38,
          yaw: Math.PI * 0.12,
          speed: 0.0016,
          offset: 0
        },
        {
          mesh: new THREE.Mesh(new THREE.SphereGeometry(0.013, 18, 18), new THREE.MeshBasicMaterial({ color: 0x60a5fa })),
          radius: sphereRadius * 1.08,
          inclination: Math.PI * 0.38,
          yaw: Math.PI * 0.12,
          speed: 0.0016,
          offset: Math.PI * 0.85
        },
        {
          mesh: new THREE.Mesh(new THREE.SphereGeometry(0.014, 18, 18), new THREE.MeshBasicMaterial({ color: 0x1d4ed8 })),
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
      var boxW = activeContainer.clientWidth || 980;
      var boxH = activeContainer.clientHeight || 560;

      var camera = new THREE.PerspectiveCamera(45, boxW / boxH, 0.1, 1000);
      var targetZ = boxW < 600 ? 2.35 : (boxW < 900 ? 2.15 : 1.95);
      camera.position.z = targetZ;

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
      window.addEventListener('scroll', function () {
        isPageScrolling = true;
        clearTimeout(scrollReleaseTimer);
        scrollReleaseTimer = setTimeout(function () {
          isPageScrolling = false;
        }, 100);
      }, { passive: true });

      function animate(now) {
        if (!isSphereVisible) {
          sphereAnimId = null;
          return;
        }

        // During active page scrolling, pause sphere updates to dedicate 100% frame budget to silky-smooth Lenis scrolling
        if (isPageScrolling) {
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

      // Reduced motion: one static frame, no loop, no interaction physics.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        renderer.render(scene, camera);
        return;
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
        }, { rootMargin: '0px' });
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
        var rz = cw < 600 ? 2.35 : (cw < 900 ? 2.15 : 1.95);
        camera.position.z = rz;
        camera.updateProjectionMatrix();
        renderer.setSize(cw, ch);
      });
      resizeObserver.observe(activeContainer);
    }).catch(function (err) {
      console.error('Failed to load Three.js for hero sphere:', err);
    });
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
    var headlineWrapper = hero.querySelector('[data-framer-name="Headline"]');
    var h1 = hero.querySelector('h1');
    if (h1) {
      if (!h1.textContent.includes('Scalable AI Products')) {
        h1.innerHTML = 'Your Strategic Partner in Building <span class="demaze-highlight-gradient">Scalable AI Products</span>';
      }
      if (!h1.__demazeH1Obs) {
        h1.__demazeH1Obs = true;
        var h1Observer = new MutationObserver(function () {
          if (h1 && !h1.textContent.includes('Scalable AI Products')) {
            h1.innerHTML = 'Your Strategic Partner in Building <span class="demaze-highlight-gradient">Scalable AI Products</span>';
          }
        });
        h1Observer.observe(h1, { childList: true, characterData: true, subtree: true });
      }
    }
    if (headlineWrapper && !headlineWrapper.__demazeH1ParentObs) {
      headlineWrapper.__demazeH1ParentObs = true;
      var parentObserver = new MutationObserver(function () {
        var curH1 = headlineWrapper.querySelector('h1');
        if (curH1 && !curH1.textContent.includes('Scalable AI Products')) {
          curH1.innerHTML = 'Your Strategic Partner in Building <span class="demaze-highlight-gradient">Scalable AI Products</span>';
        }
      });
      parentObserver.observe(headlineWrapper, { childList: true });
    }

    // 3. Description (singleton guarantee)
    var headlineWrapper = hero.querySelector('[data-framer-name="Headline"]');
    var existingDescs = hero.querySelectorAll('.demaze-hero-desc');
    if (existingDescs.length > 1) {
      for (var di = 1; di < existingDescs.length; di++) {
        existingDescs[di].remove();
      }
    }
    if (existingDescs.length === 0 && headlineWrapper) {
      var desc = document.createElement('div');
      desc.className = 'demaze-hero-desc';
      var p = document.createElement('p');
      p.className = 'framer-text framer-styles-preset-17kfgzm';
      p.setAttribute('dir', 'auto');
      p.textContent = content.description;
      desc.appendChild(p);
      headlineWrapper.insertAdjacentElement('afterend', desc);
    } else if (existingDescs.length > 0) {
      var existingP = existingDescs[0].querySelector('p');
      if (existingP && existingP.textContent !== content.description) {
        existingP.textContent = content.description;
      }
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
      if (!heroBgImg.src.includes('subpage-clouds-wide.jpg') || heroBgImg.src.includes('cbqUucc')) {
        heroBgImg.src = './assets/demaze/subpage-clouds-wide.jpg';
        heroBgImg.srcset = './assets/demaze/subpage-clouds-wide.jpg 1x';
      }
    }

    // Ensure background image and liquid canvas stay locked post-hydration
    // Ensure background image stays locked post-hydration
    var bgContainer = hero.querySelector('.framer-1tc22uo');
    if (bgContainer && !bgContainer.__demazeEnforced) {
      bgContainer.__demazeEnforced = true;
      var bgObserver = new MutationObserver(function () {
        var img = bgContainer.querySelector('img');
        if (img && (!img.src.includes('subpage-clouds-wide.jpg') || img.src.includes('cbqUucc'))) {
          img.src = './assets/demaze/subpage-clouds-wide.jpg';
          img.srcset = './assets/demaze/subpage-clouds-wide.jpg 1x';
        }
        var oldCanvas = bgContainer.querySelector('.demaze-liquid-canvas');
        if (oldCanvas) oldCanvas.remove();
      });
      bgObserver.observe(bgContainer, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'srcset'] });
    }

    var oldCanvas = hero.querySelector('.demaze-liquid-canvas');
    if (oldCanvas) oldCanvas.remove();

    // 7. Tabbed Browser Mockup Card + 3D Sphere Integration
    var tabCardEl = hero.querySelector('.framer-1ib2jhf, [data-framer-appear-id="1ib2jhf"]');
    if (tabCardEl) {
      tabCardEl.style.setProperty('display', 'block', 'important');
      tabCardEl.style.setProperty('background', 'transparent', 'important');
      tabCardEl.style.setProperty('box-shadow', 'none', 'important');
      tabCardEl.style.setProperty('border', 'none', 'important');

      // Hide old MOVIQ screenshot inside
      var oldImgs = tabCardEl.querySelectorAll('img, picture, [data-framer-background-image-wrapper], [data-framer-name="Screenshot"]');
      oldImgs.forEach(function (img) {
        img.style.setProperty('display', 'none', 'important');
      });

      // Actively purge any legacy telemetry or badge elements
      var strayTele = tabCardEl.querySelectorAll('.demaze-telemetry-card, .demaze-tab-badge, .demaze-browser-actions');
      strayTele.forEach(function (el) { el.remove(); });

      var existingCards = tabCardEl.querySelectorAll('.demaze-browser-card');
      if (existingCards.length > 1) {
        for (var ci = 1; ci < existingCards.length; ci++) {
          existingCards[ci].remove();
        }
      }

      if (existingCards.length === 0) {
        var card = document.createElement('div');
        card.className = 'demaze-browser-card';
        card.innerHTML =
          '<div class="demaze-sphere-stage">' +
          '  <div id="hero-sphere-container"></div>' +
          '</div>';

        tabCardEl.appendChild(card);
      } else {
        var existingCard = existingCards[0];
        var innerTele = existingCard.querySelectorAll('.demaze-telemetry-card, .demaze-tab-badge, .demaze-browser-actions');
        innerTele.forEach(function (el) { el.remove(); });
        if (!existingCard.querySelector('#hero-sphere-container')) {
          var stage = existingCard.querySelector('.demaze-sphere-stage');
          if (!stage) {
            stage = document.createElement('div');
            stage.className = 'demaze-sphere-stage';
            existingCard.appendChild(stage);
          }
          if (!stage.querySelector('#hero-sphere-container')) {
            var sc = document.createElement('div');
            sc.id = 'hero-sphere-container';
            stage.appendChild(sc);
          }
        }
      }
      initHeroSphere(document.getElementById('hero-sphere-container'));
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
    var bgImgOk = !!(bgImg && !bgImg.src.includes('cbqUucc') && (bgImg.src.includes('subpage-clouds-wide') || bgImg.src.includes('hero-alpine-bg')));
    return headlineOk && badgeOk && bgImgOk;
  }

  window.DemazeOverride.run({
    getRoot: getHero,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
