import {useShareableLinkPage} from '../queries/use-shareable-link-page';
import {useAuth} from '@common/auth/use-auth';
import {useFileEntryUrls} from '@common/uploads/hooks/file-entry-urls';
import {useImportIntoOwnDrive} from './queries/import-into-own-drive';
import {Button} from '@common/ui/buttons/button';
import {FileDownloadIcon} from '@common/icons/material/FileDownload';
import {downloadFileFromUrl} from '@common/uploads/utils/download-file-from-url';
import {Trans} from '@common/i18n/trans';
import {
  Menu,
  MenuItem,
  MenuTrigger,
} from '@common/ui/navigation/menu/menu-trigger';
import {IconButton} from '@common/ui/buttons/icon-button';
import {KeyboardArrowDownIcon} from '@common/icons/material/KeyboardArrowDown';
import {ImportExportIcon} from '@common/icons/material/ImportExport';
import React, {Fragment} from 'react';
import {Tooltip} from '@common/ui/tooltip/tooltip';

export function ShareableLinkPageActionButtons() {
  const {link} = useShareableLinkPage();
  const {user, isLoggedIn} = useAuth();
  const {downloadUrl} = useFileEntryUrls(link?.entry);
  const importIntoOwnDrive = useImportIntoOwnDrive();
  const alreadyImported = link?.entry?.users!.find(u => u.id === user?.id);

  if (!link?.entry) return null;

  return (
    <div>
      {link.allow_download && <DownloadButton downloadUrl={downloadUrl} />}
      {!alreadyImported && isLoggedIn && link.allow_edit && (
        <MenuTrigger
          onItemSelected={key => {
            if (key === 'import') {
              importIntoOwnDrive.mutate({linkId: link.id});
            } else if (key === 'download') {
              if (downloadUrl) {
                downloadFileFromUrl(downloadUrl);
              }
            }
          }}
        >
          <IconButton className="ml-6" disabled={importIntoOwnDrive.isPending}>
            <KeyboardArrowDownIcon />
          </IconButton>
          <Menu>
            <MenuItem value="download" startIcon={<FileDownloadIcon />}>
              <Trans message="Download" />
            </MenuItem>
            <MenuItem value="import" startIcon={<ImportExportIcon />}>
              <Trans message="Save a copy to your own drive" />
            </MenuItem>
          </Menu>
        </MenuTrigger>
      )}
    </div>
  );
}

interface DownloadButtonProps {
  downloadUrl: string | undefined;
}
function DownloadButton({downloadUrl}: DownloadButtonProps) {
  return (
    <Fragment>
      <Tooltip label={<Trans message="Download" />}>
        <IconButton
          className="md:hidden"
          onClick={() => {
            if (downloadUrl) {
              downloadFileFromUrl(downloadUrl);
            }
          }}
        >
          <FileDownloadIcon />
        </IconButton>
      </Tooltip>
      <Button
        className="max-md:hidden"
        size="sm"
        variant="flat"
        color="chip"
        startIcon={<FileDownloadIcon />}
        onClick={() => {
          if (downloadUrl) {
            downloadFileFromUrl(downloadUrl);
          }
        }}
      >
        <Trans message="Download" />
      </Button>
    </Fragment>
  );
}
