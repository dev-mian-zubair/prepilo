interface Subscription {
  used: number;
  total: number;
}

export async function getSubscriptionMinutes(): Promise<Subscription> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    used: 999,
    total: 1000
  };
} 