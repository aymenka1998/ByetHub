// proxy.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // هذا التعديل يضمن تغطية جميع المسارات التي تحتوي على لغة باستثناء /api
  matcher: ['/', '/(ar|en|fr)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
