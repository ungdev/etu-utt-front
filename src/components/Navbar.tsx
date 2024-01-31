'use client';
import styles from './Navbar.module.scss';
import Link from 'next/link';
import { CSSProperties, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';

const menus: Array<
  | { name: string; redirect?: undefined; submenus: { name: string; redirect: string }[] }
  | { name: string; redirect: string; submenus?: undefined }
> = [
  {
    name: 'common:navbar.menu.1',
    submenus: [
      { name: 'common:navbar.menu.1.submenus.1', redirect: '/test1' },
      { name: 'common:navbar.menu.1.submenus.2', redirect: '/test2' },
      { name: 'common:navbar.menu.1.submenus.3', redirect: '/test3' },
    ],
  },
  {
    name: 'common:navbar.menu.2',
    submenus: [
      { name: 'common:navbar.menu.2.submenus.1', redirect: '/test4' },
      { name: 'common:navbar.menu.2.submenus.1', redirect: '/test5' },
      { name: 'common:navbar.menu.2.submenus.1', redirect: '/test6' },
    ],
  },
  {
    name: 'common:navbar.menu.3',
    redirect: '/test7',
  },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [mainMenuVisible, setMainMenuVisible] = useState(true);
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
        <Link href={menu.redirect}>{t(menu.name)}</Link>
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
        {t(menu.name)}
      </div>
    ),
  );

  const submenusComponent = menus[selectedMenu].submenus?.map((submenu, i) => (
    <div key={`submenu-${i}`}>
      <Link href={submenu.redirect}>{t(submenu.name)}</Link>
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
      <select
        value={i18n.language}
        onChange={(e) => {
          i18n.changeLanguage(e.target.value);
          localStorage.setItem('etu-utt-lang', e.target.value);
        }}>
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
