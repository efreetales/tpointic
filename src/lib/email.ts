import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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

  const from = process.env.RESEND_FROM_EMAIL ?? "TPointic <onboarding@resend.dev>";
  const html = `
    <div style="font-family: sans-serif; color: #2D3142; max-width: 480px; margin: 0 auto; white-space: pre-line;">
      <p style="color: #EF8354; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase; font-size: 12px;">TPointic</p>
      ${corpo}
      <p style="margin-top: 24px;">Tales Pereira</p>
    </div>
  `;

  await Promise.all(
    destinatarios.map((to) =>
      resend.emails.send({ from, to, subject: assunto, html }),
    ),
  );

  return { skipped: false, enviados: destinatarios.length };
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

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "TPointic <onboarding@resend.dev>",
    to,
    subject: "Matrícula confirmada — Os 5 Fundamentos do Design Thinking",
    html: `
      <div style="font-family: sans-serif; color: #2D3142; max-width: 480px; margin: 0 auto;">
        <p style="color: #EF8354; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase; font-size: 12px;">TPointic</p>
        <h1 style="font-size: 22px;">Sua matrícula está confirmada, ${nome}!</h1>
        <p>Você garantiu sua vaga na masterclass <strong>Os 5 Fundamentos do Design Thinking</strong>.</p>
        <p><strong>Turma:</strong> ${turmaNome}<br/>
        <strong>Data da aula:</strong> ${dataFormatada}</p>
        <p>Qualquer dúvida, é só responder este e-mail.</p>
        <p>Até lá!<br/>Tales Pereira</p>
      </div>
    `,
  });
}
