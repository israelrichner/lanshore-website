import type { Metadata } from "next";
import { NOT_FOUND_METADATA } from "@/lib/site";
import { notFound } from "next/navigation";
import ArticleView, { GUIDES_SECTION, articleMetadata } from "@/components/ArticleView";
import { GUIDES, getGuide } from "@/lib/blog";

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  return guide ? articleMetadata(guide) : NOT_FOUND_METADATA;
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  return <ArticleView post={guide} section={GUIDES_SECTION} />;
}
