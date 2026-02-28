import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Image, Dimensions, Modal, TextInput, Alert, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme } from '../styles/theme';
import { resumeData } from '../data/resume';

const { width } = Dimensions.get('window');

const Section = ({ title, children, onLayout }) => (
    <View style={styles.sectionContainer} onLayout={onLayout}>
        {title && <Text style={styles.sectionTitle}>{title}</Text>}
        {children}
    </View>
);

const Card = ({ children }) => (
    <View style={styles.card}>{children}</View>
);

export default function PortfolioScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);
    const [sectionY, setSectionY] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [contactSubject, setContactSubject] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [expandedProject, setExpandedProject] = useState(null);

    const toggleProject = (projectName) => {
        setExpandedProject(expandedProject === projectName ? null : projectName);
    };

    const handleLayout = (section, event) => {
        const layout = event.nativeEvent.layout;
        setSectionY((prev) => ({ ...prev, [section]: layout.y }));
    };

    useEffect(() => {
        if (route.params?.section && sectionY[route.params.section] !== undefined) {
            scrollViewRef.current?.scrollTo({
                y: sectionY[route.params.section],
                animated: true,
            });
            // Clear params to avoid rescrolling on re-render if not desired
            navigation.setParams({ section: undefined });
        }
    }, [route.params?.section, sectionY]);

    const openLink = (url) => {
        Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
    };

    const handleSendMail = () => {
        if (!contactSubject || !contactMessage || !userEmail) {
            Alert.alert('Error', 'Please fill in all fields (Email, Subject, Message)');
            return;
        }
        const subject = encodeURIComponent(contactSubject);
        const body = encodeURIComponent(`From: ${userEmail}\n\nMessage:\n${contactMessage}\n\n[Sent via Portfolio App]`);
        const mailUrl = `mailto:${resumeData.personalInfo.email}?subject=${subject}&body=${body}`;

        Linking.openURL(mailUrl).catch(() => Alert.alert('Error', 'Could not open mail client'));
        setModalVisible(false);
    };

    const handleSendWhatsApp = () => {
        if (!contactSubject || !contactMessage) {
            Alert.alert('Error', 'Please fill in Subject and Message');
            return;
        }
        // WhatsApp format: *Subject* \n Message
        const text = encodeURIComponent(`*${contactSubject}*\n\n${contactMessage}`);
        const phone = '918925208494'; // Adding country code for safety
        const whatsappUrl = `https://wa.me/${phone}?text=${text}`;

        Linking.openURL(whatsappUrl).catch(() => Alert.alert('Error', 'Could not open WhatsApp'));
        setModalVisible(false);
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <Section onLayout={(e) => handleLayout('header', e)}>
                <View style={styles.header}>
                    <View style={[styles.avatarContainer, { borderColor: theme.colors.primary }]}>
                        <Image
                            source={require('../../assets/profile.png')}
                            style={styles.avatarImage}
                            resizeMode="cover"
                        />
                    </View>
                    <Text style={styles.name}>{resumeData.personalInfo.name}</Text>
                    <Text style={styles.role}>{resumeData.personalInfo.role}</Text>
                    <View style={styles.contactRow}>
                        <Text style={styles.contactText}>{resumeData.personalInfo.email}</Text>
                        <Text style={styles.contactText}> | </Text>
                        <Text style={styles.contactText}>{resumeData.personalInfo.phone}</Text>
                    </View>
                    <Text style={styles.location}>{resumeData.personalInfo.location}</Text>
                </View>
            </Section>

            <Section title="Summary" onLayout={(e) => handleLayout('summary', e)}>
                <Card>
                    <Text style={styles.text}>{resumeData.personalInfo.summary}</Text>
                </Card>
            </Section>

            <Section title="Career Objective" onLayout={(e) => handleLayout('objective', e)}>
                <Card>
                    <Text style={styles.text}>{resumeData.personalInfo.objective}</Text>
                </Card>
            </Section>

            <Section title="Experience" onLayout={(e) => handleLayout('experience', e)}>
                {resumeData.experience.map((exp, index) => (
                    <Card key={index}>
                        <View style={styles.expHeader}>
                            <Text style={styles.companyName}>{exp.company}</Text>
                            <Text style={styles.duration}>{exp.duration}</Text>
                        </View>
                        <Text style={styles.expRole}>{exp.role}</Text>
                        {exp.projects.map((proj, pIndex) => {
                            const isExpanded = expandedProject === proj.name;
                            return (
                                <View key={pIndex} style={styles.projectItem}>
                                    <TouchableOpacity
                                        style={styles.projectHeaderRow}
                                        onPress={() => toggleProject(proj.name)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.projectName}>• {proj.name}</Text>
                                            <Text style={styles.projectDesc}>{proj.description}</Text>
                                        </View>
                                        <Text style={[styles.arrow, isExpanded && styles.arrowExpanded]}>
                                            {isExpanded ? '▲' : '▼'}
                                        </Text>
                                    </TouchableOpacity>

                                    {isExpanded && (
                                        <View style={styles.detailsContainer}>
                                            <Text style={styles.detailLabel}>Contribution:</Text>
                                            <Text style={styles.detailContent}>{proj.contribution}</Text>

                                            <Text style={[styles.detailLabel, { marginTop: 10 }]}>Explanation:</Text>
                                            <Text style={styles.detailContent}>{proj.fullExplanation}</Text>

                                            {proj.details && (
                                                <View style={{ marginTop: 10 }}>
                                                    <Text style={styles.detailLabel}>Key Achievements:</Text>
                                                    {proj.details.map((detail, dIndex) => (
                                                        <Text key={dIndex} style={styles.projectDetail}>- {detail}</Text>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </Card>
                ))}
            </Section>

            <Section title="Projects" onLayout={(e) => handleLayout('projects', e)}>
                <Card>
                    <Text style={styles.text}>See Experience section for recent professional projects.</Text>
                    <Text style={styles.subTitle}>Academic:</Text>
                    <Text style={styles.text}>Design and Fabrication of Agriculture Sprayer Bluetooth Control Using Portable Vehicle</Text>
                </Card>
            </Section>

            <Section title="Technical Skills" onLayout={(e) => handleLayout('skills', e)}>
                <Card>
                    {Object.entries(resumeData.skills).map(([category, skills]) => (
                        <View key={category} style={styles.skillRow}>
                            <Text style={styles.skillCategory}>{category.toUpperCase()}: </Text>
                            <View style={styles.badgeContainer}>
                                {skills.map(skill => (
                                    <View key={skill} style={styles.skillBadge}>
                                        <Text style={styles.skillText}>{skill}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </Card>
            </Section>

            <Section title="Education" onLayout={(e) => handleLayout('education', e)}>
                {resumeData.education.map((edu, index) => (
                    <Card key={index}>
                        <Text style={styles.degree}>{edu.degree}</Text>
                        <Text style={styles.institution}>{edu.institution}</Text>
                        <View style={styles.eduFooter}>
                            <Text style={styles.year}>{edu.year}</Text>
                            <Text style={styles.grades}>{edu.details}</Text>
                        </View>
                    </Card>
                ))}
            </Section>

            <Section title="Contact" onLayout={(e) => handleLayout('contact', e)}>
                <Card>
                    <TouchableOpacity onPress={() => openLink(`mailto:${resumeData.personalInfo.email}`)}>
                        <Text style={[styles.link, { color: theme.colors.primary }]}>Email: {resumeData.personalInfo.email}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openLink(`tel:${resumeData.personalInfo.phone}`)}>
                        <Text style={[styles.link, { color: theme.colors.primary }]}>Phone: {resumeData.personalInfo.phone}</Text>
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    <TouchableOpacity style={styles.contactButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.contactButtonText}>Connect / Hire Me</Text>
                    </TouchableOpacity>
                </Card>
            </Section>

            {/* Contact Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Get in Touch</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Your Email"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={userEmail}
                            onChangeText={setUserEmail}
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Subject / Purpose"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={contactSubject}
                            onChangeText={setContactSubject}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Your Message"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={contactMessage}
                            onChangeText={setContactMessage}
                            multiline
                            numberOfLines={4}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalBtn, styles.mailBtn]} onPress={handleSendMail}>
                                <Text style={styles.btnText}>📧 Send Mail</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, styles.whatsappBtn]} onPress={handleSendWhatsApp}>
                                <Text style={styles.btnText}>💬 WhatsApp</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.footerSpacer} />

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        paddingBottom: 50,
        flexGrow: 1,
    },
    sectionContainer: {
        padding: theme.spacing.m,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.secondary,
        marginBottom: theme.spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.secondary,
        paddingBottom: 5,
        marginTop: 10,
    },
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        marginBottom: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    text: {
        color: theme.colors.text,
        fontSize: 16,
        lineHeight: 24,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    avatarContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: theme.colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        marginBottom: 20,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
        textAlign: 'center',
    },
    role: {
        fontSize: 18,
        color: theme.colors.textSecondary,
        marginBottom: 10,
    },
    contactRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    contactText: {
        color: theme.colors.text,
    },
    location: {
        color: theme.colors.textSecondary,
        textAlign: 'center',
        fontSize: 12,
    },
    expHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        flexWrap: 'wrap',
    },
    companyName: {
        color: theme.colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    duration: {
        color: theme.colors.textSecondary,
    },
    expRole: {
        color: theme.colors.secondary,
        fontStyle: 'italic',
        marginBottom: 10,
    },
    projectItem: {
        marginTop: 10,
        marginLeft: 10,
    },
    projectName: {
        color: theme.colors.success,
        fontWeight: 'bold',
    },
    projectDesc: {
        color: theme.colors.text,
        marginLeft: 5,
        marginBottom: 5,
    },
    projectDetail: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        marginLeft: 15,
        marginTop: 2,
    },
    projectHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    arrow: {
        fontSize: 18,
        color: theme.colors.primary,
        paddingHorizontal: 10,
    },
    arrowExpanded: {
        color: theme.colors.secondary,
    },
    detailsContainer: {
        marginTop: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.primary,
    },
    detailLabel: {
        color: theme.colors.secondary,
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
    },
    detailContent: {
        color: theme.colors.text,
        fontSize: 13,
        lineHeight: 18,
    },
    subTitle: {
        color: theme.colors.secondary,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    skillRow: {
        marginBottom: 10,
    },
    skillCategory: {
        color: theme.colors.secondary,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    skillBadge: {
        backgroundColor: theme.colors.border,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginRight: 5,
        marginBottom: 5,
    },
    skillText: {
        color: theme.colors.primary,
        fontSize: 12,
    },
    degree: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    institution: {
        color: theme.colors.text,
        marginBottom: 5,
    },
    eduFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    year: {
        color: theme.colors.textSecondary,
    },
    grades: {
        color: theme.colors.success,
    },
    link: {
        fontSize: 16,
        marginBottom: 10,
        textDecorationLine: 'underline',
    },
    footerSpacer: {
        height: 50,
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: 15,
    },
    contactButton: {
        backgroundColor: theme.colors.primary,
        padding: 15,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
        marginTop: 10,
    },
    contactButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.l,
        padding: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        borderRadius: theme.borderRadius.s,
        padding: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    modalBtn: {
        flex: 1,
        padding: 12,
        borderRadius: theme.borderRadius.s,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    mailBtn: {
        backgroundColor: theme.colors.secondary,
    },
    whatsappBtn: {
        backgroundColor: '#25D366', // WhatsApp Brand Color
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    closeBtn: {
        alignSelf: 'center',
        padding: 10,
    },
    closeText: {
        color: theme.colors.textSecondary,
        textDecorationLine: 'underline',
    }
});
