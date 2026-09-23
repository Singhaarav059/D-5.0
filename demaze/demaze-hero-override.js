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
          '  </div>' +
          '</div>' +
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

    // 8. Inject Master Hero Styles
    if (!document.getElementById('demaze-hero-style')) {
      var hStyle = document.createElement('style');
      hStyle.id = 'demaze-hero-style';
      hStyle.textContent =
        /* === P1.5 HERO REFINEMENT MASTER STYLES === */
        'section[data-framer-name="Hero"], .framer-xj5vkr{' +
        '  position:relative!important;overflow:visible!important;' +
        '  height:auto!important;min-height:auto!important;max-height:none!important;aspect-ratio:auto!important;' +
        '  display:flex!important;flex-direction:column!important;align-items:center!important;' +
        '  padding:104px 0 36px!important;margin-bottom:0px!important;box-sizing:border-box!important;' +
        '}' +
        'section[data-framer-name="Badge"]{' +
        '  margin-top:0px!important;position:relative!important;z-index:2!important;' +
        '}' +
        /* Single Full-Bleed Edge-to-Edge Sky Background */
        '.framer-1tc22uo, .framer-1tc22uo *, .framer-ycxj79{' +
        '  border-radius:0!important;padding:0!important;margin:0!important;' +
        '}' +
        '.framer-1tc22uo{' +
        '  position:absolute!important;inset:0!important;top:0!important;left:0!important;right:0!important;bottom:0!important;' +
        '  width:100%!important;max-width:100%!important;height:100%!important;pointer-events:none!important;z-index:0!important;overflow:hidden!important;' +
        '  transform:none!important;' +
        '}' +
        '.framer-1tc22uo [data-framer-background-image-wrapper="true"] {' +
        '  position:absolute!important;inset:0!important;top:0!important;left:0!important;right:0!important;bottom:0!important;' +
        '  width:100%!important;height:100%!important;display:block!important;transform:none!important;' +
        '}' +
        '.framer-1tc22uo [data-framer-background-image-wrapper="true"] > div {' +
        '  position:absolute!important;inset:0!important;top:0!important;left:0!important;right:0!important;bottom:0!important;' +
        '  width:100%!important;height:100%!important;display:block!important;transform:none!important;' +
        '}' +
        '.framer-1tc22uo img{' +
        '  position:absolute!important;top:0!important;left:0!important;' +
        '  display:block!important;width:100%!important;height:100%!important;border-radius:0!important;' +
        '  object-position:center top!important;object-fit:cover!important;transform:none!important;' +
        '}' +
        '.framer-1bdrozj, .framer-ycxj79{' +
        '  position:absolute!important;inset:0!important;top:0!important;left:0!important;' +
        '  width:100%!important;height:100%!important;display:block!important;transform:none!important;' +
        '}' +
        '.demaze-liquid-canvas{display:none!important;}' +
        /* Subtle Scrim for Editorial Typography Contrast */
        '.framer-1tc22uo::after{' +
        '  content:""!important;position:absolute!important;inset:0!important;' +
        '  background:linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.04) 35%, rgba(255,255,255,0.55) 75%, #ffffff 100%)!important;' +
        '  pointer-events:none!important;z-index:1!important;' +
        '}' +
        /* Hero Text Container */
        'section[data-framer-name="Hero"] [data-framer-name="Container"], .framer-384jw6{' +
        '  position:relative!important;z-index:4!important;height:auto!important;min-height:auto!important;' +
        '  padding:0 24px!important;max-width:980px!important;width:100%!important;' +
        '  display:flex!important;flex-direction:column!important;align-items:center!important;' +
        '  text-align:center!important;gap:0!important;box-sizing:border-box!important;transform:none!important;' +
        '  margin:0 auto 36px!important;' +
        '}' +
        '.framer-1l3hmys, section[data-framer-name="Hero"] [data-framer-name="Top"]{' +
        '  display:flex!important;flex-direction:column!important;align-items:center!important;width:100%!important;gap:0!important;' +
        '  transform:none!important;opacity:1!important;visibility:visible!important;' +
        '}' +
        'section[data-framer-name="Hero"] [data-framer-name="Headline"], section[data-framer-name="Hero"] .framer-14qrg1e{' +
        '  display:flex!important;flex-direction:column!important;align-items:center!important;width:100%!important;' +
        '  transform:none!important;opacity:1!important;visibility:visible!important;height:auto!important;' +
        '}' +
        /* Eyebrow Badge Pill */
        'section[data-framer-name="Hero"] [data-framer-name="Tag"], section[data-framer-name="Hero"] .framer-1izpjbo{' +
        '  display:inline-flex!important;align-items:center!important;justify-content:center!important;' +
        '  position:relative!important;z-index:4!important;opacity:1!important;transform:none!important;' +
        '  background:rgba(255, 255, 255, 0.85)!important;border-radius:999px!important;padding:5px 16px!important;' +
        '  border:1px solid rgba(226, 232, 240, 0.9)!important;backdrop-filter:blur(12px)!important;-webkit-backdrop-filter:blur(12px)!important;' +
        '  box-shadow:0 2px 8px rgba(15, 23, 42, 0.04)!important;margin-bottom:14px!important;width:auto!important;max-width:none!important;' +
        '}' +
        'section[data-framer-name="Hero"] [data-framer-name="Tag"] p{' +
        '  font-size:12px!important;font-weight:600!important;letter-spacing:0.05em!important;text-transform:uppercase!important;' +
        '  color:#0f172a!important;margin:0!important;font-family:"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif!important;' +
        '}' +
        /* Headline: Balanced, authoritative ink tone, tight tracking */
        'section[data-framer-name="Hero"] h1{' +
        '  position:relative;z-index:4;text-wrap:balance;opacity:1!important;transform:none!important;' +
        '  font-size:clamp(32px, 3.8vw, 54px)!important;line-height:1.14!important;letter-spacing:-0.035em!important;' +
        '  color:#090d16!important;-webkit-text-fill-color:#090d16!important;text-align:center!important;' +
        '  max-width:900px!important;margin:0 auto!important;font-weight:700!important;' +
        '  font-family:"Stack Sans Headline", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif!important;' +
        '  text-shadow:0 1px 2px rgba(255,255,255,0.7)!important;' +
        '}' +
        /* Dignified brand accent on Scalable AI Products */
        'section[data-framer-name="Hero"] h1 .demaze-highlight-gradient{' +
        '  background:linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)!important;' +
        '  -webkit-background-clip:text!important;-webkit-text-fill-color:transparent!important;' +
        '  filter:none!important;text-shadow:none!important;font-weight:700!important;' +
        '}' +
        /* Supporting Copy: Unboxed, natural editorial typography */
        'section[data-framer-name="Hero"] .demaze-hero-desc{' +
        '  position:relative;z-index:4;max-width:650px!important;margin:16px auto 0!important;text-align:center!important;' +
        '  opacity:1!important;transform:none!important;' +
        '  background:transparent!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;' +
        '  border:none!important;box-shadow:none!important;padding:0!important;' +
        '}' +
        'section[data-framer-name="Hero"] .demaze-hero-desc p{' +
        '  text-align:center!important;font-size:clamp(15px, 1.2vw, 17px)!important;line-height:1.6!important;' +
        '  color:#334155!important;-webkit-text-fill-color:#334155!important;font-weight:450!important;' +
        '  letter-spacing:-0.01em!important;text-wrap:pretty!important;margin:0!important;' +
        '  font-family:"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif!important;' +
        '}' +
        /* Action Buttons: Clean row layout with generous tap targets */
        'section[data-framer-name="Hero"] [data-framer-name="Call to Action"], section[data-framer-name="Hero"] [data-framer-name="CTA Buttons"], .framer-1ykg4pj{' +
        '  display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;' +
        '  position:relative;z-index:4;gap:14px!important;margin-top:20px!important;opacity:1!important;transform:none!important;' +
        '}' +
        /* Primary CTA ("Let's Connect") */
        'section[data-framer-name="Hero"] a[href*="contact"]{' +
        '  width:auto!important;min-width:160px!important;height:48px!important;' +
        '  background:#090d16!important;' +
        '  border:1px solid rgba(255, 255, 255, 0.15)!important;border-radius:999px!important;' +
        '  box-shadow:0 4px 16px rgba(9, 13, 22, 0.25)!important;text-decoration:none!important;' +
        '  transition:all 0.25s cubic-bezier(.16,1,.3,1)!important;' +
        '  overflow:hidden!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="contact"]:hover, section[data-framer-name="Hero"] a[href*="contact"].hover{' +
        '  border-color:rgba(255, 255, 255, 0.35)!important;' +
        '  transform:translateY(-2px)!important;box-shadow:0 8px 24px rgba(9, 13, 22, 0.35)!important;' +
        '  background:#020617!important;' +
        '}' +
        /* Primary button text color */
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-1s9c08m p,' +
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-1s9c08m span,' +
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-1s9c08m .framer-text,' +
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-ef3qfq p,' +
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-ef3qfq span,' +
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-ef3qfq .framer-text{' +
        '  color:#ffffff!important;--framer-text-color:#ffffff!important;font-weight:500!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="contact"]:hover .framer-ef3qfq p,' +
        'section[data-framer-name="Hero"] a[href*="contact"]:hover .framer-ef3qfq span,' +
        'section[data-framer-name="Hero"] a[href*="contact"]:hover .framer-ef3qfq .framer-text,' +
        'section[data-framer-name="Hero"] a[href*="contact"].hover .framer-ef3qfq p,' +
        'section[data-framer-name="Hero"] a[href*="contact"].hover .framer-ef3qfq span,' +
        'section[data-framer-name="Hero"] a[href*="contact"].hover .framer-ef3qfq .framer-text{' +
        '  color:#0f172a!important;--framer-text-color:#0f172a!important;font-weight:600!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-smbc9u{' +
        '  background-color:#ffffff!important;border-radius:100px!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-14ph69k img{' +
        '  display:block!important;width:100%!important;height:100%!important;' +
        '  filter:brightness(0)!important;' +
        '}' +
        /* Secondary CTA ("Explore Services") */
        'section[data-framer-name="Hero"] a[href*="services"], section[data-framer-name="Hero"] a[href*="integration"]{' +
        '  background:#ffffff!important;border:1px solid rgba(203, 213, 225, 0.8)!important;' +
        '  box-shadow:0 2px 10px rgba(15, 23, 42, 0.06)!important;border-radius:999px!important;' +
        '  transition:all 0.25s cubic-bezier(.16,1,.3,1)!important;' +
        '  color:#0f172a!important;text-decoration:none!important;width:auto!important;min-width:154px!important;padding:0 24px!important;height:48px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="services"]:hover, section[data-framer-name="Hero"] a[href*="integration"]:hover{' +
        '  background:#f8fafc!important;border-color:rgba(148, 163, 184, 0.9)!important;transform:translateY(-2px)!important;box-shadow:0 6px 18px rgba(15, 23, 42, 0.1)!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="services"] *, section[data-framer-name="Hero"] a[href*="integration"] *{' +
        '  color:#0f172a!important;font-weight:600!important;text-shadow:none!important;text-decoration:none!important;white-space:nowrap!important;' +
        '}' +
        /* In-Flow Browser Mockup Card */
        '.framer-1ib2jhf{' +
        '  position:relative!important;top:auto!important;left:auto!important;transform:none!important;' +
        '  margin:0 auto!important;width:100%!important;max-width:980px!important;aspect-ratio:16 / 9.2!important;' +
        '  z-index:2!important;border-radius:20px!important;overflow:visible!important;' +
        '  transform-style:preserve-3d!important;will-change:transform!important;' +
        '  display:block!important;opacity:1!important;visibility:visible!important;' +
        '  background:transparent!important;box-shadow:none!important;border:none!important;' +
        '  box-sizing:border-box!important;' +
        '}' +
        '.demaze-browser-card{' +
        '  width:100%!important;height:100%!important;border-radius:20px!important;' +
        '  background:rgba(255, 255, 255, 0.50)!important;' +
        '  border:1px solid rgba(255, 255, 255, 0.85)!important;' +
        '  box-shadow:0 20px 50px -12px rgba(15, 23, 42, 0.10), 0 0 0 1px rgba(255, 255, 255, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.95)!important;' +
        '  backdrop-filter:blur(24px) saturate(180%)!important;' +
        '  -webkit-backdrop-filter:blur(24px) saturate(180%)!important;' +
        '  overflow:hidden!important;position:relative!important;display:flex!important;flex-direction:column!important;' +
        '}' +
        '.demaze-browser-bar{' +
        '  height:38px!important;min-height:38px!important;background:rgba(255, 255, 255, 0.70)!important;' +
        '  border-bottom:1px solid rgba(255, 255, 255, 0.55)!important;' +
        '  display:flex!important;align-items:center!important;justify-content:space-between!important;' +
        '  padding:0 16px!important;user-select:none!important;z-index:4!important;' +
        '}' +
        '.demaze-window-dots{display:flex!important;gap:7px!important;align-items:center!important;}' +
        '.demaze-window-dots .dot{width:9px!important;height:9px!important;border-radius:50%!important;display:inline-block!important;}' +
        '.demaze-window-dots .dot.close{background:#ef4444!important;box-shadow:0 0 6px rgba(239,68,68,0.4)!important;}' +
        '.demaze-window-dots .dot.min{background:#f59e0b!important;box-shadow:0 0 6px rgba(245,158,11,0.4)!important;}' +
        '.demaze-window-dots .dot.expand{background:#10b981!important;box-shadow:0 0 6px rgba(16,185,129,0.4)!important;}' +
        '.demaze-browser-tab{' +
        '  background:rgba(255, 255, 255, 0.90)!important;border:1px solid rgba(255, 255, 255, 0.95)!important;' +
        '  box-shadow:0 2px 8px rgba(0, 0, 0, 0.04)!important;' +
        '  border-radius:8px!important;padding:3px 12px!important;display:flex!important;align-items:center!important;gap:8px!important;' +
        '  color:#0f172a!important;font-size:12px!important;' +
        '}' +
        '.demaze-tab-url{font-weight:600!important;letter-spacing:0.01em!important;color:#0f172a!important;}' +
        '.demaze-tab-badge, .demaze-browser-actions, .demaze-telemetry-card{' +
        '  display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;' +
        '}' +
        '.demaze-sphere-stage{' +
        '  flex:1!important;position:relative!important;overflow:hidden!important;display:flex!important;align-items:center!important;justify-content:center!important;' +
        '  background:transparent!important;' +
        '  background-image:radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.10) 0%, rgba(34, 197, 94, 0.04) 40%, transparent 70%)!important;' +
        '}' +
        '#hero-sphere-container{' +
        '  position:absolute!important;inset:0!important;width:100%!important;height:100%!important;' +
        '  pointer-events:auto!important;cursor:grab!important;user-select:none!important;z-index:2!important;' +
        '}' +
        '#hero-sphere-container canvas{' +
        '  position:absolute!important;top:0!important;left:0!important;width:100%!important;height:100%!important;display:block!important;' +
        '}' +
        /* Tablet Breakpoint (max-width: 809px) */
        '@media (max-width: 809px) {' +
        '  section[data-framer-name="Hero"], .framer-xj5vkr{' +
        '    padding:92px 0 32px!important;' +
        '  }' +
        '  section[data-framer-name="Hero"] [data-framer-name="Container"], .framer-384jw6{' +
        '    margin:0 auto 28px!important;' +
        '  }' +
        '  section[data-framer-name="Hero"] h1{' +
        '    font-size:42px!important;line-height:1.15!important;max-width:660px!important;' +
        '  }' +
        '  section[data-framer-name="Hero"] .demaze-hero-desc{' +
        '    max-width:580px!important;margin-top:14px!important;' +
        '  }' +
        '  .framer-1ib2jhf{' +
        '    margin:0 auto!important;max-width:720px!important;aspect-ratio:16 / 10.5!important;padding:0!important;' +
        '  }' +
        '}' +
        /* Mobile Breakpoint (max-width: 600px) */
        '@media (max-width: 600px) {' +
        '  section[data-framer-name="Hero"], .framer-xj5vkr{' +
        '    padding:80px 0 24px!important;' +
        '  }' +
        '  section[data-framer-name="Hero"] [data-framer-name="Container"], .framer-384jw6{' +
        '    margin:0 auto 24px!important;' +
        '  }' +
        '  section[data-framer-name="Hero"] [data-framer-name="Tag"]{' +
        '    margin-bottom:12px!important;padding:5px 14px!important;' +
        '  }' +
        '  section[data-framer-name="Hero"] [data-framer-name="Tag"] p{' +
        '    font-size:11.5px!important;' +
        '  }' +
        '  section[data-framer-name="Hero"] h1{' +
        '    font-size:30px!important;line-height:1.18!important;letter-spacing:-0.025em!important;max-width:340px!important;' +
        '  }' +
        '  section[data-framer-name="Hero"] .demaze-hero-desc{' +
        '    max-width:340px!important;margin-top:12px!important;' +
        '  }' +
        '  section[data-framer-name="Hero"] .demaze-hero-desc p{' +
        '    font-size:14px!important;line-height:1.55!important;' +
        '  }' +
        '  section[data-framer-name="Hero"] [data-framer-name="Call to Action"], section[data-framer-name="Hero"] [data-framer-name="CTA Buttons"], .framer-1ykg4pj{' +
        '    flex-direction:column!important;width:100%!important;gap:10px!important;margin-top:16px!important;' +
        '  }' +
        '  section[data-framer-name="Hero"] a[href*="contact"], section[data-framer-name="Hero"] a[href*="services"]{' +
        '    width:100%!important;max-width:270px!important;height:46px!important;' +
        '  }' +
        '  .framer-1ib2jhf{' +
        '    margin:0 auto!important;aspect-ratio:16 / 12!important;padding:0!important;' +
        '  }' +
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
