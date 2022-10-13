import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import * as reactRouterDom from 'react-router-dom';
import './index.css';

// Страница карточки
function CardPage({tasks, createSubTask, deleteSubTask, handleCheck}) {
  const textSubTask = React.useRef('');  // Ссылка на инпут
  const { id } = reactRouterDom.useParams();   // Достаю id текущего таска из пути

  
  const onCreateSubTask = (textSubTask, id) => {
    const textElem = textSubTask.current.value;
    createSubTask(textElem, id);
    
    textSubTask.current.value = '';
  }
  
  const onDeleteSubTask = (idSub, idTask) => {
    deleteSubTask(idSub, idTask);
  }
  
  const onCheck = (e, idSub, idTask) => {
    handleCheck(e, idSub, idTask);
  }
  
  return (
    <div className={'fullCard'}>
      <div className={'body-card'}>
        <p className={'head'}>{tasks.arrayTasks[id].name}</p>
        {tasks.arrayTasks[id].subTasks && tasks.arrayTasks[id].subTasks.map((item, index) => {
            return (
              <div className={'subTask'}>
                <p className={item.check === true ? 'check' : ''}>
                  <input type={'checkbox'} defaultChecked={item.check} onClick={(e) => onCheck(e,index, id)} />
                  {index + 1}. {item.text}
                </p>
                <button className={'cross'} onClick={() => onDeleteSubTask(index, id)}></button>
              </div>
            )
          })
        }
      </div>
      <div className={'buttons'}>
        <input type="text" ref={textSubTask} defaultValue={textSubTask.current.value} />
        <button onClick={() => onCreateSubTask(textSubTask, id)}>new subtask</button>
      </div>
    </div>
  ) 
}

// Подзадача в карточке
function SubTask({sub, idSub, idTask, deleteSubTask}) {
  
  //функция описана в Card (удаление подзадачи)
  const onDeleteSubTask = (idSub, idTask) => {
    deleteSubTask(idSub, idTask);
  }
  
  return (
    <div className={'subTask'}>
      <p className={sub.check == true ? 'check' : ''}>{idSub + 1}. {sub.text}</p>
      <button className={'cross'} onClick={() => onDeleteSubTask(idSub, idTask)}></button>
    </div>
  )
}


// Карточка задачи
function Card({task, id, deleteTask, createSubTask, deleteSubTask}) {
  const textSubTask = React.useRef('');  // ссылка на инпут
  
  // функция описана в App (удаление карточки)
  const onDeleteTask = (id) => {
    deleteTask(id);
  }
  
  // функция описана в App (создание подзадачи)
  const onCreateSubTask = (textSubTask, id) => {
    const textElem = textSubTask.current.value;
    createSubTask(textElem, id);
    
    textSubTask.current.value = '';
  }
  
  return (
    <div className={'card'}>
      <div className={'body-card'}>
         <reactRouterDom.Link to={`/users/${id}`}>
           <p className={'head'}>{task.name}</p>
         </reactRouterDom.Link>
        {task.subTasks && task.subTasks.map((item, index) => {
            return (
              <SubTask 
                sub = {item}
                idSub = {index}
                idTask = {id}
                deleteSubTask={deleteSubTask}
              />
            )
          })
        }
      </div>
      <div className={'buttons'}>
        <input type="text" ref={textSubTask} defaultValue={textSubTask.current.value} />
        <button onClick = {() => onCreateSubTask(textSubTask, id)}>new subtask</button>
        <button onClick = {() => onDeleteTask(id)}>delete Task</button>
      </div>
    </div>
  )
}


function AppY({tasks, allClear, deleteTask, createTask, createSubTask, deleteSubTask}) {
  
  return (
    <React.Fragment>
      <div className={'container'}>
        {tasks.arrayTasks && tasks.arrayTasks.map((item, index) => {
            return (
              <Card
                task={item}
                id = {index}
                deleteTask = {deleteTask}
                createSubTask = {createSubTask}
                deleteSubTask = {deleteSubTask}
                />
            )
          })  
        }
      </div>
      <button onClick={() => createTask()}>Add Task</button>
      <button onClick={() => allClear()}>Delete All Tasks</button>
    </React.Fragment>
  )
}

// Основная функция
function App() {
  // Достаю данные из localStorage или создаю новые
  let task
  if (localStorage.getItem('tasks') == null) {
    task = {name: 'tasks', arrayTasks: []};
    localStorage.setItem('tasks', JSON.stringify(task));
  } else {
    task = JSON.parse(localStorage.getItem('tasks'));
  }


  const [tasks, setTasks] = React.useState(task);
  
  //Для синхронизации localStorage
  const storageEventHandler = () => {
    const synchronized = JSON.parse(localStorage.getItem('tasks'));
    setTasks(synchronized);
  }
  //Подписка на события в localStorage
  React.useEffect(() => {
      window.addEventListener('storage', storageEventHandler, false);
    }, []);
  
  // убирает все task и subtask
  const allClear = () => {
    task = {name: 'tasks', arrayTasks: []};
    localStorage.setItem('tasks', JSON.stringify(task));
    setTasks(task);
  }
  
  // Удаление карточки по id
  const deleteTask = (id) => {
    const newTask = {...tasks};
    newTask.arrayTasks.splice(id, 1);
    localStorage.setItem('tasks', JSON.stringify(newTask));
    setTasks(newTask);
  }

  // Создание новой карточки
  const createTask = () => {
    const newTask = {...tasks};
    newTask.arrayTasks.push({name: `Task ${newTask.arrayTasks.length + 1}`, subTasks: []});
    localStorage.setItem('tasks', JSON.stringify(newTask));
    setTasks(newTask);
  }
  
  // Создание подзадачи
  const createSubTask = (textElem, id) => {
    const newSubTasks = {...tasks};
    newSubTasks.arrayTasks[id].subTasks.push({text: textElem, check: false});
    localStorage.setItem('tasks', JSON.stringify(newSubTasks));
    setTasks(newSubTasks);
  }
  
  // Удаление подзадачи
  const deleteSubTask = (idSub, idTask) => {
    const newSubTasks = {...tasks};
    newSubTasks.arrayTasks[idTask].subTasks.splice(idSub, 1);
    localStorage.setItem('tasks', JSON.stringify(newSubTasks));
    setTasks(newSubTasks);
  }
  
  const handleCheck = (e, idSub, idTask) => {
    const newSubTasks = {...tasks};
    newSubTasks.arrayTasks[idTask].subTasks[idSub].check = e.target.checked;
    localStorage.setItem('tasks', JSON.stringify(newSubTasks));
    setTasks(newSubTasks);
  }
  
  return (
    <React.Fragment>
      <nav>
        <ul>
          <li>
            <reactRouterDom.Link to="/">Main</reactRouterDom.Link>
          </li>
        </ul>
      </nav>
      <reactRouterDom.Routes>
        <reactRouterDom.Route path={'/'} element={<AppY  tasks={tasks} allClear={allClear} deleteTask={deleteTask} createTask={createTask} createSubTask={createSubTask} deleteSubTask={deleteSubTask} />} />
        <reactRouterDom.Route path="users/:id/*" element={<CardPage tasks={tasks} createSubTask={createSubTask} deleteSubTask={deleteSubTask} handleCheck={handleCheck} />} />
      </reactRouterDom.Routes>
    </React.Fragment>
  )
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
    <reactRouterDom.BrowserRouter>
      <App />
    </reactRouterDom.BrowserRouter>
  </React.StrictMode>
);
