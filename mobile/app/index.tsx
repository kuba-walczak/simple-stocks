import { SUPABASE_CLIENT } from "lib/supabaseClient"
import { useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { useRouter } from 'expo-router'

enum serviceTypeEnum {SIGN_IN, SIGN_UP}

export default function AuthPage() {
  const router = useRouter()
  const [serviceType, setServiceType] = useState<serviceTypeEnum>(serviceTypeEnum.SIGN_IN)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = async () => {
    if (serviceType === serviceTypeEnum.SIGN_IN) {
      const {data, error} = await SUPABASE_CLIENT.auth.signInWithPassword({
      email: email,
      password: password
      })
      if (error) {
        console.log(error)
      } else if (data.user)
        router.push('/PortfolioPage')
    }
    else {
      const { data, error } = await SUPABASE_CLIENT.auth.signUp({
      email: email,
      password: password
      })
      if (error) {
        console.log(error)
      } else if (data.user)
        router.push('/PortfolioPage')
    }
  }

  return (
    <View className="flex-1 justify-center items-center bg-background p-4">
      <View className="w-full max-w-md">
        <View className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <View className="mb-8 items-center">
            <Text className="text-4xl font-bold mb-2 text-foreground">Stock Tracker</Text>
            <Text className="text-sm text-muted-foreground">Manage your portfolio</Text>
          </View>
          <View className="gap-6">
            {/* Email */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Email</Text>
              <TextInput
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#64748b"
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full px-4 py-3 bg-muted text-foreground border border-border rounded-lg"
              />
            </View>
            {/* Password */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Password</Text>
              <TextInput
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#64748b"
                secureTextEntry
                autoCapitalize="none"
                className="w-full px-4 py-3 bg-muted text-foreground border border-border rounded-lg"
              />
            </View>
            {/* Button */}
            <Pressable
              className="w-full py-3.5 bg-primary rounded-lg items-center justify-center mt-2 active:opacity-80"
              onPress={handleClick}
            >
              <Text className="text-primary-foreground font-bold text-base">
                {serviceType === serviceTypeEnum.SIGN_IN ? "Sign in" : "Sign up"}
              </Text>
            </Pressable>
          </View>
          {/* Switch Sign In / Sign Up */}
          <View className="flex-row gap-2 mt-6 justify-center">
            <Text className="text-sm text-muted-foreground">
              {serviceType === serviceTypeEnum.SIGN_IN
                ? "Don't have an account?"
                : "Already have an account?"}
            </Text>
            <Pressable
              onPress={() =>
                setServiceType(
                  serviceType === serviceTypeEnum.SIGN_IN
                    ? serviceTypeEnum.SIGN_UP
                    : serviceTypeEnum.SIGN_IN
                )
              }
            >
              <Text className="text-primary font-semibold">{serviceType === serviceTypeEnum.SIGN_IN ? "Sign up" : "Sign in"}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}