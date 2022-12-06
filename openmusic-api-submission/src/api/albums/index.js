const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  plugin: '1.0.0',
  register: async (server, { storageService, service, validator }) => {
    const albumsHandler = new AlbumsHandler(storageService, service, validator);
    server.route(routes(albumsHandler));
  },
};
