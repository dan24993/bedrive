import {Dialog} from '@common/ui/overlays/dialog/dialog';
import {DialogHeader} from '@common/ui/overlays/dialog/dialog-header';
import {Trans} from '@common/i18n/trans';
import {DialogBody} from '@common/ui/overlays/dialog/dialog-body';
import {
  IgnitionErrorPayload,
  IgnitionFrame,
} from '@common/utils/http/ignition-error-dialog/ignition-error-payload';
import {Chip} from '@common/ui/forms/input-field/chip-field/chip';
import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import {ErrorIcon} from '@common/icons/material/Error';
import {highlightCode} from '@common/text-editor/highlight/highlight-code';
import {
  IgnitionFilePath,
  IgnitionStackTrace,
} from '@common/utils/http/ignition-error-dialog/ignition-stack-trace';
import {Button} from '@common/ui/buttons/button';

// todo: add download button (download full latest error log using the same functionality as in error datatable)

interface Props {
  error: IgnitionErrorPayload;
}
export function IgnitionErrorDialog({error}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(() => {
    for (const frame of error.trace) {
      if (!('vendorGroup' in frame)) {
        return frame.flatIndex;
      }
    }
    return 0;
  });
  const selectedFrame = useMemo(() => {
    for (const frame of error.trace) {
      if ('vendorGroup' in frame) {
        for (const vendorFrame of frame.items) {
          if (vendorFrame.flatIndex === selectedIndex) {
            return vendorFrame;
          }
        }
      } else if (frame.flatIndex === selectedIndex) {
        return frame;
      }
    }
  }, [error, selectedIndex]);

  return (
    <Dialog size="fullscreen">
      <DialogHeader
        showDivider
        leftAdornment={<ErrorIcon />}
        color="text-danger"
        actions={<DownloadButton />}
      >
        <Trans message="An error occured" />
      </DialogHeader>
      <DialogBody padding="p-0 stack">
        <div className="sticky top-0 z-10 border-b bg p-24">
          <Chip className="w-max" radius="rounded-panel">
            {error.exception}
          </Chip>
          <div className="mt-16 line-clamp-2 text-lg font-semibold leading-snug">
            {error.message}
          </div>
        </div>
        <div className="flex items-stretch gap-10">
          <IgnitionStackTrace
            trace={error.trace}
            onSelectedIndexChange={setSelectedIndex}
            selectedIndex={selectedIndex}
            totalVendorGroups={error.totalVendorGroups}
          />
          {selectedFrame && <CodeSnippet frame={selectedFrame} />}
        </div>
      </DialogBody>
    </Dialog>
  );
}

interface CodeSnippetProps {
  frame: IgnitionFrame;
}
function CodeSnippet({frame}: CodeSnippetProps) {
  const codeRef = useRef<HTMLPreElement>(null!);

  const lineNumbers = Object.keys(frame.codeSnippet).map(Number);
  const highlightedIndex = lineNumbers.indexOf(frame.lineNumber);
  const lines = Object.values(frame.codeSnippet);

  return (
    <div className="sticky top-120 flex-auto">
      <div className="px-30 py-16 text-right text-muted">
        <IgnitionFilePath frame={frame} />
      </div>
      <div className="flex">
        <div className="mr-8 select-none text-right">
          {lineNumbers.map((lineNumber, index) => (
            <div
              className={clsx(
                'px-8 font-mono leading-loose text-muted',
                index == highlightedIndex && 'bg-danger/30',
              )}
              key={index}
            >
              {lineNumber}
            </div>
          ))}
        </div>
        <div className="compact-scrollbar flex-grow overflow-x-auto">
          <pre>
            <code className="language-php" ref={codeRef}>
              {lines.map((line, index) => (
                <CodeSnippetLine
                  isHighlighted={highlightedIndex === index}
                  key={`${frame.path}.${index}`}
                  line={line}
                />
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

interface CodeSnippetLineProps {
  line: string;
  isHighlighted: boolean;
}
const CodeSnippetLine = memo(({line, isHighlighted}: CodeSnippetLineProps) => {
  const ref = useRef<HTMLSpanElement>(null!);
  useEffect(() => {
    const el = ref.current;
    highlightCode(el, 'light');
    return () => {
      delete el.dataset.highlighted;
    };
  }, []);

  return (
    <span
      className={clsx('block leading-loose', isHighlighted && 'bg-danger/20')}
    >
      <span className="language-php" ref={ref}>
        {line + '\n'}
      </span>
    </span>
  );
});

function DownloadButton() {
  return (
    <Button
      variant="outline"
      className="text-main"
      elementType="a"
      download
      href="api/v1/logs/error/download-latest"
      size="2xs"
    >
      <Trans message="Download log" />
    </Button>
  );
}
