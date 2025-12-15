import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginUser, registerUser, getCurrentUser, setAccessToken, removeAccessToken, getAccessToken } from "@/lib/api";
import { UserCreate, Body_auth_jwt_login_auth_jwt_login_post } from "@/lib/types";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    enabled: !!getAccessToken(), // Only fetch if token exists
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: Body_auth_jwt_login_auth_jwt_login_post) => loginUser(credentials),
    onSuccess: (data) => {
      setAccessToken(data.access_token);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: UserCreate) => registerUser(data),
  });

  const logout = () => {
    removeAccessToken();
    queryClient.setQueryData(["currentUser"], null);
    queryClient.removeQueries({ queryKey: ["currentUser"] });
  };

  return {
    user,
    isLoadingUser,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout,
    isAuthenticated: !!user,
  };
}
