'use client';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import styles from './Navbar.module.scss';
import { useState } from 'react';
import { getMenu, setCollapsed } from '@/module/navbar';
import Link from 'next/link';
import User from '@/icons/User';
import Menu from '@/icons/Menu';
import Collapse from '@/icons/Collapse';

/**
 * The type defining all possible properties for a menu item
 * This is an internal type that should not be used when developping features.
 * */
type MenuItemProperties = {
  icon: () => JSX.Element;
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
 * Can have an icon using {@link MenuItemProperties.icon}. By default, an icon can be used and is optional. Use the parameter <code>IncludeIcons</code> to require or forbid icons
 */
export type MenuItem<IncludeIcons extends boolean = boolean> = (IncludeIcons extends true
  ? Pick<MenuItemProperties, 'icon'>
  : IncludeIcons extends false
  ? Record<string, never>
  : Partial<Pick<MenuItemProperties, 'icon'>>) &
  (
    | (Omit<MenuItemProperties, 'path' | 'icon'> & Partial<Record<'path', never>>)
    | (Omit<MenuItemProperties, 'submenus' | 'icon'> & Partial<Record<'submenus', never>>)
  );

/**
 * EtuUTT's main menu. It is the sidebar on the left of the screen.
 * The "collapsed/uncollapsed" state is saved in the browser's localStorage and will be kept the next time the user will use the browser.
 *
 * The menu supports hot modifications with using methods defined in {@link @/module/navbar}
 *
 * At the point, the navbar officially only supports 2 depth levels. Other levels are possible but may
 * not work as intended, especially when talking about displaying submenus contents.
 */
export default function Navbar() {
  // The selected menu name. This names includes the one of all of its ancestors, separated with commas.
  // For example the name "Menu2,Menu4" matches "Menu4" in the following hierarchy (> means a closed menu, - means an open menu):
  // > Menu1
  // - Menu2
  //   > Menu3
  //   - Menu4
  const [selectedMenuName, setSelectedMenuName] = useState<string>('');
  const menuItems = useAppSelector(getMenu);
  const dispatch = useAppDispatch();

  /**
   * Switches the selected menu. If the menu (or one of its children) is already selected, the menu will close.
   * Otherwise, we open the menu.
   * */
  const toggleSelected = (itemName: string) => {
    if (selectedMenuName.startsWith(itemName)) setSelectedMenuName(itemName.split(',').slice(0, -1).join(','));
    else setSelectedMenuName(itemName);
  };

  /** Toggles the collapse mode */
  const toggleCollapsed = () => {
    dispatch(setCollapsed(!menuItems.collapsed));
  };

  /**
   * Creates a button as an {@link HTMLDivElement} using data from the provided {@link MenuItem}.
   *
   * The {@link after} property contains the name of all ancestors, separated with commas. Keep the default
   * value if the item is in the root menu.
   */
  const inflateButton = (item: MenuItem, after: string = '') => {
    return 'path' in item ? (
      <Link href={item.path as string} className={`${styles.button} ${styles.link}`} key={item.name}>
        <div className={`${styles.buttonContent} ${styles['indent-' + (after.split(',').length - 1)]}`}>
          {'icon' in item ? item.icon() : ''}
          <div className={styles.name}>{item.name}</div>
        </div>
      </Link>
    ) : (
      <div
        className={`${styles.button} ${styles.category} ${
          selectedMenuName.startsWith([after, item.name].join(',')) ? styles.containerOpen : styles.containerClose
        }`}
        style={{ maxHeight: `calc(${1 + item.submenus.length} * (2rem + 20px))` }}
        key={item.name}>
        <div
          className={`${styles.buttonContent} ${styles['indent-' + (after.split(',').length - 1)]}`}
          onClick={() => toggleSelected([after, item.name].join(','))}>
          {'icon' in item ? item.icon() : ''}
          <div className={styles.name}>{item.name}</div>
        </div>
        <div className={styles.buttonChildrenContainer}>
          {item.submenus.map((item) => inflateButton(item, [after, item.name].join(',')))}
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.navbar} ${menuItems.collapsed ? styles.collapsed : ''}`}>
      <div className={styles.collapseIcon} onClick={toggleCollapsed}>
        {menuItems.collapsed ? Menu() : Collapse()}
      </div>
      <div className={styles.menuing}>
        {menuItems.items.slice(0, menuItems.seperator).map((item) => inflateButton(item))}
        <div className={styles.separator} />
        {menuItems.items.slice(menuItems.seperator).map((item) => inflateButton(item))}
      </div>
      <div className={styles.profile}>
        <div className={styles.roundIcon}>
          <User />
        </div>
        <div className={styles.name}>Mon Profil</div>
      </div>
    </div>
  );
}
