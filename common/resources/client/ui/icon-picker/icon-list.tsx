import React, {ComponentType, Fragment} from 'react';
import * as Icons from '../../icons/material/all-icons';
import {ButtonBase} from '../buttons/button-base';
import {SvgIconProps} from '../../icons/svg-icon';
import {elementToTree, IconTree} from '../../icons/create-svg-icon';
import {iconGridStyle} from './icon-grid-style';
import {useFilter} from '../../i18n/use-filter';
import clsx from 'clsx';
import {Trans} from '../../i18n/trans';
import {YoutubeIcon} from '@common/icons/social/youtube';
import {AmazonIcon} from '@common/icons/social/amazon';
import {AppleIcon} from '@common/icons/social/apple';
import {BandcampIcon} from '@common/icons/social/bandcamp';
import {EnvatoIcon} from '@common/icons/social/envato';
import {FacebookIcon} from '@common/icons/social/facebook';
import {InstagramIcon} from '@common/icons/social/instagram';
import {LinkedinIcon} from '@common/icons/social/linkedin';
import {PatreonIcon} from '@common/icons/social/patreon';
import {PinterestIcon} from '@common/icons/social/pinterest';
import {SnapchatIcon} from '@common/icons/social/snapchat';
import {SoundcloudIcon} from '@common/icons/social/soundcloud';
import {SpotifyIcon} from '@common/icons/social/spotify';
import {TelegramIcon} from '@common/icons/social/telegram';
import {TiktokIcon} from '@common/icons/social/tiktok';
import {TwitchIcon} from '@common/icons/social/twitch';
import {TwitterIcon} from '@common/icons/social/twitter';
import {WhatsappIcon} from '@common/icons/social/whatsapp';

const socialIcons: [string, ComponentType<SvgIconProps>][] = [
  ['amazon', AmazonIcon],
  ['apple', AppleIcon],
  ['bandcamp', BandcampIcon],
  ['envato', EnvatoIcon],
  ['facebook', FacebookIcon],
  ['instagram', InstagramIcon],
  ['linkedin', LinkedinIcon],
  ['patreon', PatreonIcon],
  ['pinterest', PinterestIcon],
  ['snapchat', SnapchatIcon],
  ['soundcloud', SoundcloudIcon],
  ['spotify', SpotifyIcon],
  ['telegram', TelegramIcon],
  ['tiktok', TiktokIcon],
  ['twitch', TwitchIcon],
  ['twitter', TwitterIcon],
  ['whatsapp', WhatsappIcon],
  ['youtube', YoutubeIcon],
];
const entries = Object.entries(Icons)
  .map(([name, cmp]) => {
    const prettyName = name
      .replace('Icon', '')
      .replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`);
    return [prettyName, cmp] as [string, ComponentType<SvgIconProps>];
  })
  .concat(socialIcons);

interface IconListProps {
  onIconSelected: (icon: IconTree[] | null) => void;
  searchQuery: string;
}
export default function IconList({onIconSelected, searchQuery}: IconListProps) {
  const {contains} = useFilter({
    sensitivity: 'base',
  });
  const matchedEntries = entries.filter(([name]) =>
    contains(name, searchQuery)
  );

  return (
    <Fragment>
      <ButtonBase
        className={clsx(iconGridStyle.button, 'diagonal-lines')}
        onClick={e => {
          onIconSelected(null);
        }}
      >
        <Trans message="None" />
      </ButtonBase>
      {matchedEntries.map(([name, Icon]) => (
        <ButtonBase
          key={name}
          className={iconGridStyle.button}
          onClick={e => {
            const svgTree = elementToTree(
              e.currentTarget.querySelector('svg') as SVGElement
            );
            // only emit svg children, and not svg tag itself
            onIconSelected(svgTree.child as IconTree[]);
          }}
        >
          <Icon className="block text-muted icon-lg" />
          <span className="mt-16 block whitespace-normal text-xs capitalize">
            {name}
          </span>
        </ButtonBase>
      ))}
    </Fragment>
  );
}
