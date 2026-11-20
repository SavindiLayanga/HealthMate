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
    const [ saving, setSaving] = useState ('');

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

    return
}