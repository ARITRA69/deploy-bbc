import express, { Router } from "express";
import { get_users } from "../controllers/user/get-users.controller.js";
import { get_user_by_id } from "../controllers/user/get-user-by-id.controller.ts";
import { create_user } from "../controllers/user/create-user.controller.js";
import { update_user } from "../controllers/user/update-user.controller.js";
import { delete_user } from "../controllers/user/delete-user.controller.js";

const route = Router();

//TODO: all other middleware like authentication and authorization

// User CRUD routes
route.get("/", get_users);
route.get("/:id", get_user_by_id);
route.post("/", create_user);
route.patch("/:id", update_user);
route.delete("/:id", delete_user);

export { route as user_route };
