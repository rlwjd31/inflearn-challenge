import { compare, hash } from "bcryptjs";

// * 오늘날 가장 많이 사용되는 salt round 값은 10 ~ 12
// * 값이 커질수록 해시 계산이 느려져 보안성은 커지지면 응답 지연이 발생
// const salt = genSaltSync(saltRound)
// const hash = hashSync(password, salt)
// 아래 코드와 결국 같음 hash method는 내부에서 salt를 생성함.
export const getHashedPassword = async (
  password: string,
  saltRound: number = 10
) => hash(password, saltRound);

export const comparePassword = async (
  plainPassword: string,
  hashPassword: string
) => compare(plainPassword, hashPassword);
