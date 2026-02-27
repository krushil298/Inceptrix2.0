import { create } from 'zustand';
import { UserRole } from '../utils/constants';
import { getSession, getProfile, signOut as authSignOut, UserProfile } from '../services/auth';

interface AuthState {
    user: UserProfile | null;
    session: any | null;
    role: UserRole | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isOnboarded: boolean;

    // Actions
    setUser: (user: UserProfile | null) => void;
    setSession: (session: any) => void;
    setRole: (role: UserRole) => void;
    setOnboarded: (val: boolean) => void;
    initialize: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    session: null,
    role: null,
    isLoading: true,
    isAuthenticated: false,
    isOnboarded: false,

    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setSession: (session) => set({ session }),
    setRole: (role) => set({ role }),
    setOnboarded: (val) => set({ isOnboarded: val }),

    initialize: async () => {
        try {
            set({ isLoading: true });
            const session = await getSession();
            if (session?.user) {
                const profile = await getProfile(session.user.id);
                set({
                    session,
                    user: profile,
                    role: profile?.role || null,
                    isAuthenticated: true,
                    isOnboarded: !!profile?.role,
                });
            }
        } catch (error) {
            console.error('Auth init error:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        await authSignOut();
        set({
            user: null,
            session: null,
            role: null,
            isAuthenticated: false,
            isOnboarded: false,
        });
    },
}));
