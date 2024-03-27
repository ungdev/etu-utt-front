'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import styles from './Navbar.module.scss';
import { useState } from 'react';
import { getMenu, setCollapsed } from '@/module/navbar';
import Link from 'next/link';
import { type NotParameteredTranslationKey } from '@/lib/i18n';
import { useAppTranslation } from '@/lib/i18n';
import Icons from '@/icons';

/**
 * The type defining all possible properties for a menu item
 * This is an internal type that should not be used when developping features.
 * */
type MenuItemProperties<Translate extends boolean> = {
  icon: () => JSX.Element;
  name: Translate extends true
    ? NotParameteredTranslationKey
    : Translate extends false
      ? string
      : NotParameteredTranslationKey | string;
  path: `/${string}`;
  submenus: MenuItem<false>[];
  translate: Translate;
};

/**
 * An item displayed in the menu.
 * Requires one property in the followings (cannot be used together):
 * - {@link MenuItemProperties.path} the path the MenuItem will redirect on click
 * - {@link MenuItemProperties.submenus} a list of {@link MenuItem} describing all the items of the submenu.
 *
 * Can have an icon using {@link MenuItemProperties.icon}. By default, an icon can be used and is optional. Use the parameter {@link IncludeIcons} to require or forbid icons.
 */
export type MenuItem<
  IncludeIcons extends boolean = boolean,
  Translate extends boolean = boolean,
> = (IncludeIcons extends true
  ? Pick<MenuItemProperties<Translate>, 'icon'>
  : IncludeIcons extends false
    ? Partial<Record<'icon', never>>
    : Partial<Pick<MenuItemProperties<Translate>, 'icon'>>) &
  (
    | (Omit<MenuItemProperties<Translate>, 'path' | 'icon'> & Partial<Record<'path', never>>)
    | (Omit<MenuItemProperties<Translate>, 'submenus' | 'icon'> & Partial<Record<'submenus', never>>)
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

  const { t, i18n } = useAppTranslation();
  const [language, setLanguage] = useState(i18n.language);

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
          {'icon' in item ? (item as MenuItem<true>).icon() : ''}
          <div className={styles.name}>{item.translate ? t(item.name as NotParameteredTranslationKey) : item.name}</div>
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
          {'icon' in item ? (item as MenuItem<true>).icon() : ''}
          <div className={styles.name}>{item.translate ? t(item.name as NotParameteredTranslationKey) : item.name}</div>
        </div>
        <div className={styles.buttonChildrenContainer}>
          {item.submenus.map((item) => inflateButton(item, [after, item.name].join(',')))}
        </div>
      </div>
    );
  };

  // Based on : https://codepen.io/guled10/pen/zYqVqed
  return (
    <div className={`${styles.navigation} ${menuItems.collapsed ? styles.navigation__collapsed : ''}`}>
      {/* LOGO ETUUTT */}
      <a className={`${styles.navigationLogo}`} onClick={toggleCollapsed}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={32}
          height={32}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-box navigation-logo__icon">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1={12} y1="22.08" x2={12} y2={12} />
        </svg>
        <span>EtuUTT</span>
      </a>
      {/* NAVIGATION */}
      <nav role="navigation">
        <ul>
          <li>
            <a className={`${styles.navigationLink}`} href="#">
              <Icons.Home />
              <span>Accueil</span>
            </a>
          </li>
          <li>
            <a className={`${styles.navigationLink}`} href="#">
              <Icons.Book />
              <span>Trombinoscope</span>
            </a>
          </li>
          <li>
            <a className={`${styles.navigationLink}`} href="#">
              <Icons.Book />
              <span>Guide des UEs</span>
            </a>
          </li>
          <li>
            <a className={`${styles.navigationLink}`} href="#">
              <Icons.Book />
              <span>Associations</span>
            </a>
          </li>
        </ul>
      </nav>
      {/* ACCOUNT */}
      <a className={`${styles.profile}`} href="#">
        <img src='https://picsum.photos/200' alt="Profile picture"/>
        <div>
          <p className={styles.name}>Noé Landré</p>
          <p className={styles.role}>Étudiant</p>
        </div>
      </a>
    </div>
  );
}
