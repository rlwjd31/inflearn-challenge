"use server";

import {
  categoriesControllerFindAll,
  coursesControllerCreate,
  coursesControllerFindAll,
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

  // @FIXME: title이 "" 빈 값일 때 400 에러가 아닌 500에러가 발생함.
  if (error) {
    throwApiError(error as ApiError);
  }

  return {
    data,
  };
};
