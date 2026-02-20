import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as Location from 'expo-location';
import { COLORS, SPACING, FONT_SIZES, RADIUS, GLASS_CARD } from '../constants/theme';
import { PRAYER_NAMES, RAMADAN_START_DATE } from '../constants';
import {
  fetchAllPrayerSources,
  PRAYER_METHODS,
  MECCA_FALLBACK_TIMES,
  MultiSourceResult,
} from '../services/prayerTimesMulti';
import { LocationData } from '../types';
import { getLocation } from '../storage/storage';
import { t } from '../i18n';

const DEFAULT_LOCATION: LocationData = {
  latitude: 36.8065,
  longitude: 10.1815,
  city: 'تونس',
  country: 'تونس',
};

const PRAYER_ICONS: Record<string, { icon: string; color: string }> = {
  fajr: { icon: 'moon', color: '#B0C4DE' },
  dhuhr: { icon: 'sun', color: '#FFD700' },
  asr: { icon: 'cloud-sun', color: '#87CEEB' },
  maghrib: { icon: 'sun', color: '#FF8C00' },
  isha: { icon: 'star', color: '#7B68EE' },
};

export const PrayerTimesScreen: React.FC = () => {
  const [results, setResults] = useState<MultiSourceResult[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<LocationData | null>(null);

  const today = new Date();
  const diffMs = today.getTime() - RAMADAN_START_DATE.getTime();
  const ramadanDay = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);

  const fetchLocation = useCallback(async (): Promise<LocationData> => {
    try {
      if (Platform.OS === 'web') {
        const saved = await getLocation();
        if (saved) return saved;
        return DEFAULT_LOCATION;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        const saved = await getLocation();
        return saved || DEFAULT_LOCATION;
      }
      const loc = await Location.getCurrentPositionAsync({});
      return {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
    } catch {
      const saved = await getLocation();
      return saved || DEFAULT_LOCATION;
    }
  }, []);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const loc = location || (await fetchLocation());
      setLocation(loc);
      const data = await fetchAllPrayerSources(loc);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [location, fetchLocation]);

  useEffect(() => {
    loadAll();
  }, []);

  const dateStr = results.find((r) => r.times)?.times?.date || '';
  const activeResult = results[activeTab];
  const activeTimes = activeResult?.times;
  const activeError = activeResult?.error;
  const successCount = results.filter((r) => r.times).length;

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
    if (activeTimes) {
      return (
        <View style={styles.timesCard}>
          {PRAYER_NAMES.map((p, i) => renderPrayerRow(p, activeTimes[p], i === PRAYER_NAMES.length - 1))}
        </View>
      );
    }
    if (activeError) {
      return (
        <View style={styles.errorCard}>
          <FontAwesome5 name="exclamation-triangle" size={32} color={COLORS.statusBehind} style={{ marginBottom: SPACING.sm }} />
          <Text style={styles.errorText}>{t('apiError')}</Text>
          <Text style={styles.errorDetail}>{activeError}</Text>
          <View style={styles.fallbackDivider} />
          <Text style={styles.fallbackLabel}>{t('fallbackTimes')}</Text>
          {PRAYER_NAMES.map((p, i) => renderPrayerRow(p, MECCA_FALLBACK_TIMES[p], i === PRAYER_NAMES.length - 1))}
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

      {/* Source tabs with labels */}
      <View style={styles.dotsRow}>
        {PRAYER_METHODS.map((method, index) => {
          const isActive = index === activeTab;
          const hasData = results[index]?.times != null;
          const hasError = results[index]?.error != null;
          return (
            <TouchableOpacity
              key={method.key}
              style={[
                styles.sourceTab,
                isActive && styles.sourceTabActive,
                hasError && !hasData && styles.sourceTabError,
              ]}
              onPress={() => setActiveTab(index)}
              activeOpacity={0.7}
            >
              <Text style={[styles.sourceTabText, isActive && styles.sourceTabTextActive]}>
                {t('prayerSource')} {index + 1}
              </Text>
            </TouchableOpacity>
          );
        })}
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
            <Text style={styles.loaderText}>{t('loadingAllSources')}</Text>
          </View>
        ) : (
          <>
            {renderTimesCard()}

            {/* Comparison table — without source names */}
            {successCount > 1 && (
              <View style={styles.comparisonCard}>
                <View style={styles.comparisonTitleRow}>
                  <FontAwesome5 name="chart-bar" size={16} color={COLORS.gold} />
                  <Text style={styles.comparisonTitle}>{t('comparing')}</Text>
                </View>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderCell, styles.tableFirstCol]}>{t('prayerSource')}</Text>
                  {PRAYER_NAMES.map((p) => (
                    <Text key={p} style={styles.tableHeaderCell}>{t(p)}</Text>
                  ))}
                </View>
                {results.map((r, idx) => {
                  if (!r.times) return null;
                  const isActiveRow = idx === activeTab;
                  return (
                    <TouchableOpacity
                      key={r.method.key}
                      style={[styles.tableRow, isActiveRow && styles.tableRowActive]}
                      onPress={() => setActiveTab(idx)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.tableCell, styles.tableFirstCol, styles.tableCellIndex]}>
                        <Text style={[styles.tableIndexLabel, isActiveRow && styles.tableCellActive]}>{idx + 1}</Text>
                      </View>
                      {PRAYER_NAMES.map((p) => (
                        <Text key={p} style={[styles.tableCell, isActiveRow && styles.tableCellActive]}>
                          {r.times![p]}
                        </Text>
                      ))}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Refresh */}
            <TouchableOpacity style={styles.refreshButton} onPress={loadAll} activeOpacity={0.8}>
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
    paddingHorizontal: SPACING.sm + 2,
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
