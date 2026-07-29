import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

type VerifiedTelegramUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

export function verifyTelegramInitData(
  initData: string
): VerifiedTelegramUser | null {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken || !initData) {
    return null;
  }

  const parameters = new URLSearchParams(initData);
  const receivedHash = parameters.get("hash");

  if (!receivedHash) {
    return null;
  }

  parameters.delete("hash");

  const dataCheckString = Array.from(parameters.entries())
    .sort(([firstKey], [secondKey]) =>
      firstKey.localeCompare(secondKey)
    )
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = createHmac(
    "sha256",
    "WebAppData"
  )
    .update(botToken)
    .digest();

  const calculatedHash = createHmac(
    "sha256",
    secretKey
  )
    .update(dataCheckString)
    .digest("hex");

  const receivedBuffer = Buffer.from(receivedHash, "hex");
  const calculatedBuffer = Buffer.from(
    calculatedHash,
    "hex"
  );

  if (
    receivedBuffer.length !== calculatedBuffer.length ||
    !timingSafeEqual(receivedBuffer, calculatedBuffer)
  ) {
    return null;
  }

  const authDate = Number(parameters.get("auth_date"));

  if (
    !authDate ||
    Date.now() / 1000 - authDate > 60 * 60 * 24
  ) {
    return null;
  }

  const userData = parameters.get("user");

  if (!userData) {
    return null;
  }

  try {
    const user = JSON.parse(userData);

    if (!user?.id) {
      return null;
    }

    return user as VerifiedTelegramUser;
  } catch {
    return null;
  }
}