import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

interface CaloriesModalProps {
  visible: boolean;
  onClose: () => void;
  currentCalories: number;
  currentGoal: number;
  onSave: (newCalories: number, newGoal: number) => Promise<void> | void;
}

export const CaloriesModal: React.FC<CaloriesModalProps> = ({
  visible,
  onClose,
  currentCalories,
  currentGoal,
  onSave,
}) => {
  const [calories, setCalories] = useState('');
  const [goal, setGoal] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCalories((currentCalories ?? 0).toString());
    setGoal((currentGoal ?? 0).toString());
  }, [currentCalories, currentGoal, visible]);

  const showAlert = (message: string) => {
    if (Platform.OS === 'web') {
      alert(message);
    } else {
      Alert.alert('Validation Error', message);
    }
  };

  const handleSave = async () => {
    const c = parseInt(calories, 10);
    const g = parseInt(goal, 10);

    if (isNaN(c) || c < 0) {
      showAlert('Please enter a valid number for calories.');
      return;
    }

    if (isNaN(g) || g <= 0) {
      showAlert('Please enter a valid target goal greater than 0.');
      return;
    }

    try {
      setSaving(true);
      await onSave(c, g);
      onClose();
    } catch {
      showAlert('Failed to save calories.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.headerRow}>
              <View style={styles.headerTitleRow}>
                <Ionicons name="flame" size={22} color={THEME.colors.calories} />
                <Text style={styles.headerTitle}>Calories Tracker</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={THEME.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Update your daily target calories and today's calories burned.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Target Calories Goal (kcal)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 2000"
                placeholderTextColor={THEME.colors.textMuted}
                value={goal}
                onChangeText={setGoal}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Today's Calories (kcal)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 1500"
                placeholderTextColor={THEME.colors.textMuted}
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>Save Calories</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: 20,
    ...THEME.elevation.hover,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: THEME.colors.background,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 15,
    color: THEME.colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: THEME.colors.calories,
    borderRadius: THEME.borderRadius.md,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default CaloriesModal;
