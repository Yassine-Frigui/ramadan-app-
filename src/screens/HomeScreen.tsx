import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { usePrayerTimes, useRamadanPlan } from '../hooks';
import { PRAYER_NAMES } from '../constants';
import { COLORS, SPACING, FONT_SIZES, RADIUS, GLASS_CARD, CARD_SHADOW } from '../constants/theme';
import { t } from '../i18n';
import { formatArabicDate } from '../utils/arabicDate';
import { useDrawer } from '../components/AnimatedDrawer';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { switchScreen } = useDrawer();
  const { prayerTimes, isLoading: prayersLoading, error: prayersError } = usePrayerTimes();
  const {
    isLoading: planLoading, pagesRead, remainingPages, status,
    currentRamadanDay, pagesPerRemainingDay, progressPercentage,
  } = useRamadanPlan(30);


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

  const PRAYER_FA5: Record<string, { icon: string; color: string }> = {
    fajr: { icon: 'moon', color: '#B0C4DE' },
    dhuhr: { icon: 'sun', color: '#FFD700' },
    asr: { icon: 'cloud-sun', color: '#E8B976' },
    maghrib: { icon: 'sun', color: '#FF8C42' },
    isha: { icon: 'star', color: '#8B9DB7' },
  };

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Hero Section ── */}
        <View style={styles.hero}>
          <FontAwesome5 name="star-and-crescent" size={36} color={COLORS.gold} style={{ marginBottom: SPACING.sm }} />
          <Text style={styles.heroTitle}>{t('appName')}</Text>
          <Text style={styles.heroDate}>{formatArabicDate(new Date())}</Text>

          {/* Big Ramadan Day Counter */}
          <View style={styles.dayCounter}>
            <View style={styles.dayCounterRing}>
              <Text style={styles.dayCounterNumber}>{currentRamadanDay}</Text>
            </View>
            <Text style={styles.dayCounterLabel}>{t('ramadanDay', { day: '' }).trim()}</Text>
          </View>

          {/* Mini stats row */}
          <View style={styles.miniStats}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{30 - currentRamadanDay}</Text>
              <Text style={styles.miniStatLabel}>يوم متبقي</Text>
            </View>
            <View style={styles.miniStatDivider} />
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{progressPercentage}%</Text>
              <Text style={styles.miniStatLabel}>ورد القرآن</Text>
            </View>
          </View>
        </View>

        {/* ── Quran Progress Card ── */}
        <TouchableOpacity
          style={styles.quranCard}
          onPress={() => switchScreen('Quran')}
          activeOpacity={0.8}
        >
          <View style={styles.quranCardInner}>
            <View style={styles.quranHeader}>
              <View style={styles.quranIconWrap}>
                <FontAwesome5 name="book-open" size={18} color={COLORS.gold} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.quranTitle}>{t('quranReading')}</Text>
                <Text style={styles.quranPages}>
                  {t('pagesReadSoFar', { pages: pagesRead })}
                </Text>
              </View>
              {!planLoading && (
                <View style={[styles.statusPill, { backgroundColor: statusColor + '18', borderColor: statusColor + '44' }]}>
                  <Text style={[styles.statusPillText, { color: statusColor }]}>{statusLabel}</Text>
                </View>
              )}
            </View>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <LinearGradient
                colors={[COLORS.gold, COLORS.goldLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${Math.min(progressPercentage, 100)}%` }]}
              />
            </View>

            <View style={styles.quranFooter}>
              <Text style={styles.quranMeta}>
                {remainingPages > 0
                  ? t('pagesPerDayDynamic', { pages: pagesPerRemainingDay })
                  : t('allPagesRead')}
              </Text>
              <Text style={styles.quranPercent}>{progressPercentage}%</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── Open Reader CTA ── */}
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
            <FontAwesome5 name="book-open" size={22} color={COLORS.textOnAccent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.readerCtaTitle}>{t('openReader')}</Text>
              <Text style={styles.readerCtaSub}>{t('continueReading')}</Text>
            </View>
            <FontAwesome5 name="arrow-left" size={18} color={COLORS.textOnAccent} />
          </LinearGradient>
        </TouchableOpacity>

        {/* ── Prayer Times Section ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('todaysPrayerTimes')}</Text>
        </View>

        {prayersLoading && (
          <ActivityIndicator size="large" color={COLORS.gold} style={{ marginTop: 20 }} />
        )}
        {!prayersLoading && prayersError && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{prayersError}</Text>
          </View>
        )}
        {!prayersLoading && !prayersError && prayerTimes && (
          <View style={styles.prayerGrid}>
            {PRAYER_NAMES.map((prayer) => (
              <View key={prayer} style={styles.prayerItem}>
                <View style={styles.prayerItemIconWrap}>
                  <FontAwesome5
                    name={PRAYER_FA5[prayer]?.icon || 'clock'}
                    size={16}
                    color={PRAYER_FA5[prayer]?.color || COLORS.textSecondary}
                  />
                </View>
                <Text style={styles.prayerItemName}>{t(prayer)}</Text>
                <Text style={styles.prayerItemTime}>{prayerTimes[prayer]}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingBottom: SPACING.xxl + 20,
  },
  // ── Hero ──
  hero: {
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: FONT_SIZES.heading,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
    writingDirection: 'rtl',
  },
  heroDate: {
    fontSize: FONT_SIZES.bodyLarge,
    color: COLORS.gold,
    marginTop: SPACING.xs,
    writingDirection: 'rtl',
    fontWeight: '500',
  },
  dayCounter: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  dayCounterRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.gold,
    backgroundColor: COLORS.goldGlow,
    justifyContent: 'center',
    alignItems: 'center',
    ...CARD_SHADOW,
  },
  dayCounterNumber: {
    fontSize: FONT_SIZES.hero,
    fontWeight: '800',
    color: COLORS.gold,
  },
  dayCounterLabel: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    writingDirection: 'rtl',
  },
  miniStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
  },
  miniStat: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  miniStatValue: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  miniStatLabel: {
    fontSize: FONT_SIZES.tiny,
    color: COLORS.textMuted,
    marginTop: 2,
    writingDirection: 'rtl',
  },
  miniStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // ── Quran Card ──
  quranCard: {
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  quranCardInner: {
    ...GLASS_CARD,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  quranHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  quranIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.goldGlow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quranTitle: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '700',
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
  },
  quranPages: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
    writingDirection: 'rtl',
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 1,
  },
  statusPillText: {
    fontSize: FONT_SIZES.tiny,
    fontWeight: '700',
    writingDirection: 'rtl',
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  quranFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quranMeta: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.textMuted,
    writingDirection: 'rtl',
  },
  quranPercent: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.gold,
    fontWeight: '600',
  },

  // ── Reader CTA ──
  readerCta: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
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
  readerCtaTitle: {
    fontSize: FONT_SIZES.bodyLarge,
    fontWeight: '700',
    color: COLORS.textOnAccent,
    writingDirection: 'rtl',
  },
  readerCtaSub: {
    fontSize: FONT_SIZES.caption,
    color: 'rgba(8,15,26,0.6)',
    writingDirection: 'rtl',
  },
  // ── Section Header ──
  sectionHeader: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '700',
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
  },

  // ── Prayer Grid ──
  prayerGrid: {
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...GLASS_CARD,
    padding: SPACING.xs,
  },
  prayerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  prayerItemIconWrap: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerItemName: {
    flex: 1,
    fontSize: FONT_SIZES.bodyLarge,
    fontWeight: '600',
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
    marginHorizontal: SPACING.sm,
  },
  prayerItemTime: {
    fontSize: FONT_SIZES.title,
    fontWeight: '700',
    color: COLORS.gold,
    fontVariant: ['tabular-nums'],
  },

  // ── Error ──
  errorCard: {
    backgroundColor: 'rgba(251,113,133,0.08)',
    marginHorizontal: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(251,113,133,0.2)',
  },
  errorText: {
    color: COLORS.statusBehind,
    textAlign: 'center',
    fontSize: FONT_SIZES.body,
  },
});
