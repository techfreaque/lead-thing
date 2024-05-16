import { CSSProperties } from 'react';
import { StaticImageData } from 'next/image';
import cleverreach from './cleverreach.png';
import klaviyo from './klaviyo.png';
import mapp from './mapp.png';
import sailthru from './sailthru.png';
import salesforce from './salesforce.png';
import salesmanago from './salesmanago.png';
import freshmail from './freshmail.png';
import youlead from './youlead.png';
import getresponse from './getresponse.png';
import mailup from './mailup.png';
import expertsender from './expertsender.png';
import adobecampaign from './adobecampaign.png';
import emarsys from './emarsys.png';
import edrone from './edrone.png';

export function ExpertsenderIcon({
  style,
  className,
}: {
  style?: CSSProperties | undefined;
  className?: string | undefined;
}) {
  return (
    <Icon alt="Expertsender Icon" iconFile={expertsender} style={style} className={className} />
  );
}

export function EmarsysIcon({
  style,
  className,
}: {
  style?: CSSProperties | undefined;
  className?: string | undefined;
}) {
  return <Icon alt="Emarsys Icon" iconFile={emarsys} style={style} className={className} />;
}

export function EdroneIcon({
  style,
  className,
}: {
  style?: CSSProperties | undefined;
  className?: string | undefined;
}) {
  return <Icon alt="Edrone Icon" iconFile={edrone} style={style} className={className} />;
}

export function AdobeCampaignIcon({
  style,
  className,
}: {
  style?: CSSProperties | undefined;
  className?: string | undefined;
}) {
  return (
    <Icon alt="Adobe Campaign Icon" iconFile={adobecampaign} style={style} className={className} />
  );
}

export function CleverreachIcon({
  style,
  className,
}: {
  style?: CSSProperties | undefined;
  className?: string | undefined;
}) {
  return <Icon alt="CleverReach Icon" iconFile={cleverreach} style={style} className={className} />;
}

export function GetresponseIcon({
  style,
  className,
}: {
  style?: CSSProperties | undefined;
  className?: string | undefined;
}) {
  return <Icon alt="GetResponse Icon" iconFile={getresponse} style={style} className={className} />;
}

export function FreshmailIcon({
  style,
  className,
}: {
  style?: CSSProperties | undefined;
  className?: string | undefined;
}) {
  return <Icon alt="Freshmail Icon" iconFile={freshmail} style={style} className={className} />;
}

export function KlaviyoIcon({
  style,
  className,
}: {
  style?: CSSProperties | undefined;
  className?: string | undefined;
}) {
  return <Icon alt="Klaviyo Icon" iconFile={klaviyo} style={style} className={className} />;
}

export function MappIcon({
  style,
  className,
}: {
  style?: CSSProperties | undefined;
  className?: string | undefined;
}) {
  return <Icon alt="Mapp Icon" iconFile={mapp} style={style} className={className} />;
}

export function YouleadIcon({
  style,
  className,
}: {
  style?: CSSProperties | undefined;
  className?: string | undefined;
}) {
  return <Icon alt="Youlead Icon" iconFile={youlead} style={style} className={className} />;
}

export function MailupIcon({
  style,
  className,
}: {
  style?: CSSProperties | undefined;
  className?: string | undefined;
}) {
  return <Icon alt="Mailup Icon" iconFile={mailup} style={style} className={className} />;
}

export function SalesmanagoIcon({
  style,
  className,
}: {
  style?: CSSProperties | undefined;
  className?: string | undefined;
}) {
  return <Icon alt="Salesmanago Icon" iconFile={salesmanago} style={style} className={className} />;
}

export function SalesforceIcon({
  style,
  className,
}: {
  style?: CSSProperties | undefined;
  className?: string | undefined;
}) {
  return <Icon alt="Salesforce Icon" iconFile={salesforce} style={style} className={className} />;
}

export function SailthruIcon({
  style,
  className,
}: {
  style?: CSSProperties | undefined;
  className?: string | undefined;
}) {
  return <Icon alt="Sailthru Icon" iconFile={sailthru} style={style} className={className} />;
}

function Icon({
  iconFile,
  alt,
  style,
  className,
}: {
  iconFile: StaticImageData;
  alt: string;
  style: CSSProperties | undefined;
  className: string | undefined;
}) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={iconFile.src} style={style} alt={alt}></img>;
}
