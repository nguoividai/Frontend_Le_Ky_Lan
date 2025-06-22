"use client"

import { useState, useEffect, useMemo } from "react"

interface Token {
  symbol: string
  name: string
  price: number
}

interface UseSwapProps {
  tokens: Token[]
}

export function useSwap({ tokens }: UseSwapProps) {
  const [fromToken, setFromToken] = useState<string>("")
  const [toToken, setToToken] = useState<string>("")
  const [fromAmount, setFromAmount] = useState<string>("")
  const [toAmount, setToAmount] = useState<string>("")
  const [isSwapping, setIsSwapping] = useState(false)

  const exchangeRate = useMemo(() => {
    if (!fromToken || !toToken || tokens.length === 0) return 0

    const fromTokenData = tokens.find((t) => t.symbol === fromToken)
    const toTokenData = tokens.find((t) => t.symbol === toToken)

    if (!fromTokenData || !toTokenData) return 0

    return fromTokenData.price / toTokenData.price
  }, [fromToken, toToken, tokens])

  useEffect(() => {
    if (fromAmount && exchangeRate > 0) {
      const amount = Number.parseFloat(fromAmount)
      if (!isNaN(amount)) {
        setToAmount((amount * exchangeRate).toFixed(6))
      }
    } else {
      setToAmount("")
    }
  }, [fromAmount, exchangeRate])

  const handleFromAmountChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value)
    }
  }

  const handleSwapTokens = () => {
    setIsSwapping(true)
    setTimeout(() => {
      const tempToken = fromToken
      const tempAmount = fromAmount

      setFromToken(toToken)
      setToToken(tempToken)
      setFromAmount(toAmount)
      setIsSwapping(false)
    }, 300)
  }

  const isFormValid = fromToken && toToken && fromAmount && Number.parseFloat(fromAmount) > 0

  return {
    fromToken,
    setFromToken,
    toToken,
    setToToken,
    fromAmount,
    setFromAmount: handleFromAmountChange,
    toAmount,
    exchangeRate,
    isSwapping,
    isFormValid,
    handleSwapTokens,
  }
}
