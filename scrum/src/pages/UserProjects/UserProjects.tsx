'use client'

import { useParams } from "next/navigation"
import styles from '@/styles/homePage/home.module.scss'
import { ProjectCard } from "@/widgets/ProjectCard/ProjectCard"
import React, { useEffect, useState } from "react";
import { ProjectsAPI, UsersAPI } from "@/shared/api/api";
import { Input, Modal, Select } from "antd";
import { Option } from "antd/es/mentions";
import Loader from "@/widgets/Loader/Loader";
import { useFormik } from "formik";

export default function UserProjects() {
  const { username } = useParams<any>();
  const [projects, setProjects] = useState<any[]>()
  const [users, setUsers] = useState<any>([]);
  const [modalAddiction, setOpenModaladdiction] = useState(false)
  const [typeProject, setTypeProject] = useState('')
  const [usersProject, setUsersProject] = useState([])
  useEffect(() => {
    ProjectsAPI.getUserProjects(username).then(e => setProjects(e.data))
    UsersAPI.getUsers().then(e => {
      const formattedData = e.data.map((user:any) => ({
        id: user.id,
        value: user.id,
        label: `${user.login}(${user.username} ${user.surname})`
      }));
      localStorage.setItem('username', username)
      setUsers(formattedData);
    });

  }, [username])
  
  const handleOpenModalAddiction = () => setOpenModaladdiction(true)
  const handleCloseModalAddiction = () => setOpenModaladdiction(false)
  const handleAddiction = () => {
    formik.handleSubmit()
    handleCloseModalAddiction()
  }
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    onSubmit: values => {
      ProjectsAPI.postProject({'name': values.name, 'description': values.description, typeProject, usersProject, username, 'peoples_count': usersProject.length})
      .then(async () => ProjectsAPI.getUserProjects(username).then(e => setProjects(e.data)))
    }
  })
  
  const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  return (
    <>
      <div className={`container`}>
        <React.Suspense fallback={<Loader />}>
          <div className={styles.main}>
            {projects?.map((el) => {
              return <ProjectCard item={el}/>
            })}
            <button onClick={() => handleOpenModalAddiction()} className={styles.btnAddiction}>+</button>
          </div>
        </React.Suspense>
      </div>
      <Modal
        open={modalAddiction}
        closable
        onCancel={() => handleCloseModalAddiction()}
        onOk={() => handleAddiction()}
      >
        <form>
          <h1>Создать проект</h1><br />
          <Input placeholder="Название" className={styles.fromChild} {...formik.getFieldProps("name")}/>
          <Select placeholder={'Тип проекта'} className={styles.fromChild} onSelect={e => setTypeProject(e)}>
            <Option key="1" value="work">Рабочий проект</Option>
            <Option key="2" value="personal">Личный проект</Option>
          </Select>
          <Input.TextArea placeholder="Описание" className={styles.fromChild} {...formik.getFieldProps("description")}></Input.TextArea>
          <Select showSearch filterOption={filterOption} mode="tags" className={styles.fromChild} options={users}  onChange={selectedValues => {
            const selectedUsers = users.filter((user:any) => selectedValues.includes(user.value));
            setUsersProject(selectedUsers);
          }}/>
        </form>
      </Modal>
    </>
  )
}
