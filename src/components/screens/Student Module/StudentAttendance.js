import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import '../../../../FirebaseConfig';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const StudentAttendance = ({navigation}) => {
  const [attendance, setAttendance] = useState([]);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [fullName, setFullName] = useState('');
  const [rollno, setRollNo] = useState('');
  const [attendanceMarkedToday, setAttendanceMarkedToday] = useState(false); // Store if attendance has been marked today

  useEffect(() => {
    // Fetch the full name of the student from the Firestore collection "users"
    const user = auth().currentUser;
    if (user) {
      firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            const userData = documentSnapshot.data();
            setFullName(userData.fullName);
            setRollNo(userData.rollno);
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }

    // Check if attendance was marked today
    checkAttendanceMarkedToday(user);
  }, []);

  const markPresent = () => {
    if (attendanceMarkedToday) {
      alert(
        'Attendance Already Marked',
        'You have already marked your attendance for today.',
      );
    } else {
      const updatedAttendance = [...attendance];
      const timestamp = firestore.FieldValue.serverTimestamp();

      updatedAttendance[currentStudentIndex] = {
        studentName: fullName, // Set the full name
        status: 'Present',
        rollno: rollno,
        timestamp: timestamp,
      };

      setAttendance(updatedAttendance);
      setCurrentStudentIndex(currentStudentIndex + 1);
      setAttendanceMarkedToday(true);

      // Mark attendance as marked for today in Firestore
      markAttendanceForToday(auth().currentUser);
    }
  };

  const markLeave = () => {
    if (attendanceMarkedToday) {
      alert(
        'Attendance Already Marked',
        'You have already marked your attendance for today.',
      );
    } else {
      const updatedAttendance = [...attendance];
      const timestamp = firestore.FieldValue.serverTimestamp();

      updatedAttendance[currentStudentIndex] = {
        studentName: fullName, // Set the full name
        status: 'Leave',
        rollno: rollno,
        timestamp: timestamp,
      };

      setAttendance(updatedAttendance);
      setCurrentStudentIndex(currentStudentIndex + 1);
      setAttendanceMarkedToday(true);

      // Mark attendance as marked for today in Firestore
      markAttendanceForToday(auth().currentUser);
    }
  };

  const checkAttendanceMarkedToday = user => {
    if (!user) {
      return;
    }

    const currentDate = new Date().toDateString();
    const attendanceRef = firestore().collection('attendance').doc(user.uid);

    attendanceRef.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        const attendanceData = docSnapshot.data();
        if (attendanceData.markedDate === currentDate) {
          setAttendanceMarkedToday(true);
        }
      }
    });
  };

  const markAttendanceForToday = user => {
    if (!user) {
      return;
    }

    const currentDate = new Date().toDateString();
    const attendanceRef = firestore().collection('attendance').doc(user.uid);

    attendanceRef.set({markedDate: currentDate}, {merge: true});
  };

  const submitAttendance = async () => {
    const user = auth().currentUser;
    const batch = firestore().batch();

    attendance.forEach((student, index) => {
      const attendanceRef = firestore().collection('attendance');
      const viewAttendanceRef = firestore().collection('viewAttendance');

      if (student.status === 'Present') {
        // If the status is 'Present', store in the 'present' subcollection
        const presentAttendanceRef = attendanceRef
          .doc('present')
          .collection('students')
          .doc();
        const presentViewAttendanceRef = viewAttendanceRef
          .doc('present')
          .collection('students')
          .doc();
        batch.set(presentAttendanceRef, {
          studentName: student.studentName,
          status: student.status,
          rollno: student.rollno,
          timestamp: student.timestamp,
          userId: user.uid,
        });
        batch.set(presentViewAttendanceRef, {
          studentName: student.studentName,
          status: student.status,
          rollno: student.rollno,
          timestamp: student.timestamp,
          userId: user.uid,
        });
      } else if (student.status === 'Leave') {
        // If the status is 'Leave', store in the 'leave' subcollection
        const leaveAttendanceRef = attendanceRef
          .doc('leave')
          .collection('students')
          .doc();
        const leaveViewAttendanceRef = viewAttendanceRef
          .doc('leave')
          .collection('students')
          .doc();
        batch.set(leaveAttendanceRef, {
          studentName: student.studentName,
          status: student.status,
          rollno: student.rollno,
          timestamp: student.timestamp,
          userId: user.uid,
        });
        batch.set(leaveViewAttendanceRef, {
          studentName: student.studentName,
          status: student.status,
          rollno: student.rollno,
          timestamp: student.timestamp,
          userId: user.uid,
        });
      }
    });

    try {
      await batch.commit();
      alert('Attendance has been submitted successfully!');
    } catch (error) {
      console.error('Error submitting attendance:', error);
    }
  };

  return (
    <SafeAreaView style={styles.maincontainer}>
      <ScrollView>
        <View style={styles.head}>
          <TouchableOpacity onPress={() => navigation.navigate('StudentHome')}>
            <MaterialCommunityIcons name="arrow-left" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.heading}>Student Attendance</Text>
        </View>

        <View>
          <SafeAreaView style={styles.container}>
            <ScrollView>
              <View style={styles.formContainer}>
                <TouchableOpacity
                  onPress={markPresent}
                  style={styles.attendanceButton}>
                  <Text style={styles.buttonText}>Mark Present</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={markLeave}
                  style={styles.attendanceButton}>
                  <Text style={styles.buttonText}>Mark Leave</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={submitAttendance}
                  style={styles.submitButton}>
                  <Text style={styles.buttonText}>Submit Attendance</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentAttendance;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: 'white',
  },

  head: {
    flex: 1,
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

  formContainer: {
    backgroundColor: 'transparent',
    padding: 20,
    marginTop: 34,
    borderRadius: 10,
    width: '95%',
    marginLeft: 10,
  },

  studentName: {
    fontSize: 20,
    color: '#000',
    fontWeight: '800',
    marginBottom: 20,
  },

  attendanceButton: {
    padding: 15,
    top: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: 'green',
  },

  submitButton: {
    padding: 15,
    top: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: 'green',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
