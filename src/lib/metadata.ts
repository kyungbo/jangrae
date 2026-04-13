import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "./constants";

const OG_IMAGE = `${SITE_URL}/og-image.png`;

export function createMetadata(
  title: string,
  description: string,
  path: string = "",
  keywords?: string[]
): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    ...(keywords && { keywords }),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${title} - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    alternates: {
      canonical: url,
    },
  };
}

export const defaultMetadata: Metadata = {
  title: {
    default: `${SITE_NAME} - 장례 정보 가이드`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "장례",
    "장례식장",
    "장례 비용",
    "장례비용",
    "장례 절차",
    "장례절차",
    "사망 직후 할 일",
    "장례 준비",
    "상조",
    "장의사",
    "장례 가이드",
    "임종",
    "3일장",
    "화장장",
    "부고",
    "조문 예절",
    "장례식장 비용",
    "상조 해지",
    "자연장",
    "처음장례",
  ],
  openGraph: {
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    // Google Search Console - 등록 후 여기에 값 입력
    // google: "your-google-verification-code",
    // 네이버 서치어드바이저 - 등록 후 여기에 값 입력
    // other: { "naver-site-verification": "your-naver-code" },
  },
};
