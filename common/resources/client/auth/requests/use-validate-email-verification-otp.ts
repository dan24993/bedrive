import {useMutation} from '@tanstack/react-query';
import {apiClient} from '../../http/query-client';
import {UseFormReturn} from 'react-hook-form';
import {onFormQueryError} from '@common/errors/on-form-query-error';

export interface ValidateEmailVerificationOtpPayload {
  code: string;
}

export function useValidateEmailVerificationOtp(
  form: UseFormReturn<ValidateEmailVerificationOtpPayload>,
) {
  return useMutation({
    mutationFn: (payload: ValidateEmailVerificationOtpPayload) =>
      validate(payload),
    onSuccess: () => {
      window.location.reload();
    },
    onError: err => onFormQueryError(err, form),
  });
}

function validate(payload: ValidateEmailVerificationOtpPayload) {
  return apiClient
    .post('validate-email-verification-otp', payload)
    .then(response => response.data);
}
