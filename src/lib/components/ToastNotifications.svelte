<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import type { item } from '$lib/supabase/supabase';
	export let items: any = [];

	// $: if (items.length > 0) {
	// 	const thisItem = items[items.length - 1];
	// 	setTimeout(() => {
	// 		items = items.filter((i: item) => i.id !== thisItem.id);
	// 	}, 3000);
	// }

	// function addToast(severity: string, message: string) {
	// 	let newItem: item = {
	// 		id: Date.now(),
	// 		severity,
	// 		message
	// 	};
	// 	items = [...items, newItem];
	// }
</script>

<!-- Toast notifications -->
<div id="toast-notifications">
	<ul>
		{#each items as item (item.id)}
			<li
				class="toast 
		{item.severity === 'SUCCESS' ? 'success' : ''}
		{item.severity === 'FAILED' ? 'failed' : ''}"
				animate:flip
				in:fade
				out:fly={{ x: 100 }}
			>
				{#if item.severity === 'SUCCESS'}
					<img
						class=""
						src="/toast/check.svg"
						alt=""
						width="18"
						height="18"
						loading="lazy"
						decoding="async"
					/>
				{:else if item.severity === 'FAILED'}
					<img
						class=""
						src="/toast/close.svg"
						alt=""
						width="18"
						height="18"
						loading="lazy"
						decoding="async"
					/>
				{/if}
				<p>{item.message}</p>
			</li>
		{/each}
	</ul>
</div>
