<script lang="ts">
	// components
	import { page } from '$app/stores';
	// stores
	// styles
	import '$styles/login/main.css';
	// logic
</script>

<main id="login">
	<section id="login-landing">
		<div class="container">
			<div class="graphic" />
			<div class="content">
				<div class="wrapper">
					<h1>Welcome back.</h1>
					<p class="text">Don't have an account? <a href="/register">Click here</a></p>
					<form method="POST" action="?/login">
						<label for="email">Email:</label>
						<input type="email" name="email" placeholder="Email" />
						<label for="password">Password:</label>
						<input type="password" name="password" placeholder="Password" />
						<button class="btn">Login</button>
					</form>
					<p class="divider"><span>Or</span></p>
					<button id="login-google" class="login-btn">
						<img
							class=""
							src="/google.svg"
							alt=""
							width="25"
							height="25"
							loading="lazy"
							decoding="async"
						/>Continue with Google</button
					>
					<button id="login-facebook" class="login-btn">
						<img
							class=""
							src="/facebook.svg"
							alt=""
							width="25"
							height="25"
							loading="lazy"
							decoding="async"
						/>Continue with Facebook</button
					>
					<button id="login-apple" class="login-btn last">
						<img
							class=""
							src="/apple.svg"
							alt=""
							width="25"
							height="25"
							loading="lazy"
							decoding="async"
						/>Continue with Apple</button
					>
				</div>
			</div>
		</div>
	</section>
</main>
