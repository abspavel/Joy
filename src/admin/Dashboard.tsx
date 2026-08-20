import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { HeroAdmin } from './components/HeroAdmin';
import { AboutAdmin } from './components/AboutAdmin';
import { ProjectsAdmin } from './components/ProjectsAdmin';
import { ServicesAdmin } from './components/ServicesAdmin';
import { CirclePhotosAdmin } from './components/CirclePhotosAdmin';
import { CarouselPhotosAdmin } from './components/CarouselPhotosAdmin';
import { TestimonialsAdmin } from './components/TestimonialsAdmin';
import { MessagesAdmin } from './components/MessagesAdmin';
import { AchievementsAdmin } from './components/AchievementsAdmin';
import { SkillsAdmin } from './components/SkillsAdmin';
import { CertificationsAdmin } from './components/CertificationsAdmin';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('Hero');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const tabs = ['Hero', 'About', 'Achievements', 'Skills', 'Certifications', 'Circle Photos', 'Carousel', 'Projects', 'Services', 'Testimonials', 'Messages'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Portfolio Admin</h1>
          <button onClick={handleLogout} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Logout</button>
        </div>
      </header>
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeTab === tab ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900 hover:bg-gray-50'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>
        <main className="flex-1 bg-white shadow rounded-lg p-6 overflow-x-auto text-gray-900">
          {activeTab === 'Hero' && <HeroAdmin />}
          {activeTab === 'About' && <AboutAdmin />}
          {activeTab === 'Achievements' && <AchievementsAdmin />}
          {activeTab === 'Skills' && <SkillsAdmin />}
          {activeTab === 'Certifications' && <CertificationsAdmin />}
          {activeTab === 'Projects' && <ProjectsAdmin />}
          {activeTab === 'Services' && <ServicesAdmin />}
          {activeTab === 'Circle Photos' && <CirclePhotosAdmin />}
          {activeTab === 'Carousel' && <CarouselPhotosAdmin />}
          {activeTab === 'Testimonials' && <TestimonialsAdmin />}
          {activeTab === 'Messages' && <MessagesAdmin />}
        </main>
      </div>
    </div>
  );
}
