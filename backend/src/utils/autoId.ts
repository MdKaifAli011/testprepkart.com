// Helper function to get next sequential ID for any collection
export const getNextId = async (payload: any, collection: string): Promise<number> => {
  try {
    const result = await payload.find({
      collection: collection,
      limit: 1,
      sort: '-customId',
    })
    return result.docs.length > 0 ? result.docs[0].customId + 1 : 1
  } catch (_error) {
    return 1
  }
}

// Hook for automatic ID generation
export const autoIdHook = (collectionName: string) => ({
  beforeChange: [
    async ({ data, operation, payload }: any) => {
      if (operation === 'create' && !data.customId) {
        data.customId = await getNextId(payload, collectionName)
      }
    },
  ],
})
