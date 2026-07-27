// Delivery to the Rivercrest case management Apps Script webhook.
//
// Every lead the site captures has to land on the Dashboard sheet. If it
// doesn't, the client has effectively vanished - so callers should treat a
// throw here as a hard failure rather than swallowing it.

export class RivercrestDeliveryError extends Error {}

// Shared secret so the public Apps Script /exec URL only accepts our posts.
export function webhookSecret(): string {
  return process.env.WEBHOOK_SHARED_SECRET || "";
}

export async function submitToRivercrest(
  payload: Record<string, unknown>
): Promise<{ clientId?: string }> {
  const url = process.env.GOOGLE_SCRIPT_WEBHOOK_URL;

  if (!url) {
    throw new RivercrestDeliveryError(
      "GOOGLE_SCRIPT_WEBHOOK_URL is not configured - the lead has nowhere to go"
    );
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, secret: webhookSecret() }),
    });
  } catch (error) {
    throw new RivercrestDeliveryError(`Webhook unreachable: ${error}`);
  }

  if (!response.ok) {
    throw new RivercrestDeliveryError(
      `Webhook returned ${response.status}`
    );
  }

  // Apps Script returns 200 even when doPost rejects the request, so the
  // body is the only reliable signal.
  const result = await response.json().catch(() => null);

  if (!result?.success) {
    throw new RivercrestDeliveryError(
      `Webhook rejected the submission: ${result?.error || "unknown error"}`
    );
  }

  return { clientId: result.clientId };
}
