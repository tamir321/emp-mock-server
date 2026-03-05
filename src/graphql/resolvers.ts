import { employees } from '../data.js'; 
import type { Employee } from '../types/employee.js';

export const resolvers = {
  Query: {
    // 1. Fetch a list of employees with optional filters
    employees: (
      _: any, 
      { departmentName, name }: { departmentName?: string; name?: string }
    ) => {
      // Start with a copy of the full dataset
      let filteredList = [...employees];

      // Filter by Department (Exact match, case-insensitive)
      if (departmentName) {
        filteredList = filteredList.filter((emp: Employee) => 
          emp.department && 
          emp.department.name.toLowerCase() === departmentName.toLowerCase()
        );
      }

      // Filter by Username (Starts with, case-insensitive)
      if (name) {
        filteredList = filteredList.filter((emp: Employee) => 
          emp.user && 
          emp.user.username.toLowerCase().startsWith(name.toLowerCase()) 
        );
      }

      return filteredList;
    },

    // 2. Fetch a single employee by their unique ID
    employee: (_: any, { id }: { id: string }) => {
      return employees.find((emp: Employee) => emp.id === id);
    },
  },
};