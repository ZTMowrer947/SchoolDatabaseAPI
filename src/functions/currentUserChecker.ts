// Imports
import basicAuth from "basic-auth";
import { Action, InternalServerError } from "routing-controllers";
import { Container } from "typedi";

import User from "../database/entities/User.entity";
import UserService from "../services/User.service";

// Current User Checker
export default async (action: Action): Promise<User | undefined> => {
    // Get UserService
    const service = Container.get(UserService);

    // Get request data
    const req = action.request;

    // Parse request body for credentials
    const credentials = basicAuth(req);

    // If credentials were not found, throw 500 error
    if (!credentials)
        throw new InternalServerError(
            "Credentials not present on authorized request."
        );

    // Otherwise, find user by email address
    const user = await service.getUserByEmail(credentials.name);

    // Return user
    return user;
};