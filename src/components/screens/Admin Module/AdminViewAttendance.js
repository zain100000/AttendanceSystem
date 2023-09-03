import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {AsyncStorage}  from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import '../../../../FirebaseConfig';
import firestore from '@react-native-firebase/firestore';

const AdminViewAttendance = ({navigation}) => {
  const [attendance, setAttendance] = useState([]);
  const [approveItem, setApproveItem] = useState(null);
  const [rejectedItem, setRejectedItem] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Attempt to fetch attendance data from AsyncStorage
        const storedAttendance = await AsyncStorage.getItem('attendance');

        if (storedAttendance !== null) {
          // If data exists in AsyncStorage, parse it and set it to the state
          setAttendance(JSON.parse(storedAttendance));
        } else {
          // If data does not exist in AsyncStorage, fetch it from Firestore
          const attendanceRef = firestore().collection('attendance');
          const presentQuery = attendanceRef
            .doc('present')
            .collection('students');
          const leaveQuery = attendanceRef.doc('leave').collection('students');

          const presentSnapshot = await presentQuery.get();
          const leaveSnapshot = await leaveQuery.get();

          const presentData = presentSnapshot.docs.map(doc => doc.data());
          const leaveData = leaveSnapshot.docs.map(doc => doc.data());

          // Combine present and leave data if needed
          const combinedAttendanceData = [...presentData, ...leaveData];

          // Set the data to the state
          setAttendance(combinedAttendanceData);

          // Store the data in AsyncStorage for persistence
          await AsyncStorage.setItem(
            'attendance',
            JSON.stringify(combinedAttendanceData),
          );
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    fetchAttendance();
  }, []);

  const approveLeave = async item => {
    try {
      // Delete the attendance record from the AdminViewAttendance screen
      const updatedAttendance = attendance.filter(data => data !== item);
      setAttendance(updatedAttendance);

      // Set the approvedItem in the state
      setApproveItem(item);

      // Add the attendanceItem to the 'approveLeaves' Firestore collection
      await firestore().collection('approveLeaves').add(item);
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };

  const rejectLeave = async item => {
    try {
      // Delete the attendance record from the AdminViewAttendance screen
      const updatedAttendance = attendance.filter(data => data !== item);
      setAttendance(updatedAttendance);

      // Set the rejectedItem in the state
      setRejectedItem(item);

      // Add the attendanceItem to the 'rejectLeaves' Firestore collection
      await firestore().collection('rejectLeaves').add(item);
    } catch (error) {
      console.error('Error rejecting leave:', error);
    }
  };

  return (
    <SafeAreaView style={styles.maincontainer}>
      <View style={styles.head}>
        <TouchableOpacity onPress={() => navigation.navigate('AdminHome')}>
          <MaterialCommunityIcons name="arrow-left" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.heading}>View Attendance</Text>
      </View>

      <View>
        {attendance.length ? (
          <FlatList
            data={attendance}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.attendanceContainer}>
                <Text style={styles.attendanceFields}>
                  Student Name: {item.studentName}
                </Text>
                <Text style={styles.attendanceFields}>
                  Status: {item.status}
                </Text>
                <Text style={styles.attendanceFields}>
                  TimeStamp:
                  {item.timestamp && item.timestamp.toLocaleString()}
                </Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => approveLeave(item)}>
                    <Text style={styles.buttonText}>Approve Leave</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => rejectLeave(item)}>
                    <Text style={styles.buttonText}>Reject Leave</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={styles.extra}>Nothing To Show</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AdminViewAttendance;

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

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
    width: '100%',
  },

  approveButton: {
    backgroundColor: 'green',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 45,
    width: '40%',
  },

  rejectButton: {
    backgroundColor: 'red',
    width: '40%',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 45,
  },

  buttonText: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    padding: 2,
  },

  extra: {
    textAlign: 'center',
    fontSize: 24,
    color: '#000',
    fontWeight: '700',
  },
});
