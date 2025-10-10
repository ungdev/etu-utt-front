import { PropsWithoutRef, ReactNode, useState } from 'react';
import { User } from '@/api/users/user.interface';
import { useAppTranslation } from '@/lib/i18n';
import Icons from '@/icons';
import { UserCard } from '../users/UserCard';
import UserSelector from '../users/UserSelector';
import Input from './Input';
import Button from './Button';

interface DataModalType {
  date: Date;
  user: User;
  string: string;
  stringList: string[];
}

// These options are already of type []
type OptionsFieldsRequired = 'stringList';
// These options must NOT be of type []
type OptionsFieldsPossible = 'string';

interface DataModalEntryBase<T extends keyof DataModalType> {
  type: T;
  defaultValue?: DataModalType[T];
  options: DataModalType[T];
  label: ReactNode;
}

type DataModalEntry<T extends keyof DataModalType> = T extends OptionsFieldsRequired
  ? DataModalEntryBase<T>
  : T extends OptionsFieldsPossible
    ? Omit<DataModalEntryBase<T>, 'options'> & { options?: DataModalEntryBase<T>['options'][] }
    : Omit<DataModalEntryBase<T>, 'options'>;

type DataModalKeys = { [key: string]: keyof DataModalType };

type DataModalSchema<T extends DataModalKeys> = {
  [S in keyof T]: DataModalEntry<T[S]>;
};

type ModalFormProps<Schema extends DataModalKeys> = PropsWithoutRef<{
  fields: DataModalSchema<Schema>;
  onSubmit: (data: { [K in keyof Schema]: DataModalType[Schema[K]] }) => void;
}>;

type ModalStates<Schema extends DataModalKeys> = {
  [K in keyof Schema]: DataModalType[Schema[K]];
};

export function ModalForm<T extends DataModalKeys>({ fields, onSubmit }: ModalFormProps<T>) {
  const { t } = useAppTranslation();
  const [states, setStates] = useState<ModalStates<T>>(
    Object.fromEntries(
      Object.entries(fields).map(([key, field]) => {
        if (field.type === 'stringList') return [key, field.defaultValue || []];
        if (field.type === 'date') return [key, field.defaultValue ?? new Date()];
        if (field.type === 'string') return [key, field.defaultValue ?? ''];
        return [key, undefined];
      }),
    ),
  );

  return (
    <>
      {Object.entries(states).map(([key, state]) => {
        switch (fields[key].type) {
          case 'string':
            return 'options' in fields[key] ? (
              <>
                {fields[key].label}
                {fields[key].options!.map((option) => (
                  <Button
                    key={option}
                    onClick={() =>
                      setStates({
                        ...states,
                        [key]: (states[key] as string) === option ? '' : option,
                      })
                    }>
                    {(state as string) === option ? <Icons.Confirm /> : <Icons.Add />}
                    {option}
                  </Button>
                ))}
              </>
            ) : (
              <>
                {fields[key].label}
                <Input value={state as string} onChange={(value) => setStates({ ...states, [key]: value })} />
              </>
            );
          case 'date':
            return (
              <>
                {fields[key].label}
                <Input
                  value={(state as Date).toISOString().split('T')[0]}
                  type="date"
                  onChange={(value) => setStates({ ...states, [key]: new Date(value) })}
                />
              </>
            );
          case 'user':
            return (
              <>
                {fields[key].label}
                {state ? (
                  <>
                    <UserCard user={state as User} />
                    <Button onClick={() => setStates({ ...states, [key]: undefined })}>
                      <Icons.Close />
                      {t('users:modal.form.change')}
                    </Button>
                  </>
                ) : (
                  <UserSelector onSelect={(user) => setStates({ ...states, [key]: user })} />
                )}
              </>
            );
          case 'stringList':
            return (
              <>
                {fields[key].label}
                {fields[key].options.map((option) => (
                  <Button
                    key={option}
                    onClick={() =>
                      setStates({
                        ...states,
                        [key]: (states[key] as string[]).includes(option)
                          ? (states[key] as string[]).filter((f) => f !== option)
                          : [...(states[key] as string[]), option],
                      })
                    }>
                    {(state as string[]).includes(option) ? <Icons.Confirm /> : <Icons.Add />}
                    {option}
                  </Button>
                ))}
              </>
            );
        }
      })}
      <Button onClick={() => onSubmit(states)}>{t('common:confirm')}</Button>
    </>
  );
}
