import React, { useState, useMemo } from 'react';
import { 
  Filter, X, Search, ChevronDown, ChevronUp, Check
} from 'lucide-react';
import { useLearningPaths } from '../contexts/LearningPathContext';

const FilterSection = ({ title, items, selected, onChange }: { title: string, items: string[], selected: string[], onChange: (item: string) => void }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
      <button 
        className="flex items-center justify-between w-full mb-4 text-sm font-bold text-slate-800 uppercase tracking-wider hover:text-indigo-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>
      
      {isOpen && (
        <div className="space-y-2">
          {items.map(item => {
            const isSelected = selected.includes(item);
            return (
              <label 
                key={item} 
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all duration-200 group
                  ${isSelected 
                    ? 'bg-indigo-50 border border-indigo-100 shadow-sm' 
                    : 'hover:bg-slate-50 border border-transparent'}
                `}
              >
                <div className={`
                  w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0
                  ${isSelected 
                    ? 'bg-indigo-600 border-indigo-600' 
                    : 'bg-white border-slate-300 group-hover:border-indigo-400'}
                `}>
                  {isSelected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                  {/* Hidden Checkbox for a11y */}
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={isSelected}
                    onChange={() => onChange(item)}
                  />
                </div>
                <span className={`text-sm ${isSelected ? 'font-bold text-indigo-700' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  {item}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

const LearningPaths: React.FC = () => {
  const { paths } = useLearningPaths();
  
  // FILTER: Only show Published paths to the public, and Sort by 'order'
  const publishedPaths = useMemo(() => {
    return paths
      .filter(p => p.status === 'Published')
      .sort((a, b) => a.order - b.order);
  }, [paths]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Derive unique lists dynamically from the PUBLISHED paths
  const rolesList = useMemo(() => Array.from(new Set(publishedPaths.flatMap(p => p.roles))).sort(), [publishedPaths]);
  const skillsList = useMemo(() => Array.from(new Set(publishedPaths.flatMap(p => p.skills))).sort(), [publishedPaths]);
  const techList = useMemo(() => Array.from(new Set(publishedPaths.flatMap(p => p.technologies))).sort(), [publishedPaths]);

  // Toggle selection helper
  const toggleSelection = (item: string, current: string[], setter: (val: string[]) => void) => {
    if (current.includes(item)) {
      setter(current.filter(i => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const clearFilters = () => {
    setSelectedRoles([]);
    setSelectedSkills([]);
    setSelectedTech([]);
    setSearchQuery('');
  };

  const filteredPaths = useMemo(() => {
    return publishedPaths.filter(path => {
      const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            path.desc.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = selectedRoles.length === 0 || path.roles.some(r => selectedRoles.includes(r));
      const matchesSkill = selectedSkills.length === 0 || path.skills.some(s => selectedSkills.includes(s));
      const matchesTech = selectedTech.length === 0 || path.technologies.some(t => selectedTech.includes(t));

      return matchesSearch && matchesRole && matchesSkill && matchesTech;
    });
  }, [publishedPaths, searchQuery, selectedRoles, selectedSkills, selectedTech]);

  const hasActiveFilters = selectedRoles.length > 0 || selectedSkills.length > 0 || selectedTech.length > 0 || searchQuery.length > 0;

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="bg-slate-900 text-white pt-20 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80 z-10"></div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Learning Paths</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl leading-relaxed mb-8">
            Curated roadmaps designed to take you from beginner to expert in specific roles and technologies.
          </p>

          {/* New Prominent Search Bar */}
          <div className="max-w-xl relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition-all backdrop-blur-sm shadow-xl"
              placeholder="Search paths by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl shadow-md font-semibold text-slate-700"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </div>
            {isMobileFilterOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {/* Sidebar Filters */}
          <div className={`
            lg:w-1/4 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-fit sticky top-24
            ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}
          `}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </h3>
              {hasActiveFilters && (
                 <span className="text-xs text-slate-400">{filteredPaths.length} results</span>
              )}
            </div>

            {/* Prominent Clear All Button */}
            {hasActiveFilters && (
              <button 
                onClick={clearFilters}
                className="w-full mb-8 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all text-sm shadow-md hover:shadow-lg transform active:scale-95"
              >
                <X className="h-4 w-4" /> Clear All Filters
              </button>
            )}

            <div className="space-y-8">
              {/* Role Filter */}
              <FilterSection 
                title="By Role" 
                items={rolesList} 
                selected={selectedRoles} 
                onChange={(item) => toggleSelection(item, selectedRoles, setSelectedRoles)} 
              />
              
              {/* Skills Filter */}
              <FilterSection 
                title="By Skills" 
                items={skillsList} 
                selected={selectedSkills} 
                onChange={(item) => toggleSelection(item, selectedSkills, setSelectedSkills)} 
              />

              {/* Technology Filter */}
              <FilterSection 
                title="By Technology" 
                items={techList} 
                selected={selectedTech} 
                onChange={(item) => toggleSelection(item, selectedTech, setSelectedTech)} 
              />
            </div>
          </div>

          {/* Grid Content */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <span className="text-slate-500 font-medium text-sm">
                Showing {filteredPaths.length} result{filteredPaths.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filteredPaths.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPaths.map((path) => (
                  <div 
                    key={path.id} 
                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 group flex flex-col h-full"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className={`p-3 rounded-xl ${path.bg} ${path.color} group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
                        <path.icon className="h-7 w-7" />
                      </div>
                      <div className="flex gap-2">
                        {path.roles.slice(0, 1).map(role => (
                          <span key={role} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {path.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                      {path.desc}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {path.technologies.slice(0, 3).map(tech => (
                        <span key={tech} className="text-xs px-2 py-1 bg-slate-50 text-slate-600 rounded-md border border-slate-100">
                          {tech}
                        </span>
                      ))}
                      {path.technologies.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-slate-50 text-slate-400 rounded-md">
                          +{path.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-end">
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow-indigo-500/30 active:scale-95">
                        Enroll Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No learning paths found</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                  We couldn't find any paths matching your current filters. Try adjusting your search or clearing filters.
                </p>
                <button 
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
                >
                  <X className="h-4 w-4" /> Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPaths;