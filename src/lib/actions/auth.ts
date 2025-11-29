"use server"

import { setToken } from "@/lib/utils/cookies"

export async function setAuthToken(token: string) {
  await setToken(token)
}

