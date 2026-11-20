// 型が同じかを、コンパイルのときに確かめるための道具。

/** A と B がぴったり同じ型なら true、そうでなければ false。 */
export type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

/** true でなければコンパイルエラーにする。Expect<Equal<A, B>> のように使う。 */
export type Expect<T extends true> = T;
