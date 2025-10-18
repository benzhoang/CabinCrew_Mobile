import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import MainScreen from './components/MainScreen';
import Signin from './screens/Signin';
import Home from './components/Home';
import BatchScreen from './screens/BatchScreen';
import CandidateListScreen from './screens/CandidateListScreen';
import ScoringScreen from './screens/ScoringScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('main');
  const [currentLang, setCurrentLang] = useState('vi');
  const [campaignData, setCampaignData] = useState(null);
  const [batchData, setBatchData] = useState(null);
  const [candidateData, setCandidateData] = useState(null);

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

  const handleNavigateToBatch = (data) => {
    setCampaignData(data);
    setCurrentScreen('batch');
  };

  const handleBackFromBatch = () => {
    setCurrentScreen('home');
  };

  const handleNavigateToCandidateList = (data) => {
    setBatchData(data);
    setCurrentScreen('candidateList');
  };

  const handleBackFromCandidateList = () => {
    setCurrentScreen('batch');
  };

  const handleNavigateToScoring = (data) => {
    setCandidateData(data);
    setCurrentScreen('scoring');
  };

  const handleBackFromScoring = () => {
    setCurrentScreen('candidateList');
  };

  const handleScoreSubmit = (candidate, decision, criteria) => {
    console.log('Score submitted:', { candidate, decision, criteria });
    // Ở đây có thể thêm logic lưu điểm số vào database
    Alert.alert(
      'Thành công',
      `Đã ${decision === 'approved' ? 'duyệt' : 'từ chối'} ứng viên ${candidate.name}`,
      [{ text: 'OK', onPress: () => setCurrentScreen('candidateList') }]
    );
  };

  // Navigation object để truyền xuống các component
  const navigation = {
    navigate: (screen, params) => {
      if (screen === 'BatchScreen') {
        handleNavigateToBatch(params.campaignData);
      } else if (screen === 'CandidateListScreen') {
        handleNavigateToCandidateList(params.batchData);
      } else if (screen === 'ScoringScreen') {
        handleNavigateToScoring(params.candidateData);
      }
    }
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
      ) : currentScreen === 'batch' ? (
        <BatchScreen
          campaignData={campaignData}
          onBackPress={handleBackFromBatch}
          navigation={navigation}
        />
      ) : currentScreen === 'candidateList' ? (
        <CandidateListScreen
          batchData={batchData}
          onBackPress={handleBackFromCandidateList}
          navigation={navigation}
        />
      ) : currentScreen === 'scoring' ? (
        <ScoringScreen
          candidateData={candidateData}
          onBackPress={handleBackFromScoring}
          onScoreSubmit={handleScoreSubmit}
        />
      ) : (
        <Home
          onSignOutPress={handleSignOut}
          navigation={navigation}
        />
      )}
      <StatusBar style="dark" />
    </>
  );
}
