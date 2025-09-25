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
    ok: 'OK',
    newTaskPlaceholder: "Enter new task...",
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    settingsTab: {
      fontSize: 'Font size',
      normal: 'Normal',
      large: 'Large',
      theme: 'Theme',
      language: 'Language',
      selectLanguage: 'Select language',
      clearData: 'Clear data',
      clearDataDialog: 'Are you sure you want to delete all app data?',
      appVersion: 'App version',
    },
    noTasks: 'No tasks planned for this day',
    task: {
      edit: 'Edit',
      delete: 'Delete',
      reminder: 'Reminder',
      deleteReminder: 'Delete reminder',
      changePriority: 'Change priority'
    },
    priorities: {
      General: 'General',
      Important: 'Important',
    },
    priority: "Priority",
  },
  ru: {
    langName: 'Русский',
    today: 'Сегодня',
    calendar: 'Календарь',
    settings: 'Настройки',
    save: "Сохранить",
    cancel: "Отменить",
    ok: 'Oк',
    newTaskPlaceholder: 'Введите новую задачу...',
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    settingsTab: {
      fontSize: 'Размер шрифта',
      normal: 'Нормальный',
      large: 'Крупный',
      theme: 'Тема',
      language: 'Язык',
      selectLanguage: 'Выбрать язык',
      clearData: 'Очистить данные',
      clearDataDialog: 'Вы уверены, что хотите удалить все данные приложения?',
      appVersion: 'Версия приложения',
    },
    noTasks: 'Для этого дня не запланировано дел',
    task: {
      edit: 'Редактировать',
      delete: 'Удалить',
      reminder: 'Напоминание',
      deleteReminder: 'Удалить напоминание',
      changePriority: 'Изменить приоритет',
    },
    priorities: {
      General: 'Обычное',
      Important: 'Важное',
    },
    priority: "Приоритет"
  },
  uk: {
    langName: 'Українська',
    today: 'Сьогодні',
    calendar: 'Календар',
    settings: 'Налаштування',
    save: "Зберегти",
    cancel: "Відмінити",
    ok: 'Oк',
    newTaskPlaceholder: 'Введіть нову задачу...',
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
    settingsTab: {
      fontSize: 'Розмір шрифту',
      normal: 'Нормальний',
      large: 'Великий',
      theme: 'Тема',
      language: 'Мова',
      selectLanguage: 'Вибрати мову',
      clearData: 'Видалити дані',
      clearDataDialog: 'Ви впевнені, що хочете видалити всі дані додатку?',
      appVersion: 'Версія додатку',
    },
    noTasks: 'Для цього дня не заплановано справ',
    task: {
      edit: 'Редагувати',
      delete: 'Видалити',
      reminder: 'Нагадування',
      deleteReminder: 'Видалити нагадування',
      changePriority: 'Змінити пріорітет',
    },
    priorities: {
      General: 'Звичайне',
      Important: 'Важливе',
    },
    priority: "Пріорітет"
  },
}

const i18n = new I18n(translations);
i18n.enableFallback = true;

export default i18n;
