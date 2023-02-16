<script lang="ts">
	// components
	import SubNav from '$lib/components/SubNav.svelte';
	import { pages } from '$lib/config';
	import { page } from '$app/stores';
	// const thisPage = pages.find((p) => p.path === $page.route.id);
	const pageTitle = $page.route.id?.slice(1);
	// stores
	// styles
	import '$styles/login/main.css';
	// logic
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<SubNav {pageTitle} />

<main id="login">
	<section id="login-landing">
		<div class="container">
			<form action="">
				<input type="email" placeholder="Email" />
				<input type="text" placeholder="Password" />
				<button class="btn">Submit</button>
			</form>
		</div>
	</section>
</main>
