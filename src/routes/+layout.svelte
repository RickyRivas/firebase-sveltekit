<script>
	// components
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ToTop from '$lib/components/ToTop.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase/firebase.client';
	import { authStore } from '$stores/authStore';
	// stores
	// styles
	import '$styles/global.css';
	// logic

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			console.log(user);
			authStore.update((curr) => {
				return { ...curr, isLoading: false, currentUser: user };
			});
		});
	});
</script>

<Navigation />
<slot />
<Footer />
<ToTop />
