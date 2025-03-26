import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si AsyncStorage fonctionne correctement
  const checkAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem('test', 'testvalue');
      const value = await AsyncStorage.getItem('test');
      console.log('AsyncStorage test:', value);
      await AsyncStorage.removeItem('test');
    } catch (error) {
      console.error('Erreur AsyncStorage:', error);
      Alert.alert('Erreur', 'Le stockage local ne fonctionne pas.');
    }
  };

  useEffect(() => {
    checkAsyncStorage();
  }, []);

  // Fonction de connexion
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre nom d’utilisateur et votre mot de passe.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Tentative de connexion:', { username });

      const response = await axios.post(
        'https://535d-196-200-184-210.ngrok-free.app/api/auth/signin',
        {
          username: username.trim(),
          password: password.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          timeout: 10000, // Timeout augmenté pour éviter les erreurs réseau
        }
      );

      console.log('Réponse reçue:', response.data);

      if (response.data?.token) {
        // Enregistrer les données utilisateur de manière sécurisée
        try {
          await AsyncStorage.setItem('userToken', response.data.token);
          await AsyncStorage.setItem('userData', JSON.stringify(response.data.userData || {}));

          // Vérifier si les données ont bien été enregistrées
          const storedToken = await AsyncStorage.getItem('userToken');
          const storedUserData = await AsyncStorage.getItem('userData');
          console.log('Données enregistrées:', { storedToken, storedUserData });

          // Navigation vers l'écran principal
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home'  }],
          });
        } catch (storageError) {
          console.error('Erreur de stockage:', storageError);
          Alert.alert('Erreur', 'Impossible de sauvegarder les données de connexion.');
        }
      } else {
        throw new Error('Réponse invalide: aucun token reçu');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);

      let errorMessage = 'Une erreur est survenue.';
      if (error.response?.status === 401) {
        errorMessage = 'Identifiant ou mot de passe incorrect.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Serveur introuvable.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'La requête a expiré. Réessayez.';
      } else {
        errorMessage = 'Vérifiez votre connexion Internet.';
      }

      Alert.alert('Échec de connexion', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.brandText}>Bienvenue sur ANOTRACK</Text>
          <Text style={styles.tagline}>Suivez et gérez vos anomalies efficacement</Text>
        </View>

        {/* Champ de saisie */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nom d’utilisateur"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bouton de connexion */}
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>{isLoading ? 'Connexion...' : 'Se connecter'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  logo: { width: width * 0.7, height: width * 0.7, marginBottom: 16 },
  brandText: { fontSize: 32, fontWeight: 'bold', color: '#1E293B' },
  tagline: { fontSize: 14, color: '#64748B', marginTop: 8 },
  inputContainer: { width: '100%', gap: 16 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 56,
    paddingHorizontal: 16,
    elevation: 2,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#1E293B' },
  eyeIcon: { padding: 8 },
  loginButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  loginButtonDisabled: { backgroundColor: '#94A3B8' },
});

export default LoginScreen;
