import { NextResponse } from "next/server";
import { supabaseServer } from "../../lib/supabaseClient";

// Get all products
export async function GET() {
    const { data, error } = await supabaseServer
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// Add new product
export async function POST(req) {
    try {
        const formData = await req.formData();

        const name = formData.get("name");
        const price = formData.get("price");
        const description = formData.get("description");
        const imageFile = formData.get("productImage");

        let imageUrl = null;

        if (imageFile && imageFile.size) {
            const fileName = `${Date.now()}-${imageFile.name}`;

            const arrayBuffer = await imageFile.arrayBuffer(); // convert to ArrayBuffer
            const buffer = Buffer.from(arrayBuffer);           // convert to Node Buffer

            const { error: uploadError } = await supabaseServer.storage
                .from("product-images")
                .upload(fileName, buffer, { cacheControl: "3600", upsert: false });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabaseServer.storage
                .from("product-images")
                .getPublicUrl(fileName);

            imageUrl = publicUrlData.publicUrl;
        }



        // Insert product into table & return inserted row
        const { data, error } = await supabaseServer
            .from("products")
            .insert([{ name, description, price, image_url: imageUrl }])
            .select(); // ✅ ensures inserted rows are returned

        if (error) throw error;

        return NextResponse.json({ success: true, product: data[0] }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
