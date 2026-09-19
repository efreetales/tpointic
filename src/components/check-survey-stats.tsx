import { StatRing } from "@/components/stat-ring";

// Os dois cards de resultado do Check Survey 2023 (Engagement e Execução),
// compartilhados entre a home e a página /lideranca — assim os números e o
// visual não divergem. EXE = Execução (não "Excelência"), conforme o
// relatório oficial do Mercado Livre.
export function CheckSurveyStats() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-6 sm:justify-start">
      <div className="rounded-2xl border border-white/15 bg-white/5 px-8 py-6 backdrop-blur-sm">
        <StatRing value="92%" percent={92} label="Engagement" />
        <p className="mt-1 text-center text-xs font-bold text-emerald-400">▲ 4 vs. edição anterior</p>
      </div>
      <div className="rounded-2xl border border-white/15 bg-white/5 px-8 py-6 backdrop-blur-sm">
        <StatRing value="88%" percent={88} label="Execução (EXE)" />
        <p className="mt-1 text-center text-xs font-bold text-emerald-400">▲ 2 vs. edição anterior</p>
      </div>
    </div>
  );
}
