import React, { useState } from 'react';
import { 
  Search, Filter, MoreVertical, Eye, Edit, Trash2, 
  UserPlus, Download, Upload, CheckSquare, XSquare, 
  ChevronLeft, ChevronRight, Mail, Phone, Calendar, 
  Clock, Map, BookOpen, Terminal, Award, Activity, 
  AlertCircle, Shield, Zap, CheckCircle, RefreshCw,
  Sparkles, Target, Users
} from 'lucide-react';
import { useAdminStudents, AdminStudent } from '../../contexts/AdminStudentContext';

// --- SUB-COMPONENT: STUDENT PROFILE ---
const StudentProfile = ({ student, onBack }: { student: AdminStudent; onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'paths' | 'courses' | 'labs' | 'certificates' | 'logs'>('overview');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
          <ChevronLeft className="h-4 w-4" /> Back to Students
        </button>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
             <Mail className="h-4 w-4" /> Send Message
           </button>
           <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
             <Edit className="h-4 w-4" /> Edit Profile
           </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start">
         <img src={student.avatar} alt={student.name} className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-md" />
         <div className="flex-1">
            <div className="flex justify-between items-start">
               <div>
                  <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
                  <p className="text-slate-500">{student.role}</p>
               </div>
               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                  ${student.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                    student.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}
               `}>
                  {student.status}
               </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
               <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="h-4 w-4 text-slate-400" /> {student.email}
               </div>
               {student.phone && (
                 <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" /> {student.phone}
                 </div>
               )}
               <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-400" /> Joined {student.joinDate}
               </div>
               <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Activity className="h-4 w-4 text-slate-400" /> Last Active: {student.lastLogin}
               </div>
            </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6 overflow-x-auto">
         {[
           { id: 'overview', label: 'Overview' },
           { id: 'paths', label: 'Learning Paths' },
           { id: 'courses', label: 'Courses' },
           { id: 'labs', label: 'Labs' },
           { id: 'certificates', label: 'Certificates' },
           { id: 'logs', label: 'Activity Logs' },
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
           >
             {tab.label}
           </button>
         ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
         
         {/* TAB 1: OVERVIEW */}
         {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 space-y-6">
                  {/* Progress Summary */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                     <h3 className="font-bold text-slate-900 mb-4">Progress Summary</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-indigo-50 rounded-xl text-center">
                           <div className="text-2xl font-bold text-indigo-600">{student.totalLearningHours}h</div>
                           <div className="text-xs text-indigo-400 font-bold uppercase mt-1">Learning Time</div>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-xl text-center">
                           <div className="text-2xl font-bold text-emerald-600">{student.coursesCompleted}</div>
                           <div className="text-xs text-emerald-500 font-bold uppercase mt-1">Courses Done</div>
                        </div>
                        <div className="p-4 bg-cyan-50 rounded-xl text-center">
                           <div className="text-2xl font-bold text-cyan-600">{student.labsCompleted}</div>
                           <div className="text-xs text-cyan-500 font-bold uppercase mt-1">Labs Done</div>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-xl text-center">
                           <div className="text-2xl font-bold text-amber-600">{student.certificates.length}</div>
                           <div className="text-xs text-amber-500 font-bold uppercase mt-1">Certificates</div>
                        </div>
                     </div>
                  </div>

                  {/* AI Insights / Recommended Actions */}
                  <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                     <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-5 w-5 text-yellow-400" />
                        <h3 className="font-bold">AI Insights & Recommendations</h3>
                     </div>
                     <div className="space-y-3 relative z-10">
                        {student.progress < 20 ? (
                           <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg">
                              <AlertCircle className="h-5 w-5 text-orange-300 mt-0.5" />
                              <div>
                                 <p className="font-medium text-sm text-orange-100">Low Engagement Detected</p>
                                 <p className="text-xs text-slate-300 mt-1">Student hasn't made progress in 7 days. Consider sending a "Resume Learning" reminder.</p>
                                 <button className="mt-2 text-xs bg-white text-indigo-900 px-2 py-1 rounded font-bold hover:bg-indigo-50">Send Reminder</button>
                              </div>
                           </div>
                        ) : (
                           <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg">
                              <Zap className="h-5 w-5 text-yellow-300 mt-0.5" />
                              <div>
                                 <p className="font-medium text-sm text-yellow-100">High Performer</p>
                                 <p className="text-xs text-slate-300 mt-1">Student is in the top 10% for lab completion. Recommend the "Advanced Penetration Testing" certification track.</p>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  {/* Current Goal */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                     <h3 className="font-bold text-slate-900 mb-4">Current Goal</h3>
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                           <Target className="h-5 w-5" />
                        </div>
                        <div>
                           <div className="font-bold text-slate-800 text-sm">{student.role}</div>
                           <div className="text-xs text-slate-500">Learning Path</div>
                        </div>
                     </div>
                     <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                           <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-indigo-600">
                                 {student.progress}%
                              </span>
                           </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                           <div style={{ width: `${student.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* TAB 2: LEARNING PATHS */}
         {activeTab === 'paths' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                     <tr>
                        <th className="px-6 py-3">Path Name</th>
                        <th className="px-6 py-3">Progress</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Last Accessed</th>
                        <th className="px-6 py-3 text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {student.enrolledPaths.length > 0 ? (
                        student.enrolledPaths.map(path => (
                           <tr key={path.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4 font-medium text-slate-900">{path.title}</td>
                              <td className="px-6 py-4">
                                 <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: `${path.progress}%` }}></div>
                                 </div>
                                 <span className="text-xs text-slate-500 mt-1 block">{path.progress}%</span>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`px-2 py-1 rounded text-xs font-bold ${path.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {path.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-slate-500">{path.lastAccessed}</td>
                              <td className="px-6 py-4 text-right">
                                 <button className="text-indigo-600 hover:underline text-xs font-bold">View Details</button>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={5} className="text-center py-8 text-slate-500">No enrolled paths.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         )}

         {/* TAB 6: LOGS */}
         {activeTab === 'logs' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-6">Activity Audit Log</h3>
               <div className="relative pl-4 border-l border-slate-200 space-y-8">
                  {student.activityLogs.length > 0 ? (
                     student.activityLogs.map(log => (
                        <div key={log.id} className="relative pl-6">
                           <div className={`absolute -left-[21px] top-0 w-3 h-3 rounded-full border-2 border-white shadow-sm
                              ${log.type === 'success' ? 'bg-emerald-500' : log.type === 'warning' ? 'bg-amber-500' : log.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}
                           `}></div>
                           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                              <div>
                                 <span className="font-bold text-slate-800 text-sm">{log.action}</span>
                                 <p className="text-slate-500 text-xs mt-0.5">{log.details}</p>
                              </div>
                              <span className="text-xs text-slate-400 font-mono">{log.date}</span>
                           </div>
                        </div>
                     ))
                  ) : (
                     <p className="text-slate-500 text-sm pl-6">No recent activity logged.</p>
                  )}
               </div>
            </div>
         )}
         
         {/* Other tabs placeholder for brevity */}
         {(activeTab === 'courses' || activeTab === 'labs' || activeTab === 'certificates') && (
            <div className="text-center py-12 bg-white border border-dashed border-slate-200 rounded-xl">
               <p className="text-slate-500">Content for {activeTab} view would go here.</p>
            </div>
         )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: ADD STUDENT MODAL ---
const AddStudentModal = ({ onClose, onSave }: { onClose: () => void, onSave: (data: any) => void }) => {
   // Form state would go here
   return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
         <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
               <h3 className="font-bold text-slate-900">Add New Student</h3>
               <button onClick={onClose}><XSquare className="h-5 w-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <div className="p-6 space-y-4">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-indigo-500" placeholder="John Doe" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                  <input type="email" className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-indigo-500" placeholder="john@example.com" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Initial Password</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-indigo-500 bg-slate-50" value="Welcome123!" readOnly />
                  <p className="text-xs text-slate-500 mt-1">Default password. User will be prompted to change on first login.</p>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Assign Learning Path</label>
                  <select className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-indigo-500">
                     <option>Select a path...</option>
                     <option>Cloud Security Engineer</option>
                     <option>DevOps Master</option>
                  </select>
               </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
               <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors text-sm">Cancel</button>
               <button onClick={() => { onSave({}); onClose(); }} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors text-sm">Add Student</button>
            </div>
         </div>
      </div>
   )
};

// --- MAIN PAGE ---
const AdminStudents: React.FC = () => {
  const { students, deleteStudent } = useAdminStudents();
  const [view, setView] = useState<'list' | 'profile'>('list');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Filtering
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProfile = (id: string) => {
    setSelectedStudentId(id);
    setView('profile');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure? This will delete the student account.')) {
       deleteStudent(id);
    }
  };

  const handleBulkAction = (action: string) => {
    alert(`${action} applied to ${selectedRows.length} students.`);
    setSelectedRows([]);
  };

  const toggleRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelectedRows(prev => prev.length === filteredStudents.length ? [] : filteredStudents.map(s => s.id));
  };

  const exportCSV = () => {
    if (filteredStudents.length === 0) return;
    const headers = "Name,Email,Role,Status,Progress\n";
    const rows = filteredStudents.map(s => `${s.name},${s.email},${s.role},${s.status},${s.progress}%`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
  };

  if (view === 'profile' && selectedStudentId) {
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return <div>Student not found</div>;
    return <StudentProfile student={student} onBack={() => setView('list')} />;
  }

  return (
    <div className="space-y-6">
      {showAddModal && <AddStudentModal onClose={() => setShowAddModal(false)} onSave={() => alert('Student Added!')} />}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Students</h1>
           <p className="text-slate-500 mt-1">Manage learner accounts, enrollments, and progress.</p>
        </div>
        <div className="flex gap-3">
           <button onClick={exportCSV} className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors">
             <Download className="h-4 w-4" /> Export CSV
           </button>
           <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors">
             <Upload className="h-4 w-4" /> Import CSV
           </button>
           <button onClick={() => setShowAddModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95">
             <UserPlus className="h-4 w-4" /> Add Student
           </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
         </div>
         <div className="flex gap-3 w-full md:w-auto">
            <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 flex items-center gap-2 hover:bg-slate-50">
               <Filter className="h-4 w-4" /> Filters
            </button>
            <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 bg-white outline-none">
               <option>Status: All</option>
               <option>Active</option>
               <option>Inactive</option>
               <option>Suspended</option>
            </select>
         </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedRows.length > 0 && (
         <div className="bg-indigo-50 border border-indigo-100 px-4 py-3 rounded-xl flex items-center justify-between animate-fade-in">
            <span className="text-sm font-bold text-indigo-800">{selectedRows.length} students selected</span>
            <div className="flex gap-2">
               <button onClick={() => handleBulkAction('Activate')} className="text-xs bg-white text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded font-bold hover:bg-indigo-50">Activate</button>
               <button onClick={() => handleBulkAction('Suspend')} className="text-xs bg-white text-amber-600 border border-amber-200 px-3 py-1.5 rounded font-bold hover:bg-amber-50">Suspend</button>
               <button onClick={() => handleBulkAction('Delete')} className="text-xs bg-white text-red-600 border border-red-200 px-3 py-1.5 rounded font-bold hover:bg-red-50">Delete</button>
            </div>
         </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
                  <tr>
                     <th className="px-6 py-4 w-10">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 accent-indigo-600"
                          checked={selectedRows.length === filteredStudents.length && filteredStudents.length > 0}
                          onChange={toggleAll}
                        />
                     </th>
                     <th className="px-6 py-4 font-semibold">Student</th>
                     <th className="px-6 py-4 font-semibold">Goal / Role</th>
                     <th className="px-6 py-4 font-semibold">Progress</th>
                     <th className="px-6 py-4 font-semibold text-center">Stats</th>
                     <th className="px-6 py-4 font-semibold">Status</th>
                     <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length > 0 ? (
                     filteredStudents.map(student => (
                        <tr key={student.id} className={`hover:bg-slate-50 transition-colors ${selectedRows.includes(student.id) ? 'bg-indigo-50/30' : ''}`}>
                           <td className="px-6 py-4">
                              <input 
                                type="checkbox" 
                                className="rounded border-slate-300 accent-indigo-600"
                                checked={selectedRows.includes(student.id)}
                                onChange={() => toggleRow(student.id)}
                              />
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <img src={student.avatar} alt="" className="w-9 h-9 rounded-full bg-slate-200" />
                                 <div>
                                    <div className="font-bold text-slate-900">{student.name}</div>
                                    <div className="text-xs text-slate-500">{student.email}</div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium border border-slate-200">
                                 {student.role}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <div className="w-32">
                                 <div className="flex justify-between text-xs mb-1">
                                    <span className="font-bold text-slate-700">{student.progress}%</span>
                                 </div>
                                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: `${student.progress}%` }}></div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <div className="flex justify-center gap-3 text-xs text-slate-500">
                                 <div className="text-center" title="Courses Completed">
                                    <BookOpen className="h-4 w-4 mx-auto text-indigo-400 mb-0.5" />
                                    <span className="font-bold">{student.coursesCompleted}</span>
                                 </div>
                                 <div className="text-center" title="Labs Completed">
                                    <Terminal className="h-4 w-4 mx-auto text-emerald-400 mb-0.5" />
                                    <span className="font-bold">{student.labsCompleted}</span>
                                 </div>
                                 <div className="text-center" title="Certificates">
                                    <Award className="h-4 w-4 mx-auto text-yellow-400 mb-0.5" />
                                    <span className="font-bold">{student.certificates.length}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                                 ${student.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                                   student.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}
                              `}>
                                 {student.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                 <button onClick={() => handleViewProfile(student.id)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Profile">
                                    <Eye className="h-4 w-4" />
                                 </button>
                                 <button onClick={() => handleDelete(student.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                    <Trash2 className="h-4 w-4" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={7} className="text-center py-24 text-slate-500">
                           <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                 <Users className="h-8 w-8 text-slate-300" />
                              </div>
                              <h3 className="text-lg font-semibold text-slate-700">No students found</h3>
                              <p className="text-sm max-w-sm mx-auto">Get started by adding a new student manually or importing a CSV file.</p>
                              <div className="flex gap-2 mt-4">
                                 <button onClick={() => setShowAddModal(true)} className="text-indigo-600 font-bold hover:underline text-sm">Add Student</button>
                                 <span className="text-slate-300">|</span>
                                 <button className="text-indigo-600 font-bold hover:underline text-sm">Import CSV</button>
                              </div>
                           </div>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
         {/* Pagination Placeholder */}
         {filteredStudents.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-sm text-slate-500">
               <span>Showing 1-{filteredStudents.length} of {filteredStudents.length} students</span>
               <div className="flex gap-2">
                  <button className="px-3 py-1 border border-slate-300 bg-white rounded hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                  <button className="px-3 py-1 border border-slate-300 bg-white rounded hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default AdminStudents;