<script lang="ts">
	import { onMount } from 'svelte';
	import { supabaseClient } from '$lib/supabase/supabase';
	// import { v2 as cloudinary } from 'cloudinary';
	let widget: any;
	export let session: any;

	onMount(() => {
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
			secure: false,
			multiple: false
		};

		const processResults = async (error, result) => {
			if (!error && result && result.event === 'success') {
				console.log(result);
				// delete prev from cloudinary
				const { url } = result.info;
				const { public_id } = result.info;

				// get  current_cloudinary_img_url from db
				const { data, error, status } = await supabaseClient
					.from('profiles')
					.select(`current_cloudinary_img_url`)
					.eq('id', session.user.id)
					.single();

				// TODO: Error handling
				// xx check if current avatar_url is empty
				const previousCloudinaryImgUrl = data?.current_cloudinary_img_url;
				if (session.user.user_metadata.avatar_url) {
					await deleteOldImgFromCloudinary(previousCloudinaryImgUrl);
				}

				await updateSb(url, public_id);

				// close cloudinary upload widget
				widget.close();
			}
		};

		widget = window.cloudinary.createUploadWidget(options, processResults);
	}

	async function updateSb(imgUrl: any, publicId: any) {
		try {
			// 1 update user_metadata - avatar_url
			const { data, error } = await supabaseClient.auth.updateUser({
				data: { avatar_url: imgUrl }
			});

			if (error) {
				console.log(error);
			}
			console.log('Updated user metadata');

			// 1 update current_cloudinary_img_url
			const { error: err } = await supabaseClient
				.from('profiles')
				.update({ current_cloudinary_img_url: publicId })
				.eq('id', session.user.id);

			if (err) {
				console.log(err);
			}
			console.log('Updated current_cloudinary_img_url ');

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

	async function deleteOldImgFromCloudinary(publicid: string) {
		const res = await fetch('/cloud', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(publicid)
		});

		const data = await res.json();

		if (data.status !== 200) {
			console.log(data);
		}
	}

	async function removeAvatar() {
		// clear user_metadata
		const { data, error } = await supabaseClient.auth.updateUser({
			data: { avatar_url: '' }
		});

		// get current_cloudinary_img_url to delete current img from cloudinary
		const {
			data: d,
			error: e,
			status
		} = await supabaseClient
			.from('profiles')
			.select(`current_cloudinary_img_url`)
			.eq('id', session.user.id)
			.single();

		const cciu = d?.current_cloudinary_img_url;
		await deleteOldImgFromCloudinary(cciu);

		// clear current_cloudinary_img_url
		const { error: err } = await supabaseClient
			.from('profiles')
			.update({ current_cloudinary_img_url: '' })
			.eq('id', session.user.id);

		// new session
		const { data: da, error: er } = await supabaseClient.auth.refreshSession();

		if (er) {
			console.log(er);
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

{#if !session.user.user_metadata.avatar_url}
	<button on:click|preventDefault={handleClick}>Upload</button>
{:else}
	<button on:click|preventDefault={handleClick}>Upload</button>
	<button on:click|preventDefault={removeAvatar}>Clear Avatar</button>
{/if}

<style>
	button {
		border: 0;
		padding: 0.5em 2em;
		font-size: 0.6em;
		background-color: #f4f4f4;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
