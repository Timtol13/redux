export type ProjectType = {
  id: number,
  name: string,
  type: string,
  description: string,
  peoples_count:number, 
  creator:string,
  users: any[]
}

export type TaskType = {
  id:number,
	name:string,
	description:string,
	executor_id:number,
	creator:number,
	project_id:number,
	status:string,
}