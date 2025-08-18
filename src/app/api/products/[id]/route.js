import { supabase } from "../../../lib/supabaseClient"


export async function GET(req) {
    const id = req.params.id
    const { data, error } = await supabase.from('rkcProducts').select('*').eq('id', id).single()
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 404 })
    return new Response(JSON.stringify(data), { status: 200 })
}

export async function PUT(req) {
    const id = req.params.id
    const updates = await req.json()
    const { data, error } = await supabase.from('rkcProducts').update(updates).eq('id', id).select().single()
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    return new Response(JSON.stringify(data), { status: 200 })
}

export async function DELETE(req) {
    const id = req.params.id
    const { error } = await supabase.from('rkcProducts').delete().eq('id', id)
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    return new Response(null, { status: 204 })
}
