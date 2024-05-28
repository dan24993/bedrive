import {
  IgnitionErrorPayload,
  IgnitionFrame,
} from '@common/utils/http/ignition-error-dialog/ignition-error-payload';
import React, {Fragment, useState} from 'react';
import {Trans} from '@common/i18n/trans';
import {KeyboardArrowDownIcon} from '@common/icons/material/KeyboardArrowDown';
import clsx from 'clsx';
import {Button} from '@common/ui/buttons/button';
import {UnfoldMoreIcon} from '@common/icons/material/UnfoldMore';
import {UnfoldLessIcon} from '@common/icons/material/UnfoldLess';

interface StackTraceProps {
  trace: IgnitionErrorPayload['trace'];
  onSelectedIndexChange: (index: number) => void;
  selectedIndex: number;
  totalVendorGroups: number;
}
export function IgnitionStackTrace({
  trace,
  onSelectedIndexChange,
  selectedIndex,
  totalVendorGroups,
}: StackTraceProps) {
  const [expandedVendorGroups, setExpandedVendorGroups] = useState<number[]>(
    [],
  );
  const allVendorGroupsExpanded =
    expandedVendorGroups.length === totalVendorGroups;
  return (
    <div className="max-w-440 border-r text-sm">
      <div className="border-b px-30 py-16">
        <Button
          variant="outline"
          size="2xs"
          startIcon={
            allVendorGroupsExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />
          }
          onClick={() => {
            if (allVendorGroupsExpanded) {
              setExpandedVendorGroups([]);
            } else {
              setExpandedVendorGroups(
                trace
                  .map((frame, index) => ('vendorGroup' in frame ? index : -1))
                  .filter(index => index !== -1),
              );
            }
          }}
        >
          {allVendorGroupsExpanded ? (
            <Trans message="Collapse vendor frames" />
          ) : (
            <Trans message="Expand vendor frames" />
          )}
        </Button>
      </div>
      {trace.map((frame, index) => {
        if ('vendorGroup' in frame) {
          // vendor group is expanded, display all vendor frames
          if (expandedVendorGroups.includes(index)) {
            return (
              <Fragment key={index}>
                {frame.items.map((vendorFrame, index) => (
                  <StackTrackItem
                    key={`vendor-${index}`}
                    frame={vendorFrame}
                    onClick={() => onSelectedIndexChange(vendorFrame.flatIndex)}
                    isSelected={selectedIndex === vendorFrame.flatIndex}
                  />
                ))}
              </Fragment>
            );
          }
          // vendor group is collapsed, only show vendor group header
          return (
            <div
              className="flex cursor-pointer items-center gap-4 border-b px-30 py-16 hover:bg-hover"
              key={index}
              onClick={() => setExpandedVendorGroups(prev => [...prev, index])}
            >
              <Trans
                message=":count vendor [one frame|other frames]"
                values={{count: frame.items.length}}
              />
              <KeyboardArrowDownIcon className="text-muted" />
            </div>
          );
        }

        // app frame item
        return (
          <StackTrackItem
            key={index}
            frame={frame}
            onClick={() => onSelectedIndexChange(frame.flatIndex)}
            isSelected={selectedIndex === frame.flatIndex}
          />
        );
      })}
    </div>
  );
}

interface StackTrackItemProps {
  frame: IgnitionFrame;
  onClick: () => void;
  isSelected: boolean;
}
function StackTrackItem({frame, onClick, isSelected}: StackTrackItemProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'cursor-pointer border-b px-30 py-16',
        isSelected ? 'bg-danger text-on-primary' : 'hover:bg-danger/10',
      )}
    >
      <IgnitionFilePath frame={frame} />
      <div className="font-semibold">{frame.method}</div>
    </div>
  );
}

interface IgnitionFilePath {
  frame: IgnitionFrame;
}
export function IgnitionFilePath({frame}: IgnitionFilePath) {
  return (
    <div className="inline-flex flex-wrap items-baseline">
      {frame.path.map((part, index) =>
        frame.path.length - 1 === index ? (
          <div key={index} className="font-semibold">
            {part}
          </div>
        ) : (
          <div key={index}>{part}/</div>
        ),
      )}
      <div>:{frame.lineNumber}</div>
    </div>
  );
}
