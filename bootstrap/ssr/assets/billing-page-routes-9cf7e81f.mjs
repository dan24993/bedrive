import { jsx, jsxs } from "react/jsx-runtime";
import { Navigate, Outlet, Link, useSearchParams, useParams, Routes, Route } from "react-router-dom";
import { aO as useAuth, ap as useUser, r as StaticPageTitle, T as Trans, aP as Navbar, a7 as ProgressCircle, bj as Footer, a8 as useNavigate, u as useSettings, B as Button, t as queryClient, m as message, a as apiClient, aw as useProducts, bk as BillingCycleRadio, bl as findBestPrice, p as opacityAnimation, ax as FormattedPrice, L as CheckIcon, q as Skeleton, l as useTrans, v as toast, w as showHttpErrorToast, O as FormattedDate, N as Chip, z as SvgImage, bm as FormattedCurrency } from "../server-entry.mjs";
import { Fragment, useState, useRef, useEffect, createElement } from "react";
import { B as Breadcrumb, a as BreadcrumbItem, S as SectionHelper, E as EditIcon } from "./Edit-48c44acf.mjs";
import { S as StripeElementsForm, B as BillingRedirectMessage } from "./billing-redirect-message-4c133c8b.mjs";
import { loadStripe } from "@stripe/stripe-js";
import { AnimatePresence, m } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { u as useCancelSubscription, a as useResumeSubscription } from "./use-resume-subscription-6a4f3492.mjs";
import { C as CalendarTodayIcon, O as OpenInNewIcon } from "./OpenInNew-d91e9095.mjs";
import "react-dom/server";
import "process";
import "http";
import "axios";
import "react-router-dom/server.mjs";
import "clsx";
import "@internationalized/date";
import "nano-memoize";
import "zustand";
import "zustand/middleware/immer";
import "nanoid";
import "@react-aria/utils";
import "@react-aria/focus";
import "@floating-ui/react-dom";
import "react-merge-refs";
import "react-dom";
import "deepmerge";
import "@internationalized/number";
import "react-hook-form";
import "@react-stately/utils";
import "@react-aria/ssr";
import "dot-object";
import "immer";
import "axios-retry";
import "tus-js-client";
import "react-use-cookie";
import "mime-match";
import "react-use-clipboard";
import "./TaskAlt-1b0641f6.mjs";
function SubscribedRoute({ children }) {
  const { isSubscribed } = useAuth();
  if (!isSubscribed) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/pricing", replace: true });
  }
  return children || /* @__PURE__ */ jsx(Outlet, {});
}
function BillingPageLayout() {
  const { user } = useAuth();
  const query = useUser(user.id, {
    with: ["subscriptions.product", "subscriptions.price"]
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(StaticPageTitle, { children: /* @__PURE__ */ jsx(Trans, { message: "Billing" }) }),
    /* @__PURE__ */ jsx(Navbar, { menuPosition: "billing-page" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "container mx-auto my-24 px-24 flex-auto", children: query.isLoading ? /* @__PURE__ */ jsx(
        ProgressCircle,
        {
          className: "my-80",
          "aria-label": "Loading user..",
          isIndeterminate: true
        }
      ) : /* @__PURE__ */ jsx(Outlet, {}) }),
      /* @__PURE__ */ jsx(Footer, { className: "container mx-auto px-24" })
    ] })
  ] });
}
const previousUrl$5 = "/billing";
function ChangePaymentMethodLayout() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Breadcrumb, { children: [
      /* @__PURE__ */ jsx(BreadcrumbItem, { isLink: true, onSelected: () => navigate(previousUrl$5), children: /* @__PURE__ */ jsx(Trans, { message: "Billing" }) }),
      /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(Trans, { message: "Payment method" }) })
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold my-32 md:my-64", children: /* @__PURE__ */ jsx(Trans, { message: "Change payment method" }) }),
    /* @__PURE__ */ jsx(Outlet, {})
  ] });
}
const previousUrl$4 = "/billing";
function ChangePaymentMethodPage() {
  const { base_url } = useSettings();
  return /* @__PURE__ */ jsxs("div", { className: "max-w-[464px]", children: [
    /* @__PURE__ */ jsx(
      StripeElementsForm,
      {
        type: "setupIntent",
        submitLabel: /* @__PURE__ */ jsx(Trans, { message: "Change" }),
        returnUrl: `${base_url}/billing/change-payment-method/done`
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "outline",
        className: "w-full mt-16",
        size: "md",
        to: previousUrl$4,
        elementType: Link,
        type: "button",
        children: /* @__PURE__ */ jsx(Trans, { message: "Go back" })
      }
    )
  ] });
}
function useBillingUser() {
  var _a, _b, _c;
  const query = useUser("me", {
    with: ["subscriptions.product", "subscriptions.price"]
  });
  const subscription = (_b = (_a = query.data) == null ? void 0 : _a.user.subscriptions) == null ? void 0 : _b[0];
  return { subscription, isLoading: query.isLoading, user: (_c = query.data) == null ? void 0 : _c.user };
}
function invalidateBillingUserQuery() {
  queryClient.invalidateQueries({ queryKey: ["users"] });
}
const previousUrl$3 = "/billing";
function ChangePaymentMethodDone() {
  const {
    billing: { stripe_public_key }
  } = useSettings();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const clientSecret = params.get("setup_intent_client_secret");
  const [messageConfig, setMessageConfig] = useState();
  const stripeInitiated = useRef();
  useEffect(() => {
    if (stripeInitiated.current || !clientSecret)
      return;
    loadStripe(stripe_public_key).then((stripe) => {
      if (!stripe) {
        setMessageConfig(getRedirectMessageConfig());
        return;
      }
      stripe.retrieveSetupIntent(clientSecret).then(({ setupIntent }) => {
        if ((setupIntent == null ? void 0 : setupIntent.status) === "succeeded") {
          changeDefaultPaymentMethod(setupIntent.payment_method).then(
            () => {
              invalidateBillingUserQuery();
            }
          );
        }
        setMessageConfig(getRedirectMessageConfig(setupIntent == null ? void 0 : setupIntent.status));
      });
    });
    stripeInitiated.current = true;
  }, [stripe_public_key, clientSecret]);
  if (!clientSecret) {
    navigate(previousUrl$3);
    return null;
  }
  return /* @__PURE__ */ jsx(BillingRedirectMessage, { config: messageConfig });
}
function getRedirectMessageConfig(status) {
  switch (status) {
    case "succeeded":
      return {
        ...redirectMessageDefaults,
        message: message("Payment method changed successfully!"),
        status: "success"
      };
    case "processing":
      return {
        ...redirectMessageDefaults,
        message: message(
          "Your request is processing. We'll update you when your payment method is confirmed."
        ),
        status: "success"
      };
    case "requires_payment_method":
      return {
        ...redirectMessageDefaults,
        message: message(
          "Payment method confirmation failed. Please try another payment method."
        ),
        status: "error"
      };
    default:
      return {
        ...redirectMessageDefaults,
        message: message("Something went wrong"),
        status: "error"
      };
  }
}
const redirectMessageDefaults = {
  link: previousUrl$3,
  buttonLabel: message("Go back")
};
function changeDefaultPaymentMethod(paymentMethodId) {
  return apiClient.post("billing/stripe/change-default-payment-method", {
    payment_method_id: paymentMethodId
  });
}
function BillingPlanPanel({ title, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "mb-64", children: [
    /* @__PURE__ */ jsx("div", { className: "text-sm font-medium uppercase pb-16 mb-16 border-b", children: title }),
    children
  ] });
}
function ChangePlanPage() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Breadcrumb, { children: [
      /* @__PURE__ */ jsx(BreadcrumbItem, { isLink: true, onSelected: () => navigate("/billing"), children: /* @__PURE__ */ jsx(Trans, { message: "Billing" }) }),
      /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(Trans, { message: "Plans" }) })
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "my-32 text-3xl font-bold md:my-64", children: /* @__PURE__ */ jsx(Trans, { message: "Change your plan" }) }),
    /* @__PURE__ */ jsx(BillingPlanPanel, { title: /* @__PURE__ */ jsx(Trans, { message: "Available plans" }), children: /* @__PURE__ */ jsx(AnimatePresence, { initial: false, mode: "wait", children: /* @__PURE__ */ jsx(PlanList, {}) }) })
  ] });
}
function PlanList() {
  var _a, _b;
  const query = useProducts();
  const [selectedCycle, setSelectedCycle] = useState("monthly");
  if (query.isLoading) {
    return /* @__PURE__ */ jsx(PlanSkeleton, {}, "plan-skeleton");
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      BillingCycleRadio,
      {
        products: (_a = query.data) == null ? void 0 : _a.products,
        selectedCycle,
        onChange: setSelectedCycle,
        className: "mb-20",
        size: "md"
      }
    ),
    (_b = query.data) == null ? void 0 : _b.products.map((plan) => {
      const price = findBestPrice(selectedCycle, plan.prices);
      if (!price || plan.hidden)
        return null;
      return /* @__PURE__ */ createElement(
        m.div,
        {
          ...opacityAnimation,
          key: plan.id,
          className: "justify-between gap-40 border-b py-32 md:flex"
        },
        /* @__PURE__ */ jsxs("div", { className: "mb-40 md:mb-0", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xl font-bold", children: plan.name }),
          /* @__PURE__ */ jsx(FormattedPrice, { price, className: "text-lg" }),
          /* @__PURE__ */ jsx("div", { className: "mt-12 text-base", children: plan.description }),
          /* @__PURE__ */ jsx(FeatureList, { plan })
        ] }),
        /* @__PURE__ */ jsx(ContinueButton, { product: plan, price })
      );
    })
  ] }, "plan-list");
}
function FeatureList({ plan }) {
  if (!plan.feature_list.length)
    return null;
  return /* @__PURE__ */ jsxs("div", { className: "mt-32", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-10 text-sm font-semibold", children: /* @__PURE__ */ jsx(Trans, { message: "What's included" }) }),
    plan.feature_list.map((feature) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-10 text-sm", children: [
      /* @__PURE__ */ jsx(CheckIcon, { className: "text-positive", size: "sm" }),
      /* @__PURE__ */ jsx(Trans, { message: feature })
    ] }, feature))
  ] });
}
function ContinueButton({ product, price }) {
  const { subscription } = useBillingUser();
  if (!(subscription == null ? void 0 : subscription.price) || !(subscription == null ? void 0 : subscription.product))
    return null;
  if (subscription.product_id === product.id && subscription.price_id === price.id) {
    return /* @__PURE__ */ jsxs("div", { className: "flex w-[168px] items-center justify-center gap-10 text-muted", children: [
      /* @__PURE__ */ jsx(CheckIcon, { size: "md" }),
      /* @__PURE__ */ jsx(Trans, { message: "Current plan" })
    ] });
  }
  return /* @__PURE__ */ jsx(
    Button,
    {
      variant: "flat",
      color: "primary",
      className: "w-[168px]",
      size: "md",
      elementType: Link,
      to: `/billing/change-plan/${product.id}/${price.id}/confirm`,
      children: /* @__PURE__ */ jsx(Trans, { message: "Continue" })
    }
  );
}
function PlanSkeleton() {
  return /* @__PURE__ */ jsxs(
    m.div,
    {
      ...opacityAnimation,
      className: "border-b py-32 text-2xl",
      children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "mb-8" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "mb-14" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "mb-24" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "mb-12" })
      ]
    },
    "plan-skeleton"
  );
}
function useChangeSubscriptionPlan() {
  const { trans } = useTrans();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (props) => changePlan(props),
    onSuccess: () => {
      toast(trans(message("Plan changed.")));
      invalidateBillingUserQuery();
      navigate("/billing");
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function changePlan({ subscriptionId, ...other }) {
  return apiClient.post(`billing/subscriptions/${subscriptionId}/change-plan`, other).then((r) => r.data);
}
const previousUrl$2 = "/billing/change-plan";
function ConfirmPlanChangePage() {
  const { productId, priceId } = useParams();
  const navigate = useNavigate();
  const query = useProducts();
  const { subscription } = useBillingUser();
  const changePlan2 = useChangeSubscriptionPlan();
  if (!query.data || (subscription == null ? void 0 : subscription.price_id) == priceId) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/billing/change-plan", replace: true });
  }
  const newProduct = query.data.products.find((p) => `${p.id}` === productId);
  const newPrice = newProduct == null ? void 0 : newProduct.prices.find((p) => `${p.id}` === priceId);
  if (!newProduct || !newPrice || !subscription) {
    navigate(previousUrl$2);
    return null;
  }
  const newDate = /* @__PURE__ */ jsxs("span", { className: "whitespace-nowrap", children: [
    /* @__PURE__ */ jsx(FormattedDate, { date: subscription.renews_at, preset: "long" }),
    ";"
  ] });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Breadcrumb, { children: [
      /* @__PURE__ */ jsx(BreadcrumbItem, { isLink: true, onSelected: () => navigate("/billing"), children: /* @__PURE__ */ jsx(Trans, { message: "Billing" }) }),
      /* @__PURE__ */ jsx(BreadcrumbItem, { onSelected: () => navigate(previousUrl$2), children: /* @__PURE__ */ jsx(Trans, { message: "Plans" }) }),
      /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(Trans, { message: "Confirm" }) })
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold my-32 md:my-64", children: /* @__PURE__ */ jsx(Trans, { message: "Confirm your new plan" }) }),
    /* @__PURE__ */ jsx(BillingPlanPanel, { title: /* @__PURE__ */ jsx(Trans, { message: "Changing to" }), children: /* @__PURE__ */ jsxs("div", { className: "max-w-[464px]", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xl font-bold", children: newProduct.name }),
      /* @__PURE__ */ jsx(FormattedPrice, { price: newPrice, className: "text-lg" }),
      /* @__PURE__ */ jsx("div", { className: "text-base mt-12 border-b pb-24 mb-48", children: /* @__PURE__ */ jsx(
        Trans,
        {
          message: "You will be charged the new price starting :date",
          values: { date: newDate }
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "flat",
            color: "primary",
            size: "md",
            className: "w-full mb-16",
            onClick: () => {
              changePlan2.mutate({
                subscriptionId: subscription.id,
                newProductId: newProduct.id,
                newPriceId: newPrice.id
              });
            },
            disabled: changePlan2.isPending,
            children: /* @__PURE__ */ jsx(Trans, { message: "Confirm" })
          }
        ) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            className: "w-full",
            to: previousUrl$2,
            elementType: Link,
            children: /* @__PURE__ */ jsx(Trans, { message: "Go back" })
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted mt-12", children: /* @__PURE__ */ jsx(Trans, { message: "By confirming your new plan, you agree to our terms of Service and privacy policy." }) })
      ] })
    ] }) })
  ] });
}
const previousUrl$1 = "/billing";
function ConfirmPlanCancellationPage() {
  const navigate = useNavigate();
  const query = useProducts();
  const { subscription } = useBillingUser();
  const cancelSubscription = useCancelSubscription();
  const product = subscription == null ? void 0 : subscription.product;
  const price = subscription == null ? void 0 : subscription.price;
  if (!query.data) {
    return null;
  }
  if (!subscription || !product || !price) {
    navigate(previousUrl$1);
    return null;
  }
  const renewDate = /* @__PURE__ */ jsx("span", { className: "whitespace-nowrap", children: /* @__PURE__ */ jsx(FormattedDate, { date: subscription.renews_at, preset: "long" }) });
  const handleSubscriptionCancel = () => {
    cancelSubscription.mutate(
      {
        subscriptionId: subscription.id
      },
      {
        onSuccess: () => {
          invalidateBillingUserQuery();
          navigate("/billing");
        }
      }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Breadcrumb, { children: [
      /* @__PURE__ */ jsx(BreadcrumbItem, { isLink: true, onSelected: () => navigate(previousUrl$1), children: /* @__PURE__ */ jsx(Trans, { message: "Billing" }) }),
      /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" }) })
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold my-32 md:my-64", children: /* @__PURE__ */ jsx(Trans, { message: "Cancel your plan" }) }),
    /* @__PURE__ */ jsx(BillingPlanPanel, { title: /* @__PURE__ */ jsx(Trans, { message: "Current plan" }), children: /* @__PURE__ */ jsxs("div", { className: "max-w-[464px]", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xl font-bold", children: product.name }),
      /* @__PURE__ */ jsx(FormattedPrice, { price, className: "text-lg" }),
      /* @__PURE__ */ jsxs("div", { className: "text-base mt-12 border-b pb-24 mb-48", children: [
        /* @__PURE__ */ jsx(
          Trans,
          {
            message: "Your plan will be canceled, but is still available until the end of your billing period on :date",
            values: { date: renewDate }
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mt-20", children: /* @__PURE__ */ jsx(Trans, { message: "If you change your mind, you can renew your subscription." }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "flat",
            color: "primary",
            size: "md",
            className: "w-full mb-16",
            onClick: handleSubscriptionCancel,
            disabled: cancelSubscription.isPending,
            children: /* @__PURE__ */ jsx(Trans, { message: "Cancel plan" })
          }
        ) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            className: "w-full",
            to: previousUrl$1,
            elementType: Link,
            children: /* @__PURE__ */ jsx(Trans, { message: "Go back" })
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted mt-12", children: /* @__PURE__ */ jsx(Trans, { message: "By cancelling your plan, you agree to our terms of service and privacy policy." }) })
      ] })
    ] }) })
  ] });
}
const previousUrl = "/billing";
function ConfirmPlanRenewalPage() {
  const navigate = useNavigate();
  const query = useProducts();
  const { subscription } = useBillingUser();
  const resumeSubscription = useResumeSubscription();
  const product = subscription == null ? void 0 : subscription.product;
  const price = subscription == null ? void 0 : subscription.price;
  if (!query.data) {
    return null;
  }
  if (!subscription || !product || !price) {
    navigate(previousUrl);
    return null;
  }
  const endDate = /* @__PURE__ */ jsxs("span", { className: "whitespace-nowrap", children: [
    /* @__PURE__ */ jsx(FormattedDate, { date: subscription.ends_at, preset: "long" }),
    ";"
  ] });
  const handleResumeSubscription = () => {
    resumeSubscription.mutate(
      {
        subscriptionId: subscription.id
      },
      {
        onSuccess: () => {
          invalidateBillingUserQuery();
          navigate("/billing");
        }
      }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Breadcrumb, { children: [
      /* @__PURE__ */ jsx(BreadcrumbItem, { isLink: true, onSelected: () => navigate(previousUrl), children: /* @__PURE__ */ jsx(Trans, { message: "Billing" }) }),
      /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(Trans, { message: "Renew" }) })
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold my-32 md:my-64", children: /* @__PURE__ */ jsx(Trans, { message: "Renew your plan" }) }),
    /* @__PURE__ */ jsx(BillingPlanPanel, { title: /* @__PURE__ */ jsx(Trans, { message: "Current plan" }), children: /* @__PURE__ */ jsxs("div", { className: "max-w-[464px]", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xl font-bold", children: product.name }),
      /* @__PURE__ */ jsx(FormattedPrice, { price, className: "text-lg" }),
      /* @__PURE__ */ jsx("div", { className: "text-base mt-12 border-b pb-24 mb-48", children: /* @__PURE__ */ jsx(
        Trans,
        {
          message: "This plan will no longer be canceled. It will renew on :date",
          values: { date: endDate }
        }
      ) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "flat",
          color: "primary",
          size: "md",
          className: "w-full mb-16",
          onClick: handleResumeSubscription,
          disabled: resumeSubscription.isPending,
          children: /* @__PURE__ */ jsx(Trans, { message: "Renew plan" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          className: "w-full",
          to: previousUrl,
          elementType: Link,
          children: /* @__PURE__ */ jsx(Trans, { message: "Go back" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "text-xs text-muted mt-12", children: /* @__PURE__ */ jsx(Trans, { message: "By renewing your plan, you agree to our terms of service and privacy policy." }) })
    ] }) })
  ] });
}
function CancelledPlanPanel() {
  const { subscription } = useBillingUser();
  if (!(subscription == null ? void 0 : subscription.price) || !(subscription == null ? void 0 : subscription.product))
    return null;
  const endingDate = /* @__PURE__ */ jsx("span", { className: "whitespace-nowrap", children: /* @__PURE__ */ jsx(FormattedDate, { preset: "long", date: subscription.ends_at }) });
  return /* @__PURE__ */ jsx(BillingPlanPanel, { title: /* @__PURE__ */ jsx(Trans, { message: "Current plan" }), children: /* @__PURE__ */ jsxs("div", { className: "mt-24 flex flex-col justify-between gap-20", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(
        Chip,
        {
          className: "mb-10 w-min",
          size: "xs",
          radius: "rounded",
          color: "danger",
          children: /* @__PURE__ */ jsx(Trans, { message: "Canceled" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "mb-2 text-xl font-bold", children: subscription.product.name }),
      /* @__PURE__ */ jsx(FormattedPrice, { className: "mb-8 text-xl", price: subscription.price }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-8 text-base", children: [
        /* @__PURE__ */ jsx(CalendarTodayIcon, { size: "sm", className: "text-muted" }),
        /* @__PURE__ */ jsx("div", { className: "flex-auto", children: /* @__PURE__ */ jsx(
          Trans,
          {
            message: "Your plan will be canceled on :date",
            values: { date: endingDate }
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-[233px]", children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "flat",
        color: "primary",
        size: "md",
        className: "mb-12 w-full",
        elementType: Link,
        to: "/billing/renew",
        children: /* @__PURE__ */ jsx(Trans, { message: "Renew plan" })
      }
    ) })
  ] }) });
}
function ActivePlanPanel() {
  const { subscription } = useBillingUser();
  if (!(subscription == null ? void 0 : subscription.price) || !(subscription == null ? void 0 : subscription.product))
    return null;
  const renewDate = /* @__PURE__ */ jsx(FormattedDate, { preset: "long", date: subscription.renews_at });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    subscription.past_due ? /* @__PURE__ */ jsx(PastDueMessage, {}) : null,
    /* @__PURE__ */ jsx(BillingPlanPanel, { title: /* @__PURE__ */ jsx(Trans, { message: "Current plan" }), children: /* @__PURE__ */ jsxs("div", { className: "mt-24 flex justify-between gap-20", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "mb-2 text-xl font-bold", children: subscription.product.name }),
        /* @__PURE__ */ jsx(
          FormattedPrice,
          {
            className: "mb-2 text-xl",
            price: subscription.price
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "text-base", children: /* @__PURE__ */ jsx(
          Trans,
          {
            message: "Your plan renews on :date",
            values: { date: renewDate }
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-[233px]", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "flat",
            color: "primary",
            size: "md",
            className: "mb-12 w-full",
            elementType: Link,
            to: "/billing/change-plan",
            disabled: subscription.gateway_name === "none",
            children: /* @__PURE__ */ jsx(Trans, { message: "Change plan" })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            color: "danger",
            size: "md",
            className: "w-full",
            elementType: Link,
            to: "/billing/cancel",
            children: /* @__PURE__ */ jsx(Trans, { message: "Cancel plan" })
          }
        )
      ] })
    ] }) })
  ] });
}
function PastDueMessage() {
  return /* @__PURE__ */ jsx(
    SectionHelper,
    {
      className: "mb-24",
      color: "danger",
      title: "Payment is past due",
      description: "Your recent recurring payment has failed with the payment method we have on file. Please update your payment method to avoid any service interruptions."
    }
  );
}
const paypalSvg = "/assets/paypal-c2a77c63.svg";
function PaymentMethodPanel() {
  const { user, subscription } = useBillingUser();
  if (!user || !subscription)
    return null;
  const isPaypal = subscription.gateway_name === "paypal";
  const PaymentMethod = isPaypal ? PaypalPaymentMethod : CardPaymentMethod;
  return /* @__PURE__ */ jsx(BillingPlanPanel, { title: /* @__PURE__ */ jsx(Trans, { message: "Payment method" }), children: /* @__PURE__ */ jsx(
    PaymentMethod,
    {
      methodClassName: "whitespace-nowrap text-base max-w-[464px] flex items-center gap-10",
      linkClassName: "flex items-center gap-4 text-muted mt-18 block hover:underline"
    }
  ) });
}
function CardPaymentMethod({
  methodClassName,
  linkClassName
}) {
  const { user } = useBillingUser();
  if (!user)
    return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: methodClassName, children: [
      /* @__PURE__ */ jsx("span", { className: "capitalize", children: user.card_brand }),
      " ••••",
      user.card_last_four,
      user.card_expires && /* @__PURE__ */ jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsx(Trans, { message: "Expires :date", values: { date: user.card_expires } }) })
    ] }),
    /* @__PURE__ */ jsxs(Link, { className: linkClassName, to: "/billing/change-payment-method", children: [
      /* @__PURE__ */ jsx(EditIcon, { size: "sm" }),
      /* @__PURE__ */ jsx(Trans, { message: "Change payment method" })
    ] })
  ] });
}
function PaypalPaymentMethod({
  methodClassName,
  linkClassName
}) {
  const { subscription } = useBillingUser();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: methodClassName, children: /* @__PURE__ */ jsx(SvgImage, { src: paypalSvg }) }),
    /* @__PURE__ */ jsxs(
      "a",
      {
        className: linkClassName,
        href: `https://www.sandbox.paypal.com/myaccount/autopay/connect/${subscription == null ? void 0 : subscription.gateway_id}/funding`,
        target: "_blank",
        rel: "noreferrer",
        children: [
          /* @__PURE__ */ jsx(EditIcon, { size: "sm" }),
          /* @__PURE__ */ jsx(Trans, { message: "Change payment method" })
        ]
      }
    )
  ] });
}
const Endpoint = "billing/invoices";
function useInvoices(userId) {
  return useQuery({
    queryKey: [Endpoint],
    queryFn: () => fetchInvoices(userId)
  });
}
function fetchInvoices(userId) {
  return apiClient.get(Endpoint, { params: { userId } }).then((response) => response.data);
}
function InvoiceHistoryPanel() {
  var _a;
  const { user } = useBillingUser();
  const query = useInvoices(user == null ? void 0 : user.id);
  if (!user)
    return null;
  const invoices = (_a = query.data) == null ? void 0 : _a.invoices;
  return /* @__PURE__ */ jsx(BillingPlanPanel, { title: /* @__PURE__ */ jsx(Trans, { message: "Payment history" }), children: /* @__PURE__ */ jsx("div", { className: "max-w-[464px]", children: /* @__PURE__ */ jsx(AnimatePresence, { initial: false, mode: "wait", children: query.isLoading ? /* @__PURE__ */ jsx(LoadingSkeleton, {}, "loading-skeleton") : /* @__PURE__ */ jsx(InvoiceList, { invoices }, "invoices") }) }) });
}
function InvoiceList({ invoices }) {
  const { base_url } = useSettings();
  return /* @__PURE__ */ jsxs(m.div, { ...opacityAnimation, children: [
    !(invoices == null ? void 0 : invoices.length) ? /* @__PURE__ */ jsx("div", { className: "text-muted italic", children: /* @__PURE__ */ jsx(Trans, { message: "No invoices yet" }) }) : void 0,
    invoices == null ? void 0 : invoices.map((invoice) => {
      var _a;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "whitespace-nowrap text-base flex items-center justify-between gap-10 mb-14",
          children: [
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: `${base_url}/billing/invoices/${invoice.uuid}`,
                target: "_blank",
                className: "flex items-center gap-8 hover:underline",
                rel: "noreferrer",
                children: [
                  /* @__PURE__ */ jsx(FormattedDate, { date: invoice.created_at }),
                  /* @__PURE__ */ jsx(OpenInNewIcon, { size: "xs" })
                ]
              }
            ),
            invoice.subscription.price && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              FormattedCurrency,
              {
                value: invoice.subscription.price.amount,
                currency: invoice.subscription.price.currency
              }
            ) }),
            /* @__PURE__ */ jsx(
              Chip,
              {
                size: "xs",
                color: invoice.paid ? "positive" : "danger",
                radius: "rounded",
                children: invoice.paid ? /* @__PURE__ */ jsx(Trans, { message: "Paid" }) : /* @__PURE__ */ jsx(Trans, { message: "Unpaid" })
              }
            ),
            /* @__PURE__ */ jsx("div", { children: (_a = invoice.subscription.product) == null ? void 0 : _a.name })
          ]
        },
        invoice.id
      );
    })
  ] });
}
function LoadingSkeleton() {
  return /* @__PURE__ */ jsxs(m.div, { ...opacityAnimation, children: [
    /* @__PURE__ */ jsx(Skeleton, { className: "mb-14" }),
    /* @__PURE__ */ jsx(Skeleton, { className: "mb-14" }),
    /* @__PURE__ */ jsx(Skeleton, { className: "mb-14" }),
    /* @__PURE__ */ jsx(Skeleton, { className: "mb-14" }),
    /* @__PURE__ */ jsx(Skeleton, {})
  ] });
}
function BillingPage() {
  const { subscription } = useBillingUser();
  if (!(subscription == null ? void 0 : subscription.price) || !(subscription == null ? void 0 : subscription.product))
    return null;
  const planPanel = subscription.ends_at ? /* @__PURE__ */ jsx(CancelledPlanPanel, {}) : /* @__PURE__ */ jsx(ActivePlanPanel, {});
  return /* @__PURE__ */ jsxs("div", { children: [
    planPanel,
    /* @__PURE__ */ jsx(PaymentMethodPanel, {}),
    /* @__PURE__ */ jsx(InvoiceHistoryPanel, {})
  ] });
}
function BillingPageRoutes() {
  return /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsxs(
    Route,
    {
      path: "/",
      element: /* @__PURE__ */ jsx(SubscribedRoute, { children: /* @__PURE__ */ jsx(BillingPageLayout, {}) }),
      children: [
        /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(BillingPage, {}) }),
        /* @__PURE__ */ jsxs(
          Route,
          {
            path: "change-payment-method",
            element: /* @__PURE__ */ jsx(ChangePaymentMethodLayout, {}),
            children: [
              /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(ChangePaymentMethodPage, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "done", element: /* @__PURE__ */ jsx(ChangePaymentMethodDone, {}) })
            ]
          }
        ),
        /* @__PURE__ */ jsx(Route, { path: "change-plan", element: /* @__PURE__ */ jsx(ChangePlanPage, {}) }),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: "change-plan/:productId/:priceId/confirm",
            element: /* @__PURE__ */ jsx(ConfirmPlanChangePage, {})
          }
        ),
        /* @__PURE__ */ jsx(Route, { path: "cancel", element: /* @__PURE__ */ jsx(ConfirmPlanCancellationPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "renew", element: /* @__PURE__ */ jsx(ConfirmPlanRenewalPage, {}) })
      ]
    }
  ) });
}
export {
  BillingPageRoutes as default
};
//# sourceMappingURL=billing-page-routes-9cf7e81f.mjs.map
