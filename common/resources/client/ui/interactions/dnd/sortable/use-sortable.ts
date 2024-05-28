import {DraggableId, DragPreviewRenderer, useDraggable} from '../use-draggable';
import {useDroppable} from '../use-droppable';
import {RefObject, useEffect} from 'react';
import {getScrollParent, mergeProps} from '@react-aria/utils';
import {droppables} from '../drag-state';
import {updateRects} from '@common/ui/interactions/dnd/update-rects';
import {sortableLineStrategy} from '@common/ui/interactions/dnd/sortable/sortable-line-strategy';
import {sortableTransformStrategy} from '@common/ui/interactions/dnd/sortable/sortable-transform-strategy';
import {sortableMoveNodeStrategy} from '@common/ui/interactions/dnd/sortable/sortable-move-node-strategy';
import {SortableStrategy} from '@common/ui/interactions/dnd/sortable/sortable-strategy';

export interface SortSession {
  // items in this list will be moved when user is sorting
  sortables: DraggableId[];

  // sortable user started dragging to start this session
  activeSortable: DraggableId;
  activeIndex: number;

  // final index sortable was dropped in and should be moved to
  finalIndex: number;

  // drop position for displaying line preview
  dropPosition: DropPosition;
  // element that currently has a line preview at the top or bottom
  linePreviewEl?: HTMLElement;
  scrollParent?: Element;
  scrollListener: () => void;
  ref: RefObject<HTMLElement>;
}

let sortSession: null | SortSession = null;

export type DropPosition = 'before' | 'after' | null;

type StrategyName = 'line' | 'liveSort' | 'moveNode';

const strategies: Record<StrategyName, SortableStrategy> = {
  line: sortableLineStrategy,
  liveSort: sortableTransformStrategy,
  moveNode: sortableMoveNodeStrategy,
};

export interface UseSortableProps {
  item: DraggableId;
  items: DraggableId[];
  onSortStart?: () => void;
  onSortEnd?: (oldIndex: number, newIndex: number) => void;
  onDragEnd?: () => void;
  onDropPositionChange?: (dropPosition: DropPosition) => void;
  ref: RefObject<HTMLElement>;
  type: string;
  preview?: RefObject<DragPreviewRenderer>;
  strategy?: StrategyName;
  disabled?: boolean;
}
export function useSortable({
  item,
  items,
  type,
  ref,
  onSortEnd,
  onSortStart,
  onDragEnd,
  preview,
  disabled,
  onDropPositionChange,
  strategy = 'liveSort',
}: UseSortableProps) {
  // todo: issue with sorting after scrolling menu editor item list

  // update sortables and active index, in case we lazy load more items while sorting
  useEffect(() => {
    if (sortSession && sortSession.sortables.length !== items.length) {
      sortSession.sortables = [...items];
      sortSession.activeIndex = items.indexOf(item);
    }
  }, [items, item]);

  const {draggableProps, dragHandleRef} = useDraggable({
    id: item,
    ref,
    type,
    preview,
    disabled,
    onDragStart: () => {
      sortSession = {
        sortables: [...items],
        activeSortable: item,
        activeIndex: items.indexOf(item),
        finalIndex: items.indexOf(item),
        dropPosition: null,
        ref,
        scrollParent: ref.current ? getScrollParent(ref.current) : undefined,
        scrollListener: () => {
          updateRects(droppables);
        },
      };
      strategies[strategy].onDragStart(sortSession);

      onSortStart?.();
      sortSession.scrollParent?.addEventListener(
        'scroll',
        sortSession.scrollListener,
      );
    },
    onDragEnd: () => {
      if (!sortSession) return;

      sortSession.dropPosition = null;
      onDropPositionChange?.(sortSession.dropPosition);
      if (sortSession.activeIndex !== sortSession.finalIndex) {
        onSortEnd?.(sortSession.activeIndex, sortSession.finalIndex);
      }
      sortSession.scrollParent?.removeEventListener(
        'scroll',
        sortSession.scrollListener,
      );
      strategies[strategy].onDragEnd(sortSession);
      // call "onDragEnd" after "onSortEnd", so listener has a chance to use sort session data
      onDragEnd?.();
      sortSession = null;
    },
    getData: () => {},
  });

  const {droppableProps} = useDroppable({
    id: item,
    ref,
    types: [type],
    disabled,
    allowDragEventsFromItself: true,
    onDragOver: (target, e) => {
      if (!sortSession) return;
      strategies[strategy].onDragOver({
        e,
        ref,
        item,
        sortSession,
        onDropPositionChange,
      });
    },
    onDragEnter: () => {
      if (!sortSession) return;
      const overIndex = sortSession.sortables.indexOf(item);
      const oldIndex = sortSession.sortables.indexOf(
        sortSession.activeSortable,
      );
      strategies[strategy].onDragEnter(sortSession, overIndex, oldIndex);
    },
    onDragLeave: () => {
      if (!sortSession) return;
      sortSession.dropPosition = null;
      onDropPositionChange?.(sortSession.dropPosition);
    },
  });

  return {
    sortableProps: {...mergeProps(draggableProps, droppableProps)},
    dragHandleRef,
  };
}
