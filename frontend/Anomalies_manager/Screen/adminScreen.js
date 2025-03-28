import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const API_URL = 'http://your-backend-url/api'; // Replace with your actual API URL

const AdminScreen = ({ navigation, route }) => {
  // States for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker');
  const [blocName, setBlocName] = useState('');
  const [machineName, setMachineName] = useState('');
  const [selectedBloc, setSelectedBloc] = useState('');

  // Demo data
  const [employees, setEmployees] = useState([]);
  const [blocs, setBlocs] = useState([]);
  const [machines, setMachines] = useState([]);

  // Add employee function with axios
  const addEmployee = async () => {
    if (username && password && role) {
      try {
        const response = await axios.post(`${API_URL}/employees`, {
          username,
          password,
          role
        });

        if (response.data.success) {
          setEmployees([...employees, response.data.employee]);
          setUsername('');
          setPassword('');
          setRole('worker');
          alert('Employee added successfully!');
        }
      } catch (error) {
        console.error('Error adding employee:', error);
        alert(error.response?.data?.message || 'Error adding employee');
      }
    } else {
      alert('Please fill all employee fields!');
    }
  };

  // Add bloc function with axios
  const addBloc = async () => {
    if (blocName) {
      try {
        const response = await axios.post(`${API_URL}/blocs`, {
          name: blocName
        });

        if (response.data.success) {
          setBlocs([...blocs, response.data.bloc]);
          setBlocName('');
          alert('Bloc added successfully!');
        }
      } catch (error) {
        console.error('Error adding bloc:', error);
        alert(error.response?.data?.message || 'Error adding bloc');
      }
    } else {
      alert('Please enter bloc name!');
    }
  };

  // Add machine function with axios
  const addMachine = async () => {
    if (machineName && selectedBloc) {
      try {
        const response = await axios.post(`${API_URL}/machines`, {
          name: machineName,
          blocId: selectedBloc
        });

        if (response.data.success) {
          setMachines([...machines, response.data.machine]);
          setMachineName('');
          setSelectedBloc('');
          alert('Machine added successfully!');
        }
      } catch (error) {
        console.error('Error adding machine:', error);
        alert(error.response?.data?.message || 'Error adding machine');
      }
    } else {
      alert('Please fill all machine fields!');
    }
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesRes, blocsRes, machinesRes] = await Promise.all([
          axios.get(`${API_URL}/employees`),
          axios.get(`${API_URL}/blocs`),
          axios.get(`${API_URL}/machines`)
        ]);

        setEmployees(employeesRes.data.employees);
        setBlocs(blocsRes.data.blocs);
        setMachines(machinesRes.data.machines);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error loading initial data');
      }
    };

    fetchData();
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
                <Picker.Item label="Worker" value="worker" />
                <Picker.Item label="Supervisor" value="supervisor" />
                <Picker.Item label="Manager" value="manager" />
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
                {blocs.map((bloc, index) => (
                  <Picker.Item key={index} label={bloc.name} value={bloc.name} />
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