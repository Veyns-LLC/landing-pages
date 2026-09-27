/**
 * Shared Loops.so subscribe logic.
 *
 * Kept free of any host-specific request/response types so it can be driven
 * both by the Vercel function (api/subscribe.ts) and by the dev-only Vite
 * middleware in vite.config.ts.
 *
 * Two pages post here. `audience` picks the mailing list and metadata; it
 * defaults to the waiting list, so the existing form's requests are unchanged.
 */

const LOOPS_CREATE_CONTACT = "https://app.loops.so/api/v1/contacts/create";
const LOOPS_UPDATE_CONTACT = "https://app.loops.so/api/v1/contacts/update";

/** Loops mailing list "affilate-waiting-list". */
const AFFILIATE_LIST_ID = "cmuij2hnl51db0j5y1cjoe617";

/** Deliberately permissive — real validation is Loops' job, this just filters noise. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubscribeResult = {
  status: number;
  body: { ok: true; alreadySubscribed?: boolean } | { ok: false; error: string };
};

/** Deliberately all-optional: this is unvalidated JSON off the wire. */
export type SubscribeInput = {
  email?: unknown;
  /** Required by the affiliate audience, unused by the waiting list. */
  firstName?: unknown;
  /** "affiliate", or anything else for the waiting list. */
  audience?: unknown;
  /** Honeypot field — bots fill it, humans never see it. */
  company?: unknown;
};

type Audience = {
  listId: string | undefined;
  source: string;
  userGroup: string;
  needsFirstName: boolean;
  /**
   * Upsert through contacts/update instead of contacts/create.
   *
   * The affiliate list needs this: many of its signups are already contacts
   * from the waiting list, and contacts/create answers 409 for them without
   * ever adding the mailing list — a silent drop. The waiting list keeps
   * create, where a 409 genuinely means "already on it, nothing to do".
   */
  upsert: boolean;
};

function audienceFor(key: unknown): Audience {
  if (key === "affiliate") {
    return {
      // Overridable, but defaulted on purpose: the waiting-list branch below
      // silently skips the mailing list when its variable is unset, and an
      // affiliate signup that never reaches the list is not recoverable.
      listId: process.env.LOOPS_AFFILIATE_LIST_ID?.trim() || AFFILIATE_LIST_ID,
      source: "affiliate-landing-page",
      userGroup: "affiliate-waitlist",
      needsFirstName: true,
      upsert: true,
    };
  }
  return {
    listId: process.env.LOOPS_MAILING_LIST_ID?.trim() || undefined,
    source: "waitlist-landing-page",
    userGroup: "early-cohort",
    needsFirstName: false,
    upsert: false,
  };
}

export async function subscribe(
  input: SubscribeInput,
  apiKey: string | undefined,
): Promise<SubscribeResult> {
  // Honeypot tripped: pretend it worked so the bot does not retry or learn.
  if (typeof input.company === "string" && input.company.trim() !== "") {
    return { status: 200, body: { ok: true } };
  }

  const audience = audienceFor(input.audience);

  // Checked before the email so the affiliate form reports its fields in the
  // order they appear on screen.
  const firstName = typeof input.firstName === "string" ? input.firstName.trim().slice(0, 100) : "";
  if (audience.needsFirstName && firstName === "") {
    return { status: 400, body: { ok: false, error: "Please enter your first name." } };
  }

  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { status: 400, body: { ok: false, error: "Please enter a valid email address." } };
  }

  if (!apiKey) {
    // Misconfiguration, not a user error — surface it loudly in the logs.
    console.error("LOOPS_API_KEY is not set; cannot reach Loops.");
    return {
      status: 500,
      body: { ok: false, error: "Signups are temporarily unavailable. Please try again later." },
    };
  }

  let res: Response;
  try {
    res = await fetch(audience.upsert ? LOOPS_UPDATE_CONTACT : LOOPS_CREATE_CONTACT, {
      method: audience.upsert ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        source: audience.source,
        userGroup: audience.userGroup,
        subscribed: true,
        ...(firstName ? { firstName } : {}),
        ...(audience.listId ? { mailingLists: { [audience.listId]: true } } : {}),
      }),
    });
  } catch (err) {
    console.error("Loops request failed:", err);
    return {
      status: 502,
      body: { ok: false, error: "Could not reach our email service. Please try again." },
    };
  }

  // Loops returns 409 when the contact already exists. From the visitor's point
  // of view that is a success — they are on the list either way. Only the
  // create path can land here; the upsert path returns 200.
  if (res.status === 409) {
    return { status: 200, body: { ok: true, alreadySubscribed: true } };
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`Loops responded ${res.status}: ${detail}`);
    return {
      status: 502,
      body: { ok: false, error: "Something went wrong on our end. Please try again." },
    };
  }

  return { status: 200, body: { ok: true } };
}
