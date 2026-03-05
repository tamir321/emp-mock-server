the server have two end points 
 GraphQL Server ready at: http://0.0.0.0:4000/
🚀 REST Server ready at: http://localhost:3000
📄 Swagger Docs: http://localhost:3000/api-docs

npx tsx src/index.ts 
docker-compose up -d --build
docker-compose down
docker inspect -f '{{.State.Pid}}' qa-automation-server
sudo kill -9 1234


docker build -t qa-automation-server .
docker run -d --rm  --name qa-automation-server   -p 3000:3000   -p 4000:4000   -e NODE_ENV=production   -e REST_PORT=3000   -e GQL_PORT=4000   qa-automation-server
docker rm $(docker ps -a -q)

graqhql query examples:
query GetAllEmployeesWithDepts {
  employees {
    user {
      username
    }
    department {
      id
      name
    }
  }
}

query Employee($employeeId: ID!) {
  employee(id: $employeeId) {
    id,
    user {
      username
    }
    department {
      name
    }
  }
}
{
  "employeeId": "09975dd0-bdde-4dc7-8f3c-df1e0619b6a1"
}

query {
  employees(departmentName: "Engineering") {
    user {
      username
    }
  }
}

query {
  employees(name:  "Ka") {
    user {
      username
    }
  }
}