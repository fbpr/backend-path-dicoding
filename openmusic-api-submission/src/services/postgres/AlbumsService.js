const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year, cover = null }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, year, cover],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const resultAlbum = await this._pool.query(queryAlbum);

    const querySongs = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };
    const resultSongs = await this._pool.query(querySongs);

    if (!resultAlbum.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    if (!resultSongs.rows.length) {
      return resultAlbum.rows
        .map(({
          id: albumId, name, year, cover,
        }) => ({
          id: albumId, name, year, coverUrl: cover,
        }))[0];
    }

    return {
      ...resultAlbum.rows[0],
      songs: resultSongs.rows,
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async addAlbumCover(filename, id) {
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/covers/${filename}`;

    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Cover album gagal ditambahkan');
    }
  }

  async addAlbumLike(albumId, userId, exists) {
    if (!exists) {
      const id = `like-${nanoid(16)}`;
      const query = {
        text: 'INSERT INTO user_album_likes VALUES($1, $2, $3)',
        values: [id, userId, albumId],
      };
      await this._pool.query(query);

      await this._cacheService.delete(`likes:${albumId}`);
      return 'Berhasil menyukai album';
    }

    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    await this._pool.query(query);
    await this._cacheService.delete(`likes:${albumId}`);
    return 'Berhasil batal menyukai album';
  }

  async getAlbumLikesById(albumId) {
    try {
      const result = JSON.parse(await this._cacheService.get(`likes:${albumId}`));
      return {
        data: result,
        cache: true,
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(album_id)::int as likes FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);

      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(result.rows[0].likes));
      return result.rows[0].likes;
    }
  }

  async verifyAlbumLikes(userId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      return 0;
    }

    return 1;
  }
}

module.exports = AlbumsService;
