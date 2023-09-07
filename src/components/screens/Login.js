import React from 'react';
import {ScrollView} from 'react-native';
import {useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import '../../../FirebaseConfig';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const authCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = authCredential.user;
      const userRef = firestore().collection('users').doc(user.uid);
      const userDoc = await userRef.get();
      const role = userDoc.data().role;
      if (role === 'student') {
        navigation.navigate('StudentHome');
      } else if (role === 'admin') {
        navigation.navigate('AdminHome');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert('Password reset email sent successfully');
      })
      .catch(error => {
        alert('Error sending password reset email:', error);
      });
  };

  const isValidInput = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

    const isEmailValid = emailPattern.test(email);
    const isPasswordValid = passwordPattern.test(password);

    return isEmailValid && isPasswordValid;
  };

  const handleEmailChange = value => {
    setEmail(value);
  };
  const validateEmail = () => {
    if (!email) {
      return '';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }
    return '';
  };
  const emailError = validateEmail();

  const handlePasswordChange = value => {
    setPassword(value);
  };
  const validatePassword = () => {
    if (!password) {
      return '';
    }
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return 'Invalid Password Format';
    }
    return '';
  };
  const passwordError = validatePassword();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={require('../../assets/login_bg.jpg')}>
        <ScrollView>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Login</Text>
            <Text style={styles.description}>Please Login To Continue</Text>

            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={styles.input}
                placeholder="Email (Hello@gmail.com)"
                placeholderTextColor="white"
                autoCapitalize="none"
                value={email}
                onChangeText={handleEmailChange}
              />
              {emailError ? (
                <Text style={styles.validationerror}>{emailError}</Text>
              ) : null}
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={30}
                style={styles.icon}
              />
            </View>

            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={styles.input}
                placeholder="Password (Hello123#)"
                placeholderTextColor="white"
                secureTextEntry={hidePassword}
                value={password}
                onChangeText={handlePasswordChange}
              />
              <View style={styles.eyeIconContainer}>
                <TouchableOpacity
                  onPress={() => setHidePassword(!hidePassword)}>
                  <MaterialCommunityIcons
                    name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
                    size={25}
                    color={hidePassword ? 'white' : 'white'}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.validationerror}>{passwordError}</Text>
              ) : null}
              <MaterialCommunityIcons
                name="lock-outline"
                size={30}
                style={styles.icon}
              />
            </View>

            <View style={{flex: 1}}>
              <TouchableOpacity onPress={handleResetPassword}>
                <Text style={{fontSize: 18, color: 'white', fontWeight: '700'}}>
                  Forget Password ?
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              disabled={!isValidInput() || loading}
              onPress={handleLogin}
              style={[
                styles.button,
                {backgroundColor: isValidInput() ? 'green' : '#ccc'},
              ]}>
              {loading ? (
                <ActivityIndicator color={'white'} /> // Show loader while loading
              ) : (
                <Text style={styles.buttonText}>Login</Text> // Show login text when not loading
              )}
            </TouchableOpacity>

            <View style={styles.extracontainer}>
              <Text style={styles.extra}>Did't have an account ?</Text>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.btntext}>Signup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  text: {
    textAlign: 'center',
    fontSize: 30,
  },

  image: {
    flex: 1,
    width: Dimensions.get('screen').width,
    resizeMode: 'cover',
  },

  formContainer: {
    backgroundColor: 'transparent',
    padding: 20,
    width: Dimensions.get('screen').width - 20,
    marginTop: 130,
    left: 11,
  },

  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#EEE9DA',
  },

  description: {
    color: 'white',
    fontWeight: '400',
    marginBottom: 8,
    paddingTop: 8,
  },

  input: {
    borderWidth: 2,
    borderColor: '#ccc',
    paddingTop: 20,
    paddingLeft: 35,
    marginBottom: 20,
    paddingBottom: 8,
    color: 'white',
    fontWeight: '800',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    width: Dimensions.get('screen').width - 70,
  },

  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
    width: Dimensions.get('screen').width - 65,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },

  icon: {
    position: 'absolute',
    top: 19,
    color: 'white',
  },

  extracontainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 5,
    top: 10,
  },

  extra: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
    paddingRight: 5,
    top: 25,
  },

  btn: {
    borderColor: 'green',
    backgroundColor: 'black',
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 18,
    marginTop: 10,
    paddingBottom: 18,
    borderRadius: 50,
    left: 30,
  },

  btntext: {
    fontSize: 15,
    color: '#9DC08B',
    fontWeight: '700',
    paddingRight: 5,
  },

  eyeIconContainer: {
    position: 'absolute',
    top: 20,
    left: 300,
    padding: 5,
  },

  validationerror: {
    color: 'red',
    position: 'absolute',
    top: 60,
    fontWeight: '700',
    fontSize: 13,
  },
});
