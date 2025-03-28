import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://your-backend-url/api'; // Replace with your actual API URL

const AnomalyFormScreen = ({ navigation, route }) => {
  const { addAnomaly } = route.params;
  
  // Replace mock data with state
  const [blocks, setBlocks] = useState([]);
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [selectedBloc, setSelectedBloc] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // 'bloc' or 'machine'

  // Fetch blocks and machines from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blocksResponse, machinesResponse] = await Promise.all([
          axios.get(`${API_URL}/blocs`),
          axios.get(`${API_URL}/machines`)
        ]);

        if (blocksResponse.data.success) {
          setBlocks(blocksResponse.data.blocs);
        }

        if (machinesResponse.data.success) {
          setMachines(machinesResponse.data.machines);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load blocs and machines');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to add images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!title || !selectedBloc || !selectedMachine || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newAnomaly = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      blocId: selectedBloc.id,
      blocName: selectedBloc.name,
      machineId: selectedMachine.id,
      machineName: selectedMachine.name,
      description,
      imageUri: image,
      createdAt: new Date().toISOString(),
    };

    addAnomaly(newAnomaly);
    navigation.goBack();
  };

  // Filter machines by selected bloc
  const getFilteredMachines = () => {
    if (!selectedBloc) return [];
    return machines.filter(machine => machine.blocId === selectedBloc.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.title}>New Anomaly</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter anomaly title"
        />

        <Text style={styles.label}>Bloc *</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setModalType('bloc');
            setModalVisible(true);
          }}
        >
          <Text style={styles.dropdownText}>
            {selectedBloc ? selectedBloc.name : 'Select Bloc'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        <Text style={styles.label}>Machine *</Text>
        <TouchableOpacity
          style={[styles.dropdown, !selectedBloc && styles.dropdownDisabled]}
          onPress={() => {
            if (selectedBloc) {
              setModalType('machine');
              setModalVisible(true);
            }
          }}
        >
          <Text style={styles.dropdownText}>
            {selectedMachine ? selectedMachine.name : 'Select Machine'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the anomaly"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Photo</Text>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.selectedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={24} color="#666" />
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === 'bloc' ? 'Select Bloc' : 'Select Machine'}
            </Text>

            {isLoading ? (
              <Text>Loading...</Text>
            ) : modalType === 'bloc' ? (
              blocks.map((bloc) => (
                <TouchableOpacity
                  key={bloc.id}
                  style={styles.optionItem}
                  onPress={() => {
                    setSelectedBloc(bloc);
                    setSelectedMachine(null);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{bloc.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              getFilteredMachines().map((machine) => (
                <TouchableOpacity
                  key={machine.id}
                  style={styles.optionItem}
                  onPress={() => {
                    setSelectedMachine(machine);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{machine.name}</Text>
                </TouchableOpacity>
              ))
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  shortInput: {
    width: 100,
  },
  dropdownButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  optionText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  selectedOptionText: {
    color: '#3498db',
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '500',
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  dropdownDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e2e8f0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  imageButton: {
    width: '100%',
    height: 200,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#666',
  }
});

export default AnomalyFormScreen;