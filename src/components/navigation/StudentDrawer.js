import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import StudentCustomDrawer from '../consts/StudentCustomDrawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StudentHome from '../screens/Student Module/StudentHome';
import StudentProfile from '../screens/Student Module/StudentProfile';

const Drawer = createDrawerNavigator();

const StudentDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <StudentCustomDrawer {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: 'green',
        drawerActiveTintColor: '#fff',
      }}>
      <Drawer.Screen
        name="Student Home"
        component={StudentHome}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={22}
              color={color}
            />
          ),
          drawerLabelStyle: {marginLeft: -20, fontWeight: '700', fontSize: 16},

          headerStyle: {
            height: 100,
            borderTopLeftRadius: 50,
            borderBottomRightRadius: 50,
            backgroundColor: 'green',
            shadowColor: '#000',
            elevation: 25,
          },
        }}
      />

      <Drawer.Screen
        name="Student Profile"
        component={StudentProfile}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons
              name="information-outline"
              size={22}
              color={color}
            />
          ),
          drawerLabelStyle: {marginLeft: -20, fontWeight: '700', fontSize: 16},

          headerStyle: {
            height: 100,
            borderTopLeftRadius: 50,
            borderBottomRightRadius: 50,
            backgroundColor: 'green',
            shadowColor: '#000',
            elevation: 25,
          },
        }}
      />
    </Drawer.Navigator>
  );
};

export default StudentDrawer;
