import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

export default function ExpenseScreen() {
  const db = useSQLiteContext();

  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [filter, setFilter] = useState("all");
  const[filteredExpenses, setFilteredExpenses] = useState([]);
  const [editing, setEditing] = useState(null);

  function getFilteredExpenses() {
    const now = new Date();

    if (filter === "week") {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        return expenses.filter(e => new Date(e.date) >= start);
    }
    if (filter === "month") {
        const m = now.getMonth(), y = now.getFullYear();
        return expenses.filter(e => {
            const d = new Date(e.date);
            return d.getMonth() === m && d.getFullYear() === y;
        });
    }
    return expenses;
  }
  const filterLabel = filter === "all" ? "All Time" : filter === "week" ? "This Week" : "This Month";
  const total = filteredExpenses.reduce((acc,expense) => acc + Number(expense.amount), 0);

  const categoryTotals = {};
  filteredExpenses.forEach(e=> {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });

const loadExpenses = async () => {
    const rows = await db.getAllAsync(
      'SELECT * FROM expenses ORDER BY id DESC;'
    );
    setExpenses(rows);
  };

const addExpense = async () => {
    const amountNumber = parseFloat(amount);

    if (isNaN(amountNumber) || amountNumber <= 0) {
      // Basic validation: ignore invalid or non-positive amounts
      return;
    }
    const trimmedCategory = category.trim();
    const trimmedNote = note.trim();
    if (!trimmedCategory) {
      // Category is required
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    await db.runAsync(
      'INSERT INTO expenses (amount, category, note, date) VALUES (?, ?, ?, ?);',
      [amountNumber, trimmedCategory, trimmedNote || null, today]
    );
    setAmount('');
    setCategory('');
    setNote('');
    loadExpenses();
  };

const deleteExpense = async (id) => {
    await db.runAsync('DELETE FROM expenses WHERE id = ?;', [id]);
    loadExpenses();
  };

const saveEdit = async () => {
    await db.runAsync(
      `UPDATE expenses
       SET amount = ?, category = ?, note = ?, date = ?
       WHERE id = ?`,
      [editing.amount,editing.category,editing.note,editing.date,editing.id]
    );
    setEditing(null);
    loadExpenses();
  };

const renderExpense = ({ item }) => (
    <TouchableOpacity onPress={() => setEditing(item)}>
    <View style={styles.expenseRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.expenseAmount}>${Number(item.amount).toFixed(2)}</Text>
        <Text style={styles.expenseCategory}>{item.category}</Text>
        {item.note ? <Text style={styles.expenseNote}>{item.note}</Text> : null}
      </View>

      <TouchableOpacity onPress={() => deleteExpense(item.id)}>
        <Text style={styles.delete}>✕</Text>
      </TouchableOpacity>
    </View>
    </TouchableOpacity>
  );

useEffect(() => {
    async function setup() {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS expenses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          amount REAL NOT NULL,
          category TEXT NOT NULL,
          note TEXT,
          date TEXT NOT NULL
        );
      `);
      await loadExpenses();
    }
    setup();
  }, []);

  useEffect(() => {
    setFilteredExpenses(getFilteredExpenses());
  }, [expenses, filter]);
        
return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Student Expense Tracker</Text>
      {editing &&(
        <View style={styles.editModal}>
             <Text style={styles.modalTitle}>Edit Expense</Text>
            <TextInput 
            style={styles.input}
            value={editing.amount.toString()}
            onChangeText={(text) => setEditing({...editing, amount: text})} 
            placeholder="Amount"/>
            <TextInput
            style={styles.input} 
            value={editing.category}
            onChangeText={(text) => setEditing({...editing, category: text})} 
            placeholder="Category"/>
            <TextInput
            style={styles.input}
            value={editing.note}
            onChangeText={(text) => setEditing({...editing, note: text})} 
            placeholder="Note (optional)"/>
             <TextInput
             style={styles.input}
            value={editing.date}
            onChangeText={(text) => setEditing({...editing, date: text})} 
            placeholder="YYYY-MM-DD"/>
            <Button title="save" onPress={saveEdit} />
            <Button title="cancel" onPress={() => setEditing(null)} /> 
        </View>
      )}

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Amount (e.g. 12.50)"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={styles.input}
          placeholder="Category (Food, Books, Rent...)"
          placeholderTextColor="#9ca3af"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Note (optional)"
          placeholderTextColor="#9ca3af"
          value={note}
          onChangeText={setNote}
        />
        <Button title="Add Expense" onPress={addExpense} />
      </View>

      <View style={styles.filters}>
        <Button title="All" onPress={()=> setFilter('all')} />
        <Button title="This Week" onPress={()=> setFilter('week')} />
        <Button title="This Month" onPress={()=> setFilter('month')} />
      </View>

       <Text style={[styles.totalText,{ fontSize: 22, fontWeight:"bold"}]}>
        Total Spending ({filterLabel}): ${total.toFixed(2)}
      </Text>

      <View>
        {Object.entries(categoryTotals).map(([cat, amt]) => (
            <Text key={cat}> {cat}: ${amt.toFixed(2)}</Text>
        ))}
      </View>

      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExpense}
        ListEmptyComponent={
          <Text style={styles.empty}>No expenses yet.</Text>
        }
      />

      <Text style={styles.footer}>
        Enter your expenses and they’ll be saved locally with SQLite.
      </Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#111827' },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  form: {
    marginBottom: 16,
    gap: 8,
  },
  input: {
    padding: 10,
    backgroundColor: '#1f2937',
    color: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fbbf24',
  },
  expenseCategory: {
    fontSize: 14,
    color: '#e5e7eb',
  },
  expenseNote: {
    fontSize: 12,
    color: '#9ca3af',
  },
  delete: {
    color: '#f87171',
    fontSize: 20,
    marginLeft: 12,
  },
  empty: {
    color: '#9ca3af',
    marginTop: 24,
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 12,
    fontSize: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fbbf24',
    marginBottom: 12,
    textAlign: 'center',
  },
});