import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

// ✅ Update Product
export async function PUT(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("rkc"); // 👈 replace with your DB name
    const { id } = params;
    const body = await req.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const result = await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: body.name,
          price: Number(body.price),
          description: body.description,
          inStock: body.inStock === true || body.inStock === "true",
          image_url: body.imageUrl, // keep consistent field naming
        },
      },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: result.value });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}

// ✅ Delete Product
export async function DELETE(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("rkc"); // 👈 replace with your DB name
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const result = await db
      .collection("products")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
