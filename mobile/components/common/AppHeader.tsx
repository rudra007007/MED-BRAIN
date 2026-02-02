import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

interface AppHeaderProps {
  userName?: string;
  onMenuPress?: () => void;
}

export default function AppHeader({ userName = 'Alex', onMenuPress }: AppHeaderProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
      return;
    }
    router.push('/menu');
  };

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        {/* Profile Button */}
        <TouchableOpacity
          style={[styles.profileButton, { backgroundColor: colors.backgroundCard, borderColor: colors.accent }]}
          onPress={() => router.push('/profile')}
          activeOpacity={0.7}
        >
          <User size={20} color={colors.accent} />
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {userName}
          </Text>
        </View>

        {/* Menu Button */}
        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: colors.backgroundCard }]}
          onPress={handleMenuPress}
          activeOpacity={0.7}
        >
          <Menu size={20} color={colors.accent} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
