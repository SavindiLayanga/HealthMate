import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

interface WaterModalPropos {
    visible: boolean;
    onClose: () => void;
    currentWater?: number;
    currentGoal?: number;
}

export const WaterModal: React.FC<WaterModalPropos> = ({
    visible,
    onClose,
}) => {
    return (
        <Modal
            visible={visible}
            animationType='fade'
            transparent
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.headerRow}>
                            <View style={styles.headerTitleRow}>
                                <Ionicons name="water" size={22} color={THEME.colors.water}/>
                                <Text style={styles.headerTitle}> Water Intake </Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <Ionicons name="close" size={22} color={THEME.colors.textSecondary}/> 
                            </TouchableOpacity>
                        </View>

                        <View style={styles.bodyPlaceholder}>
                            
                        </View>
                    </TouchableWithoutFeedback>

                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create ({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6',
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
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
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
    bodyPlaceholder: {
        paddingVertical: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: 14,
        color: THEME.colors.textSecondary,
    },
});

export default WaterModal;