import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '../i18n';

const AIR_DARK = '#0B3757';
const AIR_BLUE = '#0EA5E9';
const AIR_RED = '#DC2626';
const AIR_GREEN = '#059669';

export default function FeedbackModal({ visible, onClose, onSubmit, initialText }) {
    const { t } = useTranslation();
    const [text, setText] = useState(initialText || '');

    useEffect(() => {
        setText(initialText || '');
    }, [initialText, visible]);

    const handleSubmit = () => {
        onSubmit?.(text);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.backdrop}>
                <View style={styles.container}>
                    <Text style={styles.title}>{t('feedback_title')}</Text>
                    <Text style={styles.subtitle}>{t('feedback_subtitle')}</Text>

                    <TextInput
                        style={styles.input}
                        placeholder={t('feedback_placeholder')}
                        placeholderTextColor="#9CA3AF"
                        multiline
                        value={text}
                        onChangeText={setText}
                    />

                    <View style={styles.actions}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={[styles.buttonText, styles.cancelButtonText]}>{t('feedback_cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
                            <Text style={[styles.buttonText, styles.submitButtonText]}>{t('feedback_submit')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: AIR_DARK,
    },
    subtitle: {
        marginTop: 6,
        fontSize: 13,
        color: '#6B7280',
    },
    input: {
        marginTop: 12,
        minHeight: 120,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        textAlignVertical: 'top',
        color: AIR_DARK,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 16,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '700',
    },
    cancelButton: {
        borderColor: '#E5E7EB',
        backgroundColor: 'white',
    },
    cancelButtonText: {
        color: '#4B5563',
    },
    submitButton: {
        borderColor: AIR_BLUE,
        backgroundColor: AIR_BLUE,
    },
    submitButtonText: {
        color: 'white',
    },
});


