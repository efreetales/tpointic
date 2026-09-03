import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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
