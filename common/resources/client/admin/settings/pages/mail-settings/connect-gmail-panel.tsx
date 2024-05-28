import {useFormContext} from 'react-hook-form';
import {AdminSettings} from '../../admin-settings';
import {useSocialLogin} from '../../../../auth/requests/use-social-login';
import {toast} from '../../../../ui/toast/toast';
import {message} from '../../../../i18n/message';
import {Button} from '../../../../ui/buttons/button';
import {GmailIcon} from './gmail-icon';
import {Trans} from '../../../../i18n/trans';
import {Fragment} from 'react';

export function ConnectGmailPanel() {
  const {watch, setValue} = useFormContext<AdminSettings>();
  const {connectSocial} = useSocialLogin();
  const connectedEmail = watch('server.connectedGmailAccount');

  const handleGmailConnect = async () => {
    const e = await connectSocial('secure/settings/mail/gmail/connect');
    if (e?.status === 'SUCCESS') {
      const email = (e.callbackData as any).profile.email;
      setValue('server.connectedGmailAccount', email);
      toast(message('Connected gmail account: :email', {values: {email}}));
    }
  };

  const connectButton = (
    <Button
      variant="outline"
      color="primary"
      startIcon={<GmailIcon />}
      onClick={() => {
        handleGmailConnect();
      }}
    >
      <Trans message="Connect gmail account" />
    </Button>
  );

  const reconnectPanel = (
    <div className="flex items-center gap-14 rounded border bg-alt px-14 py-6 text-sm">
      <GmailIcon size="lg" />
      {connectedEmail}
      <Button
        variant="text"
        color="primary"
        className="ml-auto"
        onClick={() => {
          handleGmailConnect();
        }}
      >
        <Trans message="Reconnect" />
      </Button>
    </div>
  );

  return (
    <Fragment>
      <div className="mb-6 text-sm">
        <Trans message="Gmail account" />
      </div>
      {connectedEmail ? reconnectPanel : connectButton}
    </Fragment>
  );
}
