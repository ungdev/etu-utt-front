'use client';
import styles from './style.module.scss';
import FilteredSearch, { FiltersDataType, GenericFiltersType } from '@/components/filteredSearch/FilteredSearch';
import { createInputFilter } from '@/components/filteredSearch/InputFilter';
import { useUsers } from '@/api/users/searchUsers.hook';
import { ResultsList } from '@/components/ResultsList';
import defaultAvatar from '../../../../public/images/default-avatar.jpg';
import Page from '@/components/utilities/Page';

type FilterNames = 'name' | 'firstName' | 'lastName' | 'nickname';

interface FiltersType extends GenericFiltersType<FilterNames> {
  name: { dependsOn: []; value: string };
  firstName: { dependsOn: []; value: string };
  lastName: { dependsOn: []; value: string };
  nickname: { dependsOn: []; value: string };
}

const filtersData = Object.freeze({
  name: {
    component: createInputFilter('users:filter.search.placeholder', 'users:filter.search.title'),
    parameterName: 'q',
    updateDelayed: true,
  },
  firstName: {
    component: createInputFilter('users:filter.firstName.placeholder', 'users:filter.firstName.title'),
    parameterName: 'firstName',
    updateDelayed: true,
  },
  lastName: {
    component: createInputFilter('users:filter.lastName.placeholder', 'users:filter.lastName.title'),
    parameterName: 'lastName',
    updateDelayed: true,
  },
  nickname: {
    component: createInputFilter('users:filter.nickname.placeholder', 'users:filter.nickname.title'),
    parameterName: 'nickname',
    updateDelayed: true,
  },
} satisfies FiltersDataType<FilterNames, FiltersType>);

export default function SearchUserPage() {
  const { items: users, total: totalUsers, updateFilters: updateUsers, fetchNextItems: fetchNextPage } = useUsers();
  return (
    <Page className={styles.searchUserPage}>
      <h1>Trombinoscope</h1>
      <div className={styles.content}>
        <FilteredSearch<FilterNames, FiltersType> filtersData={filtersData} updateSearch={updateUsers} />
        <div className={styles.results}>
          <ResultsList
            data={users}
            totalResults={totalUsers}
            baseRedirectUrl={'/users'}
            onEndReached={fetchNextPage}
            itemFactory={({ item }) =>
              !item ? (
                <div className={`${styles.user} ${styles.glimmer}`}>
                  <img alt="Askip il y a une image ici mais j'ai aucune idée d'à quoi elle sert :)" />
                  <div className={styles.userInfo}>
                    <h2></h2>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                  </div>
                </div>
              ) : (
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
              )
            }
          />
        </div>
      </div>
    </Page>
  );
}
