import { nanoid } from "nanoid";
import { Pool } from "pg";
import fs from "fs";

import { dirname, join } from "path";

class NewsService {
  constructor() {
    this._pool = new Pool();
  }

  async addNews({ title, content, image, userId }) {
    const id = `news-${nanoid(16)}`;
    const created_at = new Date().toISOString();
    const updated_at = created_at;

    const query = {
      text: "INSERT INTO news VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, content, image, created_at, updated_at, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error("Gagal menambahkan berita");
    }

    return result.rows[0].id;
  }

  async getNews() {
    const news = await this._pool.query("SELECT * FROM news");
    return news.rows;
  }

  async getNewsById(id) {
    const query = {
      text: "SELECT * FROM news WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error("Berita tidak ditemukan");
    }

    return result.rows[0];
  }

  async editNewsById(id, { title, content, image, userId }) {
    await this.verifyNews(userId, id);
    const img = await this.verifyImage(id);
    let newsImage = "";

    if (image) {
      const dirnameFile = dirname(img);
      const oldFilePath = join(dirnameFile, "uploads", img);

      fs.unlink(oldFilePath, (err) => {
        if (err && err.code !== "ENOENT") {
          throw new Error(err);
        }
      });
      newsImage = image;
    }
    if (!image) {
      newsImage = img;
    }

    const updated_at = new Date().toISOString();
    const query = {
      text: "UPDATE news SET title = $1, content = $2, image = $3, updated_at = $4 WHERE id = $5",
      values: [title, content, newsImage, updated_at, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new Error("Gagal di ubah, Id tidak ada");
    }
  }

  async deleteNewsById(id, { userId }) {
    await this.verifyNews(userId, id);
    const img = await this.verifyImage(id);
    const dirnameFile = dirname(img);
    const imgPath = join(dirnameFile, "uploads", img);
    fs.unlink(imgPath, (err) => {
      if (err && err.code !== "ENOENT") {
        throw new Error(err);
      }
    });
    const query = {
      text: "DELETE FROM news WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new Error("Gagal dihapus id tidak ditemukan");
    }
    return result.rows[0].id;
  }

  async verifyNews(userId, id) {
    const query = {
      text: "SELECT * FROM news WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error("Berita tidak ditemukan");
    }

    const idOwner = result.rows[0].owner;
    if (idOwner !== userId) {
      throw new Error("Resourch tidak bisa diakses");
    }
  }

  async verifyImage(id) {
    const query = {
      text: "SELECT image FROM news WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows[0].image;
  }
}

export default NewsService;
