import {MetaTag} from '@common/seo/meta-tag';

export interface BackendResponse {
  status?: string;
  seo?: MetaTag[];
  // whether seo tags were already set with initial response from server for this data
  set_seo?: boolean;
}
