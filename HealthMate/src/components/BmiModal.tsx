import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal,TextInput,TouchableOpacity,TouchableWithoutFeedback,Keyboard,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

interface BmiModalProps {
  visible: boolean;
  onClose: () => void;
  onBmiCalculated: (bmi: number, category: string) => void;
}

const calculateBMI = ( 
  weight: number, 
  height: number, 
  age: number, 
  gender: string 
) => { 
  if (weight <= 0 || height <= 0 || age <= 0) { 
    return { error: 'Invalid input' }; 
  } 

  const heightInMeters = height / 100; 
  const bmi = weight / heightInMeters ** 2; 

  if (age < 20) { 
    return { 
      bmi: Number(bmi.toFixed(2)), 
      status: 'BMI-for-age percentile required', 
      gender, 
    }; 
  } 

  let status = ''; 

  if (bmi < 18.5) { 
    status = 'Underweight';
  } else if (bmi < 25) { 
    status = 'Normal Weight';
  } else if (bmi < 30) {
    status = 'Overweight'; 
  } else { 
    status = 'Obese'; 
  }

  return { 
    bmi: Number(bmi.toFixed(2)),
    status,
    gender, 
  }; 
}; 

export const BmiModal: React.FC<BmiModalProps> = ({
  visible,
  onClose,
  onBmiCalculated,
}) => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
    color: string;
    description: string;
  } | null>(null);

  const calculateBmi = () => {
    const a = parseInt(age, 10);
    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);

    if (isNaN(a) || a < 2 || a > 120) {
      alert('Please enter a valid age (2-120 years).');
      return;
    }

    if (isNaN(h) || h <= 50 || h > 250 || isNaN(w) || w <= 20 || w > 300) {
      alert('Please enter a valid height (50-250 cm) and weight (20-300 kg).');
      return;
    }

    const bmiResult = calculateBMI(w, h, a, gender); 

    if ('error' in bmiResult) { 
      alert('Invalid input values.');
      return;
    } 

    let clr = '#16A34A';
    let desc = '';

    if (a < 20) {
      clr = '#3B82F6'; 
      desc = `For individuals under 20 (${gender === 'male' ? 'Boys' : 'Girls'}), a BMI-for-age percentile is required to assess growth accurately.`; 
    } else if (bmiResult.status === 'Underweight') { 
      clr = '#D97706'; 
      desc = 'Consider a nutrition-rich diet to reach a healthy weight.'; 
    } else if (bmiResult.status === 'Normal Weight') { 
      clr = '#16A34A'; 
      desc = 'Excellent! Keep up your active lifestyle and balanced diet.'; 
    } else if (bmiResult.status === 'Overweight') {
      clr = '#EA580C';
      desc = 'Incorporate brisk walking and track calorie intake.'; 
    } else { 
      clr = '#EF4444'; 
      desc = 'PLEASE ! Consult your physician for personalized health advice.';
    }

    setResult({ bmi: bmiResult.bmi, category: bmiResult.status, color: clr, description: desc }); 
    onBmiCalculated(bmiResult.bmi, bmiResult.status); 
  };

  const handleClose = () => {
    setGender('male');
    setAge('');
    setHeightCm('');
    setWeightKg('');
    setResult(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            {/* Modal Header */}
            <View style={styles.headerRow}>
              <View style={styles.headerTitleRow}>
                <Ionicons name="calculator" size={22} color={THEME.colors.primary} />
                <Text style={styles.headerTitle}>BMI Calculator</Text>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={THEME.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Enter your height and weight to calculate your Body Mass Index.
            </Text>

            {/* Gender input */}
            <View>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[
                    styles.genderBtn,
                    gender === 'male' && styles.genderBtnActive,
                  ]}
                  onPress={() => setGender('male')}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="male"
                    size={16}
                    color={gender === 'male' ? '#FFFFFF' : THEME.colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.genderBtnText,
                      gender === 'male' && styles.genderBtnTextActive,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderBtn,
                    gender === 'female' && styles.genderBtnActive,
                  ]}
                  onPress={() => setGender('female')}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="female"
                    size={16}
                    color={gender === 'female' ? '#FFFFFF' : THEME.colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.genderBtnText,
                      gender === 'female' && styles.genderBtnTextActive,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Age input */}
            <View style={styles.singleInputContainer}>
              <Text style={styles.inputLabel}>Age (years)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 25"
                placeholderTextColor={THEME.colors.textMuted}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>

            {/* Height and weight inputs */}
            <View style={styles.inputsRow}>
              <View style={styles.inputCol}>
                <Text style={styles.inputLabel}>Height (cm)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 175"
                  placeholderTextColor={THEME.colors.textMuted}
                  value={heightCm}
                  onChangeText={setHeightCm}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputCol}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 70"
                  placeholderTextColor={THEME.colors.textMuted}
                  value={weightKg}
                  onChangeText={setWeightKg}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.calcBtn} onPress={calculateBmi}>
              <Text style={styles.calcBtnText}>Calculate BMI</Text>
            </TouchableOpacity>

            {result ? (
              <View style={[styles.resultCard, { borderColor: result.color }]}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultScoreLabel}>Your BMI:</Text>
                  <Text style={[styles.resultScore, { color: result.color }]}>
                    {result.bmi}
                  </Text>
                </View>
                <View
                  style={[
                    styles.resultBadge,
                    { backgroundColor: result.color + '20' },
                  ]}
                >
                  <Text style={[styles.resultCategory, { color: result.color }]}>
                    {result.category}
                  </Text>
                </View>
                <Text style={styles.resultDesc}>{result.description}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  genderBtnText: {
    fontSize: 16,
    color: THEME.colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  genderBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
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
  genderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.background,
  },
  genderBtnActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  singleInputContainer: {
    marginBottom: 14,
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputCol: {
    flex: 1,
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
  calcBtn: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.md,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calcBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  resultCard: {
    marginTop: 16,
    padding: 14,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.background,
    borderWidth: 1.5,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  resultScoreLabel: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  resultScore: {
    fontSize: 22,
    fontWeight: '800',
  },
  resultBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.full,
    marginVertical: 6,
  },
  resultCategory: {
    fontSize: 12,
    fontWeight: '700',
  },
  resultDesc: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
  },
});

export default BmiModal;