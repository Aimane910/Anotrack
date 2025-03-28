import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://your-backend-url/api'; // Replace with your actual API URL

const HomeScreen = ({ navigation, route }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('Tous');
    const [isLoading, setIsLoading] = useState(true);
    const username = route.params?.username || 'admin';
    const [anomalies, setAnomalies] = useState([]);

    // Fetch anomalies from backend
    useEffect(() => {
        const fetchAnomalies = async () => {
            try {
                const response = await axios.get(`${API_URL}/anomalies`);
                if (response.data.success) {
                    setAnomalies(response.data.anomalies);
                }
            } catch (error) {
                console.error('Error fetching anomalies:', error);
                Alert.alert('Error', 'Failed to load anomalies');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnomalies();
    }, []);

    const addAnomaly = async (newAnomaly) => {
        try {
            const response = await axios.post(`${API_URL}/anomalies`, newAnomaly);
            if (response.data.success) {
                setAnomalies(prevAnomalies => [response.data.anomaly, ...prevAnomalies]);
            }
        } catch (error) {
            console.error('Error adding anomaly:', error);
            Alert.alert('Error', 'Failed to add anomaly');
        }
    };

    const assignToMe = async (id) => {
        if (username !== 'operateur') return;
        
        try {
            const response = await axios.put(`${API_URL}/anomalies/${id}/assign`, {
                assignee: 'OP',
                status: 'En cours'
            });

            if (response.data.success) {
                setAnomalies(prevAnomalies => 
                    prevAnomalies.map(anomaly => 
                        anomaly.id === id ? response.data.anomaly : anomaly
                    )
                );
            }
        } catch (error) {
            console.error('Error assigning anomaly:', error);
            Alert.alert('Error', 'Failed to assign anomaly');
        }
    };

    const navigateToAccount = () => {
        navigation.navigate('Account', {
            username: username,
            userData: route.params?.userData // Pass the user data from login
        });
    };
    
    const filteredAnomalies = anomalies.filter(anomaly => {
        if (activeFilter === 'Tous') return true;
        if (activeFilter === 'En cours') return anomaly.status === 'En cours';
        return anomaly.severity === activeFilter;
    });
    
    const renderAnomalyItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => username === 'operateur' && assignToMe(item.id)}
            style={styles.anomalyItem}
        >
            <View style={[styles.anomalyBar, { backgroundColor: item.color }]} />
            <View style={styles.anomalyInfo}>
                <Text style={styles.anomalyTitle}>{item.title}</Text>
                <Text style={styles.anomalyLocation}>{item.location}</Text>
                <View style={styles.tagContainer}>
                    <View style={[styles.severityTag, { backgroundColor: getSeverityColor(item.severity) }]}>
                        <Text style={styles.severityText}>{item.severity}</Text>
                    </View>
                    {item.status && (
                        <View style={[styles.statusTag, { backgroundColor: '#2ecc71' }]}>
                            <Text style={styles.statusText}>{item.status}</Text>
                        </View>
                    )}
                </View>
            </View>
            <View style={styles.assigneeContainer}>
                <View style={styles.assigneeCircle}>
                    <Text style={styles.assigneeText}>{item.assignee}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
    
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Critique':
                return 'rgba(231, 76, 60, 0.2)';
            case 'Moyenne':
                return 'rgba(243, 156, 18, 0.2)';
            default:
                return 'rgba(52, 152, 219, 0.2)';
        }
    };

    const navigateToAnomalyForm = () => {
        navigation.navigate('AnomalyForm', { addAnomaly });
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>AnoTrack</Text>
                <View style={styles.circle} />
            </View>
            
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher une anomalie..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            
            <View style={styles.filtersContainer}>
                <TouchableOpacity 
                    style={[styles.filterButton, activeFilter === 'Tous' && styles.activeFilter]}
                    onPress={() => setActiveFilter('Tous')}
                >
                    <Text style={[styles.filterText, activeFilter === 'Tous' && styles.activeFilterText]}>Tous</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.filterButton, activeFilter === 'En cours' && styles.activeFilter]}
                    onPress={() => setActiveFilter('En cours')}
                >
                    <Text style={[styles.filterText, activeFilter === 'En cours' && styles.activeFilterText]}>En cours</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.filterButton, activeFilter === 'Critique' && styles.activeFilter]}
                    onPress={() => setActiveFilter('Critique')}
                >
                    <Text style={[styles.filterText, activeFilter === 'Critique' && styles.activeFilterText]}>Critique</Text>
                </TouchableOpacity>
            </View>
            
            <FlatList
                data={filteredAnomalies}
                renderItem={renderAnomalyItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />
            
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="menu" size={24} color="#3498db" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="grid" size={24} color="#888" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.addButton} onPress={navigateToAnomalyForm}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="analytics" size={24} color="#888" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[
                        styles.navButton,
                        route.name === 'Account' && styles.activeNavButton
                    ]} 
                    onPress={navigateToAccount}
                >
                    <Ionicons 
                        name="person" 
                        size={24} 
                        color={route.name === 'Account' ? '#3498db' : '#888'} 
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#2c3e50',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 25,
        height: 46,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#2c3e50',
    },
    filtersContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
    },
    activeFilter: {
        backgroundColor: '#3498db',
    },
    filterText: {
        color: '#666',
        fontWeight: '500',
    },
    activeFilterText: {
        color: '#fff',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    anomalyItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    anomalyBar: {
        width: 5,
    },
    anomalyInfo: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    anomalyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 5,
    },
    anomalyLocation: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 5,
    },
    severityTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    severityText: {
        fontSize: 12,
        fontWeight: '500',
    },
    assigneeContainer: {
        justifyContent: 'center',
        paddingRight: 15,
    },
    assigneeCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center',
    },
    assigneeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ecf0f1',
    },
    navButton: {
        padding: 10,
    },
    addButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#3498db',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    statusTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#27ae60',
    },
    activeNavButton: {
        padding: 10,
    },
    activeIcon: {
        color: '#3498db',
    },
});

export default HomeScreen;