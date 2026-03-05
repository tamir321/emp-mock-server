export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: string;
}

export interface Department {
    id: string;
    name: string;
  }
  
export interface Employee {
id: string;
user: User;           // Nested Object
department: Department;
bossId?: string;      // Recursive Relationship (Optional)
subordinates: string[]; // Array of the same type
}