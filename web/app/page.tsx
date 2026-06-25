'use client'

import { SUPABASE_CLIENT } from "@/lib/supabaseClient"
import { useState, useRef } from 'react'
import { useRouter } from "next/navigation"

enum serviceTypeEnum {SIGN_IN, SIGN_UP}

export default function LoginPage() {

  const [serviceType, setServiceType] = useState<serviceTypeEnum>(serviceTypeEnum.SIGN_IN)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleClick = async () => {
    if (serviceType === serviceTypeEnum.SIGN_IN) {
      const {data, error} = await SUPABASE_CLIENT.auth.signInWithPassword({
      email: emailRef.current!.value,
      password: passwordRef.current!.value
      })
      if (error) {
        console.log(error)
      } else if (data.user)
        router.push('/login')
    }
    else {
      const { data, error } = await SUPABASE_CLIENT.auth.signUp({
      email: emailRef.current!.value,
      password: passwordRef.current!.value
      })
      if (error) {
        console.log(error)
      } else if (data.user)
        router.push('/login')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Stock Tracker</h1>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                ref={emailRef}
                id="email"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                ref={passwordRef}
                id="password"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
              onClick={handleClick}
            >
              {serviceType === serviceTypeEnum.SIGN_IN ? 'Sign in' : 'Sign up'}
            </button>
          </div>

          <div className="flex gap-4 mt-6 text-center text-sm text-muted-foreground">
            {serviceType === serviceTypeEnum.SIGN_IN ? 'Don\'t have an account?' : 'Already have an account?'}
            <p
            className="text-primary hover:underline font-medium cursor-pointer"
            onClick={() => serviceType == serviceTypeEnum.SIGN_IN ? setServiceType(serviceTypeEnum.SIGN_UP) : setServiceType(serviceTypeEnum.SIGN_IN)}
            >
              {serviceType === serviceTypeEnum.SIGN_IN ? 'Sign up' : 'Sign in'}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
