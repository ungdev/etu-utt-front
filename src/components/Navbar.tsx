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
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [mainMenuVisible, setMainMenuVisible] = useState(true);
  const buttonRefs = menus.map(() => useRef<HTMLDivElement>(null));

  const selectedButtonRef = buttonRefs[selectedMenu];

  const selectedButtonTransform = selectedButtonRef.current
    ? window.getComputedStyle(selectedButtonRef.current!).transform
    : 'none';
  const selectedButtonLeft = selectedButtonRef.current
    ? selectedButtonRef.current?.getBoundingClientRect().left -
      (selectedButtonTransform === 'none'
        ? 0
        : parseInt(selectedButtonTransform.match(/matrix.*\((.+)\)/)![1].split(', ')[4]))
    : undefined;

  const cssVariables = selectedButtonRef.current
    ? ({
        '--selected-button-left': `${selectedButtonLeft}px`,
        '--selected-button-right': `${
          window.innerWidth - (selectedButtonLeft! + selectedButtonRef.current?.clientWidth)
        }px`,
      } as CSSProperties)
    : {};

  const menusComponent = menus.map((menu, i) =>
    menu.redirect ? (
      <div
        className={`${styles.menuButton} ${
          mainMenuVisible ? '' : selectedMenu < i ? styles.right : selectedMenu > i ? styles.left : styles.selected
        }`}
        style={cssVariables}
        key={`menu-${i}`}>
        <Link href={menu.redirect}>{menu.name}</Link>
      </div>
    ) : (
      <div
        className={`${styles.menuButton} ${
          mainMenuVisible ? '' : selectedMenu < i ? styles.right : selectedMenu > i ? styles.left : styles.selected
        }`}
        style={cssVariables}
        onClick={() => mainMenuVisible && [setSelectedMenu(i)] && setMainMenuVisible(false)}
        ref={buttonRefs[i]}
        key={`menu-${i}`}>
        {menu.name}
      </div>
    ),
  );

  const submenusComponent = menus[selectedMenu].submenus?.map((submenu, i) => (
    <div key={`submenu-${i}`}>
      <Link href={submenu.redirect}>{submenu.name}</Link>
    </div>
  ));

  return (
    <div className={styles.navbar}>
      <button onClick={() => setMainMenuVisible(!mainMenuVisible)}>back</button>
      <div className={styles.menuing}>
        <div className={`${styles.menus}`}>{menusComponent}</div>
        <div
          className={`${styles.submenus} ${!mainMenuVisible ? styles.visible : ''}`}
          style={{ '--left': `${selectedButtonRef.current?.clientWidth}px` } as CSSProperties}>
          {submenusComponent}
        </div>
      </div>
    </div>
  );
}
