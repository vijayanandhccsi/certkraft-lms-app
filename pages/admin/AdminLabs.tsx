import React, { useState } from 'react';
import { 
  Terminal, Server, Play, StopCircle, Clock, 
  Settings, Users, Plus, AlertCircle 
} from 'lucide-react';

const AdminLabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'definitions' | 'sessions'>('definitions');

  // Mock Data
  const LABS = [
    { id: 1, name: 'AWS S3 Static Hosting', env: 'AWS', duration: '45 mins', difficulty: 'Beginner', status: 'Active' },
    { id: 2, name: 'Linux Permissions 101', env: 'Ubuntu 22.04', duration: '30 mins', difficulty: 'Beginner', status: 'Active' },
    { id: 3, name: 'Kubernetes Pod Deployment', env: 'K8s Cluster', duration: '60 mins', difficulty: 'Intermediate', status: 'Maintenance' },
    { id: 4, name: 'Metasploit Basics', env: 'Kali Linux', duration: '90 mins', difficulty: 'Advanced', status: 'Active' },
  ];

  const SESSIONS = [
    { id: 's1', user: 'alice@example.com', lab: 'Linux Permissions 101', start: '10:45 AM', duration: '22m', status: 'Running' },
    { id: 's2', user: 'bob@test.com', lab: 'AWS S3 Static Hosting', start: '10:55 AM', duration: '12m', status: 'Running' },
    { id: 's3', user: 'charlie@gmail.com', lab: 'Metasploit Basics', start: '10:00 AM', duration: '67m', status: 'Idle' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Labs & Sessions</h1>
           <p className="text-slate-500 mt-1">Manage virtual lab environments and monitor student sessions.</p>
        </div>
        {activeTab === 'definitions' && (
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm">
            <Plus className="h-4 w-4" /> New Lab Definition
          </button>
        )}
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('definitions')}
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'definitions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Terminal className="h-4 w-4" /> Lab Definitions
        </button>
        <button 
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'sessions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Users className="h-4 w-4" /> Active Sessions
        </button>
      </div>

      {activeTab === 'definitions' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
                <th className="px-6 py-4 font-semibold">Lab Name</th>
                <th className="px-6 py-4 font-semibold">Environment</th>
                <th className="px-6 py-4 font-semibold">Duration</th>
                <th className="px-6 py-4 font-semibold">Difficulty</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {LABS.map(lab => (
                <tr key={lab.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{lab.name}</td>
                  <td className="px-6 py-4 flex items-center gap-2 text-slate-600">
                    <Server className="h-4 w-4 text-slate-400" /> {lab.env}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{lab.duration}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs border
                      ${lab.difficulty === 'Beginner' ? 'bg-green-50 text-green-700 border-green-200' : 
                        lab.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        'bg-purple-50 text-purple-700 border-purple-200'}
                    `}>
                      {lab.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${lab.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                      <span className="text-slate-600">{lab.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Configure</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SESSIONS.map(session => (
            <div key={session.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
               {session.status === 'Running' && (
                 <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
               )}
               {session.status === 'Idle' && (
                 <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
               )}
               
               <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-slate-900 text-sm truncate pr-2">{session.lab}</h3>
                  <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide
                    ${session.status === 'Running' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
                  `}>
                    {session.status}
                  </div>
               </div>
               
               <div className="space-y-2 mb-4">
                 <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="h-4 w-4 text-slate-400" /> {session.user}
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4 text-slate-400" /> Started: {session.start} ({session.duration})
                 </div>
               </div>

               <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors">
                     <Terminal className="h-3 w-3" /> Connect
                  </button>
                  <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors">
                     <StopCircle className="h-3 w-3" /> Terminate
                  </button>
               </div>
            </div>
          ))}
          
          {/* Empty State if needed */}
          {SESSIONS.length === 0 && (
             <div className="col-span-3 text-center py-12 bg-white border border-dashed border-slate-200 rounded-xl">
               <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
               <p className="text-slate-500">No active lab sessions running.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminLabs;
