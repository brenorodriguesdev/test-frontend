export default {
  api: {
    input: 'http://localhost:3000/swagger',
    output: {
      target: './api/generated.ts',
      httpClient: 'fetch',
      client: 'fetch',
      override: {
        mutator: {
          path: './api/custom-fetch.ts',
          name: 'customFetch',
        },
      },
    },
  },
};
