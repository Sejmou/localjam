<script lang="ts">
	import { db } from '$lib/db';
	import { sql } from 'drizzle-orm';

	const test = db.execute(sql`SELECT 1 + 2 AS test`);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
{#await test}
	<p>Loading...</p>
{:then result}
	<p>{JSON.stringify(result.rows)}</p>
{:catch error}
	<p>{error.message}</p>
{/await}
