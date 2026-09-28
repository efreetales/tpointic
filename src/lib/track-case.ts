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

export function trackCaseEvent(slug: string, event: "impression" | "click", position: number) {
  void createClient()
    .from("case_events")
    .insert({ case_slug: slug, event, position, session_id: sessionId() })
    .then(() => {});
}
