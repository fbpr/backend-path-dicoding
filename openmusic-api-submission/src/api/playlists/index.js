const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  plugin: '1.0.0',
  register: async (server, { songsService, service, validator }) => {
    const playlistsHandler = new PlaylistsHandler(songsService, service, validator);
    server.route(routes(playlistsHandler));
  },
};
