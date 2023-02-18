<script>
	import { onMount } from 'svelte/internal';

	let widget;

	onMount(() => {
		if ('cloudinary' in window) {
			widget = window.cloudinary.createUploadWidget(
				{
					cloudName: 'detngn1i8',
					uploadPreset: 'ovordrb1'
				},
				(error, result) => {
					console.log(result);
				}
			);
		}
	});

	function handleClick() {
		if (widget) {
			widget.open();
		}
	}
</script>

<button on:click|preventDefault={handleClick}>Upload</button>
