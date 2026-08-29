import React, { useState, Suspense } from 'react';
import { supabase } from '../lib/supabase';

const HeroAdmin = React.lazy(() => import('./components/HeroAdmin').then(m => ({ default: m.HeroAdmin })));
const AboutAdmin = React.lazy(() => import('./components/AboutAdmin').then(m => ({ default: m.AboutAdmin })));
const ProjectsAdmin = React.lazy(() => import('./components/ProjectsAdmin').then(m => ({ default: m.ProjectsAdmin })));
const ServicesAdmin = React.lazy(() => import('./components/ServicesAdmin').then(m => ({ default: m.ServicesAdmin })));
const CirclePhotosAdmin = React.lazy(() => import('./components/CirclePhotosAdmin').then(m => ({ default: m.CirclePhotosAdmin })));
const CarouselPhotosAdmin = React.lazy(() => import('./components/CarouselPhotosAdmin').then(m => ({ default: m.CarouselPhotosAdmin })));
const TestimonialsAdmin = React.lazy(() => import('./components/TestimonialsAdmin').then(m => ({ default: m.TestimonialsAdmin })));
const MessagesAdmin = React.lazy(() => import('./components/MessagesAdmin').then(m => ({ default: m.MessagesAdmin })));
const AchievementsAdmin = React.lazy(() => import('./components/AchievementsAdmin').then(m => ({ default: m.AchievementsAdmin })));
const SkillsAdmin = React.lazy(() => import('./components/SkillsAdmin').then(m => ({ default: m.SkillsAdmin })));
const CertificationsAdmin = React.lazy(() => import('./components/CertificationsAdmin').then(m => ({ default: m.CertificationsAdmin })));
const OptimizeImagesAdmin = React.lazy(() => import('./components/OptimizeImagesAdmin').then(m => ({ default: m.OptimizeImagesAdmin })));
const MarqueeAdmin = React.lazy(() => import('./components/MarqueeAdmin').then(m => ({ default: m.MarqueeAdmin })));
const BlogAdmin = React.lazy(() => import('./components/BlogAdmin').then(m => ({ default: m.BlogAdmin })));

function AdminTabSkeleton() {
  return (
    <div className="flex items-center justify-center p-12 text-gray-500">
      <div className="w-6 h-6 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
    </div>
  );
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('Hero');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const tabs = [
    'Hero', 
    'Marquee', 
    'About', 
    'Achievements', 
    'Skills', 
    'Certifications', 
    'Circle Photos', 
    'Carousel', 
    'Projects', 
    'Services', 
    'Blog',
    'Testimonials', 
    'Messages', 
    'Optimize Images'
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Portfolio Admin</h1>
          <button onClick={handleLogout} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeTab === tab ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900 hover:bg-gray-50'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 bg-white shadow rounded-lg p-6 overflow-x-auto text-gray-900">
          <Suspense fallback={<AdminTabSkeleton />}>
            {activeTab === 'Hero' && <HeroAdmin />}
            {activeTab === 'Marquee' && <MarqueeAdmin />}
            {activeTab === 'About' && <AboutAdmin />}
            {activeTab === 'Achievements' && <AchievementsAdmin />}
            {activeTab === 'Skills' && <SkillsAdmin />}
            {activeTab === 'Certifications' && <CertificationsAdmin />}
            {activeTab === 'Projects' && <ProjectsAdmin />}
            {activeTab === 'Services' && <ServicesAdmin />}
            {activeTab === 'Blog' && <BlogAdmin />}
            {activeTab === 'Circle Photos' && <CirclePhotosAdmin />}
            {activeTab === 'Carousel' && <CarouselPhotosAdmin />}
            {activeTab === 'Testimonials' && <TestimonialsAdmin />}
            {activeTab === 'Messages' && <MessagesAdmin />}
            {activeTab === 'Optimize Images' && <OptimizeImagesAdmin />}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
