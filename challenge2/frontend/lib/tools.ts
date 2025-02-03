export const handleTool = async (toolName: string, parameters: any) => {
  if (toolName === 'search_location') {
    console.log('Handling tool search_location', parameters)
    const { location, search_query } = JSON.parse(parameters)
    // If using the python backend, use the following endpoint:
    //const response = await fetch('http://localhost:8000/search_location', {
    const response = await fetch('/api/search_location', {
      method: 'POST',
      body: JSON.stringify({ location, search_query }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    return data
  }
}

export const tools = [
  {
    type: 'function',
    function: {
      name: 'search_location',
      description: 'Search for a landmark or hotel at a given location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description:
              'The location to search in, in format City, (State), Country'
          },
          search_query: {
            type: 'string',
            description:
              'The query to search for, for example "boutique hotels" or "must-see landmarks"'
          }
        },
        required: ['location', 'search_query'],
        additionalProperties: false
      },
      strict: true
    }
  }
]
