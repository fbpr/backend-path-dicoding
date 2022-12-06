class AlbumsHandler {
  constructor(storageService, service, validator) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postAlbumCoverHandler = this.postAlbumCoverHandler.bind(this);
    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.getAlbumLikesByIdHandler = this.getAlbumLikesByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const albumId = await this._service.addAlbum(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._validator.validateAlbumCoverHeaders(cover.hapi.headers);
    const filename = await this._storageService.writeFile(cover, cover.hapi);

    await this._service.addAlbumCover(filename, id);
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async postAlbumLikeHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.getAlbumById(id);
    const exists = await this._service.verifyAlbumLikes(credentialId);
    const statusLike = await this._service.addAlbumLike(id, credentialId, exists);

    const response = h.response({
      status: 'success',
      message: statusLike,
    });
    response.code(201);
    return response;
  }

  async getAlbumLikesByIdHandler(request, h) {
    const { id } = request.params;

    const likes = await this._service.getAlbumLikesById(id);
    if (likes.cache) {
      return h.response({
        status: 'success',
        data: {
          likes: likes.data,
        },
      }).header('X-Data-Source', 'cache');
    }

    return {
      status: 'success',
      data: {
        likes,
      },
    };
  }
}

module.exports = AlbumsHandler;
