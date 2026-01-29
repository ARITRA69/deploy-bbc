/**
 * User model types
 */

import { TDocument } from "../common/mongodb.types";



export type TUser<Tid= string> = TDocument<Tid> & {
  email: string;
  name: string;
}

export type TCreateUserInput = Pick<TUser, 'email' | 'name'>

export type TUpdateUserInput = Partial<Pick<TUser, 'email' | 'name'>>

export type TUserResponse = Omit<TUser, "createdAt" | "updatedAt"> & Pick<TDocument, 'createdAt' | 'updatedAt'>