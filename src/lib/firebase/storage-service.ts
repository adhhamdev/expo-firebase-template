import storage from "@react-native-firebase/storage";

export async function uploadFile(
  path: string,
  localUri: string,
  contentType?: string
): Promise<string> {
  const ref = storage().ref(path);
  await ref.putFile(localUri, contentType ? { contentType } : undefined);
  return ref.getDownloadURL();
}

export async function deleteFile(path: string): Promise<void> {
  await storage().ref(path).delete();
}
