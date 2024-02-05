import axios from "axios";

const instance = axios.create({
  baseURL: 'http://localhost:7653/',
  headers:{
    'Content-Type': 'application/json'
  }
})

export const ProjectsAPI = {
  getUserProjects(login:string){
    return instance.get(`get-all-projects/${login}`)
  },
  getProject(id:any){
    return instance.get(`get-project-by-id/${id}`)
  },
  postProject({name, description, typeProject, usersProject, username, peoples_count}:any){
    return instance.post('create-project', {name, description, typeProject, usersProject, username, peoples_count})
  }
}

export const UsersAPI = {
  getUsers(){
    return instance.get('getUsers')
  },
  getUser(id:number){
    return instance.get(`get-user/${id}`)
  }
}

export const tasksAPI = {
  getTasks(id:number){
    return instance.get(`get-tasks/${id}`)
  },
  setComplited(id:number){
    return instance.put(`set-complited/${id}`)
  },
  setPostponed(id:number){
    return instance.put(`set-postponed/${id}`)
  },
  setInWork(id:number){
    return instance.put(`set-inWork/${id}`)
  },
  delete(id:number){
    return instance.delete(`remove-task/${id}`)
  },
  updateUser({id, newExecutor}:any){
    return instance.put(`update-executor/${id}/${newExecutor}`)
  },
}