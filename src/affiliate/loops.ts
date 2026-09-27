/**
 * Browser-side submit for the affiliate waitlist form.
 *
 * Posts to the same /api/subscribe endpoint as the main waiting-list form;
 * `audience` is what routes the contact to the affiliate mailing list. The
 * Loops API key stays server-side in api/_loops.ts.
 */

export type SubscribeResult = { ok: true } | { ok: false; message: string }

const GENERIC_ERROR = 'Something went wrong. Please try again in a moment.'

export async function joinWaitlist(
  firstName: string,
  email: string,
  /** Honeypot — bots fill it, humans never see it. */
  company: string,
): Promise<SubscribeResult> {
  let res: Response
  try {
    res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, email, company, audience: 'affiliate' }),
    })
  } catch {
    return { ok: false, message: "We couldn't reach the server. Please check your connection and try again." }
  }

  const data = await res.json().catch(() => null)
  if (res.ok && data?.ok) return { ok: true }
  return { ok: false, message: data?.error ?? GENERIC_ERROR }
}
