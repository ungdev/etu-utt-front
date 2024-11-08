import { createAnnal } from '@/api/annals/createAnnal';
import { useEffect, useRef, useState } from 'react';
import styles from './ExamSender.module.scss';
import { useAppTranslation } from '@/lib/i18n';
import FileUpload from '../UI/FileUpload';
import Button from '../UI/Button';
import { Annal, AnnalType } from '@/api/annals/annal.interface';
import { useAPI } from '@/api/api';

export default function ExamSender({
  ueCode,
  annalTypes,
  annalSemesters,
  addAnnal,
  setAnnalUploaderOpen,
}: {
  ueCode: string;
  annalTypes: AnnalType[];
  annalSemesters: string[];
  addAnnal: (annal: Annal) => void;
  setAnnalUploaderOpen: (open: boolean) => void;
}) {
  const { t } = useAppTranslation();
  const [fileRotation, setFileRotation] = useState<number>(0);
  const [annalType, setAnnalType] = useState<string>();
  const [annalSemester, setAnnalSemester] = useState<string>();
  const [isAnnalSendButtonDisabled, setAnnalSendButtonDisabled] = useState(false);
  const fileRef = useRef<File>();
  const api = useAPI();

  useEffect(() => {
    if (annalTypes?.length) setAnnalType(annalTypes[0].id);
    if (annalSemesters?.length) setAnnalSemester(annalSemesters[0]);
  }, [annalTypes, annalSemesters]);

  const onSendExam = async () => {
    if (!fileRef.current || !annalSemester || !annalType) return;
    setAnnalSendButtonDisabled(true);
    const createdAnnal = await createAnnal(api, {
      file: fileRef.current!,
      semester: annalSemester,
      typeId: annalType,
      ueCode: ueCode,
      rotate: fileRotation,
    });
    if (createdAnnal) {
      addAnnal(createdAnnal);
      setAnnalUploaderOpen(false);
    }
    setAnnalSendButtonDisabled(false);
  };

  return (
    <div className={styles.send}>
      <h2>{t('ues:detailed.annals.send')}</h2>
      <div>
        {t('ues:detailed.annals.send.type')}
        <select onChange={(event) => setAnnalType(event.target.value)} value={annalType}>
          {annalTypes &&
            annalTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
        </select>
      </div>
      <div>
        {t('ues:detailed.annals.send.semester')}
        <select onChange={(event) => setAnnalSemester(event.target.value)} value={annalSemester}>
          {annalSemesters &&
            annalSemesters.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
        </select>
      </div>
      <FileUpload
        fileRef={fileRef}
        onFileChange={setFileRotation}
        placeholder={t('ues:detailed.annals.send.placeholder')}
        fileTypes={['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/tiff', 'application/pdf']}
        supportsPictureRotation={true}
      />
      <div className={styles.actionbar}>
        <Button onClick={onSendExam} disabled={isAnnalSendButtonDisabled}>
          {t('ues:detailed.annals.send.sumbit')}
        </Button>
        <Button onClick={() => setAnnalUploaderOpen(false)}>{t('ues:detailed.annals.send.back')}</Button>
      </div>
    </div>
  );
}
