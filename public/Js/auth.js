import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
const WORKER_URL = "https://your-worker-url.workers.dev"; // Cloudflare Worker endpoint

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function signUp(email, password) {
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const tokenRes = await fetch(`${WORKER_URL}/generate-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const { token } = await tokenRes.json();
  await fetch(`${WORKER_URL}/send-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, token }),
  });

  return user;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function verifyToken(token) {
  const res = await fetch(`${WORKER_URL}/verify-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  return await res.json();
}

export async function resendVerification(email) {
  const tokenRes = await fetch(`${WORKER_URL}/generate-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const { token } = await tokenRes.json();

  await fetch(`${WORKER_URL}/send-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, token }),
  });
}

export async function requestPasswordReset(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return data;
}

export async function updatePassword(access_token, new_password) {
  const { data, error } = await supabase.auth.updateUser(
    { password: new_password },
    { access_token }
  );
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
