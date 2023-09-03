import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import '../../../../FirebaseConfig';
import firestore from '@react-native-firebase/firestore';

const ApproveLeaves = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    // Fetch attendance data from Firestore
    const unsubscribe = firestore()
      .collection('approveLeaves')
      .doc('leaves')
      .collection('students')      
      .onSnapshot(querySnapshot => {
        const attendance = [];
        querySnapshot.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          // Check if the timestamp field is not null before converting to Date
          const timestamp = data.timestamp ? data.timestamp.toDate() : null;
          attendance.push({
            id: documentSnapshot.id,
            ...data,
            timestamp,
          });
        });
        setAttendance(attendance);
      });

    // Unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  const renderItem = ({item}) => {
    return (
      <View style={styles.attendanceContainer}>
        <Text style={styles.attendanceFields}>
          Student Name: {item.studentName}
        </Text>
        <Text style={styles.attendanceFields}>Status: {item.status}</Text>
        <Text style={styles.attendanceFields}>
          {item.timestamp && (
            <Text>{`Timestamp: ${item.timestamp.toString()}`}</Text>
          )}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {attendance.length ? (
        <FlatList
          data={attendance}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.extra}>Nothing To Show</Text>
      )}
    </View>
  );
};

export default ApproveLeaves;

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
