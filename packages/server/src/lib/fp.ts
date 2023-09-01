import * as R from "ramda";

export const isNilOrEmpty = <T>(v: T) => R.isNil(v) || R.isEmpty(v);
