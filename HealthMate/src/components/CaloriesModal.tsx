import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

interface CaloriesModalProps {
    visible: boolean;
    onClose: () => void;
    currentCalories: number;
    currentGoal: number;
    onSave: (newCalories: number, newGoal:number) => Promise<void> | void;
}

export const CaloriesModal: React.FC<CaloriesModalProps> = ({
    visible,
    onClose,
    currentCalories,
    currentGoal,
    onSave,
}) => {
    const [calories, setCalories] = useState ('');
    const [ goal, setGoal] = useState ('');
    const [ saving, setSaving] = useState(false);

    useEffect(() => {
        setCalories(currentCalories.toString());
        setGoal(currentGoal.toString());
    }, [currentCalories, currentGoal, visible]);

    const handleSave = async () => {
        const c = parseInt(calories, 10);
        const g = parseInt(goal, 10);

        if (isNaN(c) || c<0 ){
            Alert.alert('Invalid Input', 'Please enter a valid number for calories.');
            return;
        }

        if (isNaN(g) || g<0 ){
            Alert.alert('Invalid Input', 'Please enter a valid target goal greater than 0.');
            return;
        }

        try{
            setSaving(true);
            await onSave(c, g);
            onClose();
        } catch {
            Alert.alert('Error', 'Fialed to save calories.');
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
            <TouchableWithoutFeedback onPress ={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>

                        {/* <View style={styles.headerRow}>
                            <View style={styles.headerTitleRow}>
                                <Ionicons name="flame" size={22} color={THEME.colors.calories}/>
                                <Text style={styles.headerTitle}> Calories Tracker</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <Ionicons name="close" size={20} color={THEME.colors.textSecondary}/>
                            </TouchableOpacity>
                        </View> */}

                        {/* <Text style={styles.modalDescription}> Update your daily target calories and today's calories burned.</Text> */}
                        
                        {/* <View style={style.inputGroup}>
                            <Text style={styles.inputLabel}> Target Calories Goal (kcal) </Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="e.g. 2000"
                                placeholderTextColor={THEME.colors.textMuted}
                                value={goal}
                                onChangeText={setGoal}
                                keyboardType="numeric"
                            />
                        </View> */}

                        {/* <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}> Today's Calories (kcal) </Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder='e.g. 1500'
                                placeholderTextColor={THEME.colors.textMuted}
                                value={calories}
                                onChangeText={setCalories}
                                keyboardType="numeric"
                            />
                        </View> */}




                    </View>
                </View>
            </TouchableWithoutFeedback>
            </Modal>
    );
};

const styles = StyleSheet.create ({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 43, 0.6)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 300,
        backgroundColor: THEME.colors.surface,
        borderRadius:THEME.borderRadius.xl,
        padding: 20,
        ...THEME.elevation.hover,
    },

});