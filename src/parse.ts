import { writeTextFile } from "./utils/fs";
import { decodeSubscription } from "./utils/decode-subscription";

export const getVlessSubscriptionNodes = async ({
  subscriptionUrl,
  requestHeaders,
  subscriptionOutputPath,
}: {
  subscriptionUrl: string;
  requestHeaders?: Record<string, string>;
  subscriptionOutputPath?: string;
}) => {
  let response: Response;
  try {
    response = await fetch(subscriptionUrl, {
      headers: requestHeaders,
    });
  } catch (error) {
    console.error(`Failed to fetch subscription from: ${subscriptionUrl}`);
    console.error("Fetch failure reason:", error);
    throw error;
  }
  if (!response.ok) {
    throw new Error(
      `Failed to fetch subscription: ${response.status} ${response.statusText}`,
    );
  }

  const rawData = await response.text();
  const decodedData = decodeSubscription(rawData);
  const nodes = decodedData.split("\n").filter((line) => line.trim() !== "");
  const vlessNodes = nodes.filter((node) => node.startsWith("vless://"));
  if (subscriptionOutputPath) {
    await writeTextFile(subscriptionOutputPath, `${vlessNodes.join("\n")}\n`);
  }

  return vlessNodes;
};
