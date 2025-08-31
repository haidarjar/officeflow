'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

import { create_browser_client } from '@/lib/auth_client';

type Profile = {
  id: string;
  full_name: string | null;
  role: 'employee' | 'head' | 'admin';
  department_id: string | null;
};

type AuthCtx = {
  supabase: ReturnType<typeof create_browser_client>;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  sign_out: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => create_browser_client(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // INGFO: Ambil session awal & subscribe perubahan. 🔄
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session ?? null);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => {
      setSession(sess);
      if (!sess) setProfile(null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  // INGFO: Sinkronisasi profile saat session ada. 👤
  useEffect(() => {
    if (!session?.user?.id) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, department_id')
        .eq('id', session.user.id)
        .maybeSingle();
      if (error) {
        toast.error('Gagal memuat profil');
        return;
      }
      if (!cancelled) setProfile(data as Profile);
    })();
    return () => {
      cancelled = true;
    };
  }, [session, supabase]);

  async function sign_out() {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
  }

  const value: AuthCtx = {
    supabase,
    session,
    user: session?.user ?? null,
    profile,
    loading,
    sign_out,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function use_auth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('use_auth must be used within AuthProvider');
  return ctx;
}
