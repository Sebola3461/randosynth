# RandoSynth

#### Posts random vocaloid (or any song that you add)!

## Setup

### Requirements

-   Node.js (16+)
-   Typescript `npm i -g typescript`
-   Bsky account

### Setting up development

1. Clone repository

```sh
git clone https://github.com/Sebola3461/randosynth.git
```

2. Install dependencies

```sh
yarn
# or
npm i
```

3. Setup .env file

```env
USER_MAIL=Your bot account email
PASSWORD=Account password
```

4. Create a folder in the root path `/media` and add your mv files into
5. Setup playlist configuration (check next category)
6. Build and run

```sh
tsc && node build/index.js
```

### Setting up playlist

Check below how the `playlist.json` file works

```json
{
	"tags": {
		"tag_key": "tag_value_to_insert_into_post" // Example

  	"hatsune_miku": "hatsunemiku",
	},
	"songs": [{
			"id": "iyowa:mukonoanata", // artist:unique_id
			"title": "You are Innocent Monster", // Romanized title
			"title_original": "無辜のあなた", // Original title
			"artist": "iyowa", // Romanized artist
			"artist_original": "いよわ", // Original artist
			"time_range": [0, 0], // Timestap ref (no need to fill cuz its deprecated)
			"file_name": "iyowa_mukonoanata.mp4", // filename into /media folder (artist/id)
			"file_mime": "video/mp4", // video mime type
			"mv_url": "https://www.youtube.com/watch?v=HPPp1cb5rcc", // original mv url
			"singers": [
				{
					"name": "Hatsune Miku", // Romanized name
					"name_original": "初音ミク", // Original name
					"tag_key": "hatsune_miku" // tag key (check tags object)
				},
				{
					"name": "flower",
					"name_original": null,
					"tag_key": "flower"
				}
			],
			"extra_tags": ["sleeping_pink_noise", "experimental", "j-pop"] // Extra tags to add into the footer
		}]
}
```
