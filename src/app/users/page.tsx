'use client';

import FilteredSearch, { FiltersDataType, GenericFiltersType } from '@/components/filteredSearch/FilteredSearch';
import { createInputFilter } from '@/components/filteredSearch/InputFilter';
import Icons from '@/icons';
import { useUsers } from '@/api/users/searchUsers.hook';
import { useEffect, useState } from 'react';

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

export default function Page() {
  const [users, updateUsers] = useUsers();
  return (
    <div>
      <FilteredSearch<FilterNames, FiltersType, 'name'>
        filtersData={filtersData}
        defaultFilter="name"
        updateSearch={updateUsers}
      />
      <div>
        {users.map((user) => (
          <div key={user.id}>
            <p>
              {user.firstName} | {user.lastName} | {user.nickname}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
