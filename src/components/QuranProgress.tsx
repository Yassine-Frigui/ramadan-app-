import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailyProgress } from '../types';
import { t } from '../i18n';

interface QuranProgressProps {
  progress: DailyProgress[];
  totalDays: number;
}

export const QuranProgress: React.FC<QuranProgressProps> = ({ progress, totalDays }) => {
  const completedDays = progress.filter((p) => p.completed).length;
  const percentage = Math.round((completedDays / totalDays) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('ramadanProgress')}</Text>
        <Text style={styles.percentage}>%{percentage}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.stats}>
        {t('daysCompleted', { completed: completedDays, total: totalDays })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    writingDirection: 'rtl',
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2e7d32',
    borderRadius: 4,
  },
  stats: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
