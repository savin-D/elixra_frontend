export const getDiscountedPrice = (productOrPrice, discountOverride) => {
  const basePrice = Number(productOrPrice?.price ?? productOrPrice ?? 0)
  const discount = Number(productOrPrice?.discount ?? discountOverride ?? 0)

  if (!Number.isFinite(basePrice)) return 0
  if (!Number.isFinite(discount) || discount <= 0) return basePrice

  return basePrice - (basePrice * discount) / 100
}

export const formatINR = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
