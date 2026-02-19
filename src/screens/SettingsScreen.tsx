import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import * as Location from 'expo-location';
import { usePrayerTimes } from '../hooks';
import { LocationData } from '../types';
import { t } from '../i18n';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { location, setManualLocation, refresh } = usePrayerTimes();
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        refresh();
        Alert.alert(t('success'), t('locationPermissionGranted'));
      } else {
        Alert.alert(t('permissionDenied'), t('enableLocationInSettings'));
      }
    } catch (error) {
      Alert.alert(t('error'), t('failedToRequestLocation'));
    }
  };

  const saveManualLocation = async () => {
    if (!city || !country) {
      Alert.alert(t('error'), t('enterCityAndCountry'));
      return;
    }

    const newLocation: LocationData = {
      latitude: 0,
      longitude: 0,
      city,
      country,
    };

    await setManualLocation(newLocation);
    Alert.alert(t('success'), t('locationSaved'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('settings')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('location')}</Text>
          
          <View style={styles.locationInfo}>
            <Text style={styles.label}>{t('currentLocation')}</Text>
            {location ? (
              <Text style={styles.value}>
                {location.city || 'GPS: '}
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </Text>
            ) : (
              <Text style={styles.value}>{t('notSet')}</Text>
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={requestLocationPermission}>
            <Text style={styles.buttonText}>{t('useGPS')}</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('or')}</Text>
            <View style={styles.dividerLine} />
          </View>

          <TextInput
            style={styles.input}
            placeholder={t('cityPlaceholder')}
            value={city}
            onChangeText={setCity}
            placeholderTextColor="#999"
            textAlign="right"
          />
          <TextInput
            style={styles.input}
            placeholder={t('countryPlaceholder')}
            value={country}
            onChangeText={setCountry}
            placeholderTextColor="#999"
            textAlign="right"
          />

          <TouchableOpacity style={styles.button} onPress={saveManualLocation}>
            <Text style={styles.buttonText}>{t('saveManualLocation')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notifications')}</Text>
          <Text style={styles.infoText}>
            {t('notificationsInfo')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ramadanDays')}</Text>
          <Text style={styles.infoText}>
            {t('ramadanDaysInfo')}
          </Text>
        </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    writingDirection: 'rtl',
  },
  locationInfo: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    writingDirection: 'rtl',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
    writingDirection: 'rtl',
  },
  button: {
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
    writingDirection: 'rtl',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    writingDirection: 'rtl',
  },
});
