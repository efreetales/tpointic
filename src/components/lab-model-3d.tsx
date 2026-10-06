"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Alvo = { boca: number; bocejo: number; olho: number; bracos: number };

// Ângulo do braço abaixado, igual ao do jogo (negativo desce).
const BRACO_BAIXO = -1.2;

const BOTOES = [
  { id: "boca", label: "Abrir a boca" },
  { id: "bocejo", label: "Bocejar" },
  { id: "olho", label: "Fechar os olhos" },
  { id: "tpose", label: "T-pose" },
] as const;
type BotaoId = (typeof BOTOES)[number]["id"];

// Visualizador do modelo 3D da Cacá (o experimento que não foi pro jogo):
// arraste para girar em qualquer ângulo; os botões mexem na boca, nos olhos e
// nos braços. Só baixa o three.js e o modelo (2,2 MB) quando chega perto da
// tela, pra não pesar a página inteira.
export function LabModel3D({ src, poster }: { src: string; poster: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const alvo = useRef<Alvo>({ boca: 0, bocejo: 0, olho: 0, bracos: 1 });
  const [estado, setEstado] = useState<
    "espera" | "carregando" | "pronto" | "erro"
  >("espera");
  const [ligados, setLigados] = useState<Record<BotaoId, boolean>>({
    boca: false,
    bocejo: false,
    olho: false,
    tpose: false,
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let parar = () => {};
    let cancelado = false;

    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        setEstado("carregando");
        iniciar(host)
          .then((fim) => {
            if (cancelado) fim();
            else {
              parar = fim;
              setEstado("pronto");
            }
          })
          .catch(() => setEstado("erro"));
      },
      { rootMargin: "300px" },
    );
    io.observe(host);

    async function iniciar(el: HTMLDivElement) {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
      const { OrbitControls } =
        await import("three/addons/controls/OrbitControls.js");

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.className =
        "absolute inset-0 h-full w-full touch-pan-y";
      el.appendChild(renderer.domElement);

      const cena = new THREE.Scene();
      const ceu = new THREE.HemisphereLight(0xffffff, 0x9a8a70, 1.4);
      const sol = new THREE.DirectionalLight(0xffffff, 2.2);
      sol.position.set(-1.2, 2.2, 2.4);
      cena.add(ceu, sol);

      const cam = new THREE.PerspectiveCamera(28, 1, 0.1, 20);
      cam.position.set(0, 0.6, 3.1);
      const controles = new OrbitControls(cam, renderer.domElement);
      controles.target.set(0, 0.5, 0);
      controles.enablePan = false;
      controles.enableZoom = false; // não rouba a rolagem da página
      controles.enableDamping = true;
      controles.autoRotate = true;
      controles.autoRotateSpeed = 1.6;
      controles.addEventListener("start", () => (controles.autoRotate = false));

      const g = await new GLTFLoader().loadAsync(src);
      const raiz = g.scene;
      cena.add(raiz);
      const ossos: Record<string, import("three").Bone> = {};
      const bocas: import("three").Mesh[] = [];
      raiz.traverse((o) => {
        const b = o as import("three").Bone;
        if (b.isBone) ossos[o.name.replace("mixamorig", "")] = b;
        const m = o as import("three").Mesh;
        if (m.isMesh) {
          m.frustumCulled = false;
          if (m.morphTargetDictionary) bocas.push(m);
        }
      });
      const palp = ["palpebra_E", "palpebra_D"]
        .map((n) => raiz.getObjectByName(n))
        .filter((o): o is import("three").Object3D => !!o);
      const descanso: Record<string, import("three").Quaternion> = {};
      for (const [n, b] of Object.entries(ossos))
        descanso[n] = b.quaternion.clone();

      const eul = new THREE.Euler();
      const q = new THREE.Quaternion();
      const gira = (nome: string, x: number) => {
        const b = ossos[nome];
        if (!b) return;
        eul.set(x, 0, 0);
        q.setFromEuler(eul);
        b.quaternion.copy(descanso[nome]).multiply(q);
      };

      const s: Alvo = { boca: 0, bocejo: 0, olho: 0, bracos: 1 };
      const suaviza = (a: number, b: number, dt: number, r: number) =>
        a + (b - a) * (1 - Math.exp(-dt * r));

      let visivel = true;
      const io2 = new IntersectionObserver(
        (es) => (visivel = es[0].isIntersecting),
      );
      io2.observe(el);

      const ajusta = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        renderer.setSize(w, h, false);
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(ajusta);
      ro.observe(el);
      ajusta();

      let raf = 0;
      let ultimo = performance.now() / 1000;
      const quadro = () => {
        raf = requestAnimationFrame(quadro);
        if (!visivel || document.hidden) return;
        const agora = performance.now() / 1000;
        const dt = Math.min(0.05, agora - ultimo);
        ultimo = agora;
        const a = alvo.current;
        s.boca = suaviza(s.boca, a.boca, dt, 14);
        s.bocejo = suaviza(s.bocejo, a.bocejo, dt, 5);
        s.olho = suaviza(s.olho, a.olho, dt, 10);
        s.bracos = suaviza(s.bracos, a.bracos, dt, 5);

        gira("Spine1", Math.sin(agora * 2.2) * 0.02);
        gira("LeftArm", BRACO_BAIXO * s.bracos);
        gira("RightArm", -BRACO_BAIXO * s.bracos);
        for (const m of bocas) {
          const d = m.morphTargetDictionary!;
          const inf = m.morphTargetInfluences!;
          if (d.boca_aberta !== undefined) inf[d.boca_aberta] = s.boca;
          if (d.bocejo !== undefined) inf[d.bocejo] = s.bocejo;
        }
        for (const p of palp) {
          p.rotation.x = THREE.MathUtils.degToRad(90 - 150 * s.olho);
          p.visible = s.olho > 0.02;
        }
        controles.update();
        renderer.render(cena, cam);
      };
      quadro();

      return () => {
        cancelAnimationFrame(raf);
        io2.disconnect();
        ro.disconnect();
        controles.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    return () => {
      cancelado = true;
      io.disconnect();
      parar();
    };
  }, [src]);

  const alterna = (id: BotaoId) => {
    const novo = { ...ligados, [id]: !ligados[id] };
    // Bocejar e abrir a boca são excludentes (bocejo é a boca bem aberta).
    if (id === "bocejo" && novo.bocejo) novo.boca = false;
    if (id === "boca" && novo.boca) novo.bocejo = false;
    setLigados(novo);
    alvo.current = {
      boca: novo.boca ? 1 : 0,
      bocejo: novo.bocejo ? 1 : 0,
      olho: novo.olho || novo.bocejo ? (novo.bocejo ? 0.9 : 1) : 0,
      bracos: novo.tpose ? 0 : 1,
    };
  };

  return (
    <div>
      <div
        ref={hostRef}
        className="relative h-[380px] w-full cursor-grab overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-[#cdeaf3] to-[#9fd3e3] active:cursor-grabbing sm:h-[460px]"
      >
        {estado !== "pronto" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Image
              src={poster}
              alt=""
              width={300}
              height={300}
              className="h-56 w-auto opacity-80"
            />
            <p className="text-sm font-bold text-[#1c2b3a]">
              {estado === "erro"
                ? "Não deu pra abrir o 3D neste aparelho."
                : "Carregando o modelo 3D…"}
            </p>
          </div>
        )}
        {estado === "pronto" && (
          <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white">
            Arraste para girar
          </p>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {BOTOES.map((b) => (
          <button
            key={b.id}
            type="button"
            aria-pressed={ligados[b.id]}
            disabled={estado !== "pronto"}
            onClick={() => alterna(b.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition-colors disabled:opacity-40 ${
              ligados[b.id]
                ? "border-[#f472b6] bg-[#f472b6] text-black"
                : "border-border text-navy hover:border-[#f472b6]"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
