"use server";

import {
  categoriesControllerFindAll,
  coursesControllerCreate,
  coursesControllerFindAll,
  coursesControllerFindOne,
  coursesControllerUpdate,
  sectionsControllerCreate,
  sectionsControllerDelete,
  sectionsControllerUpdate,
  UpdateCourseDto,
} from "@/generated/openapi-client";

type ApiError = {
  statusCode: number;
  message: string;
};

const throwApiError = (error: ApiError) => {
  throw new Error(`${error.statusCode}: ${error.message}`);
};

export const getAllCategories = async () => {
  const { data, error } = await categoriesControllerFindAll();

  return {
    data,
    error,
  };
};

export const getAllInstructorCourses = async () => {
  const { data, error } = await coursesControllerFindAll();

  return { data, error };
};

export const createCourse = async (title: string) => {
  const { data, error } = await coursesControllerCreate({
    body: {
      title,
    },
  });

  if (error) {
    throwApiError(error as ApiError);
  }

  return {
    data,
  };
};

export const getCourseById = async (id: string, include?: string) => {
  const { data, error } = await coursesControllerFindOne({
    path: { id },
    query: {
      include: include ?? "sections,lectures",
    },
  });

  if (error) {
    throwApiError(error as ApiError);
  }

  return { data };
};

export const updateCourse = async (id: string, data: UpdateCourseDto) => {
  const { data: course, error } = await coursesControllerUpdate({
    path: { id },
    body: data,
  });

  if (error) {
    throwApiError(error as ApiError);
  }

  return { data: course };
};

// * ==================== CRUD Operation of section apis ====================
export const createSection = async (courseId: string, title: string) => {
  const { data: section, error } = await sectionsControllerCreate({
    path: { courseId },
    body: { title },
  });

  if (error) {
    throwApiError(error as ApiError);
  }

  return { data: section };
};

export const updateSectionTitle = async (sectionId: string, title: string) => {
  const { data: section, error } = await sectionsControllerUpdate({
    path: { sectionId },
    body: { title },
  });

  if (error) {
    throwApiError(error as ApiError);
  }

  return { data: section };
};

export const deleteSection = async (sectionId: string) => {
  const { data: section, error } = await sectionsControllerDelete({
    path: { sectionId },
  });

  if (error) {
    throwApiError(error as ApiError);
  }

  return { data: section };
};


