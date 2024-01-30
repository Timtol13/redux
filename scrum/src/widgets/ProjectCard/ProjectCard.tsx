import { Card } from 'antd';
import styles from '@/styles/ProjectCard/ProjectCard.module.scss'
import Image from 'next/image';
import PersonalIcon from '@/images/PersonalIcon.png';
import WorkIcon from '@/images/WorkIcon.png';
import { Fade } from "react-awesome-reveal";

type Item = {
  id: number,
  name: string,
  peoples_count: number,
  creator_id: number,
  description: string,
  type: string,
  login: string
}

type Props = {
  item: Item
}

export const ProjectCard = ({item}:Props) => {
  const creator = `${item.login}`
  return (
    <a className={styles.card} href={`/project/${item.id}`}>
        <Fade>
        <div className={styles.card_wrapper} key={item.id}>
          <div className={styles.card_picture}>
            <Image src={item.type === 'work'? WorkIcon : PersonalIcon} alt='ops'/>
          </div>
          <div className={styles.card_info}>
            <h1>{item.name}</h1>
            <h2>{item.type === 'work'? 'Рабочий' : "Личный"} проект</h2>
            <h2>Количество человек: {item.peoples_count}</h2>
            <h2>Создатель: {creator}</h2>
            <p>{item.description}</p>
          </div>
        </div>
      </Fade>
    </a>
  );
};
