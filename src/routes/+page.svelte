<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { extractAndStoreAudio } from './data-processing';

	let zipFiles = $state<FileList | undefined>(undefined);

	$effect(() => {
		if (zipFiles) {
			const file = zipFiles[0];
			if (file) {
				extractAndStoreAudio(file).then((v) => console.log(v));
			}
		}
	});
</script>

<div class="grid w-full max-w-sm items-center gap-1.5">
	<Label for="new-song">Upload Song Zip File</Label>
	<Input id="new-song" type="file" accept=".zip" bind:files={zipFiles} />
</div>
