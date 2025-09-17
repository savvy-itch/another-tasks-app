import { LanguageObject, Languages } from '@/types';
import { I18n } from "i18n-js";

export const translations: Record<Languages, LanguageObject> = {
  en: {
    langName: 'English',
    today: 'Today',
    calendar: 'Calendar',
    settings: 'Settings',
    save: "Save",
    cancel: "Cancel",
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    settingsTab: {
      fontSize: 'Font size',
      normal: 'Normal',
      large: 'Large',
      theme: 'Theme',
      language: 'Language',
      selectLanguage: 'Select language',
      clearData: 'Clear data',
      appVersion: 'App version'
    },
    noTasks: 'No tasks planned for this day',
  },
  ru: {
    langName: 'Русский',
    today: 'Сегодня',
    calendar: 'Календарь',
    settings: 'Настройки',
    save: "Сохранить",
    cancel: "Отменить",
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    settingsTab: {
      fontSize: 'Размер шрифта',
      normal: 'Нормальный',
      large: 'Крупный',
      theme: 'Тема',
      language: 'Язык',
      selectLanguage: 'Выбрать язык',
      clearData: 'Очистить данные',
      appVersion: 'Версия приложения'
    },
    noTasks: 'Для этого дня не запланировано дел',
  },
  uk: {
    langName: 'Українська',
    today: 'Сьогодні',
    calendar: 'Календар',
    settings: 'Налаштування',
    save: "Зберегти",
    cancel: "Відмінити",
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
    settingsTab: {
      fontSize: 'Розмір шрифту',
      normal: 'Нормальний',
      large: 'Великий',
      theme: 'Тема',
      language: 'Мова',
      selectLanguage: 'Вибрати мову',
      clearData: 'Видалити дані',
      appVersion: 'Версія додатку'
    },
    noTasks: 'Для цього дня не заплановано справ',
  },
}

const i18n = new I18n(translations);
i18n.enableFallback = true;

export default i18n;
