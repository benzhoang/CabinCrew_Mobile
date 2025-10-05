import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import MainScreen from './components/MainScreen';
import Signin from './screens/Signin';
import Home from './components/Home';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('main');
  const [currentLang, setCurrentLang] = useState('vi');

  const handleSignIn = () => {
    setCurrentScreen('signin');
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
  };

  const handleSignInSuccess = () => {
    setCurrentScreen('home');
  };

  const handleSignOut = () => {
    setCurrentScreen('main');
  };

  const handleLanguageChange = (newLang) => {
    setCurrentLang(newLang);
  };

  return (
    <>
      {currentScreen === 'main' ? (
        <MainScreen
          onSignInPress={handleSignIn}
          currentLang={currentLang}
          onLanguageChange={handleLanguageChange}
        />
      ) : currentScreen === 'signin' ? (
        <Signin
          onBackPress={handleBackToMain}
          onSignInSuccess={handleSignInSuccess}
          currentLang={currentLang}
        />
      ) : (
        <Home
          onSignOutPress={handleSignOut}
        />
      )}
      <StatusBar style="dark" />
    </>
  );
}
