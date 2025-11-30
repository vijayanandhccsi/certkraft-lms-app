import React, { useEffect, useState } from 'react';
import { 
  Users, BookOpen, DollarSign, TrendingUp, MoreVertical 
} from 'lucide-react';
import api from '../../services/apiClient';

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl shadow-md ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
    <div className="flex items-center text-sm">
      <span className="text-emerald-500 font-semibold flex items-center gap-1">
        <TrendingUp className="h-3 w-3" /> {change}
      </span>
      <span className="text-slate-400 ml-2">vs last month</span>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'Checking' | 'Connected' | 'Mock Mode'>('Checking');

  useEffect(() => {
    const checkHealth = async () => {
        try {
            await api.get('/health', { timeout: 2000 });
            setApiStatus('Connected');
        } catch (e) {
            setApiStatus('Mock Mode');
        }
    };
    checkHealth();
  }, []);

  const recentSignups = [
    { name: 'Alice Johnson', email: 'alice@example.com', path: 'Cyber Security', date: '2 mins ago', status: 'Active' },
    { name: 'Robert Smith', email: 'rob.smith@test.com', path: 'Cloud Computing', date: '15 mins ago', status: 'Pending' },
    { name: 'Karen Davis', email: 'karen.d@gmail.com', path: 'DevOps', date: '1 hour ago', status: 'Active' },
    { name: 'Mike Wilson', email: 'mike.w@yahoo.com', path: 'Gen AI', date: '3 hours ago', status: 'Active' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value="12,453" 
          change="+12.5%" 
          icon={Users} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Active Learning Paths" 
          value="15" 
          change="+2" 
          icon={BookOpen} 
          color="bg-cyan-500" 
        />
        <StatCard 
          title="Revenue (Monthly)" 
          value="$45,231" 
          change="+8.2%" 
          icon={DollarSign} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Completion Rate" 
          value="78%" 
          change="+3.1%" 
          icon={TrendingUp} 
          color="bg-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Student Enrollments</h3>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Student</th>
                  <th className="px-6 py-4 font-semibold">Learning Path</th>
                  <th className="px-6 py-4 font-semibold">Joined</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSignups.map((user, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 text-sm">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700 font-medium">{user.path}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{user.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
                      `}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / System Status */}
        <div className="space-y-6">
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">System Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                   <span className="flex items-center gap-2 text-slate-600">
                     <span className={`h-2 w-2 rounded-full ${apiStatus === 'Connected' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span> Backend API
                   </span>
                   <span className={`${apiStatus === 'Connected' ? 'text-emerald-600' : 'text-amber-600'} font-medium`}>{apiStatus}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="flex items-center gap-2 text-slate-600">
                     <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Gemini AI
                   </span>
                   <span className="text-emerald-600 font-medium">Connected</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="flex items-center gap-2 text-slate-600">
                     <span className={`h-2 w-2 rounded-full ${apiStatus === 'Connected' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span> Database
                   </span>
                   <span className={`${apiStatus === 'Connected' ? 'text-emerald-600' : 'text-amber-600'} font-medium`}>
                      {apiStatus === 'Connected' ? 'PostgreSQL' : 'LocalStorage'}
                   </span>
                </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-lg p-6 text-white">
             <h3 className="font-bold text-lg mb-2">Deploy Update</h3>
             <p className="text-indigo-200 text-sm mb-6">
               New labs for "Cloud Security" are ready to be published.
             </p>
             <button className="w-full bg-white text-indigo-600 font-bold py-2 rounded-lg text-sm hover:bg-indigo-50 transition-colors">
               Review & Publish
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;