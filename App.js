import { SQLiteProvider } from 'expo-sqlite';
import ExpenseScreen from './ExpensesScreen';

export default function App() {
  return (
    <SQLiteProvider databaseName="expenses.db">
      <ExpenseScreen />
    </SQLiteProvider>
  );
}
