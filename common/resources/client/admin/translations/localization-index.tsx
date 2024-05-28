import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {DataTablePage} from '../../datatable/page/data-table-page';
import {IconButton} from '../../ui/buttons/icon-button';
import {FormattedDate} from '../../i18n/formatted-date';
import {ColumnConfig} from '../../datatable/column-config';
import {Trans} from '../../i18n/trans';
import {Localization} from '../../i18n/localization';
import {TranslateIcon} from '../../icons/material/Translate';
import {DialogTrigger} from '../../ui/overlays/dialog/dialog-trigger';
import {UpdateLocalizationDialog} from './update-localization-dialog';
import {Tooltip} from '../../ui/tooltip/tooltip';
import {CreateLocationDialog} from './create-localization-dialog';
import {DataTableEmptyStateMessage} from '../../datatable/page/data-table-emty-state-message';
import aroundTheWorldSvg from './around-the-world.svg';
import {DataTableAddItemButton} from '../../datatable/data-table-add-item-button';
import {DeleteSelectedItemsAction} from '../../datatable/page/delete-selected-items-action';
import {
  Menu,
  MenuItem,
  MenuTrigger,
} from '@common/ui/navigation/menu/menu-trigger';
import {openDialog} from '@common/ui/overlays/store/dialog-store';
import {downloadFileFromUrl} from '@common/uploads/utils/download-file-from-url';
import {MoreVertIcon} from '@common/icons/material/MoreVert';
import {UploadInputType} from '@common/uploads/types/upload-input-config';
import {FileUploadProvider} from '@common/uploads/uploader/file-upload-provider';
import {useUploadTranslationFile} from '@common/admin/translations/use-upload-translation-file';
import {openUploadWindow} from '@common/uploads/utils/open-upload-window';

const columnConfig: ColumnConfig<Localization>[] = [
  {
    key: 'name',
    allowsSorting: true,
    sortingKey: 'name',
    visibleInMode: 'all',
    width: 'flex-3 min-w-200',
    header: () => <Trans message="Name" />,
    body: locale => locale.name,
  },
  {
    key: 'language',
    allowsSorting: true,
    sortingKey: 'language',
    header: () => <Trans message="Language code" />,
    body: locale => locale.language,
  },
  {
    key: 'updatedAt',
    allowsSorting: true,
    width: 'w-100',
    header: () => <Trans message="Last updated" />,
    body: locale => <FormattedDate date={locale.updated_at} />,
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    hideHeader: true,
    align: 'end',
    width: 'w-84 flex-shrink-0',
    visibleInMode: 'all',
    body: locale => {
      return (
        <div className="text-muted">
          <Tooltip label={<Trans message="Translate" />}>
            <IconButton
              size="md"
              elementType={Link}
              to={`${locale.id}/translate`}
            >
              <TranslateIcon />
            </IconButton>
          </Tooltip>

          <FileUploadProvider>
            <RowActionsMenuTrigger locale={locale} />
          </FileUploadProvider>
        </div>
      );
    },
  },
];

export function LocalizationIndex() {
  return (
    <DataTablePage
      endpoint="localizations"
      title={<Trans message="Localizations" />}
      columns={columnConfig}
      actions={<Actions />}
      selectedActions={<DeleteSelectedItemsAction />}
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={aroundTheWorldSvg}
          title={<Trans message="No localizations have been created yet" />}
          filteringTitle={<Trans message="No matching localizations" />}
        />
      }
    />
  );
}

function Actions() {
  return (
    <Fragment>
      <DialogTrigger type="modal">
        <DataTableAddItemButton>
          <Trans message="Add new localization" />
        </DataTableAddItemButton>
        <CreateLocationDialog />
      </DialogTrigger>
    </Fragment>
  );
}

interface RowActionsMenuTriggerProps {
  locale: Localization;
}
function RowActionsMenuTrigger({locale}: RowActionsMenuTriggerProps) {
  const uploadFile = useUploadTranslationFile();
  return (
    <MenuTrigger>
      <IconButton disabled={uploadFile.isPending}>
        <MoreVertIcon />
      </IconButton>
      <Menu>
        <MenuItem
          value="translate"
          elementType={Link}
          to={`${locale.id}/translate`}
        >
          <Trans message="Translate" />
        </MenuItem>
        <MenuItem
          value="rename"
          onSelected={() =>
            openDialog(UpdateLocalizationDialog, {localization: locale})
          }
        >
          <Trans message="Rename" />
        </MenuItem>
        <MenuItem
          value="download"
          onSelected={() =>
            downloadFileFromUrl(`api/v1/localizations/${locale.id}/download`)
          }
        >
          <Trans message="Download" />
        </MenuItem>
        <MenuItem
          value="upload"
          onSelected={async () => {
            const files = await openUploadWindow({
              types: [UploadInputType.json],
            });
            if (files.length == 1) {
              uploadFile.mutate({localeId: locale.id, file: files[0]});
            }
          }}
        >
          <Trans message="Upload" />
        </MenuItem>
      </Menu>
    </MenuTrigger>
  );
}
