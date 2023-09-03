import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import '../../../../FirebaseConfig';
import firestore from '@react-native-firebase/firestore';

const GradingConfig = {
  A: 0, // A grade requires 0 approved leaves
  B: 3, // B grade requires more than 3 approved leaves
  C: 5, // C grade requires more than 5 approved leaves
  D: 10, // D grade requires more than 10 approved leaves
};

const Grading = ({route}) => {
  const {userId} = route.params || {};
  const [attendance, setAttendance] = useState([]);
  const [approveLeavesCount, setApproveLeavesCount] = useState(0);

  useEffect(() => {
    const fetchAttendance = async () => {
      // Query the Firebase database for the student's attendance
      const attendanceRef = firestore().collection('attendance');
      const leaveQuery = attendanceRef.doc('leave').collection('students');

      const leaveSnapshot = await leaveQuery.get();

      const leaveData = leaveSnapshot.docs.map(doc => doc.data());

      // Combine present and leave data if needed
      const combinedAttendanceData = [...leaveData];

      setAttendance(combinedAttendanceData);

      // Calculate the number of approved leaves
      const approveLeavesRef = firestore()
        .collection('approveLeaves')
        .doc('leaves')
        .collection('students');

      const approvedLeavesSnapshot = await approveLeavesRef.get();
      const approvedLeavesCount = approvedLeavesSnapshot.docs.length;
      setApproveLeavesCount(approvedLeavesCount);
    };

    fetchAttendance();
  }, []);

  const calculateGrade = () => {
    if (attendance.length) {
      if (approveLeavesCount > GradingConfig.D) {
        return 'D';
      } else if (approveLeavesCount > GradingConfig.C) {
        return 'C';
      } else if (approveLeavesCount > GradingConfig.B) {
        return 'B';
      } else {
        return 'A';
      }
    }
    return 'Grade not calculated';
  };

  return (
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
                Number of Leaves: {approveLeavesCount}
              </Text>
              <Text style={styles.attendanceFields}>
                Grade: {calculateGrade()}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.extra}>Nothing To Show</Text>
      )}
    </View>
  );
};

export default Grading;

const styles = StyleSheet.create({
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
