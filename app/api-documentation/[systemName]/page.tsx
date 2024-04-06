import NotFound from '@/app/components/NotFound/NotFound';
import {
  getresponsePath,
  mappPath,
  sailthruPath,
  salesforcePath,
  salesmanagoPath,
} from '@/app/constants';

export default function Page({ params }: { params: { systemName: string } }) {
  switch ('/' + params.systemName) {
    case getresponsePath:
      return <DocsPage systemName={params.systemName} />;
    case sailthruPath:
      return <DocsPage systemName={params.systemName} />;
    case salesforcePath:
      return <DocsPage systemName={params.systemName} />;
    case salesmanagoPath:
      return <DocsPage systemName={params.systemName} />;
    case mappPath:
      return <DocsPage systemName={params.systemName} />;
    default:
      return <NotFound />;
  }

  return <div>My Post: {params.systemName}</div>;
}

function DocsPage({ systemName }: { systemName: string }) {
  return <div>ttert</div>;
}
