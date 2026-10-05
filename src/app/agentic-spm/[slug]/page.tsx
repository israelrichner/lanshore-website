import type { Metadata } from "next";
import { NOT_FOUND_METADATA } from "@/lib/site";
import { notFound } from "next/navigation";
import PillarPage from "@/components/PillarPage";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { PILLARS, getPillar } from "@/lib/pillars";

export function generateStaticParams() {
  return PILLARS.map((pillar) => ({ slug: pillar.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pillar = getPillar(slug);
  if (!pillar) return NOT_FOUND_METADATA;
  return {
    title: pillar.titleTag,
    description: pillar.metaDescription,
    alternates: { canonical: pillar.path },
    openGraph: {
      siteName: "Lanshore",
      locale: "en_US",
      title: pillar.titleTag,
      description: pillar.metaDescription,
      url: pillar.path,
      type: "website",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pillar = getPillar(slug);
  if (!pillar) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "AI Assisted SPM", href: "/" },
          { name: pillar.name, href: pillar.path },
        ])}
      />
      <PillarPage pillar={pillar} />
    </>
  );
}
