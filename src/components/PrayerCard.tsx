import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getPrayerLabel } from '../i18n';

interface PrayerCardProps {
  name: string;
  time: string;
  onPress?: () => void;
}

export const PrayerCard: React.FC<PrayerCardProps> = ({ name, time, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.prayerName}>{getPrayerLabel(name)}</Text>
      <Text style={styles.prayerTime}>{time}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  prayerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    writingDirection: 'rtl',
  },
  prayerTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
});
