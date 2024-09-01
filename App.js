import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import Feed from './screens/Feed';
import Start from './screens/Start';
import MembersScreen from './screens/MembersScreen';
import MemberDetailsScreen from './screens/MemberDetailsScreen';
import Birthday from './screens/Birthday'; // Import the Birthday screen
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const App = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
        const storedPassword = await AsyncStorage.getItem('password');
        const storedApplicantName = await AsyncStorage.getItem('applicantName'); // Fetch applicant name

        if (storedPhoneNumber && storedPassword && storedApplicantName) {
          setUserData({
            phoneNumber: storedPhoneNumber,
            password: storedPassword,
            applicantName: storedApplicantName, // Set applicant name
          });
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  if (isLoading) {
    return null; // Alternatively, show a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={userData ? 'Feed' : 'Splash'}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        {!userData && (
          <Stack.Screen name="Start" component={Start} options={{ headerShown: false }} />
        )}
        {!userData && (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
        <Stack.Screen
          name="Feed"
          component={Feed}
          options={{ headerShown: false }}
          initialParams={{ userData }}
        />
        <Stack.Screen name="Members" component={MembersScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MemberDetails" component={MemberDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Birthday" component={Birthday} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
