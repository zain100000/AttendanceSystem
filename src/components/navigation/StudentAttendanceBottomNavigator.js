import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StudentAttendance from '../screens/Student Module/StudentAttendance';
import StudentViewAttendance from '../screens/Student Module/StudentViewAttendance';

const Tab = createBottomTabNavigator();

const StudentAttendanceBottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown:false,
        tabBarStyle: {
          backgroundColor: '#000',
          height: 60,
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'white',
        tabBarLabelStyle: {paddingBottom: 5, fontSize: 12, fontWeight: '600'},        
      }}>
      <Tab.Screen
        name="Attendance"
        component={StudentAttendance}
        options={{
          tabBarLabel: 'Attendance',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="alert-box-outline"
              color={color}
              size={30}
            />
          ),
        }}
      />

      <Tab.Screen
        name="View Attendance"
        component={StudentViewAttendance}
        options={{
          tabBarLabel: 'View Attendance',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="eye-outline"
              color={color}
              size={30}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default StudentAttendanceBottomNavigator;
