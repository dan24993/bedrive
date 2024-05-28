import {Trans} from '../../i18n/trans';
import {Product} from '../product';
import {CheckIcon} from '@common/icons/material/Check';

interface FeatureListProps {
  product: Product;
}

export function ProductFeatureList({product}: FeatureListProps) {
  if (!product.feature_list.length) return null;

  return (
    <div className="mt-32 border-t pt-24">
      <div className="mb-10 text-sm font-semibold">
        <Trans message="What's included" />
      </div>
      {product.feature_list.map(feature => (
        <div key={feature} className="flex items-center gap-10 py-6 text-sm">
          <CheckIcon className="text-primary" size="sm" />
          <Trans message={feature} />
        </div>
      ))}
    </div>
  );
}
