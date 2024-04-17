'use client';

import { CodeHighlightTabs } from '@mantine/code-highlight';
import { IconBrandJavascript, IconHash } from '@tabler/icons-react';

export default function DocsCodeHighlighter({
  curlCode,
  jsCode,
}: {
  curlCode: string;
  jsCode: string;
}) {
  const bashIcon = <IconHash size={18} />;
  const jsIcon = <IconBrandJavascript size={18} />;

  return (
    <CodeHighlightTabs
      style={{ maxWidth: '100%' }}
      code={[
        {
          fileName: 'CURL',
          code: curlCode,
          language: 'bash',
          icon: bashIcon,
        },
        {
          fileName: 'JavaScript',
          code: jsCode,
          language: 'js',
          icon: jsIcon,
        },
      ]}
    />
  );
}
