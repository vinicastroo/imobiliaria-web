export function convertFloatToCurrency(value: string) {
  const valueFormat = parseFloat(value)
  return new Intl.NumberFormat('pt-br', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueFormat)
}
