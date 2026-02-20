import React, { createContext, useContext, useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

/* ─── Config ─── */
const RAIL_WIDTH = 50;
const EXPANDED_WIDTH = 230;
const SPRING_CONFIG = { damping: 22, stiffness: 200, mass: 0.8, useNativeDriver: false };

/* ─── Types ─── */
export interface DrawerItem {
  key: string;
  label: string;
  icon: string; // FontAwesome5 icon name
}

interface DrawerContextType {
  toggle: () => void;
  close: () => void;
  switchScreen: (key: string) => void;
}

const DrawerContext = createContext<DrawerContextType>({
  toggle: () => {},
  close: () => {},
  switchScreen: () => {},
});

export const useDrawer = () => useContext(DrawerContext);

/* ─── Component ─── */
interface AnimatedDrawerProps {
  items: DrawerItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  children: React.ReactNode;
}

export const AnimatedDrawer: React.FC<AnimatedDrawerProps> = ({
  items,
  activeKey,
  onSelect,
  children,
}) => {
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current; // 0 = collapsed, 1 = expanded
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      Animated.spring(anim, { toValue: next ? 1 : 0, ...SPRING_CONFIG }).start();
      return next;
    });
  }, [anim]);

  const close = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) return prev;
      Animated.spring(anim, { toValue: 0, ...SPRING_CONFIG }).start();
      return false;
    });
  }, [anim]);

  /* ── Interpolated styles for the EXPANDED overlay panel ── */
  const expandedWidth = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, EXPANDED_WIDTH],
    extrapolate: 'clamp',
  });

  const overlayOpacity = anim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 0.5],
    extrapolate: 'clamp',
  });

  const labelOpacity = anim.interpolate({
    inputRange: [0.3, 0.7],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const labelTranslateX = anim.interpolate({
    inputRange: [0.3, 0.7],
    outputRange: [-10, 0],
    extrapolate: 'clamp',
  });

  const handleSelect = (key: string) => {
    onSelect(key);
    close();
  };

  const switchScreen = useCallback((key: string) => {
    onSelect(key);
  }, [onSelect]);

  const contextValue = useMemo(() => ({ toggle, close, switchScreen }), [toggle, close, switchScreen]);

  return (
    <DrawerContext.Provider value={contextValue}>
      <View style={styles.container}>
        {/* ── Static rail — always in layout flow ── */}
        <View style={[styles.rail, { paddingTop: insets.top }]}>
          <LinearGradient
            colors={['#0B1829', '#0F2240', '#0B1829']}
            style={StyleSheet.absoluteFill}
          />

          {/* Hamburger */}
          <TouchableOpacity style={styles.hamburger} onPress={toggle} activeOpacity={0.7}>
            <FontAwesome5 name="bars" size={18} color={COLORS.gold} />
          </TouchableOpacity>

          {/* Icon-only nav */}
          <View style={styles.navList}>
            {items.map((item) => {
              const isActive = item.key === activeKey;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.railItem, isActive && styles.railItemActive]}
                  onPress={() => handleSelect(item.key)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconCircle, isActive && styles.iconCircleActive]}>
                    <FontAwesome5
                      name={item.icon}
                      size={16}
                      color={isActive ? COLORS.gold : COLORS.textSecondary}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Rail brand icon */}
          <View style={[styles.railBrand, { paddingBottom: insets.bottom + 12 }]}>
            <FontAwesome5 name="star-and-crescent" size={14} color={COLORS.textMuted} />
          </View>
        </View>

        {/* ── Expanded overlay panel (slides over content) ── */}
        <Animated.View style={[styles.expandedPanel, { width: expandedWidth, paddingTop: insets.top }]}>
          <LinearGradient
            colors={['#0B1829', '#0F2240', '#0B1829']}
            style={StyleSheet.absoluteFill}
          />

          {/* Close button */}
          <TouchableOpacity style={styles.expandedClose} onPress={close} activeOpacity={0.7}>
            <FontAwesome5 name="times" size={18} color={COLORS.gold} />
          </TouchableOpacity>

          {/* Full nav items with labels */}
          <View style={styles.expandedNavList}>
            {items.map((item) => {
              const isActive = item.key === activeKey;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.expandedNavItem, isActive && styles.expandedNavItemActive]}
                  onPress={() => handleSelect(item.key)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconCircle, isActive && styles.iconCircleActive]}>
                    <FontAwesome5
                      name={item.icon}
                      size={16}
                      color={isActive ? COLORS.gold : COLORS.textSecondary}
                    />
                  </View>
                  <Animated.View style={[styles.labelWrap, { opacity: labelOpacity, transform: [{ translateX: labelTranslateX }] }]}>
                    <Animated.Text
                      style={[styles.navLabel, isActive && styles.navLabelActive]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Animated.Text>
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Brand footer */}
          <View style={[styles.expandedBrand, { paddingBottom: insets.bottom + 12 }]}>
            <Animated.View style={{ opacity: labelOpacity, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <FontAwesome5 name="star-and-crescent" size={12} color={COLORS.textMuted} />
              <Animated.Text style={styles.brandText}>رفيق رمضان</Animated.Text>
            </Animated.View>
          </View>
        </Animated.View>

        {/* ── Overlay ── */}
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} pointerEvents={isOpen ? 'auto' : 'none'}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        </Animated.View>

        {/* ── Main content — takes remaining space after rail ── */}
        <View style={styles.content}>{children}</View>
      </View>
    </DrawerContext.Provider>
  );
};

/* ─── Styles ─── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.bg,
  },

  /* ── Static rail (in layout flow) ── */
  rail: {
    width: RAIL_WIDTH,
    backgroundColor: '#0B1829',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    zIndex: 101,
  },
  hamburger: {
    width: RAIL_WIDTH,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navList: {
    flex: 1,
    paddingTop: SPACING.sm,
    alignItems: 'center',
  },
  railItem: {
    width: RAIL_WIDTH,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  railItemActive: {
    backgroundColor: 'rgba(232,185,118,0.08)',
  },
  railBrand: {
    width: RAIL_WIDTH,
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },

  /* ── Expanded overlay panel ── */
  expandedPanel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 200,
    overflow: 'hidden',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.06)',
  },
  expandedClose: {
    width: RAIL_WIDTH,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedNavList: {
    flex: 1,
    paddingTop: SPACING.sm,
  },
  expandedNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: (RAIL_WIDTH - 38) / 2,
    marginBottom: 2,
    borderRadius: RADIUS.md,
  },
  expandedNavItemActive: {
    backgroundColor: 'rgba(232,185,118,0.08)',
  },
  expandedBrand: {
    width: '100%',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },

  /* ── Shared ── */
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  iconCircleActive: {
    backgroundColor: COLORS.goldGlow,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
  },
  labelWrap: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  navLabel: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    fontWeight: '500',
    writingDirection: 'rtl',
  },
  navLabelActive: {
    color: COLORS.gold,
    fontWeight: '700',
  },
  brandText: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.textMuted,
    fontWeight: '600',
  },

  /* ── Overlay ── */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 150,
  },

  /* ── Content ── */
  content: {
    flex: 1,
  },
});
