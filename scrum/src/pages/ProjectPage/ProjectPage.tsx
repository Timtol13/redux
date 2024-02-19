'use client'

import { ProjectsAPI, UsersAPI, tasksAPI } from '@/shared/api/api'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/ProjectPage/ProjectPage.module.scss'
import { Select, Layout, Modal, Tabs, TabsProps, ConfigProvider, Dropdown, Menu, MenuProps, Button, Input } from 'antd';
import Sider from 'antd/es/layout/Sider'
import TaskIcon from '@/images/tasks.png'
import Image from 'next/image'
import { handleDelete, handleSetComplited, handleSetInWork, handleSetPostponed, handleUpdateUser } from './functions'
import Link from 'next/link'
import { filterOption, filterOptionCreate, formikCreateTaskFunc } from '@/shared/functions'
import { ProjectType, TaskType } from '@/shared/types'


export default function ProjectPage() {
  const { id } = useParams() as Record<string, string>;
  const [projectData, setProjectData] = useState<ProjectType>()
  const [tasks, setTasks] = useState<TaskType[]>() 
  const [users, setUsers] = useState<any>([]);
  const [usersProject, setUsersProject] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [ updateUserModal, setUpdateUserModal ] = useState(false)
  const [selectedTaskHook, setSelectedTaskHook] = useState<number>()
  const username = localStorage? localStorage.getItem('username'): ''
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

  const handleOkToAddUser = () => {
    ProjectsAPI.updateUserList({id, users: usersProject})
  }

  const dropDownItems = <Menu>
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
      <button onClick={() => {setUpdateUserModal(true)}}>
        Сменить исполнител 
      </button>
    </Menu.Item>
  </Menu>

  const [items, setItems] = useState<TabsProps['items']>([])
  const [selectedTab, setSelectedTab] = useState(0)

  const [formikExecutor, setFormikExecutor] = useState(0)
  const [formikStatus, setFormikStatus] = useState('')

  const formikCreateTask = formikCreateTaskFunc({projectData, formikExecutor, formikStatus})

  const onChangeTabs = (e:any) => {
      setSelectedTab(e);
      const newItems = items && items.map(item => {
          if (item.key === '4') {
              return {
                  ...item,
                  label: e === '4' ? <Button onClick={() => formikCreateTask.handleSubmit()}>Создать задачу</Button> : <h1>Создать задачу</h1>
              };
          }
          return item;
      });
      setItems(newItems);
  }
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
      {
        key: '4',
        label: selectedTab == 3? <Button onClick={() => {}}>Создать задачу</Button> : <h1>Создать задачу</h1>,
        children: 
        <form className={styles.formAddTask}>
          <ConfigProvider
            theme={{
              components:{
                Select:{
                  colorPrimaryHover: '#FF8C69',
                  colorPrimaryActive: '#FF8C69',
                  colorTextPlaceholder: '#FF8C6950',
                  colorBorder: "#00000000"
                },
                Input: {
                  colorTextPlaceholder: '#FF8C6950',
                  colorBorder: "#00000000"
                }
              }
            }}
          >
          <Input 
            placeholder='Название' 
            onChange={(e) => formikCreateTask.setFieldValue('name', e.target.value)}
          />
          <Input.TextArea 
            placeholder='Описание' 
            onChange={(e) => formikCreateTask.setFieldValue('description', e.target.value)}
          />

          <Select style={{ width: '100%' }} placeholder='Исполнитель' showSearch filterOption={filterOptionCreate} className={styles.fromChild} options={projectData?.users?.map(user => JSON.parse(user))}  onChange={selectedValues => {
              setFormikExecutor(selectedValues)
            }}/>
          <Select style={{ width: '100%' }} placeholder='Статус задачи' className={styles.fromChild} options={[
            {
              value: 'inWork', 
              label: 'В процессе'
            },
            {
              value: 'postponed', 
              label: 'Отложена'
            },
            {
              value: 'complited', 
              label: 'Выполнена'
            }
            ]}  onChange={selectedValues => {
              setFormikStatus(selectedValues)
            }}/>
            </ConfigProvider>
        </form>
      }
    ])
  }
  useEffect(() => {
    setItemsHandle()
  }, [tasks])

  const handleToggleOpenModal = () => setOpenModal(true);
  const handleToggleCloseModal = () => setOpenModal(false);

  const [ updateUser, setUpdateUser ] = useState()

  const handleOkOnUpdateUser = () => {
    handleUpdateUser(selectedTaskHook, updateUser);
    setUpdateUserModal(false);
    updateTasks();
  }

  const arrowBack = '<-'

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
              <li> <Link href={`/${username}`}>{arrowBack}</Link> <h1>{projectData?.name}</h1></li>
              <li>
                <h1>Участники</h1>
                <button onClick={() => handleToggleOpenModal()}>+</button>
              </li>
              {projectData?.users.map(el => <li className={styles.element}>{JSON?.parse(el)?.label}</li>)}
            </ul>
          </Sider>
          <Tabs items={items} style={{ width: '100%', color: '#fff', overflow: 'scroll' }} className={styles.tabsMain} onChange={(e:any) => onChangeTabs(e)}></Tabs>
        </Layout>
        <Modal
          open={openModal}
          closable
          onCancel={handleToggleCloseModal}
          onOk={() => handleOkToAddUser()}
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
