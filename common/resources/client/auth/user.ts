import {Permission} from './permission';
import {Subscription} from '../billing/subscription';
import {Role} from './role';
import {SocialProfile} from './social-profile';
import {AccessToken} from './access-token';
import type {ActiveSession} from '@common/auth/ui/account-settings/sessions-panel/requests/use-user-sessions';

export const USER_MODEL = 'user';

export interface User {
  id: number;
  display_name: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  email_verified_at: string;
  permissions?: Permission[];
  email: string;
  password: string;
  language: string;
  timezone: string;
  country: string;
  created_at: string;
  updated_at: string;
  subscriptions?: Omit<Subscription, 'user'>[];
  roles: Role[];
  social_profiles: SocialProfile[];
  tokens?: AccessToken[];
  has_password: boolean;
  available_space: number | null;
  unread_notifications_count?: number;
  card_last_four?: number;
  card_brand?: string;
  card_expires?: string;
  model_type: typeof USER_MODEL;
  banned_at?: string;
  followed_users?: Omit<User, 'followed_users' | 'followers'>[];
  followers_count?: number;
  followed_users_count?: number;
  followers?: Omit<User, 'followed_users' | 'followers'>[];
  last_login?: ActiveSession;
  bans?: {
    id: number;
    comment: string;
    expired_at?: string;
  }[];
  two_factor_confirmed_at?: string;
  two_factor_recovery_codes?: string[];
}
