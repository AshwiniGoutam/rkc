import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // user ID from login token

    const data = await req.json();

    if (!data.name || !data.streetAddress || !data.products?.length) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const order = {
      ...data,
      userId,
      createdAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db("rkc");
    const result = await db.collection("orders").insertOne(order);

    return NextResponse.json({
      message: "Order placed successfully",
      orderId: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    console.log("Decoded token:", decoded);

    const client = await clientPromise;
    const db = client.db("rkc");

    let orders;

    // ✅ Check username from JWT instead of localStorage
    if (decoded.username === "admin") {
      console.log("Admin detected → fetching all orders");
      orders = await db
        .collection("orders")
        .find({})
        .sort({ createdAt: -1 }) // newest → oldest
        .toArray();
    } else {
      console.log("Normal user:", decoded.username || decoded.email);
      orders = await db
        .collection("orders")
        .find({ username: decoded.username })
        .sort({ createdAt: -1 }) // newest → oldest
        .toArray();
    }

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Something went wrong", details: err.message },
      { status: 500 }
    );
  }
}
