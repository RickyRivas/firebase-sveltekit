<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import UploadCloudinary from '$lib/UploadCloudinary.svelte';
	import { supabaseClient } from '$lib/supabase/supabase';
	import type { PageData } from './$types';
	// components
	// stores
	// styles
	import '$styles/profile/main.css';
	import { onMount } from 'svelte';
	import Error from '../+error.svelte';
	// logic
	export let data: PageData;
	const { session } = data;

	// account info
	let userName: string | null = null;
	let avatarUrl: string | null = null;
	let userEmail: string | null = session.user.email;
	let cloudinaryUrl: string | null = session.user.user_metadata.avatar_url;

	// onmount get account details
	onMount(() => {
		getProfile();
	});

	const getProfile = async () => {
		const { user } = session;

		const { data, error, status } = await supabaseClient
			.from('profiles')
			.select(`username, avatar_url`)
			.eq('id', user.id)
			.single();

		// checking
		if (error && status !== 406) {
			throw error;
		} else {
			userName = data!.username;
		}
	};

	// update username
	async function updateUsername() {
		try {
			const { error, status } = await supabaseClient
				.from('profiles')
				.update({ username: `${userName}` })
				.eq('id', session.user.id);

			// if error
			if (status !== 204 && error) {
				addToast('FAILED', 'Something went wrong.');
				throw error;
			}
			// success
			addToast('SUCCESS', 'Successfully updated.');
		} catch (e) {
			if (e instanceof Error) {
				console.log('updateusername func error', e);
			}
		}
	}

	// toast
	interface item {
		id: number;
		severity: string;
		message: string;
	}

	let items: any = [];

	$: if (items.length > 0) {
		const thisItem = items[items.length - 1];
		setTimeout(() => {
			items = items.filter((i: item) => i.id !== thisItem.id);
		}, 3000);
	}

	function addToast(severity: string, message: string) {
		let newItem: item = {
			id: Date.now(),
			severity,
			message
		};
		items = [...items, newItem];
	}
</script>

<main id="profile">
	<section id="profile-landing">
		<h1>Account Settings</h1>
		<div class="container">
			<h2>Login and Security</h2>
			<div class="col">
				<div class="item">
					<h2>Email:</h2>
					<input
						class="col-input"
						name="useremail"
						type="email"
						placeholder={session?.user.email}
						bind:value={userEmail}
						disabled
					/>
				</div>
				<div class="item">
					<h2>Username:</h2>
					<input
						class="col-input"
						name="username"
						type="text"
						placeholder={userName}
						bind:value={userName}
						on:blur={updateUsername}
					/>
				</div>
			</div>
			<h2>Public Information</h2>
			<div class="col">
				<div class="item">
					<h2>Profile Photo</h2>
					<div class="img-container {avatarUrl ? '' : 'none'}">
						{#if session && cloudinaryUrl}
							<img
								src={cloudinaryUrl}
								alt="profile picture for {userName}"
								width="500"
								height="500"
							/>
						{:else if !cloudinaryUrl}
							<img src="/placeholder.jpg" alt="profile picture " width="100" height="100" />
						{/if}
					</div>
					<UploadCloudinary {session} />
				</div>
			</div>

			<form id="profile-logout" action="/login?/logout" method="POST">
				<button class="profile-logout">Logout</button>
			</form>
		</div>

		<!-- -->
	</section>
</main>

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
