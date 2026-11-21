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

interface WaterModalProps {
  visible: boolean;
  onClose: () => void;
  currentWater: number;
  currentGoal: number;
  onSave: (newWater: number, newGoal: number) => Promise<void> | void;
}

export const WaterModal: React.FC<WaterModalProps> = ({
  visible,
  onClose,
  currentWater,
  currentGoal,
  onSave,
}) => {
  const [water, setWater] = useState('');
  const [goal, setGoal] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setWater((currentWater ?? 0).toString());
    setGoal((currentGoal ?? 0).toString());
  }, [currentWater, currentGoal, visible]);

  const showAlert = (message: string) => {
    if (Platform.OS === 'web') {
      alert(message);
    } else {
      Alert.alert('Validation Error', message);
    }
  };

  const handleSave = async () => {
    const w = parseInt(water, 10);
    const g = parseInt(goal, 10);

    if (isNaN(w) || w < 0) {
      showAlert('Please enter a valid number for today\'s water intake.');
      return;
    }

    if (isNaN(g) || g <= 0) {
      showAlert('Please enter a valid target goal greater than 0.');
      return;
    }

    try {
      setSaving(true);
      await onSave(w, g);
      onClose();
    } catch {
      showAlert('Failed to save water intake.');
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
                <Ionicons name="water" size={22} color={THEME.colors.water} />
                <Text style={styles.headerTitle}>Water Intake</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={THEME.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Update your daily target water and today's water intake.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Target Water Goal (ml)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 2500"
                placeholderTextColor={THEME.colors.textMuted}
                value={goal}
                onChangeText={setGoal}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Today's Water Intake (ml)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 1500"
                placeholderTextColor={THEME.colors.textMuted}
                value={water}
                onChangeText={setWater}
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
                <Text style={styles.saveBtnText}>Save Water Intake</Text>
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
    backgroundColor: THEME.colors.water,
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

export default WaterModal;
