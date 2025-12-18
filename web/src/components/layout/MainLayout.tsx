import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface MainLayoutProps {
    children: React.ReactNode;
    currentView: string;
    onNavigate: (view: any) => void;
    onSettingsClick: () => void;
}

export default function MainLayout({ children, currentView, onNavigate, onSettingsClick }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar currentView={currentView} onNavigate={onNavigate} />

            <div className="flex-1 ml-64">
                <TopBar onSettingsClick={onSettingsClick} />

                <main className="mt-16 p-8 min-h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
