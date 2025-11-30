import React, { createContext, useState, useContext, ReactNode } from 'react';

export type InstructorStatus = 'Active' | 'Inactive' | 'Pending';
export type InstructorType = 'Full-time' | 'Part-time' | 'Guest' | 'External';
export type InstructorRole = 'Instructor' | 'Content Creator' | 'Course Manager' | 'Lab Manager' | 'Quiz Author' | 'Reviewer';

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  website?: string;
  twitter?: string;
}

export interface InstructorAccount {
  hasAccess: boolean;
  username?: string;
  password?: string; // Mock only: In production, never store passwords in plain text on client
  roles: InstructorRole[];
}

export interface Instructor {
  id: number;
  // Basic Info
  name: string;
  email: string;
  phone?: string;
  title: string; // Designation e.g. Cloud Architect
  shortBio: string;
  bio: string; // Detailed bio
  status: InstructorStatus;
  
  // Expertise
  primaryExpertise: string;
  skills: string[];
  coursesTaught?: string[]; // IDs or Titles
  
  // Media
  avatar: string;
  coverImage?: string;
  introVideoUrl?: string;
  socials: SocialLinks;

  // Account
  account: InstructorAccount;

  // Settings
  type: InstructorType;
  joinedDate: string;
}

interface InstructorContextType {
  instructors: Instructor[];
  addInstructor: (instructor: Instructor) => void;
  updateInstructor: (instructor: Instructor) => void;
  deleteInstructor: (id: number) => void;
}

const InstructorContext = createContext<InstructorContextType | undefined>(undefined);

export const InstructorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [instructors, setInstructors] = useState<Instructor[]>([
    { 
      id: 1, 
      name: 'Dr. Jane Smith', 
      email: 'jane.smith@certkraft.com', 
      title: 'Senior Cloud Architect', 
      shortBio: 'Ex-AWS Solutions Architect with 15 years of experience in distributed systems.',
      bio: 'Dr. Jane Smith is a seasoned Cloud Architect and Technical Trainer with over 15 years of experience in designing and deploying scalable cloud infrastructure. She previously worked at AWS as a Senior Solutions Architect, helping Fortune 500 companies migrate to the cloud. Jane holds a PhD in Computer Science and specializes in serverless architectures and container orchestration.',
      status: 'Active',
      primaryExpertise: 'Cloud Computing',
      skills: ['AWS', 'Azure', 'Kubernetes', 'Terraform', 'System Design'],
      avatar: '',
      socials: { linkedin: 'jane-smith', twitter: '@janesmithcloud' },
      account: { hasAccess: true, username: 'jane.smith', roles: ['Instructor', 'Course Manager'] },
      type: 'Full-time',
      joinedDate: '2023-01-15'
    },
    { 
      id: 2, 
      name: 'John Doe', 
      email: 'john.doe@certkraft.com', 
      title: 'Cyber Security Specialist', 
      shortBio: 'Certified Ethical Hacker and Security Consultant.',
      bio: 'John Doe is a cybersecurity expert with a focus on penetration testing and network defense. He holds multiple certifications including OSCP, CISSP, and CEH. John has led security audits for major financial institutions and government agencies. He is passionate about teaching practical, hands-on security skills to the next generation of cyber defenders.',
      status: 'Active',
      primaryExpertise: 'Cybersecurity',
      skills: ['Penetration Testing', 'Network Security', 'Python', 'Linux', 'Forensics'],
      avatar: '',
      socials: { github: 'johndoe-sec' },
      account: { hasAccess: true, username: 'john.doe', roles: ['Instructor', 'Lab Manager'] },
      type: 'Part-time',
      joinedDate: '2023-03-10'
    },
    { 
      id: 3, 
      name: 'Sarah Connor', 
      email: 'sarah@certkraft.com', 
      title: 'DevOps Lead', 
      shortBio: 'Automating everything from code to cloud.',
      bio: 'Sarah Connor is a DevOps engineer with a background in software development and operations. She advocates for CI/CD best practices and infrastructure as code. Sarah has helped numerous teams adopt DevOps culture and tools, streamlining their delivery pipelines and improving deployment frequency.',
      status: 'Active',
      primaryExpertise: 'DevOps',
      skills: ['Jenkins', 'GitLab CI', 'Docker', 'Ansible', 'Prometheus'],
      avatar: '',
      socials: { website: 'sarahops.io' },
      account: { hasAccess: false, roles: [] },
      type: 'Guest',
      joinedDate: '2023-05-22'
    },
  ]);

  const addInstructor = (instructor: Instructor) => {
    setInstructors(prev => [...prev, instructor]);
  };

  const updateInstructor = (updatedInstructor: Instructor) => {
    setInstructors(prev => prev.map(i => i.id === updatedInstructor.id ? updatedInstructor : i));
  };

  const deleteInstructor = (id: number) => {
    setInstructors(prev => prev.filter(i => i.id !== id));
  };

  return (
    <InstructorContext.Provider value={{ instructors, addInstructor, updateInstructor, deleteInstructor }}>
      {children}
    </InstructorContext.Provider>
  );
};

export const useInstructors = () => {
  const context = useContext(InstructorContext);
  if (!context) {
    throw new Error('useInstructors must be used within a InstructorProvider');
  }
  return context;
};