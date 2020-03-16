// Imports
import argon2 from "argon2";
import basicAuth from "basic-auth";
import { Action } from "routing-controllers";
import { Container } from "typedi";

import UserService from "../services/User.service";

// Auth Checker
export default async (action: Action): Promise<boolean> => {
    // Get UserService
    const service = Container.get(UserService);

    // Get request data
    const req = action.request;

    // Parse request body for credentials
    const credentials = basicAuth(req);

    // If credentials were not found, deny access
    if (!credentials) return false;

    // Otherwise, attempt to find user by email address
    const user = await service.getUserByEmail(credentials.name);

    // If user was not found, deny access
    if (!user) return false;

    // Otherwise, grant access only if password matches
    return argon2.verify(user.password, credentials.pass);
};