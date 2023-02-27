import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    const session = locals.session;

    if (!session) {
     throw redirect(303, '/login')
    }
    
    return {
        session
    }
}


