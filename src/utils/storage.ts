import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = { TOKEN: 'access_token', USER: 'user' } as const;

export const storage = {
  async getToken(): Promise<string | null> {
    try { return await AsyncStorage.getItem(KEYS.TOKEN); } catch { return null; }
  },
  async setToken(token: string): Promise<void> {
    try { await AsyncStorage.setItem(KEYS.TOKEN, token); } catch {}
  },
  async removeToken(): Promise<void> {
    try { await AsyncStorage.removeItem(KEYS.TOKEN); } catch {}
  },
  async getUser(): Promise<string | null> {
    try { return await AsyncStorage.getItem(KEYS.USER); } catch { return null; }
  },
  async setUser(user: string): Promise<void> {
    try { await AsyncStorage.setItem(KEYS.USER, user); } catch {}
  },
  async removeUser(): Promise<void> {
    try { await AsyncStorage.removeItem(KEYS.USER); } catch {}
  },
  async clear(): Promise<void> {
    try { await AsyncStorage.multiRemove([KEYS.TOKEN, KEYS.USER]); } catch {}
  },
};
