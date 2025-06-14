import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Link, Bell, SunMoon } from 'lucide-react';

const SettingsTab = ({ icon, title, children }) => (
    <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
        <div className="text-slate-400">
            {children}
        </div>
    </div>
);

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <div className="glassy-card rounded-xl">
                 <Tabs defaultValue="profile" className="flex flex-col md:flex-row">
                    <TabsList className="flex-col items-start justify-start p-4 bg-transparent border-r border-slate-700 h-auto">
                        <TabsTrigger value="profile" className="w-full justify-start gap-2"><User className="w-4 h-4"/> Profile</TabsTrigger>
                        <TabsTrigger value="connections" className="w-full justify-start gap-2"><Link className="w-4 h-4"/> Broker Connections</TabsTrigger>
                        <TabsTrigger value="notifications" className="w-full justify-start gap-2"><Bell className="w-4 h-4"/> Notifications</TabsTrigger>
                        <TabsTrigger value="theme" className="w-full justify-start gap-2"><SunMoon className="w-4 h-4"/> Theme</TabsTrigger>
                    </TabsList>
                    <div className="flex-grow">
                        <TabsContent value="profile">
                            <SettingsTab icon={User} title="Profile">
                                <p>User profile settings will be available here.</p>
                            </SettingsTab>
                        </TabsContent>
                        <TabsContent value="connections">
                            <SettingsTab icon={Link} title="Broker Connections">
                                <p>Connect to your brokerage accounts here.</p>
                            </SettingsTab>
                        </TabsContent>
                        <TabsContent value="notifications">
                             <SettingsTab icon={Bell} title="Notifications">
                                <p>Manage your email, push, and SMS notifications here.</p>
                            </SettingsTab>
                        </TabsContent>
                        <TabsContent value="theme">
                             <SettingsTab icon={SunMoon} title="Theme">
                                <p>Theme selection (Dark/Light) will be available here.</p>
                            </SettingsTab>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}