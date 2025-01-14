<script lang="ts">
	import { onMount } from 'svelte';

	const TAGS = {
		'E3 4E 73 2D': 'TAG_A',
		'43 42 73 2D': 'TAG_B',
		'53 3C 73 2D': 'TAG_C',

		'FF F 1D 46 25 00 00': 'STICKER_APPLE',
		'FF F B9 F 25 00 00': 'STICKER_BANANA',
		'FF F 29 46 25 00 00': 'STICKER_CANTALOUPE',

		'FF F 4C 46 25 00 00': 'STICKER_ANT',
		'FF F CA 6E 25 00 00': 'STICKER_BEE',
		'FF F 34 46 25 00 00': 'STICKER_CATERPILLAR',

		'FF F D0 E7 24 00 00': 'STICKER_ANDY',
		'FF F C4 E7 24 00 00': 'STICKER_BELLE',
		'FF F 58 46 25 00 00': 'STICKER_COLIN'
	};

	let reader1: string = $state('');
	let reader2: string = $state('');
	let reader3: string = $state('');

	let reader1Timeout: ReturnType<typeof setTimeout>;
	let reader2Timeout: ReturnType<typeof setTimeout>;
	let reader3Timeout: ReturnType<typeof setTimeout>;

	const PEOPLE_TAGS = ['STICKER_ANDY', 'STICKER_BELLE', 'STICKER_COLIN'];
	const FRUIT_TAGS = ['STICKER_APPLE', 'STICKER_BANANA', 'STICKER_CANTALOUPE'];
	const BUG_TAGS = ['STICKER_ANT', 'STICKER_BEE', 'STICKER_CATERPILLAR'];

	onMount(async () => {
		const ws = new WebSocket(`ws://localhost:4000`);
		ws.addEventListener('open', () => {
			console.log('Connection established');
		});

		ws.addEventListener('message', (message: any) => {
			try {
				const data = JSON.parse(message.data);

				switch (data.reader) {
					case '1': {
						clearTimeout(reader1Timeout);
						reader1 = TAGS[data.tag as unknown as keyof typeof TAGS] ?? data.tag;
						reader1Timeout = setTimeout(() => {
							reader1 = '';
						}, 2000);
						break;
					}

					case '2': {
						clearTimeout(reader2Timeout);
						reader2 = TAGS[data.tag as unknown as keyof typeof TAGS] ?? data.tag;
						reader2Timeout = setTimeout(() => {
							reader2 = '';
						}, 2000);
						break;
					}

					case '3': {
						clearTimeout(reader3Timeout);
						reader3 = TAGS[data.tag as unknown as keyof typeof TAGS] ?? data.tag;
						reader3Timeout = setTimeout(() => {
							reader3 = '';
						}, 2000);
						break;
					}
				}
			} catch (err) {
				console.error('Failed to parse ws data');
				console.error(err);
			}
		});
	});

	let isAllPeople = $derived(
		//PEOPLE_TAGS.includes(reader1) &&
		PEOPLE_TAGS.includes(reader2) && PEOPLE_TAGS.includes(reader3)
	);
	let isAllBugs = $derived(
		//BUG_TAGS.includes(reader1) &&
		BUG_TAGS.includes(reader2) && BUG_TAGS.includes(reader3)
	);
	let isAllFruits = $derived(
		//FRUIT_TAGS.includes(reader1) &&
		FRUIT_TAGS.includes(reader2) && FRUIT_TAGS.includes(reader3)
	);

	$effect(() => {
		if (reader1 === 'STICKER_APPLE' || reader2 === 'STICKER_APPLE' || reader3 === 'STICKER_APPLE') {
			fetch(`http://localhost:4000/osc/1`);
		}
	});

	$effect(() => {
		if (
			reader1 === 'STICKER_BANANA' ||
			reader2 === 'STICKER_BANANA' ||
			reader3 === 'STICKER_BANANA'
		) {
			fetch(`http://localhost:4000/osc/2`);
		}
	});

	$effect(() => {
		if (
			reader1 == 'STICKER_CANTALOUPE' ||
			reader2 == 'STICKER_CANTALOUPE' ||
			reader3 === 'STICKER_CANTALOUPE'
		) {
			fetch(`http://localhost:4000/osc/3`);
		}
	});

	$effect(() => {
		if (isAllFruits || isAllBugs || isAllPeople) {
			console.info('pulse');
			fetch('http://localhost:4000/osc');
		}
	});

	function handleClick() {
		reader1 = 'STICKER_BANANA';
		reader2 = 'STICKER_APPLE';
		reader3 = 'STICKER_CANTALOUPE';

		setTimeout(() => {
			reader1 = '';
			reader2 = '';
			reader3 = '';
		}, 2000);
	}
</script>

<div class="grid grid-cols-3 w-full gap-4 p-4">
	<div class="border p-4">
		<p>Reader 1:</p>
		<p>{reader1 ?? '-'}</p>
	</div>
	<div class="border p-4">
		<p>Reader 2:</p>
		<p>{reader2 ?? '-'}</p>
	</div>
	<div class="border p-4">
		<p>Reader 3:</p>
		<p>{reader3 ?? '-'}</p>
	</div>
</div>

<div class="p-4 text-center text-[20vw]">
	{#if isAllPeople}
		👫
	{/if}

	{#if isAllBugs}
		🪲
	{/if}

	{#if isAllFruits}
		🥝
	{/if}
</div>

<div>
	<button onclick={handleClick}> All Fruits </button>
</div>
