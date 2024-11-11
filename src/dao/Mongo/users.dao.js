import { userModel } from "../Mongo/models/users.model.js";

class UserDAO {
  async createUser(userData) {
    return await userModel.create(userData);
  }

  async getUserByEmail(email) {
    return await userModel.findOne({ email });
  }

  async getUserById(id) {
    return await userModel.findById(id);
  }
}

export const userDAO = new UserDAO();
