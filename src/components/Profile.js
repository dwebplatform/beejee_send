import { useEffect, useState } from "react";

const TodoTable = ({ todos, allowEdit, updateStatus, editText }) => {
  return (<table className="table" style={{ width: '100%' }}>
    <thead >
      <tr style={{ height: '40px' }}>
        <th>Имя</th>
        <th>e-mail</th>
        <th>текст</th>
        <th>статус </th>
      </tr>
    </thead>
    <tbody>
      {todos.map((todo) => {
        return (<tr key={todo.id}>
          <th>{todo.username}</th>
          <th>{todo.email}</th>
          <th onClick={() => {
            if (!todo.isTextEdited) {
              allowEdit(todo.id, true);
            }
          }} >
            {!todo.isTextEdited && todo.text}
            {todo.isTextEdited && <input value={todo.prevText}
              onChange={(e) => editText(todo.id, e.target.value,"prevText")}
              onBlur={async () => {
                const formData = new FormData();
                formData.append('token', localStorage.getItem('accessToken'))
                const response = await fetch(`https://uxcandy.com/~shapoval/test-task-backend/v2/edit/${todo.id}/?developer=admin`, {
                  method: "POST",
                  body: formData
                });

                const data = await response.json();
                if (data.status === "ok") {
                  editText(todo.id, todo.prevText,"text");
                  allowEdit(todo.id, false);
                } else {
                  alert("Не зарегистрированный пользователь не может редактировать текст ")
                }
              }}
            />}
          </th>
          <th>
            <input type="checkbox"
              checked={(todo.status === 10 || todo.status === 11)}
              onClick={() => {
                let currentStatus = todo.status === 10 || todo.status === 11
                if (currentStatus) {// если была выполнена
                  updateStatus(todo.id, 1);
                } else {// если была не выполнена:
                  updateStatus(todo.id, 11);
                }
              }}/></th>
        </tr>)
      })}
    </tbody>
  </table>)
}
export const Profile = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [todos, setTodos] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [error, setError] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const [isCreateOpen, setIsOpen] = useState(false);

  const [todoCreate, setTodoCreate] = useState({
    username:"",
    email:"",
    text:""
  });
  
  const onTodoCreateChange=(e)=>{
    setTodoCreate(prevTodo=>{
      return {
        ...prevTodo,
        [e.target.name]:e.target.value
      }
    })
  }
  const onTodoCreateSubmit=async(e)=>{
    e.preventDefault();
    console.log(todoCreate);
    const formData = new FormData();
    for(let keyField in todoCreate){
      formData.append(keyField,todoCreate[keyField])
    }
    try{

      const response =await fetch('https://uxcandy.com/~shapoval/test-task-backend/v2/create?developer=admin',{
        method:"POST",
        body: formData
      });
      const data = await response.json();
      if(data.status==="ok"){
        alert("Новый todo успешно создан")
      }
    } catch(err){
      alert("Не удалось создать новый todo");
    }
    }
  useEffect(() => {
    async function getTodos(page, sortField, sortDirection) {
      try {

        let directionParam = '';
        if (sortDirection) {
          directionParam = `&sort_direction=${sortDirection}`
        }

        let sortParam = '';
        if (sortField) {
          sortParam = `&sort_field=${sortField}`
        }

        const response = await fetch(`https://uxcandy.com/~shapoval/test-task-backend/v2?developer=admin&page=${page}${sortParam}${directionParam}`)
        const data = await response.json();

        if (data.status === "ok") {
          setTodos(data.message.tasks.map((item) => {
            return { ...item, isTextEdited: false, prevText: item.text }
          }));
        } else {
          setError({ msg: "Не удалось получить список пользователей" })
        }
      } catch (err) {
        setError({ msg: "Не удалось получить список пользователей" })
      }
    }
    getTodos(currentPage, sortField, sortDirection);
  }, [currentPage, sortField, sortDirection]);
  return (<div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
    <div className="field" style={{display:'flex',alignItems:"center", gap:"1rem"}}>
      <label className="label">создать новый todo:</label>
      <div className="control">
      <input className="checkbox" type="checkbox"
      checked={isCreateOpen}
      onChange={()=>setIsOpen(!isCreateOpen)}/>
      </div>
    </div>
   {isCreateOpen && <form className="form" style={{marginBottom:"1rem"}}
   onSubmit={onTodoCreateSubmit}
   >
      <div className="field">
        <label className="label">username </label>
        <div className="control">
          <input type="text" name="username" className="input" onChange={onTodoCreateChange}  value={todoCreate.username}/>
        </div>
      </div>
      <div className="field">
      <label className="label">email </label>
      <input type="text" name="email" className="input"  onChange={onTodoCreateChange} value={todoCreate.email}/>
      </div>
      <div className="field">
      <label className="label">текст </label>
      <input type="text" name="text" className="input"  onChange={onTodoCreateChange} value={todoCreate.text}/>
      </div>
      <div className="control">
        <button className="button">Добавить</button>
      </div>
    </form>}
    <div className="filter" style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center", marginBottom: "1rem" }}>
      <div className="filter__item select" style={{ width: '320px' }}>
        <select
          style={{ width: '100%' }}
          onChange={(e) => {
            setSortField(e.target.value)
          }}>
          <option value="id">id</option>
          <option value="username">имя пользователя</option>
          <option value="email">email</option>
          <option value="status">статус</option>
        </select>
      </div>
      <div className="filter__item">
        <div className="filter__asc-desc" style={{
          width: '26px',
          height: '26px',
          display: 'flex',
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "50%",
          cursor: "pointer",
          transform: `rotate(${sortDirection === "asc" ? "0deg" : "180deg"})`,
          border: '1px solid #eee'
        }}
          onClick={() => {
            setSortDirection((prevDirection) => { return prevDirection === 'asc' ? 'desc' : 'asc' })
          }}
        >^</div>
      </div>
    </div>
    <div style={{ marginBottom: "2rem" }}>
      <TodoTable
        editText={(todoId, newTextValue,textKey) => {
          setTodos((prevTodos) => {
            return prevTodos.map(todo => {
              return {
                ...todo,
                [textKey]: todo.id === todoId ? newTextValue : todo.text
              }
            })
          })
        }}
        updateStatus={async (todoId, newStatus) => {
          const formData = new FormData();
          formData.append('token', localStorage.getItem('accessToken'))
          const response = await fetch(`https://uxcandy.com/~shapoval/test-task-backend/v2/edit/${todoId}/?developer=admin`, {
            method: "POST",
            body: formData
          });

          const data = await response.json();
          if (data.status === "ok") {
            setTodos((prevTodos) => {
              return prevTodos.map(todo => {
                return {
                  ...todo,
                  status: todo.id === todoId ? newStatus : todo.status
                }
              })
            })
          } else {
            alert("не зарегистрированный пользователь")
          }
        }}
        todos={todos}
        allowEdit={async (todoId, value) => {
          const formData = new FormData();
          formData.append('token', localStorage.getItem('accessToken'))
          const response = await fetch(`https://uxcandy.com/~shapoval/test-task-backend/v2/edit/${todoId}/?developer=admin`, {
            method: "POST",
            body: formData
          });
          const data = await response.json();
          if (data.status === "ok") {
            setTodos((prevTodos) => {
              return prevTodos.map((todo) => {
                return {
                  ...todo,
                  isTextEdited: todo.id === todoId ? value : todo.isTextEdited
                }
              })
            })
          } else {
            alert("не зарегистрированный пользователь")
          }

        }} />
    </div>


    <nav className="pagination" role="navigation" aria-label="pagination" style={{ width: '100%', maxWidth: '600px' }}>
      <button style={{ cursor: "pointer" }} className="pagination-previous is-disabled" title="This is the first page"
        onClick={() => {
          setCurrentPage((p) => p - 1)
        }}
      >Previous</button>
      <button style={{ cursor: "pointer" }} className="pagination-next"
        onClick={() => {
          setCurrentPage((p) => p + 1)
        }}
      >Next page</button>
      <ul className="pagination-list">
        <li>
          <button className="pagination-link is-current" style={{ cursor: "pointer" }} aria-label="Page 1" aria-current="page">{currentPage}</button>
        </li>
        <li>
          <button className="pagination-link" style={{ cursor: "pointer" }} aria-label="Goto page 2"
            onClick={() => setCurrentPage(p => p + 1)}
          >{currentPage + 1}</button>
        </li>
        <li>
          <button className="pagination-link" style={{ cursor: "pointer" }} aria-label="Goto page 3"
            onClick={() => setCurrentPage(p => p + 2)}
          >{currentPage + 2}</button>
        </li>
      </ul>
    </nav>
  </div>)
}