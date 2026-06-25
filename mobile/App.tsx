import './global.css'
import AuthPage from './components/AuthPage'
import PortfolioPage from './components/PortfolioPage'
import { ScrollView, View } from 'react-native'


export default function App() {

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <PortfolioPage/>
      </ScrollView>
    </View>
  )
}