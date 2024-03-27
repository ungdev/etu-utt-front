'use client';

import styles from './GoTo.module.scss';
import { useEffect, useRef, useState } from 'react';
import Input from '@/components/UI/Input';
import { NotParameteredTranslationKey, useAppTranslation } from '@/lib/i18n';
import Link from '@/components/UI/Link';
import { useRouter } from 'next/navigation';

interface SearchEntry {
  name: NotParameteredTranslationKey;
  keywordTranslationKeys: NotParameteredTranslationKey[];
  url: string;
}

interface TranslatedSearchEntry extends SearchEntry {
  keywords: string[];
}

const searchEntries: SearchEntry[] = [
  {
    name: 'goTo:users.normal',
    url: '/users',
    keywordTranslationKeys: ['goTo:users.normal.keywords'],
  },
  {
    name: 'goTo:ues.normal',
    url: '/ues',
    keywordTranslationKeys: ['goTo:ues.normal.keywords'],
  },
];

export default function GoTo() {
  const { t, i18n } = useAppTranslation();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [translatedSearchEntries, setTranslatedSearchEntries] = useState<TranslatedSearchEntry[]>([]);
  const [results, setResults] = useState<number[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.ctrlKey) {
        setVisible(true);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setVisible(false);
      }
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);
  useEffect(() => {
    setTranslatedSearchEntries(
      searchEntries.map((entry) => ({
        ...entry,
        keywords: [...entry.keywordTranslationKeys, entry.name]
          .map((key) => t(key).toLowerCase().latinize().split(/\s+/))
          .flat(),
      })),
    );
  }, [i18n.language]);
  useEffect(() => {
    const searchKeywords = search.toLowerCase().latinize().split(/\s+/);
    const newResults = translatedSearchEntries
      .map<[TranslatedSearchEntry, number]>((entry, i) => [entry, i])
      // Only keep results where, for each keyword searched, there is at least one keyword in the entry that contains it
      .filter(([entry]) => searchKeywords.every((keyword) => entry.keywords.some((k) => k.includes(keyword))))
      .map(([, i]) => i);
    setResults(newResults);
    const newSelectedResultIndex = newResults.indexOf(results[selectedResultIndex]);
    setSelectedResultIndex(newSelectedResultIndex === -1 ? 0 : newSelectedResultIndex);
  }, [search, translatedSearchEntries]);
  useEffect(() => {
    if (!visible || !inputRef.current) return;
    inputRef.current.focus();
  }, [visible, inputRef.current]);
  return (
    <div
      className={`${styles.goTo} ${visible ? '' : styles.hidden}`}
      onClick={(e) => (e.target as HTMLElement).classList.contains(styles.goTo) && setVisible(false)}>
      <Input
        ref={inputRef}
        className={styles.input}
        type="text"
        placeholder={t('goTo:search')}
        onChange={(v) => setSearch(v)}
        value={search}
        onArrowPressed={(direction) =>
          direction === 'up'
            ? setSelectedResultIndex((selectedResultIndex - 1 + results.length) % results.length)
            : setSelectedResultIndex((selectedResultIndex + 1) % results.length)
        }
        onEnter={() => {
          if (!results.length) return;
          router.push(translatedSearchEntries[results[selectedResultIndex]].url);
          setVisible(false);
        }}
      />
      <div className={styles.results}>
        {results.map((entryIndex, i) => (
          <Link
            key={entryIndex}
            href={translatedSearchEntries[entryIndex].url}
            className={`${styles.result} ${i === selectedResultIndex ? styles.selected : ''}`}>
            {t(translatedSearchEntries[entryIndex].name)}
          </Link>
        ))}
      </div>
    </div>
  );
}
