export const validateRequiredFields = (data: any, requiredFields: string[]) => {
    for (const requiredField of requiredFields) {
      if (!data[requiredField]) {
        const firstCharacter = requiredField.slice(0, 1).toLocaleUpperCase()
        const rest = requiredField.slice(1, requiredField.length)
        return new Error(`${firstCharacter}${rest} is required`)
      }
    }
}

