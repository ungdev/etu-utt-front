import { PropsWithoutRef, ReactNode, useEffect, useState } from 'react';
import { User } from '@/api/users/user.interface';
import { useAppTranslation } from '@/lib/i18n';
import Icons from '@/icons';
import { UserCard } from '../users/UserCard';
import UserSelector from '../users/UserSelector';
import Input from './Input';
import Button from './Button';
import styles from './ModalForm.module.scss';

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
  required?: boolean;
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

type ModalStates<Schema extends DataModalKeys> = {
  [K in keyof Schema]: DataModalType[Schema[K]];
};

type WindowOptions = {
  title: string;
  submitText: ReactNode;
};

type ModalFormProps<Schema extends DataModalKeys> = PropsWithoutRef<{
  fields: DataModalSchema<Schema>;
  window: WindowOptions;
  onSubmit: (data: { [K in keyof Schema]: DataModalType[Schema[K]] }) => void;
  onClose: () => void;
}>;

export function ModalForm<T extends DataModalKeys>({ fields, window, onSubmit, onClose }: ModalFormProps<T>) {
  const { t } = useAppTranslation();
  const [isHidden, setIsHidden] = useState(true);
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

  // Fade in effect
  useEffect(() => {
    requestAnimationFrame(() => setIsHidden(false));
  }, [fields]);

  const handleClose = () => {
    setIsHidden(true);
    setTimeout(onClose, 200);
  };

  const handleSubmit = () => {
    onSubmit(states);
    handleClose();
  };

  const canValidate = () =>
    Object.entries(fields).every(
      ([key, field]) =>
        !field.required || (Array.isArray(states[key]) ? (states[key] as string[]).length > 0 : states[key]),
    );

  return (
    <>
      <div
        className={[styles.darkModal, isHidden ? styles.hidden : ''].filter((c) => c).join(' ')}
        onClick={handleClose}></div>
      <div className={[styles.modal, isHidden ? styles.hidden : ''].filter((c) => c).join(' ')}>
        <div className={styles.title}>
          {window.title}
          <div className={styles.close} onClick={handleClose}>
            <Icons.Close />
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.content}>
            {Object.entries(states).map(([key, state]) => {
              let variant: ReactNode | null;
              switch (fields[key].type) {
                case 'string':
                  variant =
                    'options' in fields[key] ? (
                      <div className={styles.options}>
                        {fields[key].options!.map((option) => (
                          <Button
                            className={[styles.option, (state as string) === option && styles.selected]
                              .filter((c) => c)
                              .join(' ')}
                            key={option}
                            onClick={() =>
                              setStates({
                                ...states,
                                [key]: (states[key] as string) === option ? '' : option,
                              })
                            }>
                            {(state as string) === option ? <Icons.Close /> : <Icons.Add />}
                            {option}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <Input value={state as string} onChange={(value) => setStates({ ...states, [key]: value })} />
                    );
                  break;
                case 'date':
                  variant = (
                    <Input
                      value={(state as Date).toISOString().split('T')[0]}
                      type="date"
                      onChange={(value) => setStates({ ...states, [key]: new Date(value) })}
                    />
                  );
                  break;
                case 'user':
                  variant = state ? (
                    <>
                      <UserCard user={state as User} />
                      <Button className={styles.resetUser} onClick={() => setStates({ ...states, [key]: undefined })}>
                        <Icons.Close />
                        {t('users:modal.form.change')}
                      </Button>
                    </>
                  ) : (
                    <UserSelector onSelect={(user) => setStates({ ...states, [key]: user })} />
                  );
                  break;
                case 'stringList':
                  variant = (
                    <div className={styles.options}>
                      {fields[key].options.map((option) => (
                        <Button
                          className={[styles.option, (states[key] as string[]).includes(option) && styles.selected]
                            .filter((c) => c)
                            .join(' ')}
                          key={option}
                          onClick={() =>
                            setStates({
                              ...states,
                              [key]: (states[key] as string[]).includes(option)
                                ? (states[key] as string[]).filter((f) => f !== option)
                                : [...(states[key] as string[]), option],
                            })
                          }>
                          {(state as string[]).includes(option) ? <Icons.Close /> : <Icons.Add />}
                          {option}
                        </Button>
                      ))}
                    </div>
                  );
                  break;
              }
              return (
                <div key={key as string} className={styles.element}>
                  <div className={styles.label}>
                    {fields[key].label}
                    {fields[key].required ? <span className={styles.required}> *</span> : ''}
                  </div>
                  {variant}
                </div>
              );
            })}
          </div>
          <Button className={styles.confirm} disabled={!canValidate()} onClick={handleSubmit}>
            {window.submitText}
          </Button>
        </div>
      </div>
    </>
  );
}
