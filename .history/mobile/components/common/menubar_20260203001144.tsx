import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export default function Menubar() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Menu</Text>

        <TouchableOpacity
          style={[styles.item, { backgroundColor: colors.backgroundCard }]}
          onPress={() => router.push('/profile')}
        >
          <Text style={[styles.itemText, { color: colors.text }]}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.item, { backgroundColor: colors.backgroundCard }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.itemText, { color: colors.text }]}>Close</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 18,
  },
  item: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemText: {
    fontSize: 16,
  },
});
