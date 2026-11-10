"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  adminBtnPrimaryClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/form-styles";

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={adminLabelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={12}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${adminInputClass} pr-11`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-text-muted hover:text-primary cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
        >
          {visible ? (
            <Eye className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 12) {
      setError("Password baru minimal 12 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setIsPending(true);
    const { error: changeError } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setIsPending(false);

    if (changeError) {
      setError(
        changeError.message?.includes("password") ||
          changeError.message?.toLowerCase().includes("invalid")
          ? "Password saat ini salah atau password baru tidak valid."
          : "Gagal mengganti password. Coba lagi."
      );
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccess("Password berhasil diganti. Sesi lain telah keluar.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg border border-border bg-surface p-6"
      noValidate
    >
      {error ? (
        <p
          role="alert"
          className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2"
        >
          {error}
        </p>
      ) : null}
      {success ? (
        <p
          role="status"
          className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-md px-3 py-2"
        >
          {success}
        </p>
      ) : null}

      <PasswordField
        id="currentPassword"
        label="Password saat ini"
        value={currentPassword}
        onChange={setCurrentPassword}
        autoComplete="current-password"
      />
      <PasswordField
        id="newPassword"
        label="Password baru (min. 12 karakter)"
        value={newPassword}
        onChange={setNewPassword}
        autoComplete="new-password"
      />
      <PasswordField
        id="confirmPassword"
        label="Ulangi password baru"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
      />

      <button
        type="submit"
        disabled={isPending}
        className={`${adminBtnPrimaryClass} disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {isPending ? "Menyimpan…" : "Ganti password"}
      </button>
    </form>
  );
}
