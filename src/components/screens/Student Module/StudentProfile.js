import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Text,
} from 'react-native';
import imgPlaceHolder from '../../../assets/default-Avatar.webp';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import '../../../../FirebaseConfig';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

const StudentProfile = () => {
  const [imageUrl, setImageUrl] = useState('');
  const authInstance = auth();
  const [fullname, setfullName] = useState('');
  const [rollno, setRollNo] = useState('');

  const handlePickImage = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then(image => {
      setImageUrl(image.path);
    });
  };

  useEffect(() => {
    const fetchImageUrl = async () => {
      const user = authInstance.currentUser;
      if (user) {
        try {
          const url = await storage()
            .ref(`users/${user.uid}/`) // Name in storage in Firebase console
            .getDownloadURL();
          setImageUrl(url);
        } catch (error) {
          alert('Error while downloading: ' + error);
        }
      } else {
        // User is not logged in, handle this case if needed
      }
    };

    fetchImageUrl();
  }, []);

  const handleUpdatePersonal = async () => {
    const user = authInstance.currentUser;
    try {
      // Update the Firestore document with the new values
      await firestore().collection('users').doc(user.uid).update({
        fullname,
        rollno,
      });

      alert('Personal information updated successfully!');
    } catch (error) {
      alert('Error updating personal information:', error);
    }
  };

  const isValidInput = () => {
    const fullNamePattern = /^[a-zA-Z\s]*$/;   

    const isFullNameValid = fullNamePattern.test(fullname);

    return isFullNameValid;
  };

  const handleFullnameChange = value => {
    setfullName(value);
  };
  const validateFullname = () => {
    if (!fullname) {
      return '';
    }
    const regex = /^[a-zA-Z\s]*$/;
    if (!fullname.match(regex)) {
      return 'Special Characters Not Allowed';
    }
    return '';
  };
  const fullnameError = validateFullname();

  const handleRollNoChange = value => {
    setRollNo(value);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.primarycontainer}>
          <View style={styles.profileContainer}>
            <View style={styles.imgContainer}>
              <TouchableOpacity onPress={handlePickImage}>
                {imageUrl ? (
                  <Image source={{uri: imageUrl}} style={styles.image} />
                ) : (
                  <Image source={imgPlaceHolder} style={styles.image} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <View style={styles.formContainer}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor={'black'}
                  value={fullname}
                  onChangeText={handleFullnameChange}
                />
                {fullnameError ? (
                  <Text style={styles.validationerror}>{fullnameError}</Text>
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
                  placeholder="Roll Number"
                  placeholderTextColor={'black'}
                  keyboardType="phone-pad"
                  value={rollno}
                  onChangeText={handleRollNoChange}
                />                
                <MaterialCommunityIcons
                  name="id-card"
                  size={30}
                  style={styles.icon}
                />
              </View>

              <TouchableOpacity
                disabled={!isValidInput()}
                onPress={handleUpdatePersonal}
                style={[
                  styles.button,
                  {backgroundColor: isValidInput() ? 'green' : '#ccc'},
                ]}>
                <Text style={styles.buttonText}>Update Personal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentProfile;

const styles = StyleSheet.create({
  primarycontainer: {
    flex: 1,
  },

  profileContainer: {
    flex: 0.8,
    marginTop: 20,
    alignItems: 'center',
  },

  imgContainer: {},

  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderColor: 'green',
    borderWidth: 4,
  },

  formContainer: {
    backgroundColor: 'transparent',
    padding: 20,
    marginTop: 10,
    width: '95%',
    marginLeft: 10,
  },

  input: {
    borderWidth: 2,
    borderColor: '#ccc',
    paddingTop: 20,
    paddingLeft: 40,
    marginBottom: 25,
    paddingBottom: 8,
    color: '#000',
    fontWeight: '800',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    width: '100%',
  },

  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 50,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },

  icon: {
    position: 'absolute',
    top: 19,
    color: '#000',
  },

  validationerror: {
    color: 'red',
    position: 'absolute',
    top: 60,
    fontWeight: '700',
    fontSize: 13,
  },
});
