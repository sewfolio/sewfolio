import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../src/lib/supabase";

export default function DevScreen() {
  const [status, setStatus] = useState("Connecting...");
  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from("workbooks")
          .select("*")
          .limit(5);

        if (error) {
          setStatus(`Error: ${error.message}`);
          return;
        }

        setStatus("Supabase connected successfully");
        setTables(data || []);
      } catch (err: any) {
        setStatus(`Failed: ${err.message}`);
      }
    }

    testConnection();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Supabase Test</Text>

        <View style={styles.card}>
          <Text style={styles.status}>{status}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>Workbook Records</Text>

          {tables.length === 0 ? (
            <Text style={styles.empty}>No records yet</Text>
          ) : (
            tables.map((item: any) => (
              <View key={item.id} style={styles.row}>
                <Text>{item.title}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F6F1EB",
  },
  content: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 34,
    marginBottom: 24,
    color: "#2B2B2B",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E7DED4",
  },
  status: {
    fontSize: 16,
    color: "#2B2B2B",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 12,
    color: "#2B2B2B",
  },
  empty: {
    color: "#7B6F63",
  },
  row: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE7DE",
  },
});
