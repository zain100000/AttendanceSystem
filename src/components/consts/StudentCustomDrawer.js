import React, {useState, useEffect} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import imgPlaceHolder from '../../assets/default-Avatar.webp';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import '../../../FirebaseConfig';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

const StudentCustomDrawer = props => {
  const [imageUrl, setImageUrl] = useState('');
  const authInstance = auth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await auth().signOut();
      alert('Logout Successfully');
      navigation.navigate('Login');
    } catch (error) {
      alert(error.message);
    }
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

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        contentContainerStyle={{backgroundColor: 'green'}}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <View style={styles.imgContainer}>
              <View style={styles.imgContainer}>
                <TouchableOpacity>
                  {imageUrl ? (
                    <Image source={{uri: imageUrl}} style={styles.image} />
                  ) : (
                    <Image source={imgPlaceHolder} style={styles.image} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View
        style={{
          padding: 28,
          borderTopColor: 'green',
          borderTopWidth: 2,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={handleLogout}>
          <View style={{flexDirection: 'row'}}>
            <MaterialCommunityIcons name="logout" size={22} color="grey" />
            <Text
              style={{
                fontWeight: '700',
                color: 'grey',
                fontSize: 15,
                left: 5,
                top: 0,
              }}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StudentCustomDrawer;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    padding: 20,
  },

  profileContainer: {
    flex: 0.8,
    marginTop: 20,
  },

  imgContainer: {},

  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderColor: 'green',
    borderWidth: 4,
  },
});
