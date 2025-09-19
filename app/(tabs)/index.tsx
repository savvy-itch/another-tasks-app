import TaskList from '@/components/TaskList';
import { useTranslation } from '@/hooks/useTranslation';
import Storage from 'expo-sqlite/kv-store';
import { useEffect } from 'react';
import { ensureNotificationPermissions, initNotiffications } from '../../notifications';

initNotiffications();
ensureNotificationPermissions();

const today = new Date();

export default function Index() {
  const i18n = useTranslation();
  
  useEffect(() => {
    async function loadLangPref() {
      try {
        const storedLang = await Storage.getItem('lang');
        if (storedLang) {
          i18n.locale = storedLang;
        }
      } catch (error) {
        console.error(error);
      }
    }
    loadLangPref();
  }, []);

  return <TaskList targetDate={today} />
}
