import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getPrayerLabel } from '../i18n';
import { COLORS, SPACING, FONT_SIZES, RADIUS, GLASS_CARD } from '../constants/theme';

const PRAYER_ICONS: Record<string, string> = {
  fajr: '🌙',
  dhuhr: '☀️',
  asr: '🌤️',
  maghrib: '🌅',
  isha: '🌃',
};

interface PrayerCardProps {
  name: string;
  time: string;
  onPress?: () => void;
}

export const PrayerCard: React.FC<PrayerCardProps> = ({ name, time, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{PRAYER_ICONS[name.toLowerCase()] || '🕐'}</Text>
      </View>
      <Text style={styles.prayerName}>{getPrayerLabel(name)}</Text>
      <Text style={styles.prayerTime}>{time}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    ...GLASS_CARD,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginVertical: 4,
    marginHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  icon: {
    fontSize: 18,
  },
  prayerName: {
    flex: 1,
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '600',
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
  },
  prayerTime: {
    fontSize: FONT_SIZES.title,
    fontWeight: '700',
    color: COLORS.gold,
    fontVariant: ['tabular-nums'],
  },
});
