# 🚀 QA Mock Data ServerA dual-protocol 

mock server designed to unblock QA automation development. It provides a flexible environment to simulate various system responses using both REST and GraphQL.📍 Service EndpointsServiceLocal URLDescriptionGraphQL Sandboxhttp://localhost:4000/Apollo Sandbox for schema exploration.REST APIhttp://localhost:3000Main REST entry point.Swagger Docshttp://localhost:3000/api-docsInteractive API documentation.🛠️ Getting StartedLocal DevelopmentRun the server directly using tsx (requires Node.js and dependencies):Bashnpx tsx src/index.ts
Docker (Recommended)Use Docker Compose to manage the lifecycle with environment variables pre-configured:Bash# Start the server
docker-compose up -d --build

# Stop the server
docker-compose down
Production Build & RunTo simulate the production environment (Multi-stage build):Bash# Build the image
docker build -t qa-automation-server .

# Run the container (Production Mode)
docker run -d --rm \
  --name qa-automation-server \
  -p 3000:3000 \
  -p 4000:4000 \
  -e NODE_ENV=production \
  -e REST_PORT=3000 \
  -e GQL_PORT=4000 \
  qa-automation-server
🔍 GraphQL Query ExamplesUse these queries in the Apollo Sandbox (:4000) to verify data structures.Get All Employees with DepartmentsGraphQLquery GetAllEmployeesWithDepts {
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
Get Single Employee (by ID)Variables: {"employeeId": "09975dd0-bdde-4dc7-8f3c-df1e0619b6a1"}GraphQLquery Employee($employeeId: ID!) {
  employee(id: $employeeId) {
    id
    user {
      username
    }
    department {
      name
    }
  }
}
Filtered SearchGraphQL# By Department
query {
  employees(departmentName: "Engineering") {
    user { username }
  }
}

# By Name Prefix
query {
  employees(name: "Ka") {
    user { username }
  }
}
🚑 TroubleshootingStuck Containers (Linux/Ubuntu)If the container refuses to stop due to permission issues:Bash# 1. Get the Process ID (PID)
docker inspect -f '{{.State.Pid}}' qa-automation-server

# 2. Force Kill the process (replace 1234 with the actual PID)
sudo kill -9 1234
CleanupRemove all stopped containers:Bashdocker rm $(docker ps -a -q)
