import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import '../../../../FirebaseConfig';
import firebase from '@react-native-firebase/app';

const StudentHome = ({navigation}) => {
  const [fullName, setFullName] = useState([]);

  const fetchUser = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const userQuery = firebase
        .firestore()
        .collection('users')
        .where('email', '==', user.email);
      const userDoc = await userQuery.get();
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        setFullName(userData.fullName);
      }
    }
  };

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      fetchUser();
    }
  });

  return (
    <View>
      <View>
        <Text style={styles.Uppertitle}>
          Welcome {'\n'}
          {'\n'} {fullName}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('StudentAttendanceBottomNavigator')}
        style={styles.card}>
        <View>
          <MaterialCommunityIcons
            name="google-spreadsheet"
            size={50}
            style={styles.icon}
          />
          <Text style={styles.title}>Attendance</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default StudentHome;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    width: '50%',
    height: '50%',
    top: 100,
    left: 10,
    padding: 20,
  },

  Uppertitle: {
    fontSize: 24,
    fontWeight: 'bold',
    top: 40,
    textAlign: 'center',
    color: 'black',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    top: 40,
    textAlign: 'center',
    color: 'black',
  },
  icon: {
    top: 10,
    textAlign: 'center',
    color: '#000',
  },
});
