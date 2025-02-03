import { getJson } from 'serpapi'

export async function POST(request: Request) {
  const { location, search_query } = await request.json()

  console.log('Search location', location, search_query)

  try {
    const serpApiKey = process.env.SERPAPI_API_KEY
    if (!serpApiKey) {
      throw new Error('SERPAPI_API_KEY is not defined')
    }

    // Search results using SerpAPI
    const response = await getJson({
      engine: 'google',
      q: search_query,
      location: location,
      api_key: serpApiKey,
      limit: 5
    })

    const result = response.organic_results

    console.log('Response', result)
    return new Response(JSON.stringify(result))
  } catch (error: any) {
    console.error('Error in POST handler:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    })
  }
}
