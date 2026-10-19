export function serializeJsonLd(data) {
    return JSON.stringify(data).replace(/</g, "\\u003c");
  }
  
  export function buildCollectionJsonLd({ siteUrl, path, name, description }) {
    const url = siteUrl ? `${siteUrl}${path}` : undefined;
  
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name,
      description,
      ...(url ? { url } : {}),
      inLanguage: "en",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            ...(siteUrl ? { item: siteUrl } : {}),
          },
          {
            "@type": "ListItem",
            position: 2,
            name,
            ...(url ? { item: url } : {}),
          },
        ],
      },
    };
  }