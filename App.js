import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PortfolioScreen from './src/screens/PortfolioScreen';
import CustomDrawer from './src/components/CustomDrawer';
import { theme } from './src/styles/theme';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <View style={styles.appBackground}>
        <View style={styles.appContainer}>
          <Drawer.Navigator
            initialRouteName="Portfolio"
            drawerContent={(props) => (
              <CustomDrawer
                {...props}
                scrollToSection={(section) => props.navigation.navigate('Portfolio', { section })}
              />
            )}
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.background,
                borderBottomColor: theme.colors.border,
                borderBottomWidth: 1,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              drawerStyle: {
                backgroundColor: theme.colors.card,
                width: 250,
              },
              drawerActiveTintColor: theme.colors.primary,
              drawerInactiveTintColor: theme.colors.text,
              sceneContainerStyle: {
                backgroundColor: theme.colors.background,
              }
            }}
          >
            <Drawer.Screen
              name="Portfolio"
              component={PortfolioScreen}
              options={{ title: 'Vasanthakumar A (React Native Developer)' }}
            />
          </Drawer.Navigator>
        </View>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  appBackground: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }
    })
  }
});
