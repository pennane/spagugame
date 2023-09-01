import { GraphQLScalarType, Kind } from "graphql";

export const dateScalar = new GraphQLScalarType<Date, number>({
  name: "Date",
  description: "Date scalar",
  serialize(value) {
    if (!(value instanceof Date)) return 0;
    return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    if (typeof value !== "number") return new Date(0);
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10));
    }
    // Invalid hard-coded value (not an integer)
    return new Date(0);
  },
});
