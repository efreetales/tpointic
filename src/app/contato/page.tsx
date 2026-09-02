import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato — TPointic",
  description: "Fale com Tales Pereira.",
};

export default function ContatoPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <p className="text-sm font-bold uppercase tracking-widest text-coral">
        Contato
      </p>
      <h1 className="mt-2 text-4xl font-black text-navy">Vamos conversar?</h1>
      <p className="mt-3 text-slate">
        Me chama por qualquer um dos canais abaixo — respondo rapidinho.
      </p>

      <dl className="mt-10 space-y-6">
        <div>
          <dt className="text-sm font-bold uppercase tracking-widest text-gray">
            E-mail
          </dt>
          <dd className="mt-1">
            <a
              href="mailto:contatodotales@gmail.com"
              className="text-lg font-bold text-navy hover:text-coral"
            >
              contatodotales@gmail.com
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-bold uppercase tracking-widest text-gray">
            Telefone
          </dt>
          <dd className="mt-1">
            <a
              href="tel:+5511986303369"
              className="text-lg font-bold text-navy hover:text-coral"
            >
              (11) 98630-3369
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-bold uppercase tracking-widest text-gray">
            LinkedIn
          </dt>
          <dd className="mt-1">
            <a
              href="https://linkedin.com/in/talespereira/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-navy hover:text-coral"
            >
              linkedin.com/in/talespereira
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-bold uppercase tracking-widest text-gray">
            Localização
          </dt>
          <dd className="mt-1 text-lg font-bold text-navy">São Paulo — SP</dd>
        </div>
      </dl>
    </main>
  );
}
