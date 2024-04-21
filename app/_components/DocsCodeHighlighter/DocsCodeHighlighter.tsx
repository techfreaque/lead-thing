'use client';

import { CodeHighlightTabs } from '@mantine/code-highlight';
import { IconBrandJavascript, IconFileDescription, IconHash } from '@tabler/icons-react';

export default function DocsCodeHighlighter({
  curlCode,
  jsCode,
  jsonCode,
}: {
  curlCode: string;
  jsCode: string;
  jsonCode: string;
}) {
  return (
    <CodeHighlightTabs
      style={{ maxWidth: '100%' }}
      code={[
        {
          fileName: 'Example',
          code: jsonCode,
          language: 'json',
          icon: <IconFileDescription size={18} />,
        },
        {
          fileName: 'CURL',
          code: curlCode,
          language: 'bash',
          icon: <IconHash size={18} />,
        },
        {
          fileName: 'JavaScript',
          code: jsCode,
          language: 'js',
          icon: <IconBrandJavascript size={18} />,
        },
      ]}
    />
  );
}
