const rawBaseUrl = process.env.STRAPI_URL || '';
const API_TIMEOUT = 10000; // 10 second timeout
const MAX_RETRIES = 2;

const isServer = typeof window === 'undefined';

const normalizedBaseUrl = rawBaseUrl
  .replace(/\/admin\/?$/i, '')
  .replace(/\/+$/, '');

if (!normalizedBaseUrl && isServer) {
  throw new Error('Missing environment variable: STRAPI_URL');
}

function buildUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalizedPath, normalizedBaseUrl);
}

export async function fetchAPI<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!isServer) {
    throw new Error('Strapi API is not accessible from the browser. Falling back to mock data.');
  }
  const url = buildUrl(`/api${path}`);
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          ...options.headers,
        },
        next: { revalidate: 60 }, // ISR: revalidate every 60s
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Don't retry on 4xx errors, only on 5xx or timeouts
        if (response.status >= 500 && attempt < MAX_RETRIES) {
          const delay = Math.pow(2, attempt) * 500; // exponential backoff
          console.warn(
            `[fetchAPI] Strapi returned ${response.status}. Retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        const bodyText = await response.text().catch(() => 'Unable to read response body');
        throw new Error(
          `Strapi API error: ${response.status} ${response.statusText} — ${url}\nResponse body: ${bodyText}`
        );
      }

      return response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Retry on timeout or 5xx errors
      if (
        attempt < MAX_RETRIES &&
        (lastError.name === 'AbortError' || lastError.message.includes('Strapi API error: 5'))
      ) {
        const delay = Math.pow(2, attempt) * 500;
        console.warn(
          `[fetchAPI] Request failed (${lastError.message}). Retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw lastError;
    }
  }

  throw lastError || new Error('Unknown error occurred');
}
