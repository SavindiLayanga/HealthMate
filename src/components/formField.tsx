import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

interface FormFieldProps extends TextInputProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  error?: string;
  unit?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  iconName,
  iconColor = THEME.colors.primary,
  error,
  unit,
  ...inputProps
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Ionicons name={iconName} size={18} color={iconColor} style={styles.labelIcon} />
        <Text style={styles.label}>{label}</Text>
        {unit ? <Text style={styles.unitBadge}>({unit})</Text> : null}
      </View>

      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={THEME.colors.textMuted}
          {...inputProps}
        />
      </View>

      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={THEME.colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelIcon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  unitBadge: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.textMuted,
    marginLeft: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 14,
    height: 48,
  },
  inputError: {
    borderColor: THEME.colors.danger,
    backgroundColor: '#FFF8F8',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: THEME.colors.textPrimary,
    height: '100%',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: THEME.colors.danger,
    fontWeight: '500',
  },
});