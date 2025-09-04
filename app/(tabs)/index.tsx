import TaskList from '@/components/TaskList';
import { ensureNotificationPermissions, initNotiffications } from '../../notifications';

initNotiffications();
ensureNotificationPermissions();

const today = new Date();

export default function Index() {
  return <TaskList targetDate={today} />
}
