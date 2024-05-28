import {moveItemInArray} from '@common/utils/array/move-item-in-array';
import {droppables} from '@common/ui/interactions/dnd/drag-state';
import {moveItemInNewArray} from '@common/utils/array/move-item-in-new-array';
import type {SortSession} from '@common/ui/interactions/dnd/sortable/use-sortable';
import type {SortableStrategy} from '@common/ui/interactions/dnd/sortable/sortable-strategy';

const transition = 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)';

export const sortableTransformStrategy: SortableStrategy = {
  onDragStart: sortSession => {
    sortSession.sortables.forEach((sortable, index) => {
      const droppable = droppables.get(sortable);
      if (!droppable?.ref.current) return;

      droppable.ref.current.style.transition = transition;

      if (sortSession?.activeIndex === index) {
        droppable.ref.current.style.opacity = '0.4';
      }
    });
  },
  onDragEnter: (
    sortSession: SortSession,
    overIndex: number,
    currentIndex: number,
  ) => {
    moveItemInArray(sortSession.sortables, currentIndex, overIndex);
    const rects = sortSession.sortables.map(s => droppables.get(s)?.rect);

    sortSession.sortables.forEach((sortable, index) => {
      if (!sortSession) return;

      const newRects = moveItemInNewArray(
        rects,
        overIndex,
        sortSession.activeIndex,
      );
      const oldRect = rects[index];
      const newRect = newRects[index];
      const sortableTarget = droppables.get(sortable);

      if (sortableTarget?.ref.current && newRect && oldRect) {
        const x = newRect.left - oldRect.left;
        const y = newRect.top - oldRect.top;
        sortableTarget.ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    });

    sortSession.finalIndex = overIndex;
  },
  onDragOver: () => {},
  onDragEnd: sortSession => {
    // clear any styles and transforms applied to sortables during sorting
    sortSession.sortables.forEach(sortable => {
      const droppable = droppables.get(sortable);
      if (droppable?.ref.current) {
        droppable.ref.current.style.transform = '';
        droppable.ref.current.style.transition = '';
        droppable.ref.current.style.opacity = '';
        droppable.ref.current.style.zIndex = '';
      }
    });
  },
};
