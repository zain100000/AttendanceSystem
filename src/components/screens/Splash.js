import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import '../../../FirebaseConfig';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      const unsubscribe = auth().onAuthStateChanged(async user => {
        if (user) {
          const userRef = firestore().collection('users').doc(user.uid);
          const userDoc = await userRef.get();
          if (userDoc.exists) {
            const {role} = userDoc.data();
            switch (role) {
              case 'student':
                navigation.navigate('StudentHome');
                break;
              case 'admin':
                navigation.navigate('AdminHome');
                break;
              default:
                console.log('Invalid Role');
            }
          } else {
            console.log('User does not exist');
          }
        } else {
          navigation.navigate('Login');
        }
      });
      return unsubscribe;
    }, 2000);
  }, []);

  return (
    <ImageBackground
      style={styles.image}
      source={require('../../assets/splash_bg.jpg')}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.heading}>Attendance System</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
  },

  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
});
