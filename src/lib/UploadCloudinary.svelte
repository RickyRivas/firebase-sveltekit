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
				const { url } = result.info;
				updateSb(url);
				widget.close();
			}
		};

		async function updateSb(data: any) {
			try {
				const { error } = await supabaseClient
					.from('profiles')
					.update({ avatar_url: data })
					.eq('id', session.user.id);

				if (error) {
					console.log(error);
				}
			} catch (error) {
				if (error instanceof Error) {
					console.log(error);
				}
			}
		}

		widget = window.cloudinary.createUploadWidget(options, processResults);
	}

	function handleClick() {
		if (widget) {
			widget.open();
		}
	}
</script>

<button on:click|preventDefault={handleClick}>Upload</button>
