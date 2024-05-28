import {Trans} from '@common/i18n/trans';
import {Link} from 'react-router-dom';
import {LinkStyle} from '@common/ui/buttons/external-link';
import {ReactElement, ReactNode} from 'react';
import {SectionHelper, SectionHelperProps} from '@common/ui/section-helper';
import {useSettings} from '@common/core/settings/use-settings';
import {PolicyFailReason} from '@common/billing/upgrade/policy-fail-reason';

interface Props {
  className?: string;
  // plural name in lowercase (e.g. 'projects')
  resourceName?: ReactElement | string;
  reason?: PolicyFailReason;
  size?: SectionHelperProps['size'];
  color?: SectionHelperProps['color'];
  message?: ReactNode;
}
export function PolicyFailMessage({
  resourceName,
  className,
  size = 'md',
  color = 'bgAlt',
  reason = 'overQuota',
  ...other
}: Props) {
  const message = other.message ?? (
    <MessageText resourceName={resourceName!} reason={reason} />
  );

  return (
    <SectionHelper
      color={color}
      size={size}
      className={className}
      description={message}
    />
  );
}

interface MessageTextProps {
  resourceName: ReactElement | string;
  reason?: PolicyFailReason;
}
function MessageText({resourceName, reason}: MessageTextProps) {
  const {billing} = useSettings();

  if (reason === 'noWorkspacePermission') {
    return (
      <Trans
        message="You can't create new :name in this workspace."
        values={{name: resourceName}}
      />
    );
  }

  const upgradeMsgValues = {
    name: resourceName,
    a: (text: ReactNode) => (
      <Link className={LinkStyle} to="/pricing">
        {text}
      </Link>
    ),
  };

  if (reason === 'overQuota' && billing.enable) {
    return (
      <Trans
        message="Your plan is at its maximum number of :name allowed. <a>Upgrade to add more.</a>"
        values={upgradeMsgValues}
      />
    );
  }

  if (reason === 'noPermission' && billing.enable) {
    return (
      <Trans
        message="To unlock ability to create :name. <a>Upgrade your plan.</a>"
        values={upgradeMsgValues}
      />
    );
  }

  return <Trans message="You don't have permissions to create :name." />;
}
