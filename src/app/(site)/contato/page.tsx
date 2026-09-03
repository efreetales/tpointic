import type { Metadata } from "next";
import { Mail, Telephone, Linkedin, Compass } from "@mynaui/icons-react";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Contato — TPointic",
  description: "Fale com Tales Pereira.",
};

const CHANNELS = [
  {
    icon: Mail,
    label: "E-mail",
    value: "contatodotales@gmail.com",
    href: "mailto:contatodotales@gmail.com",
  },
  {
    icon: Telephone,
    label: "Telefone",
    value: "(11) 98630-3369",
    href: "tel:+5511986303369",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/talespereira",
    href: "https://linkedin.com/in/talespereira/",
    external: true,
  },
];

export default function ContatoPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <Reveal>
        <p className="text-sm font-bold uppercase tracking-widest text-coral">
          Contato
        </p>
        <h1 className="mt-2 text-4xl font-black text-navy">Vamos conversar?</h1>
        <p className="mt-3 text-slate">
          Me chama por qualquer um dos canais abaixo — respondo rapidinho.
        </p>
      </Reveal>

      <div className="mt-10 space-y-4">
        {CHANNELS.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.08}>
            <a
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-coral"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bg text-coral">
                <c.icon size={22} />
              </span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-widest text-gray">
                  {c.label}
                </span>
                <span className="block text-lg font-bold text-navy group-hover:text-coral">
                  {c.value}
                </span>
              </span>
            </a>
          </Reveal>
        ))}

        <Reveal delay={CHANNELS.length * 0.08}>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bg text-coral">
              <Compass size={22} />
            </span>
            <span>
              <span className="block text-xs font-bold uppercase tracking-widest text-gray">
                Localização
              </span>
              <span className="block text-lg font-bold text-navy">
                São Paulo — SP
              </span>
            </span>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
