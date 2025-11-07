import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import connectDB from "../../../../lib/mongodb"
import Provider from "../../../../models/Provider"

export async function GET(req) {
  await connectDB()
  const session = await getServerSession(authOptions)

  if (!session) return Response.json({ exists: false })

  const provider = await Provider.findOne({ userId: session.user.id })
  return Response.json({ exists: !!provider })
}
