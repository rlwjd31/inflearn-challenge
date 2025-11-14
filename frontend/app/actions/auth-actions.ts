"use server";

import { signIn as signInWithAuthJS } from "@/auth";
import { prisma } from "@/prisma";
import { getHashedPassword } from "@/shared/lib/auth-util";

// * @/auth에서 불러온 signIn(해당 코드에서는 signInWithAuthJS)함수를 호출하면 auth.ts에 작성한
// * authorize함수가 호출된다.
export const signIn = async (formData: FormData, redirectURL: string = "/") => {
  const result = await signInWithAuthJS("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: redirectURL,
  });

  return result;
};

// TODO: front에서 backend의 repository의 작업을 수행(user create)를 하고 있으므로 추후 backend에서 api를 만들고 호출하는 식으로 변경하여 domain을 분리하여 관심사를 명확히 하기.
export const signUp = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{
  status: number;
  message: string;
}> => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      // ? 409 conflict status code
      return { status: 409, message: "이미 존재하는 사용자입니다" };
    }

    // * 존재하는 유저가 아닐 때 새로운 user 생성
    const hashedPassword = await getHashedPassword(password);
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    return { status: 201, message: "회원가입에 성공했습니다." };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    console.error(errorMessage);

    return { status: 500, message: "회원가입에 실패했습니다" };
  }
};
