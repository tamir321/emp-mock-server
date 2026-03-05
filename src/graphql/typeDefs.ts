export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String
  }

  type Department {
    id: ID!
    name: String!
  }

  type Employee {
    id: ID!
    user: User!
    department: Department!
    bossId: String
    subordinates: [String!]!
  }
  type Query {
    employees(departmentName: String,name: String): [Employee!]!
    employee(id: ID!): Employee
  }
  
`;

// type Query {
//   employees: [Employee!]!
//   employee(id: ID!): Employee
// }