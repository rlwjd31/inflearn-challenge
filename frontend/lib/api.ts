"use server";

import {
  categoriesControllerFindAll,
  coursesControllerCreate,
  coursesControllerFindAll,
  coursesControllerFindOne,
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

export const getCourseById = async (id: string) => {
  const { data, error } = await coursesControllerFindOne({
    path: { id },
  });

  if (error) {
    throwApiError(error as ApiError);
  }

  return { data };
};
