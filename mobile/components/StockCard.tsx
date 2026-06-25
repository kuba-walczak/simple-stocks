import { useState, useEffect, useRef } from "react"
import { ChevronDown, TrendingUp, TrendingDown, X } from "lucide-react-native"
import { cn } from "lib/utils"
import { FINNHUB_CLIENT, finnhubRequestWrapper } from "lib/finnhubClient"
import { SUPABASE_CLIENT, supabaseRequestWrapper } from "lib/supabaseClient"
import { View, Text, Pressable, Switch } from "react-native"

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
  }, [stockSymbol]);

  const userId = useRef<string>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [stockInfo, setStockInfo] = useState<stockInterface | null>(null)
  const [isChecked, setIsChecked] = useState(false)

  const handleRemoveStock = async () => {
    setIsChecked(false)
    handleFollowStock(false).then( async () => {
      const newStockArray = stockArray.filter((stockSymbol) => stockSymbol != stockInfo!.symbol)
      setStockArray(newStockArray)
      await SUPABASE_CLIENT.from("selected_stocks").update({ stocks: newStockArray }).eq("id", userId.current)
      console.log("removed ", stockInfo!.symbol)
    })
  }

  const handleFollowStock = async (e: boolean) => {
    setIsChecked(e)
    const followedStocks : string[] = (await supabaseRequestWrapper(SUPABASE_CLIENT.from("selected_stocks").select("following").eq("id", userId.current)))[0].following;
    if (e) {
      const newStockArray = [...followedStocks, stockInfo!.symbol]
      await SUPABASE_CLIENT.from("selected_stocks").update({ following: newStockArray }).eq("id", userId.current)
      console.log("started following", stockInfo!.symbol)
    }
    else {
      const newStockArray = followedStocks.filter((stockSymbol) => stockSymbol !== stockInfo!.symbol)
      await SUPABASE_CLIENT.from("selected_stocks").update({ following: newStockArray }).eq("id", userId.current)
      console.log("stopped following", stockInfo!.symbol)
    }
  }

  if (!stockInfo) return null;
  return (
  <View className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
    <View className="p-5">
      {/* Header with Symbol and Remove Button */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3">
          <View className={cn(
            "w-12 h-12 rounded-full items-center justify-center",
            stockInfo.change >= 0 ? "bg-green-500" : "bg-red-500"
          )}>
            {stockInfo.change >= 0 ? (
              <TrendingUp className="w-6 h-6" color="white" />
            ) : (
              <TrendingDown className="w-6 h-6" color="white" />
            )}
          </View>
          <View>
            <Text className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {stockInfo.symbol}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
              <Text className={cn(
                "text-sm font-bold",
                stockInfo.change >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {stockInfo.change >= 0 ? "+" : ""}
                {stockInfo.change.toFixed(2)}
              </Text>
            <Text className={cn(
              "text-sm font-semibold",
              stockInfo.change >= 0 ? "text-green-400" : "text-red-400"
            )}>
              {stockInfo.change >= 0 ? "+" : ""}
              {stockInfo.percentChange.toFixed(2)}%
            </Text>
          </View>
        </View>
        
        <Pressable
          className="h-10 w-10 rounded-full bg-muted items-center justify-center active:bg-muted/70"
          onPress={handleRemoveStock}
        >
          <X className="w-5 h-5" color="white" />
        </Pressable>
      </View>

      {/* Price Section */}
      <View className="mb-4 py-4 border-y border-border">
        <View className="flex-row items-end justify-between">
          <View>
            <Text className="text-sm text-muted-foreground mb-1 uppercase tracking-wide font-medium">
              Current Price
            </Text>
            <Text className="text-4xl font-bold font-mono tracking-tight text-foreground">
              ${stockInfo.price.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Controls Section */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Switch
            value={isChecked}
            onValueChange={(value) => handleFollowStock(value)}
            trackColor={{ false: '#374151', true: '#10b981' }}
            thumbColor={isChecked ? '#ffffff' : '#9ca3af'}
          />
          <Text className="text-sm font-medium text-foreground">
            {isChecked ? "Following" : "Follow Stock"}
          </Text>
        </View>
        
        <Pressable 
          onPress={() => setIsExpanded(!isExpanded)}
          className="flex-row items-center gap-2 px-4 py-2 rounded-lg border border-border bg-muted active:bg-muted/30"
        >
          <Text className="text-sm font-medium text-foreground">
            {isExpanded ? "Less" : "Details"}
          </Text>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isExpanded && "rotate-180",
            )}
            color="white"
          />
        </Pressable>
      </View>

      {/* Expanded Details */}
      {isExpanded && (
        <View className="mt-4 pt-4 border-t border-border">
          <Text className="text-xs text-muted-foreground uppercase tracking-wide mb-3 font-semibold">
            Daily Range
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1 p-4 rounded-lg bg-muted border border-border">
              <Text className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                Day High
              </Text>
              <Text className="text-xl font-bold font-mono text-green-400">
                ${stockInfo.dayHigh.toFixed(2)}
              </Text>
            </View>
            <View className="flex-1 p-4 rounded-lg bg-muted border border-border">
              <Text className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                Day Low
              </Text>
              <Text className="text-xl font-bold font-mono text-red-400">
                ${stockInfo.dayLow.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  </View>
);

}