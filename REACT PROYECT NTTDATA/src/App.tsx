import AppRouter from '@/app/router/AppRouter';
import { AppProviders } from '@/app/providers/AppProviders';
import '@/App.css';

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}