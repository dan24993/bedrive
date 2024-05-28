import {useUser} from '@common/auth/ui/use-user';
import {Trans} from '@common/i18n/trans';
import {Button} from '@common/ui/buttons/button';
import {useResendVerificationEmail} from '@common/auth/requests/use-resend-verification-email';
import {useIsDarkMode} from '@common/ui/themes/use-is-dark-mode';
import {useSettings} from '@common/core/settings/use-settings';
import {useLogout} from '@common/auth/requests/logout';
import {Form} from '@common/ui/forms/form';
import {useForm} from 'react-hook-form';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {useTrans} from '@common/i18n/use-trans';
import {message} from '@common/i18n/message';
import {KeyboardArrowLeftIcon} from '@common/icons/material/KeyboardArrowLeft';
import {
  useValidateEmailVerificationOtp,
  ValidateEmailVerificationOtpPayload,
} from '@common/auth/requests/use-validate-email-verification-otp';

// todo: maybe add white panel with shadow, same as before

export function EmailVerificationPage() {
  const {trans} = useTrans();
  const {data} = useUser('me');
  const resendEmail = useResendVerificationEmail();
  const {
    branding: {logo_light, logo_dark},
  } = useSettings();
  const isDarkMode = useIsDarkMode();
  const logoSrc = isDarkMode ? logo_light : logo_dark;
  const logout = useLogout();

  const form = useForm<ValidateEmailVerificationOtpPayload>();
  const validateOtp = useValidateEmailVerificationOtp(form);

  return (
    <div className="flex min-h-screen w-screen bg-alt p-24">
      <div className="mx-auto mt-40 max-w-440">
        <Button
          variant="outline"
          onClick={() => logout.mutate()}
          startIcon={<KeyboardArrowLeftIcon />}
          size="xs"
          className="mb-54 mr-auto"
        >
          <Trans message="Logout" />
        </Button>
        {logoSrc && (
          <img
            src={logoSrc}
            alt="Site logo"
            className="mx-auto mb-44 block h-42 w-auto"
          />
        )}
        <div className="text-center">
          <h1 className="mb-24 text-3xl">
            <Trans message="Verify your email" />
          </h1>
          <h2 className="text-lg">
            <Trans
              message="Enter the verification code we sent to :email"
              values={{email: maskEmailAddress(data?.user.email)}}
            />
          </h2>
          <Form
            form={form}
            onSubmit={values => validateOtp.mutate(values)}
            className="my-16"
          >
            <FormTextField
              name="code"
              label={<Trans message="Code" />}
              placeholder={trans(message('Enter your verification code'))}
              autoFocus
              autoComplete="one-time-code"
              autoCorrect="off"
              autoCapitalize="off"
              maxLength={6}
              inputMode="numeric"
              required
            />
            <Button
              type="submit"
              variant="flat"
              color="primary"
              size="md"
              className="mt-24 w-full"
              disabled={validateOtp.isPending}
            >
              <Trans message="Next" />
            </Button>
          </Form>
          <div className="mb-24 text-sm">
            <Trans
              message="If you don't see the email in your inbox, check your spam folder and promotions tab. If you still don't see it, <a>request a resend</a>."
              values={{
                a: text => (
                  <Button
                    variant="link"
                    color="primary"
                    disabled={resendEmail.isPending || !data?.user.email}
                    onClick={() => {
                      resendEmail.mutate({email: data!.user.email});
                    }}
                  >
                    {text}
                  </Button>
                ),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function maskEmailAddress(email: string | undefined) {
  if (!email) return '*******************';
  const [username, domain] = email.split('@');
  return `${username.slice(0, 2)}****@${domain}`;
}
