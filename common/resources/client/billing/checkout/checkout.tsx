import {Navigate, useParams} from 'react-router-dom';
import {Trans} from '../../i18n/trans';
import {CheckoutLayout} from './checkout-layout';
import {CheckoutProductSummary} from './checkout-product-summary';
import {usePaypal} from './paypal/use-paypal';
import {StripeElementsForm} from './stripe/stripe-elements-form';
import {Fragment} from 'react';
import {useProducts} from '../pricing-table/use-products';
import {FullPageLoader} from '../../ui/progress/full-page-loader';
import {useSettings} from '../../core/settings/use-settings';

export function Checkout() {
  const {productId, priceId} = useParams();
  const productQuery = useProducts();
  const {paypalElementRef} = usePaypal({
    productId,
    priceId,
  });
  const {
    base_url,
    billing: {stripe},
  } = useSettings();

  if (productQuery.isLoading) {
    return <FullPageLoader screen />;
  }

  const product = productQuery.data?.products.find(
    p => p.id === parseInt(productId!)
  );
  const price = product?.prices.find(p => p.id === parseInt(priceId!));

  // make sure product and price exists in backend
  if (!product || !price || productQuery.status === 'error') {
    return <Navigate to="/pricing" replace />;
  }

  return (
    <CheckoutLayout>
      <Fragment>
        <h1 className="mb-40 text-4xl">
          <Trans message="Checkout" />
        </h1>
        {stripe.enable ? (
          <Fragment>
            <StripeElementsForm
              productId={productId}
              priceId={priceId}
              submitLabel={<Trans message="Upgrade" />}
              type="subscription"
              returnUrl={`${base_url}/checkout/${productId}/${priceId}/stripe/done`}
            />
            <Separator />
          </Fragment>
        ) : null}
        <div ref={paypalElementRef} />
        <div className="mt-30 text-xs text-muted">
          <Trans message="You’ll be charged until you cancel your subscription. Previous charges won’t be refunded when you cancel unless it’s legally required. Your payment data is encrypted and secure. By subscribing your agree to our terms of service and privacy policy." />
        </div>
      </Fragment>
      <CheckoutProductSummary />
    </CheckoutLayout>
  );
}

function Separator() {
  return (
    <div className="relative my-20 text-center before:absolute before:left-0 before:top-1/2 before:h-1 before:w-full before:-translate-y-1/2 before:bg-divider">
      <span className="relative z-10 bg px-10 text-sm text-muted">
        <Trans message="or" />
      </span>
    </div>
  );
}
