// path: server/src/api/auth/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, generateToken } from './auth.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await registerUser(req.body);
    const token = generateToken(user.id);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await loginUser(req.body);
    const token = generateToken(user.id);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error: any) {
     // Specifically handle "Invalid credentials" to send a 401 status
    if (error.message === 'Invalid credentials') {
        return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    // The user object is attached to the request in the requireAuth middleware
    // We need to extend the Express Request type to include our user property
    const user = (req as any).user;

    if (!user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    res.status(200).json({ user });
};
