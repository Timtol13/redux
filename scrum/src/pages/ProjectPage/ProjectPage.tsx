'use client'

import { ProjectsAPI, UsersAPI, tasksAPI } from '@/shared/api/api'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/ProjectPage/ProjectPage.module.scss'
import { Select, Layout, Modal, Tabs, TabsProps, ConfigProvider, Dropdown, Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider'
import TaskIcon from '@/images/tasks.png'
import Image from 'next/image'
import { handleDelete, handleSetComplited, handleSetInWork, handleSetPostponed, handleUpdateUser } from './functions'

type ProjectType = {
  id: number,
  name: string,
  type: string,
  description: string,
  peoples_count:number, 
  creator:string,
  users: any[]
}

type TaskType = {
  id:number,
	name:string,
	description:string,
	executor_id:number,
	creator:number,
	project_id:number,
	status:string,
}

export default function ProjectPage() {
  const { id } = useParams()
  const [projectData, setProjectData] = useState<ProjectType>()
  const [tasks, setTasks] = useState<TaskType[]>() 
  const [users, setUsers] = useState<any>([]);
  const [usersProject, setUsersProject] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [ updateUserModal, setUpdateUserModal ] = useState(false)
  const [selectedTaskHook, setSelectedTaskHook] = useState<number>()
  let selectedTask = 0
  useEffect(() => {
    ProjectsAPI.getProject(id).then(e => {setProjectData(e.data)})
    UsersAPI.getUsers().then(e => {
      const formattedData = e.data.map((user:any) => ({
        id: user.id,
        value: user.id,
        label: `${user.login}(${user.username} ${user.surname})`
      }));
      setUsers(formattedData);
    });
  }, [])
  useEffect(() => {
    tasksAPI.getTasks(projectData? projectData.id : 0).then(val => setTasks(val.data))
  }, [projectData])
  
  const getUserHandle = (id:number) => {
    return UsersAPI.getUser(id).then(e => e?.data?.login)
  }

  const updateTasks = () => {
    tasksAPI.getTasks(projectData? projectData.id : 0).then((val) => {setTasks(val.data)})
    setItemsHandle()
    window.location.reload()
  }
  const dropDownItems:MenuProps =
  <Menu>
    <Menu.Item key={'1'}>
      <button onClick={() => {handleSetComplited(selectedTask); updateTasks()}}>
        Выполнена
      </button>
    </Menu.Item>
    <Menu.Item key={'2'}>
      <button onClick={() => {handleSetPostponed(selectedTask); updateTasks()}}>
        Отложить
      </button>
    </Menu.Item>
    <Menu.Item key={'3'}>
      <button onClick={() => {handleSetInWork(selectedTask); updateTasks()}}>
        В процессе
      </button>
    </Menu.Item>
    <Menu.Item key={'4'}>
      <button onClick={() => {handleDelete(selectedTask); updateTasks()}}>
        Удалить
      </button>
    </Menu.Item>
    <Menu.Item key={'5'}>
      <button onClick={() => {setUpdateUserModal(true); console.log(selectedTask)}}>
        Сменить исполнител 
      </button>
    </Menu.Item>
  </Menu>

  const [items, setItems] = useState<TabsProps['items']>([])
  const setItemsHandle = () => {
    setItems([
      {
        key: '0',
        label: <h1>Все</h1>,
        children: <div className={styles.taskList}>
          {tasks?.map((el:TaskType) => {
            return <div className={styles.task}  id='task'>
              <Image src={TaskIcon} alt={'task'} width={40}/>
              
              <Dropdown 
              overlay={dropDownItems} 
              placement="bottomLeft" 
              value={el.id} 
              onMouseEnter={(e:any) => {
                setSelectedTaskHook(el.id)
                selectedTask = el.id
              }}>
                <button className={styles.dots}>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                </button>
              </Dropdown>
              <span className={styles.taskInfo}>
                <h1>{el.name}</h1>
                <p>{el.description}</p>
                <h1>Исполнитель: {getUserHandle(el.executor_id)}</h1>
                <h1>Статус: {el.status}</h1>
              </span>
            </div>
          })}
        </div>,
      },
      {
        key: '1',
        label: <h1>В процессе</h1>,
        children: <div className={styles.taskList}>
          {tasks?.filter((item:TaskType) => item.status.toLowerCase() === 'inwork').map((el:TaskType) => {
            return <div className={styles.task}  id='task'>
              <Image src={TaskIcon} alt={'task'} width={40}/>
              
              <Dropdown overlay={dropDownItems} placement="bottomLeft">
                <button className={styles.dots} value={el.id}>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                </button>
              </Dropdown>
              <span className={styles.taskInfo}>
                <h1>{el.name}</h1>
                <p>{el.description}</p>
                <h1>Исполнитель: {getUserHandle(el.executor_id)}</h1>
              </span>
            </div>
          })}
        </div>,
      },
      {
        key: '2',
        label: <h1>Выполнены</h1>,
        children: <div className={styles.taskList}>
        {tasks?.filter((item:TaskType) => item.status.toLowerCase() === 'completed').map((el:TaskType) => {
          return <div className={styles.task}  id='task'>
            <Image src={TaskIcon} alt={'task'} width={40}/>
            
            <Dropdown overlay={dropDownItems} placement="bottomLeft">
              <button className={styles.dots} value={el.id}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
              </button>
            </Dropdown>
            <span className={styles.taskInfo}>
              <h1>{el.name}</h1>
              <p>{el.description}</p>
              <h1>Исполнитель: {getUserHandle(el.executor_id)}</h1>
            </span>
          </div>
        })}
      </div>,
      },
      {
        key: '3',
        label: <h1>Отложены</h1>,
        children: <div className={styles.taskList}>
        {tasks?.filter((item:TaskType) => item.status.toLowerCase() === 'postponed').map((el:TaskType) => {
          return <div className={styles.task}  id='task'>
            <Image src={TaskIcon} alt={'task'} width={40}/>
            <Dropdown overlay={dropDownItems} placement="bottomLeft">
              <button className={styles.dots} value={el.id}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
              </button>
            </Dropdown>
            <span className={styles.taskInfo}>
              <h1>{el.name}</h1>
              <p>{el.description}</p>
              <h1>Исполнитель: {getUserHandle(el.executor_id)}</h1>
            </span>
          </div>
        })}
      </div>,
      },
    ])
  }
  useEffect(() => {
    setItemsHandle()
  }, [tasks])
  

  const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleToggleOpenModal = () => setOpenModal(true);
  const handleToggleCloseModal = () => setOpenModal(false);

  const [ updateUser, setUpdateUser ] = useState()

  const handleOkOnUpdateUser = () => {
    handleUpdateUser(selectedTaskHook, updateUser);
    setUpdateUserModal(false)
    updateTasks();
  }

  return (
    <div className='container' id='container'>
      <ConfigProvider
        theme={{
          components:{
            Tabs:{
              inkBarColor: "#FF8C69",
              itemSelectedColor: "#FF8C69",
              itemActiveColor: "#FF8C69",
              itemHoverColor: "#FF8C6950",
              itemColor: "#fff",
            }
          }
        }}
      >
        <Layout className={styles.projectMain}>
          <Sider width={250} className={styles.siderContainer}>
            <ul className={styles.userList}>
              <li><h1>{projectData?.name}</h1></li>
              <li>
                <h1>Участники</h1>
                <button onClick={() => handleToggleOpenModal()}>+</button>
              </li>
              {projectData?.users.map(el => <li className={styles.element}>{JSON.parse(el).label}</li>)}
            </ul>
          </Sider>
          <Tabs items={items} style={{ width: '100%', color: '#fff' }}   className={styles.tabsMain}></Tabs>
        </Layout>
        <Modal
          open={openModal}
          closable
          onCancel={handleToggleCloseModal}
        >
          <Select style={{ width: '100%', marginTop: '50px' }} showSearch filterOption={filterOption} mode="tags" className={styles.fromChild} options={users}  onChange={selectedValues => {
              const selectedUsers = users.filter((user:any) => selectedValues.includes(user.value));
              setUsersProject(selectedUsers);
            }}/>
        </Modal>
      </ConfigProvider>
      <Modal
        open={updateUserModal}
        closable
        onCancel={() => setUpdateUserModal(false)}
        onOk={() => handleOkOnUpdateUser()}
      >
        <Select style={{ width: '100%', marginTop: '50px' }} showSearch filterOption={filterOption} className={styles.fromChild} options={users}  onChange={selectedValue => {
              setUpdateUser(selectedValue);
            }}/>
      </Modal>
    </div>
  )
}
