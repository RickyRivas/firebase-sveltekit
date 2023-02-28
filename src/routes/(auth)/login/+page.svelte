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
					<p>Forgot your password? <a href="/">Click here</a></p>
				</div>
			</div>
		</div>
	</section>
</main>
