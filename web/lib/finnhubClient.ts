import { finnhubClient } from "react-finnhub"

const FINNHUB_API_KEY: string | undefined = process.env.NEXT_PUBLIC_FINNHUB_API_KEY

if (!FINNHUB_API_KEY)
    throw new Error('env variables missing')

export const FINNHUB_CLIENT = finnhubClient(FINNHUB_API_KEY)

export async function finnhubRequestWrapper(request: Promise<{ data: any }>) {
  try {
    const { data } = await request;
    return data;
  } catch (err) {
    throw err;
  }
}