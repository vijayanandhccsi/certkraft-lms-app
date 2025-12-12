import db from './db.js';

export const getAllPublishedCourses = async () => {
  const query = `
    SELECT id, title, subtitle, description, level, status, thumbnail, 
           duration_hours as durationHours, lessons_count as lessonsCount, 
           created_at 
    FROM courses 
    WHERE status = 'Published'
    ORDER BY created_at DESC
  `;
  const [rows] = await db.execute(query);
  // Add mock arrays for frontend compatibility until relations are built
  return rows.map(row => ({
    ...row,
    categories: ['Cloud'], // Placeholder
    tags: ['Tech'],        // Placeholder
    modules: []            // Placeholder
  }));
};

export const getCourseById = async (id) => {
  const query = `
    SELECT id, title, subtitle, description, level, status, thumbnail,
           duration_hours as durationHours, lessons_count as lessonsCount
    FROM courses 
    WHERE id = ?
  `;
  const [rows] = await db.execute(query, [id]);
  return rows[0];
};