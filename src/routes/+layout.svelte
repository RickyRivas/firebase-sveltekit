<script lang="ts">
	// components
	// stores
	// styles
	import '$styles/global.css';
	import { onMount } from 'svelte';
	import { supabaseClient } from '$lib/supabase/supabase';
	import { invalidateAll } from '$app/navigation';
	// logic
	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidateAll();
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<slot />
