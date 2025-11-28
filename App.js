import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from './src/components/SafeAreaWrapper';
import { AuthProvider } from './src/context/AuthContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import DictionaryScreen from './src/screens/DictionaryScreen';
import WordDetailScreen from './src/screens/WordDetailScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import CategoryDetailScreen from './src/screens/CategoryDetailScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SavedWordsScreen from './src/screens/SavedWordsScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { ErrorBoundary } from './src/components/ErrorBoundary';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function DictionaryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#1f2937',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="DictionaryList" 
        component={DictionaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="WordDetail" 
        component={WordDetailScreen}
        options={{ title: 'Word Details' }}
      />
    </Stack.Navigator>
  );
}

function CategoriesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#1f2937',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="CategoriesList" 
        component={CategoriesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CategoryDetail" 
        component={CategoryDetailScreen}
        options={{ title: 'Category Details' }}
      />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        options={{ headerShown: false }}
      >
        {() => (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Dictionary') {
                  iconName = focused ? 'book' : 'book-outline';
                } else if (route.name === 'Categories') {
                  iconName = focused ? 'grid' : 'grid-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#3b82f6',
              tabBarInactiveTintColor: '#6b7280',
              headerShown: false,
              tabBarStyle: {
                backgroundColor: '#fff',
                borderTopWidth: 1,
                borderTopColor: '#e5e7eb',
              },
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Dictionary" component={DictionaryStack} />
            <Tab.Screen name="Categories" component={CategoriesStack} />
          </Tab.Navigator>
        )}
      </Stack.Screen>
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ 
          headerShown: true,
          title: 'Login / Register'
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          headerShown: true,
          title: 'Profile'
        }}
      />
      <Stack.Screen 
        name="SavedWords" 
        component={SavedWordsScreen}
        options={{ 
          headerShown: true,
          title: 'Saved Words'
        }}
      />
      <Stack.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{ 
          headerShown: true,
          title: 'Progress'
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          headerShown: true,
          title: 'Settings'
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaWrapper>
        <AuthProvider>
          <NavigationContainer>
            <MainStack />
            <StatusBar style="auto" />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaWrapper>
    </ErrorBoundary>
  );
}
