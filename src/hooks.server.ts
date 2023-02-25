import '$lib/supabase/supabase'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
    const { session, supabaseClient } = await getSupabase(event)
    
    event.locals.sb = supabaseClient;
    event.locals.session = session;
    event.locals.username = supabaseClient.from('profiles')
			.select(`username`)
			.eq('id', session?.user.id)
        .single();
    
    event.locals.avatar_url = supabaseClient.from('profiles')
			.select(`avatar_url`)
			.eq('id', session?.user.id)
        .single();
    
    
    return resolve(event)
}