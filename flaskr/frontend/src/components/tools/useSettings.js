import { useState } from 'react';

const useSettings = () => {

  const defaultSettings = {
    theme_mode: 'dark',
    calculator: true
  }
  
  const getSettings = () => {
    const settingsStr = localStorage.getItem('settings');
    const settingsObj = JSON.parse(settingsStr) || defaultSettings;
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