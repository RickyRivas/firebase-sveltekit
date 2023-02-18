<script lang="ts">
	import UploadCloudinary from './../../lib/UploadCloudinary.svelte';
	import { supabaseClient } from '$lib/supabase/supabase';
	import type { PageData } from './$types';
	// components
	// stores
	// styles
	import '$styles/profile/main.css';
	import { onMount } from 'svelte';
	// logic
	export let data: PageData;
	const { session } = data;
	console.log(data);

	// account info
	let userName: string | null = null;
	let avatarUrl: string | null = null;
	let userEmail: string | null = session.user.email;
	let cloudinaryUrl: string | null = null;

	// onmount get account details
	onMount(() => {
		getProfile();
	});

	const getProfile = async () => {
		try {
			const { user } = session;

			const { data, error, status } = await supabaseClient
				.from('profiles')
				.select(`username, avatar_url`)
				.eq('id', user.id)
				.single();

			// checking
			if (error && status !== 406) throw error;

			// set username & avatar_url
			userName = data!.username;
			cloudinaryUrl = data!.avatar_url;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	};

	// update username
	let usernameUpdated = false;
	async function updateUsername() {
		try {
			const { error: err } = await supabaseClient
				.from('profiles')
				.update({ username: `${userName}` })
				.eq('id', session.user.id);

			if (err) {
				console.log('UU error', err);
			}

			// updated indicator
			usernameUpdated = true;
			setTimeout(() => {
				usernameUpdated = false;
			}, 3000);
		} catch (e) {
			if (e instanceof Error) {
				console.log('updateusername func error', e);
			}
		}
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
						class="col-input {usernameUpdated ? 'updated' : ''}"
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
						<img
							src={cloudinaryUrl}
							alt="profile picture for {userName}"
							width="500"
							height="500"
						/>
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
