// Role type definition (independent of Prisma Client)
export type Role = 'TEACHER' | 'STUDENT';

// Role constants for type-safe comparisons
export const Role = {
  TEACHER: 'TEACHER' as const,
  STUDENT: 'STUDENT' as const,
} as const;

