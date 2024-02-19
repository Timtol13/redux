import { useFormik } from "formik";
import { tasksAPI } from "./api/api";

export const filterOption = (input: string, option?: { label: string; value: string }) =>
(option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const filterOptionCreate = (input: string, option?: { id:number; value: string; label: string }) =>
(option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const formikCreateTaskFunc = ({projectData, formikExecutor, formikStatus}:any) =>{

return useFormik({
    initialValues:{
      name: '',
      description: '',
      executor_id: 0,
      creator: '',
      project_id: 0,
      status: ''
    },
    onSubmit: values => { 
      values.creator = projectData?.creator
      values.project_id = projectData?.id
      values.executor_id = formikExecutor
      values.status = formikStatus
      tasksAPI.createTask(values)
    }
  })
}