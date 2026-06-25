'use client'

import { useState, useEffect, useRef } from "react"
import { ChevronDown, TrendingUp, TrendingDown, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FINNHUB_CLIENT, finnhubRequestWrapper } from "@/lib/finnhubClient"
import { SUPABASE_CLIENT, supabaseRequestWrapper } from "@/lib/supabaseClient"

interface stockInterface {
  symbol: string,
  change: number,
  price: number,
  percentChange: number,
  dayHigh: number,
  dayLow: number
}

export function StockCard({ stockSymbol, stockArray, setStockArray }: { stockSymbol: string; stockArray: string[]; setStockArray: React.Dispatch<React.SetStateAction<string[]>>}) {

  useEffect(() => {
  const fetchQuote = async () => {
    const auth = (await supabaseRequestWrapper(SUPABASE_CLIENT.auth.getUser()))
    userId.current = auth.user.id
    const data = await finnhubRequestWrapper(FINNHUB_CLIENT.quote(stockSymbol));
    setStockInfo({
      symbol: stockSymbol,
      price: data.c,
      change: data.d,
      percentChange: data.dp,
      dayHigh: data.h,
      dayLow: data.l
    })
    const followedStocks = (await supabaseRequestWrapper(SUPABASE_CLIENT.from("selected_stocks").select("following").eq("id", auth.user.id)))[0].following;
    if (followedStocks.includes(stockSymbol))
      setIsChecked(true)
  };
  fetchQuote();
  }, []);

  const userId = useRef<string>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [stockInfo, setStockInfo] = useState<stockInterface | null>(null)
  const [isChecked, setIsChecked] = useState(false)

  const handleRemoveStock = async () => {
    const newStockArray = stockArray.filter((stockSymbol) => stockSymbol != stockInfo!.symbol)
    setStockArray(newStockArray)
    await SUPABASE_CLIENT.from("selected_stocks").update({ stocks: newStockArray }).eq("id", userId)
    console.log("removed ", stockInfo!.symbol)
  }

  const handleFollowStock = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked)
    const followedStocks : string[] = (await supabaseRequestWrapper(SUPABASE_CLIENT.from("selected_stocks").select("following").eq("id", userId)))[0].following;
    if (e.target.checked) {
      const newStockArray = [...followedStocks, stockInfo!.symbol]
      await SUPABASE_CLIENT.from("selected_stocks").update({ following: newStockArray }).eq("id", userId)
      console.log("started following", stockInfo!.symbol)
    }
    else {
      const newStockArray = followedStocks.filter((stockSymbol) => stockSymbol != stockInfo!.symbol)
      await SUPABASE_CLIENT.from("selected_stocks").update({ following: newStockArray }).eq("id", userId)
      console.log("stopped following", stockInfo!.symbol)
    }
  }

  if (!stockInfo) return null;
  return (
    <Card>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold font-mono">{stockInfo.symbol}</h3>
              {stockInfo.change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-primary" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">{stockInfo.symbol}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={handleRemoveStock}
            >
              <X className="w-4 h-4" />
            </Button>
            <label>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => {handleFollowStock(e)}}
      />
      Follow
    </label>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-muted-foreground transition-transform duration-200",
                isExpanded && "rotate-180",
              )}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </div>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="text-3xl font-bold font-mono">${stockInfo.price.toFixed(2)}</div>
          <div
            className={cn(
              "text-sm font-medium flex items-center gap-1",
              stockInfo.change >= 0 ? "text-primary" : "text-destructive",
            )}
          >
            <span>
              {stockInfo.change >= 0 ? "+" : ""}
              {stockInfo.change.toFixed(2)}
            </span>
            <span>
              ({stockInfo.change >= 0 ? "+" : ""}
              {stockInfo.percentChange.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-border pt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Day High</div>
                <div className="text-sm font-semibold">${stockInfo.dayHigh.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Day Low</div>
                <div className="text-sm font-semibold">${stockInfo.dayLow.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}