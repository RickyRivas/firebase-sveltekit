<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { supabaseClient } from '$lib/supabase/supabase';
	let widget: any;

	const { session, user } = $page.data;
	export let avatarUrl: string | null = user.avatar_url;

	// extract public id from avatarUrl
	const rawPublicId = avatarUrl?.substring(avatarUrl.length, avatarUrl.indexOf('user_images'));
	const publicId = rawPublicId?.substring(0, rawPublicId.indexOf('.'));

	onMount(async () => {
		getCloudinaryData();
	});

	async function getCloudinaryData() {
		const res = await fetch('/cloud');
		const data = await res.json();

		const options = {
			cloudName: 'detngn1i8',
			apiKey: '935358152857452',
			uploadSignatureTimestamp: data.timestamp,
			uploadSignature: data.signature,
			sources: ['local'],
			folder: 'user_images',
			secure: true,
			multiple: false
		};

		const processResults = async (error: any, result: any) => {
			if (!error && result && result.event === 'success') {
				const url = result.info.secure_url;

				// delete current profile pic from cloudinary only if !avatarUrl
				if (avatarUrl) {
					await deleteFromCloudinary();
				}

				await updateSb(url);

				// close cloudinary upload widget
				widget.close();
			}
		};

		widget = window.cloudinary.createUploadWidget(options, processResults);
	}

	async function updateSb(imgUrl: any) {
		try {
			// 1 update avatar_url in db
			const { error } = await supabaseClient
				.from('profiles')
				.update({ avatar_url: imgUrl })
				.eq('id', session?.user.id);

			if (error) {
				console.log(error);
			}

			// 2 set new session + reload
			const { data: d, error: e } = await supabaseClient.auth.refreshSession();

			if (e) {
				console.log(e);
			}

			window.location.reload();
		} catch (error) {
			if (error instanceof Error) {
				console.log(error);
			}
		}
	}

	async function deleteFromCloudinary() {
		const res = await fetch('/cloud', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(publicId)
		});

		const data = await res.json();

		if (data.status !== 200) {
			console.log(data);
		}
	}

	async function removeAvatar() {
		// clear avatar_url from db
		const { error } = await supabaseClient
			.from('profiles')
			.update({ avatar_url: '' })
			.eq('id', session?.user.id);

		await deleteFromCloudinary();

		// new session
		const { data, error: e } = await supabaseClient.auth.refreshSession();

		if (e) {
			console.log(e);
		}
		// reload
		window.location.reload();
	}

	function handleClick() {
		if (widget) {
			widget.open();
		}
	}
</script>

{#if !avatarUrl}
	<div class="btns">
		<button on:click|preventDefault={handleClick}>Upload</button>
	</div>
{:else}
	<div class="btns">
		<button on:click|preventDefault={handleClick}>Upload</button>
		<button on:click|preventDefault={removeAvatar}>Remove</button>
	</div>
{/if}

<style>
	.btns {
		display: flex;
		flex-direction: column;
		position: absolute;
		justify-content: flex-end;
		top: 1em;
		right: 0;
		width: auto;
	}
	button {
		border: 0;
		font-size: 0.75em;
		text-align: right;
		background-color: transparent;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		color: #c1121f;
	}
	button:nth-child(1) {
		margin-bottom: 0.5em;
	}
</style>
