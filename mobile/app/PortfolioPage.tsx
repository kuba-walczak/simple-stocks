import { StockCard } from "components/StockCard"
import { Plus } from "lucide-react-native"
import { SUPABASE_CLIENT, supabaseRequestWrapper } from "lib/supabaseClient"
import { FINNHUB_CLIENT, finnhubRequestWrapper } from "lib/finnhubClient"
import { useRef, useState, useEffect } from "react"
import { View, Text, TextInput, Pressable, ScrollView } from "react-native"
import { useRouter } from "expo-router"

export default function PortfolioPage() {
  const router = useRouter()

  useEffect(() => {
    const fetchUserInfo = async () => {
      const auth = (await supabaseRequestWrapper(SUPABASE_CLIENT.auth.getUser()))
      userId.current = auth.user.id
      const newUser = !((await supabaseRequestWrapper(SUPABASE_CLIENT.from("selected_stocks").select("stocks").eq("id", userId.current)))[0]);
      if (newUser) {
        await SUPABASE_CLIENT.from("selected_stocks").insert([{ id: userId.current, stocks: [], following: []}])
        console.log("new user, creating new entry in selected_stocks")
      }
        setStockArray((await supabaseRequestWrapper(SUPABASE_CLIENT.from("selected_stocks").select("stocks").eq("id", userId.current)))[0].stocks)
    }
    fetchUserInfo()
  }, [])

  const userId = useRef<string>(null)
  const [stockArray, setStockArray] = useState<string[]>([])
  const [selectedStock, setSelectedStock] = useState("")

  const handleSignOut = async () => {
    const { error } = await SUPABASE_CLIENT.auth.signOut()
    if (!error) router.push('/')
  }

  const handleAddStock = async () => {
    const chosenStock = (await finnhubRequestWrapper(FINNHUB_CLIENT.symbolSearch(selectedStock))).result[0]
    if (!chosenStock) return
    if (stockArray.includes(chosenStock.displaySymbol))
        console.log(chosenStock.displaySymbol, " already added")
    else {
        const newStockArray = [...stockArray, chosenStock.displaySymbol]
        setStockArray(newStockArray)
        await SUPABASE_CLIENT.from("selected_stocks").update({ stocks: newStockArray }).eq("id", userId.current)
        console.log("adding ", chosenStock.displaySymbol)
    }
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="min-h-screen bg-background py-16">
        <View className="max-w-7xl mx-4">
          {/* Header Section */}
          <View className="mb-8">
            <View>
              <Text className="text-4xl font-bold mb-2 text-foreground">
                Stock Portfolio
              </Text>
            </View>
            {/* Controls Section */}
            <View className="gap-3 mb-4">
              <View className="flex-row gap-3">
                <TextInput
                  onChangeText={setSelectedStock}
                  placeholder="Search stock symbol..."
                  placeholderTextColor="#64748b"
                  className="flex-1 px-4 py-3 bg-card text-foreground border border-border rounded-lg"
                />
                <Pressable
                  className="px-6 py-3 bg-green-500 rounded-lg items-center justify-center active:opacity-80"
                  onPress={handleAddStock}
                >
                  <Plus className="w-5 h-5 text-white" />
                </Pressable>
              </View>
              <Pressable
                className="w-full py-3 bg-red-500 rounded-lg items-center justify-center active:opacity-80"
                onPress={handleSignOut}
              >
                <Text className="text-white font-semibold">Sign Out</Text>
              </Pressable>
            </View>
          </View>
          {/* Stock Cards Grid */}
          <View className="gap-4">
            {stockArray.map((stockSymbol) => (
              <StockCard
                key={stockSymbol}
                stockSymbol={stockSymbol}
                stockArray={stockArray}
                setStockArray={setStockArray}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

