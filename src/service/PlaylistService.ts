import { readFileSync } from "fs";
import { IPlaylistSong } from "../struct/IPlaylistSong";
import { Logger } from "../utils/LoggerUtils";

export class PlaylistService {
	private static logger = new Logger("PlaylistService");
	public static readonly songs = new Map<string, IPlaylistSong>();
	public static readonly singerTags = new Map<string, string>();

	public static reloadPlaylist() {
		this.logger.printInfo("Reloading playlist...");

		const playlistCache = JSON.parse(
			readFileSync("./src/cache/playlist.json", "utf8")
		) as { tags: { [key: string]: string }; songs: IPlaylistSong[] };

		this.songs.clear();
		this.singerTags.clear();

		for (const song of playlistCache.songs) {
			this.songs.set(song.id, song);
		}

		for (const tagKey of Object.keys(playlistCache.tags)) {
			this.singerTags.set(tagKey, playlistCache.tags[tagKey]);
		}

		this.logger.printSuccess(
			`Playlist reloaded with ${this.songs.size} songs`
		);
	}

	public static getRandomSong() {
		const randomIndex = Math.floor(Math.random() * this.songs.size);
		const keysArray = Array.from(this.songs.keys());

		return this.songs.get(keysArray[randomIndex])!;
	}
}
