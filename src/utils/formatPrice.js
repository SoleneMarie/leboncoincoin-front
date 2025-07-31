export function formatPrice(value) {
  if (typeof value !== 'number') return value

  // return new Intl.NumberFormat('fr-FR', {
  //   style: 'currency',
  //   currency: 'EUR',
  //   minimumFractionDigits: 0,
  //   maximumFractionDigits: 0,
  // }).format(value)

  const priceStr = String(value)
  let result = ''
  let counter = 0

  for (let i = priceStr.length - 1; i >= 0; i--) {
    result = priceStr[i] + result
    counter++

    if (counter % 3 === 0 && i !== 0) {
      result = ' ' + result
    }
  }

  return result
}
