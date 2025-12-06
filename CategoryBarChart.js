import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CategoryBarChart({ categoryTotals }) {
  const data = Object.keys(categoryTotals).map((key) => ({
    category: key,
    amount: categoryTotals[key],
  }));

  if (data.length === 0) {
    return <Text style={styles.noData}>No category data to display.</Text>;
  }

  return (
    <View style={styles.container}>
   
      <Text style={styles.chartTitle}>Spending by Category</Text>

      <View style={styles.axisTitles}>
        <Text style={styles.yAxisTitle}>Category</Text>
        <Text style={styles.xAxisTitle}>Amount ($)</Text>
      </View>

   
      {data.map((item) => {
       
        const barWidth = `${Math.min(item.amount * 5, 100)}%`; 
        return (
          <View key={item.category} style={styles.row}>
       
            <Text style={styles.label}>{item.category}</Text>

            <View style={styles.barBackground}>
              <View style={[styles.barFill, { width: barWidth }]} />
            </View>

            <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
          </View>
        );
      })}

      <View style={styles.xAxis}>
        <Text style={styles.axisLabel}>0</Text>
        <Text style={styles.axisLabel}>Highest</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: "#1f2937",
    borderRadius: 10,
  },
  chartTitle: {
    color: "#fbbf24",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  axisTitles: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingHorizontal: 5,
  },
  yAxisTitle: {
    color: "#e5e7eb",
    fontSize: 12,
    width: 80,
    fontWeight: "600",
  },
  xAxisTitle: {
    color: "#e5e7eb",
    fontSize: 12,
    flex: 1,
    textAlign: "right",
    fontWeight: "600",
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
    fontWeight: "500",
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
    fontWeight: "500",
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingHorizontal: 5,
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
