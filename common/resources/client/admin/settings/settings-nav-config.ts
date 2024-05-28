import {AppSettingsNavConfig} from '@app/admin/settings/app-settings-nav-config';
import {message} from '../../i18n/message';
import {MessageDescriptor} from '../../i18n/message-descriptor';
import {To} from 'react-router-dom';
import {getBootstrapData} from '@common/core/bootstrap-data/use-backend-bootstrap-data';

export interface SettingsNavItem {
  label: MessageDescriptor;
  to: To;
}

const filteredSettingsNavConfig: (SettingsNavItem | false)[] = [
  {label: message('General'), to: 'general'},
  ...AppSettingsNavConfig,
  getBootstrapData().settings.billing.integrated && {
    label: message('Subscriptions'),
    to: 'subscriptions',
  },
  {label: message('Localization'), to: 'localization'},
  {
    label: message('Authentication'),
    to: 'authentication',
  },
  {label: message('Uploading'), to: 'uploading'},
  {label: message('Outgoing email'), to: 'outgoing-email'},
  {label: message('Cache'), to: 'cache'},
  {label: message('Analytics'), to: 'analytics'},
  {label: message('Logging'), to: 'logging'},
  {label: message('Queue'), to: 'queue'},
  {label: message('Recaptcha'), to: 'recaptcha'},
  {label: message('GDPR'), to: 'gdpr'},
  {
    label: message('Menus'),
    to: '/admin/appearance/menus',
  },
  {
    label: message('Seo'),
    to: '/admin/appearance/seo-settings',
  },
  {
    label: message('Themes'),
    to: '/admin/appearance/themes',
  },
].filter(Boolean);

export const SettingsNavConfig = filteredSettingsNavConfig as SettingsNavItem[];
