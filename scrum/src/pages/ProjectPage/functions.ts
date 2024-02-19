import { tasksAPI } from "@/shared/api/api"

export const handleSetComplited = (id:any) => {
  tasksAPI.setComplited(id)
}
export const handleSetPostponed = (id:any) => {
  tasksAPI.setPostponed(id)
}
export const handleSetInWork = (id:any) => {
  tasksAPI.setInWork(id)
}
export const handleDelete = (id:any) => {
  tasksAPI.delete(id)
}
export const handleUpdateUser = (id:any, newExecutor:any) => {
  tasksAPI.updateUser({id, newExecutor})
}