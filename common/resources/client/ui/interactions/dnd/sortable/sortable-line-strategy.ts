import {
  DropPosition,
  SortSession,
} from '@common/ui/interactions/dnd/sortable/use-sortable';
import {SortableStrategy} from '@common/ui/interactions/dnd/sortable/sortable-strategy';
import {droppables} from '@common/ui/interactions/dnd/drag-state';

export const sortableLineStrategy: SortableStrategy = {
  onDragStart: () => {},
  onDragEnter: () => {},
  onDragOver: ({e, ref, item, sortSession, onDropPositionChange}) => {
    const previousPosition = sortSession.dropPosition;
    let newPosition: DropPosition = null;

    const rect = droppables.get(item)?.rect;
    if (rect) {
      const midY = rect.top + rect.height / 2;
      if (e.clientY <= midY) {
        newPosition = 'before';
      } else if (e.clientY >= midY) {
        newPosition = 'after';
      }
    }

    if (newPosition !== previousPosition) {
      const overIndex = sortSession.sortables.indexOf(item);
      sortSession.dropPosition = newPosition;
      onDropPositionChange?.(sortSession.dropPosition);

      clearLinePreview(sortSession);
      if (ref.current) {
        if (sortSession.dropPosition === 'after') {
          addLinePreview(ref.current, 'bottom', sortSession);
        } else {
          // if it's the first row, add preview to the top border, as there's no previous element
          if (overIndex === 0) {
            addLinePreview(ref.current, 'top', sortSession);
            // otherwise add preview to the bottom border of the previous row
          } else {
            const droppableId = sortSession.sortables[overIndex - 1];
            const droppable = droppables.get(droppableId);
            if (droppable?.ref.current) {
              addLinePreview(droppable.ref.current, 'bottom', sortSession);
            }
          }
        }
      }

      const itemIndex = sortSession.sortables.indexOf(item);

      // don't move item at all if hovering over itself
      if (sortSession.activeIndex === itemIndex) {
        sortSession.finalIndex = sortSession.activeIndex;
        return;
      }

      // adjust final drop index based on whether we're dropping drag target after or before it's original index
      // this is needed, so we get the same index if target is dropped after current item or before next item
      const dragDirection =
        overIndex > sortSession.activeIndex ? 'after' : 'before';
      if (dragDirection === 'after') {
        sortSession.finalIndex =
          sortSession.dropPosition === 'before' ? itemIndex - 1 : itemIndex;
      } else {
        sortSession.finalIndex =
          sortSession.dropPosition === 'after' ? itemIndex + 1 : itemIndex;
      }
    }
  },
  onDragEnd: sortSession => {
    clearLinePreview(sortSession);
  },
};

function clearLinePreview(sortSession: SortSession) {
  if (sortSession?.linePreviewEl) {
    sortSession.linePreviewEl.style.borderBottomColor = '';
    sortSession.linePreviewEl.style.borderTopColor = '';
    sortSession.linePreviewEl = undefined;
  }
}

function addLinePreview(
  el: HTMLElement,
  side: 'top' | 'bottom',
  sortSession: SortSession,
) {
  const color = 'rgb(var(--be-primary))';
  if (side === 'top') {
    el.style.borderTopColor = color;
  } else {
    el.style.borderBottomColor = color;
  }
  if (sortSession) {
    sortSession.linePreviewEl = el;
  }
}
