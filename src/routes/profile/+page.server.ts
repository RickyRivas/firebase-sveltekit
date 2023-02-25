import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    const session = locals.session;
    const username = locals.username
    const avatar_url = locals.avatar_url

    if (!session) {
     throw redirect(303, '/login')
    }
    
    return {
        session, username, avatar_url
    }
}


