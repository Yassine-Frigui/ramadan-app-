import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRamadanPlan } from '../hooks';
import { Checkbox } from '../components';
import { DailyProgress } from '../types';
import { t } from '../i18n';

interface QuranScreenProps {
  navigation: any;
}

export const QuranScreen: React.FC<QuranScreenProps> = ({ navigation }) => {
  const { plan, progress, toggleDayCompletion, completedDays, progressPercentage } = useRamadanPlan(30);

  const renderDayItem = ({ item }: { item: DailyProgress }) => (
    <View style={[styles.dayCard, item.completed && styles.dayCardCompleted]}>
      <View style={styles.dayInfo}>
        <Text style={[styles.dayNumber, item.completed && styles.completedText]}>
          {t('day', { day: item.day })}
        </Text>
        <Text style={[styles.pageRange, item.completed && styles.completedText]}>
          {t('pageRange', { start: item.pagesStart, end: item.pagesEnd })}
        </Text>
      </View>
      <Checkbox checked={item.completed} onToggle={() => toggleDayCompletion(item.day)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('quranReadingPlan')}</Text>
        <Text style={styles.progress}>
          {t('daysProgress', { completed: completedDays, total: plan?.totalDays || 30, percentage: progressPercentage })}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
      </View>

      <FlatList
        data={progress}
        renderItem={renderDayItem}
        keyExtractor={(item) => item.day.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
  progress: {
    fontSize: 16,
    color: '#e8f5e9',
    marginTop: 4,
    writingDirection: 'rtl',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#a5d6a7',
  },
  list: {
    padding: 16,
  },
  dayCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dayCardCompleted: {
    backgroundColor: '#e8f5e9',
  },
  dayInfo: {
    flex: 1,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    writingDirection: 'rtl',
  },
  pageRange: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    writingDirection: 'rtl',
  },
  completedText: {
    color: '#2e7d32',
  },
});
