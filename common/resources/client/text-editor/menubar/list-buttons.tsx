import React from 'react';
import clsx from 'clsx';
import {IconButton} from '../../ui/buttons/icon-button';
import {FormatListBulletedIcon} from '../../icons/material/FormatListBulleted';
import {FormatListNumberedIcon} from '../../icons/material/FormatListNumbered';
import {MenubarButtonProps} from './menubar-button-props';
import {Tooltip} from '@common/ui/tooltip/tooltip';
import {Trans} from '@common/i18n/trans';

export function ListButtons({editor, size}: MenubarButtonProps) {
  const bulletActive = editor.isActive('bulletList');
  const orderedActive = editor.isActive('orderedList');
  return (
    <span className={clsx('flex-shrink-0', 'whitespace-nowrap')}>
      <Tooltip label={<Trans message="Bulleted list" />}>
        <IconButton
          size={size}
          color={bulletActive ? 'primary' : null}
          onClick={() => {
            editor.commands.focus();
            editor.commands.toggleBulletList();
          }}
        >
          <FormatListBulletedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip label={<Trans message="Numbered list" />}>
        <IconButton
          size={size}
          color={orderedActive ? 'primary' : null}
          onClick={() => {
            editor.commands.focus();
            editor.commands.toggleOrderedList();
          }}
        >
          <FormatListNumberedIcon />
        </IconButton>
      </Tooltip>
    </span>
  );
}
