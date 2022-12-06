class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { userId, targetEmail, playlistId } = JSON.parse(message.content.toString());

      // console.log(playlistId);
      const playlists = await this._playlistsService.getPlaylistSongs(userId, playlistId);
      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(playlists, null, 2),
      );

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
