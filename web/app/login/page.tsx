'use client'

import { StockCard } from "@/components/StockCard"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { SUPABASE_CLIENT, supabaseRequestWrapper } from "@/lib/supabaseClient"
import { FINNHUB_CLIENT, finnhubRequestWrapper } from "@/lib/finnhubClient"
import { useRef, useState, useEffect } from "react"

export default function Home() {

  useEffect(() => {
    const fetchUserInfo = async () => {
      const auth = (await supabaseRequestWrapper(SUPABASE_CLIENT.auth.getUser()))
      userId.current = auth.user.id
      const newUser = !(await supabaseRequestWrapper(SUPABASE_CLIENT.from("selected_stocks").select("stocks").eq("id", userId.current)))[0];
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
  const addStockButtonRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const handleSignOut = async () => {
    const { error } = await SUPABASE_CLIENT.auth.signOut()
    if (!error) router.push('/')
  }

  const handleAddStock = async () => {
    const chosenStock = (await finnhubRequestWrapper(FINNHUB_CLIENT.symbolSearch(addStockButtonRef.current!.value))).result[0]
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
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-balance">Stock Tracker</h1>
              <p className="text-muted-foreground text-balance">Monitor your portfolio performance in real-time</p>
            </div>
            <Button size="lg" className="gap-2 bg-red-400" onClick={handleSignOut}>
              <Minus className="w-5 h-5" />
              Sign out
            </Button>
            <input
                ref={addStockButtonRef}
                id="email"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            <Button
            size="lg"
            className="gap-2"
            onClick={handleAddStock}
            >
              <Plus className="w-5 h-5" />
              Add Stock
            </Button>
          </div>
        </header>
        <div className="grid gap-4"> {stockArray.map((stockSymbol) => (
          <StockCard key={ stockSymbol } stockSymbol={ stockSymbol } stockArray={ stockArray } setStockArray={ setStockArray }/>))}
        </div>
      </div>
    </main>
  )
}