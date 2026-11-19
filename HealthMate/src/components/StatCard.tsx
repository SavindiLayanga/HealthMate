import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StartCardProps {
    title: string;
    value: string | number;
    unit?: string;
    subText?: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bgColor: string;
    badge?: string;
    badgeColor?: string;
    badgeBgColor?: string;
    progress?: number;
    onPress?: () => void;
}

export const StatCard = ({
    title,
    value,
    unit,
    subText,
    icon,
    color,
    bgColor,
    badge,
    badgeColor,
    badgeBgColor,
    progress,
    onPress,
}: StartCardProps) => {
    return (
        <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
    >
        <View style={styles.headerRow}>
            <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
        
        {badge && (
            <View style={[styles.badge, { backgroundColor: badgeBgColor || bgColor }]}>
                <Text style={[styles.badgeText, {color: badgeColor || color }]}>{badge}</Text>
            </View>
        )}
        </View>

        <Text style={styles.title}>{title}</Text>
        <View style={styles.valueRow}>
            <Text style={[styles.value, { color }]}> {value} </Text>
            {unit ? <Text style={styles.unit}> {unit} </Text> : null}
        </View>
            {subText ? <Text style={styles.subText}> {subText} </Text> : null}
            {progress !== undefined && (
                <View style={styles.progressBarWrapper}>
                    <View style={styles.progressTrack}>
                        <View
                        style={[
                            styles.progressFill,
                            { width: `${Math.min(progress, 100)}%`, backgroundColor: color },
                        ]}
                    />
                </View>
            </View>
        )}
    </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { 
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 135,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginVertical: 2,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
  unit: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  subText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  progressBarWrapper: {
    marginTop: 6,
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});


