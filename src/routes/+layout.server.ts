import { getServerSession, getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async (event) => {
    const { session, supabaseClient } = await getSupabase(event);

    return {
        session: await getServerSession(event),
        avatarUrl: supabaseClient.from('profiles')
			.select(`avatar_url`)
			.eq('id', session?.user.id)
             .single(),
        username: supabaseClient.from('profiles')
			.select(`username`)
			.eq('id', session?.user.id)
             .single()
    }
}