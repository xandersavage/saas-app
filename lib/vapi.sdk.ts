import Vapi from '@vapi-ai/web';

if (!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN) {
  console.error('NEXT_PUBLIC_VAPI_WEB_TOKEN is not defined in environment variables');
}

export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN || '');
