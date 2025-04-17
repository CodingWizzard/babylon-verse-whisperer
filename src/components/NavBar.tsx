
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github } from 'lucide-react';

const NavBar: React.FC = () => {
  return (
    <header className="border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="bg-babylon rounded-md w-8 h-8 flex items-center justify-center">
            <span className="font-bold text-white">B</span>
          </div>
          <h1 className="text-xl font-bold">BabylonGPT</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://doc.babylonjs.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Official Docs
          </a>
          <Separator orientation="vertical" className="h-6" />
          <a 
            href="https://github.com/BabylonJS/Babylon.js" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
