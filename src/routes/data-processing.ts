import JSZip from 'jszip';
import type { default as ZipArchive } from 'jszip';
import { parseBlob } from 'music-metadata';
import { db } from '$lib/db';
import { songs, tracks } from '$lib/db/schema';
import type { Song, Track } from '$lib/db/schema';

async function getOPFSRoot(): Promise<FileSystemDirectoryHandle> {
	return await navigator.storage.getDirectory();
}

async function hashBlob(blob: Blob, algorithm = 'SHA-256'): Promise<string> {
	const buffer = await blob.arrayBuffer();
	const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function parseAndStoreZipAudioFile(
	zip: ZipArchive,
	path: string,
	songId: string
): Promise<Track> {
	const audioEntry = zip.file(path)!;
	const blob = await audioEntry.async('blob');
	const contentHash = await hashBlob(blob);
	const fileExtension = path.split('.').pop()!;
	const metadata = await parseBlob(blob);
	console.log(metadata);

	// create file in tracks subfolder of root; use `{contentHash}.{fileExtension}` as filename
	const root = await getOPFSRoot();
	const tracksDir = await root.getDirectoryHandle('tracks', { create: true });
	const fileHandle = await tracksDir.getFileHandle(`${contentHash}.${fileExtension}`, {
		create: true
	});
	const writable = await fileHandle.createWritable();
	await writable.write(blob);
	await writable.close();

	const track = (
		await db
			.insert(tracks)
			.values({
				songId,
				contentHash,
				fileExtension,
				label: path
			})
			.returning()
	)[0];
	return track;
}

async function createSongFromZip(zipFile: File): Promise<Song> {
	const zip = new JSZip();
	await zip.loadAsync(zipFile);

	// Fix: zip.forEach callback can't be async; collect paths first
	const audioPaths: string[] = [];
	zip.forEach((path) => {
		if (path.match(/\.(mp3|wav|ogg|flac)$/i)) {
			// Fixed regex (single backslash)
			audioPaths.push(path);
		}
	});

	if (audioPaths.length == 0) {
		throw new Error('No audio files found in zip');
	}

	const song = (
		await db
			.insert(songs)
			.values({
				title: 'Untitled',
				artist: 'Unknown'
			})
			.returning()
	)[0];

	// Process sequentially to avoid quota/permission race conditions
	for (const path of audioPaths) {
		parseAndStoreZipAudioFile(zip, path, song.id);
	}

	return song;
}

export { createSongFromZip as extractAndStoreAudio };
