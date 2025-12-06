import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CategoryBarChart({ categoryTotals }) {
  const categories = Object.keys(categoryTotals);
  const amounts = categories.map((c) => categoryTotals[c]);

  if (categories.length === 0) {
    return <Text style={styles.noData}>No category data to display.</Text>;
  }

  const maxValue = Math.max(...amounts);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending by Category</Text>

      {categories.map((category) => {
        const amount = categoryTotals[category];
        const widthPercent = (amount / maxValue) * 100;

        return (
          <View key={category} style={styles.row}>
            <Text style={styles.label}>{category}</Text>

            <View style={styles.barBackground}>
              <View
                style={[styles.barFill, { width: `${widthPercent}%` }]}
              />
            </View>

            <Text style={styles.amount}>${amount.toFixed(2)}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    color: "#fff",
    width: 80,
    fontSize: 14,
  },
  barBackground: {
    flex: 1,
    height: 12,
    backgroundColor: "#374151",
    borderRadius: 6,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  barFill: {
    height: "100%",
    backgroundColor: "#fbbf24",
    borderRadius: 6,
  },
  amount: {
    color: "#fff",
    width: 60,
    fontSize: 14,
    textAlign: "right",
  },
  noData: {
    color: "#fff",
    textAlign: "center",
    marginTop: 12,
  },
});