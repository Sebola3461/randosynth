export interface IPlaylistSong {
	id: string;
	title: string;
	title_original: string | null;
	artist: string;
	artist_original: string | null;
	time_range: [number, number];
	file_name: string;
	file_mime: string;
	mv_url: string;
	singers: IPlaylistSongSinger[];
	extra_tags: string[];
}

export interface IPlaylistSongSinger {
	name: string;
	name_original: string | null;
	tag_key: string;
}
