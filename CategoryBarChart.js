import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CategoryBarChart({ categoryTotals }) {
  const categories = Object.keys(categoryTotals);
  const amounts = categories.map((c) => categoryTotals[c]);

  if (categories.length === 0) {
    return <Text style={styles.noData}>No category data to display.</Text>;
  }

  const maxAmount = Math.max(...amounts);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending by Category</Text>

      
      <View style={styles.axisTitles}>
        <Text style={styles.yAxisTitle}>Category</Text>
        <Text style={styles.xAxisTitle}>Amount ($)</Text> 
      </View>

      {categories.map((category) => {
        const amount = categoryTotals[category];
        const widthPercent = (amount / maxAmount) * 100;

        return (
          <View key={category} style={styles.row}>
            <Text style={styles.label}>{category}</Text>

            <View style={styles.barBackground}>
              <View style={[styles.barFill, { width: `${widthPercent}%` }]} />
            </View>

            <Text style={styles.amount}>${amount.toFixed(2)}</Text>
          </View>
        );
      })}

     
      <View style={styles.xAxis}>
        <Text style={styles.axisLabel}>0</Text>
        <Text style={styles.axisLabel}>${maxAmount.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 12,
    backgroundColor: "#1f2937",
    borderRadius: 10,
  },
  title: {
    color: "#fbbf24",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  axisTitles: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  yAxisTitle: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "600",
  },
  xAxisTitle: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
    width: 60, 
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    color: "#fff",
    width: 80,
    fontSize: 14,
  },
  barBackground: {
    flex: 1,
    height: 18,
    backgroundColor: "#374151",
    borderRadius: 9,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  barFill: {
    height: "100%",
    backgroundColor: "#fbbf24",
    borderRadius: 9,
  },
  amount: {
    color: "#fff",
    width: 60,
    fontSize: 14,
    textAlign: "right",
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingHorizontal: 8,
  },
  axisLabel: {
    color: "#9ca3af",
    fontSize: 12,
  },
  noData: {
    color: "#fff",
    textAlign: "center",
    marginTop: 12,
  },
});
