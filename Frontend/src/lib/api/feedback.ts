'use server';

import { authFetchPOST } from '@/lib/server-action/authFetchPOST';

export async function postFeedback(message: string) {
  await authFetchPOST('/feedback', {
    message: message,
  });
}
