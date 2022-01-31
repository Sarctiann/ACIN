import { useState } from 'react';

const useSettings = () => {

  const defaultSettings = {
    theme_mode: 'dark',
    calculator: true,
    postsFontFamily: 'Helvetica'
  }
  
  const getSettings = () => {
    const settingsStr = localStorage.getItem('settings');
    const settingsObj = {...defaultSettings, ...JSON.parse(settingsStr)};
    return settingsObj
  };

  const [settings, setSettings] = useState(getSettings());

  const saveSettings = settings => {
    localStorage.setItem('settings', JSON.stringify(settings));
    setSettings(settings);
  };

  return [
    settings,
    saveSettings
  ]
}

export default useSettings;