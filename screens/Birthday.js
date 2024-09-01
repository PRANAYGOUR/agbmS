import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Image } from 'react-native';

const Birthday = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [todayBirthdays, setTodayBirthdays] = useState([]);

  useEffect(() => {
    const fetchBirthdayData = async () => {
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

        // Extract birthdays
        const birthdaysData = jsonData.map((user) => ({
          name: user['Name of Applicant/आवेदक का नाम'],
          dob: user['Date of birth/जन्म की तारीख'],
        }));

        // Get today's date in the same format as in your data
        const today = new Date().toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
        const todayBirthdaysList = birthdaysData.filter((user) => user.dob === today);

        setTodayBirthdays(todayBirthdaysList);
        setBirthdays(birthdaysData);
      } catch (error) {
        console.error('Error fetching birthday data:', error);
      }
    };

    fetchBirthdayData();
  }, []);

  // Render each date item with the corresponding names
  const renderDateItem = ({ item }) => (
    <View style={styles.dateContainer}>
      <Text style={styles.dateText}>{item.dob}</Text>
      {birthdays
        .filter((user) => user.dob === item.dob)
        .map((user, index) => (
          <Text key={index} style={styles.nameText}>
            {user.name}
          </Text>
        ))}
    </View>
  );

  // Create a list of unique dates from the data
  const uniqueDates = Array.from(new Set(birthdays.map((user) => user.dob)));

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('../assets/birthday.png')} style={styles.birthdayIcon} />
        <Text style={styles.header}>Today's Birthdays</Text>
        {todayBirthdays.length > 0 ? (
          todayBirthdays.map((user, index) => (
            <Text key={index} style={styles.todayText}>
              {user.name}
            </Text>
          ))
        ) : (
          <Text style={styles.noBirthdaysText}>No birthdays today</Text>
        )}
        <Text style={styles.header}>Other Dates</Text>
        <FlatList
          data={uniqueDates.map((dob) => ({ dob }))}
          keyExtractor={(item) => item.dob}
          renderItem={renderDateItem}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#DEC99D',
  },
  container: {
    padding: 16,
  },
  birthdayIcon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#800000',
    textAlign: 'center',
  },
  todayText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  noBirthdaysText: {
    fontSize: 16,
    color: '#800000',
    marginBottom: 10,
    textAlign: 'center',
  },
  dateContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#800000',
  },
  nameText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
});

export default Birthday;
