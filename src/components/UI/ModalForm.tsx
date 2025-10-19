import { PropsWithoutRef, ReactNode, useEffect, useState } from 'react';
import { User } from '@/api/users/user.interface';
import { useAppTranslation } from '@/lib/i18n';
import Icons from '@/icons';
import { UserCard } from '../users/UserCard';
import UserSelector from '../users/UserSelector';
import Input from './Input';
import Button from './Button';
import styles from './ModalForm.module.scss';
import { c } from '@/utils';

/**
 * An interface used as Mapping type for all possible data types you can retrieve with a {@link ModalForm}.
 * It maps properties passed to {@link DataModalSchema} to their actual TypeScript types.
 */
interface DataModalType {
  /** Will provide a user-selected {@link Date} */
  date: Date;
  /** Will provide a user-selected {@link User} */
  user: User;
  /** Will provide a user-entered `string` or a `string` from the list provided in the `options` field */
  string: string;
  /** Will provide a subset of the list provided in the `options` field */
  stringList: string[];
}

/**
 * All keys of {@link DataModalType} whose type require an `options` field in {@link DataModalEntry}.
 * These are types are already arrays.
 */
type OptionsFieldsRequired = 'stringList';
/**
 * All keys of {@link DataModalType} whose type require an `options` field in
 * {@link DataModalEntry}. The actual type associated with this key must not already be an array
 */
type OptionsFieldsPossible = 'string';

/**
 * Represents all different fields that can be used for a single entry in a {@link DataModalSchema}
 * It will be asosciated with a key in the schema to define the type of data to be retrieved from the user.
 */
interface DataModalEntryBase<T extends keyof DataModalType> {
  /** The data type (key of {@link DataModalType}). Not only used for type reasons but also for proper UI selection */
  type: T;
  /**
   * The default value to use if the user doesn't update this part of the modal.
   * Will be displayed as a value in the field before the user does anything.
   */
  defaultValue?: DataModalType[T];
  /**
   * Options are used to provide a list of possible values for certain types.
   * When using options, you can choose to add label. In that case, use the `[T, T]` format
   * where the first element is the label and the second one is the actual value (the value
   * won't be displayed to the user)
   */
  options: DataModalType[T] | [DataModalType[T], DataModalType[T]];
  /** What the user will be prompted right above this input field */
  label: ReactNode;
  /** Whether this field must not be empty for the Modal to close with a response */
  required?: boolean;
}

/**
 * A type that filters the 'options' property of {@link DataModalEntryBase} depending on its use
 * If the type is in {@link OptionsFieldsRequired}, options are mandatory and they are already an Array.
 * If the type is in {@link OptionsFieldsPossible}, options are optional and they must be wrapped in an Array.
 */
type DataModalEntry<T extends keyof DataModalType> = T extends OptionsFieldsRequired
  ? DataModalEntryBase<T>
  : T extends OptionsFieldsPossible
    ? Omit<DataModalEntryBase<T>, 'options'> & { options?: DataModalEntryBase<T>['options'][] }
    : Omit<DataModalEntryBase<T>, 'options'>;

/** A list of all entries you have in the {@link ModalForm} along with the type associated to each entry */
type DataModalKeys = Record<string, keyof DataModalType>;

/**
 * Object containing the different entries/fields of your {@link ModalForm}.
 * The key will be used to retrieve the appropriate field data when the user submits the form.
 */
export type DataModalSchema<Schema extends DataModalKeys> = {
  [K in keyof Schema]: DataModalEntry<Schema[K]>;
};

/**
 * The user-provided data for all fields of the {@link ModalForm}.
 * Retrieve the proper field using the key provided in the {@link DataModalSchema}
 */
export type ModalStates<Schema extends DataModalKeys> = {
  [K in keyof Schema]: DataModalType[Schema[K]];
};

/** Some options for extra modal customization */
export type WindowOptions = {
  title: string;
  submitText: ReactNode;
};

type ModalFormProps<Schema extends DataModalKeys> = PropsWithoutRef<{
  fields: DataModalSchema<Schema>;
  window: WindowOptions;
  onSubmit: (data: ModalStates<Schema>) => void;
  onClose: () => void;
}>;

export function ModalForm<T extends DataModalKeys>({ fields, window, onSubmit, onClose }: ModalFormProps<T>) {
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
      <div className={c(styles.darkModal, isHidden && styles.hidden)} onClick={handleClose}></div>
      <div className={c(styles.modal, isHidden && styles.hidden)}>
        <div className={styles.title}>
          {window.title}
          <div className={styles.close} onClick={handleClose}>
            <Icons.Close />
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.content}>
            {Object.entries(states).map(([key, state]) => (
              <div key={key as string} className={styles.element}>
                <div className={styles.label}>
                  {fields[key].label}
                  {fields[key].required ? <span className={styles.required}> *</span> : ''}
                </div>
                {fields[key].type === 'string' && (
                  <StringFormPart
                    field={fields[key]}
                    fieldKey={key}
                    state={state as string}
                    states={states}
                    setStates={setStates}
                  />
                )}
                {fields[key].type === 'date' && (
                  <DateFormPart
                    field={fields[key]}
                    fieldKey={key}
                    state={state as Date}
                    states={states}
                    setStates={setStates}
                  />
                )}
                {fields[key].type === 'user' && (
                  <UserFormPart
                    field={fields[key]}
                    fieldKey={key}
                    state={state as User}
                    states={states}
                    setStates={setStates}
                  />
                )}
                {fields[key].type === 'stringList' && (
                  <StringListFormPart
                    field={fields[key]}
                    fieldKey={key}
                    state={state as string[]}
                    states={states}
                    setStates={setStates}
                  />
                )}
              </div>
            ))}
          </div>
          <Button className={styles.confirm} disabled={!canValidate()} onClick={handleSubmit}>
            {window.submitText}
          </Button>
        </div>
      </div>
    </>
  );
}

function StringFormPart<T extends DataModalKeys>({
  fieldKey,
  state,
  field,
  states,
  setStates,
}: {
  fieldKey: keyof T;
  state: string;
  field: DataModalEntry<'string'>;
  states: ModalStates<T>;
  setStates: (states: ModalStates<T>) => void;
}) {
  return 'options' in field ? (
    <div className={styles.options}>
      {field.options!.map((option) => {
        const optionLabel = Array.isArray(option) ? option[0] : option;
        const optionValue = Array.isArray(option) ? option[1] : option;
        return (
          <Button
            className={c(styles.option, state === optionValue && styles.selected)}
            key={optionValue}
            onClick={() =>
              setStates({
                ...states,
                [fieldKey]: state === optionValue ? '' : optionValue,
              })
            }>
            {state === optionValue ? <Icons.Close /> : <Icons.Add />}
            {optionLabel}
          </Button>
        );
      })}
    </div>
  ) : (
    <Input value={state} onChange={(value) => setStates({ ...states, [fieldKey]: value })} />
  );
}

function DateFormPart<T extends DataModalKeys>({
  fieldKey,
  state,
  field,
  states,
  setStates,
}: {
  fieldKey: keyof T;
  state: Date;
  field: DataModalEntry<'date'>;
  states: ModalStates<T>;
  setStates: (states: ModalStates<T>) => void;
}) {
  return (
    <Input
      value={state.toISOString().split('T')[0]}
      type="date"
      onChange={(value) => setStates({ ...states, [fieldKey]: new Date(value) })}
    />
  );
}

function UserFormPart<T extends DataModalKeys>({
  fieldKey,
  state,
  field,
  states,
  setStates,
}: {
  fieldKey: keyof T;
  state: User;
  field: DataModalEntry<'user'>;
  states: ModalStates<T>;
  setStates: (states: ModalStates<T>) => void;
}) {
  const { t } = useAppTranslation();
  return state ? (
    <>
      <UserCard user={state} />
      <Button className={styles.resetUser} onClick={() => setStates({ ...states, [fieldKey]: undefined })}>
        <Icons.Close />
        {t('users:modal.form.change')}
      </Button>
    </>
  ) : (
    <UserSelector onSelect={(user) => setStates({ ...states, [fieldKey]: user })} />
  );
}

function StringListFormPart<T extends DataModalKeys>({
  fieldKey,
  state,
  field,
  states,
  setStates,
}: {
  fieldKey: keyof T;
  state: string[];
  field: DataModalEntry<'stringList'>;
  states: ModalStates<T>;
  setStates: (states: ModalStates<T>) => void;
}) {
  return (
    <div className={styles.options}>
      {field.options.map((option) => {
        const optionLabel = Array.isArray(option) ? option[0] : option;
        const optionValue = Array.isArray(option) ? option[1] : option;
        return (
          <Button
            className={c(styles.option, state.includes(optionValue) && styles.selected)}
            key={optionValue}
            onClick={() =>
              setStates({
                ...states,
                [fieldKey]: state.includes(optionValue)
                  ? state.filter((f) => f !== optionValue)
                  : [...state, optionValue],
              })
            }>
            {state.includes(optionValue) ? <Icons.Close /> : <Icons.Add />}
            {optionLabel}
          </Button>
        );
      })}
    </div>
  );
}
