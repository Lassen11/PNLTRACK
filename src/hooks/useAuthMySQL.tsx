import { useState, useEffect, createContext, useContext } from 'react';
import { authService, User } from '@/integrations/mysql/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signUp: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateUser: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем, есть ли сохраненный пользователь в localStorage
    const savedUser = localStorage.getItem('pnltrack_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('pnltrack_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string) => {
    setLoading(true);
    try {
      let user = await authService.getUserByEmail(email);
      
      if (!user) {
        // Если пользователь не существует, создаем его
        user = await authService.createUser(email);
      }
      
      setUser(user);
      localStorage.setItem('pnltrack_user', JSON.stringify(user));
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string) => {
    setLoading(true);
    try {
      // Проверяем, существует ли пользователь
      const existingUser = await authService.getUserByEmail(email);
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
      }
      
      const user = await authService.createUser(email);
      setUser(user);
      localStorage.setItem('pnltrack_user', JSON.stringify(user));
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('pnltrack_user');
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }
    
    try {
      const updatedUser = await authService.updateUser(user.id, updates);
      setUser(updatedUser);
      localStorage.setItem('pnltrack_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
