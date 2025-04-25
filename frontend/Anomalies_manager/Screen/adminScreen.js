import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const API_URL = 'http://localhost:8080/api'; // Replace with your actual API URL

const AdminScreen = ({ navigation, route }) => {
  // States for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker');
  const [blocName, setBlocName] = useState('');
  const [machineName, setMachineName] = useState('');
  const [selectedBloc, setSelectedBloc] = useState('');
  const [token, setToken] = useState(null);
  const [blocIdMapping, setBlocIdMapping] = useState({});

  // Demo data
  const [employees, setEmployees] = useState([]);
  const [blocs, setBlocs] = useState([]);
  const [machines, setMachines] = useState([]);

  // Function to get token
  const getToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      setToken(userToken);
      return userToken;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  // Add employee function with axios
  const addEmployee = async () => {
    if (!username || !password || !role) {
      Alert.alert('Error', 'Please fill all employee fields!');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/auth/signup`, // Adjust the endpoint as per your API
        {
          username,
          password,
          role: [role],
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setEmployees([...employees, response.data.employee]);
        setUsername('');
        setPassword('');
        setRole('worker');
        Alert.alert('Success', 'Employee added successfully!');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      Alert.alert('Error', error.response?.data?.message || 'Error adding employee');
    }
  };

  // Add bloc function with axios
  const addBloc = async () => {
    if (!blocName) {
      Alert.alert('Error', 'Please enter bloc name!');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/admin/blocs`,
        { name: blocName },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setBlocs([...blocs, response.data.bloc]);
        setBlocName('');
        Alert.alert('Success', 'Bloc added successfully!');
      }
    } catch (error) {
      console.error('Error adding bloc:', error);
      Alert.alert('Error', error.response?.data?.message || 'Error adding bloc');
    }
  };

  // Add machine function with axios
  const addMachine = async () => {
    if (!machineName || !selectedBloc) {
      Alert.alert('Error', 'Please select a bloc and enter a machine name!');
      return;
    }

    try {
      // selectedBloc is already the ID, no need for mapping
      const response = await axios.post(
        `${API_URL}/admin/blocs/machines?blocId=${selectedBloc}`,
        { 
          name: machineName,
          description: ' '
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Adding machine to bloc:', {
        blocId: selectedBloc,
        machineName: machineName
      });
    
      if (response.status === 200) {
        setMachines([...machines, response.data]);
        setMachineName('');
        setSelectedBloc('');
        Alert.alert('Success', 'Machine added successfully!');
      }
    } catch (error) {
      console.error('Error adding machine:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to add machine');
    }
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await getToken();
        if (!userToken) {
          Alert.alert('Error', 'No authentication token found');
          navigation.navigate('Login');
          return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        };

        // Add debug log for blocs response
        const blocsRes = await axios.get(`${API_URL}/admin/blocs`, config);
        console.log('Blocs response:', blocsRes.data);

        setBlocs(blocsRes.data);
        
        // Create bloc ID mapping
        const mapping = {};
        blocsRes.data.forEach(bloc => {
          mapping[bloc.name] = bloc.id;
        });
        setBlocIdMapping(mapping);
        console.log('Bloc ID mapping created:', mapping);

      } catch (error) {
        console.error('Error fetching blocs:', error);
        Alert.alert('Error', 'Failed to load blocs');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    getToken();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header with logo */}
          <View style={styles.header}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/100' }} 
              style={styles.logo} 
            />
            <Text style={styles.logoText}>ANOTRACK</Text>
            <Text style={styles.subText}>SINCE 2021</Text>
          </View>
          
          {/* Add Employee Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Employee</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={role}
                style={styles.picker}
                onValueChange={(itemValue) => setRole(itemValue)}
              >
                <Picker.Item label="tech" value="tech" />
                <Picker.Item label="operator" value="operator" />
                <Picker.Item label="Admin" value="admin" />
              </Picker>
            </View>
            <TouchableOpacity style={styles.button} onPress={addEmployee}>
              <Text style={styles.buttonText}>Add Employee</Text>
            </TouchableOpacity>
          </View>
          
          {/* Add Bloc Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Bloc</Text>
            <TextInput
              style={styles.input}
              placeholder="Bloc Name"
              value={blocName}
              onChangeText={setBlocName}
            />
            <TouchableOpacity style={styles.button} onPress={addBloc}>
              <Text style={styles.buttonText}>Add Bloc</Text>
            </TouchableOpacity>
          </View>
          
          {/* Add Machine Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Machine</Text>
            <TextInput
              style={styles.input}
              placeholder="Machine Name"
              value={machineName}
              onChangeText={setMachineName}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedBloc}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedBloc(itemValue)}
              >
                <Picker.Item label="Select a bloc" value="" />
                {blocs && blocs.map((bloc) => (
                  <Picker.Item 
                    key={bloc.id} 
                    label={bloc.name} 
                    value={bloc.id} // Use bloc ID instead of name
                  />
                ))}
              </Picker>
            </View>
            <TouchableOpacity style={styles.button} onPress={addMachine}>
              <Text style={styles.buttonText}>Add Machine</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#183153',
    marginTop: 5,
  },
  subText: {
    fontSize: 12,
    color: '#183153',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#183153',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#2E78F8',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminScreen;