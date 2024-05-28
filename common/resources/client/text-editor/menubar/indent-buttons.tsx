import React from 'react';
import clsx from 'clsx';
import {IconButton} from '../../ui/buttons/icon-button';
import {FormatIndentDecreaseIcon} from '../../icons/material/FormatIndentDecrease';
import {FormatIndentIncreaseIcon} from '../../icons/material/FormatIndentIncrease';
import {MenubarButtonProps} from './menubar-button-props';
import {Tooltip} from '@common/ui/tooltip/tooltip';
import {Trans} from '@common/i18n/trans';

export function IndentButtons({editor, size}: MenubarButtonProps) {
  return (
    <span className={clsx('flex-shrink-0', 'whitespace-nowrap')}>
      <Tooltip label={<Trans message="Decrease indent" />}>
        <IconButton
          size={size}
          onClick={() => {
            editor.commands.focus();
            editor.commands.outdent();
          }}
        >
          <FormatIndentDecreaseIcon />
        </IconButton>
      </Tooltip>
      <Tooltip label={<Trans message="Increase indent" />}>
        <IconButton
          size={size}
          onClick={() => {
            editor.commands.focus();
            editor.commands.indent();
          }}
        >
          <FormatIndentIncreaseIcon />
        </IconButton>
      </Tooltip>
    </span>
  );
}
