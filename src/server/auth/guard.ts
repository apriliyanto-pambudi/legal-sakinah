import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/**
 * Sumber kebenaran otorisasi admin.
 *
 * Middleware hanya melakukan pemeriksaan optimistik terhadap keberadaan
 * cookie session. Verifikasi sebenarnya dilakukan di sini, dan HARUS
 * dipanggil di baris pertama setiap server action dan setiap halaman admin.
 *
 * cache() = layout + page dalam 1 request hanya hit session sekali.
 */

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export type AdminSession = NonNullable<Awaited<ReturnType<typeof getSession>>>;

/**
 * Pastikan request berasal dari admin aktif.
 * Redirect ke /admin/login bila tidak.
 */
export const requireAdmin = cache(async (): Promise<AdminSession> => {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { role, isActive } = session.user as typeof session.user & {
    role?: string;
    isActive?: boolean;
  };

  if (role !== "admin" || isActive === false) {
    redirect("/admin/login?error=forbidden");
  }

  return session;
});
