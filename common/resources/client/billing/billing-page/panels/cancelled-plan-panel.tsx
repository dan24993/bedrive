import {useBillingUser} from '../use-billing-user';
import {FormattedDate} from '../../../i18n/formatted-date';
import {BillingPlanPanel} from '../billing-plan-panel';
import {Trans} from '../../../i18n/trans';
import {Chip} from '../../../ui/forms/input-field/chip-field/chip';
import {FormattedPrice} from '../../../i18n/formatted-price';
import {CalendarTodayIcon} from '../../../icons/material/CalendarToday';
import {Button} from '../../../ui/buttons/button';
import {Link} from 'react-router-dom';

export function CancelledPlanPanel() {
  const {subscription} = useBillingUser();
  if (!subscription?.price || !subscription?.product) return null;

  const endingDate = (
    <span className="whitespace-nowrap">
      <FormattedDate preset="long" date={subscription.ends_at} />
    </span>
  );

  return (
    <BillingPlanPanel title={<Trans message="Current plan" />}>
      <div className="mt-24 flex flex-col justify-between gap-20">
        <div>
          <Chip
            className="mb-10 w-min"
            size="xs"
            radius="rounded"
            color="danger"
          >
            <Trans message="Canceled" />
          </Chip>
          <div className="mb-2 text-xl font-bold">
            {subscription.product.name}
          </div>
          <FormattedPrice className="mb-8 text-xl" price={subscription.price} />
          <div className="flex items-center gap-8 text-base">
            <CalendarTodayIcon size="sm" className="text-muted" />
            <div className="flex-auto">
              <Trans
                message="Your plan will be canceled on :date"
                values={{date: endingDate}}
              />
            </div>
          </div>
        </div>
        <div className="w-[233px]">
          <Button
            variant="flat"
            color="primary"
            size="md"
            className="mb-12 w-full"
            elementType={Link}
            to="/billing/renew"
          >
            <Trans message="Renew plan" />
          </Button>
        </div>
      </div>
    </BillingPlanPanel>
  );
}
