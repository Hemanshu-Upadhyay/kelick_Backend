import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Query {
    getTaxData(userId: String!): TaxData
  }

  type TaxData {
    employeeName: String
    taxYear: String
    taxableIncome: Int
    taxAmount: Int
  }
`);
