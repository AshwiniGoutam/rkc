import { supabaseServer } from "../../lib/supabaseClient"


export async function POST(req) {
    try {
        const { fileName, fileType } = await req.json()

        const { data, error } = await supabaseServer.storage
            .from("rkcProducts")
            .createSignedUploadUrl(fileName)

        if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })
        return new Response(JSON.stringify(data), { status: 200 })
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
}
