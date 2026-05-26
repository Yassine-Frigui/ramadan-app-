import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { COLORS, SPACING, FONT_SIZES, RADIUS, GLASS_CARD } from '../constants/theme';
import { PRAYER_NAMES, RAMADAN_START_DATE } from '../constants';
import { usePrayerTimes } from '../hooks';
import { t } from '../i18n';

const PRAYER_ICONS: Record<string, { icon: string; color: string }> = {
  fajr: { icon: 'moon', color: '#B0C4DE' },
  dhuhr: { icon: 'sun', color: '#FFD700' },
  asr: { icon: 'cloud-sun', color: '#87CEEB' },
  maghrib: { icon: 'sun', color: '#FF8C00' },
  isha: { icon: 'star', color: '#7B68EE' },
};

export const PrayerTimesScreen: React.FC = () => {
  const {
    prayerTimes,
    isLoading,
    error,
    refresh,
  } = usePrayerTimes();

  const today = new Date();
  const diffMs = today.getTime() - RAMADAN_START_DATE.getTime();
  const ramadanDay = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);

  const dateStr = prayerTimes?.date || '';

  const renderPrayerRow = (name: string, time: string, isLast: boolean) => {
    const iconData = PRAYER_ICONS[name] || { icon: 'clock', color: COLORS.textMuted };
    return (
      <View key={name} style={[styles.prayerRow, isLast && styles.prayerRowLast]}>
        <View style={styles.prayerLeft}>
          <View style={styles.prayerIconWrap}>
            <FontAwesome5 name={iconData.icon} size={18} color={iconData.color} />
          </View>
          <Text style={styles.prayerName}>{t(name)}</Text>
        </View>
        <Text style={styles.prayerTime}>{time}</Text>
      </View>
    );
  };

  const renderTimesCard = () => {
    if (prayerTimes) {
      return (
        <View style={styles.timesCard}>
          {PRAYER_NAMES.map((p, i) => renderPrayerRow(p, prayerTimes[p], i === PRAYER_NAMES.length - 1))}
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.errorCard}>
          <FontAwesome5 name="exclamation-triangle" size={32} color={COLORS.statusBehind} style={{ marginBottom: SPACING.sm }} />
          <Text style={styles.errorText}>{t('apiError')}</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <FontAwesome5 name="mosque" size={28} color={COLORS.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{t('prayerTimes')}</Text>
            {dateStr ? <Text style={styles.date}>{dateStr}</Text> : null}
          </View>
          <View style={styles.ramadanBadge}>
            <Text style={styles.ramadanBadgeText}>{ramadanDay}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentInner}
      >
        {isLoading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={COLORS.gold} />
            <Text style={styles.loaderText}>{t('loadingPrayerTimes')}</Text>
          </View>
        ) : (
          <>
            {renderTimesCard()}

            {/* Refresh */}
            <TouchableOpacity style={styles.refreshButton} onPress={refresh} activeOpacity={0.8}>
              <FontAwesome5 name="sync-alt" size={16} color={COLORS.gold} style={{ marginRight: 8 }} />
              <Text style={styles.refreshText}>{t('refreshPrayerTimes')}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    paddingTop: SPACING.xxl + 24,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  headerTop: {
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
  date: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
    writingDirection: 'rtl',
  },
  ramadanBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.goldGlow,
    borderWidth: 1.5,
    borderColor: COLORS.gold + '55',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ramadanBadgeText: {
    fontSize: FONT_SIZES.subtitle,
    color: COLORS.gold,
    fontWeight: '800',
  },

  // Source tabs
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: SPACING.xs,
    flexWrap: 'wrap',
  },
  sourceTab: {
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sourceTabActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.goldGlow,
  },
  sourceTabError: {
    borderColor: COLORS.statusBehind + '55',
  },
  sourceTabText: {
    fontSize: FONT_SIZES.tiny,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  sourceTabTextActive: {
    color: COLORS.gold,
  },

  // Content
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl + 20,
  },
  loaderWrap: {
    alignItems: 'center',
    marginTop: 80,
    gap: SPACING.md,
  },
  loaderText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textMuted,
    writingDirection: 'rtl',
  },

  // Prayer times card
  timesCard: {
    ...GLASS_CARD,
    borderRadius: RADIUS.xl,
    padding: SPACING.sm,
    overflow: 'hidden',
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  prayerRowLast: {
    borderBottomWidth: 0,
  },
  prayerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  prayerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  prayerName: {
    fontSize: FONT_SIZES.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '600',
    writingDirection: 'rtl',
  },
  prayerTime: {
    fontSize: FONT_SIZES.title,
    color: COLORS.gold,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },

  // Error card
  errorCard: {
    ...GLASS_CARD,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderColor: COLORS.statusBehind + '22',
    alignItems: 'center',
  },

  errorText: {
    color: COLORS.statusBehind,
    fontSize: FONT_SIZES.bodyLarge,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorDetail: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.caption,
    marginTop: 4,
    textAlign: 'center',
  },
  fallbackDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignSelf: 'stretch',
    marginVertical: SPACING.md,
  },
  fallbackLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    writingDirection: 'rtl',
    alignSelf: 'stretch',
  },

  // Comparison table
  comparisonCard: {
    ...GLASS_CARD,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginTop: SPACING.lg,
  },
  comparisonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  comparisonTitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textPrimary,
    fontWeight: '700',
    writingDirection: 'rtl',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gold + '33',
    paddingBottom: 8,
    marginBottom: 4,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: FONT_SIZES.tiny,
    color: COLORS.gold,
    fontWeight: '700',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  tableFirstCol: {
    flex: 0.5,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
  },
  tableRowActive: {
    backgroundColor: COLORS.goldGlow,
    borderRadius: RADIUS.sm,
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  tableCellActive: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  tableCellIndex: {
    flex: 0.5,
    flexDirection: 'row',
  },
  tableIndexLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },

  // Refresh
  refreshButton: {
    ...GLASS_CARD,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    borderColor: COLORS.gold + '22',
  },
  refreshText: {
    color: COLORS.gold,
    fontSize: FONT_SIZES.bodyLarge,
    fontWeight: '600',
  },
});
