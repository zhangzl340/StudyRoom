// 认证状态管理
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { UserRole} from '@/types/user.types'
import { ILoginRequest } from "@/types/user.types"
export const useAuth = () => {
  const authStore = useAuthStore()

  const isLoggedIn = computed(() => authStore.isAuthenticated)
  const currentUser = computed(() => authStore.user)
  const token = computed(() => authStore.token)
  const loading = computed(() => authStore.loading)
  const error = computed(() => authStore.error)

  const hasRole = (role: UserRole | UserRole[]) => {
    if (!currentUser.value) return false
    
    if (Array.isArray(role)) {
      return role.includes(currentUser.value.role)
    }
    
    return currentUser.value.role === role
  }

  const isAdmin = computed(() => {
    return hasRole([UserRole.ROOM_ADMIN, UserRole.ACADEMIC_ADMIN])
  })

  const isSuperAdmin = computed(() => {
    return hasRole(UserRole.ACADEMIC_ADMIN)
  })

  const isStudent = computed(() => {
    return hasRole(UserRole.STUDENT)
  })

  // 登录
  const login = async (loginData: ILoginRequest) => {
    // console.log('认证状态管理login ', loginData)
    return await authStore.login(loginData)
  }

  // 登出
  const logout = () => {
    authStore.logout()
  }

  // 获取当前用户信息
  const getCurrentUser = async () => {
    return await authStore.getCurrentUser()
  }

  // 更新用户信息
  const updateUserInfo = async (userData: any) => {
    return await authStore.updateUserInfo(userData)
  }

  // 修改密码
  const changePassword = async (changePasswordData: any) => {
    return await authStore.changePassword(changePasswordData)
  }

  return {
    // 状态
    isLoggedIn,
    currentUser,
    token,
    loading,
    error,
    
    // 角色检查
    hasRole,
    isAdmin,
    isSuperAdmin,
    isStudent,
    
    // 操作方法
    login,
    logout,
    getCurrentUser,
    updateUserInfo,
    changePassword
  }
}