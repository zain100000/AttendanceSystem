import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import '../../../../FirebaseConfig';
import firestore from '@react-native-firebase/firestore'; // Import Firestore

const GradingConfig = {
  A: 5, // A grade requires 5 or more attendance days
  B: 4, // B grade requires 4 or more attendance days
  C: 3, // C grade requires 3 or more attendance days
  D: 2, // D grade requires 2 or more attendance days
};

const Grading = ({route}) => {
  const {userId} = route.params || {}; // Add a default value to prevent undefined
  const [attendance, setAttendance] = useState([]);
  const [approveLeaves, setApproveLeaves] = useState(0); // Initialize to 0

  useEffect(() => {
    // Query the Firebase database for the student's information
    const fetchAttendance = async () => {
      const attendanceRef = firestore().collection('attendance');
      const presentQuery = attendanceRef.doc('present').collection('students');
      const leaveQuery = attendanceRef.doc('leave').collection('students');

      const presentSnapshot = await presentQuery.get();
      const leaveSnapshot = await leaveQuery.get();

      const presentData = presentSnapshot.docs.map(doc => doc.data());
      const leaveData = leaveSnapshot.docs.map(doc => doc.data());

      // Combine present and leave data if needed
      const combinedAttendanceData = [...presentData, ...leaveData];

      setAttendance(combinedAttendanceData);

      // Calculate the number of approved leaves
      const approvedLeavesRef = firestore().collection('approveLeaves');
      const approvedLeavesSnapshot = await approvedLeavesRef.get();
      const approvedLeavesCount = approvedLeavesSnapshot.docs.length;
      setApproveLeaves(approvedLeavesCount);
    };

    fetchAttendance();
  }, []);

  const calculateGrade = () => {
    if (attendance.length) {
      if (approveLeaves >= 2) {
        return 'D';
      } else if (approveLeaves === 0) {
        return 'A';
      } else {
        // Calculate the grade based on the grading configuration
        for (const grade in GradingConfig) {
          if (attendance.length >= GradingConfig[grade]) {
            return grade;
          }
        }
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
                Leaves: {item.status === 'leave' ? 1 : 0}
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
