import { nanoid } from "nanoid";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyUsername({ username }) {
    const query = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);
    if (result.rows.length) {
      throw new Error("username sudah ada");
    }
  }

  async addUsers({ username, password }) {
    await this.verifyUsername({ username });
    const id = `user-${nanoid(16)}`;
    const created_at = new Date().toISOString();
    const hasedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: "INSERT INTO users VALUES($1,$2,$3,$4) RETURNING id",
      values: [id, username, hasedPassword, created_at],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new Error("Gagal menambah user baru");
    }

    return result.rows[0].id;
  }

  async loginUsers({ username, password }) {
    const query = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new Error("username tidak ditemukan");
    }

    const match = await bcrypt.compare(password, result.rows[0].password);

    if (!match) {
      throw new Error("password salah");
    }
    const userId = result.rows[0].id;

    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "5s" });

    const queryUpdate = {
      text: "UPDATE users SET refresh_token = $1 WHERE id = $2",
      values: [refreshToken, userId],
    };
    await this._pool.query(queryUpdate);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken({ refreshToken }) {
    const query = {
      text: "SELECT * FROM users WHERE refresh_token = $1",
      values: [refreshToken],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error("Anda belum login");
    }

    const userId = result.rows[0].id;

    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10000s",
    });

    return {
      accessToken,
    };
  }

  async logoutUser({ refreshToken }) {
    const query = {
      text: "SELECT * FROM users WHERE refresh_token = $1",
      values: [refreshToken],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new Error("Anda belum login");
    }

    const id = result.rows[0].id;

    const queryUpdate = {
      text: "UPDATE users SET refresh_token = $1 WHERE id = $2",
      values: [null, id],
    };

    await this._pool.query(queryUpdate);
  }
}

export default UsersService;
