const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(playlistsService, service, validator) {
    this._playlistsService = playlistsService;
    this._service = service;
    this._validator = validator;

    this.postExportPlaylistSongsHandler = this.postExportPlaylistSongsHandler.bind(this);
  }

  async postExportPlaylistSongsHandler(request, h) {
    try {
      this._validator.validateExportPlaylistSongsPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
        playlistId,
      };

      await this._service.sendMessage('export:playlists', JSON.stringify(message));
      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = ExportsHandler;
