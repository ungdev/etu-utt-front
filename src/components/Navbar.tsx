'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import styles from './Navbar.module.scss';
import { useState } from 'react';
import { getMenu, setCollapsed } from '@/module/navbar';
import Link from 'next/link';
import User from '@/icons/User';
import Menu from '@/icons/Menu';
import Collapse from '@/icons/Collapse';
import { type NotParameteredTranslationKey } from '@/lib/i18n';
import { useAppTranslation } from '@/lib/i18n';

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

  return (
    <nav className={`${styles.navbar}  ${menuItems.collapsed ? styles.collapsed : ''}`}>
      <a className={`${styles.logo}`} onClick={toggleCollapsed}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270.93 270.93"><path fill="currentColor" d="M135.467 15.236s-7.123 28.86-13.624 47.366-13.081 32.011-19.664 39.949c5.473 9.804 9.79 18.927 12.452 27.309 6.851 21.57 5.23 44.074 4.139 59.387-1.133 15.902-6.4 33.644-11.027 47.806 11.416 6.082 27.724 18.655 27.724 18.655s18.007-13.359 27.727-18.655c-4.627-14.162-9.894-31.904-11.027-47.806-1.091-15.314-2.712-37.817 4.139-59.387 2.662-8.381 6.978-17.505 12.452-27.309-6.583-7.938-13.162-21.443-19.664-39.949-5.33-15.547-13.628-47.366-13.628-47.366zm-35.434 217.031s10.291-25.126 11.093-52.526c.822-28.115-3.767-43.064-3.767-43.064s-10.168 21.396-32.806 32.837c-22.7 11.471-45.041 4.152-45.041 4.152s6.662 23.26 39.641 30.714c30.83 6.968 30.879 27.889 30.879 27.889zm70.87 0s-10.291-25.126-11.093-52.526c-.822-28.115 3.767-43.064 3.767-43.064s10.168 21.396 32.806 32.837c22.7 11.471 45.041 4.152 45.041 4.152s-6.662 23.26-39.641 30.714c-30.83 6.968-30.879 27.889-30.879 27.889z"/></svg>
        <svg className={`${styles.tohide}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </a>
      <div className={`${styles.navItems}`}>
        <a className={`${styles.item}`} onClick={toggleCollapsed}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <p>Home</p>
        </a>
        <div className={`${styles.indicator}`}></div>
      </div>

      <a className={`${styles.item}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </a>
    </nav>
  );


  // return (
  //   <div className={`${styles.navbar} ${menuItems.collapsed ? styles.collapsed : ''}`}>
  //     <div className={styles.collapseIcon} onClick={toggleCollapsed}>
  //       {menuItems.collapsed ? Menu() : Collapse()}
  //     </div>
  //     <div className={styles.menuing}>
  //       {menuItems.items.slice(0, menuItems.seperator).map((item) => inflateButton(item))}
  //       <div className={styles.separator} />
  //       {menuItems.items.slice(menuItems.seperator).map((item) => inflateButton(item))}
  //     </div>
  //     <div className={styles.profile}>
  //       <div className={styles.roundIcon}>
  //         <User />
  //       </div>
  //       <div className={styles.name}>{t('common:navbar.profile')}</div>
  //     </div>
  //     <select
  //       value={language}
  //       onChange={(e) => {
  //         i18n.changeLanguage(e.target.value);
  //         localStorage.setItem('etu-utt-lang', e.target.value);
  //         setLanguage(e.target.value);
  //       }}>
  //       <option value="fr">Français</option>
  //       <option value="en">English</option>
  //     </select>
  //   </div>
  // );
}
