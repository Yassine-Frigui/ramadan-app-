import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, Platform, FlatList, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePrayerTimes } from '../hooks';
import { LocationData } from '../types';
import { COLORS, SPACING, FONT_SIZES, RADIUS, GLASS_CARD, CARD_SHADOW } from '../constants/theme';
import { COUNTRIES, CountryData, CityData } from '../data/locations';
import { STORAGE_KEYS } from '../constants';
import { t } from '../i18n';

const NOTIFICATION_MINUTES_OPTIONS = [5, 10, 15, 20, 30];

export const SettingsScreen: React.FC = () => {
  const { location, setManualLocation, refresh } = usePrayerTimes();

  // Dropdown state
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [notificationMinutes, setNotificationMinutes] = useState(15);

  const cities = useMemo(() => selectedCountry?.cities || [], [selectedCountry]);

  // Load saved notification minutes
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_MINUTES_BEFORE).then((val) => {
      if (val) setNotificationMinutes(Number(val));
    });
  }, []);

  const handleSetNotificationMinutes = async (minutes: number) => {
    setNotificationMinutes(minutes);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_MINUTES_BEFORE, String(minutes));
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        refresh();
        Alert.alert(t('success'), t('locationPermissionGranted'));
      } else {
        Alert.alert(t('permissionDenied'), t('enableLocationInSettings'));
      }
    } catch (error_) {
      console.warn('Location error:', error_);
      Alert.alert(t('error'), t('failedToRequestLocation'));
    }
  };

  const handleSelectCountry = (country: CountryData) => {
    setSelectedCountry(country);
    setSelectedCity(null); // reset city
    setShowCountryPicker(false);
  };

  const handleSelectCity = (city: CityData) => {
    setSelectedCity(city);
    setShowCityPicker(false);
  };

  const saveSelectedLocation = async () => {
    if (!selectedCity) {
      Alert.alert(t('error'), t('selectCity'));
      return;
    }
    const newLocation: LocationData = {
      latitude: selectedCity.latitude,
      longitude: selectedCity.longitude,
      city: selectedCity.nameAr,
      country: selectedCountry?.nameAr,
    };
    await setManualLocation(newLocation);
    Alert.alert(t('success'), t('locationSaved'));
  };

  /** Fire an instant test notification */
  const sendTestNotification = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(t('testNotificationTitle'), t('testNotificationBody'));
      return;
    }
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert(t('permissionDenied'), t('enableLocationInSettings'));
        return;
      }
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('testNotificationTitle'),
        body: t('testNotificationBody'),
        sound: true,
      },
      trigger: null,
    });
    Alert.alert(t('success'), t('testNotificationSent'));
  };

  /** Render a picker modal (country OR city) */
  const renderPickerModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    data: { key: string; label: string; sublabel?: string; onPress: () => void }[],
  ) => (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <FontAwesome5 name="times" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.key}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.pickerItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <Text style={styles.pickerItemLabel}>{item.label}</Text>
                {item.sublabel ? (
                  <Text style={styles.pickerItemSub}>{item.sublabel}</Text>
                ) : null}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  // Build picker data
  const countryPickerData = COUNTRIES.map((c) => ({
    key: c.nameEn,
    label: c.nameAr,
    sublabel: c.nameEn,
    onPress: () => handleSelectCountry(c),
  }));

  const cityPickerData = cities.map((c) => ({
    key: `${c.nameEn}-${c.latitude}`,
    label: c.nameAr,
    sublabel: c.nameEn,
    onPress: () => handleSelectCity(c),
  }));

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <FontAwesome5 name="cog" size={26} color={COLORS.gold} />
        <Text style={styles.title}>{t('settings')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentInner}>
        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('location')}</Text>

          <View style={styles.locationInfo}>
            <Text style={styles.label}>{t('currentLocation')}</Text>
            {location ? (
              <Text style={styles.value}>
                {location.city ? `${location.city}` : ''}{' '}
                ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
              </Text>
            ) : (
              <Text style={styles.value}>{t('notSet')}</Text>
            )}
          </View>

          <TouchableOpacity style={styles.gpsButton} onPress={requestLocationPermission} activeOpacity={0.8}>
            <LinearGradient
              colors={[COLORS.emerald, COLORS.emeraldDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gpsButtonGradient}
            >
              <FontAwesome5 name="map-marker-alt" size={16} color={COLORS.white} />
              <Text style={styles.gpsButtonText}>{t('useGPS')}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('or')}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Country Dropdown */}
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowCountryPicker(true)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.dropdownText,
              !selectedCountry && styles.dropdownPlaceholder,
            ]}>
              {selectedCountry ? `${selectedCountry.nameAr}  (${selectedCountry.nameEn})` : t('selectCountry')}
            </Text>
            <FontAwesome5 name="chevron-down" size={12} color={COLORS.textMuted} />
          </TouchableOpacity>

          {/* City Dropdown */}
          <TouchableOpacity
            style={[styles.dropdown, !selectedCountry && styles.dropdownDisabled]}
            onPress={() => {
              if (selectedCountry) setShowCityPicker(true);
            }}
            activeOpacity={selectedCountry ? 0.7 : 1}
          >
            <Text style={[
              styles.dropdownText,
              !selectedCity && styles.dropdownPlaceholder,
            ]}>
              {selectedCity ? `${selectedCity.nameAr}  (${selectedCity.nameEn})` : t('selectCity')}
            </Text>
            <FontAwesome5 name="chevron-down" size={12} color={COLORS.textMuted} />
          </TouchableOpacity>

          {selectedCity && (
            <TouchableOpacity style={styles.saveButton} onPress={saveSelectedLocation} activeOpacity={0.8}>
              <FontAwesome5 name="check" size={14} color={COLORS.emerald} style={{ marginRight: 6 }} />
              <Text style={styles.saveButtonText}>{t('saveLocation')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notifications')}</Text>
          <Text style={styles.infoText}>{t('notificationsInfo')}</Text>
          
          {/* Notification Time Picker */}
          <Text style={[styles.label, { marginTop: SPACING.md, marginBottom: SPACING.sm }]}>
            {t('notificationTimeBefore')}
          </Text>
          <View style={styles.minutesRow}>
            {NOTIFICATION_MINUTES_OPTIONS.map((min) => (
              <TouchableOpacity
                key={min}
                style={[
                  styles.minuteChip,
                  notificationMinutes === min && styles.minuteChipActive,
                ]}
                onPress={() => handleSetNotificationMinutes(min)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.minuteChipText,
                  notificationMinutes === min && styles.minuteChipTextActive,
                ]}>
                  {min} {t('minutes')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dev Section */}
        <View style={styles.devSection}>
          <Text style={styles.devSectionTitle}>{t('devSection')}</Text>
          <TouchableOpacity style={styles.testButton} onPress={sendTestNotification} activeOpacity={0.8}>
            <FontAwesome5 name="bell" size={20} color={COLORS.gold} />
            <Text style={styles.testButtonText}>{t('testNotification')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Country Picker Modal */}
      {renderPickerModal(
        showCountryPicker,
        () => setShowCountryPicker(false),
        t('selectCountry'),
        countryPickerData,
      )}

      {/* City Picker Modal */}
      {renderPickerModal(
        showCityPicker,
        () => setShowCityPicker(false),
        t('selectCity'),
        cityPickerData,
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: SPACING.xxl + 24,
    paddingBottom: SPACING.lg,
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
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl + 20,
  },
  section: {
    ...GLASS_CARD,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    writingDirection: 'rtl',
  },
  locationInfo: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    writingDirection: 'rtl',
  },
  value: {
    fontSize: FONT_SIZES.bodyLarge,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
    writingDirection: 'rtl',
    fontWeight: '500',
  },

  // GPS button
  gpsButton: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  gpsButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },

  gpsButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.bodyLarge,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.body,
  },

  // Dropdowns
  dropdown: {
    backgroundColor: COLORS.bgInput,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownDisabled: {
    opacity: 0.35,
  },
  dropdownText: {
    fontSize: FONT_SIZES.bodyLarge,
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
    flex: 1,
  },
  dropdownPlaceholder: {
    color: COLORS.textMuted,
  },


  // Save button
  saveButton: {
    backgroundColor: COLORS.emeraldGlow,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.emerald + '44',
  },
  saveButtonText: {
    color: COLORS.emerald,
    fontSize: FONT_SIZES.bodyLarge,
    fontWeight: '700',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.bgCardSolid,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: '70%',
    paddingBottom: SPACING.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  modalTitle: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '700',
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
  },

  pickerItem: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  pickerItemLabel: {
    fontSize: FONT_SIZES.bodyLarge,
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
    fontWeight: '500',
  },
  pickerItemSub: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  infoText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
    writingDirection: 'rtl',
  },

  // Dev section
  devSection: {
    ...GLASS_CARD,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.xxl,
    borderColor: COLORS.statusBehind + '22',
    borderStyle: 'dashed',
  },
  devSectionTitle: {
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: COLORS.statusBehind,
    marginBottom: SPACING.sm,
    writingDirection: 'rtl',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.gold + '22',
  },

  testButtonText: {
    fontSize: FONT_SIZES.bodyLarge,
    fontWeight: '600',
    color: COLORS.gold,
    writingDirection: 'rtl',
  },

  // Notification minutes picker
  minutesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  minuteChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  minuteChipActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.goldGlow,
  },
  minuteChipText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  minuteChipTextActive: {
    color: COLORS.gold,
  },
});
