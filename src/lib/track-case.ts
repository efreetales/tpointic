import { createClient } from "@/lib/supabase/client";

// Mede o desempenho dos cases em destaque na home (`case_events`): quantas
// vezes cada um foi visto ("impression") e clicado ("click"), e em que
// posição estava — a ordem é aleatória por visita, então a posição precisa
// entrar na conta pra não confundir "mais clicado" com "sempre o primeiro".
// `session_id` só agrupa eventos do mesmo visitante na mesma aba; não guarda
// nada pessoal.
function sessionId() {
  try {
    let id = sessionStorage.getItem("case-events-session");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("case-events-session", id);
    }
    return id;
  } catch {
    return null;
  }
}

// Visitas do próprio admin não entram na conta (senão testar o site polui as
// métricas). Sem sessão de login → visitante comum, sem nenhuma chamada
// extra; com sessão, confirma via `is_admin()` (mesma função das policies) e
// guarda o resultado pra não repetir.
let adminCheck: Promise<boolean> | null = null;

function isAdminVisitor() {
  adminCheck ??= (async () => {
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return false;
      const { data } = await supabase.rpc("is_admin");
      return data === true;
    } catch {
      return false;
    }
  })();
  return adminCheck;
}

export async function trackCaseEvent(slug: string, event: "impression" | "click", position: number) {
  if (await isAdminVisitor()) return;
  await createClient()
    .from("case_events")
    .insert({ case_slug: slug, event, position, session_id: sessionId() });
}
