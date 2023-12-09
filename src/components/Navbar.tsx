'use client';
import { useAppSelector } from '@/lib/hooks';
import styles from './Navbar.module.scss';
import { useState } from 'react';
import { getMenu } from '@/module/navbar';
import Link from 'next/link';

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
  const [selectedMenuName, setSelectedMenuName] = useState<string>('');
  const menuItems = useAppSelector(getMenu);

  const toggleSelected = (itemName: string) => {
    if (selectedMenuName.startsWith(itemName)) setSelectedMenuName(itemName.split(',').slice(0, -1).join());
    else setSelectedMenuName(itemName);
  };

  const inflateButton = (item: MenuItem, after: string = '') => {
    return 'path' in item ? (
      <Link href={item.path as string} className={`${styles.button} ${styles.link}`}>
        <div className={`${styles.buttonContent} ${styles['indent-' + (after.split(',').length - 1)]}`}>
          {'icon' in item ? item.icon() : ''}
          <div className={styles.name}>{item.name}</div>
        </div>
      </Link>
    ) : (
      <div
        className={`${styles.button} ${styles.category} ${
          selectedMenuName.startsWith([after, item.name].join()) ? styles.containerOpen : styles.containerClose
        }`}
        style={{ maxHeight: `calc(${1 + item.submenus.length} * (2.5rem + 30px))` }}>
        <div
          className={`${styles.buttonContent} ${styles['indent-' + (after.split(',').length - 1)]}`}
          onClick={() => toggleSelected([after, item.name].join())}>
          {'icon' in item ? item.icon() : ''}
          <div className={styles.name}>{item.name}</div>
        </div>
        <div className={styles.buttonChildrenContainer}>
          {item.submenus.map((item) => inflateButton(item, [after, item.name].join()))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.menuing}>
        {menuItems.items.slice(0, menuItems.seperator).map((item) => inflateButton(item))}
        <div className={styles.separator} />
        {menuItems.items.slice(menuItems.seperator).map((item) => inflateButton(item))}
      </div>
    </div>
  );
}
