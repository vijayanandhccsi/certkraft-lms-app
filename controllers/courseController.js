import * as CourseModel from '../models/courseModel.js';

export const getCourses = async (req, res, next) => {
  try {
    const courses = await CourseModel.getAllPublishedCourses();
    res.status(200).json({
      success: true,
      data: courses,
      message: 'Courses retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await CourseModel.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Course not found'
      });
    }
    res.status(200).json({
      success: true,
      data: course,
      message: 'Course details retrieved'
    });
  } catch (error) {
    next(error);
  }
};