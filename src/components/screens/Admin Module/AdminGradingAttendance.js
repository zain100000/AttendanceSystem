import React from 'react';
import {StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ApproveLeaves from './ApproveLeaves';
import {createDrawerNavigator} from '@react-navigation/drawer';
import RejectLeaves from './RejectLeaves';
import Grading from './Grading';

const Drawer = createDrawerNavigator();

const AdminGradingAttendance = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveBackgroundColor: 'green',
        drawerActiveTintColor: '#fff',
        headerStyle: {
          height: 100,
          borderTopLeftRadius: 50,
          borderBottomRightRadius: 50,
          backgroundColor: 'green',
          shadowColor: '#000',
          elevation: 25,
        },
      }}>
      <Drawer.Screen
        name="Approve Leaves"
        component={ApproveLeaves}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons
              name="check-decagram-outline"
              size={22}
              color={color}
            />
          ),
          drawerLabelStyle: {marginLeft: -20, fontWeight: '700', fontSize: 16},
        }}
      />
      <Drawer.Screen
        name="Reject Leaves"
        component={RejectLeaves}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={22}
              color={color}
            />
          ),
          drawerLabelStyle: {marginLeft: -20, fontWeight: '700', fontSize: 16},
        }}
      />

      <Drawer.Screen
        name="Grading System"
        component={Grading}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons
              name="star"
              size={22}
              color={color}
            />
          ),
          drawerLabelStyle: {marginLeft: -20, fontWeight: '700', fontSize: 16},
        }}
      />
    </Drawer.Navigator>
  );
};

export default AdminGradingAttendance;

const styles = StyleSheet.create({});
