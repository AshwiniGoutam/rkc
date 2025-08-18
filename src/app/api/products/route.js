import { NextResponse } from "next/server";
// import cloudinary from "@/lib/cloudinary";
import clientPromise from "../../lib/mongodb";
import cloudinary from "../../lib/cloudinary";

// Get all products
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("rkc"); // change "mydb" to your DB name

    const products = await db
      .collection("products")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Add product
export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const price = formData.get("price");
    const inStock = formData.get("inStock");
    const description = formData.get("description");
    const imageFile = formData.get("productImage");

    let imageUrl = null;
    if (imageFile && imageFile.size) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to cloudinary
      const uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "products" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });

      imageUrl = uploadRes.secure_url;
    }

    const client = await clientPromise;
    const db = client.db("rkc");

    const newProduct = {
      name,
      description,
      price: Number(price),
      inStock: inStock,
      image_url: imageUrl,
      createdAt: new Date(),
    };

    const result = await db.collection("products").insertOne(newProduct);

    return NextResponse.json(
      { success: true, product: result.ops?.[0] || newProduct },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
