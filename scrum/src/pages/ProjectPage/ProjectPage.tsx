'use client'

import { ProjectsAPI, UsersAPI } from '@/shared/api/api'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/ProjectPage/ProjectPage.module.scss'
import { Select, Layout, Modal, Tabs, TabsProps } from 'antd';
import Sider from 'antd/es/layout/Sider'

type ProjectType = {
  name: string,
  type: string,
  description: string,
  peoples_count:number, 
  creator:string,
  users: any[]
}

export default function ProjectPage() {
  const { id } = useParams()
  const [projectData, setProjectData] = useState<ProjectType>()
  const [users, setUsers] = useState<any>([]);
  const [usersProject, setUsersProject] = useState([])
  const [openModal, setOpenModal] = useState(false)
  useEffect(() => {
    ProjectsAPI.getProject(id).then(e => setProjectData(e.data))
    UsersAPI.getUsers().then(e => {
      const formattedData = e.data.map((user:any) => ({
        id: user.id,
        value: user.id,
        label: `${user.login}(${user.username} ${user.surname})`
      }));
      setUsers(formattedData);
    });
  }, [])
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'В процессе выполнения',
      children: 'Content of Tab Pane 1',
    },
    {
      key: '2',
      label: 'Выполнены',
      children: 'Content of Tab Pane 2',
    },
    {
      key: '3',
      label: 'Отложены',
      children: 'Content of Tab Pane 3',
    },
  ];  

  const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleToggleOpenModal = () => setOpenModal(true);
  const handleToggleCloseModal = () => setOpenModal(false);

  return (
    <div className='container'>
      <Layout className={styles.projectMain}>
        <Sider width={250} className={styles.siderContainer}>
          <ul className={styles.userList}>
            <li><h1>Участники</h1><button onClick={() => handleToggleOpenModal()}>+</button></li>
            {projectData?.users.map(el => <li>{JSON.parse(el).label}</li>)}
          </ul>
        </Sider>
        <Tabs items={items}>

        </Tabs>
      </Layout>
      <Modal
        open={openModal}
        closable
        onCancel={handleToggleCloseModal}
      >
        <Select showSearch filterOption={filterOption} mode="tags" className={styles.fromChild} options={users}  onChange={selectedValues => {
            const selectedUsers = users.filter((user:any) => selectedValues.includes(user.value));
            setUsersProject(selectedUsers);
          }}/>
      </Modal>
    </div>
  )
}
