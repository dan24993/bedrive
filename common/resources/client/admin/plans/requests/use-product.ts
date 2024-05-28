import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient} from '@common/http/query-client';
import {useParams} from 'react-router-dom';
import {Product} from '@common/billing/product';

const Endpoint = (id: number | string) => `billing/products/${id}`;

export interface FetchRoleResponse extends BackendResponse {
  product: Product;
}

export function useProduct() {
  const {productId} = useParams();
  return useQuery({
    queryKey: [Endpoint(productId!)],
    queryFn: () => fetchProduct(productId!),
  });
}

function fetchProduct(productId: number | string): Promise<FetchRoleResponse> {
  return apiClient.get(Endpoint(productId)).then(response => response.data);
}
