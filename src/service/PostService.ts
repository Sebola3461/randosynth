import moment from "moment";
import { PlaylistService } from "./PlaylistService";
import path from "path";
import { Constants } from "../Constants";
import { readFileSync } from "fs";
import { VocaClient } from "../VocaClient";
import { RichText } from "@atproto/api";
import { Logger } from "../utils/LoggerUtils";

export class PostService {
	private static logger = new Logger("PostService");
	private static _latestPostDate = moment();

	public static get latestPostDate() {
		return this._latestPostDate;
	}

	public static async initializePostJob() {
		this.postNewSong();

		setInterval(() => this.postSongJob(), 3.6e6); // 1 hour
	}

	private static async postSongJob() {
		await this.postNewSong();

		this._latestPostDate = moment();
	}

	public static async postNewSong() {
		try {
			this.logger.printInfo("Posting a new song...");

			const songToPost = PlaylistService.getRandomSong();
			const songMvBuffer = readFileSync(
				path.join(Constants.MediaBasePath, songToPost.file_name)
			);

			this.logger.printInfo(
				`Uploading ${songToPost.artist} - ${songToPost.title} mv...`
			);

			const songMvUploadResult = await VocaClient.api.uploadBlob(
				songMvBuffer,
				{
					encoding: songToPost.file_mime,
				}
			);

			this.logger.printSuccess(`MV uploaded!`);

			let songTitleMetadata = `${songToPost.artist} - ${songToPost.title}`;

			// Format like <artist> - <title> / <artist unicode> - <title unicode>
			if (songToPost.artist_original || songToPost.title_original) {
				songTitleMetadata = songTitleMetadata.concat(" / ");

				songTitleMetadata = songTitleMetadata.concat(
					songToPost.artist_original || songToPost.artist
				);
				songTitleMetadata = songTitleMetadata.concat(" - ");
				songTitleMetadata = songTitleMetadata.concat(
					songToPost.title_original || songToPost.title
				);
			}

			// Add singers
			let songSingersMetadata = `Featuring as singer${
				songToPost.singers.length > 1 ? "s" : ""
			}:\n`; // add plural for singer

			songSingersMetadata = songSingersMetadata.concat(
				songToPost.singers
					.map(
						(singer, i) =>
							`${singer.name} • #${PlaylistService.singerTags.get(
								singer.tag_key
							)}`
					)
					.join(" / ")
			);

			const songExtraData = `${songToPost.extra_tags
				.map((tag) => `#${tag}`)
				.join(" ")}`;

			const postRichText = new RichText({
				text: `${songTitleMetadata}\n\n${songSingersMetadata}\n\n${songExtraData}`,
			});

			await postRichText.detectFacets(VocaClient.api);

			try {
				await VocaClient.api.post({
					text: postRichText.text,
					tags: songToPost.extra_tags.concat(),
					facets: postRichText.facets,
					embed: {
						$type: "app.bsky.embed.video",
						video: songMvUploadResult.data.blob,
					},
				});

				this.logger.printSuccess(`Posted ${songToPost.title}!`);
			} catch (error) {
				this.logger.printError(
					`Can't post ${songToPost.title}:`,
					error
				);
			}
		} catch (error) {
			this.logger.printError(`Can't post a new song:`, error);
		}
	}
}
