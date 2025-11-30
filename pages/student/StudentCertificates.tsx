
import React, { useState } from 'react';
import { 
  Award, Download, Share2, Search, Filter, Lock, 
  CheckCircle, ExternalLink, Linkedin, FileText, Printer, Eye,
  Facebook, Instagram, Copy, X, Check, Globe, Link as LinkIcon
} from 'lucide-react';
import { useStudent, Certificate, Badge } from '../../contexts/StudentContext';

// --- SHARE MODAL COMPONENT ---
interface ShareModalProps {
  item: Certificate | Badge | null;
  type: 'Certificate' | 'Badge';
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ item, type, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  // Mock URLs
  const validationId = 'validationId' in item ? item.validationId : `BADGE-${item.id}`;
  const publicLink = `https://certkraft.com/verify/${validationId}`;
  const title = 'title' in item ? item.title : item.name;
  const issueDate = 'issueDate' in item ? item.issueDate : item.earnedDate;
  
  // LinkedIn Add to Profile URL (Only for Certificates)
  const getLinkedInAddUrl = () => {
    if (type !== 'Certificate') return '#';
    const cert = item as Certificate;
    const base = "https://www.linkedin.com/profile/add";
    const params = new URLSearchParams({
      startTask: "CERTIFICATION_NAME",
      name: cert.title,
      organizationName: "CertKraft",
      issueYear: "2025", // Mock year based on issueDate
      issueMonth: "1",
      certId: cert.validationId,
      certUrl: publicLink
    });
    return `${base}?${params.toString()}`;
  };

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicLink)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicLink)}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    alert("Downloading high-res PNG for Instagram...");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 border-b border-slate-100 text-center">
          <h3 className="text-xl font-bold text-slate-900">Share Achievement</h3>
          <p className="text-slate-500 text-sm mt-1">Showcase your success to the world.</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Preview Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center gap-4">
             {type === 'Certificate' ? (
                <div className="w-16 h-12 bg-white border border-slate-200 rounded shadow-sm flex items-center justify-center text-slate-300">
                   <Award className="h-6 w-6" />
                </div>
             ) : (
                <div className={`w-12 h-12 rounded-full ${(item as Badge).color} flex items-center justify-center text-xl`}>
                   {(item as Badge).icon}
                </div>
             )}
             <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 truncate">{title}</div>
                <div className="text-xs text-slate-500">Issued: {issueDate}</div>
             </div>
          </div>

          {/* LinkedIn Official Add */}
          {type === 'Certificate' && (
            <a 
              href={getLinkedInAddUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#0a66c2] hover:bg-[#004182] text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-blue-900/20"
            >
              <Linkedin className="h-5 w-5" /> Add to LinkedIn Profile
            </a>
          )}

          {/* Social Grid */}
          <div>
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Share Post</label>
             <div className="grid grid-cols-2 gap-3">
                <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 hover:border-[#0a66c2] hover:text-[#0a66c2] rounded-xl transition-all font-medium text-slate-600 text-sm">
                   <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 hover:border-[#1877f2] hover:text-[#1877f2] rounded-xl transition-all font-medium text-slate-600 text-sm">
                   <Facebook className="h-4 w-4" /> Facebook
                </a>
             </div>
          </div>

          {/* Instagram / Download */}
          <div>
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Instagram (Story/Feed)</label>
             <button 
               onClick={handleDownloadImage}
               className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl hover:shadow-md transition-all group"
             >
                <div className="flex items-center gap-3">
                   <div className="bg-white p-1.5 rounded-full shadow-sm text-pink-600">
                      <Instagram className="h-4 w-4" />
                   </div>
                   <span className="text-sm font-medium text-slate-700">Download Image</span>
                </div>
                <Download className="h-4 w-4 text-slate-400 group-hover:text-purple-600" />
             </button>
          </div>

          {/* Copy Link */}
          <div className="relative">
             <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <div className="flex-1 px-3 text-xs text-slate-500 truncate font-mono">
                   {publicLink}
                </div>
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700 shadow-sm hover:bg-slate-50'}`}
                >
                   {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                   {copied ? 'Copied' : 'Copy'}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const StudentCertificates: React.FC = () => {
  const { certificates, earnedBadges, upcomingBadges } = useStudent();
  const [filterType, setFilterType] = useState<'All' | 'Course' | 'Learning Path'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [badgeSearchQuery, setBadgeSearchQuery] = useState('');
  
  // Privacy State: 'Private' | 'Link-Only' | 'Public'
  const [privacy, setPrivacy] = useState<'Private' | 'Link-Only' | 'Public'>('Private');
  
  // Modal State
  const [shareItem, setShareItem] = useState<Certificate | Badge | null>(null);
  const [shareType, setShareType] = useState<'Certificate' | 'Badge'>('Certificate');
  const [isShareOpen, setIsShareOpen] = useState(false);

  const filteredCertificates = certificates.filter(cert => {
    const matchesType = filterType === 'All' || cert.type === filterType;
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const filteredBadges = earnedBadges.filter(badge => {
    const query = badgeSearchQuery.toLowerCase();
    return badge.name.toLowerCase().includes(query) || 
           badge.description.toLowerCase().includes(query);
  });

  const openShare = (item: Certificate | Badge, type: 'Certificate' | 'Badge') => {
    setShareItem(item);
    setShareType(type);
    setIsShareOpen(true);
  };

  return (
    <div className="space-y-12 relative">
      
      <ShareModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        item={shareItem} 
        type={shareType} 
      />

      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            Certificates & Badges <Award className="h-8 w-8 text-yellow-500" />
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Your professional portfolio of achievements.</p>
          
          <div className="flex flex-col gap-3 mt-6">
             <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
               Profile Visibility
             </div>
             <div className="flex flex-wrap items-center gap-4">
                <div className="bg-slate-100 rounded-lg p-1 flex items-center">
                    <button 
                      onClick={() => setPrivacy('Private')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${privacy === 'Private' ? 'bg-white shadow text-slate-700' : 'text-slate-500 hover:text-slate-600'}`}
                    >
                      <Lock className="h-3 w-3" /> Private
                    </button>
                    <button 
                      onClick={() => setPrivacy('Link-Only')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${privacy === 'Link-Only' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-600'}`}
                    >
                      <LinkIcon className="h-3 w-3" /> Link Only
                    </button>
                    <button 
                      onClick={() => setPrivacy('Public')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${privacy === 'Public' ? 'bg-white shadow text-emerald-600' : 'text-slate-500 hover:text-slate-600'}`}
                    >
                      <Globe className="h-3 w-3" /> Public
                    </button>
                </div>
                
                {privacy !== 'Private' && (
                    <div 
                      className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-colors animate-fade-in" 
                      onClick={() => {
                        navigator.clipboard.writeText('certkraft.com/profile/vijaykumar');
                        alert('Profile link copied!');
                      }}
                      title="Click to copy link"
                    >
                       <ExternalLink className="h-3 w-3" /> certkraft.com/profile/vijaykumar
                    </div>
                )}
             </div>
             <p className="text-xs text-slate-400 mt-1">
                {privacy === 'Private' && 'Only you can see your achievements.'}
                {privacy === 'Link-Only' && 'Anyone with the link can view your achievements.'}
                {privacy === 'Public' && 'Your achievements are visible on your public profile and search engines.'}
             </p>
          </div>
        </div>

        <div className="flex gap-3">
           <button 
             onClick={() => window.open('#', '_blank')}
             disabled={privacy === 'Private'}
             className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
           >
              <Eye className="h-4 w-4" /> View Public Profile
           </button>
           <button 
             onClick={() => alert('Generating PDF Portfolio...')}
             className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-lg"
           >
              <Download className="h-4 w-4" /> Download Portfolio
           </button>
        </div>
      </div>

      {/* 2. CERTIFICATES SECTION */}
      <div>
         <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-900">Your Certificates</h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search certificates..." 
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <div className="flex bg-slate-100 p-1 rounded-lg">
                  {['All', 'Course', 'Learning Path'].map((type) => (
                     <button
                       key={type}
                       onClick={() => setFilterType(type as any)}
                       className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterType === type ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        {type}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {filteredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredCertificates.map((cert) => (
                  <div key={cert.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full">
                     {/* Certificate Preview Top */}
                     <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100 group-hover:border-indigo-100 transition-colors">
                        {cert.thumbnail ? (
                           <img src={cert.thumbnail} alt="" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                           <Award className="h-16 w-16 text-slate-300" />
                        )}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm border border-slate-100">
                           {cert.type}
                        </div>
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                           <button className="bg-white text-slate-900 p-3 rounded-full hover:scale-110 transition-transform shadow-lg" title="View Full">
                              <Eye className="h-5 w-5" />
                           </button>
                           <button className="bg-white text-slate-900 p-3 rounded-full hover:scale-110 transition-transform shadow-lg" title="Download PDF">
                              <Download className="h-5 w-5" />
                           </button>
                        </div>
                     </div>

                     {/* Content */}
                     <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-2 leading-snug">{cert.title}</h3>
                        <p className="text-xs text-slate-500 mb-4">Issued {cert.issueDate} • ID: {cert.validationId}</p>
                        
                        {cert.instructor && (
                           <div className="flex items-center gap-2 mb-6 mt-auto">
                              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                                 {cert.instructor.charAt(0)}
                              </div>
                              <span className="text-sm text-slate-600">{cert.instructor}</span>
                           </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                           <button 
                             onClick={() => openShare(cert, 'Certificate')}
                             className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                           >
                              <Share2 className="h-3.5 w-3.5" /> Share
                           </button>
                           <button className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
                              <Printer className="h-3.5 w-3.5" /> Print
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl">
               <Award className="h-12 w-12 text-slate-300 mx-auto mb-4" />
               <h3 className="text-lg font-bold text-slate-900 mb-2">No certificates found</h3>
               <p className="text-slate-500 mb-6">Complete courses to earn recognized certificates.</p>
               <button className="text-indigo-600 font-bold hover:underline">Browse Courses</button>
            </div>
         )}
      </div>

      {/* 3. BADGES & GOALS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-slate-200 pt-8">
         
         {/* BADGES COLLECTION */}
         <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                   Your Badges <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{filteredBadges.length}</span>
                </h2>
                <div className="relative w-full sm:w-48">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                   <input 
                     type="text" 
                     placeholder="Filter badges..." 
                     className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                     value={badgeSearchQuery}
                     onChange={(e) => setBadgeSearchQuery(e.target.value)}
                   />
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
               {filteredBadges.length > 0 ? filteredBadges.map((badge) => (
                  <div key={badge.id} className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center text-center hover:shadow-lg transition-all group relative">
                     <div className={`w-16 h-16 rounded-full ${badge.color} flex items-center justify-center text-2xl mb-3 shadow-inner group-hover:scale-110 transition-transform`}>
                        {badge.icon}
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">{badge.name}</h4>
                     <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide mb-2">{badge.type}</p>
                     
                     <button 
                       onClick={() => openShare(badge, 'Badge')}
                       className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                       title="Share Badge"
                     >
                       <Share2 className="h-3.5 w-3.5" />
                     </button>
                  </div>
               )) : (
                  <div className="col-span-full text-center py-8 text-slate-500 text-sm">
                     No badges match your search.
                  </div>
               )}
               {/* Empty Slots - Hide when searching */}
               {!badgeSearchQuery && [1, 2, 3].map((i) => (
                  <div key={i} className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 opacity-50">
                     <div className="w-12 h-12 rounded-full bg-slate-50 mb-2"></div>
                     <div className="h-3 w-16 bg-slate-100 rounded mb-1"></div>
                     <div className="h-2 w-10 bg-slate-100 rounded"></div>
                  </div>
               ))}
            </div>
         </div>

         {/* UPCOMING GOALS */}
         <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Upcoming Goals</h2>
            <div className="space-y-4">
               {upcomingBadges.map((goal) => (
                  <div key={goal.id} className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/30 transition-colors"></div>
                     
                     <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-xl backdrop-blur-sm border border-white/10">
                           {goal.icon}
                        </div>
                        <div>
                           <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Next Badge</div>
                           <h4 className="font-bold">{goal.name}</h4>
                        </div>
                     </div>

                     <div className="space-y-3 relative z-10">
                        <div className="flex justify-between text-xs font-medium">
                           <span className="text-indigo-200">Progress</span>
                           <span className="text-white">{goal.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                           <div className="h-full bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-1 pt-1">
                           {goal.tasksRemaining.map((task, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                 <div className="w-1 h-1 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                 {task}
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               ))}
            </div>
         </div>

      </div>

    </div>
  );
};

export default StudentCertificates;
