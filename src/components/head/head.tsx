import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';

export const SITE_NAME = "Qwik City Soup & Subs"

export const Head = component$(
  () => {
    const head = useDocumentHead();
    const loc = useLocation();

    return (
      <>
        <meta charSet="utf-8" />

        <title>{head.title ? `${head.title} - ${SITE_NAME}` : SITE_NAME}</title>

        <link rel="canonical" href={loc.href} />

        {head.meta.map((m) => (
          <meta {...m} />
        ))}

        {head.links.map((l) => (
          <link {...l} />
        ))}

        {head.styles.map((s) => (
          <style {...s.props} dangerouslySetInnerHTML={s.style} />
        ))}
      </>
    );
  },
  { tagName: 'head' }
);
