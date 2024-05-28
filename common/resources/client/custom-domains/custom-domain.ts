import {User} from '../auth/user';

export interface CustomDomain<R = Record<string, any>> {
  id: number;
  host: string;
  user_id: number;
  user?: User;
  global: boolean;
  created_at: string;
  updated_at: string;
  resource?: R;
  model_type: 'customDomain';
}
