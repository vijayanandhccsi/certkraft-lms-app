import React, { createContext, useState, useContext, ReactNode } from 'react';
import { PATHS, LearningPath } from '../data/learningPaths';

interface LearningPathContextType {
  paths: LearningPath[];
  deletePath: (id: number) => void;
  addPath: (path: LearningPath) => void;
  updatePath: (path: LearningPath) => void;
  reorderPath: (startIndex: number, endIndex: number) => void;
}

const LearningPathContext = createContext<LearningPathContextType | undefined>(undefined);

export const LearningPathProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [paths, setPaths] = useState<LearningPath[]>(PATHS);

  const deletePath = (id: number) => {
    setPaths(prev => prev.filter(path => path.id !== id));
  };

  const addPath = (path: LearningPath) => {
    setPaths(prev => [...prev, path]);
  };

  const updatePath = (updatedPath: LearningPath) => {
    setPaths(prev => prev.map(path => path.id === updatedPath.id ? updatedPath : path));
  };

  const reorderPath = (startIndex: number, endIndex: number) => {
    setPaths(prev => {
      // Use spread syntax to create a copy, preserving the LearningPath[] type
      // Array.from(prev) might infer unknown[] which causes spread error
      const result = [...prev];
      const [removed] = result.splice(startIndex, 1);
      
      // Check if removed item exists to prevent inserting undefined into the array
      if (removed) {
        result.splice(endIndex, 0, removed);
      }
      
      // Update the order field based on new array position
      return result.map((path, index) => ({
        ...path,
        order: index + 1
      }));
    });
  };

  return (
    <LearningPathContext.Provider value={{ paths, deletePath, addPath, updatePath, reorderPath }}>
      {children}
    </LearningPathContext.Provider>
  );
};

export const useLearningPaths = () => {
  const context = useContext(LearningPathContext);
  if (!context) {
    throw new Error('useLearningPaths must be used within a LearningPathProvider');
  }
  return context;
};