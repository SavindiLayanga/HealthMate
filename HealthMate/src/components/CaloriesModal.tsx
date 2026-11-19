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