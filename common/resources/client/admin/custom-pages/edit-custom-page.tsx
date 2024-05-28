import {useCustomPage} from '@common/custom-page/use-custom-page';
import React, {Fragment, Suspense} from 'react';
import {PageMetaTags} from '@common/http/page-meta-tags';
import {PageStatus} from '@common/http/page-status';
import {CustomPage} from '@common/admin/custom-pages/custom-page';
import {FormProvider, useForm} from 'react-hook-form';
import {useUpdateCustomPage} from '@common/admin/custom-pages/requests/use-update-custom-page';
import {FileUploadProvider} from '@common/uploads/uploader/file-upload-provider';
import {ArticleEditorTitle} from '@common/article-editor/article-editor-title';
import {ArticleEditorStickyHeader} from '@common/article-editor/article-editor-sticky-header';
import {useNavigate} from '@common/utils/hooks/use-navigate';
import {CreateCustomPagePayload} from '@common/admin/custom-pages/requests/use-create-custom-page';
import {FullPageLoader} from '@common/ui/progress/full-page-loader';

const ArticleBodyEditor = React.lazy(
  () => import('@common/article-editor/article-body-editor'),
);

export function EditCustomPage() {
  const query = useCustomPage();

  return query.data ? (
    <Fragment>
      <PageMetaTags query={query} />
      <PageContent page={query.data.page} />
    </Fragment>
  ) : (
    <div className="relative w-full h-full">
      <PageStatus query={query} />
    </div>
  );
}

interface PageContentProps {
  page: CustomPage;
}
function PageContent({page}: PageContentProps) {
  const navigate = useNavigate();
  const crupdatePage = useUpdateCustomPage();
  const form = useForm<CreateCustomPagePayload>({
    defaultValues: {
      title: page.title,
      slug: page.slug,
      body: page.body,
    },
  });

  const handleSave = (editorContent: string) => {
    crupdatePage.mutate(
      {
        ...form.getValues(),
        body: editorContent,
      },
      {
        onSuccess: () => navigate('../..', {relative: 'path'}),
      },
    );
  };

  return (
    <Suspense fallback={<FullPageLoader />}>
      <ArticleBodyEditor initialContent={page.body}>
        {(content, editor) => (
          <FileUploadProvider>
            <FormProvider {...form}>
              <ArticleEditorStickyHeader
                editor={editor}
                backLink="../.."
                isLoading={crupdatePage.isPending}
                onSave={handleSave}
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
