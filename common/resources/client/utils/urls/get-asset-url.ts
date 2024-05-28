import {getBootstrapData} from '@common/core/bootstrap-data/use-backend-bootstrap-data';
import {isAbsoluteUrl} from '@common/utils/urls/is-absolute-url';

export function getAssetUrl(url: string) {
  if (isAbsoluteUrl(url)) {
    return url;
  }
  const assetUrl =
    getBootstrapData().settings.asset_url ||
    getBootstrapData().settings.base_url;

  //remove leading slash
  url = url.replace(/^\/+/g, '');

  if (url.startsWith('assets/')) {
    return `${assetUrl}/build/${url}`;
  }

  return `${assetUrl}/${url}`;
}
