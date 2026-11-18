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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

interface StepsModalProps {
  visible: boolean;
  onClose: () => void;
  currentSteps: number;
  currentGoal: number;
  onSave: (newSteps: number, newGoal: number) => void;
}

export const StepsModal: React.FC<StepsModalProps> = ({
  visible,
  onClose,
  currentSteps,
  currentGoal,
  onSave,
}) => {
  const [steps, setSteps] = useState('');
  const [goal, setGoal] = useState('');

  // Modal එක open වෙන විට දැනට ඇති අගයන් input වලට load කිරීම
  useEffect(() => {
    setSteps(currentSteps.toString());
    setGoal(currentGoal.toString());
  }, [currentSteps, currentGoal, visible]);

  const handleSave = () => {
    const s = parseInt(steps, 10);
    const g = parseInt(goal, 10);

    // සරල if-else validation
    if (isNaN(s) || s < 0) {
      alert('Please enter a valid number for today steps.');
      return;
    }

    if (isNaN(g) || g <= 0) {
      alert('Please enter a valid target goal greater than 0.');
      return;
    }

    onSave(s, g);
    onClose();
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
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.headerTitleRow}>
                <Ionicons name="walk" size={22} color={THEME.colors.steps} />
                <Text style={styles.headerTitle}>Steps Tracker</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={THEME.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Update your daily target steps and today's walked steps count.
            </Text>

            {/* 1. Target Steps Goal Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Target Steps Goal</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 8000"
                placeholderTextColor={THEME.colors.textMuted}
                value={goal}
                onChangeText={setGoal}
                keyboardType="numeric"
              />
            </View>

            {/* 2. Today's Steps Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Today's Steps Walked</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 7850"
                placeholderTextColor={THEME.colors.textMuted}
                value={steps}
                onChangeText={setSteps}
                keyboardType="numeric"
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Steps</Text>
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
    backgroundColor: THEME.colors.steps,
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

export default StepsModal;