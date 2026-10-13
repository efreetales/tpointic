"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  InfoCircle,
  LockKeyhole,
  QuestionCircle,
  ShieldCheck,
  X,
} from "@mynaui/icons-react";
import { Avatar as Face, type Who } from "./avatars";
import { itauSans, nubankSans } from "./fonts";

type Skin = "itau" | "nubank";
type Flow = "delegar" | "validar" | "acompanhar";

// Tokens extraídos dos prints dos apps (azul #0031FF + laranja #FF6002 no
// Itaú; roxo #7E00D5 no Nubank). Mesma estrutura de segurança, outra pele:
// muda cor, raio, tom de voz e sinais de confiança.
const SKINS: Record<
  Skin,
  {
    nome: string;
    bar: string;
    barText: string;
    primary: string;
    primaryText: string;
    bg: string;
    card: string;
    text: string;
    muted: string;
    line: string;
    soft: string;
    ok: string;
    danger: string;
    rCard: number;
    rBtn: number;
    font: string;
    app: string;
    h0: string;
    sub0: string;
    safe: string;
  }
> = {
  itau: {
    nome: "itaú",
    bar: "#0031FF",
    barText: "#ffffff",
    primary: "#FF6002",
    primaryText: "#ffffff",
    bg: "#F1F2F4",
    card: "#ffffff",
    text: "#1a1a1a",
    muted: "#6b6f76",
    line: "#dfe1e5",
    soft: "#FFE9DC",
    ok: "#00A86B",
    danger: "#D92D20",
    rCard: 16,
    rBtn: 14,
    font: "var(--font-ad-itau), system-ui, sans-serif",
    app: "Acesso de confiança",
    h0: "Quem vai estar ao seu lado?",
    sub0: "Você escolhe o papel, as regras e pode mudar de ideia quando quiser.",
    safe: "Cada pessoa entra com o próprio acesso. Sua senha continua só sua.",
  },
  nubank: {
    nome: "nubank",
    bar: "#820AD1",
    barText: "#ffffff",
    primary: "#820AD1",
    primaryText: "#ffffff",
    bg: "#F5F3F7",
    card: "#ECE6F1",
    text: "#1f1626",
    muted: "#6d6477",
    line: "#d9d0e2",
    soft: "#E9DAF6",
    ok: "#0E9F6E",
    danger: "#D92D20",
    rCard: 20,
    rBtn: 999,
    font: "var(--font-ad-nubank), system-ui, sans-serif",
    app: "Gente de confiança",
    h0: "Quem vai te ajudar?",
    sub0: "Escolhe o papel, define as regras e muda quando quiser.",
    safe: "Cada um entra com o próprio login. Sua senha é só sua.",
  },
};
type T = (typeof SKINS)[Skin];

const FLOWS: {
  id: Flow;
  who: Who;
  n: string;
  titulo: string;
  quem: string;
  desc: string;
  pontos: string[];
}[] = [
  {
    id: "delegar",
    who: "lucia",
    n: "01",
    titulo: "Delegar acesso",
    quem: "Dona Lúcia, titular",
    desc: "Escolha a pessoa, o papel e as regras. Cada convite tem login, biometria e permissões próprias.",
    pontos: [
      "Login próprio: ninguém recebe a senha",
      "Regras do papel, visíveis para todos",
      "Autonomia reversível em um toque",
    ],
  },
  {
    id: "validar",
    who: "marina",
    n: "02",
    titulo: "Validar um Pix",
    quem: "Marina, validadora",
    desc: "A operação fora da rotina fica retida e vai para quem aprova, com prazo e sem expor saldo.",
    pontos: [
      "Quem valida não vê saldo nem extrato",
      "Prazo: sem resposta, a operação é cancelada",
      "Biometria própria, nunca SMS ou ligação",
    ],
  },
  {
    id: "acompanhar",
    who: "marcos",
    n: "03",
    titulo: "Acompanhar",
    quem: "Marcos, supervisor",
    desc: "Um resumo da semana e só os alertas do que foge do padrão. Sem aprovar o dia a dia.",
    pontos: [
      "Alertas de exceção, não de cada compra",
      "Acompanha, mas não altera os limites",
      "Registro claro que também protege a cuidadora",
    ],
  },
];

export function Prototipo() {
  const [skin, setSkin] = useState<Skin>("itau");
  const [flow, setFlow] = useState<Flow>("delegar");
  const f = FLOWS.find((x) => x.id === flow)!;
  const t = SKINS[skin];

  return (
    <section
      id="prototipo"
      className="relative overflow-hidden bg-[#0d0a1a] py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-60 transition-colors duration-700"
        style={{
          background: `radial-gradient(60% 50% at 75% 45%, ${t.bar}55, transparent 70%)`,
        }}
      />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#fb923c]">
          Laboratório navegável
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">
          A mesma lógica. Duas expressões.
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-white/65">
          A estrutura de segurança é a mesma; o jeito de falar e de aparecer
          muda com a marca. Escolha uma pele, escolha um fluxo e navegue no
          celular.
        </p>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[1fr_auto]">
          <div className="lg:pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-white/45">
                Pele
              </span>
              {(["itau", "nubank"] as Skin[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSkin(s)}
                  aria-pressed={skin === s}
                  className="rounded-full px-5 py-2 text-sm font-black transition-all"
                  style={{
                    backgroundColor:
                      skin === s ? SKINS[s].primary : "rgba(255,255,255,0.08)",
                    color: skin === s ? "#fff" : "rgba(255,255,255,0.7)",
                    transform: skin === s ? "scale(1.06)" : "none",
                  }}
                >
                  {SKINS[s].nome}
                </button>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              {FLOWS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setFlow(x.id)}
                  aria-pressed={flow === x.id}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                    flow === x.id
                      ? "border-white/60 bg-white/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <Face who={x.who} size={44} className="block shrink-0" />
                  <span>
                    <span className="block text-lg font-black text-white">
                      {x.titulo}
                    </span>
                    <span className="block text-sm text-white/55">
                      {x.quem}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={flow}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8"
              >
                <p className="text-white/75">{f.desc}</p>
                <ul className="mt-4 space-y-2">
                  {f.pontos.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2 text-sm text-white/85"
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: t.primary }}
                      >
                        <Check size={12} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            <p className="mt-8 text-xs text-white/40">
              Protótipo conceitual com dados fictícios. Inspirado na linguagem
              visual dos apps; não é um produto oficial do Itaú nem do Nubank.
            </p>
          </div>

          <Phone t={t} key={`${skin}-${flow}`}>
            {flow === "delegar" && <FluxoDelegar t={t} />}
            {flow === "validar" && <FluxoValidar t={t} />}
            {flow === "acompanhar" && <FluxoAcompanhar t={t} />}
          </Phone>
        </div>
      </div>
    </section>
  );
}

/* ---------- moldura do celular ---------- */

function Phone({ t, children }: { t: T; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.6 }}
      className={`mx-auto w-[310px] shrink-0 ${itauSans.variable} ${nubankSans.variable}`}
    >
      <div className="rounded-[46px] bg-[#0b0b0f] p-[10px] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/15">
        <div
          className="relative flex h-[690px] flex-col overflow-hidden rounded-[36px]"
          style={{
            backgroundColor: t.bg,
            color: t.text,
            fontFamily: t.font,
          }}
        >
          <div
            className="flex items-center justify-between px-6 pb-1 pt-3 text-[11px] font-bold"
            style={{ backgroundColor: t.bar, color: t.barText }}
          >
            <span>9:41</span>
            <span className="h-4 w-4 rounded-full bg-black/60" />
            <span>100%</span>
          </div>
          <div className="relative flex min-h-0 flex-1 flex-col">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- peças de UI ---------- */

function Bar({
  t,
  title,
  onBack,
  kicker,
}: {
  t: T;
  title: string;
  onBack?: () => void;
  kicker?: string;
}) {
  return (
    <div
      className="px-4 pb-4 pt-2"
      style={{ backgroundColor: t.bar, color: t.barText }}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          disabled={!onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full disabled:opacity-0"
        >
          <ChevronLeft size={22} />
        </button>
        <QuestionCircle size={20} />
      </div>
      {kicker && (
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] opacity-80">
          {kicker}
        </p>
      )}
      <p className="text-[22px] font-extrabold leading-tight">{title}</p>
    </div>
  );
}

function Btn({
  t,
  children,
  onClick,
  outline,
  danger,
}: {
  t: T;
  children: React.ReactNode;
  onClick?: () => void;
  outline?: boolean;
  danger?: boolean;
}) {
  const color = danger ? t.danger : t.primary;
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-3 text-[15px] font-bold transition-transform active:scale-[0.98]"
      style={{
        borderRadius: t.rBtn,
        backgroundColor: outline ? "transparent" : color,
        color: outline ? color : t.primaryText,
        border: outline ? `2px solid ${color}` : "2px solid transparent",
      }}
    >
      {children}
    </button>
  );
}

function Avatar({
  t,
  who,
  on,
  size = 44,
}: {
  t: T;
  who: Who;
  on?: boolean;
  size?: number;
}) {
  return (
    <span
      className="block shrink-0 rounded-full p-[2px]"
      style={{ backgroundColor: on ? t.primary : "transparent" }}
    >
      <Face who={who} size={size} className="block" />
    </span>
  );
}

function Safe({ t, children }: { t: T; children: React.ReactNode }) {
  return (
    <div
      className="flex items-start gap-2 p-3 text-[12px]"
      style={{
        backgroundColor: t.soft,
        borderRadius: t.rCard - 4,
        color: t.text,
      }}
    >
      <ShieldCheck
        size={16}
        className="mt-0.5 shrink-0"
        style={{ color: t.primary }}
      />
      <span>{children}</span>
    </div>
  );
}

function Screen({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <motion.div
      key={k}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="flex min-h-0 flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}

const brl = (v: number) =>
  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

/* ---------- fluxo 1: delegar acesso ---------- */

const PESSOAS = [
  {
    id: "rose",
    nome: "Rose Carvalho",
    sub: "Cuidadora · já opera a rotina",
    who: "rose" as Who,
  },
  {
    id: "marcos",
    nome: "Marcos Lins",
    sub: "Filho · acompanha alertas",
    who: "marcos" as Who,
  },
  {
    id: "helena",
    nome: "Helena Lins",
    sub: "Neta · convite pendente",
    who: "helena" as Who,
  },
];
const PAPEIS = [
  { id: "operar", nome: "Operar", desc: "Faz a rotina dentro de um limite" },
  {
    id: "acompanhar",
    nome: "Acompanhar",
    desc: "Vê alertas, não movimenta nada",
  },
  { id: "aprovar", nome: "Aprovar", desc: "Confirma o que foge do padrão" },
];

function FluxoDelegar({ t }: { t: T }) {
  const [step, setStep] = useState(0);
  const [pessoa, setPessoa] = useState("rose");
  const [papel, setPapel] = useState("operar");
  const [limite, setLimite] = useState(150);
  const [prazo, setPrazo] = useState("90 dias");
  const [bolso, setBolso] = useState(true);
  const [pausado, setPausado] = useState(false);
  const p = PESSOAS.find((x) => x.id === pessoa)!;
  const pap = PAPEIS.find((x) => x.id === papel)!;
  const primeiro = p.nome.split(" ")[0];

  return (
    <>
      <Bar
        t={t}
        title={
          step === 0
            ? t.h0
            : step === 1
              ? `Qual o papel de ${primeiro}?`
              : step === 2
                ? `Regras para ${primeiro}`
                : "Tudo certo"
        }
        kicker={step === 0 ? t.app : undefined}
        onBack={step > 0 && step < 3 ? () => setStep(step - 1) : undefined}
      />
      <AnimatePresence mode="wait">
        <Screen k={`d${step}`}>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {step === 0 && (
              <>
                <p className="text-[13px]" style={{ color: t.muted }}>
                  {t.sub0}
                </p>
                {PESSOAS.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => setPessoa(x.id)}
                    className="flex w-full items-center gap-3 p-3 text-left transition-all"
                    style={{
                      backgroundColor: t.card,
                      borderRadius: t.rCard,
                      border: `2px solid ${pessoa === x.id ? t.primary : "transparent"}`,
                    }}
                  >
                    <Avatar t={t} who={x.who} on={pessoa === x.id} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-bold">
                        {x.nome}
                      </span>
                      <span
                        className="block text-[11.5px]"
                        style={{ color: t.muted }}
                      >
                        {x.sub}
                      </span>
                    </span>
                  </button>
                ))}
                <Safe t={t}>{t.safe}</Safe>
              </>
            )}
            {step === 1 &&
              PAPEIS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setPapel(x.id)}
                  className="flex w-full items-center gap-3 p-4 text-left transition-all"
                  style={{
                    backgroundColor: t.card,
                    borderRadius: t.rCard,
                    border: `2px solid ${papel === x.id ? t.primary : "transparent"}`,
                  }}
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                    style={{ borderColor: t.primary }}
                  >
                    {papel === x.id && (
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: t.primary }}
                      />
                    )}
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold">
                      {x.nome}
                    </span>
                    <span
                      className="block text-[12px]"
                      style={{ color: t.muted }}
                    >
                      {x.desc}
                    </span>
                  </span>
                </button>
              ))}
            {step === 2 && (
              <>
                <div
                  className="p-4"
                  style={{ backgroundColor: t.card, borderRadius: t.rCard }}
                >
                  {papel === "operar" && (
                    <>
                      <p className="text-[12px]" style={{ color: t.muted }}>
                        Limite por dia
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <button
                          type="button"
                          aria-label="Diminuir limite"
                          onClick={() => setLimite(Math.max(50, limite - 50))}
                          className="h-9 w-9 rounded-full text-xl font-bold"
                          style={{ backgroundColor: t.soft, color: t.primary }}
                        >
                          −
                        </button>
                        <span className="text-[26px] font-extrabold">
                          {brl(limite)}
                        </span>
                        <button
                          type="button"
                          aria-label="Aumentar limite"
                          onClick={() => setLimite(Math.min(500, limite + 50))}
                          className="h-9 w-9 rounded-full text-xl font-bold"
                          style={{ backgroundColor: t.soft, color: t.primary }}
                        >
                          +
                        </button>
                      </div>
                      <label className="mt-4 flex items-center justify-between text-[13px] font-bold">
                        Bolso separado
                        <button
                          type="button"
                          role="switch"
                          aria-checked={bolso}
                          aria-label="Bolso separado"
                          onClick={() => setBolso(!bolso)}
                          className="relative h-6 w-11 rounded-full transition-colors"
                          style={{
                            backgroundColor: bolso ? t.primary : t.line,
                          }}
                        >
                          <span
                            className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
                            style={{ left: bolso ? 22 : 2 }}
                          />
                        </button>
                      </label>
                    </>
                  )}
                  {papel === "acompanhar" && (
                    <>
                      <p className="text-[13px] font-bold">
                        Você escolhe o que {primeiro} vê
                      </p>
                      <p
                        className="mt-1 text-[12px]"
                        style={{ color: t.muted }}
                      >
                        Resumo semanal e alertas só do que foge do padrão. Nada
                        de movimentar a conta.
                      </p>
                    </>
                  )}
                  {papel === "aprovar" && (
                    <>
                      <p className="text-[12px]" style={{ color: t.muted }}>
                        Pedir aprovação acima de
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <button
                          type="button"
                          aria-label="Diminuir valor"
                          onClick={() => setLimite(Math.max(50, limite - 50))}
                          className="h-9 w-9 rounded-full text-xl font-bold"
                          style={{ backgroundColor: t.soft, color: t.primary }}
                        >
                          −
                        </button>
                        <span className="text-[26px] font-extrabold">
                          {brl(limite)}
                        </span>
                        <button
                          type="button"
                          aria-label="Aumentar valor"
                          onClick={() => setLimite(Math.min(500, limite + 50))}
                          className="h-9 w-9 rounded-full text-xl font-bold"
                          style={{ backgroundColor: t.soft, color: t.primary }}
                        >
                          +
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div
                  className="p-4"
                  style={{ backgroundColor: t.card, borderRadius: t.rCard }}
                >
                  <p className="text-[12px]" style={{ color: t.muted }}>
                    Por quanto tempo
                  </p>
                  <div className="mt-2 flex gap-2">
                    {["30 dias", "90 dias", "Sem prazo"].map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setPrazo(o)}
                        className="flex-1 py-2 text-[12px] font-bold transition-colors"
                        style={{
                          borderRadius: t.rBtn === 999 ? 999 : 10,
                          backgroundColor: prazo === o ? t.primary : t.soft,
                          color: prazo === o ? t.primaryText : t.primary,
                        }}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
                <Safe t={t}>
                  Você pausa ou revoga quando quiser, em um toque.
                </Safe>
              </>
            )}
            {step === 3 && (
              <div className="flex flex-col items-center pt-2 text-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: pausado ? t.muted : t.ok }}
                >
                  {pausado ? <X size={30} /> : <Check size={32} />}
                </motion.span>
                <p className="mt-3 text-[18px] font-extrabold">
                  {pausado
                    ? `Acesso de ${primeiro} pausado`
                    : `Convite enviado para ${primeiro}`}
                </p>
                <p className="mt-1 text-[12.5px]" style={{ color: t.muted }}>
                  {pausado
                    ? "Efeito imediato. Você pode reativar quando quiser."
                    : `${primeiro} entra com o próprio login e biometria. ${t.safe.split(". ")[1] ?? ""}`}
                </p>
                <div
                  className="mt-4 w-full space-y-1.5 p-3 text-left text-[12.5px]"
                  style={{ backgroundColor: t.card, borderRadius: t.rCard }}
                >
                  <p>
                    <b>Papel:</b> {pap.nome}
                  </p>
                  {papel !== "acompanhar" && (
                    <p>
                      <b>
                        {papel === "operar"
                          ? "Limite por dia"
                          : "Aprovação acima de"}
                        :
                      </b>{" "}
                      {brl(limite)}
                    </p>
                  )}
                  {papel === "operar" && (
                    <p>
                      <b>Bolso separado:</b> {bolso ? "sim" : "não"}
                    </p>
                  )}
                  <p>
                    <b>Prazo:</b> {prazo}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2 px-4 pb-4">
            {step === 0 && (
              <Btn t={t} onClick={() => setStep(1)}>
                Escolher papel
              </Btn>
            )}
            {step === 1 && (
              <Btn t={t} onClick={() => setStep(2)}>
                Definir regras
              </Btn>
            )}
            {step === 2 && (
              <Btn t={t} onClick={() => setStep(3)}>
                Enviar convite
              </Btn>
            )}
            {step === 3 && (
              <>
                <Btn t={t} outline onClick={() => setPausado(!pausado)}>
                  {pausado ? "Reativar acesso" : "Pausar ou revogar acesso"}
                </Btn>
                <button
                  type="button"
                  onClick={() => {
                    setStep(0);
                    setPausado(false);
                  }}
                  className="w-full text-[12px] font-bold"
                  style={{ color: t.muted }}
                >
                  Recomeçar
                </button>
              </>
            )}
          </div>
        </Screen>
      </AnimatePresence>
    </>
  );
}

/* ---------- fluxo 2: validar um Pix ---------- */

function FluxoValidar({ t }: { t: T }) {
  const [step, setStep] = useState(0);
  const [decisao, setDecisao] = useState<"ok" | "no" | null>(null);
  const [seg, setSeg] = useState(28 * 60 + 40);

  useEffect(() => {
    if (step !== 0) return;
    const id = setInterval(() => setSeg((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [step]);

  useEffect(() => {
    if (step !== 1) return;
    const id = setTimeout(() => setStep(2), 1600);
    return () => clearTimeout(id);
  }, [step]);

  const mm = String(Math.floor(seg / 60)).padStart(2, "0");
  const ss = String(seg % 60).padStart(2, "0");

  return (
    <>
      <Bar
        t={t}
        title={
          step === 0
            ? "Aprovação pendente"
            : step === 1
              ? "Confirme que é você"
              : "Pronto"
        }
        kicker={step === 0 ? t.app : undefined}
      />
      <AnimatePresence mode="wait">
        <Screen k={`v${step}`}>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {step === 0 && (
              <>
                <div
                  className="p-4"
                  style={{ backgroundColor: t.card, borderRadius: t.rCard }}
                >
                  <p
                    className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: t.danger }}
                  >
                    Pix fora da rotina
                  </p>
                  <p className="mt-1 text-[30px] font-extrabold leading-none">
                    {brl(480)}
                  </p>
                  <p className="mt-2 text-[13px]">
                    para <b>Farmácia São João</b>
                  </p>
                  <p
                    className="mt-1 flex items-center gap-1.5 text-[12px]"
                    style={{ color: t.muted }}
                  >
                    <Face who="rose" size={20} className="block" />
                    Pedido por Rose · operadora
                  </p>
                  <div
                    className="mt-3 flex items-center gap-2 p-2 text-[12px]"
                    style={{ backgroundColor: t.soft, borderRadius: 10 }}
                  >
                    <InfoCircle size={14} style={{ color: t.primary }} />
                    Acima do limite diário de {brl(150)}
                  </div>
                </div>
                <div
                  className="flex items-center justify-between p-3 text-[12.5px]"
                  style={{ backgroundColor: t.card, borderRadius: t.rCard }}
                >
                  <span className="font-bold">Responder em</span>
                  <span
                    className="text-[18px] font-extrabold tabular-nums"
                    style={{ color: t.primary }}
                  >
                    {mm}:{ss}
                  </span>
                </div>
                <Safe t={t}>
                  Você não vê saldo nem extrato. Sem resposta no prazo, a
                  operação é cancelada e todos são avisados.
                </Safe>
              </>
            )}
            {step === 1 && (
              <div className="flex flex-col items-center pt-8 text-center">
                <span className="relative flex h-24 w-24 items-center justify-center">
                  <span
                    className="ad-pulse absolute inset-0 rounded-full"
                    style={{ backgroundColor: t.primary, opacity: 0.3 }}
                  />
                  <span
                    className="relative flex h-20 w-20 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: t.primary }}
                  >
                    <LockKeyhole size={34} />
                  </span>
                </span>
                <p className="mt-6 text-[15px] font-bold">Use sua biometria</p>
                <p className="mt-1 text-[12.5px]" style={{ color: t.muted }}>
                  Sua aprovação é com o seu login, nunca por SMS ou ligação.
                </p>
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-col items-center pt-4 text-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full text-white"
                  style={{
                    backgroundColor: decisao === "ok" ? t.ok : t.danger,
                  }}
                >
                  {decisao === "ok" ? <Check size={32} /> : <X size={32} />}
                </motion.span>
                <p className="mt-3 text-[18px] font-extrabold">
                  {decisao === "ok" ? "Pix liberado" : "Pix recusado"}
                </p>
                <p className="mt-1 text-[12.5px]" style={{ color: t.muted }}>
                  {decisao === "ok"
                    ? "Clara foi avisada. O registro fica salvo para todos."
                    : "Rose e Dona Lúcia foram avisadas. Nada saiu da conta."}
                </p>
              </div>
            )}
          </div>
          <div className="space-y-2 px-4 pb-4">
            {step === 0 && (
              <>
                <Btn
                  t={t}
                  onClick={() => {
                    setDecisao("ok");
                    setStep(1);
                  }}
                >
                  Aprovar
                </Btn>
                <Btn
                  t={t}
                  outline
                  danger
                  onClick={() => {
                    setDecisao("no");
                    setStep(2);
                  }}
                >
                  Recusar
                </Btn>
              </>
            )}
            {step === 2 && (
              <Btn
                t={t}
                outline
                onClick={() => {
                  setStep(0);
                  setDecisao(null);
                  setSeg(28 * 60 + 40);
                }}
              >
                Ver de novo
              </Btn>
            )}
          </div>
        </Screen>
      </AnimatePresence>
    </>
  );
}

/* ---------- fluxo 3: acompanhar ---------- */

const GASTOS = [
  { n: "Mercado Bom Preço", v: 128.4, d: "Seg" },
  { n: "Padaria Pão Quente", v: 22.9, d: "Seg" },
  { n: "Mercado Bom Preço", v: 96.7, d: "Qua" },
  { n: "Ônibus (recarga)", v: 40.0, d: "Qui" },
  { n: "Drogaria Popular", v: 89.3, d: "Sex" },
];

function FluxoAcompanhar({ t }: { t: T }) {
  const [step, setStep] = useState(0);
  const [soExcecoes, setSoExcecoes] = useState(true);
  const total = 612.3;

  return (
    <>
      <Bar
        t={t}
        title={step === 0 ? "Gastos da Rose" : "Alerta"}
        kicker={step === 0 ? `${t.app} · semana` : undefined}
        onBack={step === 1 ? () => setStep(0) : undefined}
      />
      <AnimatePresence mode="wait">
        <Screen k={`a${step}`}>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {step === 0 && (
              <>
                <div
                  className="p-4"
                  style={{ backgroundColor: t.card, borderRadius: t.rCard }}
                >
                  <p className="text-[12px]" style={{ color: t.muted }}>
                    Gasto na semana, dentro do limite
                  </p>
                  <p className="text-[28px] font-extrabold leading-tight">
                    {brl(total)}
                  </p>
                  {[
                    ["Mercado", 62],
                    ["Farmácia", 25],
                    ["Transporte", 13],
                  ].map(([n, p]) => (
                    <div key={n} className="mt-2">
                      <div className="flex justify-between text-[11px]">
                        <span>{n}</span>
                        <span style={{ color: t.muted }}>{p}%</span>
                      </div>
                      <div
                        className="mt-1 h-1.5 overflow-hidden rounded-full"
                        style={{ backgroundColor: t.line }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: t.primary }}
                          initial={{ width: 0 }}
                          animate={{ width: `${p}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {[
                    ["Só o que foge do padrão", true],
                    ["Tudo", false],
                  ].map(([l, v]) => (
                    <button
                      key={String(l)}
                      type="button"
                      onClick={() => setSoExcecoes(v as boolean)}
                      className="flex-1 px-2 py-2 text-[11.5px] font-bold"
                      style={{
                        borderRadius: 999,
                        backgroundColor: soExcecoes === v ? t.primary : t.soft,
                        color: soExcecoes === v ? t.primaryText : t.primary,
                      }}
                    >
                      {l as string}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex w-full items-center gap-3 p-3 text-left"
                  style={{
                    backgroundColor: t.card,
                    borderRadius: t.rCard,
                    border: `2px solid ${t.danger}`,
                  }}
                >
                  <Bell size={20} style={{ color: t.danger }} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold">
                      Pix fora do padrão · {brl(480)}
                    </span>
                    <span
                      className="block text-[11.5px]"
                      style={{ color: t.muted }}
                    >
                      Farmácia São João · aguardando validação
                    </span>
                  </span>
                  <ChevronRight size={18} style={{ color: t.muted }} />
                </button>
                {!soExcecoes &&
                  GASTOS.map((g, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between px-3 py-2 text-[12.5px]"
                      style={{
                        backgroundColor: t.card,
                        borderRadius: t.rCard - 4,
                      }}
                    >
                      <span>
                        <b>{g.n}</b>
                        <span className="ml-2" style={{ color: t.muted }}>
                          {g.d}
                        </span>
                      </span>
                      <span className="font-bold">{brl(g.v)}</span>
                    </motion.div>
                  ))}
                {soExcecoes && (
                  <p className="px-1 text-[12px]" style={{ color: t.muted }}>
                    Você só é avisado do que foge do normal. Não precisa aprovar
                    cada compra.
                  </p>
                )}
              </>
            )}
            {step === 1 && (
              <>
                <div
                  className="p-4"
                  style={{ backgroundColor: t.card, borderRadius: t.rCard }}
                >
                  <p
                    className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: t.danger }}
                  >
                    Aguardando validação
                  </p>
                  <p className="mt-1 text-[24px] font-extrabold">{brl(480)}</p>
                  <p className="text-[12.5px]">
                    Farmácia São João · pedido por Rose
                  </p>
                </div>
                <ol className="space-y-2.5 px-1 text-[12.5px]">
                  {[
                    ["10:42", "Rose pediu o Pix", true],
                    ["10:42", "O banco reteve: acima do limite", true],
                    ["10:43", "Marina e Clara foram avisadas", true],
                    ["agora", "Aguardando a primeira aprovação", false],
                  ].map(([h, tx, ok]) => (
                    <li key={String(tx)} className="flex items-center gap-3">
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: ok ? t.ok : t.line }}
                      >
                        {ok && <Check size={12} />}
                      </span>
                      <span
                        className="w-10 shrink-0 text-[11px]"
                        style={{ color: t.muted }}
                      >
                        {h as string}
                      </span>
                      <span className={ok ? "" : "font-bold"}>
                        {tx as string}
                      </span>
                    </li>
                  ))}
                </ol>
                <Safe t={t}>
                  Você acompanha, mas não altera os limites de Dona Lúcia. O
                  registro protege também a cuidadora.
                </Safe>
              </>
            )}
          </div>
          <div className="px-4 pb-4">
            {step === 1 && (
              <Btn t={t} outline onClick={() => setStep(0)}>
                Voltar ao resumo
              </Btn>
            )}
          </div>
        </Screen>
      </AnimatePresence>
    </>
  );
}
