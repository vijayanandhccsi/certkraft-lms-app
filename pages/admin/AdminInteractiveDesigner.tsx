import React, { useState, useRef, useEffect } from 'react';
import { 
  Layout, Type, Image as ImageIcon, Video, CheckSquare, 
  MoreVertical, Plus, Trash2, Save, Eye, Globe, 
  ArrowUp, ArrowDown, ChevronLeft, Search, Code,
  Settings, Copy, X, List, Layers, MousePointer, AppWindow,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Upload, Move, FileText as FileIcon,
  PieChart, Gamepad2, GraduationCap, ClipboardList, Film, Share2, BookOpen, Grid, ChevronDown, ChevronRight,
  Palette, MousePointer2, Box, Star, Link as LinkIcon, Square, LayoutTemplate,
  Undo, Redo, Smartphone, Monitor, ZoomIn, ZoomOut, Maximize, RectangleHorizontal
} from 'lucide-react';

// --- TYPES ---

type BlockType = 'heading' | 'text' | 'image' | 'video' | 'mcq' | 'process' | 'flashcard' | 'hotspot' | 'list' | 'code' | 'button' | 'icon' | 'embed' | 'banner';

interface BlockConfig {
  [key: string]: any;
}

interface Block {
  id: string;
  type: BlockType;
  content: BlockConfig;
}

interface InteractivePage {
  id: string;
  title: string;
  slug: string;
  status: 'Draft' | 'Published';
  lastEdited: string;
  backgroundColor: string;
  blocks: Block[];
}

// --- TEMPLATE SYSTEM TYPES & DATA ---

interface TemplateBlueprint {
  type: BlockType;
  content: BlockConfig;
}

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string; // Placeholder color or icon for now
  blueprint: TemplateBlueprint[];
}

const TEMPLATE_GALLERY: Template[] = [
  // --- INTRO CATEGORY ---
  {
    id: 'intro_unleash',
    name: 'Unleash Potential',
    category: 'Intro',
    thumbnail: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    blueprint: [
      { type: 'heading', content: { text: 'Unleash Your Potential', level: 'h1', align: 'center' } },
      { type: 'text', content: { text: 'Discover the power of interactive learning with our comprehensive suite of tools designed to engage and inspire.', align: 'center' } },
      { type: 'button', content: { text: 'Get Started', url: '#', align: 'center', style: 'solid' } }
    ]
  },
  {
    id: 'intro_hero_img',
    name: 'Hero with Image',
    category: 'Intro',
    thumbnail: 'bg-slate-800',
    blueprint: [
      { type: 'heading', content: { text: 'Welcome Aboard', level: 'h1', align: 'left' } },
      { type: 'text', content: { text: 'We are excited to have you here. Lets start by setting up your profile.', align: 'left' } },
      { type: 'image', content: { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', altText: 'Team working', width: 800, height: 400 } }
    ]
  },
  // --- COLUMNS CATEGORY ---
  {
    id: 'col_3_benefits',
    name: '3 Key Benefits',
    category: 'Columns',
    thumbnail: 'bg-emerald-100',
    blueprint: [
      { type: 'heading', content: { text: 'Why Choose Us?', level: 'h2', align: 'center' } },
      { type: 'text', content: { text: '<b>1. Speed</b><br>Lightning fast performance.', align: 'center' } },
      { type: 'text', content: { text: '<b>2. Security</b><br>Enterprise grade protection.', align: 'center' } },
      { type: 'text', content: { text: '<b>3. Support</b><br>24/7 Expert assistance.', align: 'center' } }
    ]
  },
  {
    id: 'col_features',
    name: 'Feature Grid',
    category: 'Columns',
    thumbnail: 'bg-blue-100',
    blueprint: [
      { type: 'heading', content: { text: 'Core Features', level: 'h2', align: 'left' } },
      { type: 'image', content: { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80', width: 300, height: 200 } },
      { type: 'text', content: { text: 'Real-time Analytics', align: 'left' } },
      { type: 'image', content: { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80', width: 300, height: 200 } },
      { type: 'text', content: { text: 'Data Visualization', align: 'left' } }
    ]
  },
  // --- CONTENT CATEGORY ---
  {
    id: 'content_article',
    name: 'Article Layout',
    category: 'Content',
    thumbnail: 'bg-slate-100',
    blueprint: [
      { type: 'heading', content: { text: 'The Future of EdTech', level: 'h2', align: 'left' } },
      { type: 'text', content: { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', align: 'left' } },
      { type: 'list', content: { style: 'bullet', items: ['Personalized Learning', 'AI Tutors', 'Gamification'] } },
      { type: 'text', content: { text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', align: 'left' } }
    ]
  },
  // --- CONTACT CATEGORY ---
  {
    id: 'contact_simple',
    name: 'Contact Section',
    category: 'Contact',
    thumbnail: 'bg-indigo-50',
    blueprint: [
      { type: 'heading', content: { text: 'Get in Touch', level: 'h2', align: 'center' } },
      { type: 'text', content: { text: 'Have questions? We are here to help.', align: 'center' } },
      { type: 'button', content: { text: 'Email Support', url: 'mailto:support@example.com', align: 'center', style: 'outline' } }
    ]
  }
];

const TEMPLATE_CATS = ['All', 'Intro', 'Columns', 'Content', 'Images', 'Text', 'Contact'];

// --- MOCK DATA ---

const MOCK_PAGES: InteractivePage[] = [
  {
    id: 'page_1',
    title: 'DNS Troubleshooting Scenario',
    slug: 'dns-troubleshooting',
    status: 'Published',
    lastEdited: 'Oct 24, 2023',
    backgroundColor: '#ffffff',
    blocks: [
      { id: 'b1', type: 'heading', content: { text: 'Diagnosing DNS Issues', level: 'h1', align: 'center' } },
      { id: 'b2', type: 'text', content: { text: 'In this scenario, users are reporting they cannot access the internal CRM. You need to identify the root cause.', align: 'left' } },
      { 
        id: 'b3', 
        type: 'mcq', 
        content: { 
          question: 'What command would you run first to check connectivity?',
          options: [
            { id: 'opt1', text: 'ping crm.internal' },
            { id: 'opt2', text: 'reboot server' },
            { id: 'opt3', text: 'systemctl restart network' }
          ],
          correctOptionId: 'opt1',
          feedback: 'Correct! Ping is the best first step to verify basic connectivity.' 
        } 
      },
      {
        id: 'b4',
        type: 'mcq',
        content: {
          question: 'Which cloud provider offers the most extensive global infrastructure?',
          options: [
            { id: 'opt_aws', text: 'AWS' },
            { id: 'opt_azure', text: 'Azure' },
            { id: 'opt_gcp', text: 'GCP' }
          ],
          correctOptionId: 'opt_aws',
          feedback: 'AWS has the largest number of regions and availability zones.'
        }
      }
    ]
  }
];

// --- RICH TEXT COMPONENTS ---

const ToolbarButton = ({ icon: Icon, active, onClick }: { icon: any, active?: boolean, onClick: (e: React.MouseEvent) => void }) => (
  <button 
    onMouseDown={(e) => { e.preventDefault(); onClick(e); }}
    className={`p-1.5 rounded hover:bg-slate-700 transition-colors ${active ? 'bg-slate-700 text-indigo-400' : 'text-slate-300'}`}
  >
    <Icon className="h-4 w-4" />
  </button>
);

interface InlineRichTextProps {
  tagName?: any;
  className?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  align?: 'left' | 'center' | 'right';
  readOnly?: boolean;
}

const InlineRichText: React.FC<InlineRichTextProps> = ({ 
  tagName: Tag = 'div', 
  className = '', 
  value, 
  onChange, 
  placeholder,
  align = 'left',
  readOnly = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== value) {
        if (!isFocused) {
            contentRef.current.innerHTML = value;
        }
    }
  }, [value, isFocused]);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (contentRef.current) {
        onChange(contentRef.current.innerHTML);
    }
  };

  if (readOnly) {
      return (
          <Tag 
            className={`${className} outline-none ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'}`}
            dangerouslySetInnerHTML={{ __html: value }}
          />
      );
  }

  return (
    <div className="relative group/editor">
      {isFocused && (
        <div className="absolute -top-12 left-0 z-50 bg-slate-800 text-white p-1.5 rounded-lg shadow-xl flex items-center gap-1 animate-fade-in border border-slate-700">
          <ToolbarButton icon={Bold} onClick={() => handleFormat('bold')} />
          <ToolbarButton icon={Italic} onClick={() => handleFormat('italic')} />
          <ToolbarButton icon={Underline} onClick={() => handleFormat('underline')} />
          <div className="w-px h-4 bg-slate-600 mx-1"></div>
          <ToolbarButton icon={AlignLeft} active={align === 'left'} onClick={() => handleFormat('justifyLeft')} />
          <ToolbarButton icon={AlignCenter} active={align === 'center'} onClick={() => handleFormat('justifyCenter')} />
          <ToolbarButton icon={AlignRight} active={align === 'right'} onClick={() => handleFormat('justifyRight')} />
        </div>
      )}
      
      <Tag
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setIsFocused(true)}
        onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
            setIsFocused(false);
            onChange(e.currentTarget.innerHTML || e.currentTarget.innerText); 
        }}
        className={`${className} outline-none min-h-[1.5em] empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 cursor-text border-2 border-transparent hover:border-dashed hover:border-slate-300 focus:border-indigo-400 rounded transition-all p-1 -m-1 focus:bg-white focus:shadow-sm ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'}`}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
};

// --- EDITOR NAV ITEMS ---

const EDITOR_NAV_ITEMS = [
  { id: 'templates', label: 'Templates', icon: LayoutTemplate }, // New Item
  { id: 'text', label: 'Text', icon: Type },
  { id: 'resources', label: 'Resources', icon: Box },
  { id: 'interactive', label: 'Interactive elements', icon: MousePointer2 },
  { id: 'questions', label: 'Interactive questions', icon: CheckSquare },
  { id: 'smartblocks', label: 'Smartblocks', icon: Layers },
  { id: 'insert', label: 'Insert', icon: Upload },
  { id: 'background', label: 'Background', icon: Palette },
  { id: 'pages', label: 'Pages', icon: Copy },
];

// --- MAIN COMPONENT ---

const AdminInteractiveDesigner: React.FC = () => {
  const [view, setView] = useState<'list' | 'builder'>('list');
  const [pages, setPages] = useState<InteractivePage[]>(MOCK_PAGES);
  const [activePage, setActivePage] = useState<InteractivePage | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(true);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  
  // Editor Navigation State
  const [activeCategory, setActiveCategory] = useState<string>('templates');
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedTemplateCat, setSelectedTemplateCat] = useState('All');

  // Resizing State
  const [resizingState, setResizingState] = useState<{
    blockId: string;
    handle: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  // Resize Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingState || !activePage) return;

      const deltaX = e.clientX - resizingState.startX;
      const deltaY = e.clientY - resizingState.startY;

      let newWidth = resizingState.startWidth;
      let newHeight = resizingState.startHeight;

      if (resizingState.handle.includes('e')) newWidth += deltaX;
      if (resizingState.handle.includes('w')) newWidth -= deltaX;
      if (resizingState.handle.includes('s')) newHeight += deltaY;
      if (resizingState.handle.includes('n')) newHeight -= deltaY;

      // Minimum sizes
      if (newWidth < 50) newWidth = 50;
      if (newHeight < 50) newHeight = 50;

      const newBlocks = activePage.blocks.map(b => 
        b.id === resizingState.blockId 
          ? { ...b, content: { ...b.content, width: newWidth, height: newHeight } } 
          : b
      );
      setActivePage({ ...activePage, blocks: newBlocks });
    };

    const handleMouseUp = () => {
      setResizingState(null);
    };

    if (resizingState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingState, activePage]);


  // --- DASHBOARD ACTIONS ---

  const handleCreate = () => {
    const newPage: InteractivePage = {
      id: `page_${Date.now()}`,
      title: 'Untitled Interactive Page',
      slug: `untitled-${Date.now()}`,
      status: 'Draft',
      lastEdited: new Date().toLocaleDateString(),
      backgroundColor: '#ffffff',
      blocks: [
        { id: `blk_${Date.now()}`, type: 'heading', content: { text: 'New Activity', level: 'h1', align: 'center' } }
      ]
    };
    setPages([...pages, newPage]);
    setActivePage(newPage);
    setView('builder');
    setIsPreviewMode(false);
  };

  const handleEdit = (page: InteractivePage) => {
    setActivePage({ ...page });
    setView('builder');
    setIsPreviewMode(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this page?')) {
      setPages(pages.filter(p => p.id !== id));
    }
  };

  // --- BUILDER ACTIONS ---

  const addBlock = (type: BlockType, extraData: any = {}) => {
    if (!activePage) return;
    
    let defaultContent = {};
    switch (type) {
      case 'heading': defaultContent = { text: 'New Heading', level: 'h2', align: 'left' }; break;
      case 'text': defaultContent = { text: 'Start typing your content here...', align: 'left' }; break;
      case 'image': defaultContent = { 
        url: 'https://via.placeholder.com/600x400', 
        caption: '', 
        altText: '', 
        description: '',
        width: 400,
        height: 300
      }; break;
      case 'video': defaultContent = { url: '', caption: '' }; break;
      case 'mcq': defaultContent = { 
        question: 'Write your question here?', 
        options: [{id: '1', text: 'Option A'}, {id: '2', text: 'Option B'}], 
        correctOptionId: '1',
        feedback: 'Great job!' 
      }; break;
      case 'process': defaultContent = {
        steps: [
          { id: '1', title: 'Step 1', description: 'Description here', image: '' },
          { id: '2', title: 'Step 2', description: 'Description here', image: '' }
        ]
      }; break;
      case 'flashcard': defaultContent = {
        cards: [
          { id: '1', front: 'Front Text', back: 'Back Text', image: '' }
        ]
      }; break;
      case 'hotspot': defaultContent = {
        url: 'https://via.placeholder.com/800x600',
        hotspots: [
          { id: '1', x: 20, y: 30, content: 'Hotspot Info' }
        ]
      }; break;
      case 'list': defaultContent = {
        style: 'bullet', 
        items: ['List item 1', 'List item 2']
      }; break;
      case 'code': defaultContent = {
        language: 'html-css',
        code: '<!-- Write your code here -->\n<div>Hello World</div>'
      }; break;
      case 'button': defaultContent = {
        text: 'Click Me',
        url: '#',
        style: 'solid', // solid, outline, ghost
        color: 'indigo'
      }; break;
      case 'icon': defaultContent = {
        iconName: 'Star',
        color: '#6366f1',
        size: 48
      }; break;
      case 'embed': defaultContent = {
        url: 'https://www.wikipedia.org',
        height: 400
      }; break;
      case 'banner': defaultContent = {
        url: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop',
        height: 250,
        text: 'Banner Title',
        overlayOpacity: 0.3
      }; break;
    }

    const newBlock: Block = {
      id: `blk_${Date.now()}`,
      type,
      content: { ...defaultContent, ...extraData }
    };

    const newBlocks = [...activePage.blocks, newBlock];
    setActivePage({ ...activePage, blocks: newBlocks });
    setSelectedBlockId(newBlock.id);
  };

  const applyTemplate = (template: Template) => {
    if (!activePage) return;
    
    // Generate new blocks from blueprint
    const newBlocks: Block[] = template.blueprint.map((item, index) => ({
      id: `blk_${Date.now()}_${index}`,
      type: item.type,
      content: { ...item.content } // Deep copy ideally, shallow for now
    }));

    // Append to existing page
    setActivePage({
      ...activePage,
      blocks: [...activePage.blocks, ...newBlocks]
    });
    
    // Auto-select first new block
    if (newBlocks.length > 0) {
      setSelectedBlockId(newBlocks[0].id);
    }
  };

  const updateBlock = (id: string, content: BlockConfig) => {
    if (!activePage) return;
    const newBlocks = activePage.blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...content } } : b);
    setActivePage({ ...activePage, blocks: newBlocks });
  };

  const updatePageBackground = (color: string) => {
    if (!activePage) return;
    setActivePage({ ...activePage, backgroundColor: color });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (!activePage) return;
    const newBlocks = [...activePage.blocks];
    if (direction === 'up' && index > 0) {
      [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
    } else if (direction === 'down' && index < newBlocks.length - 1) {
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    }
    setActivePage({ ...activePage, blocks: newBlocks });
  };

  const deleteBlock = (id: string) => {
    if (!activePage) return;
    const newBlocks = activePage.blocks.filter(b => b.id !== id);
    setActivePage({ ...activePage, blocks: newBlocks });
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const savePage = () => {
    if (!activePage) return;
    const updatedPages = pages.map(p => p.id === activePage.id ? activePage : p);
    if (!pages.find(p => p.id === activePage.id)) updatedPages.push(activePage);
    setPages(updatedPages);
    alert('Page Saved!');
  };

  const handleImageUploadForBlock = (e: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      updateBlock(blockId, { url: imageUrl });
    }
  };

  // --- RENDERERS ---

  const renderBlockPreview = (block: Block) => {
    const isSelected = selectedBlockId === block.id && !isPreviewMode;
    const readOnly = isPreviewMode;

    switch (block.type) {
      case 'heading':
        const Tag = block.content.level as any;
        const fontSize = 
          block.content.level === 'h1' ? 'text-4xl' : 
          block.content.level === 'h2' ? 'text-3xl' : 
          block.content.level === 'h3' ? 'text-2xl' : 
          block.content.level === 'h4' ? 'text-xl' : 
          block.content.level === 'h5' ? 'text-lg' : 
          'text-base uppercase tracking-wider text-slate-500';
        
        return (
          <div className="relative">
             <InlineRichText 
                tagName={Tag}
                className={`font-bold text-slate-900 ${fontSize}`}
                value={block.content.text}
                align={block.content.align}
                onChange={(val) => updateBlock(block.id, { text: val })}
                readOnly={readOnly}
                placeholder="Heading Text"
             />
          </div>
        );

      case 'text':
        return (
          <InlineRichText 
            tagName="div"
            className="text-slate-600 leading-relaxed"
            value={block.content.text}
            align={block.content.align}
            onChange={(val) => updateBlock(block.id, { text: val })}
            readOnly={readOnly}
            placeholder="Type your paragraph text here..."
          />
        );

      case 'button':
        return (
          <div className={`flex w-full ${block.content.align === 'center' ? 'justify-center' : block.content.align === 'right' ? 'justify-end' : 'justify-start'}`}>
             <a 
               href={readOnly ? block.content.url : undefined} 
               onClick={(e) => !readOnly && e.preventDefault()}
               className={`
                 px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-2
                 ${block.content.style === 'outline' 
                    ? 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50' 
                    : block.content.style === 'ghost'
                    ? 'text-indigo-600 hover:bg-indigo-50'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                 }
               `}
             >
                <InlineRichText 
                   tagName="span"
                   value={block.content.text}
                   onChange={(val) => updateBlock(block.id, { text: val })}
                   readOnly={readOnly}
                   placeholder="Button"
                />
                {!readOnly && <LinkIcon className="h-4 w-4 opacity-50" />}
             </a>
          </div>
        );

      case 'icon':
        return (
          <div className={`flex w-full ${block.content.align === 'center' ? 'justify-center' : block.content.align === 'right' ? 'justify-end' : 'justify-start'}`}>
             <div style={{ color: block.content.color || '#6366f1' }}>
                <Star size={block.content.size || 48} />
             </div>
          </div>
        );

      case 'image':
        return (
          <div className="w-full relative flex flex-col items-center group/image">
            {block.content.url ? (
              <div 
                className={`relative group/resize ${isSelected ? 'outline outline-2 outline-indigo-600' : ''}`}
                style={{ width: block.content.width || '100%', height: block.content.height || 'auto', maxWidth: '100%' }}
              >
                <img 
                  src={block.content.url} 
                  alt={block.content.altText || block.content.alt} 
                  className="w-full h-full object-cover rounded-lg shadow-sm"
                  draggable={false}
                />
                {isSelected && (
                  <>
                    {/* Professional Resize Handles - White squares with blue border */}
                    {['nw', 'ne', 'se', 'sw'].map((h) => (
                      <div
                        key={h}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setResizingState({
                            blockId: block.id,
                            handle: h,
                            startX: e.clientX,
                            startY: e.clientY,
                            startWidth: block.content.width || 600,
                            startHeight: block.content.height || 400
                          });
                        }}
                        className={`absolute w-3 h-3 bg-white border border-indigo-600 z-20 cursor-${h}-resize rounded-[1px]
                          ${h.includes('n') ? '-top-1.5' : '-bottom-1.5'} 
                          ${h.includes('w') ? '-left-1.5' : '-right-1.5'}
                        `}
                      />
                    ))}
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-64 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center gap-4">
                 <div className="flex gap-4">
                    <label className="flex flex-col items-center justify-center w-32 h-24 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 hover:text-indigo-600 shadow-sm transition-all group/btn">
                       <Upload className="h-6 w-6 text-slate-400 mb-2 group-hover/btn:text-indigo-500" />
                       <span className="text-xs font-bold text-slate-600 group-hover/btn:text-indigo-600">Upload Image</span>
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUploadForBlock(e, block.id)} />
                    </label>
                    <div className="flex flex-col items-center justify-center w-32 h-24 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 hover:text-indigo-600 shadow-sm transition-all group/btn" onClick={() => updateBlock(block.id, { url: 'https://via.placeholder.com/600x400' })}>
                       <Globe className="h-6 w-6 text-slate-400 mb-2 group-hover/btn:text-indigo-500" />
                       <span className="text-xs font-bold text-slate-600 group-hover/btn:text-indigo-600">Insert URL</span>
                    </div>
                 </div>
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="w-full bg-slate-100 rounded-lg aspect-video flex items-center justify-center text-slate-400 relative group/video">
             {block.content.url ? (
                <iframe src={block.content.url} className="w-full h-full rounded-lg" title="Video" frameBorder="0" allowFullScreen></iframe>
             ) : (
                <div className="flex flex-col items-center">
                   <Video className="h-12 w-12 mb-2" />
                   <span>No Video URL Set</span>
                </div>
             )}
          </div>
        );

      case 'mcq':
        return (
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl relative">
             <InlineRichText 
                tagName="h4"
                className="font-bold text-slate-900 mb-4 text-lg"
                value={block.content.question}
                onChange={(val) => updateBlock(block.id, { question: val })}
                readOnly={readOnly}
                placeholder="Type your question here..."
             />
             <div className="space-y-2">
                {block.content.options.map((opt: any, idx: number) => (
                   <div key={opt.id} className="flex items-center gap-3 p-3 bg-white border border-indigo-100 rounded-lg group/option">
                      <div 
                        onClick={() => !readOnly && updateBlock(block.id, { correctOptionId: opt.id })}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${block.content.correctOptionId === opt.id ? 'border-green-500 bg-green-50' : 'border-indigo-200'}`}
                      >
                         {block.content.correctOptionId === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                      </div>
                      <div className="flex-1">
                         <InlineRichText 
                            tagName="span"
                            className="text-sm text-slate-700 block w-full"
                            value={opt.text}
                            onChange={(val) => {
                               const newOptions = [...block.content.options];
                               newOptions[idx].text = val;
                               updateBlock(block.id, { options: newOptions });
                            }}
                            readOnly={readOnly}
                            placeholder={`Option ${idx + 1}`}
                         />
                      </div>
                      {isSelected && (
                         <button 
                           onClick={() => {
                              const newOptions = block.content.options.filter((o: any) => o.id !== opt.id);
                              updateBlock(block.id, { options: newOptions });
                           }}
                           className="text-slate-300 hover:text-red-500 opacity-0 group-hover/option:opacity-100 transition-opacity"
                         >
                           <X className="h-4 w-4" />
                         </button>
                      )}
                   </div>
                ))}
                {isSelected && (
                   <button 
                     onClick={() => {
                        const newId = `opt_${Date.now()}`;
                        updateBlock(block.id, { options: [...block.content.options, {id: newId, text: 'New Option'}] });
                     }}
                     className="text-xs text-indigo-600 font-bold hover:underline mt-2 flex items-center gap-1"
                   >
                     <Plus className="h-3 w-3" /> Add Option
                   </button>
                )}
             </div>
          </div>
        );

      case 'process':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {block.content.steps.map((step: any, idx: number) => (
                <div key={step.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl relative group/step shadow-sm">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">{idx + 1}</div>
                  <InlineRichText 
                     tagName="h4"
                     className="font-bold text-slate-900 mb-1 mt-2"
                     value={step.title}
                     onChange={(val) => {
                        const newSteps = [...block.content.steps];
                        newSteps[idx].title = val;
                        updateBlock(block.id, { steps: newSteps });
                     }}
                     readOnly={readOnly}
                     placeholder="Step Title"
                  />
                  <InlineRichText 
                     tagName="p"
                     className="text-sm text-slate-500"
                     value={step.description}
                     onChange={(val) => {
                        const newSteps = [...block.content.steps];
                        newSteps[idx].description = val;
                        updateBlock(block.id, { steps: newSteps });
                     }}
                     readOnly={readOnly}
                     placeholder="Step Description..."
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto text-indigo-300 relative group/code">
            {isSelected ? (
               <textarea 
                  value={block.content.code} 
                  onChange={(e) => updateBlock(block.id, { code: e.target.value })}
                  className="w-full bg-transparent text-indigo-300 outline-none resize-none h-48 font-mono"
                  spellCheck={false}
               />
            ) : (
               <pre className="whitespace-pre-wrap">{block.content.code}</pre>
            )}
          </div>
        );

      case 'embed':
        return (
          <div className="w-full relative group/embed bg-slate-50 border border-slate-200 rounded-lg overflow-hidden" style={{ height: block.content.height ? `${block.content.height}px` : '400px' }}>
              {block.content.url ? (
                <iframe 
                  src={block.content.url} 
                  className="w-full h-full border-0"
                  title="Embedded Content"
                  allowFullScreen
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                   <Globe className="h-12 w-12 mb-2 opacity-20" />
                   <span className="font-medium">Embed Content</span>
                </div>
              )}
              {/* Overlay for editing interaction */}
              {!isPreviewMode && <div className="absolute inset-0 z-10 bg-transparent" />}
          </div>
        );

      case 'banner':
        return (
          <div 
            className={`relative group/banner -mx-12 ${isSelected ? 'ring-2 ring-indigo-600 z-10' : ''}`}
            style={{ height: block.content.height || 250, width: 'calc(100% + 6rem)' }}
          >
             <div 
               className="absolute inset-0 bg-cover bg-center"
               style={{ backgroundImage: `url(${block.content.url})` }}
             />
             <div 
               className="absolute inset-0 bg-black"
               style={{ opacity: block.content.overlayOpacity ?? 0.3 }}
             />
             <div className="absolute inset-0 flex items-center justify-center p-8">
                <InlineRichText 
                   tagName="h2"
                   className="text-4xl font-bold text-white text-center drop-shadow-lg"
                   value={block.content.text}
                   onChange={(val) => updateBlock(block.id, { text: val })}
                   readOnly={readOnly}
                   placeholder="Banner Title"
                   align="center"
                />
             </div>
             
             {/* Resize Handle (Height Only) */}
             {isSelected && (
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border border-indigo-600 rounded-full flex items-center justify-center cursor-ns-resize shadow-md -mb-4 z-30"
                  onMouseDown={(e) => {
                     e.stopPropagation();
                     setResizingState({
                        blockId: block.id,
                        handle: 's', 
                        startX: e.clientX,
                        startY: e.clientY,
                        startWidth: 0, 
                        startHeight: block.content.height || 250
                     });
                  }}
                >
                  <ArrowDown className="h-4 w-4 text-indigo-600" />
                </div>
             )}
          </div>
        );

      default:
        return <div>Unknown Block</div>;
    }
  };

  const renderPropertiesPanel = () => {
    // 1. PAGE SETTINGS (When no block selected)
    if (!selectedBlockId || !activePage) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <span className="text-xs font-bold uppercase text-slate-500">Page Settings</span>
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">Background Color</label>
                    <div className="flex flex-wrap gap-2">
                        {['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#dbeafe', '#dcfce7', '#fef9c3', '#fee2e2'].map(color => (
                            <button
                                key={color}
                                onClick={() => updatePageBackground(color)}
                                className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 ${activePage?.backgroundColor === color ? 'ring-2 ring-indigo-500 ring-offset-2' : 'border-slate-200'}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">Canvas Size</label>
                    <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        Responsive (Max Width 1200px)
                    </div>
                </div>
            </div>
        );
    }
    
    // 2. BLOCK SETTINGS
    const block = activePage.blocks.find(b => b.id === selectedBlockId);
    if (!block) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
           <span className="text-xs font-bold uppercase text-slate-500">{block.type} Settings</span>
           <button onClick={() => deleteBlock(block.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded" title="Delete Block"><Trash2 className="h-4 w-4" /></button>
        </div>

        {/* Common Alignment */}
        {(block.type === 'heading' || block.type === 'text' || block.type === 'button') && (
           <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Alignment</label>
              <div className="flex gap-2">
                 {['left', 'center', 'right'].map(align => (
                   <button 
                     key={align} 
                     onClick={() => updateBlock(block.id, { align })} 
                     className={`flex-1 py-1.5 text-xs border rounded capitalize ${block.content.align === align ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                   >
                     {align}
                   </button>
                 ))}
              </div>
           </div>
        )}

        {/* Button Specific */}
        {block.type === 'button' && (
            <>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">Target URL</label>
                    <input 
                        type="text" 
                        value={block.content.url}
                        onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">Style</label>
                    <select 
                        value={block.content.style}
                        onChange={(e) => updateBlock(block.id, { style: e.target.value })}
                        className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2 text-xs outline-none"
                    >
                        <option value="solid">Solid</option>
                        <option value="outline">Outline</option>
                        <option value="ghost">Ghost</option>
                    </select>
                </div>
            </>
        )}

        {/* Image Specific */}
        {block.type === 'image' && (
           <div className="space-y-4">
              <div>
                 <label className="block text-xs font-bold text-slate-600 mb-2">Image Source</label>
                 <input 
                   type="text" 
                   value={block.content.url}
                   onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                   className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 outline-none mb-2"
                   placeholder="https://..."
                 />
                 <label className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 text-xs text-slate-600 font-medium">
                    <Upload className="h-3 w-3" /> Upload New Image
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUploadForBlock(e, block.id)} />
                 </label>
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-600 mb-2">Alt Text</label>
                 <input 
                   type="text" 
                   value={block.content.altText || ''}
                   onChange={(e) => updateBlock(block.id, { altText: e.target.value })}
                   className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 outline-none"
                 />
              </div>
           </div>
        )}

        {/* Code Specific */}
        {block.type === 'code' && (
           <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Language</label>
              <select 
                 value={block.content.language} 
                 onChange={(e) => updateBlock(block.id, { language: e.target.value })}
                 className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2 text-xs outline-none"
              >
                 <option value="html-css">HTML + CSS</option>
                 <option value="javascript">JavaScript</option>
                 <option value="python">Python</option>
              </select>
           </div>
        )}

        {/* Embed Specific */}
        {block.type === 'embed' && (
           <div className="space-y-4">
              <div>
                 <label className="block text-xs font-bold text-slate-600 mb-2">Embed URL</label>
                 <input 
                   type="text" 
                   value={block.content.url}
                   onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                   className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 outline-none"
                   placeholder="https://..."
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-600 mb-2">Height (px)</label>
                 <input 
                   type="number" 
                   value={block.content.height || 400}
                   onChange={(e) => updateBlock(block.id, { height: Number(e.target.value) })}
                   className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 outline-none"
                 />
              </div>
           </div>
        )}

        {/* Banner Specific */}
        {block.type === 'banner' && (
           <div className="space-y-4">
              <div>
                 <label className="block text-xs font-bold text-slate-600 mb-2">Background Image</label>
                 <input 
                   type="text" 
                   value={block.content.url}
                   onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                   className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 outline-none mb-2"
                   placeholder="https://..."
                 />
                 <label className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 text-xs text-slate-600 font-medium">
                    <Upload className="h-3 w-3" /> Upload New Image
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUploadForBlock(e, block.id)} />
                 </label>
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-600 mb-2">Height (px)</label>
                 <input 
                   type="number" 
                   value={block.content.height || 250}
                   onChange={(e) => updateBlock(block.id, { height: Number(e.target.value) })}
                   className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 outline-none"
                 />
              </div>
           </div>
        )}

        {/* Process Specific */}
        {block.type === 'process' && (
           <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-600 mb-2">Step Configuration</label>
              {block.content.steps.map((step: any, idx: number) => (
                 <div key={step.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 mb-2">Step {idx + 1}</p>
                    <input 
                      type="text" 
                      value={step.title}
                      onChange={(e) => {
                         const newSteps = [...block.content.steps];
                         newSteps[idx].title = e.target.value;
                         updateBlock(block.id, { steps: newSteps });
                      }}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-900 mb-2" 
                      placeholder="Title"
                    />
                    <input 
                      type="text" 
                      value={step.description}
                      onChange={(e) => {
                         const newSteps = [...block.content.steps];
                         newSteps[idx].description = e.target.value;
                         updateBlock(block.id, { steps: newSteps });
                      }}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-900" 
                      placeholder="Description"
                    />
                 </div>
              ))}
              <button 
                onClick={() => updateBlock(block.id, { steps: [...block.content.steps, { id: Date.now().toString(), title: 'New Step', description: '...' }] })}
                className="w-full py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100"
              >
                Add Step
              </button>
           </div>
        )}

      </div>
    );
  };

  const renderDrawerContent = () => {
      switch(activeCategory) {
          case 'templates':
              const filteredTemplates = TEMPLATE_GALLERY.filter(t => {
                  const matchSearch = t.name.toLowerCase().includes(templateSearch.toLowerCase());
                  const matchCat = selectedTemplateCat === 'All' || t.category === selectedTemplateCat;
                  return matchSearch && matchCat;
              });

              return (
                  <div className="space-y-6 h-full flex flex-col">
                      <div className="flex flex-col gap-4 sticky top-0 bg-white z-10 pb-2">
                          <h3 className="font-bold text-slate-800 text-lg">Template Gallery</h3>
                          <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <input 
                                type="text" 
                                placeholder="Search templates..." 
                                value={templateSearch}
                                onChange={(e) => setTemplateSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                          </div>
                          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                              {TEMPLATE_CATS.map(cat => (
                                  <button
                                    key={cat}
                                    onClick={() => setSelectedTemplateCat(cat)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors
                                        ${selectedTemplateCat === cat ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                                    `}
                                  >
                                      {cat}
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pb-20">
                          {filteredTemplates.map(template => (
                              <div 
                                key={template.id} 
                                className="group relative border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer bg-white"
                                onClick={() => applyTemplate(template)}
                              >
                                  <div className={`h-24 ${template.thumbnail} flex items-center justify-center`}>
                                      {/* Thumbnail Placeholder */}
                                      <Layout className="text-white/50 h-8 w-8" />
                                  </div>
                                  <div className="p-3">
                                      <div className="flex justify-between items-start">
                                          <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{template.name}</h4>
                                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{template.category}</span>
                                      </div>
                                  </div>
                                  {/* Hover Overlay */}
                                  <div className="absolute inset-0 bg-indigo-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <span className="text-white font-bold text-sm bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">Use Template</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              );
          case 'text':
              return (
                  <div className="space-y-4">
                      <h3 className="font-bold text-slate-800 text-sm">Text Blocks</h3>
                      <div className="space-y-2">
                          {[
                              { label: 'Title', type: 'heading', level: 'h1', size: 'text-3xl font-bold' },
                              { label: 'Subtitle', type: 'heading', level: 'h2', size: 'text-xl font-semibold' },
                              { label: 'Heading 3', type: 'heading', level: 'h3', size: 'text-lg font-medium' },
                              { label: 'Paragraph', type: 'text', size: 'text-sm text-slate-600' },
                              { label: 'List', type: 'list', size: 'text-sm list-disc pl-4' }
                          ].map((item, idx) => (
                              <button 
                                key={idx} 
                                onClick={() => addBlock(item.type as BlockType, item.level ? { level: item.level } : {})}
                                className="w-full text-left p-4 hover:bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition-all bg-white shadow-sm group"
                              >
                                  <div className={`${item.size} group-hover:text-indigo-700 transition-colors`}>{item.label}</div>
                              </button>
                          ))}
                      </div>
                  </div>
              );
          case 'resources':
              return (
                  <div className="space-y-4">
                      <h3 className="font-bold text-slate-800 text-sm">Resources</h3>
                      <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => addBlock('image')} className="p-4 border border-slate-200 bg-white rounded-xl hover:border-indigo-500 hover:text-indigo-600 flex flex-col items-center gap-2 transition-all shadow-sm">
                              <ImageIcon className="h-6 w-6" />
                              <span className="text-xs font-bold">Image</span>
                          </button>
                          <button onClick={() => addBlock('video')} className="p-4 border border-slate-200 bg-white rounded-xl hover:border-indigo-500 hover:text-indigo-600 flex flex-col items-center gap-2 transition-all shadow-sm">
                              <Video className="h-6 w-6" />
                              <span className="text-xs font-bold">Video</span>
                          </button>
                          <button onClick={() => addBlock('icon')} className="p-4 border border-slate-200 bg-white rounded-xl hover:border-indigo-500 hover:text-indigo-600 flex flex-col items-center gap-2 transition-all shadow-sm">
                              <Star className="h-6 w-6" />
                              <span className="text-xs font-bold">Icon</span>
                          </button>
                          <button onClick={() => addBlock('text', { text: '<div style="width:100%;height:2px;background:#cbd5e1;"></div>' })} className="p-4 border border-slate-200 bg-white rounded-xl hover:border-indigo-500 hover:text-indigo-600 flex flex-col items-center gap-2 transition-all shadow-sm">
                              <div className="h-6 w-full flex items-center px-2"><div className="w-full h-0.5 bg-current"></div></div>
                              <span className="text-xs font-bold">Divider</span>
                          </button>
                          <button onClick={() => addBlock('banner')} className="p-4 border border-slate-200 bg-white rounded-xl hover:border-indigo-500 hover:text-indigo-600 flex flex-col items-center gap-2 transition-all shadow-sm col-span-2">
                              <RectangleHorizontal className="h-6 w-6" />
                              <span className="text-xs font-bold">Banner (Full Width)</span>
                          </button>
                      </div>
                  </div>
              );
          case 'interactive':
              return (
                  <div className="space-y-4">
                      <h3 className="font-bold text-slate-800 text-sm">Interactive Elements</h3>
                      <div className="space-y-3">
                          <button onClick={() => addBlock('button')} className="w-full p-3 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all text-center">
                              Button
                          </button>
                          <button onClick={() => addBlock('button', { style: 'outline' })} className="w-full p-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-all text-center">
                              Outline Button
                          </button>
                          <button onClick={() => addBlock('hotspot')} className="w-full p-4 border border-slate-200 bg-white rounded-lg hover:border-indigo-500 flex items-center gap-3 shadow-sm hover:shadow-md transition-all">
                              <div className="bg-indigo-50 p-2 rounded-full text-indigo-600">
                                <MousePointer2 className="h-5 w-5" />
                              </div>
                              <span className="text-sm font-bold text-slate-700">Image Hotspot</span>
                          </button>
                      </div>
                  </div>
              );
          case 'questions':
              return (
                  <div className="space-y-4">
                      <h3 className="font-bold text-slate-800 text-sm">Questions</h3>
                      <button onClick={() => addBlock('mcq')} className="w-full p-4 border border-slate-200 bg-white rounded-lg hover:border-indigo-500 text-left shadow-sm hover:shadow-md transition-all group">
                          <div className="flex items-center gap-2 font-bold text-sm text-slate-700 mb-1 group-hover:text-indigo-700">
                              <CheckSquare className="h-4 w-4 text-indigo-500" /> Multiple Choice
                          </div>
                          <p className="text-xs text-slate-500">Standard quiz question with feedback.</p>
                      </button>
                  </div>
              );
          case 'smartblocks':
              return (
                  <div className="space-y-4">
                      <h3 className="font-bold text-slate-800 text-sm">Smartblocks</h3>
                      <div className="grid grid-cols-1 gap-3">
                          <button onClick={() => addBlock('process')} className="p-4 border border-slate-200 bg-white rounded-lg hover:border-indigo-500 text-left shadow-sm hover:shadow-md transition-all">
                              <div className="flex items-center gap-2 mb-1">
                                <Layers className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm font-bold text-slate-700">Process Flow</span>
                              </div>
                              <p className="text-xs text-slate-500">Step-by-step visual guide.</p>
                          </button>
                          <button onClick={() => addBlock('flashcard')} className="p-4 border border-slate-200 bg-white rounded-lg hover:border-indigo-500 text-left shadow-sm hover:shadow-md transition-all">
                              <div className="flex items-center gap-2 mb-1">
                                <AppWindow className="h-4 w-4 text-orange-500" />
                                <span className="text-sm font-bold text-slate-700">Flashcards</span>
                              </div>
                              <p className="text-xs text-slate-500">Interactive flip cards.</p>
                          </button>
                          <button onClick={() => addBlock('code')} className="p-4 border border-slate-200 bg-white rounded-lg hover:border-indigo-500 text-left shadow-sm hover:shadow-md transition-all">
                              <div className="flex items-center gap-2 mb-1">
                                <Code className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-bold text-slate-700">Code Snippet</span>
                              </div>
                              <p className="text-xs text-slate-500">Syntax highlighted code block.</p>
                          </button>
                          <button onClick={() => addBlock('embed')} className="p-4 border border-slate-200 bg-white rounded-lg hover:border-indigo-500 text-left shadow-sm hover:shadow-md transition-all">
                              <div className="flex items-center gap-2 mb-1">
                                <Globe className="h-4 w-4 text-pink-500" />
                                <span className="text-sm font-bold text-slate-700">Embed Iframe</span>
                              </div>
                              <p className="text-xs text-slate-500">Embed external content via URL.</p>
                          </button>
                      </div>
                  </div>
              );
          default:
              return <div className="text-slate-400 text-sm">Select a category from the left.</div>;
      }
  }

  // --- VIEWS ---

  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
             <h1 className="text-2xl font-bold text-slate-900">Interactive Designer</h1>
             <p className="text-slate-500 mt-1">Build and manage interactive learning activities.</p>
          </div>
          <button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95">
            <Plus className="h-4 w-4" /> New Page
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
           <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
                 <tr>
                    <th className="px-6 py-4 font-semibold">Title</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Last Edited</th>
                    <th className="px-6 py-4 font-semibold">Embed Link</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {pages.map(page => (
                    <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4 font-medium text-slate-900">{page.title}</td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${page.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                             {page.status}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-slate-500">{page.lastEdited}</td>
                       <td className="px-6 py-4 font-mono text-xs text-slate-500 truncate max-w-[150px]">
                          /activities/{page.slug}
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => handleEdit(page)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Settings className="h-4 w-4" /></button>
                             <button onClick={() => handleDelete(page.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                          </div>
                       </td>
                    </tr>
                 ))}
                 {pages.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-12 text-slate-500">No pages found. Create one to get started.</td></tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>
    );
  }

  // BUILDER VIEW
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] -m-8 bg-slate-100 overflow-hidden">
      
      {/* Top Bar */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-30 shadow-sm shrink-0">
         <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="text-slate-500 hover:text-slate-800 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><ChevronLeft className="h-5 w-5" /></button>
            <div className="h-6 w-px bg-slate-200"></div>
            <input 
              type="text" 
              value={activePage?.title} 
              onChange={(e) => activePage && setActivePage({...activePage, title: e.target.value})}
              className="text-sm font-bold text-slate-900 border-transparent focus:border-indigo-300 focus:ring-0 p-1.5 hover:bg-slate-50 hover:border-slate-200 rounded transition-all w-64 md:w-96"
            />
         </div>

         {/* Center Controls (Visual Only) */}
         <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded shadow-sm transition-all" title="Undo"><Undo className="h-4 w-4" /></button>
            <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded transition-all" title="Redo"><Redo className="h-4 w-4" /></button>
            <div className="w-px h-4 bg-slate-300 mx-1"></div>
            <button className="p-1.5 bg-white text-indigo-600 rounded shadow-sm" title="Desktop"><Monitor className="h-4 w-4" /></button>
            <button className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded transition-all" title="Mobile"><Smartphone className="h-4 w-4" /></button>
         </div>

         <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-md transition-colors border
                ${isPreviewMode ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}
              `}
            >
               {isPreviewMode ? <X className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
               {isPreviewMode ? 'Exit Preview' : 'Preview'}
            </button>
            {!isPreviewMode && (
              <>
                <button onClick={savePage} className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded hover:bg-slate-50 transition-colors">
                   <Save className="h-3.5 w-3.5" /> Save
                </button>
                <button 
                  onClick={() => { savePage(); setShowPublishModal(true); }}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                   <Globe className="h-3.5 w-3.5" /> Publish
                </button>
              </>
            )}
         </div>
      </div>

      {isPreviewMode ? (
        // PREVIEW LAYOUT
        <div className="flex-1 bg-slate-200/50 overflow-y-auto p-8 animate-fade-in flex justify-center backdrop-blur-sm">
           <div 
             className="w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden min-h-[800px] flex flex-col relative"
             style={{ backgroundColor: activePage?.backgroundColor || '#ffffff' }}
           >
              {/* Fake Browser Chrome */}
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex gap-2 items-center">
                 <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                 </div>
                 <div className="flex-1 bg-white border border-slate-200 rounded text-center text-[10px] text-slate-400 py-0.5 mx-4">
                    preview-mode.certkraft.com
                 </div>
              </div>
              <div className="p-12 space-y-8 flex-1">
                 {activePage?.blocks.map(block => (
                    <div key={block.id} className="block-content">
                       {renderBlockPreview(block)}
                    </div>
                 ))}
              </div>
           </div>
        </div>
      ) : (
        // EDITOR LAYOUT
        <div className="flex flex-1 overflow-hidden relative">
           
           {/* FAR LEFT: MAIN NAV (Genially Style) */}
           <div className="w-20 bg-[#1e1e24] flex flex-col items-center py-4 gap-2 z-20 shadow-2xl shrink-0">
              {EDITOR_NAV_ITEMS.map(item => (
                 <button 
                   key={item.id}
                   onClick={() => {
                     setActiveCategory(item.id);
                     setIsLeftSidebarOpen(true);
                   }}
                   className={`w-full flex flex-col items-center gap-1.5 py-3 text-[10px] font-bold transition-all relative group
                     ${activeCategory === item.id ? 'text-indigo-400 bg-black/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                   `}
                 >
                    {activeCategory === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>}
                    <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span>{item.label.split(' ')[0]}</span>
                 </button>
              ))}
           </div>

           {/* LEFT DRAWER: ITEM SELECTOR */}
           <div 
             className={`bg-white border-r border-slate-200 flex flex-col z-10 shadow-xl transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] shrink-0 relative
               ${!isLeftSidebarOpen ? 'w-0' : (activeCategory === 'templates' ? 'w-[600px]' : 'w-72')}
             `}
           >
              <button 
                 onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                 className="absolute top-6 -right-3 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md text-slate-500 hover:text-indigo-600 z-50 cursor-pointer"
                 title={isLeftSidebarOpen ? "Close Panel" : "Open Panel"}
              >
                 {isLeftSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </button>

              <div className={`flex-1 flex flex-col h-full overflow-hidden ${!isLeftSidebarOpen ? 'opacity-0 invisible' : 'opacity-100 visible'} transition-all duration-200`}>
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                     <h2 className="font-bold text-slate-800 capitalize flex items-center gap-2">
                        {activeCategory === 'templates' ? <LayoutTemplate className="h-4 w-4 text-indigo-600" /> : null}
                        {activeCategory.replace('smartblocks', 'Smart Blocks')}
                     </h2>
                  </div>
                  <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50/30">
                     {renderDrawerContent()}
                  </div>
              </div>
           </div>

           {/* CENTER: CANVAS */}
           <div 
             className="flex-1 bg-slate-100 overflow-y-auto p-12 relative flex justify-center items-start" 
             onClick={() => setSelectedBlockId(null)}
             style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: '20px 20px'
             }}
           >
              <div 
                className="w-full max-w-4xl bg-white min-h-[800px] shadow-sm border border-slate-200 rounded-xl overflow-hidden relative transition-all duration-300 hover:shadow-md"
                style={{ backgroundColor: activePage?.backgroundColor || '#ffffff' }}
              >
                 <div className="p-12 space-y-6">
                    {activePage?.blocks.length === 0 && (
                       <div className="text-center py-32 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 bg-slate-50/50 m-8">
                          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
                             <Plus className="h-8 w-8 text-indigo-300" />
                          </div>
                          <p className="font-bold text-slate-600 text-lg">Start Building</p>
                          <p className="text-sm text-slate-400 max-w-xs mx-auto mt-2">Select a template or drag an element from the sidebar to begin.</p>
                       </div>
                    )}

                    {activePage?.blocks.map((block, index) => (
                       <div 
                         key={block.id} 
                         onClick={(e) => { e.stopPropagation(); setSelectedBlockId(block.id); }}
                         className={`relative group transition-all p-1
                           ${selectedBlockId === block.id 
                             ? 'outline outline-2 outline-indigo-600 z-10 rounded-sm' 
                             : 'hover:outline hover:outline-1 hover:outline-indigo-300 hover:z-10 border border-transparent'}
                         `}
                       >
                          {/* Block Controls (Visible on Hover/Select) */}
                          <div className={`absolute -right-10 top-0 flex flex-col gap-1 z-30 ${selectedBlockId === block.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                             <button onClick={(e) => {e.stopPropagation(); moveBlock(index, 'up')}} className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 rounded shadow-sm hover:shadow-md"><ArrowUp className="h-3.5 w-3.5" /></button>
                             <button onClick={(e) => {e.stopPropagation(); moveBlock(index, 'down')}} className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 rounded shadow-sm hover:shadow-md"><ArrowDown className="h-3.5 w-3.5" /></button>
                             <button onClick={(e) => {e.stopPropagation(); deleteBlock(block.id)}} className="p-1.5 bg-white border border-slate-200 text-red-400 hover:text-red-600 rounded shadow-sm hover:shadow-md mt-1"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>

                          {/* Block Content */}
                          <div className="p-2">
                             {renderBlockPreview(block)}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
              
              {/* Zoom Controls Mock */}
              <div className="fixed bottom-8 right-88 bg-white border border-slate-200 rounded-full shadow-lg p-1.5 flex items-center gap-2 z-20">
                 <button className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500"><ZoomOut className="h-4 w-4" /></button>
                 <span className="text-xs font-bold text-slate-600 w-8 text-center">100%</span>
                 <button className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500"><ZoomIn className="h-4 w-4" /></button>
              </div>
           </div>

           {/* RIGHT: PROPERTIES */}
           <div className={`bg-white border-l border-slate-200 flex flex-col z-20 shadow-xl shrink-0 transition-all duration-300 relative ${isPropertiesPanelOpen ? 'w-80' : 'w-0'}`}>
              <button 
                 onClick={() => setIsPropertiesPanelOpen(!isPropertiesPanelOpen)}
                 className="absolute top-6 -left-3 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md text-slate-500 hover:text-indigo-600 z-30 cursor-pointer"
                 title={isPropertiesPanelOpen ? "Close Panel" : "Open Panel"}
              >
                 {isPropertiesPanelOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              </button>
              <div className={`p-6 overflow-y-auto flex-1 custom-scrollbar ${!isPropertiesPanelOpen ? 'hidden' : ''}`}>
                 {renderPropertiesPanel()}
              </div>
           </div>

        </div>
      )}

      {/* PUBLISH MODAL */}
      {showPublishModal && activePage && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">Publish Activity</h3>
                  <button onClick={() => setShowPublishModal(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
               </div>
               <div className="p-6 space-y-6">
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex gap-3 items-start">
                     <CheckSquare className="h-5 w-5 text-emerald-600 mt-0.5" />
                     <div>
                        <p className="text-emerald-800 font-bold text-sm">Published Successfully!</p>
                        <p className="text-emerald-700 text-xs mt-1">Your interactive page is now live and ready to embed.</p>
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Direct Link</label>
                     <div className="flex items-center gap-2">
                        <input type="text" readOnly value={`https://certkraft.com/activities/${activePage.slug}`} className="flex-1 bg-slate-100 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-600 font-mono outline-none" />
                        <button className="p-2.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"><Copy className="h-4 w-4" /></button>
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Embed Code (Iframe)</label>
                     <textarea 
                        readOnly 
                        rows={4}
                        className="w-full bg-slate-900 text-indigo-300 font-mono text-xs p-4 rounded-xl border border-slate-800 outline-none"
                        value={`<iframe src="https://certkraft.com/activities/${activePage.slug}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`}
                     />
                  </div>
               </div>
               <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                  <button onClick={() => setShowPublishModal(false)} className="text-indigo-600 font-bold text-sm hover:underline">Done</button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default AdminInteractiveDesigner;