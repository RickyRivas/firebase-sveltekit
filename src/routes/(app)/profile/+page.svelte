<script lang="ts">
	import { fade } from 'svelte/transition';
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

	// update funcs
	let showUpdateModal = false;
	let modalHeading: string | undefined = undefined;
	let newUsername: string | undefined = undefined;
	let newEmail: string | undefined = undefined;
	let newPassword: string | undefined = undefined;

	async function updateUsername() {
		const { error, status } = await supabaseClient
			.from('profiles')
			.update({ username: `${newUsername}` })
			.eq('id', session.user.id);

		if (status !== 204 && error) {
			addToast('FAILED', 'Something went wrong.');
			throw error;
		}

		addToast('SUCCESS', 'Successfully updated.');
	}

	// TODO: update funcs
	async function updateEmail() {
		// const { user, error } = await supabaseClient.auth.updateUser({ email: newEmail });
	}

	async function updatePassword() {
		console.log(newPassword);
	}

	function initUpdateModal(userWantsToUpdate: string) {
		showUpdateModal = true;
		modalHeading = userWantsToUpdate;
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
					<button
						id="edit-email"
						class="edit-btn"
						on:click={() => {
							initUpdateModal('email');
						}}>Edit</button
					>
				</div>
				<div class="item">
					<h2>Username:</h2>
					<input
						class="col-input"
						name="username"
						type="text"
						placeholder={username}
						bind:value={username}
						disabled
					/>
					<button
						id="edit-username"
						class="edit-btn"
						on:click={() => {
							initUpdateModal('username');
						}}>Edit</button
					>
				</div>
				<div class="item">
					<h2>Password:</h2>
					<input class="col-input" name="username" type="text" value="********" disabled />
					<button
						id="edit-username"
						class="edit-btn"
						on:click={() => {
							initUpdateModal('password');
						}}>Edit</button
					>
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

{#if showUpdateModal}
	<div id="modal" transition:fade>
		<div class="container">
			<button
				id="close"
				on:click={() => {
					showUpdateModal = false;
				}}
			>
				<img
					class=""
					src="/close.svg"
					alt=""
					width="25"
					height="25"
					loading="lazy"
					decoding="async"
				/></button
			>
			<h2>Enter new {modalHeading}:</h2>
			<!-- funcs -->
			{#if modalHeading === 'email'}
				<input class="col-input" name="username" bind:value={newEmail} type="email" />
				<button
					id="update-btn"
					on:click={() => {
						showUpdateModal = false;
						updateEmail();
					}}>Update</button
				>
			{:else if modalHeading === 'username'}
				<input class="col-input" name="username" bind:value={newUsername} type="text" />
				<button
					id="update-btn"
					on:click={() => {
						showUpdateModal = false;
						updateUsername();
					}}>Update</button
				>
			{:else if modalHeading === 'password'}
				<input class="col-input" name="username" bind:value={newPassword} type="text" />
				<button
					id="update-btn"
					on:click={() => {
						showUpdateModal = false;
						updatePassword();
					}}>Update</button
				>
			{/if}
		</div>
	</div>
{/if}
