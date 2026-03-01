import React from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { colors } from './constants/theme';

import HomeScreen from './screens/citizen/HomeScreen';
import ReliefForm from './screens/citizen/ReliefForm';
import SOSForm from './screens/citizen/SOSForm';
import MyRequestsScreen from './screens/citizen/MyRequestsScreen';
import RequestDetailScreen from './screens/citizen/RequestDetailScreen';
import ConfirmRescueScreen from './screens/citizen/ConfirmRescueScreen';
import ProfileScreen from './screens/citizen/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import TeamMembersScreen from './screens/rescue_team/TeamMembersScreen';
import TaskHistoryScreen from './screens/rescue_team/TaskHistoryScreen';
import TaskAssignmentScreen from './screens/rescue_team/TaskAssignmentScreen';

const Stack = createNativeStackNavigator();

function CitizenStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ReliefForm" component={ReliefForm} />
      <Stack.Screen name="SOSForm" component={SOSForm} />
      <Stack.Screen name="MyRequests" component={MyRequestsScreen} />
      <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
      <Stack.Screen name="ConfirmRescue" component={ConfirmRescueScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function RescueTeamStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TaskAssignment" component={TaskAssignmentScreen} />
      <Stack.Screen name="TeamMembers" component={TeamMembersScreen} />
      <Stack.Screen name="TaskHistory" component={TaskHistoryScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { loading, token, isRescueOrCoordinator } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const initialRoute = token && isRescueOrCoordinator ? 'RescueTeamStack' : 'CitizenStack';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      <Stack.Screen name="CitizenStack" component={CitizenStack} />
      <Stack.Screen name="RescueTeamStack" component={RescueTeamStack} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </>
  );
}
