import {
  ComponentType,
  Dispatch,
  PropsWithChildren,
  PropsWithoutRef,
  PropsWithRef,
  SetStateAction,
  useState,
} from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

function SortableItem(props: PropsWithChildren<{ id: string }>) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

  if (transform) {
    transform.scaleX = 1;
    transform.scaleY = 1;
  }
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
}

/**
 * Allows to use drag and drop for element sorting (vertical layout)
 * For more information about this component, see documentation here : https://docs.dndkit.com
 */
export const VerticalSortDnd = <T extends { id: string }>({
  disabled,
  items,
  setItems,
  inflater: Inflater,
  onItemMoved = () => {},
}: PropsWithoutRef<{
  disabled?: boolean;
  inflater: ComponentType<PropsWithRef<{ item: T }>>;
  items: T[];
  setItems: Dispatch<SetStateAction<T[]>>;
  onItemMoved?: (id: string, newIndex: number, oldIndex: number) => void;
}>) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (veent: DragStartEvent) => {
    setActiveId(veent.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        onItemMoved(active.id as string, newIndex, oldIndex);
        return arrayMove(items, oldIndex, newIndex); // keep arrayMove call for animation purpose, the list may also be updated by api calls later on
      });
    }
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis]}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      autoScroll={true}>
      <DragOverlay modifiers={[restrictToParentElement]}>
        <Inflater item={items.find((i) => i.id === activeId)!} />
      </DragOverlay>
      <SortableContext items={items} strategy={verticalListSortingStrategy} disabled={disabled}>
        {items.map((item) => (
          <SortableItem key={item.id} id={item.id}>
            <Inflater item={item} />
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
};
