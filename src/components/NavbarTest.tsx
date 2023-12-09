'use client';

import { useAppDispatch } from '@/lib/hooks';
import { addMenuItem, removeMenuItem } from '@/module/navbar';

export default function NavbarTest() {
  const dispatch = useAppDispatch();

  return (
    <div>
      <div
        onClick={() =>
          dispatch(
            addMenuItem({
              name: 'Test',
              path: '/test',
            }),
          )
        }>
        Ajouter un élément
      </div>
      <div onClick={() => dispatch(removeMenuItem('Test'))}>Retirer l'élément</div>
    </div>
  );
}
