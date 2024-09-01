import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const MemberDetailsScreen = ({ route }) => {
  const { member } = route.params;
  
  // Ensure the URL is properly encoded
  const imageUrl = encodeURI(member['Passport Size Photo/पासपोर्ट साइज फोटो']);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Display the member's passport size photo */}
      <Image
        source={{ uri: "https://drive.google.com/uc?export=view&id=1as325O8zXgG-KrBra5AXLwXFgULxkq1M"}}
        style={styles.passportPhoto}
        resizeMode="contain"
        onError={() => console.log('Error loading image')}
      />
      <Text style={styles.detailText}>Name: {member['Name/नाम']}</Text>
      <Text style={styles.detailText}>Email: {member['Email of Applicant/आवेदक का ईमेल']}</Text>
      <Text style={styles.detailText}>Phone Number: {member['Phone No. of Applicant/आवेदक का फ़ोन नंबर']}</Text>
      <Text style={styles.detailText}>Unique ID: {member['Unique Id']}</Text>
      {/* Add other member details here */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2C196',
    padding: 20,
    alignItems: 'center', // Center content horizontally
  },
  passportPhoto: {
    width: 150,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center', // Center text
  },
});

export default MemberDetailsScreen;
