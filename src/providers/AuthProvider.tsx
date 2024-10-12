import { account } from "@/appwrite/config";
import { LoginFormType, RegisterFormType } from "@/lib/schema";
import { ID, Models } from "appwrite";
import { createContext, ReactNode, useEffect, useState } from "react";

type Props = { children: ReactNode };

type UseAuthType = Omit<ReturnType<typeof useAuthProvider>, "loading">;

export const AuthContext = createContext<UseAuthType | undefined>(undefined);

function useAuthProvider() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );

  async function loginUser(data: LoginFormType) {
    const { email, password } = data;
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    setUser(user);
  }

  async function logOutUser() {
    await account.deleteSession("current");
    setUser(null);
  }

  async function registerUser(data: RegisterFormType) {
    const { email, password, name } = data;
    await account.create(ID.unique(), email, password, name);
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        const userAccount = await account.get();
        setUser(userAccount);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { loading, user, loginUser, logOutUser, registerUser };
}

export default function AuthProvider({ children }: Props) {
  const { loading, ...rest } = useAuthProvider();

  return (
    <AuthContext.Provider value={rest}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
