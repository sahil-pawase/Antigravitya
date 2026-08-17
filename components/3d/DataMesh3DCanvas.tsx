"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface DataMesh3DCanvasProps {
  className?: string;
  particleCount?: number;
  speed?: number;
}

export function DataMesh3DCanvas({
  className = "w-full h-full absolute inset-0 pointer-events-none opacity-40",
  particleCount = 120,
  speed = 1.0,
}: DataMesh3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 500);
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Wave Grid Points
    const cols = 24;
    const rows = 14;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color1 = new THREE.Color(0x397cff);
    const color2 = new THREE.Color(0x41d8ff);

    let idx = 0;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = (i - cols / 2) * 1.4;
        const z = (j - rows / 2) * 1.4;
        const y = 0;

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        const mixRatio = (i + j) / (cols + rows);
        const c = color1.clone().lerp(color2, mixRatio);
        colors[idx * 3] = c.r;
        colors[idx * 3 + 1] = c.g;
        colors[idx * 3 + 2] = c.b;

        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Connecting line segments across grid for mesh effect
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(count * 6);
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x1e3a5f,
      transparent: true,
      opacity: 0.25,
    });
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);

    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = ((performance.now() - startTime) / 1000) * speed;

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      let pIdx = 0;
      let lIdx = 0;
      const lPos = lineGeo.attributes.position.array as Float32Array;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = (i - cols / 2) * 1.4;
          const z = (j - rows / 2) * 1.4;
          const y = Math.sin(x * 0.4 + time) * Math.cos(z * 0.4 + time * 0.8) * 1.2;

          posArray[pIdx * 3 + 1] = y;

          // Build line connect to neighbor
          if (i < cols - 1 && lIdx + 5 < lPos.length) {
            lPos[lIdx] = x;
            lPos[lIdx + 1] = y;
            lPos[lIdx + 2] = z;

            const nextX = (i + 1 - cols / 2) * 1.4;
            const nextY = Math.sin(nextX * 0.4 + time) * Math.cos(z * 0.4 + time * 0.8) * 1.2;
            lPos[lIdx + 3] = nextX;
            lPos[lIdx + 4] = nextY;
            lPos[lIdx + 5] = z;
            lIdx += 6;
          }

          pIdx++;
        }
      }

      posAttr.needsUpdate = true;
      lineGeo.attributes.position.needsUpdate = true;

      points.rotation.y = time * 0.05;
      lineMesh.rotation.y = time * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
    };
  }, [particleCount, speed]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
