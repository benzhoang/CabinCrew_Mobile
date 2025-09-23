import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import MainScreen from './components/MainScreen';
import Signin from './screens/Signin';
import Signup from './screens/Signup';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('main');
  const [currentLang, setCurrentLang] = useState('vi');

  const handleSignIn = () => {
    setCurrentScreen('signin');
  };

  const handleSignUp = () => {
    setCurrentScreen('signup');
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
  };

  const handleSignInSuccess = () => {
    Alert.alert('Thành công', 'Đăng nhập thành công! Chào mừng bạn đến với CabinCrew!');
    setCurrentScreen('main');
  };

  const handleSignUpSuccess = () => {
    Alert.alert('Thành công', 'Đăng ký thành công! Chào mừng bạn đến với CabinCrew!');
    setCurrentScreen('main');
  };

  const handleSignInPress = () => {
    setCurrentScreen('signin');
  };

  const handleSignUpPress = () => {
    setCurrentScreen('signup');
  };

  const handleLanguageChange = (newLang) => {
    setCurrentLang(newLang);
  };

  return (
    <>
      {currentScreen === 'main' ? (
        <MainScreen
          onSignInPress={handleSignIn}
          onSignUpPress={handleSignUp}
          currentLang={currentLang}
          onLanguageChange={handleLanguageChange}
        />
      ) : currentScreen === 'signin' ? (
        <Signin
          onBackPress={handleBackToMain}
          onSignUpPress={handleSignUpPress}
          onSignInSuccess={handleSignInSuccess}
          currentLang={currentLang}
        />
      ) : (
        <Signup
          onBackPress={handleBackToMain}
          onSignInPress={handleSignInPress}
          onSignUpSuccess={handleSignUpSuccess}
          currentLang={currentLang}
        />
      )}
      <StatusBar style="dark" />
    </>
  );
}
