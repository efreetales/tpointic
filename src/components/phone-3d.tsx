"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type Screen = { src: string };

const PHONE_MODEL_URL =
  "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/phone-model-3.glb";

export function Phone3D({
  screens,
  interval = 2600,
}: {
  screens: Screen[];
  interval?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || screens.length === 0) return;

    let destroyed = false;
    let raf = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const phone = new THREE.Group();
    scene.add(phone);

    // Screen material — applied directly onto the model's own "chroma" (pure
    // green) mesh below. That mesh's geometry is the real screen cutout
    // shape (it already excludes the notch), so texturing it in place —
    // instead of overlaying a separate rectangular plane sized from its
    // bounding box — is what actually respects the notch cutout; a bounding
    // box is just a rectangle and would paper right over it.
    //
    // Custom shader (not MeshBasicMaterial) so screens can slide past each
    // other like a filmstrip instead of hard-cutting or fading. A custom
    // ShaderMaterial does NOT get the automatic sRGB re-encode that built-in
    // materials get from `<colorspace_fragment>` — that chunk only exists in
    // three's own ShaderLib, `renderer.outputColorSpace` does not apply as a
    // blanket post-process. An earlier version of this shader manually
    // decoded sRGB->linear (assuming the renderer would re-encode on output,
    // which it doesn't for a raw ShaderMaterial) and that half-a-roundtrip
    // made the image darker/higher-contrast. Simplest correct fix: do no
    // color math at all — texture.colorSpace is left at the default
    // (un-set), so texture2D() already returns the raw sRGB bytes verbatim,
    // and passing them straight to gl_FragColor reproduces the source image
    // exactly, same as an <img> tag would.
    const screenMat = new THREE.ShaderMaterial({
      uniforms: {
        uCurrent: { value: null as THREE.Texture | null },
        uNext: { value: null as THREE.Texture | null },
        uProgress: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uCurrent;
        uniform sampler2D uNext;
        uniform float uProgress;
        varying vec2 vUv;

        void main() {
          float threshold = 1.0 - uProgress;
          if (vUv.x < threshold) {
            gl_FragColor = texture2D(uCurrent, vUv + vec2(uProgress, 0.0));
          } else {
            gl_FragColor = texture2D(uNext, vUv + vec2(uProgress - 1.0, 0.0));
          }
        }
      `,
    });

    // Body — a simple modeled phone (chroma-key screen marker + camera).
    const gltfLoader = new GLTFLoader();
    let bodyRoot: THREE.Object3D | null = null;
    gltfLoader.load(PHONE_MODEL_URL, (gltf) => {
      if (destroyed) return;
      const model = gltf.scene;
      model.updateMatrixWorld(true);

      let chromaMesh: THREE.Mesh | null = null;
      model.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (m?.name === "chroma") {
              chromaMesh = obj;
              obj.material = screenMat;

              // This mesh's exported UVs aren't a clean planar unwrap (the
              // screenshot renders warped/fanned). Its geometry is flat in
              // local space though (confirmed: one axis is constant across
              // every vertex), so replace the UVs with a straightforward
              // planar projection onto its own two non-degenerate axes —
              // keeps the real notch-shaped outline, fixes the mapping.
              const posAttr = obj.geometry.attributes.position as THREE.BufferAttribute;
              const localMin = new THREE.Vector3(Infinity, Infinity, Infinity);
              const localMax = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
              for (let i = 0; i < posAttr.count; i++) {
                const v = new THREE.Vector3().fromBufferAttribute(posAttr, i);
                localMin.min(v);
                localMax.max(v);
              }
              const range = localMax.clone().sub(localMin);
              const axes = (["x", "y", "z"] as const).filter((a) => range[a] > 1e-6);
              const uAxis = axes[0];
              const vAxis = axes[1];
              const uv = new Float32Array(posAttr.count * 2);
              for (let i = 0; i < posAttr.count; i++) {
                const v = new THREE.Vector3().fromBufferAttribute(posAttr, i);
                uv[i * 2] = (v[uAxis] - localMin[uAxis]) / range[uAxis];
                uv[i * 2 + 1] = (v[vAxis] - localMin[vAxis]) / range[vAxis];
              }
              obj.geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
            }
          });
        }
      });

      // This model is already axis-aligned (no baked "hero angle" tilt), so
      // a simple thin-axis swap is enough to bring the screen-facing side to
      // Z — no PCA needed here.
      const rawBox = new THREE.Box3().setFromObject(model);
      const rawSize = rawBox.getSize(new THREE.Vector3());
      const rawCenter = rawBox.getCenter(new THREE.Vector3());
      model.position.sub(rawCenter);

      const dims: Array<{ axis: "x" | "y" | "z"; value: number }> = [
        { axis: "x", value: rawSize.x },
        { axis: "y", value: rawSize.y },
        { axis: "z", value: rawSize.z },
      ];
      const thinAxis = dims.reduce((a, b) => (a.value < b.value ? a : b)).axis;

      // Which side of the thin axis the chroma marker sits on (in the
      // model's own local space, after the -rawCenter shift above) — used
      // below to make sure the rotated screen ends up facing +Z (the
      // camera), not away from it.
      let chromaSign = 1;
      if (chromaMesh) {
        const posAttr = (chromaMesh as THREE.Mesh).geometry.attributes.position as THREE.BufferAttribute;
        const p = new THREE.Vector3().fromBufferAttribute(posAttr, 0).applyMatrix4((chromaMesh as THREE.Mesh).matrixWorld);
        chromaSign = Math.sign(p[thinAxis]) || 1;
      }

      const wrapper = new THREE.Group();
      wrapper.add(model);
      const localAxis =
        thinAxis === "x" ? new THREE.Vector3(1, 0, 0) : thinAxis === "y" ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, 0, 1);
      if (thinAxis === "x") wrapper.rotation.y = Math.PI / 2;
      if (thinAxis === "y") wrapper.rotation.x = Math.PI / 2;
      const rotatedNormal = localAxis.clone().applyEuler(wrapper.rotation).multiplyScalar(chromaSign);
      if (rotatedNormal.z < 0) {
        if (thinAxis === "x") wrapper.rotation.y = -Math.PI / 2;
        if (thinAxis === "y") wrapper.rotation.x = -Math.PI / 2;
        if (thinAxis === "z") wrapper.rotation.y = Math.PI;
      }

      const box = new THREE.Box3().setFromObject(wrapper);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      wrapper.position.sub(center);

      // Fit the body to the camera's visible frustum at this FOV/distance
      // (~2.07 x 4.49 world units), leaving margin on every side. A geometry
      // that fills or exceeds the frustum gets clipped at the viewport edge —
      // check the background gradient is visible in all 4 corners to confirm.
      const frustumHeight = 2 * 9 * Math.tan((28 * Math.PI) / 180 / 2);
      const targetHeight = frustumHeight * 0.9;
      const scaleFactor = targetHeight / size.y;

      const bodyGroup = new THREE.Group();
      bodyGroup.add(wrapper);
      bodyGroup.scale.setScalar(scaleFactor);
      phone.add(bodyGroup);
      bodyRoot = bodyGroup;
    });

    // Lights
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(3, 4, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x66fcf1, 0.5);
    rim.position.set(-4, -2, 3);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    // Textures — colorSpace intentionally left at the default (raw bytes);
    // the shader above decodes sRGB manually.
    const loader = new THREE.TextureLoader();
    const textures: (THREE.Texture | undefined)[] = new Array(screens.length);
    screens.forEach((s, i) => {
      loader.load(s.src, (tex) => {
        textures[i] = tex;
        if (i === 0 && !screenMat.uniforms.uCurrent.value) {
          screenMat.uniforms.uCurrent.value = tex;
        }
      });
    });

    // Mouse parallax
    let tX = 0,
      tY = 0,
      cX = 0,
      cY = 0;
    const onMove = (e: MouseEvent) => {
      // Relative to this component's own box, clamped — so rotation stays
      // gentle even when the cursor is far away, instead of tracking the
      // whole window (which produced large, jarring sustained tilts).
      const rect = container!.getBoundingClientRect();
      const rx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const ry = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      tX = Math.max(-1, Math.min(1, rx * 2));
      tY = Math.max(-1, Math.min(1, -ry * 2));
    };
    window.addEventListener("mousemove", onMove);

    // Resize
    function resize() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // Screen cycling — slides the next screenshot in over the current one
    // (like a filmstrip), matching the slide transition used elsewhere on
    // this page instead of a fade.
    const SLIDE_DURATION = 550;
    let current = 0;
    let lastSwitch = performance.now();
    let sliding = false;
    let slideStart = 0;
    const clock = new THREE.Clock();

    function animate() {
      if (destroyed) return;
      raf = requestAnimationFrame(animate);

      cX += (tX - cX) * 0.06;
      cY += (tY - cY) * 0.06;

      const t = clock.getElapsedTime();
      // Idle sway + a slow vertical bob so the phone reads as "alive" even
      // with the cursor away — the earlier tiny-amplitude version was easy
      // to mistake for a static image.
      phone.rotation.y = Math.sin(t * 0.35) * 0.09 + cX * 0.09;
      phone.rotation.x = Math.cos(t * 0.28) * 0.035 - cY * 0.06;
      phone.position.y = Math.sin(t * 0.5) * 0.12;

      const now = performance.now();
      const readyCount = textures.filter(Boolean).length;

      if (!sliding && readyCount > 1 && now - lastSwitch > interval) {
        const nextIndex = (current + 1) % screens.length;
        const next = textures[nextIndex];
        if (next) {
          screenMat.uniforms.uNext.value = next;
          sliding = true;
          slideStart = now;
        }
      }

      if (sliding) {
        const p = Math.min(1, (now - slideStart) / SLIDE_DURATION);
        // easeInOutCubic
        const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        screenMat.uniforms.uProgress.value = eased;
        if (p >= 1) {
          current = (current + 1) % screens.length;
          screenMat.uniforms.uCurrent.value = screenMat.uniforms.uNext.value;
          screenMat.uniforms.uProgress.value = 0;
          sliding = false;
          lastSwitch = now;
        }
      }

      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(animate);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
      if (bodyRoot) {
        bodyRoot.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((m) => m.dispose());
          }
        });
      } else {
        screenMat.dispose();
      }
      textures.forEach((tex) => tex?.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [screens, interval]);

  return (
    <div
      ref={containerRef}
      className="mx-auto aspect-[9/19.5] w-full max-w-[300px]"
    />
  );
}
