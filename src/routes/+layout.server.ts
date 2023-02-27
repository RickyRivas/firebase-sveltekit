import { getServerSession, getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async (event) => {
    const { session, supabaseClient } = await getSupabase(event)

        let avatar_url: string | null = null
        let username: string | null = null
        

    if (session) {   
        // set avatar_url
        const {data, error} = await supabaseClient.from('profiles')
               .select(`avatar_url`)
            .eq('id', session?.user.id)
        
        if (data && !error) {
            avatar_url = data[0].avatar_url
        }
        // set username
        const {data: d, error: e} = await supabaseClient.from('profiles')
               .select(`username`)
            .eq('id', session?.user.id)
        
        if (d && !e) {
            username = d[0].username
        }
    }

    return {
        session: await getServerSession(event),
        user: {
            avatar_url, username
        }
    }
}