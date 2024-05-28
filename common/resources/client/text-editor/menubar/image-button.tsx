import React from 'react';
import clsx from 'clsx';
import {IconButton} from '../../ui/buttons/icon-button';
import {ImageIcon} from '../../icons/material/Image';
import {MenubarButtonProps} from './menubar-button-props';
import {useActiveUpload} from '../../uploads/uploader/use-active-upload';
import {UploadInputType} from '../../uploads/types/upload-input-config';
import {Disk} from '../../uploads/types/backend-metadata';
import {Tooltip} from '@common/ui/tooltip/tooltip';
import {Trans} from '@common/i18n/trans';

const TwoMB = 2097152;

interface Props extends MenubarButtonProps {
  diskPrefix?: string;
}

export function ImageButton({editor, size, diskPrefix = 'page_media'}: Props) {
  const {selectAndUploadFile} = useActiveUpload();

  const handleUpload = () => {
    selectAndUploadFile({
      showToastOnRestrictionFail: true,
      restrictions: {
        allowedFileTypes: [UploadInputType.image],
        maxFileSize: TwoMB,
      },
      metadata: {
        diskPrefix: diskPrefix,
        disk: Disk.public,
      },
      onSuccess: entry => {
        editor.commands.focus();
        editor.commands.setImage({
          src: entry.url,
        });
      },
    });
  };

  return (
    <Tooltip label={<Trans message="Insert image" />}>
      <IconButton
        size={size}
        onClick={handleUpload}
        className={clsx('flex-shrink-0')}
      >
        <ImageIcon />
      </IconButton>
    </Tooltip>
  );
}
