import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email already in use" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    // sanitize role to only allow specific values
    const validRole = role === "provider" ? "provider" : "user";

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: validRole,
    });

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json({ success: true, user: safeUser }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
