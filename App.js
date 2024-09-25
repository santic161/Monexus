import React from 'react';
import { StatusBar } from 'react-native';
import { UserProvider } from './context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Routes from './routes/Routes';


export default function App() {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent={true} backgroundColor="#101010" />
      <UserProvider>
        <Routes />
      </UserProvider>
    </SafeAreaView>
  );
}