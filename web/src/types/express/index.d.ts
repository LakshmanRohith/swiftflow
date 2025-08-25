// path: server/src/types/express/index.d.ts

// This file extends the existing Express Request type to include our custom 'user' property.
// By using declaration merging, we can add our property without replacing the original type.

declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      name: string;
    };
  }
}
