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
  // null이 포함된 필드는 optional로
  [K in keyof T as null extends T[K] ? K : never]?: Exclude<T[K], null>;
} & {
  // null이 없는 필드는 그대로
  [K in keyof T as null extends T[K] ? never : K]: T[K];
};

// * as는 `타입 단언`과 `key remapping`을 수행한다.
// * key에서 사용될 때는 키를 "변환"하는 역할을 한다.
// * 예시: K in keyof T as (null extends T[K] ? K : never)
// *      => key의 value의 type이 null을 포함한다면 key를 그대로 유지,
// *       null을 포함하지 않는다면 never로 변환 -> 이때는 key가 제거된다.
