import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ReliefForm from './screens/ReliefForm';
import SOSForm from './screens/SOSForm';

const Stack = createNativeStackNavigator();

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
          <Stack.Screen name="Home" component={HomeScreen} />
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
      </NavigationContainer>
    </>
  );
}
