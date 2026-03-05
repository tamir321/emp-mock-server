import type { Employee } from './types/employee.js'; // The Type
import { generateEmployees } from './factories/employeeFactory.js';

// The actual list of data
export let employees: Employee[] = generateEmployees(10);

export const setEmployees = (newEmployees: Employee[]) => {
    employees = newEmployees;
  };