import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import '../../../../FirebaseConfig';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const StudentViewAttendance = ({navigation}) => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth().currentUser;
      if (user) {
        const attendanceRef = firestore().collection('attendance');

        // Fetch attendance data for 'Present' status
        const presentData = await attendanceRef
          .doc('present')
          .collection('students')
          .get();

        // Fetch attendance data for 'Leave' status
        const leaveData = await attendanceRef
          .doc('leave')
          .collection('students')
          .get();

        const presentAttendance = presentData.docs.map(doc => doc.data());
        const leaveAttendance = leaveData.docs.map(doc => doc.data());

        // Combine both sets of attendance data
        const combinedAttendanceData = [
          ...presentAttendance,
          ...leaveAttendance,
        ];

        setAttendanceData(combinedAttendanceData);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({item}) => {
    return (
      <View style={styles.attendanceContainer}>
        <Text style={styles.attendanceFields}>
          Student Name: {item.studentName}
        </Text>
        <Text style={styles.attendanceFields}>Status: {item.status}</Text>
        {item.timestamp && (
          <Text style={styles.attendanceFields}>
            Timestamp: {new Date(item.timestamp.toDate()).toDateString()}{' '}
            {new Date(item.timestamp.toDate()).toLocaleTimeString()}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.maincontainer}>
      <View style={styles.head}>
        <TouchableOpacity onPress={() => navigation.navigate('StudentHome')}>
          <MaterialCommunityIcons name="arrow-left" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.heading}>View Attendance</Text>
      </View>

      <View>
        {attendanceData.length ? (
          <FlatList
            data={attendanceData}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />
        ) : (
          <Text style={styles.extra}>Nothing To Show</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default StudentViewAttendance;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  head: {
    flexDirection: 'row',
    backgroundColor: 'green',
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
    padding: 30,
  },
  heading: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 22,
  },

  attendanceContainer: {
    flexDirection: 'column',
    paddingVertical: 25,
    paddingLeft: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
    marginBottom: 10,
  },

  attendanceFields: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 25,
    marginBottom: 5,
  },

  extra: {
    textAlign: 'center',
    fontSize: 24,
    color: '#000',
    fontWeight: '700',
  },
});
