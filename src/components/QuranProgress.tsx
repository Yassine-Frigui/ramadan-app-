import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailyProgress } from '../types';
import { t } from '../i18n';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

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
    backgroundColor: COLORS.bgCard,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '600',
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
  },
  percentage: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.gold,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.bgElevated,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 4,
  },
  stats: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
