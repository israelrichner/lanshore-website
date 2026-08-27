import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminRoute } from "@/lib/studio/session";
import { createGitHubClientFromEnv } from "@/lib/studio/github";
import { applyAction } from "@/lib/studio/apply-action";
import { COLLECTIONS } from "@/lib/studio/validate";
import type { CollectionKey } from "@/lib/content/loadContent";

/**
 * Create a new item as a draft.
 *
 * requireAdminRoute() is the FIRST statement, before the body is read. A
 * handler that parses input first has already done work on behalf of an
 * unauthenticated caller, and it is the kind of ordering that quietly
 * decays — so it is asserted by a check in the plan, not just intended.
 */
export async function POST(request: NextRequest, ctx: { params: Promise<{ collection: string }> }) {
  const auth = await requireAdminRoute();
  if (!auth.ok) return auth.response;

  const { collection } = await ctx.params;
  if (!COLLECTIONS.includes(collection)) return new NextResponse(null, { status: 404 });

  const client = createGitHubClientFromEnv();
  if (!client) {
    return NextResponse.json(
      { errors: ["Publishing is not configured — GITHUB_TOKEN or GITHUB_REPO is missing."] },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body?.slug || typeof body.slug !== "string") {
    return NextResponse.json({ errors: ["A web address (slug) is required."] }, { status: 400 });
  }

  const result = await applyAction({
    client,
    collection: collection as CollectionKey,
    slug: body.slug,
    action: "saveDraft",
    record: body.record ?? {},
    /* A create must not silently overwrite: null means "expect no file here". */
    expectedSha: null,
    author: { name: auth.session.email.split("@")[0], email: auth.session.email },
  });

  return result.ok
    ? NextResponse.json({ ok: true, commit: result.commitSha })
    : NextResponse.json({ errors: result.errors }, { status: result.status });
}
