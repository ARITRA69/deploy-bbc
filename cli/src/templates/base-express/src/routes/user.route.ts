import express from "express";
import { get_users } from "../controllers/user/get-users.controller.js";
import { get_user } from "../controllers/user/get-user.controller.js";
import { create_user } from "../controllers/user/create-user.controller.js";
import { update_user } from "../controllers/user/update-user.controller.js";
import { delete_user } from "../controllers/user/delete-user.controller.js";

const user_route = express.Router();

// User CRUD routes
user_route.get("/", get_users);
user_route.get("/:id", get_user);
user_route.post("/", create_user);
user_route.patch("/:id", update_user);
user_route.delete("/:id", delete_user);

export default user_route;
