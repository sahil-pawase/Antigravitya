"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function Hero3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Group for mouse interaction
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Core: Inner Icosahedron (Tech Polyhedron)
    const icoGeometry = new THREE.IcosahedronGeometry(4.2, 1);
    const icoWireMaterial = new THREE.MeshBasicMaterial({
      color: 0x41d8ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const icoMesh = new THREE.Mesh(icoGeometry, icoWireMaterial);
    mainGroup.add(icoMesh);

    // Inner Glowing Core Sphere
    const coreGeo = new THREE.SphereGeometry(2.4, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x397cff,
      wireframe: false,
      transparent: true,
      opacity: 0.18,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // 2. Orbiting Torus Rings (Data Rings)
    const ring1Geo = new THREE.TorusGeometry(6.2, 0.04, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x41d8ff,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    mainGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(7.8, 0.03, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x397cff,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    mainGroup.add(ring2);

    // 3. Floating Data Nodes on Rings
    const nodesGroup = new THREE.Group();
    mainGroup.add(nodesGroup);

    const nodeCount = 8;
    const nodeMeshes: THREE.Mesh[] = [];
    const nodeGeo = new THREE.OctahedronGeometry(0.35, 0);

    for (let i = 0; i < nodeCount; i++) {
      const isCyan = i % 2 === 0;
      const nodeMat = new THREE.MeshBasicMaterial({
        color: isCyan ? 0x41d8ff : 0x397cff,
        wireframe: false,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodesGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);
    }

    // 4. Ambient 3D Particle Cloud (Data Constellation)
    const particleCount = 200;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x41d8ff);
    const blueColor = new THREE.Color(0x397cff);

    for (let i = 0; i < particleCount; i++) {
      const radius = 9 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = Math.random() > 0.5 ? cyanColor : blueColor;
      particleColors[i * 3] = mixed.r;
      particleColors[i * 3 + 1] = mixed.g;
      particleColors[i * 3 + 2] = mixed.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particleCloud = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleCloud);

    // Mouse Interaction Variables
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      targetRotationY = ((e.clientX - windowHalfX) / windowHalfX) * 0.45;
      targetRotationX = ((e.clientY - windowHalfY) / windowHalfY) * 0.45;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) / 1000;

      // Smooth mouse damping
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      mainGroup.rotation.x = currentRotationX + Math.sin(elapsedTime * 0.3) * 0.05;
      mainGroup.rotation.y = currentRotationY + elapsedTime * 0.15;

      // Rotate sub-elements independently
      icoMesh.rotation.x = elapsedTime * 0.2;
      icoMesh.rotation.y = elapsedTime * 0.25;

      ring1.rotation.z = elapsedTime * 0.3;
      ring2.rotation.z = -elapsedTime * 0.25;

      // Position orbiting node meshes
      nodeMeshes.forEach((node, idx) => {
        const angle = elapsedTime * 0.5 + (idx * (Math.PI * 2)) / nodeCount;
        const radius = idx % 2 === 0 ? 6.2 : 7.8;
        const targetRing = idx % 2 === 0 ? ring1 : ring2;

        node.position.x = Math.cos(angle) * radius;
        node.position.y = Math.sin(angle) * radius * Math.cos(targetRing.rotation.x);
        node.position.z = Math.sin(angle) * radius * Math.sin(targetRing.rotation.x);
        node.rotation.x += 0.02;
        node.rotation.y += 0.03;
      });

      // Slowly pulse particle cloud
      particleCloud.rotation.y = -elapsedTime * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries and materials
      icoGeometry.dispose();
      icoWireMaterial.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ring1Geo.dispose();
      ringMat1.dispose();
      ring2Geo.dispose();
      ringMat2.dispose();
      nodeGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center"
      aria-hidden="true"
    />
  );
}
