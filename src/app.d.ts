// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

import type { TypedSupabaseClient } from "@supabase/auth-helpers-sveltekit";


declare global {
	declare namespace App {
		interface Error {
			message: string
		}
		interface Locals {
			sb: TypedSupabaseClient,
			session: Session | null,
			username: any,
			avatar_url: any
		}
		interface PageData {
			session: import("@supabase/supabase-js").Session | null
		}
		// interface Platform {}
	}
	
}
