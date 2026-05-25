"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HomeVisual() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.appendChild(renderer.domElement);

    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.74, 48, 48),
      new THREE.MeshStandardMaterial({
        color: 0x22d3ee,
        emissive: 0x0e7490,
        roughness: 0.28,
        metalness: 0.2,
      }),
    );
    const leftPaddle = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 2.3, 0.24),
      new THREE.MeshStandardMaterial({ color: 0xfb3fb4, emissive: 0x831843 }),
    );
    const rightPaddle = leftPaddle.clone();
    leftPaddle.position.x = -2;
    rightPaddle.position.x = 2;

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.45, 0.015, 12, 96),
      new THREE.MeshBasicMaterial({ color: 0xa3ff12 }),
    );
    scene.add(ball, leftPaddle, rightPaddle, ring);
    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const light = new THREE.PointLight(0x22d3ee, 12, 8);
    light.position.set(0, 1.8, 2.4);
    scene.add(light);

    let frame = 0;
    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const animate = () => {
      frame = requestAnimationFrame(animate);
      ball.rotation.y += 0.012;
      ball.position.y = Math.sin(Date.now() * 0.002) * 0.2;
      ring.rotation.x += 0.01;
      ring.rotation.y += 0.008;
      leftPaddle.position.y = Math.sin(Date.now() * 0.0018) * 0.48;
      rightPaddle.position.y = Math.cos(Date.now() * 0.0018) * 0.48;
      renderer.render(scene, camera);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      host.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="h-[260px] w-full rounded-xl border border-cyan-300/20 bg-slate-950/45"
    />
  );
}
