import type { RequestHandler } from "./$types"
import {v2 as cloudinary } from 'cloudinary'
import { SECRET_CLOUD_KEY } from '$env/static/private'
import { PUBLIC_CLOUD_KEY } from '$env/static/public'

const config = cloudinary.config({
    cloud_name: 'detngn1i8',
    api_key: PUBLIC_CLOUD_KEY,
    api_secret: SECRET_CLOUD_KEY,
    secure: true
})

// 
export const GET: RequestHandler = async () => {

    const timestamp = Math.round((new Date).getTime() / 1000);
    
    const signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
    source: 'uw',
    folder: 'user_images'}, SECRET_CLOUD_KEY );

    return new Response(JSON.stringify({signature, timestamp}), {
            status: 200,
        })

}

// delete previous avatar from Cloudinary when user uploads new avatar
export const POST: RequestHandler = async ({ request }) => {
    const public_id = await request.json()

    const { result } = await cloudinary.uploader.destroy(public_id)

    if (result === 'not found') {
          return new Response(JSON.stringify({msg: result}), { status: 400 })
    } else {
        return new Response(JSON.stringify({msg: result }), { status: 200 })
    }
}