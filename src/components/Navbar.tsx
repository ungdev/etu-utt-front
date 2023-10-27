'use client';
import styles from './Navbar.module.scss';
import Link from 'next/link';
import { CSSProperties, useRef, useState } from 'react';

const menus: Array<
  | { name: string; redirect?: undefined; submenus: { name: string; redirect: string }[] }
  | { name: string; redirect: string; submenus?: undefined }
> = [
  {
    name: 'Menu 1',
    submenus: [
      { name: 'Sous menu 1', redirect: '/test1' },
      { name: 'Sous menu 2', redirect: '/test2' },
      { name: 'Sous menu 3', redirect: '/test3' },
    ],
  },
  {
    name: 'Menu 2',
    submenus: [
      { name: 'Sous menu 4', redirect: '/test4' },
      { name: 'Sous menu 5', redirect: '/test5' },
      { name: 'Sous menu 6', redirect: '/test6' },
    ],
  },
  {
    name: 'Menu 3',
    redirect: '/test7',
  },
];

export default function Navbar() {
  const [selectedMenu, setSelectedMenu] = useState(-1);
  const refs = menus.map(() => useRef<HTMLDivElement>(null));

  return (
    <div className={styles.navbar}>
      {menus.map((menu, i) => {
        if (menu.redirect !== undefined) {
          return (
            <div key={`menu-${i}`}>
              <Link href={menu.redirect}>{menu.name}</Link>
            </div>
          );
        }
        return (
          <div key={`menu-${i}`}>
            <div onClick={() => setSelectedMenu(i === selectedMenu ? -1 : i)}>{menu.name}</div>
            <div
              className={`${styles.submenusCollapse} ${i === selectedMenu ? styles.selected : ''}`}
              style={{ '--submenus-height': `${refs[i]?.current?.clientHeight}px` } as CSSProperties}>
              <div className={styles.submenusContainer} ref={refs[i]}>
                {menu.submenus.map((submenu, j) => (
                  <div key={`submenu-${j}`}>
                    <Link href={submenu.redirect}>{submenu.name}</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
