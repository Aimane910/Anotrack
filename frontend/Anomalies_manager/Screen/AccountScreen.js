import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AccountScreen = ({ route, navigation }) => {
  const [userInfo, setUserInfo] = useState({
    username: route.params?.username || 'User',
    role: route.params?.userData?.role || 'Opérateur',
    email: route.params?.userData?.email || 'user@example.com',
  });
  
  const [assignedAnomalies, setAssignedAnomalies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour charger les anomalies assignées
  const loadAssignedAnomalies = async () => {
    try {
      setIsLoading(true);
      // Remplacer avec votre appel API réel
      const response = await axios.get(`YOUR_API_ENDPOINT/anomalies/assigned/${userInfo.username}`);
      setAssignedAnomalies(response.data);
    } catch (error) {
      console.error('Error loading anomalies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssignedAnomalies();
  }, []);

  const renderAnomalyItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.anomalyCard}
      onPress={() => navigation.navigate('AnomalyDetail', { anomalyId: item.id })}
    >
      <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(item.severity) }]} />
      <View style={styles.anomalyInfo}>
        <Text style={styles.anomalyTitle}>{item.title}</Text>
        <Text style={styles.anomalyLocation}>{item.location}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#94A3B8" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* En-tête du profil */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {userInfo.username.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{userInfo.username}</Text>
          <View style={styles.roleContainer}>
            <Text style={styles.roleText}>{userInfo.role}</Text>
          </View>
          <Text style={styles.email}>{userInfo.email}</Text>
        </View>
      </View>

      {/* Section des anomalies assignées */}
      <View style={styles.anomaliesSection}>
        <Text style={styles.sectionTitle}>Anomalies Assignées</Text>
        <FlatList
          data={assignedAnomalies}
          renderItem={renderAnomalyItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={loadAssignedAnomalies}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucune anomalie assignée</Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  profileHeader: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  roleContainer: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  roleText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '500',
  },
  email: {
    color: '#64748B',
    fontSize: 14,
  },
  anomaliesSection: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
  },
  anomalyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  severityIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  anomalyInfo: {
    flex: 1,
  },
  anomalyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  anomalyLocation: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  statusContainer: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    color: '#475569',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 20,
  },
});

const getSeverityColor = (severity) => {
  switch (severity.toLowerCase()) {
    case 'critique':
      return '#EF4444';
    case 'moyenne':
      return '#F59E0B';
    case 'faible':
      return '#10B981';
    default:
      return '#CBD5E1';
  }
};

export default AccountScreen;