import {moveItemInArray} from '@common/utils/array/move-item-in-array';
import {droppables} from '@common/ui/interactions/dnd/drag-state';
import {SortableStrategy} from '@common/ui/interactions/dnd/sortable/sortable-strategy';

export const sortableMoveNodeStrategy: SortableStrategy = {
  onDragStart: () => {},
  onDragOver: () => {},
  onDragEnter: (sortSession, overIndex: number, currentIndex: number) => {
    const node = droppables.get(sortSession.sortables[currentIndex])?.ref
      .current;
    if (node) {
      moveNode(node, currentIndex, overIndex);
      moveItemInArray(sortSession.sortables, currentIndex, overIndex);
      sortSession.finalIndex = overIndex;
    }
  },
  onDragEnd: () => {},
};

function moveNode(el: HTMLElement, currentIndex: number, newIndex: number) {
  const parentEl = el.parentElement!;
  if (newIndex < 0) {
    parentEl.prepend(el);
  } else {
    // if parent already contains this node, and we're changing
    // node's index within parent, need to adjust index by one
    if (currentIndex > -1 && currentIndex <= newIndex) {
      newIndex++;
    }
    const ref = parentEl.children.item(newIndex);
    if (ref) {
      ref.before(el);
    } else {
      parentEl.append(el);
    }
  }
}
