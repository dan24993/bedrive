import React, {useState} from 'react';
import {useTrans} from '@common/i18n/use-trans';
import {useFormContext} from 'react-hook-form';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import clsx from 'clsx';
import {EditIcon} from '@common/icons/material/Edit';
import {CreateCustomPagePayload} from '@common/admin/custom-pages/requests/use-create-custom-page';

export function ArticleEditorTitle() {
  const [editingTitle, setEditingTitle] = useState(false);
  const {trans} = useTrans();
  const form = useFormContext<CreateCustomPagePayload>();
  const watchedTitle = form.watch('title');

  const titlePlaceholder = trans({message: 'Title'});

  if (editingTitle) {
    return (
      <FormTextField
        placeholder={titlePlaceholder}
        autoFocus
        className="mb-30"
        onBlur={() => {
          setEditingTitle(false);
        }}
        name="title"
        required
      />
    );
  }
  return (
    <h1
      tabIndex={0}
      onClick={() => {
        setEditingTitle(true);
      }}
      onFocus={() => {
        setEditingTitle(true);
      }}
      className={clsx(
        'hover:bg-primary/focus rounded cursor-pointer',
        !watchedTitle && 'text-muted'
      )}
    >
      {watchedTitle || titlePlaceholder}
      <EditIcon className="icon-sm mx-8 mt-8 align-top text-muted" />
    </h1>
  );
}
