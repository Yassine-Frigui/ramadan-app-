import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { usePrayerTimes, useRamadanPlan } from '../hooks';
import { PrayerCard, QuranProgress } from '../components';
import { PRAYER_NAMES } from '../constants';
import { t } from '../i18n';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { prayerTimes, isLoading: prayersLoading, error: prayersError } = usePrayerTimes();
  const { plan, progress, isLoading: planLoading, completedDays, progressPercentage } = useRamadanPlan(30);

  const currentDayProgress = progress.find((p) => p.day === Math.min(completedDays + 1, 30));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('appName')}</Text>
        <Text style={styles.subtitle}>{t('welcomeBack')}</Text>
      </View>

      <TouchableOpacity
        style={styles.quranCard}
        onPress={() => navigation.navigate('Quran')}
        activeOpacity={0.8}
      >
        <Text style={styles.quranTitle}>{t('quranReading')}</Text>
        {planLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : currentDayProgress ? (
          <>
            <Text style={styles.quranDay}>
              {t('dayOf', { day: Math.min(completedDays + 1, 30), total: plan?.totalDays || 30 })}
            </Text>
            <Text style={styles.quranPages}>
              {t('pages', { start: currentDayProgress.pagesStart, end: currentDayProgress.pagesEnd })}
            </Text>
          </>
        ) : null}
      </TouchableOpacity>

      {plan && progress.length > 0 && (
        <QuranProgress progress={progress} totalDays={plan.totalDays} />
      )}

      <View style={styles.prayersSection}>
        <Text style={styles.sectionTitle}>{t('todaysPrayerTimes')}</Text>
        
        {prayersLoading ? (
          <ActivityIndicator size="large" color="#2e7d32" />
        ) : prayersError ? (
          <Text style={styles.errorText}>{prayersError}</Text>
        ) : prayerTimes ? (
          PRAYER_NAMES.map((prayer) => (
            <PrayerCard
              key={prayer}
              name={prayer}
              time={prayerTimes[prayer]}
              onPress={() => navigation.navigate('PrayerTimes')}
            />
          ))
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.settingsText}>{t('settings')}</Text>
      </TouchableOpacity>
    </ScrollView>
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
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 16,
    color: '#e8f5e9',
    marginTop: 4,
    writingDirection: 'rtl',
  },
  quranCard: {
    backgroundColor: '#1b5e20',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  quranTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  quranDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a5d6a7',
    writingDirection: 'rtl',
  },
  quranPages: {
    fontSize: 18,
    color: '#ffffff',
    marginTop: 4,
    writingDirection: 'rtl',
  },
  prayersSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    writingDirection: 'rtl',
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    padding: 16,
  },
  settingsButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  settingsText: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '600',
  },
});
