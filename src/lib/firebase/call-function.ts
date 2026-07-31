import { getApp } from "@react-native-firebase/app";
import functions from "@react-native-firebase/functions";

// TODO: match your Cloud Functions region
const REGION = "asia-south1";

export async function callFunction<
  TData = unknown,
  TResult = unknown
>(name: string, data?: TData): Promise<TResult> {
  const fn = functions(getApp()).httpsCallable(name, { timeout: 30_000 });
  // Region is set via functions().useFunctionsEmulator or by deploying to region;
  // for multi-region, prefer namespaced callables or JS SDK.
  void REGION;
  const result = await fn(data);
  return result.data as TResult;
}
