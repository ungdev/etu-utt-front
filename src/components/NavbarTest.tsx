'use client';

import { useAppDispatch } from '@/lib/hooks';
import { addMenuItem, removeMenuItem, replaceMenuItem } from '@/module/navbar';

export default function NavbarTest() {
  const dispatch = useAppDispatch();

  return (
    <div>
      <h3>Tests de la navbar</h3>
      <div
        onClick={() =>
          dispatch(
            addMenuItem(
              {
                name: 'PX01',
                path: '/ues/px01',
                translate: false,
              },
              {
                parents: 'common:navbar.myUEs',
              },
            ),
          )
        }>
        Rejoindre l'UE PX01
      </div>
      <div
        onClick={() =>
          dispatch(
            addMenuItem(
              {
                name: 'PX01',
                path: '/ues/px01',
                translate: false,
              },
              {
                parents: 'common:navbar.myUEs',
                after: 'SY04',
              },
            ),
          )
        }>
        Rejoindre l'UE PX01 (after SY04)
      </div>
      <div
        onClick={() =>
          dispatch(
            addMenuItem(
              {
                name: 'PX01',
                path: '/ues/px01',
                translate: false,
              },
              {
                parents: 'common:navbar.myUEs',
                before: 'SY04',
              },
            ),
          )
        }>
        Rejoindre l'UE PX01 (before SY04)
      </div>
      <div
        onClick={() =>
          dispatch(
            replaceMenuItem(
              {
                name: 'PX02',
                path: '/ues/px02',
                translate: false,
              },
              'common:navbar.myUEs',
              'PX01',
            ),
          )
        }>
        Rename l'UE PX01 en PX02
      </div>
      <div onClick={() => dispatch(removeMenuItem('common:navbar.myUEs', 'PX01'))}>Quitter l'UE PX01</div>
      <div onClick={() => dispatch(removeMenuItem('common:navbar.myUEs', 'PX02'))}>Quitter l'UE PX02</div>
    </div>
  );
}
