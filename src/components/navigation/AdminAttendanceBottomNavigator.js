import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AdminViewAttendance from '../screens/Admin Module/AdminViewAttendance';
import AdminGradingAttendance from '../screens/Admin Module/AdminGradingAttendance';

const Tab = createBottomTabNavigator();

const AdminAttendanceBottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          height: 60,
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'white',
        tabBarLabelStyle: {paddingBottom: 5, fontSize: 12, fontWeight: '600'},
      }}>
      <Tab.Screen
        name="View Attendance"
        component={AdminViewAttendance}
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

      <Tab.Screen
        name=" Grading Attendance"
        component={AdminGradingAttendance}
        options={{
          tabBarLabel: 'Grading Attendance',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="star"
              color={color}
              size={30}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminAttendanceBottomNavigator;
