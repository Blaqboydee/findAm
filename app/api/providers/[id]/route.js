// app/api/providers/[id]/route.js

import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import Provider from '../../../../models/Provider'
import { log } from 'console';

// export async function GET(req, context) {
//   // `context.params` may be a Promise — await it before using
//   const params = await context.params;
//   console.log("Dynamic route hit — params:", params);

//   return NextResponse.json({
//     ok: true,
//     from: "dynamic [id] route",
//     params
//   });
// }


export async function GET(request, context) {
  try {
    await connectDB()

    const params = await context.params;

    const { id } = params

    console.log(id);
    

    // Find provider by ID
    const provider = await Provider.findById(id)

    if (!provider) {
      return NextResponse.json(
        { success: false, error: 'Provider not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, data: provider },
      { status: 200 }
    )
  } catch (error) {
    console.error('Fetch provider error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch provider' },
      { status: 500 }
    )
  }
}