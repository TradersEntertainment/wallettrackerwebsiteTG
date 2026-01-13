import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface MainLayoutProps {
    children: React.ReactNode;
    currentView: string;
    onNavigate: (view: any) => void;
    onSettingsClick: () => void;
}

export default function MainLayout({ children, currentView, onNavigate, onSettingsClick }: MainLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar
                currentView={currentView}
                onNavigate={onNavigate}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 w-full md:ml-64 transition-all duration-300">
                <TopBar
                    onSettingsClick={onSettingsClick}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="mt-16 p-4 md:p-8 min-h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
