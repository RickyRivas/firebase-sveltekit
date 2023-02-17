<script lang="ts">
	// components
	import SubNav from '$lib/components/SubNav.svelte';
	import { page } from '$app/stores';
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
			<form action="?/login" method="POST">
				<input type="email" name="email" placeholder="Email" />
				<input type="password" name="password" placeholder="Password" />
				<button class="btn">Submit</button>
			</form>
		</div>
	</section>
</main>
