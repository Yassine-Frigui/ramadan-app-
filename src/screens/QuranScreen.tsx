import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { useRamadanPlan } from '../hooks';
import { DailyProgress } from '../types';
import { COLORS, SPACING, FONT_SIZES, RADIUS, GLASS_CARD, CARD_SHADOW } from '../constants/theme';
import { t } from '../i18n';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const QuranScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    plan, progress, completedDays, progressPercentage,
    remainingPages, remainingDays, pagesPerRemainingDay,
    currentRamadanDay, readingDay, status, lastReadPage,
  } = useRamadanPlan(30);

  const [showDays, setShowDays] = useState(false);


  const getStatusLabel = () => {
    if (status === 'ahead') return t('statusAhead');
    if (status === 'onTime') return t('statusOnTime');
    return t('statusBehind');
  };
  const getStatusColor = () => {
    if (status === 'ahead') return COLORS.statusAhead;
    if (status === 'onTime') return COLORS.statusOnTime;
    return COLORS.statusBehind;
  };
  const statusLabel = getStatusLabel();
  const statusColor = getStatusColor();

  const toggleDays = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowDays(!showDays);
  };

  const renderDayItem = ({ item }: { item: DailyProgress }) => {
    const isCurrent = !item.completed && (
      progress.findIndex((p) => !p.completed) === progress.indexOf(item)
    );
    const isPast = item.completed;
    const pageCount = item.pagesEnd - item.pagesStart + 1;

    const getDotStyle = () => {
      if (isPast) return styles.dotDone;
      if (isCurrent) return styles.dotCurrent;
      return styles.dotPending;
    };

    return (
      <View
        style={[
          styles.dayCard,
          isPast && styles.dayCardCompleted,
          isCurrent && styles.dayCardCurrent,
          !isCurrent && !isPast && { opacity: 0.5 },
        ]}
      >
        <View style={styles.dayLeft}>
          <View style={[styles.dayDot, getDotStyle()]} />
          <View style={styles.dayInfo}>
            <Text style={[styles.dayNumber, isPast && styles.completedText, isCurrent && styles.currentText]}>
              {t('day', { day: item.day })}
              {isCurrent ? ` ← ${t('currentReading')}` : ''}
            </Text>
            <Text style={[styles.pageRange, isPast && styles.completedTextDim]}>
              {pageCount} {t('pagesPerDayDynamic', { pages: '' }).trim()}
            </Text>
          </View>
        </View>
        {isPast && (
          <View style={styles.checkWrap}>
            <FontAwesome5 name="check" size={14} color={COLORS.statusAhead} />
          </View>
        )}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
      style={styles.container}
    >
      <FlatList
        data={showDays ? progress : []}
        renderItem={renderDayItem}
        keyExtractor={(item) => item.day.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={styles.header}>
              <FontAwesome5 name="quran" size={28} color={COLORS.gold} />
              <Text style={styles.title}>{t('quranReadingPlan')}</Text>
            </View>

            {/* Open Reader CTA */}
            <TouchableOpacity
              style={styles.readerCta}
              onPress={() => navigation.navigate('QuranReader')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.gold, '#C49A5C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.readerCtaGradient}
              >
                <FontAwesome5 name="book-open" size={24} color={COLORS.textOnAccent} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.readerTitle}>{t('openReader')}</Text>
                  <Text style={styles.readerSub}>
                    {lastReadPage > 0 ? t('lastReadPage', { page: lastReadPage }) : t('continueReading')}
                  </Text>
                </View>
                <FontAwesome5 name="arrow-left" size={18} color={COLORS.textOnAccent} />
              </LinearGradient>
            </TouchableOpacity>

            {/* Progress Summary Card */}
            <View style={styles.summaryCard}>
              {/* Progress bar */}
              <View style={styles.progressTrack}>
                <LinearGradient
                  colors={[COLORS.gold, COLORS.goldLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${Math.min(progressPercentage, 100)}%` }]}
                />
              </View>
              <Text style={styles.progressLabel}>
                {t('daysProgress', { completed: completedDays, total: plan?.totalDays || 30, percentage: progressPercentage })}
              </Text>

              {/* Stats grid */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{currentRamadanDay}</Text>
                  <Text style={styles.statLabel}>{t('currentDay')}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{readingDay}</Text>
                  <Text style={styles.statLabel}>{t('readingDayLabel')}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: statusColor }]}>{pagesPerRemainingDay}</Text>
                  <Text style={styles.statLabel}>{t('pagesPerDayDynamic', { pages: '' }).trim()}</Text>
                </View>
              </View>

              {/* Status badge */}
              <View style={[styles.statusBadge, { borderColor: statusColor + '44', backgroundColor: statusColor + '12' }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
              </View>

              {/* Remaining info */}
              {remainingDays > 0 && (
                <Text style={styles.remainingText}>
                  {t('remainingPages', { pages: remainingPages, days: remainingDays })}
                </Text>
              )}
            </View>

            {/* Toggle days */}
            <TouchableOpacity style={styles.toggleButton} onPress={toggleDays} activeOpacity={0.7}>
              <Text style={styles.toggleText}>
                {showDays ? t('hideDays') : t('showDays')}
              </Text>
              <FontAwesome5 name={showDays ? 'chevron-up' : 'chevron-down'} size={12} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: SPACING.xxl + 20,
  },
  // Header
  header: {
    paddingTop: SPACING.xxl + 28,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },

  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '800',
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
  },

  // Reader CTA
  readerCta: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  readerCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md + 2,
    gap: SPACING.sm,
  },

  readerTitle: {
    fontSize: FONT_SIZES.bodyLarge,
    fontWeight: '700',
    color: COLORS.textOnAccent,
    writingDirection: 'rtl',
  },
  readerSub: {
    fontSize: FONT_SIZES.caption,
    color: 'rgba(8,15,26,0.6)',
    marginTop: 2,
    writingDirection: 'rtl',
  },


  // Summary Card
  summaryCard: {
    ...GLASS_CARD,
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    writingDirection: 'rtl',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: FONT_SIZES.heading,
    fontWeight: '800',
    color: COLORS.gold,
  },
  statLabel: {
    fontSize: FONT_SIZES.tiny,
    color: COLORS.textMuted,
    marginTop: 4,
    writingDirection: 'rtl',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  statusBadge: {
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs + 2,
    marginBottom: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.body,
    fontWeight: '700',
    writingDirection: 'rtl',
  },
  remainingText: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    writingDirection: 'rtl',
  },

  // Toggle
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.xl,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: SPACING.xs,
  },
  toggleText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    fontWeight: '600',
    writingDirection: 'rtl',
  },


  // Day Cards
  dayCard: {
    ...GLASS_CARD,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayCardCompleted: {
    borderColor: COLORS.statusAhead + '22',
  },
  dayCardCurrent: {
    borderColor: COLORS.gold + '44',
    borderWidth: 1.5,
  },
  dayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.sm,
  },
  dayDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotDone: { backgroundColor: COLORS.statusAhead },
  dotCurrent: { backgroundColor: COLORS.gold },
  dotPending: { backgroundColor: COLORS.textMuted },
  dayInfo: {
    flex: 1,
  },
  dayNumber: {
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
  },
  completedText: {
    color: COLORS.statusAhead,
  },
  completedTextDim: {
    color: COLORS.textMuted,
  },
  currentText: {
    color: COLORS.gold,
  },
  pageRange: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
    writingDirection: 'rtl',
  },
  checkWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.emeraldGlow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.emerald + '44',
  },

});
