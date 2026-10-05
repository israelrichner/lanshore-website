import type { Metadata } from "next";
import { NOT_FOUND_METADATA } from "@/lib/site";
import { notFound } from "next/navigation";
import ArticleView, { BLOG_SECTION, articleMetadata } from "@/components/ArticleView";
import { ARTICLES, getPost } from "@/lib/blog";

/* Guides share the blog collection but publish under /resources/guides, so
   only non-guide records get a /blog route. */
export function generateStaticParams() {
  return ARTICLES.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return post ? articleMetadata(post) : NOT_FOUND_METADATA;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return <ArticleView post={post} section={BLOG_SECTION} />;
}
