<script lang="ts">
	import { supabaseClient } from '$lib/supabase/supabase';
	import type { PageData } from './$types';
	// components
	import UploadCloudinary from '$lib/UploadCloudinary.svelte';
	// stores
	// styles
	import '$styles/profile/main.css';
	import { onMount } from 'svelte';
	// logic
	export let data: PageData;
	const { session } = data;

	// account info
	let userName: string | null = null;
	let avatarUrl: string | null = null;
	let userEmail: string | null = session.user.email;

	// upload profile pic
	let url: string;
	let files: FileList;

	async function uploadAvatar() {
		try {
			// checking
			if (!files || files.length === 0) {
				return;
			}

			// upload
			const file = files[0];
			const fileExt = file.name.split('.').pop();
			const filePath = `${session.user.id}-avatar-image.${fileExt}`;

			let { data, error } = await supabaseClient.storage.from('avatars').upload(filePath, file);

			// checking
			if (error) {
				console.log(error);
				return;
			}

			// update avatar url in the DB
			const { error: err } = await supabaseClient
				.from('profiles')
				.update({ avatar_url: data?.path })
				.eq('id', session.user.id);

			if (err) {
				if (err instanceof Error) {
					console.log(err);
				}
			}

			// download
			url = filePath;
			downloadImage(url);
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	}

	async function downloadImage(url: string) {
		try {
			const { data } = await supabaseClient.storage.from('avatars').getPublicUrl(url);
			avatarUrl = data.publicUrl;
		} catch (error) {
			if (error instanceof Error) {
				console.log('error downloading', error.message);
			}
		}
	}

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
			if (error) {
				console.log('getProfile error');
				return;
			}

			// checking
			if (error && status !== 406) throw error;

			// set username & avatar_url
			// urlToUseForSupabaseImgDownload var for TS error
			userName = data.username;

			let { avatar_url } = data;
			if (avatar_url) {
				// download profile pic only if valid avatar_url
				const { data: d } = await supabaseClient.storage.from('avatars').getPublicUrl(avatar_url);
				avatarUrl = d.publicUrl;
			}
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
		<!-- <button on:click={initCropper}>Init Cropper</button> -->
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
						{#if avatarUrl}
							<img src={avatarUrl} alt="" width="300" />
						{/if}
					</div>
					{#if !avatarUrl}
						<input type="file" accept="image/*" name="" bind:files on:change={uploadAvatar} id="" />
					{/if}
					<UploadCloudinary />
				</div>
			</div>

			<form id="profile-logout" action="/login?/logout" method="POST">
				<button class="profile-logout">Logout</button>
			</form>
		</div>

		<!-- -->
	</section>
</main>
