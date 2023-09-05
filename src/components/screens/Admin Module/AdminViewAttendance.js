import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import '../../../../FirebaseConfig';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AdminViewAttendance = ({navigation}) => {
  const [attendance, setAttendance] = useState([]);
  const [approveItem, setApproveItem] = useState(null);
  const [rejectedItem, setRejectedItem] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

          setAttendance(combinedAttendanceData);
          setIsDataFetched(true);
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    const fetchEditedStatus = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const editedStatusRef = firestore().collection('editedStatus');
          const editedStatusData = await editedStatusRef.get();

          const editedStatusMap = {};
          editedStatusData.docs.forEach(doc => {
            const data = doc.data();
            editedStatusMap[doc.id] = data.status;
          });

          // Update the UI with edited status
          setAttendance(prevAttendance =>
            prevAttendance.map(attendanceItem =>
              editedStatusMap.hasOwnProperty(attendanceItem.id)
                ? {
                    ...attendanceItem,
                    status: editedStatusMap[attendanceItem.id],
                  }
                : attendanceItem,
            ),
          );
        }
      } catch (error) {
        console.error('Error fetching edited status:', error);
      }
    };

    if (!isDataFetched) {
      fetchData();
      fetchEditedStatus(); // Fetch edited status when the component loads
    }
  }, []);

  const toggleStatus = async item => {
    try {
      const newStatus = item.status === 'Present' ? 'Absent' : 'Present';

      // Update Firestore document with the new status
      const attendanceRef = firestore().collection('attendance');
      const presentRef = attendanceRef.doc('present').collection('students');
      const leaveRef = attendanceRef.doc('leave').collection('students');

      if (item.status === 'Present') {
        // Delete the current entry from 'present' collection
        await presentRef.doc(item.id).delete();

        // Add a new entry to 'leave' collection with updated status
        await leaveRef.add({...item, status: newStatus});
      } else {
        // Delete the current entry from 'leave' collection
        await leaveRef.doc(item.id).delete();

        // Add a new entry to 'present' collection with updated status
        await presentRef.add({...item, status: newStatus});
      }

      // Update the edited status in Firestore
      await firestore().collection('editedStatus').doc(item.id).set({
        status: newStatus,
      });

      // Update the UI with the new status
      setAttendance(prevAttendance =>
        prevAttendance.map(attendanceItem =>
          attendanceItem.id === item.id
            ? {...attendanceItem, status: newStatus}
            : attendanceItem,
        ),
      );
    } catch (error) {
      console.error('Error toggling status:', error);
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
                  Roll Number: {item.rollno}
                </Text>
                <Text style={styles.attendanceFields}>
                  Timestamp: {item.timestamp.toDate().toLocaleString()}{' '}
                </Text>

                {item.status === 'Leave' ? (
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
                ) : (
                  <TouchableOpacity
                    style={styles.editStatusButton}
                    onPress={() => toggleStatus(item)}>
                    <Text style={styles.buttonText}>
                      {item.status === 'Present' ? 'Set Absent' : 'Set Present'}
                    </Text>
                  </TouchableOpacity>
                )}
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

  editStatusButton: {
    top: 10,
    width: '45%',
    backgroundColor: 'blue',
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 30,
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
