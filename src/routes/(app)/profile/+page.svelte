<script lang="ts">
	import type { item } from '$lib/supabase/supabase';
	import UploadCloudinary from '$lib/UploadCloudinary.svelte';
	import { supabaseClient } from '$lib/supabase/supabase';
	import type { PageData } from './$types';
	// components
	import ToastNotifications from '$lib/components/ToastNotifications.svelte';
	// stores
	// styles
	import '$styles/profile/main.css';
	// logic
	export let data: PageData;
	const { session, user } = data;

	// account info
	let username: string | null = user.username;
	let avatarUrl: string | null = user.avatar_url;
	let userEmail: string | null = session.user.email;

	async function updateUsername() {
		const { error, status } = await supabaseClient
			.from('profiles')
			.update({ username: `${username}` })
			.eq('id', session.user.id);

		if (status !== 204 && error) {
			addToast('FAILED', 'Something went wrong.');
			throw error;
		}

		addToast('SUCCESS', 'Successfully updated.');
	}

	// toast notifications
	let toastItems: any = [];

	$: if (toastItems.length > 0) {
		const thisItem = toastItems[toastItems.length - 1];
		setTimeout(() => {
			toastItems = toastItems.filter((i: item) => i.id !== thisItem.id);
		}, 3000);
	}

	function addToast(severity: string, message: string) {
		let newItem: item = {
			id: Date.now(),
			severity,
			message
		};
		toastItems = [...toastItems, newItem];
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
					<button id="edit-email" class="edit-btn">Edit</button>
				</div>
				<div class="item">
					<h2>Username:</h2>
					<input
						class="col-input"
						name="username"
						type="text"
						placeholder={username}
						bind:value={username}
						on:blur={updateUsername}
						disabled
					/>
					<button id="edit-username" class="edit-btn">Edit</button>
				</div>
				<div class="item">
					<h2>Password:</h2>
					<input class="col-input" name="username" type="password" value={username} disabled />
					<button id="edit-username" class="edit-btn">Edit</button>
				</div>
			</div>
			<h2>Public Information</h2>
			<div class="col">
				<div class="item">
					<h2>Profile Photo</h2>
					<div class="img-container {avatarUrl ? '' : 'none'}">
						{#if session && avatarUrl}
							<img src={avatarUrl} alt="profile picture for {username}" width="500" height="500" />
						{:else if !avatarUrl}
							<img src="/placeholder.jpg" alt="profile picture " width="100" height="100" />
						{/if}
					</div>
					<UploadCloudinary />
				</div>
			</div>

			<form id="profile-logout" action="/login?/logout" method="POST">
				<button class="profile-logout">Logout</button>
			</form>
		</div>
	</section>
</main>

<!-- Toast notifications -->
<ToastNotifications items={toastItems} />
