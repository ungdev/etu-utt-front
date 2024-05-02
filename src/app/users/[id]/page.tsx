'use client';
import styles from './style.module.scss';
import { useParams } from 'next/navigation';
import { useUser } from '@/api/users/getUser';
import { usePageSettings } from '@/module/pageSettings';
import { useAppTranslation } from '@/lib/i18n';

function userData(data: string | number | undefined | null, label: string) {
  return (
    data && (
      <tr>
        <td>
          <strong>{label}</strong>
        </td>
        <td>{data}</td>
      </tr>
    )
  );
}

export default function UserPage() {
  usePageSettings({});
  const { id: userId } = useParams<{ id: string }>();
  const user = useUser(userId);
  const { t } = useAppTranslation();
  if (!user) {
    return false;
  }
  return (
    <div className={styles.page}>
      <h2>{t('users:generalInfo.title')}</h2>
      <table>
        {userData(user.nickname, t('users:nickname'))}
        {userData(user.sex, t('users:sex'))}
        {userData(user.mailUTT, t('users:mailUTT'))}
        {userData(user.mailPersonal, t('users:mailPersonal'))}
        {userData(user.facebook, t('users:facebook'))}
        {userData(user.phone, t('users:phone'))}
        {userData(user.website, t('users:website'))}
        {userData(user.passions, t('users:passions'))}
        {userData(user.birthday?.toLocaleDateString(), t('users:birthday'))}
        {userData(user.branch, t('users:branch'))}
        {userData(user.semester, t('users:semester'))}
        {userData(user.branchOption, t('users:branchOption'))}
      </table>
    </div>
  );
}
