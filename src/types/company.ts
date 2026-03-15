
export type Company = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  properties?: any[]; // Define a proper type for properties if you have one
  createdAt: string;
  updatedAt: string;
};
