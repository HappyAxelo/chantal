import { promises as fs } from "node:fs";
import path from "node:path";
import { isProduction } from "@/lib/env";

export interface Email {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

/**
 * EMAIL_MODE=live sends through Resend; anything else (the default) only
 * records the message, so development never emails real people.
 * EMAIL_REDIRECT_TO, if set, reroutes every live email to one inbox (staging).
 */
export function emailMode(): "live" | "log" {
  return process.env.EMAIL_MODE === "live" && process.env.RESEND_API_KEY && process.env.EMAIL_FROM ? "live" : "log";
}

export function adminRecipient(): string | null {
  return process.env.ADMIN_NOTIFICATION_EMAIL || null;
}

function mask(addr: string): string {
  const [u, d] = addr.split("@");
  return `${(u ?? "").slice(0, 2)}***@${d ?? ""}`;
}

export async function sendEmail(email: Email): Promise<{ sent: boolean }> {
  try {
    if (emailMode() === "log") {
      console.info(`[email:log] "${email.subject}" -> ${mask(email.to)}`);
      if (!isProduction) {
        const dir = path.join(process.cwd(), ".data", "outbox");
        await fs.mkdir(dir, { recursive: true });
        const name = `${new Date().toISOString().replace(/[:.]/g, "-")}-${email.subject.replace(/[^a-z0-9]+/gi, "-").slice(0, 50)}.html`;
        await fs.writeFile(path.join(dir, name), `<!-- to: ${email.to} -->\n${email.html}`, "utf8");
      }
      return { sent: false };
    }

    const to = process.env.EMAIL_REDIRECT_TO || email.to;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [to],
        subject: email.subject,
        html: email.html,
        text: email.text,
        reply_to: email.replyTo,
      }),
    });
    if (!res.ok) {
      console.error(`[email] provider rejected message (${res.status})`);
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    // Email failure must never lose a stored submission.
    console.error("[email] send failed:", err instanceof Error ? err.message : "unknown");
    return { sent: false };
  }
}
