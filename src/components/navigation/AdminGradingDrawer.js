import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AdminHome from '../screens/Admin Module/AdminHome';
import AdminCustomDrawer from '../consts/AdminCustomDrawer';

const Drawer = createDrawerNavigator();

const AdminGradingDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <AdminCustomDrawer {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: 'green',
        drawerActiveTintColor: '#fff',
      }}>
      <Drawer.Screen
        name="Admin Home"
        component={AdminHome}
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
    </Drawer.Navigator>
  );
};

export default AdminGradingDrawer;
