import { jsxs, jsx } from "react/jsx-runtime";
import clsx from "clsx";
import { aO as useAuth, bc as useIsDarkMode, b9 as useSelectedLocale, u as useSettings, a as apiClient, B as Button, q as Skeleton, p as opacityAnimation, E as ErrorIcon, T as Trans } from "../server-entry.mjs";
import { useRef, useState, useEffect, Fragment } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Link } from "react-router-dom";
import { AnimatePresence, m } from "framer-motion";
import { T as TaskAltIcon } from "./TaskAlt-1b0641f6.mjs";
function useStripe({ type, productId, priceId }) {
  const { user } = useAuth();
  const isDarkMode = useIsDarkMode();
  const isInitiatedRef = useRef(false);
  const paymentElementRef = useRef(null);
  const { localeCode } = useSelectedLocale();
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const {
    branding: { site_name },
    billing: {
      stripe_public_key,
      stripe: { enable }
    }
  } = useSettings();
  useEffect(() => {
    if (!enable || !stripe_public_key || isInitiatedRef.current)
      return;
    Promise.all([
      // load stripe js library
      loadStripe(stripe_public_key, {
        apiVersion: "2022-08-01",
        locale: localeCode
      }),
      // create partial subscription for clientSecret
      type === "setupIntent" ? createSetupIntent() : createSubscription(productId, priceId)
    ]).then(([stripe2, { clientSecret }]) => {
      if (stripe2 && paymentElementRef.current) {
        const elements2 = stripe2.elements({
          clientSecret,
          appearance: {
            theme: isDarkMode ? "night" : "stripe"
          }
        });
        const paymentElement = elements2.create("payment", {
          business: { name: site_name },
          terms: { card: "never" },
          fields: {
            billingDetails: {
              address: "auto"
            }
          },
          defaultValues: {
            billingDetails: {
              email: user == null ? void 0 : user.email
            }
          }
        });
        paymentElement.mount(paymentElementRef.current);
        setStripe(stripe2);
        setElements(elements2);
      }
    });
    isInitiatedRef.current = true;
  }, [
    productId,
    stripe_public_key,
    enable,
    isDarkMode,
    localeCode,
    site_name,
    type,
    user == null ? void 0 : user.email
  ]);
  return {
    stripe,
    elements,
    paymentElementRef,
    stripeIsEnabled: stripe_public_key != null && enable
  };
}
function createSetupIntent() {
  return apiClient.post("billing/stripe/create-setup-intent").then((r) => r.data);
}
function createSubscription(productId, priceId) {
  return apiClient.post("billing/stripe/create-partial-subscription", {
    product_id: productId,
    price_id: priceId
  }).then((r) => r.data);
}
function StripeElementsForm({
  productId,
  priceId,
  type = "subscription",
  submitLabel,
  returnUrl
}) {
  const { stripe, elements, paymentElementRef, stripeIsEnabled } = useStripe({
    type,
    productId,
    priceId
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stripeIsReady = !stripeIsEnabled || elements != null && stripe != null;
  const handleSubmit = async (e) => {
    var _a, _b;
    e.preventDefault();
    if (!stripe || !elements)
      return;
    setIsSubmitting(true);
    try {
      const method = type === "subscription" ? "confirmPayment" : "confirmSetup";
      const result = await stripe[method]({
        elements,
        confirmParams: {
          return_url: returnUrl
        }
      });
      if (((_a = result.error) == null ? void 0 : _a.type) !== "validation_error" && ((_b = result.error) == null ? void 0 : _b.message)) {
        setErrorMessage(result.error.message);
      }
    } catch {
    }
    setIsSubmitting(false);
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: paymentElementRef,
        className: clsx("min-h-[303px]", !stripeIsEnabled && "hidden"),
        children: stripeIsEnabled && /* @__PURE__ */ jsx(StripeSkeleton, {})
      }
    ),
    errorMessage && !isSubmitting && /* @__PURE__ */ jsx("div", { className: "mt-20 text-danger", children: errorMessage }),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "flat",
        color: "primary",
        size: "md",
        className: "mt-40 w-full",
        type: "submit",
        disabled: isSubmitting || !stripeIsReady,
        children: submitLabel
      }
    )
  ] });
}
function StripeSkeleton() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Skeleton, { className: "mb-20 h-30" }),
    /* @__PURE__ */ jsx(Skeleton, { className: "mb-20 h-30" }),
    /* @__PURE__ */ jsx(Skeleton, { className: "mb-20 h-30" }),
    /* @__PURE__ */ jsx(Skeleton, { className: "h-30" })
  ] });
}
function BillingRedirectMessage({ config }) {
  return /* @__PURE__ */ jsx(AnimatePresence, { initial: false, mode: "wait", children: /* @__PURE__ */ jsx("div", { className: "mt-80", children: config ? /* @__PURE__ */ jsxs(
    m.div,
    {
      className: "text-center",
      ...opacityAnimation,
      children: [
        config.status === "success" ? /* @__PURE__ */ jsx(TaskAltIcon, { className: "text-positive text-6xl" }) : /* @__PURE__ */ jsx(ErrorIcon, { className: "text-danger text-6xl" }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-semibold mt-30", children: /* @__PURE__ */ jsx(Trans, { ...config.message }) }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "flat",
            color: "primary",
            className: "w-full mt-30",
            size: "md",
            elementType: Link,
            to: config.link,
            children: /* @__PURE__ */ jsx(Trans, { ...config.buttonLabel })
          }
        )
      ]
    },
    "payment-status"
  ) : /* @__PURE__ */ jsx(LoadingSkeleton, {}, "loading-skeleton") }) });
}
function LoadingSkeleton() {
  return /* @__PURE__ */ jsxs(
    m.div,
    {
      className: "text-center max-w-280",
      ...opacityAnimation,
      children: [
        /* @__PURE__ */ jsx(Skeleton, { size: "w-50 h-50", variant: "rect" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "text-2xl mt-30" }),
        /* @__PURE__ */ jsx(Skeleton, { size: "h-42", className: "mt-30" })
      ]
    },
    "loading-skeleton"
  );
}
export {
  BillingRedirectMessage as B,
  StripeElementsForm as S
};
//# sourceMappingURL=billing-redirect-message-4c133c8b.mjs.map
