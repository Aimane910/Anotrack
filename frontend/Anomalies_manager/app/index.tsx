import { AppRegistry, View } from 'react-native';
import { SetStateAction, useState } from 'react';
import LoginScreen from '../Screen/LoginScreen';
import HomeScreen from '../Screen/HomeScreen';
import AnomalyFormScreen from '../components/AnomalyFormScreen';
import appJson from '../app.json';

function App() {
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [userData, setUserData] = useState(null);

  const navigate = (screen: string, params: SetStateAction<null>) => {
    const screenName = screen === 'HomeScreen' ? 'Home' : 
                      screen === 'LoginScreen' ? 'Login' :
                      screen === 'AnomalyForm' ? 'AnomalyForm' :
                      screen;
                      
    setCurrentScreen(screenName);
    if (params) {
      setUserData(params);
    }
  };

  const goBack = () => {
    setCurrentScreen('Home'); // Default back navigation to Home
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