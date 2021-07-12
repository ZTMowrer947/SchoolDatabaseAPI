export interface User {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  estimatedTime: string | null;
  materialsNeeded: string | null;
  creator: User;
}
