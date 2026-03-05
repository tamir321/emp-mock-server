import { faker } from '@faker-js/faker';
import type{ Employee, User, Department } from '../types/employee.js';

export const createRandomEmployee = (forcedDepartment?: string): Employee => {
  const user: User = {
    id: faker.string.uuid(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    createdAt: faker.date.past().toISOString(),
  };

  const department: Department = {
    id: faker.string.uuid(),
    name: forcedDepartment ||faker.helpers.arrayElement(['Engineering', 'HR', 'Sales', 'Marketing']),
  };

  return {
    id: faker.string.uuid(),
    user,
    department,
    subordinates: [], // Start empty
    bossId: undefined, 
  };
};

// This is like ModelFactory.create_batch(X)
export const generateEmployees = (count: number , department?: string): Employee[] => {
  return Array.from({ length: count }, ()=> createRandomEmployee(department));
};