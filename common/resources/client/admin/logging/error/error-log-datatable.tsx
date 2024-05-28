import {DataTablePage} from '@common/datatable/page/data-table-page';
import {Trans} from '@common/i18n/trans';
import {DataTableEmptyStateMessage} from '@common/datatable/page/data-table-emty-state-message';
import React, {Fragment, useEffect, useRef, useState} from 'react';
import bugFixingImage from '@common/admin/logging/error/bug-fixing.svg';
import {DataTableAddItemButton} from '@common/datatable/data-table-add-item-button';
import {DownloadIcon} from '@common/icons/material/Download';
import {ErrorLogDatatableColumns} from '@common/admin/logging/error/error-log-datatable-columns';
import {closeDialog, openDialog} from '@common/ui/overlays/store/dialog-store';
import {ErrorLogEntryDialog} from '@common/admin/logging/error/error-log-entry-dialog';
import {useDataTable} from '@common/datatable/page/data-table-context';
import {Select} from '@common/ui/forms/select/select';
import {Item} from '@common/ui/forms/listbox/item';
import {Skeleton} from '@common/ui/skeleton/skeleton';
import {ErrorLogItem} from '@common/admin/logging/error/error-log-item';
import {Button} from '@common/ui/buttons/button';
import {ConfirmationDialog} from '@common/ui/overlays/dialog/confirmation-dialog';
import {useDeleteErrorLog} from '@common/admin/logging/error/use-delete-error-log';
import {FormattedBytes} from '@common/uploads/formatted-bytes';

interface ErrorLogFile {
  name: string;
  identifier: string;
  size: number;
}

export function ErrorLogDatatable() {
  return (
    <DataTablePage
      padding="pt-12 md:pt-24"
      endpoint="logs/error"
      title={<Trans message="Error log" />}
      onRowAction={item => {
        openDialog(ErrorLogEntryDialog, {error: item});
      }}
      columns={ErrorLogDatatableColumns}
      actions={<Actions />}
      enableSelection={false}
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={bugFixingImage}
          title={<Trans message="No errors have been logged yet" />}
          filteringTitle={<Trans message="No matching error log entries" />}
        />
      }
    />
  );
}

function Actions() {
  const {query, setParams} = useDataTable<
    ErrorLogItem,
    {files: ErrorLogFile[]; selectedFile?: string}
  >();

  const setOnce = useRef(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // set initial selected file once files are loaded
  useEffect(() => {
    if (query.data?.files?.length && !setOnce.current) {
      setOnce.current = true;
      const firstFile = query.data.files[0].identifier;
      setSelectedFile(query.data.files[0].identifier);
      // prevent unnecessary http call
      if (firstFile !== query.data.selectedFile) {
        setParams({file: query.data.files[0].identifier});
      }
    }
  }, [query.data, setParams, setOnce]);

  return (
    <Fragment>
      <FileSelector
        files={query.data?.files ?? null}
        selectedFile={selectedFile}
        onSelected={file => {
          setSelectedFile(file.identifier);
          setParams({file: file.identifier});
        }}
      />
      <Button
        variant="outline"
        color="danger"
        disabled={!selectedFile}
        onClick={() =>
          openDialog(ConfirmDeleteDialog, {identifier: selectedFile})
        }
      >
        <Trans message="Delete" />
      </Button>
      {selectedFile && (
        <DataTableAddItemButton
          elementType="a"
          download={
            query.data?.files.find(f => f.identifier === selectedFile)?.name
          }
          href={`api/v1/logs/error/${selectedFile}/download`}
          icon={<DownloadIcon />}
        >
          <Trans message="Download log" />
        </DataTableAddItemButton>
      )}
    </Fragment>
  );
}

interface FileSelectorProps {
  files: ErrorLogFile[] | null;
  selectedFile: string | null;
  onSelected: (file: ErrorLogFile) => void;
}
function FileSelector({files, selectedFile, onSelected}: FileSelectorProps) {
  // files have not loaded yet, show skeleton
  if (!files) {
    return <Skeleton variant="rect" className="max-w-[210px]" />;
  }

  // no error logs yet, hide select completely
  if (!files.length) {
    return null;
  }

  return (
    <Select
      selectionMode="single"
      selectedValue={selectedFile}
      size="sm"
      minWidth="min-w-[210px]"
    >
      {files?.map(file => (
        <Item
          key={file.identifier}
          value={file.identifier}
          onSelected={() => onSelected(file)}
        >
          {file.name} (<FormattedBytes bytes={file.size} />)
        </Item>
      ))}
    </Select>
  );
}

interface ConfirmDeleteDialogProps {
  identifier: string;
}
function ConfirmDeleteDialog({identifier}: ConfirmDeleteDialogProps) {
  const deleteLog = useDeleteErrorLog();
  return (
    <ConfirmationDialog
      title={<Trans message="Delete log file" />}
      body={<Trans message="Are you sure you want to delete this log file?" />}
      confirm={<Trans message="Delete" />}
      onConfirm={() =>
        deleteLog.mutate({identifier}, {onSuccess: () => closeDialog()})
      }
      isLoading={deleteLog.isPending}
      isDanger
    />
  );
}
