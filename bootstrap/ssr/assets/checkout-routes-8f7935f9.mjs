import { jsx, jsxs } from "react/jsx-runtime";
import { Navigate, Outlet, useParams, useSearchParams, Routes, Route } from "react-router-dom";
import { aO as useAuth, bn as removeFromLocalStorage, r as StaticPageTitle, T as Trans, aP as Navbar, C as CustomMenu, bo as LocaleSwitcher, a as apiClient, ax as FormattedPrice, bp as ProductFeatureList, bm as FormattedCurrency, p as opacityAnimation, q as Skeleton, aw as useProducts, u as useSettings, aa as FullPageLoader, a9 as useBootstrapData, a8 as useNavigate, m as message } from "../server-entry.mjs";
import { useEffect, Fragment, useRef, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { m } from "framer-motion";
import { loadScript } from "@paypal/paypal-js";
import { S as StripeElementsForm, B as BillingRedirectMessage } from "./billing-redirect-message-4c133c8b.mjs";
import { loadStripe } from "@stripe/stripe-js";
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
function NotSubscribedRoute({ children }) {
  const { isLoggedIn, isSubscribed } = useAuth();
  if (!isLoggedIn) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/register", replace: true });
  }
  if (isLoggedIn && isSubscribed) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/billing", replace: true });
  }
  return children || /* @__PURE__ */ jsx(Outlet, {});
}
function CheckoutLayout({ children }) {
  const [left, right] = children;
  useEffect(() => {
    removeFromLocalStorage("be.onboarding.selected");
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(StaticPageTitle, { children: /* @__PURE__ */ jsx(Trans, { message: "Checkout" }) }),
    /* @__PURE__ */ jsx(
      Navbar,
      {
        size: "sm",
        color: "transparent",
        className: "z-10 mb-20 md:mb-0",
        textColor: "text-main",
        logoColor: "dark",
        darkModeColor: "transparent",
        menuPosition: "checkout-page-navbar"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "md:flex w-full mx-auto justify-between px-20 md:px-0 md:pt-128 md:max-w-950", children: [
      /* @__PURE__ */ jsx("div", { className: "hidden md:block fixed right-0 top-0 w-1/2 h-full bg-alt shadow-[15px_0_30px_0_rgb(0_0_0_/_18%)]" }),
      /* @__PURE__ */ jsxs("div", { className: "md:w-400 overflow-hidden", children: [
        left,
        /* @__PURE__ */ jsx(
          CustomMenu,
          {
            menu: "checkout-page-footer",
            className: "text-xs mt-50 text-muted overflow-x-auto"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mt-40", children: /* @__PURE__ */ jsx(LocaleSwitcher, {}) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "hidden md:block w-384", children: /* @__PURE__ */ jsx("div", { className: "relative z-10", children: right }) })
    ] })
  ] });
}
const endpoint = (productId) => `billing/products/${productId}`;
function useCheckoutProduct() {
  var _a;
  const { productId, priceId } = useParams();
  const query = useQuery({
    queryKey: [endpoint(productId)],
    queryFn: () => fetchProduct(productId),
    placeholderData: keepPreviousData,
    enabled: productId != null && priceId != null
  });
  const product = (_a = query.data) == null ? void 0 : _a.product;
  const price = (product == null ? void 0 : product.prices.find((p) => p.id === parseInt(priceId))) || (product == null ? void 0 : product.prices[0]);
  return { status: query.status, product, price };
}
function fetchProduct(productId) {
  return apiClient.get(endpoint(productId)).then((response) => response.data);
}
function CheckoutProductSummary({
  showBillingLine = true
}) {
  const { status, product, price } = useCheckoutProduct();
  if (status === "error" || status !== "pending" && (!product || !price)) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl mb-30", children: /* @__PURE__ */ jsx(Trans, { message: "Summary" }) }),
    status === "pending" ? /* @__PURE__ */ jsx(LoadingSkeleton, {}, "loading-skeleton") : /* @__PURE__ */ jsx(
      ProductSummary,
      {
        product,
        price,
        showBillingLine
      }
    )
  ] });
}
function ProductSummary({
  product,
  price,
  showBillingLine
}) {
  return /* @__PURE__ */ jsxs(m.div, { children: [
    /* @__PURE__ */ jsx("div", { className: "text-xl font-semibold mb-6", children: product.name }),
    product.description && /* @__PURE__ */ jsx("div", { className: "text-sm text-muted", children: product.description }),
    /* @__PURE__ */ jsx(
      FormattedPrice,
      {
        priceClassName: "font-bold text-4xl",
        periodClassName: "text-muted text-xs",
        variant: "separateLine",
        price,
        className: "mt-32"
      }
    ),
    /* @__PURE__ */ jsx(ProductFeatureList, { product }),
    showBillingLine && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-24 border-t pt-24 mt-32 font-medium", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Trans, { message: "Billed today" }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(FormattedCurrency, { value: price.amount, currency: price.currency }) })
    ] })
  ] });
}
function LoadingSkeleton() {
  return /* @__PURE__ */ jsxs(m.div, { ...opacityAnimation, className: "max-w-180", children: [
    /* @__PURE__ */ jsx(Skeleton, { className: "text-xl mb-6" }),
    /* @__PURE__ */ jsx(Skeleton, { className: "text-sm" }),
    /* @__PURE__ */ jsx(Skeleton, { className: "text-4xl mt-32" })
  ] });
}
function usePaypal({ productId, priceId }) {
  const { data } = useProducts();
  const paypalLoadStarted = useRef(false);
  const paypalButtonsRendered = useRef(false);
  const [paypalIsLoaded, setPaypalIsLoaded] = useState(false);
  const paypalElementRef = useRef(null);
  const {
    base_url,
    billing: {
      stripe: { enable: stripeEnabled },
      paypal: { enable: paypalEnabled, public_key }
    }
  } = useSettings();
  useEffect(() => {
    if (!paypalEnabled || !public_key || paypalLoadStarted.current)
      return;
    loadScript({
      clientId: public_key,
      intent: "subscription",
      vault: true,
      disableFunding: stripeEnabled ? "card" : void 0
    }).then(() => {
      setPaypalIsLoaded(true);
    });
    paypalLoadStarted.current = true;
  }, [public_key, paypalEnabled, stripeEnabled]);
  useEffect(() => {
    var _a;
    if (!paypalIsLoaded || !((_a = window.paypal) == null ? void 0 : _a.Buttons) || !paypalElementRef.current || !(data == null ? void 0 : data.products.length) || !productId || !priceId || paypalButtonsRendered.current)
      return;
    const product = data.products.find((p) => p.id === parseInt(productId));
    const price = product == null ? void 0 : product.prices.find((p) => p.id === parseInt(priceId));
    window.paypal.Buttons({
      style: {
        label: "pay"
      },
      createSubscription: (data2, actions) => {
        return actions.subscription.create({
          application_context: {
            shipping_preference: "NO_SHIPPING"
          },
          plan_id: price == null ? void 0 : price.paypal_id
        });
      },
      onApprove: (data2, actions) => {
        actions.redirect(
          `${base_url}/checkout/${productId}/${priceId}/paypal/done?subscriptionId=${data2.subscriptionID}&status=success`
        );
        return Promise.resolve();
      },
      onError: (e) => {
        location.href = `${base_url}/checkout/${productId}/${priceId}/paypal/done?status=error`;
      }
    }).render(paypalElementRef.current).then(() => {
      paypalButtonsRendered.current = true;
    });
  }, [productId, priceId, data, paypalIsLoaded, base_url]);
  return {
    paypalElementRef,
    stripeIsEnabled: public_key != null && paypalEnabled
  };
}
function Checkout() {
  var _a;
  const { productId, priceId } = useParams();
  const productQuery = useProducts();
  const { paypalElementRef } = usePaypal({
    productId,
    priceId
  });
  const {
    base_url,
    billing: { stripe }
  } = useSettings();
  if (productQuery.isLoading) {
    return /* @__PURE__ */ jsx(FullPageLoader, { screen: true });
  }
  const product = (_a = productQuery.data) == null ? void 0 : _a.products.find(
    (p) => p.id === parseInt(productId)
  );
  const price = product == null ? void 0 : product.prices.find((p) => p.id === parseInt(priceId));
  if (!product || !price || productQuery.status === "error") {
    return /* @__PURE__ */ jsx(Navigate, { to: "/pricing", replace: true });
  }
  return /* @__PURE__ */ jsxs(CheckoutLayout, { children: [
    /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-40 text-4xl", children: /* @__PURE__ */ jsx(Trans, { message: "Checkout" }) }),
      stripe.enable ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          StripeElementsForm,
          {
            productId,
            priceId,
            submitLabel: /* @__PURE__ */ jsx(Trans, { message: "Upgrade" }),
            type: "subscription",
            returnUrl: `${base_url}/checkout/${productId}/${priceId}/stripe/done`
          }
        ),
        /* @__PURE__ */ jsx(Separator, {})
      ] }) : null,
      /* @__PURE__ */ jsx("div", { ref: paypalElementRef }),
      /* @__PURE__ */ jsx("div", { className: "mt-30 text-xs text-muted", children: /* @__PURE__ */ jsx(Trans, { message: "You’ll be charged until you cancel your subscription. Previous charges won’t be refunded when you cancel unless it’s legally required. Your payment data is encrypted and secure. By subscribing your agree to our terms of service and privacy policy." }) })
    ] }),
    /* @__PURE__ */ jsx(CheckoutProductSummary, {})
  ] });
}
function Separator() {
  return /* @__PURE__ */ jsx("div", { className: "relative my-20 text-center before:absolute before:left-0 before:top-1/2 before:h-1 before:w-full before:-translate-y-1/2 before:bg-divider", children: /* @__PURE__ */ jsx("span", { className: "relative z-10 bg px-10 text-sm text-muted", children: /* @__PURE__ */ jsx(Trans, { message: "or" }) }) });
}
function CheckoutStripeDone() {
  const { invalidateBootstrapData } = useBootstrapData();
  const { productId, priceId } = useParams();
  const navigate = useNavigate();
  const {
    billing: { stripe_public_key }
  } = useSettings();
  const [params] = useSearchParams();
  const clientSecret = params.get("payment_intent_client_secret");
  const [messageConfig, setMessageConfig] = useState();
  const stripeInitiated = useRef();
  useEffect(() => {
    if (stripeInitiated.current)
      return;
    loadStripe(stripe_public_key).then(async (stripe) => {
      if (!stripe || !clientSecret) {
        setMessageConfig(getRedirectMessageConfig$1());
        return;
      }
      stripe.retrievePaymentIntent(clientSecret).then(async ({ paymentIntent }) => {
        if ((paymentIntent == null ? void 0 : paymentIntent.status) === "succeeded") {
          await storeSubscriptionDetailsLocally$1(paymentIntent.id);
          setMessageConfig(
            getRedirectMessageConfig$1("succeeded", productId, priceId)
          );
          window.location.href = "/billing";
        } else {
          setMessageConfig(
            getRedirectMessageConfig$1(
              paymentIntent == null ? void 0 : paymentIntent.status,
              productId,
              priceId
            )
          );
        }
      });
    });
    stripeInitiated.current = true;
  }, [
    stripe_public_key,
    clientSecret,
    priceId,
    productId,
    invalidateBootstrapData
  ]);
  if (!clientSecret) {
    navigate("/");
    return null;
  }
  return /* @__PURE__ */ jsxs(CheckoutLayout, { children: [
    /* @__PURE__ */ jsx(BillingRedirectMessage, { config: messageConfig }),
    /* @__PURE__ */ jsx(CheckoutProductSummary, { showBillingLine: false })
  ] });
}
function getRedirectMessageConfig$1(status, productId, priceId) {
  switch (status) {
    case "succeeded":
      return {
        message: message("Subscription successful!"),
        status: "success",
        buttonLabel: message("Return to site"),
        link: "/billing"
      };
    case "processing":
      return {
        message: message(
          "Payment processing. We'll update you when payment is received."
        ),
        status: "success",
        buttonLabel: message("Return to site"),
        link: "/billing"
      };
    case "requires_payment_method":
      return {
        message: message("Payment failed. Please try another payment method."),
        status: "error",
        buttonLabel: message("Go back"),
        link: errorLink$1(productId, priceId)
      };
    default:
      return {
        message: message("Something went wrong"),
        status: "error",
        buttonLabel: message("Go back"),
        link: errorLink$1(productId, priceId)
      };
  }
}
function errorLink$1(productId, priceId) {
  return productId && priceId ? `/checkout/${productId}/${priceId}` : "/";
}
function storeSubscriptionDetailsLocally$1(paymentIntentId) {
  return apiClient.post("billing/stripe/store-subscription-details-locally", {
    payment_intent_id: paymentIntentId
  });
}
function CheckoutPaypalDone() {
  const { invalidateBootstrapData } = useBootstrapData();
  const { productId, priceId } = useParams();
  const [params] = useSearchParams();
  const [messageConfig, setMessageConfig] = useState();
  useEffect(() => {
    const subscriptionId = params.get("subscriptionId");
    const status = params.get("status");
    if (subscriptionId && status === "success") {
      storeSubscriptionDetailsLocally(subscriptionId).then(() => {
        setMessageConfig(
          getRedirectMessageConfig("success", productId, priceId)
        );
        window.location.href = "/billing";
      });
    } else {
      setMessageConfig(getRedirectMessageConfig(status, productId, priceId));
    }
  }, [priceId, productId, params, invalidateBootstrapData]);
  return /* @__PURE__ */ jsxs(CheckoutLayout, { children: [
    /* @__PURE__ */ jsx(BillingRedirectMessage, { config: messageConfig }),
    /* @__PURE__ */ jsx(CheckoutProductSummary, { showBillingLine: false })
  ] });
}
function getRedirectMessageConfig(status, productId, priceId) {
  switch (status) {
    case "success":
      return {
        message: message("Subscription successful!"),
        status: "success",
        buttonLabel: message("Return to site"),
        link: "/billing"
      };
    default:
      return {
        message: message("Something went wrong. Please try again."),
        status: "error",
        buttonLabel: message("Go back"),
        link: errorLink(productId, priceId)
      };
  }
}
function errorLink(productId, priceId) {
  return productId && priceId ? `/checkout/${productId}/${priceId}` : "/";
}
function storeSubscriptionDetailsLocally(subscriptionId) {
  return apiClient.post("billing/paypal/store-subscription-details-locally", {
    paypal_subscription_id: subscriptionId
  });
}
function CheckoutRoutes() {
  return /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(
      Route,
      {
        path: ":productId/:priceId",
        element: /* @__PURE__ */ jsx(NotSubscribedRoute, { children: /* @__PURE__ */ jsx(Checkout, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: ":productId/:priceId/stripe/done",
        element: /* @__PURE__ */ jsx(NotSubscribedRoute, { children: /* @__PURE__ */ jsx(CheckoutStripeDone, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: ":productId/:priceId/paypal/done",
        element: /* @__PURE__ */ jsx(NotSubscribedRoute, { children: /* @__PURE__ */ jsx(CheckoutPaypalDone, {}) })
      }
    )
  ] });
}
export {
  CheckoutRoutes as default
};
//# sourceMappingURL=checkout-routes-8f7935f9.mjs.map
