import DocsPage from '@/app/_components/DocsPage/DocsPage';
import NotFound from '@/app/_components/NotFound/NotFound';
import { avialableSystemsType, newsletterSystems } from '@/app/api/newsletterSystemConstants';

export default function Page({ params }: { params: { systemName: string } }) {
  if (params.systemName in newsletterSystems) {
    return <DocsPage systemName={params.systemName as avialableSystemsType} />;
  }
  return <NotFound />;
}
