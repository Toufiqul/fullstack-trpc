// UserModel.ts

interface User {
  id: string;
  name: string;
}

class UserModel {
  private users: User[] = [];
  private nextId: number = 1;

  // Method to create a new user
  async create(data: { name: string }): Promise<User> {
    const newUser: User = {
      id: this.nextId.toString(),
      name: data.name,
    };
    this.users.push(newUser);
    this.nextId++;
    return newUser;
  }

  // Method to get a user by ID
  async getById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  // Method to get all users
  async getAll(): Promise<User[]> {
    return this.users;
  }
}

export default new UserModel();
