'use client';
import { useAppSelector } from '@/lib/hooks';
import styles from './Navbar.module.scss';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { getMenu } from '@/module/navbar';

/**
 * The type defining all possible properties for a menu item
 * This is an internal type that should not be used when developping features.
 * */
type MenuItemProperties = {
  icon: (...params: any) => JSX.Element;
  name: string;
  path: `/${string}`;
  submenus: MenuItem<false>[];
};

/**
 * An item displayed in the menu.
 * Requires one property in the followings (cannot be used together):
 * - {@link MenuItemProperties.path} the path the MenuItem will redirect on click
 * - {@link MenuItemProperties.submenus} a list of {@link MenuItem} describing all the items of the submenu.
 *
 * Can have an icon using {@link MenuItemProperties.icon}. By default an icon can be used and is optional. Use the paramater {@link IncludeIcons} to require or forbid icons
 */
export type MenuItem<IncludeIcons extends boolean = boolean> = (IncludeIcons extends true
  ? Pick<MenuItemProperties, 'icon'>
  : IncludeIcons extends false
    ? {}
    : Partial<Pick<MenuItemProperties, 'icon'>>) &
  (
    | (Omit<MenuItemProperties, 'path' | 'icon'> & Partial<Record<'path', never>>)
    | (Omit<MenuItemProperties, 'submenus' | 'icon'> & Partial<Record<'submenus', never>>)
  );

/**
 * Le menu d'EtuUTT. Il s'agit du panneau rétractable qui apparait sur la gauche de ton écran !
 * Il supporte également le fait d'être modifié pendant que l'utilisateur est sur la page.
 * */
export default function Navbar() {
  const [selectedMenu, setSelectedMenu] = useState(-1);
  const menuItems = useAppSelector(getMenu);
  const menuItemsRef = menuItems.map(() => useRef<HTMLDivElement>(null));

  useEffect(() => {
    if (menuItems.length < menuItemsRef.length) {
      // An item was removed
    } else if (menuItems.length === menuItemsRef.length) {
      // An item was modified
    } else {
      // An item was added
    }
  }, [menuItems]);

  /*
  
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

  const menusComponent = menu.map((menu, i) =>
    menu.path ? (
      <div
        className={`${styles.menuButton} ${
          mainMenuVisible ? '' : selectedMenu < i ? styles.right : selectedMenu > i ? styles.left : styles.selected
        }`}
        style={cssVariables}
        key={`menu-${i}`}>
        <Link href={menu.path}>{menu.name}</Link>
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

  const submenusComponent = menu[selectedMenu].submenus?.map((submenu, i) => (
    <div key={`submenu-${i}`}>
      <Link href={submenu.path!}>{submenu.name}</Link>
    </div>
  ));

  */
  return (
    <div className={styles.navbar}>
      <div className={styles.menuing}>
        {/* <div className={`${styles.menus}`}>{menusComponent}</div>
        <div
          className={`${styles.submenus} ${!mainMenuVisible ? styles.visible : ''}`}
          style={{ '--left': `${selectedButtonRef.current?.clientWidth}px` } as CSSProperties}>
          {submenusComponent}
        </div> */}
      </div>
    </div>
  );
}
