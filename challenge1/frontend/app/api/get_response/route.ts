import { MODEL } from '@/lib/constants'
import OpenAI from 'openai'
const openai = new OpenAI()

export async function POST(request: Request) {
  const { messages } = await request.json()

  console.log('Incoming messages', messages)

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      // System prompt is already included in the messages array
      messages
    })

    const result = response.choices[0].message
    return new Response(JSON.stringify(result))
  } catch (error: any) {
    console.error('Error in POST handler:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    })
  }
}
