import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddScreen(){
    return (
        <SafeAreaView style={Styles.container}>
            <Text style={Styles.text}> Add Entry Screen</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'FFFFFF',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});