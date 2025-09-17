import TaskList from '@/components/TaskList';
import i18n from '@/i18n/i18n';
import Storage from 'expo-sqlite/kv-store';
import { useEffect } from 'react';
import { ensureNotificationPermissions, initNotiffications } from '../../notifications';

initNotiffications();
ensureNotificationPermissions();

const today = new Date();

export default function Index() {
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
