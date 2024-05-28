import {ReactNode} from 'react';

interface Props {
  id: string;
  title: ReactNode;
  titleSuffix?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
}
export function AccountSettingsPanel({
  id,
  title,
  titleSuffix,
  children,
  actions,
}: Props) {
  return (
    <section
      id={id}
      className="mb-24 w-full rounded-panel border bg px-24 py-20"
    >
      <div className="flex items-center gap-14 border-b pb-10">
        <div className="text-lg font-light">{title}</div>
        {titleSuffix && <div className="ml-auto">{titleSuffix}</div>}
      </div>
      <div className="pt-24">{children}</div>
      {actions && (
        <div className="mt-36 flex justify-end border-t pt-10">{actions}</div>
      )}
    </section>
  );
}
