import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const REPLY_TO = "contatodotales@gmail.com";

// Same mark as `src/components/logo.tsx`, inlined as a data-URI PNG-less SVG
// since email clients can't render a React component — Gmail and most major
// clients do support inline SVG images via data URIs.
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="28" height="28"><path d="M100 100H0V0H100V100ZM34.25 40.25V74.75H43.25V40.25H34.25ZM66.75 25.25V34.25H72.25V52.25H50.25V61.25H81.25V25.25H66.75ZM18.75 25.25V34.25H59.75V25.25H18.75Z" fill="#EF8354"/></svg>`;
const LOGO_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(LOGO_SVG).toString("base64")}`;

// Shared branded shell for every transactional email — a bare "TPointic"
// label with no layout looked unfinished and hurt deliverability as much as
// it hurt the impression. Keep markup table-free but simple (no flex/grid)
// since Outlook's renderer ignores most modern CSS.
function emailShell(bodyHtml: string) {
  return `
  <div style="background:#f4f4f5;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eaeaec;">
      <div style="padding:28px 32px 0;">
        <img src="${LOGO_DATA_URI}" width="28" height="28" alt="TPointic" style="display:block;margin-bottom:10px;" />
        <p style="margin:0;color:#EF8354;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;font-size:12px;">TPointic</p>
      </div>
      <div style="padding:16px 32px 32px;color:#2D3142;font-size:15px;line-height:1.6;">
        ${bodyHtml}
      </div>
      <div style="padding:20px 32px;background:#fafafa;border-top:1px solid #eaeaec;color:#8a8a8a;font-size:12px;line-height:1.6;">
        Tales Pereira · Gestor de Design, Service Designer e UX Researcher<br/>
        <a href="https://talespereira.com" style="color:#8a8a8a;">talespereira.com</a>
      </div>
    </div>
  </div>`;
}

export async function sendNotificacaoTurma({
  destinatarios,
  assunto,
  corpo,
}: {
  destinatarios: string[];
  assunto: string;
  corpo: string;
}) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY não configurada — pulando envio de notificação.",
    );
    return { skipped: true, enviados: 0 };
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "TPointic <matriculas@talespereira.com>";
  const html = emailShell(`
    <div style="white-space:pre-line;">${corpo}</div>
    <p style="margin-top:24px;margin-bottom:0;">Tales Pereira</p>
  `);
  const text = `${corpo}\n\nTales Pereira`;

  const results = await Promise.all(
    destinatarios.map((to) =>
      resend.emails.send({ from, to, subject: assunto, html, text, replyTo: REPLY_TO }),
    ),
  );

  // Same non-throwing-on-API-error behavior as sendConfirmacaoMatricula
  // below — check each result explicitly instead of trusting Promise.all
  // to reject.
  const falhas = results.filter((r) => r.error);
  if (falhas.length > 0) {
    console.error("Falha ao enviar notificação para parte dos destinatários:", falhas);
  }

  return {
    skipped: false,
    enviados: destinatarios.length - falhas.length,
  };
}

export async function sendConfirmacaoMatricula({
  to,
  nome,
  turmaNome,
  dataAula,
}: {
  to: string;
  nome: string;
  turmaNome: string;
  dataAula: string;
}) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY não configurada — pulando envio de e-mail de confirmação.",
    );
    return { skipped: true };
  }

  const dataFormatada = new Date(dataAula).toLocaleString("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  });

  const html = emailShell(`
    <h1 style="font-size:22px;margin:0 0 16px;">Sua matrícula está confirmada, ${nome}!</h1>
    <p style="margin:0 0 16px;">Você garantiu sua vaga na masterclass <strong>Os 5 Fundamentos do Design Thinking</strong>.</p>
    <p style="margin:0 0 16px;"><strong>Turma:</strong> ${turmaNome}<br/>
    <strong>Data da aula:</strong> ${dataFormatada}</p>
    <p style="margin:0 0 16px;">Qualquer dúvida, é só responder este e-mail.</p>
    <p style="margin:0;">Até lá!<br/>Tales Pereira</p>
  `);
  const text = `Sua matrícula está confirmada, ${nome}!

Você garantiu sua vaga na masterclass Os 5 Fundamentos do Design Thinking.

Turma: ${turmaNome}
Data da aula: ${dataFormatada}

Qualquer dúvida, é só responder este e-mail.

Até lá!
Tales Pereira`;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "TPointic <matriculas@talespereira.com>",
    to,
    subject: "Matrícula confirmada — Os 5 Fundamentos do Design Thinking",
    html,
    text,
    replyTo: REPLY_TO,
  });

  // resend.emails.send() resolves normally even when the API rejects the
  // send (e.g. sandbox `onboarding@resend.dev` sender only delivering to the
  // account's own address) — it does not throw. Callers relying on a thrown
  // error to detect failure never saw it, so the UI kept claiming "email
  // sent" even when nothing went out. Throw explicitly so callers can react.
  if (error) throw error;
  return data;
}
