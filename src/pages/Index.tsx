
import React from 'react';
import NavBar from '@/components/NavBar';
import BabylonScene from '@/components/BabylonScene';
import ChatInterface from '@/components/ChatInterface';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <BabylonScene />
      <NavBar />
      <main className="flex-1 container py-6">
        <div className="mx-auto max-w-5xl h-full">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
};

export default Index;
