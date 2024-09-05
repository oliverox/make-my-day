"use server";
import { Redis } from "@upstash/redis";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function saveToRedis({
  field,
  value,
  redirectUrl,
}: {
  field: string;
  value: string;
  redirectUrl?: string;
}) {
  const { userId } = auth();
  const redis = Redis.fromEnv();
  await redis.hset(`mmd.${userId}`, { [field]: value });
  if (redirectUrl) {
    redirect(redirectUrl);
  }
}
