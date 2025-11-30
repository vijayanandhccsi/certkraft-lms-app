import React, { useState } from 'react';
import { 
  Settings, Users, Plug, Bell, Save, Globe, Lock, 
  Mail, CreditCard, Video, Shield, ToggleLeft, ToggleRight,
  Upload, Image
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'integrations' | 'notifications'>('general');
  const [isLoading, setIsLoading] = useState(false);

  // Mock State for settings
  const [settings, setSettings] = useState({
    siteName: 'CertKraft LMS',
    supportEmail: 'support@certkraft.com',
    maintenanceMode: false,
    registrationOpen: true,
    emailVerification: true,
    defaultRole: 'Student',
    geminiKey: '*************************',
    stripeKey: 'pk_test_****************',
    emailAlerts: {
      signup: true,
      completion: false,
      payment: true
    }
  });

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button onClick={onChange} className={`transition-colors ${checked ? 'text-indigo-600' : 'text-slate-400'}`}>
      {checked ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
           <p className="text-slate-500 mt-1">Configure platform-wide preferences and integrations.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-70"
        >
          {isLoading ? 'Saving...' : <><Save className="h-4 w-4" /> Save Changes</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-2 flex md:flex-col gap-1 overflow-x-auto">
           {[
             { id: 'general', label: 'General', icon: Globe },
             { id: 'users', label: 'Users & Auth', icon: Users },
             { id: 'integrations', label: 'Integrations', icon: Plug },
             { id: 'notifications', label: 'Notifications', icon: Bell },
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left
                 ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
               `}
             >
               <tab.icon className="h-4 w-4" />
               {tab.label}
             </button>
           ))}
        </div>

        <div className="flex-1 p-8 min-h-[500px]">
           
           {/* TAB: GENERAL */}
           {activeTab === 'general' && (
             <div className="space-y-8 max-w-2xl">
                <div>
                   <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Platform Identity</h3>
                   <div className="space-y-4">
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Site Name</label>
                         <input 
                           type="text" 
                           value={settings.siteName}
                           onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                           className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" 
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Support Email</label>
                         <input 
                           type="email" 
                           value={settings.supportEmail}
                           onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                           className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" 
                         />
                      </div>
                   </div>
                </div>

                <div>
                   <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Branding</h3>
                   <div className="flex items-center gap-6">
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Logo (Light)</label>
                         <div className="w-32 h-32 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-500 transition-colors">
                            <Upload className="h-8 w-8 mb-2" />
                            <span className="text-xs font-bold">Upload</span>
                         </div>
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Favicon</label>
                         <div className="w-16 h-16 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-500 transition-colors">
                            <Image className="h-6 w-6" />
                         </div>
                      </div>
                   </div>
                </div>

                <div>
                   <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">System Status</h3>
                   <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                         <span className="font-bold text-slate-800 block">Maintenance Mode</span>
                         <span className="text-xs text-slate-500">Disable access to student portal</span>
                      </div>
                      <Toggle 
                        checked={settings.maintenanceMode} 
                        onChange={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})} 
                      />
                   </div>
                </div>
             </div>
           )}

           {/* TAB: USERS */}
           {activeTab === 'users' && (
             <div className="space-y-8 max-w-2xl">
                <div>
                   <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Registration Rules</h3>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
                         <div>
                            <span className="font-bold text-slate-800 block">Public Registration</span>
                            <span className="text-xs text-slate-500">Allow anyone to create an account</span>
                         </div>
                         <Toggle 
                           checked={settings.registrationOpen} 
                           onChange={() => setSettings({...settings, registrationOpen: !settings.registrationOpen})} 
                         />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
                         <div>
                            <span className="font-bold text-slate-800 block">Require Email Verification</span>
                            <span className="text-xs text-slate-500">Users must verify email before login</span>
                         </div>
                         <Toggle 
                           checked={settings.emailVerification} 
                           onChange={() => setSettings({...settings, emailVerification: !settings.emailVerification})} 
                         />
                      </div>
                   </div>
                </div>

                <div>
                   <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Defaults</h3>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Default User Role</label>
                      <select 
                        value={settings.defaultRole}
                        onChange={(e) => setSettings({...settings, defaultRole: e.target.value})}
                        className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                         <option>Student</option>
                         <option>Guest</option>
                         <option>Pending Approval</option>
                      </select>
                   </div>
                </div>
             </div>
           )}

           {/* TAB: INTEGRATIONS */}
           {activeTab === 'integrations' && (
             <div className="space-y-8 max-w-2xl">
                <div>
                   <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-indigo-500" /> AI & Content
                   </h3>
                   <div className="space-y-4">
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Gemini API Key</label>
                         <div className="relative">
                            <input 
                              type="password" 
                              value={settings.geminiKey}
                              readOnly
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-500 font-mono outline-none" 
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 text-xs font-bold hover:underline">Change</button>
                         </div>
                         <p className="text-xs text-slate-500 mt-1">Used for AI Tutor and Content Generation.</p>
                      </div>
                   </div>
                </div>

                <div>
                   <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-emerald-500" /> Payments
                   </h3>
                   <div className="space-y-4">
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Stripe Publishable Key</label>
                         <input 
                           type="text" 
                           value={settings.stripeKey}
                           onChange={(e) => setSettings({...settings, stripeKey: e.target.value})}
                           className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 font-mono outline-none focus:ring-2 focus:ring-indigo-500" 
                         />
                      </div>
                   </div>
                </div>

                <div>
                   <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <Video className="h-5 w-5 text-red-500" /> Video Hosting
                   </h3>
                   <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-600 border border-slate-200">
                      Video integration (YouTube/Vimeo) is currently managed via the Media Library.
                   </div>
                </div>
             </div>
           )}

           {/* TAB: NOTIFICATIONS */}
           {activeTab === 'notifications' && (
             <div className="space-y-8 max-w-2xl">
                <div>
                   <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Email Alerts</h3>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
                         <div>
                            <span className="font-bold text-slate-800 block">New Student Signup</span>
                            <span className="text-xs text-slate-500">Receive email when a user registers</span>
                         </div>
                         <Toggle 
                           checked={settings.emailAlerts.signup} 
                           onChange={() => setSettings({...settings, emailAlerts: {...settings.emailAlerts, signup: !settings.emailAlerts.signup}})} 
                         />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
                         <div>
                            <span className="font-bold text-slate-800 block">Course Completion</span>
                            <span className="text-xs text-slate-500">Receive email when student finishes a course</span>
                         </div>
                         <Toggle 
                           checked={settings.emailAlerts.completion} 
                           onChange={() => setSettings({...settings, emailAlerts: {...settings.emailAlerts, completion: !settings.emailAlerts.completion}})} 
                         />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
                         <div>
                            <span className="font-bold text-slate-800 block">Payment Success</span>
                            <span className="text-xs text-slate-500">Receive email on successful transaction</span>
                         </div>
                         <Toggle 
                           checked={settings.emailAlerts.payment} 
                           onChange={() => setSettings({...settings, emailAlerts: {...settings.emailAlerts, payment: !settings.emailAlerts.payment}})} 
                         />
                      </div>
                   </div>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default AdminSettings;