import { AtpAgent } from "@atproto/api";
import { Logger } from "./utils/LoggerUtils";
import { PlaylistService } from "./service/PlaylistService";
import { PostService } from "./service/PostService";

export class VocaClient {
	private static logger = new Logger("VocaClient");
	public static readonly api = new AtpAgent({
		service: "https://bsky.social",
	});

	public static async initialize() {
		this.logger.printInfo("Initializing...");

		await this.api.login({
			identifier: process.env.USER_MAIL!,
			password: process.env.PASSWORD!,
		});

		this.logger.printSuccess("Logged-in");

		this.logger.printSuccess("We're online!");

		PlaylistService.reloadPlaylist();

		await PostService.initializePostJob();
	}
}
