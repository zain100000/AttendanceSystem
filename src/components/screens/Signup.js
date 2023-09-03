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
  Image,
  ActivityIndicator,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import imgPlaceHolder from '../../assets/default-Avatar.webp';
import ImagePicker from 'react-native-image-crop-picker';
import {Picker} from '@react-native-picker/picker';
import '../../../FirebaseConfig';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

const Signup = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollno, setRollNo] = useState('');
  const [image, setImage] = useState('');
  const [role, setRole] = useState('');
  const [showRollNoField, setShowRollNoField] = useState(false); 
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      const authCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = authCredential.user;
      const userRef = firestore().collection('users').doc(user.uid);
      const imageRef = storage().ref().child(`users/${user.uid}/`);
      const imageBlob = await fetch(image.path).then(response =>
        response.blob(),
      );
      await imageRef.put(imageBlob);
      const imageUrl = await imageRef.getDownloadURL();
      await userRef
        .set({
          role,
          imageUrl,
          fullName,
          email,
          rollno,
        })
        .then(() => {
          alert('User Registred Successfully');
          navigation.navigate('Login');
        });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      setImage(image);
    });
  };

  const handleRoleChange = value => {
    setRole(value);
    setShowRollNoField(value === 'student');
  };

  const isValidInput = () => {
    const fullNamePattern = /^[a-zA-Z\s]*$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

    const isfullNameValid = fullNamePattern.test(fullName);
    const isEmailValid = emailPattern.test(email);
    const isPasswordValid = passwordPattern.test(password);

    return isfullNameValid && isEmailValid && isPasswordValid;
  };

  const validateFullName = () => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!fullName.match(regex)) {
      return 'Special Characters and Numbers Not Allowed';
    }
    return '';
  };
  const fullNameError = validateFullName();

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

  const handleRollNoChange = value => {
    setRollNo(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={require('../../assets/signup_bg.jpg')}>
        <ScrollView>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Signup</Text>
            <Text style={styles.description}>
              Please provide all required details to register
            </Text>

            <View style={styles.imgContainer}>
              {image ? (
                <Image source={{uri: image.path}} style={styles.img} />
              ) : (
                <Image source={imgPlaceHolder} style={styles.img} />
              )}
              <TouchableOpacity style={styles.button} onPress={handlePickImage}>
                <Text style={styles.buttontext}>Select Image</Text>
              </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="white"
                autoCapitalize="none"
                value={fullName}
                onChangeText={setFullName}
              />
              {fullNameError ? (
                <Text style={styles.validationerror}>{fullNameError}</Text>
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
                placeholder="Email: (Hello@gmail.com)"
                placeholderTextColor="white"
                value={email}
                onChangeText={handleEmailChange}
              />
              {emailError ? (
                <Text style={styles.validationerror}>{emailError}</Text>
              ) : null}
              <MaterialCommunityIcons
                name="email-outline"
                size={30}
                style={styles.icon}
              />
            </View>

            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={styles.input}
                placeholder="Password: (Hello123#)"
                placeholderTextColor="white"
                secureTextEntry={hidePassword}
                value={password}
                onChangeText={handlePasswordChange}
              />
              {passwordError ? (
                <Text style={styles.validationerror}>{passwordError}</Text>
              ) : null}
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
              <MaterialCommunityIcons
                name="lock-outline"
                size={30}
                style={styles.icon}
              />
            </View>

            <View
              style={{
                borderColor: '#ccc',
                top: -6,
                borderWidth: 2,
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                marginBottom: 20,
                marginTop: 20,
              }}>
              <Picker
                selectedValue={role}
                onValueChange={handleRoleChange}
                style={{
                  left: 20,
                  top: 8,
                  color: 'white',
                }}>
                <Picker.Item style={styles.item} label="Select Role" value="" />
                <Picker.Item
                  style={styles.item}
                  label="Student"
                  value="student"
                />
                <Picker.Item style={styles.item} label="Admin" value="admin" />
              </Picker>
              <MaterialCommunityIcons
                name="account-outline"
                size={30}
                style={styles.icon}
              />
            </View>

            <View>
              {showRollNoField && (
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Roll Number: (Only For Students)!"
                    placeholderTextColor="white"
                    autoCapitalize="none"
                    keyboardType='phone-pad'
                    value={rollno}
                    onChangeText={handleRollNoChange}
                  />
                  <MaterialCommunityIcons
                    name="id-card"
                    size={30}
                    style={styles.icon}
                  />
                </View>
              )}
            </View>

            <TouchableOpacity
              disabled={!isValidInput() || loading}
              onPress={handleSignup}
              style={[
                styles.button,
                {backgroundColor: isValidInput() ? 'green' : '#ccc'},
              ]}>
              {loading ? (
                <ActivityIndicator color={'white'} /> // Show loader while loading
              ) : (
                <Text style={styles.buttonText}>Signup</Text> // Show login text when not loading
              )}
            </TouchableOpacity>

            <View style={styles.extracontainer}>
              <Text style={styles.extra}>Already have an account ?</Text>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.btntext}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -35,
    alignItems: 'center',
    textAlign: 'center',
  },

  text: {
    textAlign: 'center',
    fontSize: 30,
  },

  imgContainer: {},

  img: {
    width: 110,
    height: 110,
    top: 16,
    borderRadius: 55,
    borderColor: 'green',
    borderWidth: 4,
    left: 110,
  },

  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },

  formContainer: {
    backgroundColor: 'transparent',
    padding: 20,
    marginTop: 34,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 5,
    width: '95%',
    marginLeft: 10,
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
    marginBottom: 12,
    paddingBottom: 8,
    color: 'white',
    fontWeight: '800',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    width: '100%',
  },

  button: {
    padding: 10,
    borderRadius: 5,
    top: 20,
    alignItems: 'center',
    marginTop: 15,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },

  buttontext: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    bottom: 10,
  },

  icon: {
    position: 'absolute',
    top: 19,
    color: 'white',
  },

  extracontainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 30,
    paddingLeft: 5,
  },

  extra: {
    fontSize: 15,
    color: 'black',
    fontWeight: '700',
    paddingRight: 5,
    top: 30,
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

  item: {
    fontSize: 14,
  },

  validationerror: {
    color: 'red',
    position: 'absolute',
    top: 60,
    fontWeight: '700',
    fontSize: 13,
  },
});
