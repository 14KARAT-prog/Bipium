import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import * as reactRouterDom from 'react-router-dom';
import './index.css';

// Страница карточки
function CardPage() {
    const textSubTask = React.useRef('');  // Ссылка на инпут
    const { id } = reactRouterDom.useParams();   // Достаю id текущего такса из пути
    const arraySubTasks = localStorage.getItem('arraySubTasks' + id) !== null
        ? JSON.parse(localStorage.getItem('arraySubTasks' + id)) : [];

    const [subTasks, setSubTasks] = React.useState(arraySubTasks);

    const onCreateSub = () => {
        const newSubTasks = [...subTasks];
        const textElem = textSubTask.current.value;
        newSubTasks.push(textElem);
        localStorage.setItem('arraySubTasks' + id, JSON.stringify(newSubTasks));
        setSubTasks(newSubTasks);

        textSubTask.current.value = '';
    }

    const onDeleteSubTask = (index) => {
        const newSubTasks = [...subTasks];
        newSubTasks.splice(index, 1);
        localStorage.setItem('arraySubTasks' + id, JSON.stringify(newSubTasks));
        setSubTasks(newSubTasks);
    }

    return (
        <div className={'fullCard'}>
            <div className={'body-card'}>
                <p className={'head'}>Task {Number(id) + 1}</p>
                {arraySubTasks && arraySubTasks.map((item, index) => {
                    return (
                        <div className={'subTask'}>
                            <p>{index + 1}. {item}</p>
                            <button className={'cross'} onClick={() => onDeleteSubTask(index)}></button>
                        </div>
                    )
                })
                }
            </div>
            <div className={'buttons'}>
                <input type="text" ref={textSubTask} defaultValue={textSubTask.current.value} />
                <button onClick={() => onCreateSub()}>new subtask</button>
            </div>
        </div>
    )
}

// Подзадача в карточке
function SubTask({text, index, deleteSubTask}) {

    // функция описана в Card
    const onDeleteSubTask = (index) => {
        deleteSubTask(index);
    }

    return (
        <div className={'subTask'}>
            <p>{index + 1}. {text}</p>
            <button className={'cross'} onClick={() => onDeleteSubTask(index)}></button>
        </div>
    )
}


// Карточка задачи
function Card({head, id, deleteTask}) {
    const arraySubTasks = localStorage.getItem('arraySubTasks' + id) !== null
        ? JSON.parse(localStorage.getItem('arraySubTasks' + id)) : [];

    const [subTasks, setSubTasks] = React.useState(arraySubTasks);
    const textSubTask = React.useRef('');  // ссылка на инпут

    // функция описана в App
    const onDeleteTask = (index) => {
        deleteTask(index);
    }

    const deleteSubTask = (index) => {
        const newSubTasks = [...subTasks];
        newSubTasks.splice(index, 1);
        localStorage.setItem('arraySubTasks' + id, JSON.stringify(newSubTasks));
        setSubTasks(newSubTasks);
    }

    const onCreateSub = () => {
        const newSubTasks = [...subTasks];
        const textElem = textSubTask.current.value;
        newSubTasks.push(textElem);
        localStorage.setItem('arraySubTasks' + id, JSON.stringify(newSubTasks));
        setSubTasks(newSubTasks);

        textSubTask.current.value = '';
    }

    return (
        <div className={'card'}>
            <div className={'body-card'}>
                <reactRouterDom.Link to={`/users/${id}`}>
                    <p className={'head'}>{head} {id + 1}</p>
                </reactRouterDom.Link>
                {subTasks &&  subTasks.map((item, index) => {
                    return (
                        <SubTask
                            deleteSubTask = {deleteSubTask}
                            index = {index}
                            text = {item}
                        />
                    )
                })
                }
            </div>
            <div className={'buttons'}>
                <input type="text" ref={textSubTask} defaultValue={textSubTask.current.value} />
                <button onClick = {() => onCreateSub()}>new subtask</button>
                <button onClick = {() => onDeleteTask(id)}>delete Task</button>
            </div>
        </div>
    )
}


// Основная функция
function App() {
    const arrayTasks = localStorage.getItem('arrayTasks') !== null
        ? JSON.parse(localStorage.getItem('arrayTasks')) : [];

    const [tasks, setTasks] = React.useState(arrayTasks);

    // Для синхронизации localStorage
    const storageEventHandler = () => {
        const synchronized = JSON.parse(localStorage.getItem('arrayTasks'));
        setTasks(synchronized);
    }
    // Подписка на события в localStorage
    React.useEffect(() => {
        window.addEventListener('storage', storageEventHandler, false);
    }, []);

    // убирает все task и subtask
    const allClear = () => {
        for (let i = 0;i < arrayTasks.length;i++) {
            localStorage.removeItem('arraySubTasks' + i);
        }
        localStorage.removeItem('arrayTasks');
        setTasks([]);
    }

    const deleteTask = (index) => {
        const newTask = [...tasks];
        newTask.splice(index, 1);
        localStorage.setItem('arrayTasks', JSON.stringify(newTask));
        setTasks(newTask);

        localStorage.removeItem('arraySubTasks' + index);
    }

    const createTask = () => {
        const newTask = [...tasks];
        newTask.push('Task');
        localStorage.setItem('arrayTasks', JSON.stringify(newTask));
        setTasks(newTask);
    }

    return (
        <React.Fragment>
            <div className={'container'}>
                {tasks && tasks.map((item, index) => {
                    return (
                        <Card
                            id = {index}
                            head={item}
                            deleteTask = {deleteTask}
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


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <reactRouterDom.BrowserRouter>
            <nav>
                <ul>
                    <li>
                        <reactRouterDom.Link to="/">Main</reactRouterDom.Link>
                    </li>
                </ul>
            </nav>
            <reactRouterDom.Routes>
                <reactRouterDom.Route path={'/'} element={<App />} />
                <reactRouterDom.Route path="users/:id/*" element={<CardPage />} />
            </reactRouterDom.Routes>
        </reactRouterDom.BrowserRouter>
    </React.StrictMode>
);
