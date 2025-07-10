// workers/index.ts
import { Hono } from "hono";
import { jwt, sign, verify } from "hono/jwt";
import { cors } from "hono/cors";

const app = new Hono();
app.use('*', cors());

const SECRET = Deno.env.get("JWT_SECRET")!;
const FROM_EMAIL = Deno.env.get("FROM_EMAIL")!;
const DOMAIN = Deno.env.get("APP_DOMAIN")!; // ex: https://example.com/verify.html

async function sendEmail(to: string, token: string) {
  const link = `${DOMAIN}/verify.html?token=${token}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject: "Verify your email",
      html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`,
    }),
  });

  return res.ok;
}

// ✅ إنشاء رمز التحقق
app.post("/generate-token", async (c) => {
  const { email } = await c.req.json();
  const token = await sign({ email, exp: Math.floor(Date.now() / 1000) + 60 * 60 }, SECRET);
  return c.json({ token });
});

// ✅ إرسال بريد التحقق
app.post("/send-verification", async (c) => {
  const { email, token } = await c.req.json();
  const success = await sendEmail(email, token);
  return c.json({ success });
});

// ✅ التحقق من الرمز
app.post("/verify-token", async (c) => {
  const { token } = await c.req.json();
  try {
    const payload = await verify(token, SECRET);
    return c.json({ valid: true, email: payload.email });
  } catch (_) {
    return c.json({ valid: false }, 401);
  }
});

export default app;
