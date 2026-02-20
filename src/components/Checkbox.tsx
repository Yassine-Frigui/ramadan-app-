import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onToggle }) => {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <View style={styles.checkmark} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
  },
  checked: {
    backgroundColor: COLORS.gold,
  },
  checkmark: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: COLORS.bg,
  },
});
