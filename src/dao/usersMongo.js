import { userModel } from "./models/users.model.js";

class UsersMongo {
  constructor() {
    this.model = userModel;
  }

  async getUsers() {
    return await this.model.find({});
  }

  async getUser(filter) {
    return await this.model.findOne(filter);
  }

  async createUser(newUser) {
    return await this.model.create(newUser);
  }

  async updateUser(uid, updatedUser) {
    return await this.model.findByIdAndUpdate(uid, updatedUser, {
      new: true,
    });
  }

  async deleteUser(uid) {
    return await this.model.findByIdAndDelete(uid);
  }
}

export default UsersMongo;
