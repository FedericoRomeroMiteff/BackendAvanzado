import  userService  from "../services/index.js";
import  RouterClass from "./routerClass.js";

class UserRouter extends RouterClass {
  init() {
    this.get("/", ["PUBLIC"], async (req, res) => {
      try {
        const users = await userService.getUsers();

        res.sendSuccess(users);
      } catch (error) {
        res.sendServerError(error);
      }
    });
  }
}

export default UserRouter;
