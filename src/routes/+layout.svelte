<script lang="ts">
	// components
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ToTop from '$lib/components/ToTop.svelte';
	// stores
	// styles
	import '$styles/global.css';
	import { onMount } from 'svelte';
	import { supabaseClient } from '$lib/supabase/supabase';
	import { invalidateAll } from '$app/navigation';
	import type { LayoutData } from './$types';
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

	export let data: LayoutData;
	const avatarUrl = data.avatarUrl.data?.avatar_url;
	const { session } = data;
</script>

<Navigation {avatarUrl} {session} />
<slot />
<Footer />
<ToTop />
