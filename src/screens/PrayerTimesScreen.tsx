import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { usePrayerTimes } from '../hooks';
import { PrayerCard } from '../components';
import { PRAYER_NAMES } from '../constants';
import { t } from '../i18n';

interface PrayerTimesScreenProps {
  navigation: any;
}

export const PrayerTimesScreen: React.FC<PrayerTimesScreenProps> = ({ navigation }) => {
  const { prayerTimes, isLoading, error, refresh } = usePrayerTimes();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('prayerTimes')}</Text>
        {prayerTimes && (
          <Text style={styles.date}>{prayerTimes.date}</Text>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#2e7d32" style={styles.loader} />
        ) : prayerTimes ? (
          PRAYER_NAMES.map((prayer) => (
            <PrayerCard
              key={prayer}
              name={prayer}
              time={prayerTimes[prayer]}
            />
          ))
        ) : null}

        <TouchableOpacity style={styles.refreshButton} onPress={refresh}>
          <Text style={styles.refreshText}>{t('refreshPrayerTimes')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2e7d32',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    writingDirection: 'rtl',
  },
  date: {
    fontSize: 16,
    color: '#e8f5e9',
    marginTop: 4,
    writingDirection: 'rtl',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loader: {
    marginTop: 40,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#2e7d32',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  refreshText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
