import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { theme } from '../styles/theme';

export default function CustomDrawer(props) {
    const { navigation, scrollToSection } = props;

    const sections = [
        { label: 'Profile Summary', target: 'summary' },
        { label: 'Experience', target: 'experience' },
        { label: 'Education', target: 'education' },
        { label: 'Skills', target: 'skills' },
        { label: 'Projects', target: 'projects' },
        { label: 'Contact', target: 'contact' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* Placeholder for Alien Icon if image fails, or use the image if available */}
                <View style={styles.iconContainer}>
                    <Text style={styles.alienText}>👽</Text>
                </View>
                <Text style={styles.name}>VASANTHAKUMAR A</Text>
                <Text style={styles.role}>React Native Developer</Text>
            </View>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContainer}>
                {sections.map((section) => (
                    <TouchableOpacity
                        key={section.target}
                        style={styles.drawerItem}
                        onPress={() => {
                            scrollToSection(section.target);
                            navigation.closeDrawer();
                        }}
                    >
                        <Text style={styles.drawerLabel}>{section.label}</Text>
                    </TouchableOpacity>
                ))}
            </DrawerContentScrollView>
            <View style={styles.footer}>
                <Text style={styles.footerText}>© 2026 Portfolio</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.card,
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        alignItems: 'center',
        marginTop: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    alienText: {
        fontSize: 40,
    },
    name: {
        color: theme.colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    role: {
        color: theme.colors.textSecondary,
        fontSize: 14,
    },
    scrollContainer: {
        paddingTop: 10,
    },
    drawerItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.border,
    },
    drawerLabel: {
        color: theme.colors.text,
        fontSize: 16,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    footerText: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        textAlign: 'center',
    },
});
