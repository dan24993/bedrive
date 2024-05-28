import { useMutation } from "@tanstack/react-query";
import { l as useTrans, v as toast, m as message, w as showHttpErrorToast, a as apiClient } from "../server-entry.mjs";
function useCancelSubscription() {
  const { trans } = useTrans();
  return useMutation({
    mutationFn: (props) => cancelSubscription(props),
    onSuccess: (response, payload) => {
      toast(
        payload.delete ? trans(message("Subscription deleted.")) : trans(message("Subscription cancelled."))
      );
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function cancelSubscription({
  subscriptionId,
  ...payload
}) {
  return apiClient.post(`billing/subscriptions/${subscriptionId}/cancel`, payload).then((r) => r.data);
}
function useResumeSubscription() {
  const { trans } = useTrans();
  return useMutation({
    mutationFn: (props) => resumeSubscription(props),
    onSuccess: () => {
      toast(trans(message("Subscription renewed.")));
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function resumeSubscription({ subscriptionId }) {
  return apiClient.post(`billing/subscriptions/${subscriptionId}/resume`).then((r) => r.data);
}
export {
  useResumeSubscription as a,
  useCancelSubscription as u
};
//# sourceMappingURL=use-resume-subscription-6a4f3492.mjs.map
