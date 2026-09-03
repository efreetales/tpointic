import Link from "next/link";
import { notFound } from "next/navigation";
import { getTurmaAdmin } from "@/lib/admin";
import { atualizarTurma } from "../actions";

function toDatetimeLocal(iso: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));

  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

type Props = { params: Promise<{ id: string }> };

export default async function AdminTurmaPage({ params }: Props) {
  const { id } = await params;
  const turma = await getTurmaAdmin(id);
  if (!turma) notFound();

  const atualizarComId = atualizarTurma.bind(null, turma.id);

  return (
    <div>
      <Link href="/admin/turmas" className="text-sm font-bold text-coral">
        ← Voltar para turmas
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-3xl font-black text-navy">{turma.nome}</h1>
        <div className="flex gap-3 text-sm font-bold">
          <Link
            href={`/admin/turmas/${turma.id}/alunos`}
            className="rounded-full border border-border bg-white px-4 py-2 text-navy hover:border-coral hover:text-coral"
          >
            Ver alunos
          </Link>
          <Link
            href={`/admin/turmas/${turma.id}/notificacoes`}
            className="rounded-full border border-border bg-white px-4 py-2 text-navy hover:border-coral hover:text-coral"
          >
            Enviar notificação
          </Link>
        </div>
      </div>

      <form
        action={atualizarComId}
        className="mt-6 max-w-lg space-y-4 rounded-2xl border border-border bg-white p-6"
      >
        <div>
          <label htmlFor="nome" className="block text-sm font-bold text-navy">
            Nome da turma
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            defaultValue={turma.nome}
            required
            className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-bold text-navy">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={turma.status}
            className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
          >
            <option value="aberta">Aberta</option>
            <option value="confirmada">Confirmada</option>
            <option value="concluida">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <div>
          <label htmlFor="data_aula" className="block text-sm font-bold text-navy">
            Data e hora da aula
          </label>
          <input
            id="data_aula"
            name="data_aula"
            type="datetime-local"
            defaultValue={toDatetimeLocal(turma.data_aula)}
            required
            className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="matricula_abre" className="block text-sm font-bold text-navy">
              Matrícula abre
            </label>
            <input
              id="matricula_abre"
              name="matricula_abre"
              type="datetime-local"
              defaultValue={toDatetimeLocal(turma.matricula_abre)}
              required
              className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
            />
          </div>
          <div>
            <label htmlFor="matricula_fecha" className="block text-sm font-bold text-navy">
              Matrícula fecha
            </label>
            <input
              id="matricula_fecha"
              name="matricula_fecha"
              type="datetime-local"
              defaultValue={toDatetimeLocal(turma.matricula_fecha)}
              required
              className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="capacidade_min" className="block text-sm font-bold text-navy">
              Capacidade mínima
            </label>
            <input
              id="capacidade_min"
              name="capacidade_min"
              type="number"
              min={1}
              defaultValue={turma.capacidade_min}
              className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
            />
          </div>
          <div>
            <label htmlFor="capacidade_max" className="block text-sm font-bold text-navy">
              Capacidade máxima
            </label>
            <input
              id="capacidade_max"
              name="capacidade_max"
              type="number"
              min={1}
              defaultValue={turma.capacidade_max ?? ""}
              placeholder="opcional"
              className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-full bg-coral px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-peach"
        >
          Salvar alterações
        </button>
      </form>
    </div>
  );
}
