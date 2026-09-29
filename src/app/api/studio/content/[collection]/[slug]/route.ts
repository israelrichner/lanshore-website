import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminRoute } from "@/lib/studio/session";
import {
  createGitHubClientFromEnv,
  isPublishingUnavailable,
  publishingUnavailableResponse,
} from "@/lib/studio/github";
import { applyAction, type Action } from "@/lib/studio/apply-action";
import { COLLECTIONS } from "@/lib/studio/validate";
import type { CollectionKey } from "@/lib/content/loadContent";

const ACTIONS: Action[] = ["saveDraft", "publish", "unpublish", "delete"];

/**
 * Act on an existing item: save draft, publish, unpublish or delete.
 *
 * requireAdminRoute() is the FIRST statement, before the body is read.
 */
export async function POST(request: NextRequest, ctx: { params: Promise<{ collection: string; slug: string }> }) {
  const auth = await requireAdminRoute();
  if (!auth.ok) return auth.response;

  const { collection, slug } = await ctx.params;
  if (!COLLECTIONS.includes(collection)) return new NextResponse(null, { status: 404 });

  const client = createGitHubClientFromEnv();
  /* Missing token and expired token get the same answer (503 + fixed message). */
  if (!client) return publishingUnavailableResponse();

  const body = await request.json().catch(() => null);
  const action = body?.action as Action | undefined;
  if (!action || !ACTIONS.includes(action)) {
    return NextResponse.json({ errors: ["Unknown action."] }, { status: 400 });
  }

  let result: Awaited<ReturnType<typeof applyAction>>;
  try {
    result = await applyAction({
      client,
      collection: collection as CollectionKey,
      slug,
      action,
      record: body.record,
      /* The sha the editor's tab loaded. Undefined skips the per-item check;
         a real edit always sends it, which is what makes two tabs safe. */
      expectedSha: typeof body.expectedSha === "string" ? body.expectedSha : undefined,
      author: { name: auth.session.email.split("@")[0], email: auth.session.email },
    });
  } catch (e) {
    /* GitHub unreachable / token expired, from anywhere in the read-validate-
       commit sequence. Fixed message only; the upstream body never reaches
       the client. Anything else is a genuine bug and still throws. */
    if (isPublishingUnavailable(e)) return publishingUnavailableResponse();
    throw e;
  }

  return result.ok
    ? NextResponse.json({ ok: true, commit: result.commitSha })
    : NextResponse.json({ errors: result.errors }, { status: result.status });
}
