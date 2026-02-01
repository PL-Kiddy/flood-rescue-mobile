import React, { useState } from 'react';
import { StatusBar, View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Citizen Screens
import HomeScreen from './screens/citizen/HomeScreen';
import ReliefForm from './screens/citizen/ReliefForm';
import SOSForm from './screens/citizen/SOSForm';

// Rescue Team Screens
import LoginScreen from './screens/LoginScreen';
import TeamMembersScreen from './screens/rescue_team/TeamMembersScreen';
import TaskHistoryScreen from './screens/rescue_team/TaskHistoryScreen';
import TaskAssignmentScreen from './screens/rescue_team/TaskAssignmentScreen';

const Stack = createNativeStackNavigator();

function RoleSelectorScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f7f8', gap: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '900', color: '#1a1a1a', marginBottom: 20 }}>
        Chọn vai trò
      </Text>
      
      <TouchableOpacity
        style={{
          backgroundColor: '#d32f2f',
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
          width: '80%',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('CitizenStack')}
      >
        <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff' }}>
          👤 Người dân
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: '#4277a9',
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
          width: '80%',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('RescueTeamStack')}
      >
        <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff' }}>
          🚨 Đội cứu hộ
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function CitizenStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ animationEnabled: true }}
      />
      <Stack.Screen 
        name="ReliefForm" 
        component={ReliefForm}
        options={{ animationEnabled: true }}
      />
      <Stack.Screen 
        name="SOSForm" 
        component={SOSForm}
        options={{ animationEnabled: true }}
      />
    </Stack.Navigator>
  );
}

function RescueTeamStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TaskAssignment" component={TaskAssignmentScreen} />
      <Stack.Screen name="TeamMembers" component={TeamMembersScreen} />
      <Stack.Screen name="TaskHistory" component={TaskHistoryScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="RoleSelector" component={RoleSelectorScreen} />
          <Stack.Screen 
            name="CitizenStack" 
            component={CitizenStackNavigator}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen 
            name="RescueTeamStack" 
            component={RescueTeamStackNavigator}
            options={{ animationEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
