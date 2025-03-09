import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, getAllPages } from "@/lib/pages";
import { PageContent } from "@/components/pages/page-content";

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
	params,
}: Props): Promise<Metadata> {
	const { slug } = await params;
	const page = await getPage(slug);
	if (!page) return {};

  const baseTitle = "فطسني"
  const finalTitle = page.frontmatter.title ? `${page.frontmatter.title} | ${baseTitle}` : "إضحك لين تفطس | فطسني"

	return {
		title: finalTitle,
		description: page.frontmatter.description,
    openGraph: {
      title: finalTitle,
      description: page.frontmatter.description,
      siteName: "فطسني",
      locale: "ar_SA",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: finalTitle,
      description: page.frontmatter.description,
    },
  }
}

export async function generateStaticParams() {
	const pages = await getAllPages();
	return pages.map((page) => ({
		slug: page.slug,
	}));
} 

export default async function Page({ params }: Props) {
	const { slug } = await params;
	const page = await getPage(slug);
	if (!page) notFound();

	return <PageContent page={page} />;
}
