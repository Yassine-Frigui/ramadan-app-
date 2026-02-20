import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
  PanResponder,
  I18nManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuranReader } from '../hooks/useQuranReader';
import { getPageSurahNames, getPageJuz, QuranAyah } from '../data';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';
import { t } from '../i18n';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 50;

interface QuranReaderScreenProps {
  navigation: any;
  route?: any;
}

export const QuranReaderScreen: React.FC<QuranReaderScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { currentPage, quranPage, isLoading, goToPage, nextPage, previousPage } = useQuranReader();
  const [showControls, setShowControls] = useState(true);
  const [pageInput, setPageInput] = useState('');
  const [showGoTo, setShowGoTo] = useState(false);
  const [quotaBanner, setQuotaBanner] = useState<string | null>(null);
  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  // Get the target page from navigation params (from QuranScreen day card)
  const targetPage = route?.params?.targetPage;
  const dailyEndPage = route?.params?.dailyEndPage;

  useEffect(() => {
    if (targetPage && !isLoading) {
      goToPage(targetPage);
    }
  }, [targetPage, isLoading]);

  // Scroll to top when page changes
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentPage]);

  // Check if user reached or passed daily quota
  useEffect(() => {
    if (dailyEndPage && currentPage >= dailyEndPage) {
      setQuotaBanner(t('dailyQuotaReached'));
      Animated.sequence([
        Animated.timing(bannerOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(3000),
        Animated.timing(bannerOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start(() => setQuotaBanner(null));
    }
  }, [currentPage, dailyEndPage]);

  // Swipe gesture — RTL: swipe left = next page, swipe right = previous page
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        // Only capture horizontal swipes (not vertical scrolling)
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < Math.abs(gestureState.dx);
      },
      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dx < -SWIPE_THRESHOLD) {
          // Swipe left → next page (RTL: higher page number)
          previousPage();
        } else if (gestureState.dx > SWIPE_THRESHOLD) {
          // Swipe right → previous page (RTL: lower page number)
          
          nextPage();
        }
      },
    })
  ).current;

  const handleGoToPage = () => {
    const page = Number.parseInt(pageInput, 10);
    if (page >= 1 && page <= 604) {
      goToPage(page);
      setShowGoTo(false);
      setPageInput('');
    }
  };

  /** Render the entire page as a continuous RTL text block (like a real Mushaf) */
  const renderPageContent = () => {
    if (!quranPage || quranPage.ayahs.length === 0) {
      return <Text style={styles.errorText}>{t('pageNotFound')}</Text>;
    }

    // Group ayahs by surah to insert headers
    const sections: { surahName?: string; surahNumber?: number; ayahs: QuranAyah[] }[] = [];
    let currentSurah: number | null = null;

    for (const ayah of quranPage.ayahs) {
      if (ayah.surahNumber !== currentSurah) {
        sections.push({
          surahName: ayah.surahName,
          surahNumber: ayah.surahNumber,
          ayahs: [ayah],
        });
        currentSurah = ayah.surahNumber;
      } else {
        sections[sections.length - 1].ayahs.push(ayah);
      }
    }

    return sections.map((section, sIdx) => (
      <View key={`s-${sIdx}`}>
        {/* Surah header for the first ayah of a new surah */}
        {section.ayahs[0].numberInSurah === 1 && (
          <View style={styles.surahHeader}>
            <View style={styles.surahHeaderDecoration}>
              <Text style={styles.surahName}>{section.surahName}</Text>
            </View>
            {section.surahNumber !== 1 && section.surahNumber !== 9 && (
              <Text style={styles.bismillah}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</Text>
            )}
          </View>
        )}

        {/* Continuous text block — all ayahs flow together like a real Mushaf */}
        <Text style={styles.ayahText}>
          {section.ayahs.map((ayah) => (
            <Text key={ayah.number}>
              {ayah.text}
              <Text style={styles.ayahNumber}>{' '}﴿{toArabicNumber(ayah.numberInSurah)}﴾{' '}</Text>
            </Text>
          ))}
        </Text>
      </View>
    ));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      {showControls && (
        <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <FontAwesome5 name="times" size={20} color={COLORS.gold} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerSurah}>{getPageSurahNames(currentPage)}</Text>
            <Text style={styles.headerMeta}>
              {t('pageNumber', { page: currentPage })} | {t('juzNumber', { juz: getPageJuz(currentPage) })}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowGoTo(!showGoTo)} style={styles.goToButton}>
            <FontAwesome5 name="bars" size={18} color={COLORS.gold} />
          </TouchableOpacity>
        </View>
      )}

      {/* Go-to-page input */}
      {showGoTo && (
        <View style={styles.goToContainer}>
          <TextInput
            style={styles.goToInput}
            placeholder={t('goToPagePlaceholder')}
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={pageInput}
            onChangeText={setPageInput}
            onSubmitEditing={handleGoToPage}
            textAlign="center"
          />
          <TouchableOpacity style={styles.goToSubmit} onPress={handleGoToPage}>
            <Text style={styles.goToSubmitText}>{t('go')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Quran page content — swipeable + tappable to toggle controls */}
      <View style={styles.pageContainer} {...panResponder.panHandlers}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[
            styles.pageContent,
            {
              paddingTop: showControls ? SPACING.md : insets.top + SPACING.lg,
              paddingBottom: showControls ? SPACING.md + 60 : insets.bottom + SPACING.lg,
            },
          ]}
          showsVerticalScrollIndicator={false}
          onTouchEnd={() => {
            // Toggle controls on tap (only if no significant pan occurred)
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowControls(!showControls)}
          >
            {renderPageContent()}
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Daily quota banner */}
      {quotaBanner && (
        <Animated.View style={[styles.quotaBanner, { opacity: bannerOpacity }]}>
          <Text style={styles.quotaBannerText}>{quotaBanner}</Text>
        </Animated.View>
      )}

      {/* Bottom navigation — RTL: left arrow = next (higher page), right arrow = prev (lower page) */}
      {showControls && (
        <View style={[styles.bottomNav, { paddingBottom: insets.bottom + SPACING.xs }]}>
          <TouchableOpacity onPress={previousPage} style={styles.navButton}>
            <FontAwesome5 name="chevron-right" size={18} color={COLORS.gold} />
          </TouchableOpacity>
          <Text style={styles.pageIndicator}>{currentPage} / 604</Text>
          <TouchableOpacity onPress={nextPage} style={styles.navButton}>
            <FontAwesome5 name="chevron-left" size={18} color={COLORS.gold} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

/** Convert a number to Arabic-Indic numerals */
const toArabicNumber = (num: number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map((d) => arabicDigits[Number.parseInt(d, 10)] || d).join('');
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.readerBg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.readerBg,
  },

  // ─── Header ───
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gold + '22',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: SPACING.sm,
  },
  headerSurah: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
    textAlign: 'center',
  },
  headerMeta: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
    writingDirection: 'rtl',
  },
  goToButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── Go-to-page ───
  goToContainer: {
    flexDirection: 'row',
    padding: SPACING.sm,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  goToInput: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.subtitle,
    width: 120,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
  },
  goToSubmit: {
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.gold + '44',
  },
  goToSubmitText: {
    color: COLORS.gold,
    fontSize: FONT_SIZES.bodyLarge,
    fontWeight: '600',
  },

  // ─── Page content ───
  pageContainer: {
    flex: 1,
  },
  pageContent: {
    paddingHorizontal: 20,
  },
  surahHeader: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  surahHeaderDecoration: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.gold + '44',
  },
  surahName: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.gold,
    textAlign: 'center',
  },
  bismillah: {
    fontSize: 22,
    color: '#5D4037',
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  ayahText: {
    fontSize: 26,
    lineHeight: 56,
    color: COLORS.readerText,
    textAlign: 'right',
    writingDirection: 'rtl',
    fontFamily: undefined, // uses system Arabic font
  },
  ayahNumber: {
    fontSize: 16,
    color: COLORS.goldDim,
  },
  errorText: {
    textAlign: 'center',
    fontSize: FONT_SIZES.subtitle,
    color: COLORS.statusBehind,
    marginTop: 40,
  },

  // ─── Quota banner ───
  quotaBanner: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    backgroundColor: COLORS.bg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  quotaBannerText: {
    color: COLORS.gold,
    fontSize: FONT_SIZES.subtitle,
    fontWeight: 'bold',
    textAlign: 'center',
    writingDirection: 'rtl',
  },

  // ─── Bottom nav ───
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm + 4,
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.gold + '22',
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pageIndicator: {
    fontSize: FONT_SIZES.bodyLarge,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});
