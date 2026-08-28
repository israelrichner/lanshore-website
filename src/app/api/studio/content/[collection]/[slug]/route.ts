import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminRoute } from "@/lib/studio/session";
import { createGitHubClientFromEnv } from "@/lib/studio/github";
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
  if (!client) {
    return NextResponse.json(
      { errors: ["Publishing is not configured — GITHUB_TOKEN or GITHUB_REPO is missing."] },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const action = body?.action as Action | undefined;
  if (!action || !ACTIONS.includes(action)) {
    return NextResponse.json({ errors: ["Unknown action."] }, { status: 400 });
  }

  const result = await applyAction({
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

  return result.ok
    ? NextResponse.json({ ok: true, commit: result.commitSha })
    : NextResponse.json({ errors: result.errors }, { status: result.status });
}
