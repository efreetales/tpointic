import type { Case } from "@/lib/cases";

export function CaseFormFields({ c }: { c?: Case }) {
  return (
    <>
      <div>
        <label htmlFor="titulo" className="block text-sm font-bold text-navy">
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          defaultValue={c?.titulo}
          required
          className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
        />
      </div>
      <div>
        <label htmlFor="slug" className="block text-sm font-bold text-navy">
          Slug (URL)
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          defaultValue={c?.slug}
          required
          pattern="[a-z0-9\-]+"
          title="Apenas letras minúsculas, números e hífens"
          className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
        />
      </div>
      <div>
        <label htmlFor="cliente" className="block text-sm font-bold text-navy">
          Cliente
        </label>
        <input
          id="cliente"
          name="cliente"
          type="text"
          defaultValue={c?.cliente ?? ""}
          className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
        />
      </div>
      <div>
        <label htmlFor="resumo" className="block text-sm font-bold text-navy">
          Resumo
        </label>
        <textarea
          id="resumo"
          name="resumo"
          rows={2}
          defaultValue={c?.resumo ?? ""}
          className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
        />
      </div>
      <div>
        <label htmlFor="conteudo" className="block text-sm font-bold text-navy">
          Conteúdo completo
        </label>
        <textarea
          id="conteudo"
          name="conteudo"
          rows={12}
          defaultValue={c?.conteudo ?? ""}
          className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
        />
      </div>
      <div>
        <label htmlFor="capa_url" className="block text-sm font-bold text-navy">
          URL da imagem de capa
        </label>
        <input
          id="capa_url"
          name="capa_url"
          type="text"
          placeholder="/cases/meu-case.png"
          defaultValue={c?.capa_url ?? ""}
          className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
        />
      </div>
      <div>
        <label htmlFor="capa_focal" className="block text-sm font-bold text-navy">
          Ponto focal da capa
        </label>
        <input
          id="capa_focal"
          name="capa_focal"
          type="text"
          placeholder='Ex: "center", "top", "50% 20%" — vazio = centralizado'
          defaultValue={c?.capa_focal ?? ""}
          className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
        />
        <p className="mt-1 text-xs text-slate">
          A imagem de capa é sempre cortada pra preencher o espaço (no painel
          da home e no hero do case). Use isso pra ajustar qual parte da
          imagem fica visível quando o corte automático (centralizado) não
          ficar bom — mesmo formato do CSS <code>object-position</code>.
        </p>
      </div>
    </>
  );
}
