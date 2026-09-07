import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { absoluteUrl } from "@/lib/utils";

export function createMetadata({
  title,
  description,
  path = "/",
  image,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? absoluteUrl("/og.jpg");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: brand.name,
      images: [{ url: ogImage }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function productJsonLd(input: {
  name: string;
  description: string;
  image?: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: input.image,
    url: input.url,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: input.price,
      availability: "https://schema.org/InStock",
    },
    ...(input.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: input.rating,
            reviewCount: input.reviewCount,
          },
        }
      : {}),
  };
}
