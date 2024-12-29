<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		const ws = new WebSocket(`ws://localhost:4000`);
		ws.addEventListener('open', () => {
			console.log('hey');
		});

		ws.addEventListener('message', (message: any) => {
			console.log(message);
		});
	});
</script>

<h1>Hi</h1>
<p>Hoadjfk sajdkf ajlsdkfaslkdf</p>
