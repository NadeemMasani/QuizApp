import React from 'react';
import {
  StyleSheet,
} from 'react-native';

import AppNavigator from './navigation/AppNavigator';


export default function App() {
  return (
    /*Navigation Component for the entire App*/
    <AppNavigator />
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  }
});

