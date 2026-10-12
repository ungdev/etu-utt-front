'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Link from '@/components/UI/Link';
import Page from '@/components/utilities/Page';
import { PagePermission, usePageLoaded, useSearchParam } from '@/module/pageSettings';
import { useAPI } from '@/api/api';
import { AssoAccessInfo, confirmAssoAccess, getAssoAccessInfo, requestAssoAccess } from '@/api/assos/access';
import { useAppTranslation } from '@/lib/i18n';
import styles from './style.module.scss';

export default function AssoAccessPage() {
  const token = useSearchParam('token');
  const { internallyLoaded, markPageLoaded } = usePageLoaded();
  const { t } = useAppTranslation();
  const api = useAPI();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [info, setInfo] = useState<AssoAccessInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (internallyLoaded) markPageLoaded();
  }, [internallyLoaded]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getAssoAccessInfo(api, token)
      .on('success', (body) => {
        setInfo(body);
        setName(body.name ?? '');
        setLoading(false);
      })
      .on('error', (_code, error) => {
        toast.error(error ?? t('assos:access.error'));
        setLoading(false);
      })
      .on('failure', () => {
        setLoading(false);
      })
      .on(404, (error) => {
        toast.error(error ?? t('assos:access.error'));
        setLoading(false);
      });
  }, [token]);

  const submitRequest = () => {
    if (!email.trim()) return;
    setLoading(true);
    requestAssoAccess(api, email)
      .on('success', () => {
        setRequested(true);
        setLoading(false);
      })
      .on('error', (_code, error) => {
        toast.error(error ?? t('assos:access.error'));
        setLoading(false);
      })
      .on('failure', () => {
        setLoading(false);
      })
      .on(404, (error) => {
        toast.error(error ?? t('assos:access.error'));
        setLoading(false);
      });
  };

  const confirm = () => {
    if (!token || (info?.action === 'CREATE' && !name.trim())) return;
    setLoading(true);
    confirmAssoAccess(api, {
      token,
      ...(info?.action === 'CREATE' ? { name: name.trim() } : {}),
    })
      .on('success', (body) => {
        router.push(`/assos/${body.asso.id}`);
      })
      .on('error', (_code, error) => {
        toast.error(error ?? t('assos:access.error'));
        setLoading(false);
      })
      .on('failure', () => {
        setLoading(false);
      })
      .on(404, (error) => {
        toast.error(error ?? t('assos:access.error'));
        setLoading(false);
      });
  };

  return (
    <Page permissions={[PagePermission.CONNECTED]} needsLoading={true} className={styles.page}>
      {internallyLoaded && (
        <div className={styles.panel}>
          {token ? (
            <>
              <h1>{t('assos:access.confirm.title')}</h1>
              {loading && !info ? (
                <p>{t('assos:access.loading')}</p>
              ) : (
                info && (
                  <>
                    <p>{t(`assos:access.confirm.${info.action.toLowerCase()}`)}</p>
                    <p className={styles.email}>
                      {t('assos:access.email')}: <strong>{info.email}</strong>
                    </p>
                    {info.action === 'CREATE' ? (
                      <>
                        <Input
                          autoFocus
                          value={name}
                          onChange={setName}
                          onEnter={confirm}
                          placeholder={t('assos:access.name')}
                        />
                      </>
                    ) : (
                      <p className={styles.name}>
                        {t('assos:access.name')}: <strong>{info.name}</strong>
                      </p>
                    )}
                    <Button onClick={confirm} disabled={loading || (info.action === 'CREATE' && !name.trim())}>
                      {t('assos:access.confirm.button')}
                    </Button>
                  </>
                )
              )}
            </>
          ) : requested ? (
            <>
              <h1>{t('assos:access.request.sent.title')}</h1>
              <p>{t('assos:access.request.sent.text', { email })}</p>
              <Link href="/assos">{t('assos:access.back')}</Link>
            </>
          ) : (
            <>
              <h1>{t('assos:access.request.title')}</h1>
              <p>{t('assos:access.request.label')}</p>
              <Input
                autoFocus
                type="email"
                value={email}
                onChange={setEmail}
                onEnter={submitRequest}
                placeholder={t('assos:access.email')}
              />
              <p>{t('assos:access.request.missing')}</p>
              <Button onClick={submitRequest} disabled={loading || !email.trim()}>
                {t('assos:access.request.button')}
              </Button>
            </>
          )}
        </div>
      )}
    </Page>
  );
}
