import { AppRegistry, View } from 'react-native';
import { useState } from 'react';
import LoginScreen from '../Screen/LoginScreen';
import HomeScreen from '../Screen/HomeScreen';
import AdminScreen from '../Screen/adminScreen';
import AnomalyFormScreen from '../components/AnomalyFormScreen';
import appJson from '../app.json';

function App() {
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [userData, setUserData] = useState<any>(null);

  const navigate = (screen: string, params?: any) => {
    console.log('Navigation requested:', { screen, params }); // Debug log
    setCurrentScreen(
      screen === 'HomeScreen' ? 'Home' : 
      screen === 'LoginScreen' ? 'Login' :
      screen === 'AdminScreen' ? 'Admin' :
      screen === 'AnomalyForm' ? 'AnomalyForm' :
      screen
    );
    if (params) {
      setUserData(params);
    }
  };

  const goBack = () => {
    setCurrentScreen('Home');
  };


  return (
    <View style={{ flex: 1 }}>
      {currentScreen === 'Login' && (
        <LoginScreen 
          navigation={{ navigate, goBack }} 
        />
      )}
      {currentScreen === 'Home' && (
        <HomeScreen 
          navigation={{ navigate, goBack }} 
          route={{ params: userData }}
        />
      )}
      {currentScreen === 'Admin' && (
        <AdminScreen 
          navigation={{ navigate, goBack }}
          route={{ params: userData }}
        />
      )}
      {currentScreen === 'AnomalyForm' && (
        <AnomalyFormScreen
          navigation={{ navigate, goBack }}
          route={{ params: userData }}
        />
      )}
    </View>
  );
}

AppRegistry.registerComponent(appJson.expo.name, () => App);

export default App;