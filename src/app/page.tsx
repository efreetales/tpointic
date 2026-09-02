export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-coral">
        TPointic
      </p>
      <h1 className="max-w-2xl text-4xl font-black text-navy sm:text-5xl">
        Design que aproxima pessoas e produtos
      </h1>
      <p className="max-w-xl text-lg text-slate">
        Portfólio de Tales Pereira e masterclass Os 5 Fundamentos do Design
        Thinking.
      </p>
      <a
        href="/treinamentos/design-thinking-5-fundamentos"
        className="mt-4 rounded-full bg-coral px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-peach"
      >
        Conheça a masterclass
      </a>
    </main>
  );
}
