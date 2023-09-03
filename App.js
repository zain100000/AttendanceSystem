import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from './src/components/screens/Splash';
import Signup from './src/components/screens/Signup';
import Login from './src/components/screens/Login';
import StudentDrawer from './src/components/navigation/StudentDrawer';
import StudentAttendanceBottomNavigator from './src/components/navigation/StudentAttendanceBottomNavigator';
import StudentProfile from './src/components/screens/Student Module/StudentProfile';
import AdminDrawer from './src/components/navigation/AdminDrawer';
import AdminAttendanceBottomNavigator from './src/components/navigation/AdminAttendanceBottomNavigator';
import ApproveLeaves from './src/components/screens/Admin Module/ApproveLeaves';
import RejectLeaves from './src/components/screens/Admin Module/RejectLeaves';
import Grading from './src/components/screens/Admin Module/Grading';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />

        {/* Student Module Imports */}

        <Stack.Screen name="StudentHome" component={StudentDrawer} />
        <Stack.Screen
          name="StudentAttendanceBottomNavigator"
          component={StudentAttendanceBottomNavigator}
        />
        <Stack.Screen
          name="StudentAttendance"
          component={StudentAttendanceBottomNavigator}
        />
        <Stack.Screen
          name="StudentViewAttendance"
          component={StudentAttendanceBottomNavigator}
        />
        <Stack.Screen name="StudentProfile" component={StudentProfile} />

        {/* Admin Module Imports */}

        <Stack.Screen name="AdminHome" component={AdminDrawer} />
        <Stack.Screen
          name="AdminViewAttendance"
          component={AdminAttendanceBottomNavigator}
        />
        <Stack.Screen
          name="AdminAttendanceBottomNavigator"
          component={AdminAttendanceBottomNavigator}
        />

        <Stack.Screen name="ApproveLeaves" component={ApproveLeaves} />
        <Stack.Screen name="RejectLeaves" component={RejectLeaves} />
        <Stack.Screen name="Grading" component={Grading} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
