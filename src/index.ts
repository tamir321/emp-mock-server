import express from 'express';
import type { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { startStandaloneServer } from '@apollo/server/standalone'; // Standard import
import { typeDefs } from './graphql/typeDefs.js'//'./graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import { employees, setEmployees } from './data.js'; 
import { generateEmployees } from './factories/employeeFactory.js';
import { Employee } from './types/employee.js';
import 'dotenv/config'; // This loads the .env variables immediately


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
export let employeesResponse = {
  status: 200,
  message: "Success"
};

// Use a fallback (||) in case the .env file is missing or a variable is deleted
const REST_PORT = Number(process.env.REST_PORT) || 3000;
const GQL_PORT = Number(process.env.GQL_PORT) || 4000;

app.use(express.json());
// app.use(cors());

// --- Swagger Setup ---
const swaggerPath = path.join(process.cwd(), 'docs', 'swagger.yaml');
try {
  const swaggerDocument = YAML.load(swaggerPath);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.error("❌ Swagger Load Error:", error);
}

// --- REST Routes ---
app.get('/employees', (req, res) => {
  if (employeesResponse.status !== 200) {
    return res.status(employeesResponse.status).json({ 
      error: employeesResponse.message 
    });
  }

  // Otherwise, return the actual data
  res.json(employees);
});

app.post('/seed', (req, res) => {
  const count = parseInt(req.body.count) || 10;
  setEmployees(generateEmployees(count));
  res.json({ message: "Seeded!", count: employees.length });
});

app.post('/emp_response', (req: Request, res: Response) => {
  const newStatus = parseInt(req.body.status);
  
  if (isNaN(newStatus)) {
    return res.status(400).json({ error: "Status must be a valid number" });
  }

  employeesResponse.status = newStatus;
  employeesResponse.message = req.body.message || `The employee get function status was changed to ${newStatus}`;

  console.log(`[Mock Control] Updated global response to: ${employeesResponse.status}`);

  res.json({
    message: `Get employees response was updated to ${employeesResponse.status}`,
    currentConfig: employeesResponse
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.post('/graphql', async (req, res) => {
  const { query, variables } = req.body;

  try {
    // Forward the request to your own /graphql endpoint
    const response = await fetch(`http://localhost:${GQL_PORT}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();

    if (result.data && result.data.employees) {
      result.data.employees = result.data.employees.map((emp:Employee) => {
        if (emp.user && emp.user.username){
            // Extract the username and create a new 'name' field
          const  _username  = emp.user.username;
          emp.user.username = `trik_${_username}`
          return emp;
        }
        else {
          return emp;
        }
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch and rename data" });
  }
});

// --- Start Functions ---

const startServers = async () => {
  // 1. Initialize Apollo
  const server = new ApolloServer({ typeDefs, resolvers ,introspection: true, 
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],});

  // 2. Start GraphQL on Port 4000
  const { url } = await startStandaloneServer(server, {
    listen: { port: GQL_PORT },
  });
  console.log(`📊 GraphQL Server ready at: ${url}`);

  // 3. Start Express on Port 3000
  app.listen(REST_PORT, () => {
    console.log(`🚀 REST Server ready at: http://localhost:${REST_PORT}`);
    console.log(`📄 Swagger Docs: http://localhost:${REST_PORT}/api-docs`);
  });
};

startServers();