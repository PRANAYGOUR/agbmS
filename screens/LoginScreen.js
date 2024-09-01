import React, { useState, useEffect } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeepAwake } from 'expo';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function keepAwake() {
      await KeepAwake.activateKeepAwakeAsync();
    }
    keepAwake();
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
        const storedPassword = await AsyncStorage.getItem('password');
        if (storedPhoneNumber && storedPassword) {
          // Auto-login if credentials are stored
          handleSubmit(storedPhoneNumber, storedPassword);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleSubmit = async (phoneNumber, password) => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('https://pranaygour.github.io/json/');
      const html = await response.text();
      
      // Extract JSON data using regular expressions
      const jsonRegex = /<pre id="json-data">([^<]+)<\/pre>/;
      const match = html.match(jsonRegex);
      if (!match || match.length < 2) {
        throw new Error('JSON data not found in HTML');
      }
      const jsonData = JSON.parse(match[1].trim());

      const matchedMember = jsonData.find(member => 
        member['Email of Applicant/आवेदक का ईमेल'] === phoneNumber &&
        member['Unique Id'].toString() === password // Convert to string for comparison
      );

      if (matchedMember) {
        console.log('Login successful:', matchedMember);

        // Store login credentials in AsyncStorage
        await AsyncStorage.setItem('phoneNumber', phoneNumber);
        await AsyncStorage.setItem('password', password);

        navigation.navigate('Feed', { 
          userData: { 
            phoneNumber, 
            applicantName: matchedMember['Name/नाम'] 
          } 
        });
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Error logging in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#E2C196' }}>
      <View style={{ alignItems: 'center' }}>
        <Image source={require('../assets/logo3.png')} style={{ width: 250, height: 200, borderRadius: 30, borderColor: 'black', borderWidth: 5 }} />
      </View>
      <View style={{ marginTop: 20, paddingHorizontal: 20, paddingVertical: 30, backgroundColor: '#fff', borderColor: '#333', borderWidth: 5, borderRadius: 10, width: '80%' }}>
        <Text style={{ fontSize: 24, color: '#333', marginBottom: 20 }}>Enter details to login</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 10 }}>
          <Image source={require('../assets/email.png')} style={{ width: 30, height: 30, marginRight: 10 }} />
          <TextInput
            style={{ flex: 1, fontSize: 20, color: '#333' }}
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            placeholder="Email"
            placeholderTextColor="#333"
            keyboardType="email-address"
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 10 }}>
          <Image source={require('../assets/pass.png')} style={{ width: 25, height: 25, marginRight: 10 }} />
          <TextInput
            style={{ flex: 1, fontSize: 20, color: '#333' }}
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="#333"
          />
        </View>
        <TouchableOpacity onPress={() => handleSubmit(phoneNumber, password)} style={{ backgroundColor: '#007bff', padding: 15, borderRadius: 30, marginTop: 20, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, color: '#fff' }}>Login</Text>
        </TouchableOpacity>
        {error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}
        {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />}
      </View>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 18, color: 'black', marginTop: 20 }}>Presented by PG Studio</Text>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;