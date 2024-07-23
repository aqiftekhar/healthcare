"use server";

import { ID, Query } from "node-appwrite";
import { users } from "../Appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
  try {
    const new_user = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    
    return parseStringify(new_user);
  } catch (error: any) {
    if (error && error?.code === 409) {
      const documents = await users.list([Query.equal("email", [user.email])]);

      return documents?.users[0];
    }
  }
};

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);
        return parseStringify(user);
    } catch (error) {
        console.log(error);
        
    }
}