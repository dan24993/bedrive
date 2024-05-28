import React, {Suspense} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {FileUploadProvider} from '@common/uploads/uploader/file-upload-provider';
import {ArticleEditorTitle} from '@common/article-editor/article-editor-title';
import {ArticleEditorStickyHeader} from '@common/article-editor/article-editor-sticky-header';
import {useNavigate} from '@common/utils/hooks/use-navigate';
import {
  CreateCustomPagePayload,
  useCreateCustomPage,
} from '@common/admin/custom-pages/requests/use-create-custom-page';
import {FullPageLoader} from '@common/ui/progress/full-page-loader';

const ArticleBodyEditor = React.lazy(
  () => import('@common/article-editor/article-body-editor'),
);

export function CreateCustomPage() {
  const navigate = useNavigate();
  const createPage = useCreateCustomPage();
  const form = useForm<CreateCustomPagePayload>();

  const handleSave = (editorContent: string) => {
    createPage.mutate(
      {
        ...form.getValues(),
        body: editorContent,
      },
      {
        onSuccess: () => navigate('../', {relative: 'path'}),
      },
    );
  };

  return (
    <Suspense fallback={<FullPageLoader />}>
      <ArticleBodyEditor>
        {(content, editor) => (
          <FileUploadProvider>
            <FormProvider {...form}>
              <ArticleEditorStickyHeader
                editor={editor}
                isLoading={createPage.isPending}
                onSave={handleSave}
                backLink="../"
              />
              <div className="mx-20">
                <div className="prose dark:prose-invert mx-auto flex-auto">
                  <ArticleEditorTitle />
                  {content}
                </div>
              </div>
            </FormProvider>
          </FileUploadProvider>
        )}
      </ArticleBodyEditor>
    </Suspense>
  );
}
