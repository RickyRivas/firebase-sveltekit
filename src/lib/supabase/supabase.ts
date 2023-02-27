import { createClient } from "@supabase/auth-helpers-sveltekit";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL,  } from '$env/static/public'

export const supabaseClient = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
export type item = {
		id: number;
		severity: string;
		message: string;
}
	
// function sleep(ms: number) {
//         return new Promise((resolve) => setTimeout(resolve, ms))
// }