// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });

    const user = await User.findOne({ email }).lean();
    if (!user) return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });

    const tokenPayload = { id: user._id.toString(), email: user.email, role: user.role, providerId: user.providerId || null };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // return user safe info + token
    const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role, providerId: user.providerId || null };

    return NextResponse.json({ success: true, token, user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
