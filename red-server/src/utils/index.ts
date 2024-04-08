export function logLongString(longString: string): void {
  const chunkSize = 10000
  for (let i = 0; i < longString.length; i += chunkSize) {
    const chunk = longString.substring(i, i + chunkSize)
    console.log(chunk)
  }
}
