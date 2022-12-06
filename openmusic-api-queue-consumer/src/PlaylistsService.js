const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(owner, playlistId) {
    const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name
      FROM playlists
      LEFT JOIN users ON users.id = playlists.owner
      LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE (playlists.owner = $1 OR collaborations.user_id = $1) AND playlists.id = $2
      GROUP BY playlists.id, users.username`,
      values: [owner, playlistId],
    };
    const resultPlaylist = await this._pool.query(queryPlaylist);

    const querySongs = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM songs
      LEFT JOIN playlist_songs ON playlist_songs.song_id = songs.id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };
    const resultSongs = await this._pool.query(querySongs);

    return {
      playlist: {
        ...resultPlaylist.rows[0],
        songs: resultSongs.rows,
      },
    };
  }
}

module.exports = PlaylistsService;
