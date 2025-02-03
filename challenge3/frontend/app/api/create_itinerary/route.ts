import { ITINERARY_PROMPT } from '@/lib/constants'
import OpenAI from 'openai'
const openai = new OpenAI()

export async function POST(request: Request) {
  const { stops } = await request.json()

  console.log('Planning itinerary', stops)

  try {
    const response = await openai.chat.completions.create({
      model: 'o1',
      messages: [
        { role: 'system', content: ITINERARY_PROMPT },
        { role: 'user', content: JSON.stringify(stops) }
      ]
    })

    const result = response.choices[0].message.content
    return new Response(JSON.stringify({ itinerary: result }))
  } catch (error: any) {
    console.error('Error in POST handler:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    })
  }
}
