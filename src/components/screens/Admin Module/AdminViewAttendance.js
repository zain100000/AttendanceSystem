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
    };
    if (!isDataFetched) {
      fetchData();
    }
  }, [isDataFetched]);

  const approveLeave = async item => {
    try {
      // Create a Firestore reference for 'approveLeaves'
      const approveLeavesRef = firestore().collection('approveLeaves');

      // Add the attendanceItem to 'leaves' subcollection
      const leavesRef = approveLeavesRef.doc('leaves').collection('students');
      await leavesRef.add(item);

      setAttendance(prevAttendance =>
        prevAttendance.filter(attendanceItem => attendanceItem !== item),
      );

      // Set the approvedItem in the state
      setApproveItem(item);
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };

  const rejectLeave = async item => {
    try {
      // Create a Firestore reference for 'rejectLeaves'
      const rejectLeavesRef = firestore().collection('rejectLeaves');

      // Add the attendanceItem to 'leaves' subcollection
      const leavesRef = rejectLeavesRef.doc('leaves').collection('students');
      await leavesRef.add(item);

      setAttendance(prevAttendance =>
        prevAttendance.filter(attendanceItem => attendanceItem !== item),
      );

      // Set the rejectedItem in the state
      setRejectedItem(item);
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
                  Timestamp: {item.timestamp.toDate().toLocaleString()}{' '}
                  {/* Convert timestamp to a readable date */}
                </Text>

                {/* Conditionally render buttons based on student status */}
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
                ) : null}
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
