export type NullToUndefined<T> = null extends T
  ? Exclude<T, null> | undefined
  : T;

/**
 * prisma의 null을 request, response, dto에서 사용하기 위해 null을 undefined로 바꾸는 util type.
 *
 * 예시:
 * type PrismaModel = {
 *   name: string | null;
 *   age: number | null;
 *   memo: null;
 *   code: string;
 * };
 *
 * type Dto = NullableToUndefined<PrismaModel>;
 *
 * Dto =
 * {
 *   name: string | undefined;
 *   age: number | undefined;
 *   memo: undefined;
 *   code: string;
 * }
 *
 */
export type NullableToUndefined<T> = {
  [K in keyof T]: NullToUndefined<T[K]>;
};
