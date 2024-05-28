import {useQuery} from '@tanstack/react-query';
import {apiClient} from '../../http/query-client';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {PaginatedBackendResponse} from '../../http/backend-response/pagination-response';
import {Product} from '../product';
import {getBootstrapData} from '@common/core/bootstrap-data/use-backend-bootstrap-data';

const endpoint = 'billing/products';

export interface FetchProductsResponse extends BackendResponse {
  products: Product[];
}

export function useProducts(loader?: string) {
  return useQuery<FetchProductsResponse>({
    queryKey: [endpoint],
    queryFn: () => fetchProducts(),
    initialData: () => {
      if (loader) {
        // @ts-ignore
        return getBootstrapData().loaders?.[loader];
      }
    },
  });
}

function fetchProducts(): Promise<FetchProductsResponse> {
  return apiClient
    .get<PaginatedBackendResponse<Product>>(endpoint)
    .then(response => {
      return {products: response.data.pagination.data};
    });
}
