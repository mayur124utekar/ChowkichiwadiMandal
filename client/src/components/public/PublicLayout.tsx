import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PublicHeader } from './PublicHeader.js';
import { PublicFooter } from './PublicFooter.js';
import { PublicAPI } from '../../api/client.js';
import { SiteSettings } from '../../types/index.js';

export const PublicLayout: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    PublicAPI.getMandalInfo()
      .then((data) => {
        setSettings(data.settings);
      })
      .catch((err) => console.error('Failed to load settings:', err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF7] text-gray-800">
      <PublicHeader settings={settings} />
      <main className="flex-grow">
        <Outlet context={{ settings }} />
      </main>
      <PublicFooter settings={settings} />
    </div>
  );
};
