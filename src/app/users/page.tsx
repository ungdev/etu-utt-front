'use client';
import styles from './style.module.scss';
import FilteredSearch, { FiltersDataType, GenericFiltersType } from '@/components/filteredSearch/FilteredSearch';
import { createInputFilter } from '@/components/filteredSearch/InputFilter';
import Icons from '@/icons';
import { useUsers } from '@/api/users/searchUsers.hook';
import { ResultsList } from '@/components/ResultsList';
import { usePageSettings } from '@/module/pageSettings';
import icons from '@/icons';
import defaultAvatar from '@/../public/images/default-avatar.jpg';

type FilterNames = 'name' | 'firstName' | 'lastName' | 'nickname';

interface FiltersType extends GenericFiltersType<FilterNames> {
  name: { dependsOn: []; value: string };
  firstName: { dependsOn: []; value: string };
  lastName: { dependsOn: []; value: string };
  nickname: { dependsOn: []; value: string };
}

const filtersData = Object.freeze({
  name: { component: createInputFilter('users:filter.search', Icons.User), parameterName: 'q' },
  firstName: {
    component: createInputFilter('users:filter.firstName'),
    parameterName: 'firstName',
    name: 'users:filter.firstName',
  },
  lastName: {
    component: createInputFilter('users:filter.lastName'),
    parameterName: 'lastName',
    name: 'users:filter.lastName',
  },
  nickname: {
    component: createInputFilter('users:filter.nickname'),
    parameterName: 'nickname',
    name: 'users:filter.nickname',
  },
} satisfies FiltersDataType<FilterNames, FiltersType, 'name'>);

export default function SearchUserPage() {
  usePageSettings({});
  const [users, updateUsers] = useUsers();
  return (
    <div className={styles.searchUserPage}>
      <h1>Trombinoscope</h1>
      <FilteredSearch<FilterNames, FiltersType, 'name'>
        filtersData={filtersData}
        defaultFilter="name"
        updateSearch={updateUsers}
      />
      <ResultsList
        data={users}
        baseRedirectUrl={'/users'}
        InfoFC={({ item }) => (
          <div className={styles.user}>
            <img src={item.avatar || defaultAvatar.src} alt="avatar" />
            <div className={styles.userInfo}>
              <h2>
                {item.firstName} {item.lastName}
                {item.nickname && <span className={styles.nickname}>{item.nickname}</span>}
              </h2>
              {item.branch && <p>{item.branch}</p>}
              <p>{item.mailUTT}</p>
              {item.mailPersonal && <p>{item.mailPersonal}</p>}
              {item.phone && <p>{item.phone}</p>}
            </div>
          </div>
        )}
      />
    </div>
  );
}
